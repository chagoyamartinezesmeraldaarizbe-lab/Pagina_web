// Datos de la alumna
const boletaUnica = "2026630001";

// Base de datos de materias (ISC 2020)
const materiasMap = [
    {id:1, s:1, n:"Cálculo", c:7.5}, 
    {id:2, s:1, n:"Análisis Vectorial", c:7.5}, 
    {id:3, s:1, n:"Matemáticas Discretas", c:10.5}, 
    {id:5, s:1, n:"Fundamentos de Programación", c:7.5},
    {id:6, s:2, n:"Álgebra Lineal", c:9.0}, 
    {id:7, s:2, n:"Cálculo Aplicado", c:7.5, reqs:[1]}, 
    {id:8, s:2, n:"Mecánica y Electromagnetismo", c:10.5, reqs:[2]}, 
    {id:11, s:2, n:"Algoritmos y Estructuras de Datos", c:7.5, reqs:[5]},
    {id:12, s:3, n:"Ecuaciones Diferenciales", c:9.0, reqs:[7]},
    {id:15, s:3, n:"Bases de Datos", c:7.5, reqs:[11]}
    // Puedes seguir agregando las demás materias aquí...
];

let approvedIds = JSON.parse(localStorage.getItem(`map_${boletaUnica}`)) || [];

// --- Lógica del Menú ---
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const menuOverlay = document.getElementById('menuOverlay');

openBtn.onclick = () => menuOverlay.style.display = 'block';
closeBtn.onclick = () => menuOverlay.style.display = 'none';

window.onclick = (event) => {
    if (event.target === menuOverlay) menuOverlay.style.display = 'none';
};

// Función para desplegar opciones dentro del menú
function toggleDropdown(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

// --- Lógica del Mapa ---
function initApp() {
    updateProgress();
}

function openMap() {
    renderMap();
    document.getElementById('map-modal').classList.remove('hidden');
    menuOverlay.style.display = 'none'; // Cerrar menú al abrir mapa
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
            g.innerHTML += `<div class="sem-header">Semestre ${curSem}</div>`;
        }

        const isLocked = m.reqs && m.reqs.some(reqId => !approvedIds.includes(reqId));
        const isPassed = approvedIds.includes(m.id);

        const box = document.createElement('div');
        box.className = `subject-box ${isLocked ? 'locked' : ''} ${isPassed ? 'passed' : ''}`;
        box.innerHTML = `<span>${m.n}</span> <small>${m.c}cr</small>`;
        
        box.onclick = () => {
            if(isLocked) {
                alert("Materia bloqueada por requisitos.");
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
    } else {
        approvedIds.push(id);
    }
    localStorage.setItem(`map_${boletaUnica}`, JSON.stringify(approvedIds));
    renderMap();
    updateProgress();
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
    document.getElementById('creditosInfo').textContent = `Progreso: ${appC} de ${totalC} créditos`;
}
