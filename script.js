const boletaUnica = "2026630001";
let tasks = JSON.parse(localStorage.getItem('tasks_estudiante')) || [];
let approvedIds = JSON.parse(localStorage.getItem(`map_${boletaUnica}`)) || [];

// Mapa ISC 2020 Completo con Seriación
const materiasMap = [

    // SEMESTRE 1
    {id:1, s:1, n:"Cálculo", c:7.5},
    {id:2, s:1, n:"Análisis Vectorial", c:7.5},
    {id:3, s:1, n:"Matemáticas Discretas", c:10.5},
    {id:4, s:1, n:"Comunicación Oral y Escrita", c:7.5},
    {id:5, s:1, n:"Fundamentos de Programación", c:7.5},

    // SEMESTRE 2
    {id:6, s:2, n:"Álgebra Lineal", c:9.0},
    {id:7, s:2, n:"Cálculo Aplicado", c:7.5, reqs:[1]},
    {id:8, s:2, n:"Mecánica y Electromagnetismo", c:10.5, reqs:[2]},
    {id:9, s:2, n:"Ingeniería, Ética y Sociedad", c:9.0},
    {id:10, s:2, n:"Fundamentos Económicos", c:7.5},
    {id:11, s:2, n:"Algoritmos y Estructuras de Datos", c:7.5, reqs:[5]},

    // SEMESTRE 3
    {id:12, s:3, n:"Ecuaciones Diferenciales", c:9.0, reqs:[7]},
    {id:13, s:3, n:"Circuitos Eléctricos", c:7.5, reqs:[8]},
    {id:14, s:3, n:"Fundamentos de Diseño Digital", c:7.5, reqs:[3]},
    {id:15, s:3, n:"Bases de Datos", c:7.5, reqs:[11]},
    {id:16, s:3, n:"Finanzas Empresariales", c:7.5, reqs:[10]},
    {id:17, s:3, n:"Paradigmas de Programación", c:7.5, reqs:[11]},
    {id:18, s:3, n:"Análisis y Diseño de Algoritmos", c:7.5, reqs:[11]},

    // SEMESTRE 4
    {id:19, s:4, n:"Probabilidad y Estadística", c:9.0, reqs:[12]},
    {id:20, s:4, n:"Matemáticas Avanzadas", c:7.5, reqs:[12]},
    {id:21, s:4, n:"Electrónica Analógica", c:7.5, reqs:[13]},
    {id:22, s:4, n:"Diseño de Sistemas Digitales", c:7.5, reqs:[14]},
    {id:23, s:4, n:"Tecnologías para la Web", c:7.5, reqs:[15]},
    {id:24, s:4, n:"Sistemas Operativos", c:7.5, reqs:[18]},
    {id:25, s:4, n:"Teoría de la Computación", c:7.5, reqs:[18]},

    // SEMESTRE 5
    {id:26, s:5, n:"Procesamiento Digital de Señales", c:7.5, reqs:[20]},
    {id:27, s:5, n:"Instrumentación y Control", c:7.5, reqs:[21]},
    {id:28, s:5, n:"Arquitectura de Computadoras", c:7.5, reqs:[22]},
    {id:29, s:5, n:"Análisis y Diseño de Sistemas", c:7.5, reqs:[23]},
    {id:30, s:5, n:"Proyectos Informáticos", c:6.0, reqs:[16]},
    {id:31, s:5, n:"Compiladores", c:7.5, reqs:[25]},
    {id:32, s:5, n:"Redes de Computadoras", c:7.5, reqs:[24]},

    // SEMESTRE 6
    {id:33, s:6, n:"Sistemas en Chip", c:7.5, reqs:[28]},
    {id:34, s:6, n:"Optativa A1", c:7.5, reqs:[27]},
    {id:35, s:6, n:"Optativa B1", c:7.5, reqs:[29]},
    {id:36, s:6, n:"Toma de Decisiones", c:7.5, reqs:[19]},
    {id:37, s:6, n:"Ingeniería de Software", c:7.5, reqs:[29]},
    {id:38, s:6, n:"Inteligencia Artificial", c:7.5, reqs:[18]},
    {id:39, s:6, n:"Aplicaciones para Red", c:7.5, reqs:[32]},

    // SEMESTRE 7
    {id:40, s:7, n:"Móviles Nativos", c:7.5, reqs:[23]},
    {id:41, s:7, n:"Optativa A2", c:7.5, reqs:[34]},
    {id:42, s:7, n:"Optativa B2", c:7.5, reqs:[35]},
    {id:43, s:7, n:"Trabajo Terminal I", c:7.5, reqs:[37]},
    {id:44, s:7, n:"Sistemas Distribuidos", c:7.5, reqs:[32]},
    {id:45, s:7, n:"Servicios en Red", c:7.5, reqs:[39]},

    // SEMESTRE 8
    {id:46, s:8, n:"Estancia Profesional", c:6.0},
    {id:47, s:8, n:"Habilidades Sociales", c:6.0},
    {id:48, s:8, n:"Trabajo Terminal II", c:7.5, reqs:[43]},
    {id:49, s:8, n:"Gestión Empresarial", c:7.5},
    {id:50, s:8, n:"Liderazgo Personal", c:7.5}

];

// --- NAVEGACIÓN ---
function toggleDropdown(id) { document.getElementById(id).classList.toggle('show'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function showHome() { document.getElementById('menuOverlay').style.display = 'none'; renderHomeTasks(); }

document.getElementById('openBtn').onclick = () => document.getElementById('menuOverlay').style.display = 'block';
document.getElementById('closeBtn').onclick = () => document.getElementById('menuOverlay').style.display = 'none';

// --- NUEVA FUNCIÓN: CÁLCULO DE DÍAS ---
function calculateDaysLeft(targetDate) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(targetDate + "T00:00:00");
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Vencida";
    if (diffDays === 0) return "¡Vence hoy!";
    if (diffDays === 1) return "Queda 1 día";
    return `Faltan ${diffDays} días`;
}

// --- TAREAS ---
function openTasks() { renderTasks(); document.getElementById('task-modal').classList.remove('hidden'); document.getElementById('menuOverlay').style.display = 'none'; }

function addTask() {
    const n = document.getElementById('tIn').value, d = document.getElementById('tDate').value, u = document.getElementById('tUrg').value;
    const editId = document.getElementById('editId').value;
    if (!n || !d) return alert("Llena los campos");

    if (editId) {
        const idx = tasks.findIndex(t => t.id == editId);
        tasks[idx] = { ...tasks[idx], n, d, urg: parseInt(u) };
    } else {
        tasks.push({ id: Date.now(), n, d, urg: parseInt(u), done: false });
    }
    saveAndRefresh(); resetTaskForm();
}

function saveAndRefresh() {
    localStorage.setItem('tasks_estudiante', JSON.stringify(tasks));
    renderTasks(); renderHomeTasks();
}

function renderTasks() {
    const pList = document.getElementById('pendingList'), cList = document.getElementById('completedList');
    pList.innerHTML = ""; cList.innerHTML = "";

    tasks.forEach(t => {
        const priorityText = t.urg === 3 ? "Alta" : t.urg === 2 ? "Media" : "Baja";
        const daysLeftStr = calculateDaysLeft(t.d);
        const isUrgent = daysLeftStr.includes("hoy") || daysLeftStr.includes("1 día") || daysLeftStr === "Vencida";

        const cardHTML = `
            <div class="task-card card-urg-${t.urg}">
                <span class="priority-tag tag-urg-${t.urg}">${priorityText}</span>
                <div class="task-card-title">${t.n}</div>
                <div class="task-card-date">Fecha: ${t.d}</div>
                ${!t.done ? `<div class="days-left ${isUrgent ? 'days-urgent' : ''}">${daysLeftStr}</div>` : ''}
                <div class="task-card-actions">
                    ${!t.done ? `<button onclick="editTask(${t.id})" class="action-icon">✏️</button>
                                 <button onclick="doneT(${t.id})" class="action-icon">✅</button>` : ''}
                    <button onclick="delT(${t.id})" class="action-icon">🗑️</button>
                </div>
            </div>`;
        t.done ? cList.innerHTML += cardHTML : pList.innerHTML += cardHTML;
    });
}

function doneT(id) { if (confirm("¿Concluida?")) { tasks.find(x => x.id === id).done = true; saveAndRefresh(); } }
function delT(id) { if (confirm("¿Eliminar?")) { tasks = tasks.filter(x => x.id !== id); saveAndRefresh(); } }
function editTask(id) {
    const t = tasks.find(x => x.id === id);
    document.getElementById('editId').value = t.id;
    document.getElementById('tIn').value = t.n;
    document.getElementById('tDate').value = t.d;
    document.getElementById('tUrg').value = t.urg;
    document.getElementById('btnSaveTask').innerText = "Guardar";
    document.getElementById('btnCancelEdit').classList.remove('hidden');
}
function resetTaskForm() {
    document.getElementById('editId').value = ""; document.getElementById('tIn').value = ""; document.getElementById('tDate').value = "";
    document.getElementById('btnSaveTask').innerText = "Programar"; document.getElementById('btnCancelEdit').classList.add('hidden');
}

// --- MAPA CURRICULAR ---
function openMap() { renderMap(); document.getElementById('map-modal').classList.remove('hidden'); document.getElementById('menuOverlay').style.display = 'none'; }

function renderMap() {
    const g = document.getElementById('mapGrid'); g.innerHTML = "";
    let curSem = 0;
    materiasMap.forEach(m => {
        if(m.s !== curSem) { curSem = m.s; g.innerHTML += `<div class="sem-header">Semestre ${curSem}</div>`; }
        const isLocked = m.reqs && m.reqs.some(r => !approvedIds.includes(r));
        const isPassed = approvedIds.includes(m.id);
        
        const box = document.createElement('div');
        box.className = `subject-box ${isLocked ? 'locked' : ''} ${isPassed ? 'passed' : ''}`;
        box.innerHTML = `<strong>${m.n}</strong><span>${isLocked ? '🔒' : m.c + ' cr'}</span>`;
        
        // CORRECCIÓN: Evento de clic activo
        box.onclick = () => {
            if(isLocked) alert("Materia Bloqueada por requisitos.");
            else toggleSubject(m.id);
        };
        g.appendChild(box);
    });
    updateProgress();
}

function toggleSubject(id) {
    if(approvedIds.includes(id)) {
        approvedIds = approvedIds.filter(x => x !== id);
        checkCascade();
    } else {
        approvedIds.push(id);
    }
    localStorage.setItem(`map_${boletaUnica}`, JSON.stringify(approvedIds));
    renderMap();
}

function checkCascade() {
    let changed = true;
    while(changed) {
        changed = false;
        approvedIds.forEach(id => {
            const m = materiasMap.find(mat => mat.id === id);
            if(m && m.reqs && m.reqs.some(r => !approvedIds.includes(r))) {
                approvedIds = approvedIds.filter(x => x !== id);
                changed = true;
            }
        });
    }
}

function updateProgress() {
    const totalC = materiasMap.reduce((a, b) => a + b.c, 0);
    const appC = materiasMap.filter(m => approvedIds.includes(m.id)).reduce((a, b) => a + b.c, 0);
    const p = Math.round((appC/totalC)*100) || 0;
    document.getElementById('pBar').style.width = p + "%";
    document.getElementById('pBar').textContent = p + "%";
}

function renderHomeTasks() {
    const homeList = document.getElementById('homeTaskList');
    const pendings = tasks.filter(t => !t.done).sort((a,b)=>b.urg - a.urg);
    homeList.innerHTML = pendings.length ? "" : "<p>Sin pendientes.</p>";
    pendings.slice(0, 4).forEach(t => {
        homeList.innerHTML += `<div style="border-left:5px solid; margin-bottom:10px; padding:10px; background:#fff; border-radius:8px;" class="card-urg-${t.urg}">${t.n} - <small>${calculateDaysLeft(t.d)}</small></div>`;
    });
}

function initApp() { renderHomeTasks(); }
