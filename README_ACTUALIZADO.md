# Sistema de Registro de Personas y Laptops 🚀

Un sistema completo y moderno para registrar y gestionar información de personas y sus laptops, construido con Supabase y JavaScript vanilla.

## 📋 Características Principales

### Gestión de Personas
- ✅ Registro de personas con información completa
- ✅ Edición de datos personales
- ✅ Eliminación de registros
- ✅ Búsqueda avanzada
- ✅ Validación de datos en tiempo real
- ✅ Auditoría completa de cambios

### Gestión de Laptops (NUEVO)
- ✅ Registro de laptops con especificaciones técnicas completas
- ✅ Asociación de laptops con personas propietarias
- ✅ Edición de información de laptops
- ✅ Eliminación de registros de laptops
- ✅ Búsqueda de laptops por marca, modelo, procesador, etc.
- ✅ Control de estado (Activo, Inactivo, Dañado, Reparación, Vendido)
- ✅ Seguimiento de inventario con precios
- ✅ Auditoría de operaciones

## 📊 Especificaciones Técnicas

### Base de Datos
- **Motor**: PostgreSQL (Supabase)
- **Tablas principales**:
  - `personas`: Información de personas registradas
  - `laptops`: Catálogo de laptops
  - `personas_audit`: Historial de cambios en personas
  - `laptops_audit`: Historial de cambios en laptops

### Campos de Laptops
- Información básica: Marca, Modelo, Número de Serie
- Especificaciones: Procesador, RAM, Almacenamiento, Pantalla
- Sistema: SO, Tarjeta Gráfica
- Compra: Precio, Fecha, Proveedor
- Estado y Notas

### Vistas Disponibles
- `personas_with_age`: Personas con edad calculada
- `laptops_with_owner`: Laptops con información del propietario
- `personas_stats`: Estadísticas de personas
- `laptops_stats`: Estadísticas de laptops

## 🛠️ Instalación

### Requisitos Previos
- Cuenta de Supabase
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor web local o remoto

### Pasos de Instalación

#### 1. Crear Proyecto en Supabase
1. Ir a [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Copiar URL y API KEY

#### 2. Configurar Base de Datos
1. Ir a SQL Editor en Supabase
2. Ejecutar el script `database_setup_transactional.sql`
3. Esperar confirmación de creación exitosa

#### 3. Configurar Credenciales
Editar `config.js`:
```javascript
window.SUPABASE_CONFIG = {
    url: 'TU_URL_SUPABASE',
    key: 'TU_API_KEY_SUPABASE',
    options: {}
};
```

#### 4. Servir la Aplicación
```bash
# Con Python 3
python -m http.server 8000

# O con Node.js (http-server)
npx http-server

# O con Live Server en VS Code
# Extensión: Live Server
```

5. Acceder a `http://localhost:8000`

## 📱 Uso de la Aplicación

### Interfaz
- **Pestañas de Navegación**: Cambiar entre "Personas" y "Laptops"
- **Formularios**: Registrar nuevos datos
- **Tabla**: Visualizar todos los registros
- **Búsqueda**: Filtrar registros en tiempo real
- **Acciones**: Editar o eliminar registros

### Registro de Personas
1. Ir a pestaña "Personas"
2. Completar formulario con datos personales
3. Click en "Registrar Persona"
4. Los datos aparecerán inmediatamente en la tabla

### Registro de Laptops
1. Ir a pestaña "Laptops"
2. Seleccionar persona propietaria
3. Completar especificaciones técnicas
4. Click en "Registrar Laptop"
5. La laptop aparecerá en la tabla con información del propietario

### Búsqueda
- **Personas**: Buscar por nombre, apellido, cédula, email
- **Laptops**: Buscar por marca, modelo, procesador, propietario

### Edición
1. Hacer click en botón "✏️ Editar"
2. Modificar datos en el modal
3. Click en "Guardar Cambios"

### Eliminación
1. Hacer click en botón "🗑️ Eliminar"
2. Confirmar eliminación en modal
3. El registro se eliminará permanentemente

## 📁 Estructura de Archivos

```
RegistroPersonas/
├── index.html                          # Interfaz HTML
├── styles.css                          # Estilos CSS
├── app.js                              # Lógica principal de la aplicación
├── config.js                           # Configuración de credenciales
├── supabaseConnection.js              # Conexión a Supabase y operaciones CRUD
├── database_setup_transactional.sql   # Script de creación de BD
└── README.md                           # Documentación original
```

## 🔐 Seguridad

### Validaciones
- ✅ Validación de datos en cliente
- ✅ Validación en base de datos
- ✅ Prevención de XSS
- ✅ Comprobación de edad válida
- ✅ Formatos de email y teléfono

### Row Level Security (RLS)
Para implementar RLS en Supabase:

```sql
-- Habilitar RLS en tabla personas
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Crear política de lectura
CREATE POLICY "Permitir lectura pública"
ON personas FOR SELECT
USING (true);

-- Crear política de escritura
CREATE POLICY "Permitir inserción autenticada"
ON personas FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

## 📊 Estadísticas y Reportes

### Vistas de Datos Disponibles
- Estadísticas de personas por edad
- Estadísticas de laptops por estado
- Valor total de inventario
- Promedio de precios

## 🐛 Solución de Problemas

### Error: "Configuración de Supabase no encontrada"
- Verificar que `config.js` esté correctamente configurado
- Revisar URL y API KEY

### Error: "Tabla no existe"
- Ejecutar script `database_setup_transactional.sql` en Supabase
- Verificar que no haya errores en la ejecución

### Las laptops no se cargan
- Verificar que la tabla `laptops` exista en Supabase
- Confirmar relación entre `laptops` y `personas`

### Búsqueda lenta
- Verificar que los índices estén creados
- Consultar información en base de datos

## 🚀 Mejoras Futuras

- [ ] Exportar a CSV/Excel
- [ ] Impresión de etiquetas
- [ ] Reportes en PDF
- [ ] Gráficos de estadísticas
- [ ] Sincronización offline
- [ ] Aplicación móvil
- [ ] Autenticación de usuarios
- [ ] Múltiples perfiles de acceso

## 📞 Soporte

Para reportar problemas o sugerencias:
1. Verificar console del navegador (F12)
2. Revisar logs en Supabase
3. Validar estructura de datos

## 📄 Licencia

Este proyecto está disponible bajo licencia MIT.

## 👨‍💻 Autor

Desarrollado por Ramiro - 2025

---

**Última actualización**: 18 de noviembre de 2025
**Versión**: 2.0 (Con soporte para Laptops)
