// Obtenemos los elementos
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const menuOverlay = document.getElementById('menuOverlay');

// Función para abrir
openBtn.addEventListener('click', () => {
    menuOverlay.style.display = 'block';
});

// Función para cerrar
closeBtn.addEventListener('click', () => {
    menuOverlay.style.display = 'none';
});

// Cerrar si se hace clic fuera del menú (en el fondo oscuro)
window.addEventListener('click', (event) => {
    if (event.target === menuOverlay) {
        menuOverlay.style.display = 'none';
    }
});
