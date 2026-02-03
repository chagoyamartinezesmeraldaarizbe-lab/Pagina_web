// Configuración y Datos
const boleta = "2026630001";
const materiasMap = [
    {id:1, s:1, n:"Cálculo", c:7.5}, 
    {id:2, s:1, n:"Análisis Vectorial", c:7.5}, 
    {id:3, s:1, n:"Matemáticas Discretas", c:10.5}, 
    {id:5, s:1, n:"Fundamentos de Programación", c:7.5},
    {id:6, s:2, n:"Álgebra Lineal", c:9.0}, 
    {id:7, s:2, n:"Cálculo Aplicado", c:7.5, reqs:[1]}, 
    {id:8, s:2, n:"Mecánica y Electromagnetismo", c:10.5, reqs:[2]}, 
    {id:11, s:2, n:"Algoritmos y Estructuras", c:7.5, reqs:[5]},
    {id:12, s:3, n:"Ecuaciones Diferenciales", c:9.0, reqs:[7]}, 
    {id:15, s:3, n:"Bases de Datos", c:7.5, reqs:[11]}
    // Puedes seguir agregando el resto de las materias aquí...
];

let approvedIds = JSON.parse(localStorage.getItem(`map_${boleta}`)) || [];

// --- MANEJO DE INTERFAZ ---

function initApp() {
    updateDash();
}

const menuOverlay = document.getElementById('menuOverlay');

document.getElementById('openBtn').addEventListener('click', () => menuOverlay.style.display = 'block');
document.getElementById('closeBtn').addEventListener('click', () => menuOverlay.style.display = 'none');

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    // Mostrar la elegida
    const target = document.getElementById(`section-${sectionId}`);
    if(target) target.classList.remove('hidden');
    menuOverlay.style.display = 'none'; // Cerrar menú
}

// --- LÓGICA DEL MAPA ---

function openMap() {
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

        const btn = document.createElement('div');
        btn.className = `subject-box ${isLocked ? 'locked' : ''} ${isPassed ? 'passed' : ''}`;
        btn.innerHTML = `<strong>${m.n}</strong><br><small>${m.c} cr</small>`;
        
        btn.onclick = () => {
            if(isLocked) {
                alert("Materia bloqueada: falta aprobar prerrequisitos.");
            } else {
                toggleSubject(m.id);
            }
        };
        g.appendChild(btn);
    });
    document.getElementById('map-modal').classList.remove('hidden');
}

function closeMap() {
    document.getElementById('map-modal').classList.add('hidden');
}

function toggleSubject(id) {
    if(approvedIds.includes(id)) {
        approvedIds = approvedIds.filter(x => x !== id);
    } else {
        approvedIds.push(id);
    }
    localStorage.setItem(`map_${boleta}`, JSON.stringify(approvedIds));
    openMap(); // Refrescar vista del mapa
    updateDash(); // Refrescar porcentaje
}

function updateDash() {
    const totalC = materiasMap.reduce((a,c) => a + c.c, 0);
    const appC = materiasMap.filter(m => approvedIds.includes(m.id)).reduce((a,c) => a + c.c, 0);
    const av = totalC > 0 ? Math.round((appC / totalC) * 100) : 0;

    const pBar = document.getElementById('pBar');
    if(pBar) {
        pBar.style.width = av + "%";
        pBar.textContent = av + "%";
    }
    const credInfo = document.getElementById('creditosInfo');
    if(credInfo) credInfo.textContent = `Créditos: ${appC.toFixed(1)} / ${totalC.toFixed(1)}`;
}
