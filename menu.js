// Configuración de páginas del sistema
const paginas = [
    { archivo: "index.html", nombre: "Distribución Hipergeométrica" },
    { archivo: "binomial.html", nombre: "Distribución Binomial" }
];

// Función para obtener el nombre de la página actual
function obtenerPaginaActual() {
    const rutaCompleta = window.location.pathname;
    const nombreArchivo = rutaCompleta.split('/').pop();
    return nombreArchivo || 'index.html';
}

// Función para crear el HTML del menú
function crearMenuHTML() {
    const paginaActual = obtenerPaginaActual();
    
    let menuItems = '';
    paginas.forEach(pagina => {
        const claseActiva = pagina.archivo === paginaActual ? 'activo' : '';
        menuItems += `
            <a href="${pagina.archivo}" class="menu-item ${claseActiva}">
                ${pagina.nombre}
            </a>
        `;
    });

    return `
        <div id="menu-hamburguesa">
            <button id="menu-toggle" class="menu-toggle" aria-label="Abrir menú">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <nav id="menu-nav" class="menu-nav">
                <div class="menu-header">
                    <h3>Calculadoras Estadísticas</h3>
                    <button id="menu-close" class="menu-close" aria-label="Cerrar menú">×</button>
                </div>
                <div class="menu-items">
                    ${menuItems}
                </div>
            </nav>
            
            <div id="menu-overlay" class="menu-overlay"></div>
        </div>
    `;
}

// Función para inyectar estilos CSS del menú
function inyectarEstilosMenu() {
    const estilos = `
        <style>
            /* Menú Hamburguesa */
            #menu-hamburguesa {
                position: fixed;
                z-index: 9999;
            }

            .menu-toggle {
                position: fixed;
                top: 1rem;
                left: 1rem;
                width: 50px;
                height: 50px;
                background: var(--accent-primary, #2d5a3d);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 6px;
                padding: 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                z-index: 10001;
            }

            .menu-toggle:hover {
                background: var(--accent-secondary, #5a7c65);
                transform: scale(1.05);
            }

            .menu-toggle span {
                display: block;
                width: 25px;
                height: 3px;
                background: white;
                border-radius: 2px;
                transition: all 0.3s ease;
            }

            .menu-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(8px, 8px);
            }

            .menu-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .menu-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -7px);
            }

            .menu-nav {
                position: fixed;
                top: 0;
                left: -320px;
                width: 300px;
                height: 100vh;
                background: var(--bg-card, #fafaf8);
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                transition: left 0.3s ease;
                z-index: 10000;
                overflow-y: auto;
            }

            .menu-nav.open {
                left: 0;
            }

            .menu-header {
                padding: 1.5rem 1.25rem;
                border-bottom: 2px solid var(--border, #d4d4c8);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-secondary, #ffffff);
            }

            .menu-header h3 {
                margin: 0;
                font-size: 1.1rem;
                color: var(--accent-primary, #2d5a3d);
                font-weight: 600;
            }

            .menu-close {
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--text-secondary, #5a5a5a);
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.2s ease;
            }

            .menu-close:hover {
                color: var(--accent-primary, #2d5a3d);
            }

            .menu-items {
                padding: 1rem 0;
            }

            .menu-item {
                display: block;
                padding: 1rem 1.5rem;
                color: var(--text-primary, #2c2c2c);
                text-decoration: none;
                transition: all 0.2s ease;
                border-left: 4px solid transparent;
                font-size: 0.95rem;
            }

            .menu-item:hover {
                background: var(--highlight, #e8f0eb);
                border-left-color: var(--accent-primary, #2d5a3d);
            }

            .menu-item.activo {
                background: var(--highlight, #e8f0eb);
                border-left-color: var(--accent-primary, #2d5a3d);
                font-weight: 600;
                color: var(--accent-primary, #2d5a3d);
            }

            .menu-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 9999;
            }

            .menu-overlay.open {
                opacity: 1;
                visibility: visible;
            }

            /* Ajuste para el contenido principal */
            body.menu-open {
                overflow: hidden;
            }

            /* Responsive */
            @media (min-width: 768px) {
                .menu-nav {
                    width: 350px;
                    left: -370px;
                }

                .menu-header h3 {
                    font-size: 1.25rem;
                }

                .menu-item {
                    font-size: 1rem;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', estilos);
}

// Función para inicializar el menú
function inicializarMenu() {
    // Inyectar estilos
    inyectarEstilosMenu();
    
    // Crear e inyectar el HTML del menú
    document.body.insertAdjacentHTML('afterbegin', crearMenuHTML());
    
    // Obtener elementos
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const menuNav = document.getElementById('menu-nav');
    const menuOverlay = document.getElementById('menu-overlay');
    
    // Función para abrir el menú
    function abrirMenu() {
        menuToggle.classList.add('active');
        menuNav.classList.add('open');
        menuOverlay.classList.add('open');
        document.body.classList.add('menu-open');
    }
    
    // Función para cerrar el menú
    function cerrarMenu() {
        menuToggle.classList.remove('active');
        menuNav.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('menu-open');
    }
    
    // Event listeners
    menuToggle.addEventListener('click', () => {
        if (menuNav.classList.contains('open')) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    });
    
    menuClose.addEventListener('click', cerrarMenu);
    menuOverlay.addEventListener('click', cerrarMenu);
    
    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuNav.classList.contains('open')) {
            cerrarMenu();
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
    inicializarMenu();
}