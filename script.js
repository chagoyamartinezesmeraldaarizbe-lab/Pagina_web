const boletaUnica = "2026630001";

// Base de datos simplificada para el ejemplo (puedes copiar toda la lista anterior aquí)
const materiasMap = [
    {id:1, s:1, n:"Cálculo", c:7.5}, 
    {id:5, s:1, n:"Fundamentos de Programación", c:7.5},
    {id:7, s:2, n:"Cálculo Aplicado", c:7.5, reqs:[1]}, 
    {id:11, s:2, n:"Algoritmos", c:7.5, reqs:[5]},
    {id:12, s:3, n:"Ecuaciones Diferenciales", c:9.0, reqs:[7]},
    {id:15, s:3, n:"Bases de Datos", c:7.5, reqs:[11]}
];

let approvedIds = JSON.parse(localStorage.getItem(`map_${boletaUnica}`)) || [];

// Control del Menú Lateral
function toggleDropdown(id) {
    const el = document.getElementById(id);
    const isVisible = el.style.display === 'block';
    el.style.display = isVisible ? 'none' : 'block';
}

const menuOverlay = document.getElementById('menuOverlay');
document.getElementById('openBtn').onclick = () => menuOverlay.style.display = 'block';
document.getElementById('closeBtn').onclick = () => menuOverlay.style.display = 'none';

// Lógica del Mapa
function initApp() { updateProgress(); }

function openMap() {
    renderMap();
    document.getElementById('map-modal').classList.remove('hidden');
    menuOverlay.style.display = 'none';
}

function closeMap() { document.getElementById('map-modal').classList.add('hidden'); }

function renderMap() {
    const g = document.getElementById('mapGrid');
    g.innerHTML = "";
    let curSem = 0;

    materiasMap.forEach(m => {
        if(m.s !== curSem) {
            curSem = m.s;
            g.innerHTML += `<div class="sem-header">Semestre ${curSem}</div>`;
        }

        // Lógica de Desbloqueo: si tiene requisitos, TODOS deben estar aprobados
        const isLocked = m.reqs && m.reqs.some(reqId => !approvedIds.includes(reqId));
        const isPassed = approvedIds.includes(m.id);

        const box = document.createElement('div');
        box.className = `subject-box ${isLocked ? 'locked' : ''} ${isPassed ? 'passed' : ''}`;
        box.innerHTML = `<span>${m.n}</span> <b>${isLocked ? '🔒' : m.c}</b>`;
        
        box.onclick = () => {
            if(isLocked) {
                alert("Materia Bloqueada: Falta aprobar el requisito previo.");
            } else {
                toggleSubject(m.id);
            }
        };
        g.appendChild(box);
    });
}

function toggleSubject(id) {
    if (approvedIds.includes(id)) {
        // Al quitar una materia, debemos verificar si hay que quitar las que dependen de ella
        approvedIds = approvedIds.filter(x => x !== id);
        // Filtro de cascada: quitamos las que ya no cumplen requisitos
        checkCascade();
    } else {
        approvedIds.push(id);
    }
    localStorage.setItem(`map_${boletaUnica}`, JSON.stringify(approvedIds));
    renderMap();
    updateProgress();
}

// Verifica si al desmarcar una materia se deben bloquear otras
function checkCascade() {
    let changed = true;
    while(changed) {
        changed = false;
        approvedIds.forEach(id => {
            const m = materiasMap.find(mat => mat.id === id);
            if(m.reqs && m.reqs.some(r => !approvedIds.includes(r))) {
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
