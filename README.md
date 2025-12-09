# Sistema de Registro de Personas - Supabase

Un sistema completo para el registro, edición y eliminación de personas usando Supabase como base de datos.

## 🚀 Características

- ✅ **Formulario de registro** con validación completa
- ✅ **Tabla dinámica** con todas las personas registradas  
- ✅ **Modal de edición** para actualizar datos
- ✅ **Confirmación de eliminación** con modal
- ✅ **Búsqueda en tiempo real** por cualquier campo
- ✅ **Notificaciones** de éxito y error
- ✅ **Diseño responsive** para móviles y desktop
- ✅ **Conexión Ajax** con Supabase
- ✅ **Validación de datos** en frontend y backend

## 📋 Campos de Persona

- **Nombres** (obligatorio, 2-50 caracteres)
- **Apellidos** (obligatorio, 2-50 caracteres)  
- **Cédula de Identidad** (obligatorio, único, 7-10 dígitos)
- **Email** (obligatorio, único, formato válido)
- **Teléfono** (obligatorio, formato válido)
- **Fecha de Nacimiento** (obligatorio, no futura)
- **Dirección** (obligatorio, mínimo 10 caracteres)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL)
- **Estilos**: CSS moderno con gradientes y animaciones
- **Base de Datos**: PostgreSQL con triggers y funciones

## 📁 Estructura del Proyecto

```
RegistroPersonas/
├── index.html              # Página principal
├── styles.css              # Estilos y diseño
├── config.js               # Configuración de Supabase
├── supabaseConnection.js   # Módulo de conexión y CRUD
├── app.js                  # Lógica principal de la aplicación
├── database_setup.sql      # Scripts de creación de BD
└── README.md              # Documentación
```

## ⚙️ Configuración

### 1. Configurar Supabase

1. **Crear cuenta en Supabase**: [https://supabase.com](https://supabase.com)
2. **Crear nuevo proyecto**
3. **Obtener credenciales**:
   - URL del proyecto
   - Clave anónima (anon key)

### 2. Configurar Base de Datos

1. **Ejecutar script SQL**:
   - Copia el contenido de `database_setup.sql`
   - Pega en el SQL Editor de Supabase
   - Ejecuta el script

2. **Verificar tabla creada**:
   - Ve a "Table Editor" en Supabase
   - Confirma que existe la tabla `personas`

### 3. Configurar Aplicación

1. **Editar `config.js`**:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    key: 'tu-clave-anonima-aquí',
    // ... resto de la configuración
};
```

2. **Configurar RLS (Row Level Security)**:
   - En Supabase ve a "Authentication" → "Policies"
   - Configura políticas según tus necesidades de seguridad

## 🚀 Instalación y Uso

### Opción 1: Servidor Local
```bash
# Usar Python 3
python -m http.server 8000

# Usar Node.js (si tienes http-server instalado)
npx http-server

# Usar PHP
php -S localhost:8000
```

### Opción 2: Abrir Directamente
- Simplemente abre `index.html` en tu navegador
- **Nota**: Algunas funciones pueden no funcionar debido a CORS

### Opción 3: Deploy en Vercel/Netlify
1. Sube el proyecto a GitHub
2. Conecta con Vercel o Netlify
3. Configura las variables de entorno si es necesario

## 📖 Uso de la Aplicación

### Registrar Persona
1. Llena el formulario con todos los campos requeridos
2. Haz clic en "Registrar Persona"
3. Verifica la notificación de éxito
4. La tabla se actualizará automáticamente

### Editar Persona
1. En la tabla, haz clic en "✏️ Editar"
2. Se abrirá un modal con los datos actuales
3. Modifica los campos necesarios
4. Haz clic en "Guardar Cambios"

### Eliminar Persona
1. En la tabla, haz clic en "🗑️ Eliminar"
2. Confirma la eliminación en el modal
3. La persona será eliminada permanentemente

### Buscar Personas
1. Usa la caja de búsqueda en la parte superior de la tabla
2. La búsqueda es en tiempo real
3. Busca por nombres, apellidos, cédula o email

## 🔧 Personalización

### Cambiar Campos de Validación
Edita `APP_CONFIG.validation` en `config.js`:
```javascript
validation: {
    minNameLength: 2,
    maxNameLength: 50,
    cedulaPattern: /^[0-9]{7,10}$/,
    phonePattern: /^[0-9+\-\s()]+$/,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}
```

### Modificar Estilos
- Edita `styles.css` para cambiar colores, fuentes y animaciones
- Los gradientes están definidos en las clases `.btn-*`
- El responsive está configurado con media queries

### Agregar Nuevos Campos
1. Modifica la tabla en Supabase
2. Actualiza `database_setup.sql`
3. Agrega campos en `index.html`
4. Actualiza validaciones en `supabaseConnection.js`

## 🔒 Seguridad

### Validaciones Implementadas
- **Frontend**: Validación HTML5 + JavaScript
- **Backend**: Constraints de PostgreSQL
- **Sanitización**: Escape de HTML para prevenir XSS
- **Validación de tipos**: Patrones regex para email, teléfono, cédula

### Configuración RLS (Row Level Security)
```sql
-- Ejemplo de política básica
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir operaciones autenticadas" ON personas
    FOR ALL USING (auth.role() = 'authenticated');
```

## 🐛 Solución de Problemas

### Error: "Configuración de Supabase no encontrada"
- Verifica que `config.js` esté cargado correctamente
- Confirma que las credenciales son correctas

### Error: "tabla personas no existe"  
- Ejecuta el script `database_setup.sql` en Supabase
- Verifica que el nombre de la tabla coincida en `config.js`

### Error de CORS
- Usa un servidor local (no abras index.html directamente)
- Configura CORS en Supabase si es necesario

### La tabla no carga datos
- Abre las herramientas de desarrollador (F12)
- Revisa errores en la consola
- Verifica la conexión a internet

## 📊 Funciones de Base de Datos

### Búsqueda Avanzada
```sql
-- Buscar personas por texto
SELECT * FROM search_personas('juan');

-- Obtener personas por rango de edad  
SELECT * FROM get_personas_by_age_range(18, 65);
```

### Estadísticas
```sql
-- Ver estadísticas generales
SELECT * FROM personas_stats;

-- Ver personas con edad calculada
SELECT * FROM personas_with_age;
```

### Auditoría
- Todos los cambios se registran en `personas_audit`
- Incluye datos anteriores y nuevos
- Rastrea usuario y timestamp

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la documentación de [Supabase](https://supabase.com/docs)
2. Abre un issue en el repositorio
3. Consulta los logs en la consola del navegador

---

**¡Desarrollado con ❤️ para el aprendizaje de nuevas tendencias en programación!**