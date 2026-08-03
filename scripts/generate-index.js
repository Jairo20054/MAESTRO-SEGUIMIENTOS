const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');

const preferredOrder = [
  'maestro.html',
  'cultura.html',
  'micro-metas.html',
  'estudio-biblico.html',
  'neurociencia.html'
];

const pageMeta = {
  'maestro.html': {
    icon: '◈',
    title: 'Centro Maestro de Crecimiento',
    description: 'Panel unificado de aprendizaje, hábitos, finanzas y proyectos.'
  },
  'cultura.html': {
    icon: '🧠',
    title: 'Proyecto Carácter y Cultura',
    description: 'Cultura, inteligencia, presencia, disciplina digital y vitalidad.'
  },
  'micro-metas.html': {
    icon: '◎',
    title: 'Micro Metas',
    description: 'Sistema para transformar metas grandes en acciones sostenibles.'
  },
  'estudio-biblico.html': {
    icon: '✦',
    title: 'Camino Bíblico',
    description: 'Estudio diario, glosario, reflexiones y seguimiento RVR1960.'
  },
  'neurociencia.html': {
    icon: '🧬',
    title: 'Neurociencia práctica',
    description: 'Cerebro, estrés, hábitos y crecimiento con base científica.'
  }
};

function normalizeFileName(fileName) {
  return fileName.toLowerCase();
}

function toTitle(fileName) {
  const raw = fileName.replace(/\.html$/i, '').replace(/[-_]+/g, ' ');
  return raw
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getPageFiles() {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const unique = new Map();

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!entry.name.toLowerCase().endsWith('.html')) continue;
    if (entry.name.toLowerCase() === 'index.html') continue;

    const normalized = normalizeFileName(entry.name);
    if (!unique.has(normalized)) {
      unique.set(normalized, entry.name);
    }
  }

  const files = Array.from(unique.values());

  files.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(normalizeFileName(a));
    const bIndex = preferredOrder.indexOf(normalizeFileName(b));

    if (aIndex !== -1 || bIndex !== -1) {
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }

    return a.localeCompare(b);
  });

  return files;
}

function buildHtml() {
  const files = getPageFiles();
  const cards = files.map((fileName, index) => {
    const key = normalizeFileName(fileName);
    const meta = pageMeta[key] || {
      icon: '◌',
      title: toTitle(fileName),
      description: 'Archivo HTML disponible en el centro de acceso.'
    };

    const cardClass = index === 0 ? 'card featured' : 'card';

    return `    <a class="${cardClass}" href="${fileName}"><span class="icon">${meta.icon}</span><span><h2>${meta.title}</h2><p>${meta.description}</p></span><span class="arrow">→</span></a>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Centro de acceso a los archivos HTML de MAESTRO-SEGUIMIENTOS.">
  <title>MAESTRO-SEGUIMIENTOS | Centro de archivos</title>
  <style>
    :root{color-scheme:dark;--bg:#07100f;--panel:#0f1d1a;--panel2:#152722;--text:#f5f7f4;--muted:#9eafa9;--line:rgba(255,255,255,.11);--gold:#e6bd68;--green:#55cf91;--blue:#6aa9ff;--shadow:0 24px 70px rgba(0,0,0,.32)}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;background:radial-gradient(circle at 8% 0%,rgba(85,207,145,.15),transparent 34rem),radial-gradient(circle at 95% 0%,rgba(230,189,104,.14),transparent 32rem),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    main{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:54px 0}
    header{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;margin-bottom:28px}
    .eyebrow{color:var(--gold);font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}
    h1{font-size:clamp(36px,6vw,68px);line-height:1;margin:12px 0;letter-spacing:-.055em}
    header p{color:var(--muted);max-width:720px;line-height:1.65;margin:0}
    .status{border:1px solid rgba(85,207,145,.3);background:rgba(85,207,145,.1);color:#a7f3d0;padding:10px 13px;border-radius:999px;font-size:12px;font-weight:800;white-space:nowrap}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}
    .card{position:relative;overflow:hidden;display:grid;grid-template-columns:54px 1fr auto;gap:16px;align-items:center;padding:22px;background:linear-gradient(145deg,rgba(255,255,255,.025),transparent),var(--panel);border:1px solid var(--line);border-radius:23px;color:var(--text);text-decoration:none;box-shadow:var(--shadow);transition:.18s ease}
    .card:hover{transform:translateY(-3px);border-color:rgba(230,189,104,.38);background:var(--panel2)}
    .icon{width:54px;height:54px;border-radius:17px;display:grid;place-items:center;background:var(--panel2);border:1px solid var(--line);font-size:23px}
    .card h2{font-size:17px;margin:0 0 4px}.card p{color:var(--muted);font-size:12px;line-height:1.5;margin:0}.arrow{font-size:23px;color:var(--gold)}
    .card.featured{grid-column:1/-1;background:linear-gradient(135deg,rgba(230,189,104,.13),rgba(85,207,145,.08)),var(--panel)}
    .instructions{margin-top:20px;padding:20px;border:1px solid var(--line);background:var(--panel);border-radius:20px;color:var(--muted);font-size:13px;line-height:1.65}
    .instructions b{color:var(--text)}code{background:var(--panel2);color:var(--gold);padding:3px 7px;border-radius:7px}
    footer{text-align:center;color:var(--muted);font-size:11px;margin-top:26px}
    @media(max-width:760px){header{grid-template-columns:1fr;align-items:start}.grid{grid-template-columns:1fr}.card.featured{grid-column:auto}.card{grid-template-columns:48px 1fr auto;padding:17px}.icon{width:48px;height:48px}}
  </style>
</head>
<body>
<main>
  <header>
    <div><div class="eyebrow">Centro de acceso · Live Server</div><h1>MAESTRO<br>SEGUIMIENTOS</h1><p>Selecciona el sistema que deseas abrir. Cada tarjeta usa la ruta HTML disponible en la carpeta del proyecto y se actualiza automáticamente al agregar un archivo nuevo.</p></div>
    <div class="status">● ${files.length} páginas disponibles</div>
  </header>
  <section class="grid">
${cards}
  </section>
  <aside class="instructions"><b>Para abrir cualquier archivo directamente:</b> en el explorador de VS Code haz clic derecho sobre un archivo terminado en <code>.html</code> y selecciona <b>Open with Live Server</b>. También puedes iniciar Live Server sobre <code>index.html</code> y elegir aquí cualquiera de los sistemas disponibles.</aside>
  <footer>MAESTRO-SEGUIMIENTOS · Puerto configurado: 5500</footer>
</main>
</body>
</html>
`;
}

function generateIndex() {
  fs.writeFileSync(indexPath, buildHtml(), 'utf8');
  console.log(`Index actualizado: ${getPageFiles().length} archivos HTML visibles.`);
}

if (process.argv.includes('--watch')) {
  generateIndex();
  let timer = null;

  fs.watch(rootDir, { persistent: true }, (eventType, fileName) => {
    if (!fileName) return;
    if (!fileName.toLowerCase().endsWith('.html') && fileName.toLowerCase() !== 'index.html') return;

    clearTimeout(timer);
    timer = setTimeout(() => {
      generateIndex();
    }, 300);
  });

  console.log('Modo watch activo. Esperando cambios en archivos .html...');
} else {
  generateIndex();
}
