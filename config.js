// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto Supabase

const SUPABASE_CONFIG = {
    url: 'https://afpotlocoktzjakpcmnl.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcG90bG9jb2t0empha3BjbW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MDQ5MzgsImV4cCI6MjA3OTA4MDkzOH0.RFl05JodoRCHbYYvbHJjqxmKEl5u0WuqaeyYuXbl9WA',
    
    // Configuración adicional
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        realtime: {
            params: {
                eventsPerSecond: 2
            }
        }
    }
};

// Configuración de la tabla
const TABLE_CONFIG = {
    tableName: 'laptops', // Nombre de la tabla en Supabase
    
    // Campos de la tabla
    fields: {
        id: 'id',
        marca: 'marca',
        modelo: 'modelo',
        numero_serie: 'numero_serie',
        procesador: 'procesador',
        memoria_ram: 'memoria_ram',
        almacenamiento: 'almacenamiento',
        tipo_almacenamiento: 'tipo_almacenamiento',
        pantalla_pulgadas: 'pantalla_pulgadas',
        tarjeta_grafica: 'tarjeta_grafica',
        sistema_operativo: 'sistema_operativo',
        precio_compra: 'precio_compra',
        fecha_compra: 'fecha_compra',
        proveedor: 'proveedor',
        estado: 'estado',
        notas: 'notas',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
};

// Configuración de la aplicación
const APP_CONFIG = {
    // Configuración de notificaciones
    notifications: {
        duration: 5000, // Duración en milisegundos
        showSuccess: true,
        showErrors: true,
        showInfo: true
    },
    
    // Configuración de la tabla
    table: {
        itemsPerPage: 10,
        enableSearch: true,
        enableSort: true
    },
    
    // Validaciones
    validation: {
        minNameLength: 2,
        maxNameLength: 50,
        cedulaPattern: /^[0-9]{7,10}$/,
        phonePattern: /^[0-9+\-\s()]+$/,
        emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
};

// Exportar configuraciones para uso global
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
    window.TABLE_CONFIG = TABLE_CONFIG;
    window.APP_CONFIG = APP_CONFIG;
}