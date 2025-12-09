/**
 * Módulo de conexión y operaciones con Supabase
 * Proporciona funciones para realizar operaciones CRUD usando Ajax
 */

class SupabaseConnection {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.initializeConnection();
    }

    /**
     * Inicializa la conexión con Supabase
     */
    initializeConnection() {
        try {
            // Verificar que las configuraciones estén disponibles
            if (!window.SUPABASE_CONFIG || !window.SUPABASE_CONFIG.url || !window.SUPABASE_CONFIG.key) {
                throw new Error('Configuración de Supabase no encontrada. Verifica config.js');
            }

            // Crear cliente Supabase
            this.supabase = supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.key,
                window.SUPABASE_CONFIG.options || {}
            );

            this.isInitialized = true;
            console.log('✅ Conexión con Supabase inicializada correctamente');
            
            // Verificar conexión
            this.testConnection();
            
        } catch (error) {
            console.error('❌ Error al inicializar Supabase:', error);
            this.showNotification('Error de conexión: ' + error.message, 'error');
        }
    }

    /**
     * Prueba la conexión con Supabase
     */
    async testConnection() {
        try {
            const { data, error } = await this.supabase
                .from(window.TABLE_CONFIG.tableName)
                .select('count', { count: 'exact', head: true });
            
            if (error) {
                throw error;
            }
            
            console.log('✅ Conexión con la base de datos verificada');
        } catch (error) {
            console.error('❌ Error al verificar conexión:', error);
        }
    }

    /**
     * ===================================================
     * OPERACIONES CON LAPTOPS
     * ===================================================
     */

    /**
     * Obtiene todas las laptops de la base de datos
     * @returns {Promise<Object>} Resultado de la consulta
     */
    async getAllLaptops() {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            const { data, error, count } = await this.supabase
                .from('laptops')
                .select(`
                    id,
                    marca,
                    modelo,
                    numero_serie,
                    procesador,
                    memoria_ram,
                    almacenamiento,
                    tipo_almacenamiento,
                    pantalla_pulgadas,
                    tarjeta_grafica,
                    sistema_operativo,
                    precio_compra,
                    fecha_compra,
                    proveedor,
                    estado,
                    notas,
                    created_at,
                    updated_at
                `, { count: 'exact' })
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data || [],
                count: count,
                message: 'Datos de laptops obtenidos correctamente'
            };

        } catch (error) {
            console.error('❌ Error al obtener laptops:', error);
            return {
                success: false,
                data: [],
                error: error.message,
                message: 'Error al cargar los datos de laptops'
            };
        }
    }

    /**
     * Obtiene una laptop por ID
     * @param {number} id - ID de la laptop
     * @returns {Promise<Object>} Resultado de la consulta
     */
    async getLaptopById(id) {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            const { data, error } = await this.supabase
                .from('laptops')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data,
                message: 'Laptop encontrada'
            };

        } catch (error) {
            console.error('❌ Error al obtener laptop:', error);
            return {
                success: false,
                data: null,
                error: error.message,
                message: 'Error al buscar la laptop'
            };
        }
    }

    /**
     * Busca laptops por término de búsqueda
     * @param {string} searchTerm - Término de búsqueda
     * @returns {Promise<Object>} Resultado de la consulta
     */
    async searchLaptops(searchTerm) {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            const { data, error } = await this.supabase
                .from('laptops')
                .select('*')
                .or(`marca.ilike.%${searchTerm}%,modelo.ilike.%${searchTerm}%,numero_serie.ilike.%${searchTerm}%,procesador.ilike.%${searchTerm}%`)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data || [],
                message: `Se encontraron ${data?.length || 0} resultados`
            };

        } catch (error) {
            console.error('❌ Error en búsqueda de laptops:', error);
            return {
                success: false,
                data: [],
                error: error.message,
                message: 'Error en la búsqueda'
            };
        }
    }

    /**
     * Crea una nueva laptop
     * @param {Object} laptopData - Datos de la laptop
     * @returns {Promise<Object>} Resultado de la operación
     */
    async createLaptop(laptopData) {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            // Validar datos antes de enviar
            const validationResult = this.validateLaptopData(laptopData);
            if (!validationResult.isValid) {
                throw new Error(validationResult.message);
            }

            // Preparar datos para inserción
            const dataToInsert = {
                marca: laptopData.marca.trim(),
                modelo: laptopData.modelo.trim(),
                numero_serie: laptopData.numero_serie.trim(),
                procesador: laptopData.procesador.trim(),
                memoria_ram: parseInt(laptopData.memoria_ram),
                almacenamiento: parseInt(laptopData.almacenamiento),
                tipo_almacenamiento: laptopData.tipo_almacenamiento,
                pantalla_pulgadas: parseFloat(laptopData.pantalla_pulgadas),
                tarjeta_grafica: laptopData.tarjeta_grafica?.trim() || null,
                sistema_operativo: laptopData.sistema_operativo.trim(),
                precio_compra: parseFloat(laptopData.precio_compra),
                fecha_compra: laptopData.fecha_compra,
                proveedor: laptopData.proveedor?.trim() || null,
                estado: laptopData.estado || 'Activo',
                notas: laptopData.notas?.trim() || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('laptops')
                .insert([dataToInsert])
                .select();

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data[0],
                message: 'Laptop registrada exitosamente'
            };

        } catch (error) {
            console.error('❌ Error al crear laptop:', error);
            return {
                success: false,
                data: null,
                error: error.message,
                message: 'Error al registrar la laptop: ' + error.message
            };
        }
    }

    /**
     * Actualiza una laptop existente
     * @param {number} id - ID de la laptop
     * @param {Object} laptopData - Datos actualizados
     * @returns {Promise<Object>} Resultado de la operación
     */
    async updateLaptop(id, laptopData) {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            // Validar datos antes de enviar
            const validationResult = this.validateLaptopData(laptopData);
            if (!validationResult.isValid) {
                throw new Error(validationResult.message);
            }

            // Preparar datos para actualización (usando optional chaining para evitar undefined.trim())
            const dataToUpdate = {
                marca: laptopData.marca?.trim() || '',
                modelo: laptopData.modelo?.trim() || '',
                numero_serie: laptopData.numero_serie?.trim() || '',
                procesador: laptopData.procesador?.trim() || '',
                memoria_ram: parseInt(laptopData.memoria_ram),
                almacenamiento: parseInt(laptopData.almacenamiento),
                tipo_almacenamiento: laptopData.tipo_almacenamiento,
                pantalla_pulgadas: parseFloat(laptopData.pantalla_pulgadas),
                tarjeta_grafica: laptopData.tarjeta_grafica?.trim() || null,
                sistema_operativo: laptopData.sistema_operativo?.trim() || '',
                precio_compra: parseFloat(laptopData.precio_compra),
                fecha_compra: laptopData.fecha_compra,
                proveedor: laptopData.proveedor?.trim() || null,
                estado: laptopData.estado || 'Activo',
                notas: laptopData.notas?.trim() || null,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await this.supabase
                .from('laptops')
                .update(dataToUpdate)
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('No se encontró la laptop para actualizar');
            }

            return {
                success: true,
                data: data[0],
                message: 'Laptop actualizada exitosamente'
            };

        } catch (error) {
            console.error('❌ Error al actualizar laptop:', error);
            return {
                success: false,
                data: null,
                error: error.message,
                message: 'Error al actualizar la laptop: ' + error.message
            };
        }
    }

    /**
     * Elimina una laptop
     * @param {number} id - ID de la laptop
     * @returns {Promise<Object>} Resultado de la operación
     */
    async deleteLaptop(id) {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            const { data, error } = await this.supabase
                .from('laptops')
                .delete()
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('No se encontró la laptop para eliminar');
            }

            return {
                success: true,
                data: data[0],
                message: 'Laptop eliminada exitosamente'
            };

        } catch (error) {
            console.error('❌ Error al eliminar laptop:', error);
            return {
                success: false,
                data: null,
                error: error.message,
                message: 'Error al eliminar la laptop: ' + error.message
            };
        }
    }

    /**
     * Obtiene todas las laptops de una persona
     * @param {number} personId - ID de la persona
     * @returns {Promise<Object>} Resultado de la consulta
     */
    async getLaptopsByPersona(personId) {
        try {
            if (!this.isInitialized) {
                throw new Error('Conexión no inicializada');
            }

            const { data, error } = await this.supabase
                .from('laptops')
                .select('*')
                .order('fecha_compra', { ascending: false });

            if (error) {
                throw error;
            }

            return {
                success: true,
                data: data || [],
                message: `Se encontraron ${data?.length || 0} laptops`
            };

        } catch (error) {
            console.error('❌ Error al obtener laptops:', error);
            return {
                success: false,
                data: [],
                error: error.message,
                message: 'Error al buscar laptops'
            };
        }
    }

    /**
     * Valida los datos de una laptop
     * @param {Object} laptopData - Datos a validar
     * @returns {Object} Resultado de la validación
     */
    validateLaptopData(laptopData) {
        // Verificar campos requeridos
        const requiredFields = ['marca', 'modelo', 'numero_serie', 'procesador', 
                                'memoria_ram', 'almacenamiento', 'tipo_almacenamiento', 
                                'pantalla_pulgadas', 'precio_compra', 'fecha_compra'];
        
        for (const field of requiredFields) {
            if (!laptopData[field] && laptopData[field] !== 0) {
                return {
                    isValid: false,
                    message: `El campo ${field} es requerido`
                };
            }
        }

        // Validar memoria RAM
        if (parseInt(laptopData.memoria_ram) <= 0) {
            return {
                isValid: false,
                message: 'La memoria RAM debe ser mayor a 0'
            };
        }

        // Validar almacenamiento
        if (parseInt(laptopData.almacenamiento) <= 0) {
            return {
                isValid: false,
                message: 'El almacenamiento debe ser mayor a 0'
            };
        }

        // Validar precio
        if (parseFloat(laptopData.precio_compra) <= 0) {
            return {
                isValid: false,
                message: 'El precio debe ser mayor a 0'
            };
        }

        // Validar tipo de almacenamiento
        const validTypes = ['SSD', 'HDD', 'eMMC'];
        if (!validTypes.includes(laptopData.tipo_almacenamiento)) {
            return {
                isValid: false,
                message: 'Tipo de almacenamiento no válido'
            };
        }

        return {
            isValid: true,
            message: 'Datos válidos'
        };
    }

    /**
     * Muestra una notificación al usuario
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Esta función será implementada en el archivo principal de la aplicación
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
}

// Crear instancia global de la conexión
if (typeof window !== 'undefined') {
    window.supabaseConnection = new SupabaseConnection();
}