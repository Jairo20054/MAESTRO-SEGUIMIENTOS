export type Subject = { id: string; title: string; hours: number; topics: string[]; practice: string };
export type Semester = { number: number; name: string; subjects: Subject[] };
export type Career = { id: "sistemas" | "electronica"; name: string; subtitle: string; semesters: Semester[] };

const s = (id: string, title: string, hours: number, topics: string[], practice: string): Subject => ({ id, title, hours, topics, practice });
const sem = (number: number, name: string, subjects: Subject[]): Semester => ({ number, name, subjects });
export const careers: Career[] = [
  {
    id: "sistemas", name: "Ingeniería de Sistemas y Software", subtitle: "Programa autodidacta 2026 · 10 semestres · 4.800 horas orientativas",
    semesters: [
      sem(1,"Fundamentos computacionales",[
        s("si1b1","Sistemas y pensamiento computacional",14,["Teoría de sistemas y responsabilidades","Entradas, procesos, salidas y límites","Descomposición, abstracción y patrones","Algoritmos, pseudocódigo y pruebas de escritorio"],"Diseñar sin código un sistema de préstamo de computadores con tres casos de prueba"),
        s("si1b2","Variables y tipos de datos",28,["Variables, tipos y conversiones","Expresiones y operaciones","Entradas, salidas y validaciones","Primer programa Python ejecutado"],"Programa de parqueadero con tarifas y entradas inválidas"),
        s("si1b3","Condicionales, ciclos y funciones",56,["Comparaciones, lógica y condicionales","for, while, contadores y acumuladores","Funciones, parámetros y retornos","Trazas, pruebas y depuración"],"Inventario de una tienda con validaciones, ciclos y funciones"),
        s("si1b4","Estructuras de datos",28,["Listas, diccionarios y búsquedas","Pilas y colas","Árboles y grafos iniciales","Big O y comparación de estrategias"],"Atender turnos FIFO y buscar identificadores"),
        s("si1b5","Resolución de problemas y paradigmas",28,["Análisis, contratos y pruebas","Clases, objetos y encapsulamiento","Funciones puras e inmutabilidad","Refactorización de código"],"Préstamo de equipos audiovisuales"),
        s("si1b6","Bases de datos",28,["Tablas, relaciones y claves","SQL: INSERT, SELECT, UPDATE, JOIN","SQLite con sqlite3 en Python","Restricciones e integridad referencial"],"Base de datos real para biblioteca"),
        s("si1b7","Ingeniería de software y sistemas",28,["Requisitos medibles y arquitectura","Redes, HTTP y cliente-servidor","Seguridad, autenticación y autorización","Pruebas unitarias con unittest"],"Controlar acceso a expedientes con tests"),
        s("si1b8","IA, ética e integración",14,["IA, machine learning y modelos generativos","Ética, privacidad y sesgos","Supervisión humana y decisiones","Integración técnica"],"Priorizar trámites sin decisiones automáticas perjudiciales"),
        s("si1math","Matemáticas iniciales",120,["Álgebra y aritmética","Funciones y ecuaciones","Lógica y conjuntos","Combinatoria","Demostraciones iniciales"],"Demostrar proposiciones y resolver problemas de conteo"),
        s("si1eng","Inglés técnico y recuperación",80,["Lectura de documentación","Vocabulario técnico","Recuperación activa","Repaso 1, 3, 7 y 30 días"],"Explicar un algoritmo de forma escrita"),
        s("si1pr","Proyecto integrador",56,["Análisis y casos límite","Python modular","SQLite","Pruebas y documentación"],"Sistema ficticio de alquiler de equipos con pruebas")
      ]),
      sem(2,"Programación y herramientas fundamentales",[
        s("si2a","POO, módulos y calidad",120,["Clases y composición","Excepciones","Módulos y paquetes","Legibilidad y pruebas"],"Aplicación modular con tests"),
        s("si2b","Estructuras de datos y recursión",100,["Colecciones","Árboles","Recursión","Elección por complejidad"],"Implementar estructuras y comparar estrategias"),
        s("si2c","Matemáticas discretas y pruebas",100,["Relaciones","Inducción","Grafos","Demostraciones"],"Justificar corrección de algoritmos"),
        s("si2d","Cálculo I",80,["Funciones y límites","Derivadas","Aplicaciones"],"Problemas de optimización elemental"),
        s("si2e","Proyecto e inglés técnico",80,["CLI de archivos o turnos","Pruebas y trazas","Documentación e inglés"],"Gestor modular de turnos y archivos")
      ]),
      sem(3,"Algoritmos y datos relacionales",[
        s("si3a","Algoritmos y Big O",120,["Búsqueda","Ordenamiento","Recurrencias","Correctitud y rendimiento"],"Comparación con mediciones"),
        s("si3b","PostgreSQL y modelo relacional",100,["Normalización","Joins","Transacciones","Índices"],"Sistema de reservas con integridad"),
        s("si3c","Álgebra lineal",100,["Vectores","Matrices","Transformaciones","Sistemas lineales"],"Cálculo reproducible con matrices"),
        s("si3d","Cálculo II",80,["Integración","Series","Optimización"],"Resolver e interpretar modelos"),
        s("si3e","Proyecto e inglés",80,["Sistema de reservas","Pruebas","Documentación técnica"],"Reserva sin duplicaciones")
      ]),
      sem(4,"Sistemas, computadores y redes",[
        s("si4a","Sistemas operativos y Linux",120,["Procesos","Memoria virtual","Archivos y permisos","Concurrencia"],"Monitorizar procesos"),
        s("si4b","C y arquitectura de computadores",100,["Memoria y punteros","CPU y representación","Compilación","Depuración"],"Programa C con diagnóstico de memoria"),
        s("si4c","Redes y protocolos",100,["TCP/IP","DNS","HTTP/HTTPS","Diagnóstico de red"],"Inspeccionar tráfico de prueba"),
        s("si4d","Probabilidad y estadística",80,["Variables aleatorias","Distribuciones","Inferencia inicial"],"Analizar datos simulados"),
        s("si4e","Proyecto e inglés",80,["Monitor de procesos o redes","Mediciones","Informe técnico"],"Documentar fallos y soluciones")
      ]),
      sem(5,"Ingeniería de software y aplicaciones",[
        s("si5a","Requisitos, diseño y calidad",120,["Requisitos verificables","Diseño orientado a objetos","Pruebas y QA","Revisión de código"],"Revisar y reparar código ajeno"),
        s("si5b","Backend y APIs con Python",100,["HTTP y REST","Servicios","Autenticación","Validación de entradas"],"API documentada"),
        s("si5c","JavaScript y TypeScript",100,["Fundamentos web","Tipado","Interacción cliente-servidor","Depuración frontend"],"Interfaz de consumo de API"),
        s("si5d","HCI y accesibilidad",80,["Diseño centrado en usuario","Accesibilidad","Usabilidad"],"Auditoría UX"),
        s("si5e","Proyecto e inglés",80,["Biblioteca por API","Pruebas","Documentación"],"Servicio de biblioteca")
      ]),
      sem(6,"Sistemas distribuidos y entrega",[
        s("si6a","Distribución, concurrencia y resiliencia",120,["Concurrencia","Colas","Consistencia","Tolerancia a fallos"],"Servicio resiliente"),
        s("si6b","Seguridad de aplicaciones",100,["Identidad","Autorización","Amenazas comunes","Auditoría"],"Pruebas de control de acceso"),
        s("si6c","DevOps, cloud y CI/CD",100,["Contenedores","Pipelines","Monitoreo","Despliegues reproducibles"],"Deploy con pruebas"),
        s("si6d","Lenguajes y computabilidad",80,["Autómatas","Gramáticas","Computabilidad"],"Explicar límites computacionales"),
        s("si6e","Proyecto e inglés",80,["Servicio tolerante a fallos","Pruebas de recuperación","Informe"],"Simular y mitigar fallos")
      ]),
      sem(7,"Ciencia e ingeniería de datos",[
        s("si7a","Pipelines ETL en Python",120,["Extracción","Transformación","Calidad","Reproducibilidad"],"Pipeline con datos sintéticos"),
        s("si7b","Estadística inferencial",100,["Hipótesis","Intervalos","Experimentos","Sesgos"],"Diseño experimental"),
        s("si7c","Aprendizaje automático",100,["Regresión y clasificación","Evaluación","Validación","Sobreajuste"],"Modelo documentado"),
        s("si7d","Visualización y calidad",80,["Gráficos","Linaje","Métricas"],"Informe de datos"),
        s("si7e","Proyecto e inglés",80,["Pipeline","Pruebas de datos","Documentación"],"Proceso reproducible")
      ]),
      sem(8,"Ciberseguridad aplicada",[
        s("si8a","Redes seguras e identidad",120,["Seguridad de redes","Autenticación","Autorización","Mínimo privilegio"],"Modelo de acceso"),
        s("si8b","Criptografía aplicada",100,["Hashing","Cifrado","Firmas digitales","Gestión de claves"],"Diseño seguro de secretos"),
        s("si8c","Modelado de amenazas",100,["Superficies de ataque","OWASP","Pruebas defensivas","Desarrollo seguro"],"Auditoría de app propia"),
        s("si8d","Monitoreo y respuesta",80,["Logs","Detección","Incidentes","Gobierno"],"Simulación de incidente"),
        s("si8e","Proyecto e inglés",80,["Auditoría en laboratorio propio","Informe de riesgos","Mitigación"],"Demostración de controles")
      ]),
      sem(9,"Ingeniería avanzada e IA",[
        s("si9a","Diseño de sistemas",120,["Escalabilidad","Latencia","Disponibilidad","Rendimiento"],"Defensa de arquitectura"),
        s("si9b","IA y modelos de lenguaje",100,["LLM","Evaluación","Sesgo","Supervisión humana"],"Servicio IA evaluado"),
        s("si9c","Optimización y simulación",100,["Modelos","Simulación","Análisis de decisiones"],"Experimentación reproducible"),
        s("si9d","Investigación y evidencia",80,["Revisión de literatura","Hipótesis","Método","Reproducibilidad"],"Informe de investigación"),
        s("si9e","Proyecto e inglés",80,["Calidad","Costo","Latencia","Evaluación adversarial"],"Prototipo documentado")
      ]),
      sem(10,"Integración y defensa",[
        s("si10a","Proyecto integrador",220,["Especificación","Diseño y desarrollo","Versionado","Validación"],"Sistema de dominio independiente"),
        s("si10b","Calidad, seguridad y rendimiento",100,["Pruebas integrales","Rendimiento","Controles de seguridad"],"Pruebas adversas"),
        s("si10c","Profundización",80,["Software, datos o seguridad","Investigación aplicada"],"Especialización documentada"),
        s("si10d","Ética y memoria técnica",40,["Impactos","Limitaciones","Documentación"],"Memoria técnica"),
        s("si10e","Defensa técnica",40,["Presentación","Preguntas","Revisión externa"],"Defensa formal")
      ])
    ]
  },
  {
    id:"electronica",name:"Ingeniería Electrónica",subtitle:"Plan autodidacta progresivo · 10 semestres · de cero a sistemas inteligentes",
    semesters:[
      sem(1,"Bases y primeros circuitos",[
        s("el1a","Matemáticas y física inicial",80,["Álgebra y funciones","Unidades y magnitudes","Mecánica y energía"],"Resolver circuitos con unidades correctas"),
        s("el1b","Electricidad fundamental",80,["Voltaje, corriente y resistencia","Ley de Ohm","Potencia y energía","Seguridad en baja tensión"],"Simular circuito LED y resistencia"),
        s("el1c","Herramientas y programación",60,["Medición con multímetro","Python inicial","Wokwi y simulación"],"Circuito LED simulado"),
        s("el1d","Proyecto",40,["Diseño LED","Simulación","Documentación y validación"],"Iluminación LED básica")
      ]),
      sem(2,"Circuitos eléctricos",[
        s("el2a","Circuitos DC y AC",100,["Leyes de Kirchhoff","Nodos y mallas","Capacitores e inductores","AC y fasores"],"Analizar circuito de varias ramas"),
        s("el2b","Matemáticas para circuitos",80,["Trigonometría","Cálculo inicial","Números complejos"],"Resolver circuitos senoidales"),
        s("el2c","Instrumentación y seguridad",60,["Osciloscopio","Fuentes","Protocolos de medición"],"Registrar mediciones seguras"),
        s("el2d","Proyecto",40,["Rectificación","Filtrado","Regulación"],"Fuente de alimentación de baja tensión")
      ]),
      sem(3,"Electrónica analógica",[
        s("el3a","Semiconductores",100,["Diodos","Transistores BJT","MOSFET","Polarización"],"Modelar amplificador sencillo"),
        s("el3b","Amplificadores y señales",80,["Amplificadores operacionales","Filtros","Ruido","Sensores"],"Acondicionar señal de un sensor"),
        s("el3c","Simulación electrónica",60,["LTspice","Análisis transitorio","Mediciones y tolerancias"],"Comparar simulación y diseño"),
        s("el3d","Proyecto",40,["Sensor","Ganancia","Filtrado"],"Acondicionamiento de sensor")
      ]),
      sem(4,"Electrónica digital",[
        s("el4a","Lógica digital",100,["Binario y hexadecimal","Álgebra de Boole","Compuertas","Circuitos combinacionales"],"Diseñar codificador"),
        s("el4b","Sistemas secuenciales",80,["Flip-flops","Contadores","Máquinas de estados","Temporización"],"Control digital"),
        s("el4c","Fundamentos de HDL",60,["Verilog introductorio","Simulación","Pruebas digitales"],"Circuito digital simulado"),
        s("el4d","Proyecto",40,["Control de acceso","Estados","Validación"],"Sistema de acceso digital")
      ]),
      sem(5,"Microcontroladores y PCB",[
        s("el5a","Microcontroladores",100,["C/C++ embebido","GPIO","Timers","Interrupciones"],"Leer sensor y controlar actuador"),
        s("el5b","Buses y comunicación",80,["UART","I2C","SPI","ADC/PWM"],"Comunicaciones de sensores"),
        s("el5c","Diseño PCB",60,["Esquemáticos","KiCad","Layout","Diseño para fabricación"],"Placa para sensor"),
        s("el5d","Proyecto",40,["Integración","PCB","Prueba"],"PCB de monitor ambiental")
      ]),
      sem(6,"Control automático y señales",[
        s("el6a","Sistemas y control",100,["Modelos dinámicos","Retroalimentación","Estabilidad","PID"],"Controlar velocidad"),
        s("el6b","Procesamiento digital de señales",80,["Muestreo","Transformada de Fourier","Filtros digitales"],"Analizar mediciones"),
        s("el6c","Electrónica de potencia inicial",60,["PWM","Convertidores","Protecciones"],"Etapa de control segura"),
        s("el6d","Proyecto",40,["Motor DC","PID","Pruebas"],"Control PID de motor")
      ]),
      sem(7,"Robótica y automatización",[
        s("el7a","Robótica",100,["Cinemática","Sensores","Actuadores","Navegación"],"Robot simulado"),
        s("el7b","Automatización",80,["Máquinas de estados","PLC introductorio","Control industrial"],"Secuencia industrial"),
        s("el7c","Integración de sistemas",60,["Diagnóstico","Telemetría","Seguridad operacional"],"Sistema automatizado"),
        s("el7d","Proyecto",40,["Robot","Control","Validación"],"Robot autónomo básico")
      ]),
      sem(8,"IoT y sistemas conectados",[
        s("el8a","Internet de las cosas",100,["ESP32","Wi-Fi/BLE","MQTT","Telemetría"],"Nodo IoT"),
        s("el8b","Redes y seguridad embebida",80,["TLS","Identidad del dispositivo","Actualizaciones","Consumo energético"],"Telemetría protegida"),
        s("el8c","Diseño para producción",60,["Pruebas","Confiabilidad","Calibración"],"Validar prototipo"),
        s("el8d","Proyecto",40,["Medición energética","Conectividad","Dashboard"],"IoT energético")
      ]),
      sem(9,"Edge AI y tecnologías modernas",[
        s("el9a","Machine learning embebido",100,["Clasificación","Extracción de características","TinyML","Inferencia en dispositivo"],"Modelo para sensor"),
        s("el9b","Optimización de hardware",80,["Memoria","Latencia","Consumo","Robustez"],"Medir consumo"),
        s("el9c","Ciberseguridad de sistemas ciberfísicos",60,["Amenazas","Firmware","Datos","Protecciones"],"Modelo de amenazas"),
        s("el9d","Proyecto",40,["Detección de anomalías","TinyML","Evaluación"],"Detector de anomalías en borde")
      ]),
      sem(10,"Proyecto integral e investigación",[
        s("el10a","Sistema ciberfísico",140,["Requisitos","Diseño electrónico","Firmware","Integración"],"Producto inteligente"),
        s("el10b","Verificación y documentación",80,["Pruebas","Seguridad","Confiabilidad","Reproducibilidad"],"Informe técnico"),
        s("el10c","Investigación y defensa",60,["Análisis de resultados","Limitaciones","Presentación","Defensa"],"Defender un prototipo final")
      ])
    ]
  }
];

export const resources: Record<Career["id"], {label:string;url:string}[]> = {
 sistemas:[
  {label:"Think Python (libro gratuito)",url:"https://allendowney.github.io/ThinkPython/"},
  {label:"Harvard CS50",url:"https://cs50.harvard.edu/x/"},
  {label:"MIT OpenCourseWare",url:"https://ocw.mit.edu/"},
  {label:"Documentación de Python",url:"https://docs.python.org/3/"},
  {label:"SQLite",url:"https://www.sqlite.org/docs.html"}
 ],
 electronica:[
  {label:"Lessons in Electric Circuits (libro)",url:"https://www.allaboutcircuits.com/textbook/"},
  {label:"MIT OpenCourseWare",url:"https://ocw.mit.edu/"},
  {label:"Wokwi (simulador)",url:"https://wokwi.com/"},
  {label:"KiCad (PCB)",url:"https://www.kicad.org/"},
  {label:"LTspice (simulación)",url:"https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html"}
 ]
};
