const boletaUnica = "2026630001";

// Datos del Mapa ISC 2020 (Asegúrate de incluir todos los IDs necesarios)
const materiasMap = [
    {id:1, s:1, n:"Cálculo", c:7.5}, 
    {id:2, s:1, n:"Análisis Vectorial", c:7.5},
    {id:5, s:1, n:"Fundamentos de Programación", c:7.5},
    {id:7, s:2, n:"Cálculo Aplicado", c:7.5, reqs:[1]}, 
    {id:8, s:2, n:"Mecánica y Electromagnetismo", c:10.5, reqs:[2]},
    {id:11, s:2, n:"Algoritmos", c:7.5, reqs:[5]},
    {id:12, s:3, n:"Ecuaciones Diferenciales", c:9.0, reqs:[7]}
];

let approvedIds = JSON.parse(localStorage.getItem(`map_${boletaUnica}`)) || [];

// --- GESTIÓN DEL MENÚ ---
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const menuOverlay = document.getElementById('menuOverlay');
const btnEstudiante = document.getElementById('btnEstudiante');
const studentOpts = document.getElementById('student-opts');

openBtn.onclick = () => menuOverlay.style.display = 'block';
closeBtn.onclick = () => menuOverlay.style.display = 'none';

// Animación del Dropdown
btnEstudiante.onclick = (e) => {
    e.stopPropagation();
    studentOpts.classList.toggle('show');
};

// --- GESTIÓN DEL MAPA ---
function initApp() {
    updateProgress();
}

function openMap() {
    renderMap();
    document.getElementById('map-modal').classList.remove('hidden');
    menuOverlay.style.display = 'none';
    studentOpts.classList.remove('show'); // Reset menú
}

function closeMap() {
    document.getElementById('map-modal').classList.add('hidden');
}

function renderMap() {
    const g = document.getElementById('mapGrid');
    g.innerHTML = "";
    let curSem = 0;

    materiasMap.forEach(m => {
        if(m.s !== curSem) {
            curSem = m.s;
            const header = document.createElement('div');
            header.className = 'sem-header';
            header.innerText = `Semestre ${curSem}`;
            g.appendChild(header);
        }

        const isLocked = m.reqs && m.reqs.some(reqId => !approvedIds.includes(reqId));
        const isPassed = approvedIds.includes(m.id);

        const box = document.createElement('div');
        box.className = `subject-box ${isLocked ? 'locked' : ''} ${isPassed ? 'passed' : ''}`;
        box.innerHTML = `<strong>${m.n}</strong><span>${isLocked ? '🔒' : m.c + ' cr'}</span>`;
        
        box.onclick = () => {
            if(isLocked) {
                alert("Esta materia está bloqueada hasta que apruebes sus requisitos.");
            } else {
                toggleSubject(m.id);
            }
        };
        g.appendChild(box);
    });
}

function toggleSubject(id) {
    if (approvedIds.includes(id)) {
        approvedIds = approvedIds.filter(x => x !== id);
        // Cascada: si desapruebas una, se bloquean las que dependían de ella
        checkCascade();
    } else {
        approvedIds.push(id);
    }
    localStorage.setItem(`map_${boletaUnica}`, JSON.stringify(approvedIds));
    renderMap(); // Re-renderizar para mostrar cambios inmediatos
    updateProgress();
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
    const percent = Math.round((appC / totalC) * 100) || 0;
    
    const pBar = document.getElementById('pBar');
    if(pBar) {
        pBar.style.width = percent + "%";
        pBar.textContent = percent + "%";
    }
}
