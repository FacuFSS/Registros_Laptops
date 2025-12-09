/**
 * Aplicación Principal - Sistema de Registro de Laptops
 * Maneja la interfaz de usuario y las interacciones
 */

class LaptopsApp {
    constructor() {
        this.currentEditLaptopId = null;
        this.currentDeleteLaptopId = null;
        this.searchTimeout = null;
        this.laptops = [];
        this.filteredLaptops = [];
        
        // Inicializar la aplicación cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Inicializa la aplicación
     */
    async init() {
        console.log('🚀 Inicializando aplicación...');
        
        // Verificar que Supabase esté disponible
        if (!window.supabaseConnection) {
            this.showNotification('Error: Conexión con Supabase no disponible', 'error');
            return;
        }

        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar datos iniciales
        await this.loadLaptops();
        
        console.log('✅ Aplicación inicializada correctamente');
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Formulario de laptops
        const laptopForm = document.getElementById('laptopForm');
        if (laptopForm) {
            laptopForm.addEventListener('submit', (e) => this.handleLaptopFormSubmit(e));
        }

        // Formulario de edición de laptops
        const editLaptopForm = document.getElementById('editLaptopForm');
        if (editLaptopForm) {
            editLaptopForm.addEventListener('submit', (e) => this.handleEditLaptopSubmit(e));
        }

        // Búsqueda de laptops
        const searchLaptopsInput = document.getElementById('searchLaptopsInput');
        if (searchLaptopsInput) {
            searchLaptopsInput.addEventListener('input', (e) => this.handleLaptopSearch(e));
        }

        // Botón de actualizar tabla de laptops
        const refreshLaptopsBtn = document.getElementById('refreshLaptopsTable');
        if (refreshLaptopsBtn) {
            refreshLaptopsBtn.addEventListener('click', () => this.loadLaptops());
        }

        // Modales - botones de cerrar
        const closeButtons = document.querySelectorAll('.close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Modal de edición de laptops - botones
        const cancelEditLaptopBtn = document.getElementById('cancelEditLaptop');
        if (cancelEditLaptopBtn) {
            cancelEditLaptopBtn.addEventListener('click', () => this.closeEditLaptopModal());
        }

        // Modal de eliminación de laptops - botones
        const confirmDeleteLaptopBtn = document.getElementById('confirmDeleteLaptop');
        const cancelDeleteLaptopBtn = document.getElementById('cancelDeleteLaptop');
        
        if (confirmDeleteLaptopBtn) {
            confirmDeleteLaptopBtn.addEventListener('click', () => this.confirmDeleteLaptop());
        }
        
        if (cancelDeleteLaptopBtn) {
            cancelDeleteLaptopBtn.addEventListener('click', () => this.closeDeleteLaptopModal());
        }

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Tecla ESC para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    /**
     * Maneja el envío del formulario de laptops
     */
    async handleLaptopFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Mostrar loading
            submitBtn.innerHTML = '<span class="loading"></span>Registrando...';
            submitBtn.disabled = true;

            // Obtener datos del formulario
            const formData = new FormData(e.target);
            const laptopData = Object.fromEntries(formData.entries());

            // Crear laptop
            const result = await window.supabaseConnection.createLaptop(laptopData);

            if (result.success) {
                this.showNotification(result.message, 'success');
                e.target.reset(); // Limpiar formulario
                await this.loadLaptops(); // Recargar tabla
            } else {
                this.showNotification(result.message, 'error');
            }

        } catch (error) {
            console.error('Error en formulario de laptop:', error);
            this.showNotification('Error inesperado: ' + error.message, 'error');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Maneja el envío del formulario de edición de laptops
     */
    async handleEditLaptopSubmit(e) {
        e.preventDefault();
        
        if (!this.currentEditLaptopId) {
            this.showNotification('Error: ID de laptop no válido', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Mostrar loading
            submitBtn.innerHTML = '<span class="loading"></span>Guardando...';
            submitBtn.disabled = true;

            // Obtener datos del formulario
            const formData = new FormData(e.target);
            const laptopData = Object.fromEntries(formData.entries());

            // Actualizar laptop
            const result = await window.supabaseConnection.updateLaptop(this.currentEditLaptopId, laptopData);

            if (result.success) {
                this.showNotification(result.message, 'success');
                this.closeEditLaptopModal();
                await this.loadLaptops(); // Recargar tabla
            } else {
                this.showNotification(result.message, 'error');
            }

        } catch (error) {
            console.error('Error al actualizar laptop:', error);
            this.showNotification('Error inesperado: ' + error.message, 'error');
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Maneja la búsqueda de laptops
     */
    handleLaptopSearch(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        // Debounce para evitar búsquedas excesivas
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.filterLaptops(searchTerm);
        }, 300);
    }

    /**
     * Filtra las laptops según el término de búsqueda
     */
    filterLaptops(searchTerm) {
        if (!searchTerm) {
            this.filteredLaptops = [...this.laptops];
        } else {
            this.filteredLaptops = this.laptops.filter(laptop => {
                const searchText = `${laptop.marca} ${laptop.modelo} ${laptop.numero_serie} ${laptop.procesador} ${laptop.propietario}`.toLowerCase();
                return searchText.includes(searchTerm);
            });
        }
        
        this.renderLaptopsTable();
    }

    /**
     * Carga todas las laptops de la base de datos
     */
    async loadLaptops() {
        const refreshBtn = document.getElementById('refreshLaptopsTable');
        let originalText = '';
        
        try {
            originalText = refreshBtn ? refreshBtn.innerHTML : 'Actualizar Tabla';
            
            if (refreshBtn) {
                refreshBtn.innerHTML = '<span class="loading"></span>Cargando...';
                refreshBtn.disabled = true;
            }

            const result = await window.supabaseConnection.getAllLaptops();

            if (result.success) {
                this.laptops = result.data;
                this.filteredLaptops = [...this.laptops];
                this.renderLaptopsTable();
                
                if (result.count !== undefined) {
                    this.showNotification(`${result.count} laptops cargadas`, 'info');
                }
            } else {
                this.showNotification(result.message, 'error');
                this.laptops = [];
                this.filteredLaptops = [];
                this.renderLaptopsTable();
            }

        } catch (error) {
            console.error('Error al cargar laptops:', error);
            this.showNotification('Error al cargar datos: ' + error.message, 'error');
        } finally {
            if (refreshBtn) {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }
        }
    }

    /**
     * Renderiza la tabla de laptops
     */
    renderLaptopsTable() {
        const tableBody = document.getElementById('laptopsTableBody');
        if (!tableBody) return;

        // Limpiar tabla
        tableBody.innerHTML = '';

        if (this.filteredLaptops.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: #666;">
                        <strong>No se encontraron laptops registradas</strong>
                    </td>
                </tr>
            `;
            return;
        }

        // Renderizar filas
        this.filteredLaptops.forEach(laptop => {
            const row = this.createLaptopTableRow(laptop);
            tableBody.appendChild(row);
        });
    }

    /**
     * Crea una fila de la tabla para una laptop
     */
    createLaptopTableRow(laptop) {
        const row = document.createElement('tr');
        
        // Obtener color de estado
        let estadoColor = '#28a745'; // verde por defecto
        if (laptop.estado === 'Inactivo') estadoColor = '#6c757d';
        else if (laptop.estado === 'Dañado') estadoColor = '#dc3545';
        else if (laptop.estado === 'Reparación') estadoColor = '#ffc107';
        else if (laptop.estado === 'Vendido') estadoColor = '#007bff';

        row.innerHTML = `
            <td>${laptop.id}</td>
            <td>${this.escapeHtml(laptop.marca)}</td>
            <td>${this.escapeHtml(laptop.modelo)}</td>
            <td>${this.escapeHtml(laptop.procesador)}</td>
            <td>${laptop.memoria_ram} GB</td>
            <td>${laptop.almacenamiento} GB ${laptop.tipo_almacenamiento}</td>
            <td>$${Number(laptop.precio_compra).toLocaleString('es-ES', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td><span style="background: ${estadoColor}; color: white; padding: 5px 10px; border-radius: 5px;">${laptop.estado}</span></td>
            <td>
                <button class="btn btn-edit" onclick="app.editLaptop(${laptop.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-delete" onclick="app.deleteLaptop(${laptop.id}, '${this.escapeHtml(laptop.marca)} ${this.escapeHtml(laptop.modelo)}')">
                    🗑️ Eliminar
                </button>
            </td>
        `;

        return row;
    }

    /**
     * Abre el modal de edición para una laptop
     */
    async editLaptop(id) {
        try {
            const result = await window.supabaseConnection.getLaptopById(id);

            if (result.success && result.data) {
                this.currentEditLaptopId = id;
                this.fillEditLaptopForm(result.data);
                this.openEditLaptopModal();
            } else {
                this.showNotification('Error al cargar datos de la laptop', 'error');
            }

        } catch (error) {
            console.error('Error al editar laptop:', error);
            this.showNotification('Error inesperado: ' + error.message, 'error');
        }
    }

    /**
     * Llena el formulario de edición con los datos de la laptop
     */
    fillEditLaptopForm(laptop) {
        document.getElementById('editLaptopId').value = laptop.id;
        document.getElementById('editLaptopMarca').value = laptop.marca;
        document.getElementById('editLaptopModelo').value = laptop.modelo;
        document.getElementById('editLaptopNumeroSerie').value = laptop.numero_serie;
        document.getElementById('editLaptopProcesador').value = laptop.procesador;
        document.getElementById('editLaptopRam').value = laptop.memoria_ram;
        document.getElementById('editLaptopAlmacenamiento').value = laptop.almacenamiento;
        // Nuevo campo: tipo de almacenamiento
        const tipoElem = document.getElementById('editLaptopTipoAlmacenamiento');
        if (tipoElem) tipoElem.value = laptop.tipo_almacenamiento || 'SSD';
        document.getElementById('editLaptopPantalla').value = laptop.pantalla_pulgadas;
        // Sistema operativo
        const soElem = document.getElementById('editLaptopSO');
        if (soElem) soElem.value = laptop.sistema_operativo || '';
        document.getElementById('editLaptopPrecio').value = laptop.precio_compra;
        document.getElementById('editLaptopFechaCompra').value = laptop.fecha_compra;
        document.getElementById('editLaptopEstado').value = laptop.estado;
        // Campos opcionales añadidos
        const grafica = document.getElementById('editLaptopTarjetaGrafica');
        if (grafica) grafica.value = laptop.tarjeta_grafica || '';
        const proveedor = document.getElementById('editLaptopProveedor');
        if (proveedor) proveedor.value = laptop.proveedor || '';
        const notas = document.getElementById('editLaptopNotas');
        if (notas) notas.value = laptop.notas || '';
    }

    /**
     * Inicia el proceso de eliminación de una laptop
     */
    deleteLaptop(id, name) {
        this.currentDeleteLaptopId = id;
        document.getElementById('deleteLaptopName').textContent = name;
        this.openDeleteLaptopModal();
    }

    /**
     * Confirma y ejecuta la eliminación de laptop
     */
    async confirmDeleteLaptop() {
        if (!this.currentDeleteLaptopId) {
            this.showNotification('Error: ID de laptop no válido', 'error');
            return;
        }

        const confirmBtn = document.getElementById('confirmDeleteLaptop');
        const originalText = confirmBtn.innerHTML;

        try {
            // Mostrar loading
            confirmBtn.innerHTML = '<span class="loading"></span>Eliminando...';
            confirmBtn.disabled = true;

            const result = await window.supabaseConnection.deleteLaptop(this.currentDeleteLaptopId);

            if (result.success) {
                this.showNotification(result.message, 'success');
                this.closeDeleteLaptopModal();
                await this.loadLaptops(); // Recargar tabla
            } else {
                this.showNotification(result.message, 'error');
            }

        } catch (error) {
            console.error('Error al eliminar laptop:', error);
            this.showNotification('Error inesperado: ' + error.message, 'error');
        } finally {
            // Restaurar botón
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    /**
     * Abre el modal de edición de laptop
     */
    openEditLaptopModal() {
        const modal = document.getElementById('editLaptopModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Cierra el modal de edición de laptop
     */
    closeEditLaptopModal() {
        const modal = document.getElementById('editLaptopModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.currentEditLaptopId = null;
        }
    }

    /**
     * Abre el modal de eliminación de laptop
     */
    openDeleteLaptopModal() {
        const modal = document.getElementById('deleteLaptopModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Cierra el modal de eliminación de laptop
     */
    closeDeleteLaptopModal() {
        const modal = document.getElementById('deleteLaptopModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.currentDeleteLaptopId = null;
        }
    }

    /**
     * Maneja la búsqueda de laptops
     */
    handleLaptopSearch(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        // Debounce para evitar búsquedas excesivas
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.filterLaptops(searchTerm);
        }, 300);
    }

    /**
     * Filtra las laptops según el término de búsqueda
     */
    filterLaptops(searchTerm) {
        if (!searchTerm) {
            this.filteredLaptops = [...this.laptops];
        } else {
            this.filteredLaptops = this.laptops.filter(laptop => {
                const searchText = `${laptop.marca} ${laptop.modelo} ${laptop.numero_serie} ${laptop.procesador}`.toLowerCase();
                return searchText.includes(searchTerm);
            });
        }
        
        this.renderLaptopsTable();
    }

    /**
     * Cierra todos los modales
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
        this.currentEditLaptopId = null;
        this.currentDeleteLaptopId = null;
    }

    /**
     * Muestra una notificación al usuario
     */
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;

        // Limpiar clases anteriores
        notification.className = 'notification';
        notification.classList.add(type);
        
        // Establecer mensaje
        notification.textContent = message;
        notification.style.display = 'block';

        // Ocultar después del tiempo configurado
        setTimeout(() => {
            notification.style.display = 'none';
        }, window.APP_CONFIG?.notifications?.duration || 5000);
    }

    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Función global para mostrar notificaciones (usada por supabaseConnection)
window.showNotification = function(message, type) {
    if (window.app && typeof window.app.showNotification === 'function') {
        window.app.showNotification(message, type);
    }
};

// Inicializar aplicación
window.app = new LaptopsApp();