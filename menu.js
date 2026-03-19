// ============================================================================
// SISTEMA DE NAVEGACIÓN - Menu Hamburguesa
// ============================================================================

// Configuración de páginas del sistema organizadas por categorías
const MENU_CONFIG = {
    categorias: [
        {
            nombre: "Distribuciones Discretas",
            paginas: [
                { archivo: "index.html", nombre: "Hipergeométrica" },
                { archivo: "binomial.html", nombre: "Binomial" }
                // { archivo: "poisson.html", nombre: "Poisson" }  // Próximamente
            ]
        },
        {
            nombre: "Distribuciones Continuas",
            paginas: [
                { archivo: "normal.html", nombre: "Normal" } 
                // { archivo: "exponencial.html", nombre: "Exponencial" }
            ]
        },
        {
            nombre: "Otras Calculadoras",
            paginas: [
                { archivo: "valor-esperado.html", nombre: "Esperanza Matemática \"tab\"" }
            ]
        }
    ],
    animationDuration: 300, // ms
    mobileBreakpoint: 768 // px
};

// ============================================================================
// UTILIDADES
// ============================================================================

const Utils = {
    /**
     * Obtiene el nombre de archivo de la página actual
     * @returns {string} Nombre del archivo actual
     */
    getPaginaActual() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop();
        return filename || 'index.html';
    },

    /**
     * Sanitiza HTML para prevenir XSS
     * @param {string} str - String a sanitizar
     * @returns {string} String sanitizado
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Detecta si el dispositivo es táctil
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// ============================================================================
// GENERADOR DE HTML
// ============================================================================

const HTMLGenerator = {
    /**
     * Genera el HTML completo del menú
     * @returns {string} HTML del menú
     */
    crearMenuHTML() {
        const paginaActual = Utils.getPaginaActual();
        
        return `
            <div id="menu-hamburguesa" role="navigation" aria-label="Menú principal">
                ${this.crearBotonToggle()}
                ${this.crearNavegacion(paginaActual)}
                ${this.crearOverlay()}
            </div>
        `;
    },

    /**
     * Genera el botón hamburguesa
     * @returns {string} HTML del botón
     */
    crearBotonToggle() {
        return `
            <button 
                id="menu-toggle" 
                class="menu-toggle" 
                aria-label="Abrir menú de navegación"
                aria-expanded="false"
                aria-controls="menu-nav"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        `;
    },

    /**
     * Genera la navegación completa
     * @param {string} paginaActual - Archivo de la página actual
     * @returns {string} HTML de la navegación
     */
    crearNavegacion(paginaActual) {
        return `
            <nav id="menu-nav" class="menu-nav" aria-label="Menú de calculadoras">
                <div class="menu-header">
                    <h3>Calculadoras Estadísticas</h3>
                    <button 
                        id="menu-close" 
                        class="menu-close" 
                        aria-label="Cerrar menú"
                    >×</button>
                </div>
                <div class="menu-items" role="list">
                    ${this.crearMenuItems(paginaActual)}
                </div>
            </nav>
        `;
    },

    /**
     * Genera los items del menú organizados por categorías
     * @param {string} paginaActual - Archivo de la página actual
     * @returns {string} HTML de los items con categorías
     */
    crearMenuItems(paginaActual) {
        return MENU_CONFIG.categorias.map(categoria => {
            // Generar items de la categoría
            const itemsHTML = categoria.paginas.map(pagina => {
                const esActiva = pagina.archivo === paginaActual;
                const ariaCurrent = esActiva ? 'aria-current="page"' : '';
                const claseActiva = esActiva ? 'activo' : '';
                
                return `
                    <a 
                        href="${Utils.escapeHTML(pagina.archivo)}" 
                        class="menu-item ${claseActiva}"
                        ${ariaCurrent}
                        role="listitem"
                    >
                        ${Utils.escapeHTML(pagina.nombre)}
                    </a>
                `;
            }).join('');

            // Mostrar "Próximamente..." si la categoría está vacía
            const mensajeVacio = categoria.paginas.length === 0 
                ? '<div class="menu-empty">Próximamente...</div>' 
                : '';

            return `
                <div class="menu-category">
                    <div class="menu-category-header">${Utils.escapeHTML(categoria.nombre)}</div>
                    ${itemsHTML}
                    ${mensajeVacio}
                </div>
            `;
        }).join('');
    },

    /**
     * Genera el overlay
     * @returns {string} HTML del overlay
     */
    crearOverlay() {
        return '<div id="menu-overlay" class="menu-overlay" aria-hidden="true"></div>';
    }
};

// ============================================================================
// GESTOR DE ESTILOS
// ============================================================================

const StyleManager = {
    /**
     * Inyecta los estilos CSS del menú en el head
     */
    inyectarEstilos() {
        // Prevenir inyección duplicada
        if (document.getElementById('menu-styles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'menu-styles';
        styleElement.textContent = this.getEstilosCSS();
        document.head.appendChild(styleElement);
    },

    /**
     * Retorna los estilos CSS del menú
     * @returns {string} CSS del menú
     */
    getEstilosCSS() {
        return `
            /* ========================================
               MENÚ HAMBURGUESA - ESTILOS
               ======================================== */
            
            #menu-hamburguesa {
                position: fixed;
                z-index: 9999;
            }

            /* Botón Toggle */
            .menu-toggle {
                position: fixed;
                top: 1rem;
                left: 1rem;
                width: 50px;
                height: 50px;
                background: var(--accent-primary, #00774f);
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

            .menu-toggle:focus-visible {
                outline: 3px solid var(--accent-primary, #00774f);
                outline-offset: 3px;
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

            /* Panel de Navegación */
            .menu-nav {
                position: fixed;
                top: 0;
                left: -320px;
                width: 300px;
                height: 100vh;
                background: var(--bg-card, #ddf0e5);
                box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
                transition: left 0.3s ease;
                z-index: 10000;
                overflow-y: auto;
                overscroll-behavior: contain;
            }

            .menu-nav.open {
                left: 0;
            }

            /* Header del Menú */
            .menu-header {
                padding: 1.5rem 1.25rem;
                border-bottom: 2px solid var(--border, #d4d4c8);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-secondary, #ffffff);
                position: sticky;
                top: 0;
                z-index: 1;
            }

            .menu-header h3 {
                margin: 0;
                font-size: 1.1rem;
                color: var(--accent-primary, #00774f);
                font-weight: 600;
            }

            /* Botón Cerrar */
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
                line-height: 1;
            }

            .menu-close:hover {
                color: var(--accent-primary, #00774f);
            }

            .menu-close:focus-visible {
                outline: 2px solid var(--accent-primary, #00774f);
                outline-offset: 2px;
                border-radius: 4px;
            }

            /* Items del Menú */
            .menu-items {
                padding: 1rem 0;
            }

            /* Categorías del Menú */
            .menu-category {
                margin-bottom: 0.5rem;
            }

            .menu-category-header {
                padding: 0.75rem 1.5rem;
                font-size: 0.75rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: var(--text-secondary, #5a5a5a);
                background: var(--bg-secondary, #ffffff);
                border-top: 1px solid var(--border, #d4d4c8);
                border-bottom: 1px solid var(--border, #d4d4c8);
            }

            .menu-category:first-child .menu-category-header {
                border-top: none;
            }

            .menu-empty {
                padding: 1rem 1.5rem;
                color: var(--text-secondary, #5a5a5a);
                font-style: italic;
                font-size: 0.85rem;
                text-align: center;
                opacity: 0.7;
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

            .menu-item:hover,
            .menu-item:focus {
                background: var(--highlight, #e8f0eb);
                border-left-color: var(--accent-primary, #00774f);
                outline: none;
            }

            .menu-item.activo {
                background: var(--highlight, #e8f0eb);
                border-left-color: var(--accent-primary, #00774f);
                font-weight: 600;
                color: var(--accent-primary, #00774f);
            }

            /* Overlay */
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

            /* Bloqueo de scroll en body */
            body.menu-open {
                overflow: hidden;
            }

            /* Responsive - Desktop */
            @media (min-width: 768px) {
                .menu-nav {
                    width: 350px;
                    left: -370px;
                }

                .menu-header h3 {
                    font-size: 1.25rem;
                }

                .menu-category-header {
                    font-size: 0.8rem;
                    padding: 0.85rem 1.5rem;
                }

                .menu-item {
                    font-size: 1rem;
                    padding: 1.1rem 1.5rem;
                }

                .menu-empty {
                    font-size: 0.9rem;
                }
            }

            /* Reducir animaciones para usuarios con preferencias de movimiento reducido */
            @media (prefers-reduced-motion: reduce) {
                .menu-toggle,
                .menu-toggle span,
                .menu-nav,
                .menu-overlay,
                .menu-item,
                .menu-close {
                    transition: none;
                }
            }
        `;
    }
};

// ============================================================================
// CONTROLADOR DEL MENÚ
// ============================================================================

class MenuController {
    constructor() {
        this.elements = {};
        this.isOpen = false;
        this.isInitialized = false;
    }

    /**
     * Inicializa el menú completo
     */
    init() {
        if (this.isInitialized) {
            console.warn('Menu ya inicializado');
            return;
        }

        StyleManager.inyectarEstilos();
        this.insertarHTML();
        this.cachearElementos();
        this.attachEventListeners();
        this.isInitialized = true;
    }

    /**
     * Inserta el HTML del menú en el DOM
     */
    insertarHTML() {
        document.body.insertAdjacentHTML('afterbegin', HTMLGenerator.crearMenuHTML());
    }

    /**
     * Cachea referencias a elementos del DOM
     */
    cachearElementos() {
        this.elements = {
            toggle: document.getElementById('menu-toggle'),
            close: document.getElementById('menu-close'),
            nav: document.getElementById('menu-nav'),
            overlay: document.getElementById('menu-overlay'),
            body: document.body
        };

        // Validar que todos los elementos existen
        const missingElements = Object.entries(this.elements)
            .filter(([key, el]) => !el)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error('Elementos del menú no encontrados:', missingElements);
        }
    }

    /**
     * Adjunta event listeners
     */
    attachEventListeners() {
        // Toggle menú
        this.elements.toggle?.addEventListener('click', () => this.toggle());
        
        // Cerrar menú
        this.elements.close?.addEventListener('click', () => this.close());
        this.elements.overlay?.addEventListener('click', () => this.close());
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Mejorar accesibilidad con Tab
        this.elements.nav?.addEventListener('keydown', (e) => this.handleTabTrap(e));
    }

    /**
     * Abre el menú
     */
    open() {
        if (this.isOpen) return;

        this.elements.toggle?.classList.add('active');
        this.elements.nav?.classList.add('open');
        this.elements.overlay?.classList.add('open');
        this.elements.body?.classList.add('menu-open');
        
        // Actualizar ARIA
        this.elements.toggle?.setAttribute('aria-expanded', 'true');
        this.elements.overlay?.setAttribute('aria-hidden', 'false');
        
        // Foco en el primer item
        setTimeout(() => {
            this.elements.close?.focus();
        }, 100);

        this.isOpen = true;
    }

    /**
     * Cierra el menú
     */
    close() {
        if (!this.isOpen) return;

        this.elements.toggle?.classList.remove('active');
        this.elements.nav?.classList.remove('open');
        this.elements.overlay?.classList.remove('open');
        this.elements.body?.classList.remove('menu-open');
        
        // Actualizar ARIA
        this.elements.toggle?.setAttribute('aria-expanded', 'false');
        this.elements.overlay?.setAttribute('aria-hidden', 'true');
        
        // Devolver foco al botón toggle
        this.elements.toggle?.focus();

        this.isOpen = false;
    }

    /**
     * Alterna el estado del menú
     */
    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    /**
     * Maneja el trap de tabulación dentro del menú
     * @param {KeyboardEvent} e - Evento de teclado
     */
    handleTabTrap(e) {
        if (e.key !== 'Tab') return;

        const focusableElements = this.elements.nav?.querySelectorAll(
            'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Si Shift + Tab en el primer elemento, ir al último
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
        // Si Tab en el último elemento, ir al primero
        else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Destruye el menú y limpia event listeners
     */
    destroy() {
        if (!this.isInitialized) return;

        this.close();
        document.getElementById('menu-hamburguesa')?.remove();
        document.getElementById('menu-styles')?.remove();
        
        this.elements = {};
        this.isInitialized = false;
    }
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

// Crear instancia global del controlador
const menuController = new MenuController();

// Función de inicialización
function inicializarMenu() {
    menuController.init();
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
    inicializarMenu();
}

// Exportar para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { menuController, MENU_CONFIG };
}