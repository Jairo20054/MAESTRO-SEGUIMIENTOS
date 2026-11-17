"use client";

import { useEffect, useMemo, useState } from "react";
import { careers, resources, type Career, type Subject } from "./study-data";
import "./study.css";

type CareerId = Career["id"];
type DoneRecord = { date: string; updatedAt: string };
type Session = { id: string; date: string; career: CareerId; semester: number; subject: string; minutes: number; note: string };
type Reminder = { enabled: boolean; time: string; lastSent?: string };
type Stored = { version: 1; checked: Record<string, DoneRecord>; sessions: Session[]; reminders: Reminder };
const STORAGE = "maestro_carreras_estudio_v1";
const empty = (): Stored => ({ version: 1, checked: {}, sessions: [], reminders: { enabled: false, time: "19:00" } });
const localDay = (date = new Date()) => [date.getFullYear(), String(date.getMonth()+1).padStart(2,"0"), String(date.getDate()).padStart(2,"0")].join("-");
const topicKey = (career: CareerId, semester: number, subject: string, topic: number) => [career,semester,subject,topic].join(":");
function validStored(value: unknown): value is Stored {
  if (!value || typeof value !== "object") return false;
  const x = value as Partial<Stored>;
  return x.version === 1 && !!x.checked && typeof x.checked === "object" && !Array.isArray(x.checked) &&
    Array.isArray(x.sessions) && !!x.reminders && typeof x.reminders.time === "string";
}
function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE);
    const obj: unknown = raw ? JSON.parse(raw) : null;
    return validStored(obj) ? obj : empty();
  } catch { return empty(); }
}
function totalTopics(career: Career) { return career.semesters.reduce((n,sem) => n + sem.subjects.reduce((m,sub) => m + sub.topics.length,0),0); }
function notify(title: string, body: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((reg) => reg.showNotification(title,{ body, icon: "/icon.svg", tag: "maestro-estudio" }))
      .catch(() => { new Notification(title,{ body }); });
  } else new Notification(title,{ body });
}

export default function CareerClient() {
  const [careerId,setCareerId] = useState<CareerId>("sistemas");
  const [semesterNumber,setSemesterNumber] = useState(1);
  const [expanded,setExpanded] = useState<string|null>(null);
  const [store,setStore] = useState<Stored>(empty);
  const [loaded,setLoaded] = useState(false);
  const [minutes,setMinutes] = useState("45");
  const [note,setNote] = useState("");
  const [subjectId,setSubjectId] = useState("");
  const [status,setStatus] = useState("");
  const [permission,setPermission] = useState("default");
  const [activeTab,setActiveTab] = useState<"inicio"|"plan"|"hoy"|"mas">("inicio");

  const career = careers.find((x)=>x.id===careerId)!;
  const semester = career.semesters[semesterNumber-1];
  const subjects = semester.subjects;
  const selectedSubject = subjects.find((x)=>x.id===subjectId) ?? subjects[0];

  useEffect(()=>{ setStore(load()); setLoaded(true); if("Notification" in window) setPermission(Notification.permission); },[]);
  useEffect(()=>{ if(loaded) { try{localStorage.setItem(STORAGE,JSON.stringify(store));}catch {setStatus("No se pudo guardar. Exporta un respaldo e inspecciona el espacio disponible.");} } },[store,loaded]);
  useEffect(()=>{ setExpanded(null); setSubjectId(""); },[careerId,semesterNumber]);

  useEffect(()=>{
    if(!loaded || !store.reminders.enabled) return;
    const check=()=>{
      const today=localDay();
      const now = new Date();
      const hhmm=[String(now.getHours()).padStart(2,"0"),String(now.getMinutes()).padStart(2,"0")].join(":");
      if(hhmm!==store.reminders.time || store.reminders.lastSent===today || !("Notification" in window) || Notification.permission!=="granted") return;
      notify("Maestro · Tu estudio de hoy","Revisa tus temas pendientes y registra tu sesión de aprendizaje.");
      setStore((prev)=>({...prev,reminders:{...prev.reminders,lastSent:today}}));
    };
    check();
    const t=window.setInterval(check,30000);
    return ()=>window.clearInterval(t);
  },[loaded,store.reminders.enabled,store.reminders.time,store.reminders.lastSent]);

  const keys = useMemo(()=>{
    const all: string[]=[];
    for(const se of career.semesters) for(const su of se.subjects) su.topics.forEach((_,i)=>all.push(topicKey(careerId,se.number,su.id,i)));
    return all;
  },[career,careerId]);
  const doneTotal=keys.filter(k=>store.checked[k]).length;
  const percent=Math.round(doneTotal / Math.max(1,totalTopics(career))*100);
  const semesterKeys=subjects.flatMap(s=>s.topics.map((_,i)=>topicKey(careerId,semesterNumber,s.id,i)));
  const semesterDone=semesterKeys.filter(k=>store.checked[k]).length;
  const today=localDay();
  const todaysChecks=Object.entries(store.checked).filter(([k,v])=>k.startsWith(careerId+":") && v.date===today);
  const todaysSessions=store.sessions.filter(s=>s.career===careerId && s.date===today);
  const todayMinutes=todaysSessions.reduce((n,s)=>n+s.minutes,0);
  const totalMinutes=store.sessions.filter(s=>s.career===careerId).reduce((n,s)=>n+s.minutes,0);

  function toggle(key: string) {
    setStore(prev=>{
      const checked={...prev.checked};
      if(checked[key]) delete checked[key];
      else checked[key]={date:localDay(),updatedAt:new Date().toISOString()};
      return {...prev,checked};
    });
  }
  function recordSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n=Number(minutes);
    if(!Number.isInteger(n)||n<1||n>720){setStatus("Los minutos deben ser un número entero entre 1 y 720.");return;}
    const s:Session={id:crypto.randomUUID(),date:localDay(),career:careerId,semester:semesterNumber,subject:selectedSubject.id,minutes:n,note:note.slice(0,500)};
    setStore(prev=>({...prev,sessions:[s,...prev.sessions]}));
    setNote("");setStatus("Sesión registrada en este dispositivo.");
  }
  function exportBackup() {
    const file=new Blob([JSON.stringify({...store,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});
    const u=URL.createObjectURL(file);
    const a=document.createElement("a");a.href=u;a.download="maestro-carreras-respaldo-"+localDay()+".json";a.click();
    window.setTimeout(()=>URL.revokeObjectURL(u),1000);
  }
  async function importBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const file=e.target.files?.[0];e.target.value="";
    if(!file) return;
    if(file.size>3_000_000){setStatus("El archivo supera el límite permitido de 3 MB.");return;}
    try {
      const parsed: unknown=JSON.parse(await file.text());
      if(!validStored(parsed)){setStatus("No es un respaldo válido de Carreras versión 1.");return;}
      const incoming=parsed as Stored;
      const recognized=new Set(careers.flatMap(c=>c.semesters.flatMap(se=>se.subjects.flatMap(s=>s.topics.map((_,i)=>topicKey(c.id,se.number,s.id,i))))));
      const safeChecked=Object.fromEntries(Object.entries(incoming.checked).filter(([k,v])=>recognized.has(k)&&v&&typeof v.date==="string"&&typeof v.updatedAt==="string"));
      const safeSessions=incoming.sessions.filter(s=>s && typeof s.id==="string"&&typeof s.date==="string"&&typeof s.note==="string"&&Number.isInteger(s.minutes)&&s.minutes>0&&s.minutes<=720&&(s.career==="sistemas"||s.career==="electronica")&&Number.isInteger(s.semester)&&typeof s.subject==="string").slice(0,10000);
      if(!window.confirm("Se combinarán los datos del respaldo con tu progreso actual, sin borrar los registros existentes. ¿Continuar?"))return;
      setStore(prev=>{
        const ids=new Set(prev.sessions.map(s=>s.id));
        return {...prev,checked:{...safeChecked,...prev.checked},sessions:[...prev.sessions,...safeSessions.filter(s=>!ids.has(s.id))].sort((a,b)=>b.date.localeCompare(a.date))};
      });
      setStatus("Respaldo combinado correctamente. No se eliminaron avances anteriores.");
    } catch {setStatus("No se pudo leer el respaldo.");}
  }
  async function enableNotifications() {
    if(!("Notification" in window)){setStatus("Este navegador no admite notificaciones web.");return;}
    const p=await Notification.requestPermission();
    setPermission(p);
    if(p==="granted"){setStore(prev=>({...prev,reminders:{...prev.reminders,enabled:true}}));notify("Maestro · Avisos activados","Recibirás recordatorios mientras la aplicación esté abierta.");setStatus("Avisos habilitados. Para recordatorios con la aplicación cerrada se necesita Web Push con servidor.");}
    else setStatus("Debes permitir notificaciones desde la configuración de tu navegador.");
  }
  const careerChange=(id:CareerId)=>{setCareerId(id);setSemesterNumber(1);setStatus("");};
  return <main className="study-wrap" id="study-home">
    <div className="study-top"><a href="/" className="study-back"><span className="study-back-chevron" aria-hidden="true">‹</span> Maestro</a><span className="study-pill">Plan de carrera</span></div>
    <header className="study-header"><p className="study-kicker">MAESTRO / FORMACIÓN</p><h1>Tu carrera, tema a tema.</h1><p>Dos planes independientes. Marca lo que realmente estudias, registra las horas y conserva las evidencias. El progreso no se aprueba automáticamente por marcar casillas.</p></header>
    <nav className="study-careers" aria-label="Elegir carrera">
      {careers.map(c=><button key={c.id} className={careerId===c.id?"chosen":""} onClick={()=>careerChange(c.id)} aria-pressed={careerId===c.id}><span>{c.id==="sistemas"?"⌘":"⚡"}</span>{c.name}</button>)}
    </nav>
    <section className="study-mobile-spotlight" aria-label="Accesos rápidos de estudio">
      <div className="study-spotlight-top"><span className="study-spotlight-symbol" aria-hidden="true">{careerId==="sistemas"?"⌘":"⚡"}</span><span>CONTINÚA TU FORMACIÓN</span></div>
      <strong>Semestre {semesterNumber}</strong><p>{semester.name}</p>
      <div className="study-spotlight-actions"><a href="#study-plan" onClick={()=>setActiveTab("plan")}>Ver materias <span aria-hidden="true">↗</span></a><a href="#study-register" onClick={()=>setActiveTab("hoy")}>Registrar hoy</a></div>
    </section>
    <section className="study-overview" id="study-overview" aria-label="Tu avance">
      <div><p>Avance del plan</p><strong>{loaded?percent:"—"}%</strong><small>{doneTotal} de {totalTopics(career)} temas marcados</small></div>
      <div><p>Semestre {semesterNumber}</p><strong>{semesterDone}<span>/{semesterKeys.length}</span></strong><small>Temas del semestre completados</small></div>
      <div><p>Estudio registrado hoy</p><strong>{todayMinutes}<span> min</span></strong><small>{todaysChecks.length} temas marcados hoy</small></div>
      <div><p>Tiempo acumulado</p><strong>{Math.round(totalMinutes/60*10)/10}<span> h</span></strong><small>Solo sesiones registradas aquí</small></div>
    </section>
    <div className="study-layout">
      <section id="study-plan" className="study-plan-panel">
        <div className="study-section-heading"><div><p>Ruta de aprendizaje</p><h2>{career.name}</h2><small>{career.subtitle}</small></div></div>
        <div className="study-semesters" role="group" aria-label="Semestre">{career.semesters.map(se=><button key={se.number} className={semesterNumber===se.number?"active":""} onClick={()=>setSemesterNumber(se.number)}>S{se.number}</button>)}</div>
        <h3 className="study-sem-title">Semestre {semesterNumber} · {semester.name}</h3>
        <div className="study-subjects">{subjects.map((sub:Subject)=>{
          const checked=sub.topics.filter((_,i)=>store.checked[topicKey(careerId,semesterNumber,sub.id,i)]).length;
          const open=expanded===sub.id;
          return <article className="study-subject" key={sub.id}>
            <button className="study-subject-head" aria-expanded={open} onClick={()=>setExpanded(open?null:sub.id)}>
              <span><strong>{sub.title}</strong><small>{sub.hours} h orientativas · {checked}/{sub.topics.length} temas</small></span><span>{open?"−":"+"}</span>
            </button>
            <div className="study-small-track"><span style={{width:checked/sub.topics.length*100+"%"}} /></div>
            {open&&<div className="study-subject-body"><p className="study-topic-label">Contenidos que debes estudiar</p>{sub.topics.map((topic,i)=>{
              const key=topicKey(careerId,semesterNumber,sub.id,i);
              return <label className="study-topic" key={key}><input type="checkbox" checked={!!store.checked[key]} onChange={()=>toggle(key)}/><span>{topic}</span></label>;
            })}<div className="study-practice"><b>Laboratorio / evidencia</b><p>{sub.practice}</p></div></div>}
          </article>;
        })}</div>
      </section>
      <aside className="study-sidebar">
        <section className="study-panel" id="study-register"><p className="study-panel-label">Registro diario</p><h2>¿Qué estudiaste hoy?</h2>
          <form onSubmit={recordSession} className="study-form">
            <label>Materia<select value={selectedSubject.id} onChange={e=>setSubjectId(e.target.value)}>{subjects.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
            <label>Minutos dedicados<input type="number" min="1" max="720" value={minutes} onChange={e=>setMinutes(e.target.value)} required/></label>
            <label>Qué realizaste / qué te costó<textarea rows={3} maxLength={500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Ejercicio, lectura, código, dificultades..."/></label>
            <button type="submit" className="study-primary">Guardar sesión de hoy</button>
          </form>
          <div className="study-today"><b>Actividad de hoy · {today}</b>{todaysSessions.length===0&&todaysChecks.length===0?<p>Sin registros aún. Marca un tema o guarda una sesión.</p>:<>
            {todaysSessions.slice(0,5).map(s=><p key={s.id}>{s.minutes} min · {career.semesters[s.semester-1]?.subjects.find(x=>x.id===s.subject)?.title ?? "Materia"}{s.note?" — "+s.note:""}</p>)}
            {todaysChecks.length>0&&<p>✓ {todaysChecks.length} tema(s) marcados hoy</p>}
          </>}</div>
        </section>
        <section className="study-panel" id="study-settings"><p className="study-panel-label">Avisos del teléfono</p><h2>Recordatorio de estudio</h2>
          <p className="study-muted">Se puede activar un aviso a una hora elegida mientras la aplicación esté abierta. Los avisos garantizados con la aplicación cerrada requieren Web Push y servidor.</p>
          <label className="study-time-label">Hora local <input type="time" value={store.reminders.time} onChange={e=>setStore(prev=>({...prev,reminders:{...prev.reminders,time:e.target.value}}))}/></label>
          {permission==="granted" ? <label className="study-toggle"><input type="checkbox" checked={store.reminders.enabled} onChange={e=>setStore(prev=>({...prev,reminders:{...prev.reminders,enabled:e.target.checked}}))}/> Recordatorios activados</label>: <button className="study-secondary" onClick={enableNotifications}>Activar notificaciones</button>}
          {permission==="granted"&&<button className="study-secondary" onClick={()=>notify("Maestro · Prueba","Las notificaciones de estudio están funcionando.")}>Probar notificación</button>}
        </section>
        <section className="study-panel"><p className="study-panel-label">Protección de datos</p><h2>Respalda tus avances</h2>
          <p className="study-muted">Tus nuevos registros se guardan en este navegador y no modifican los datos de otros sistemas. Exporta una copia antes de cambiar de teléfono o borrar el navegador.</p>
          <button className="study-secondary" onClick={exportBackup}>Descargar respaldo JSON</button>
          <label className="study-import">Importar y combinar respaldo<input type="file" accept=".json,application/json" onChange={importBackup}/></label>
        </section>
        <section className="study-panel"><p className="study-panel-label">Biblioteca abierta</p><h2>Recursos para profundizar</h2>
          <div className="study-links">{resources[careerId].map(r=><a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">{r.label} ↗</a>)}</div>
        </section>
      </aside>
    </div>
    <nav className="study-mobile-dock" aria-label="Navegación inferior del plan de carrera">
      <a href="#study-home" className={activeTab==="inicio"?"active":""} onClick={()=>setActiveTab("inicio")} aria-label="Ir al inicio"><span aria-hidden="true">⌂</span><small>Inicio</small></a>
      <a href="#study-plan" className={activeTab==="plan"?"active":""} onClick={()=>setActiveTab("plan")} aria-label="Ver las materias"><span aria-hidden="true">▦</span><small>Materias</small></a>
      <a href="#study-register" className={activeTab==="hoy"?"active":""} onClick={()=>setActiveTab("hoy")} aria-label="Registrar estudio de hoy"><span aria-hidden="true">◷</span><small>Hoy</small></a>
      <a href="#study-settings" className={activeTab==="mas"?"active":""} onClick={()=>setActiveTab("mas")} aria-label="Ir a los ajustes y notificaciones"><span aria-hidden="true">⚙</span><small>Ajustes</small></a>
    </nav>
    {status&&<div className="study-toast" role="status">{status}<button onClick={()=>setStatus("")} aria-label="Cerrar mensaje">×</button></div>}
    <footer className="study-footer">MAESTRO · Progreso independiente por carrera · Actualización no destructiva · Los tiempos son orientativos, no acreditaciones universitarias.</footer>
  </main>;
}
