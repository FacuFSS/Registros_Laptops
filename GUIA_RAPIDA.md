# 🚀 GUÍA RÁPIDA DE USO - Sistema de Registro de Personas y Laptops

## ⚡ Inicio Rápido (5 minutos)

### Paso 1: Configurar Supabase (2 minutos)
```javascript
// Editar config.js
window.SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    options: {}
};
```

### Paso 2: Crear Base de Datos (2 minutos)
1. Ir a Supabase → SQL Editor
2. Copiar contenido de `database_setup_transactional.sql`
3. Pegar y ejecutar
4. Esperar confirmación ✅

### Paso 3: Ejecutar Servidor Local (1 minuto)
```bash
# En carpeta del proyecto
python -m http.server 8000
# O
npx http-server
```

### Paso 4: Acceder a la Aplicación
```
http://localhost:8000
```

---

## 📱 Interfaz Principal

```
┌─────────────────────────────────────────────┐
│   Sistema de Registro de Personas y Laptops  │
├─────────────────────────────────────────────┤
│  [Personas] [Laptops]                       │
├─────────────────────────────────────────────┤
│  Formulario de Registro                      │
│  [Campos del formulario]                     │
│  [Registrar] [Limpiar]                       │
├─────────────────────────────────────────────┤
│  Lista de Registros                         │
│  [Actualizar] [Buscar...]                   │
│  ┌──────────────────────────────────────┐  │
│  │ ID │ Datos │ ... │ [Editar] [Eliminar] │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 👥 Uso: PERSONAS

### Registrar Persona
1. Click en pestaña **"Personas"**
2. Rellenar formulario:
   - Nombres: `Juan`
   - Apellidos: `García`
   - Cédula: `12345678`
   - Email: `juan@email.com`
   - Teléfono: `70123456`
   - Fecha Nacimiento: `1990-05-15`
   - Dirección: `Av. Principal 123`
3. Click en **"Registrar Persona"** ✅

### Buscar Persona
1. En tabla de personas, escribir en buscador
2. Busca por: nombre, apellido, cédula, email
3. Resultados se filtran en tiempo real

### Editar Persona
1. Click en botón **"✏️ Editar"**
2. Se abre modal con datos
3. Modificar lo necesario
4. Click en **"Guardar Cambios"** ✅

### Eliminar Persona
1. Click en botón **"🗑️ Eliminar"**
2. Confirmar en modal
3. Se elimina inmediatamente ✅

---

## 💻 Uso: LAPTOPS (NUEVO)

### Registrar Laptop
1. Click en pestaña **"Laptops"**
2. Formulario en 3 secciones:

**Sección 1: Información Básica**
```
Persona: [Seleccionar Juan García▼]
Marca: [Dell]
Modelo: [XPS 13 Plus]
Número de Serie: [DL-XPS13-001]
```

**Sección 2: Especificaciones**
```
Procesador: [Intel Core i7-1360P]
RAM: [16] GB
Almacenamiento: [512] GB
Tipo Almacenamiento: [SSD▼]
Pantalla: [13.4] pulgadas
Tarjeta Gráfica: [Intel Iris Xe Graphics]
Sistema Operativo: [Windows 11 Pro]
```

**Sección 3: Compra y Estado**
```
Precio: [1500.00]
Fecha Compra: [2024-01-15]
Proveedor: [Dell Store]
Estado: [Activo▼]
Notas: [En perfecto estado]
```

3. Click en **"Registrar Laptop"** ✅

### Buscar Laptop
1. En tabla de laptops, escribir en buscador
2. Busca por:
   - Marca (Dell, HP, Lenovo, etc.)
   - Modelo (XPS, Pavilion, etc.)
   - Procesador
   - Propietario

### Editar Laptop
1. Click en **"✏️ Editar"**
2. Modal con todos los campos
3. Cambiar estado, precio, etc.
4. Click en **"Guardar Cambios"** ✅

### Cambiar Estado de Laptop
1. Abrir para editar: **"✏️ Editar"**
2. Cambiar campo **"Estado"** a:
   - **Activo** (Disponible para usar)
   - **Inactivo** (Fuera de servicio)
   - **Dañado** (Requiere reparación)
   - **Reparación** (En proceso de reparación)
   - **Vendido** (Ya no disponible)
3. Guardar cambios ✅

### Eliminar Laptop
1. Click en **"🗑️ Eliminar"**
2. Confirmar eliminación
3. Se elimina inmediatamente ✅

---

## 🔍 Búsquedas Avanzadas

### En Personas
```
Nombre: "Juan" → Encuentra "Juan García"
Apellido: "García" → Encuentra "Juan García"
Cédula: "1234" → Encuentra "12345678"
Email: "juan@" → Encuentra "juan@email.com"
```

### En Laptops
```
Marca: "Dell" → Encuentra todas las Dell
Modelo: "XPS" → Encuentra "XPS 13 Plus"
Procesador: "Intel" → Encuentra "Intel Core i7"
Propietario: "Juan" → Encuentra laptops de Juan
```

---

## 🎯 Estados de Laptop Explicados

| Estado | Descripción | Color |
|--------|-------------|-------|
| **Activo** | Laptop en uso, disponible | 🟢 Verde |
| **Inactivo** | No en uso, guardada | ⚪ Gris |
| **Dañado** | Con problemas, no funciona | 🔴 Rojo |
| **Reparación** | En proceso de reparo | 🟡 Amarillo |
| **Vendido** | Ya vendida/entregada | 🔵 Azul |

---

## ⚙️ Configuración Avanzada

### Habilitar Row Level Security (Seguridad)
```sql
-- En Supabase SQL Editor
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Lectura pública"
ON personas FOR SELECT USING (true);

CREATE POLICY "Lectura pública"
ON laptops FOR SELECT USING (true);
```

### Ver Auditoría de Cambios
```sql
-- Últimos cambios en personas
SELECT * FROM personas_audit 
ORDER BY changed_at DESC 
LIMIT 10;

-- Últimos cambios en laptops
SELECT * FROM laptops_audit 
ORDER BY changed_at DESC 
LIMIT 10;
```

### Estadísticas
```sql
-- Estadísticas de personas
SELECT * FROM personas_stats;

-- Estadísticas de laptops
SELECT * FROM laptops_stats;
```

---

## 🚨 Errores Comunes y Soluciones

### ❌ "Configuración de Supabase no encontrada"
```
✅ Solución:
1. Abrir config.js
2. Copiar URL y KEY correctos de Supabase
3. Guardar y recargar navegador
```

### ❌ "Tabla no existe"
```
✅ Solución:
1. Ir a Supabase → SQL Editor
2. Ejecutar database_setup_transactional.sql
3. Esperar a que termine
4. Recargar aplicación
```

### ❌ "No se puede seleccionar persona"
```
✅ Solución:
1. Ir a pestaña de Personas
2. Registrar al menos una persona
3. Volver a pestaña de Laptops
4. El dropdown se actualizará automáticamente
```

### ❌ "Error al guardar datos"
```
✅ Solución:
1. Abrir consola (F12)
2. Ver mensaje de error
3. Revisar que todos los campos tengan valores válidos
4. Intentar nuevamente
```

### ❌ "Datos no aparecen en tabla"
```
✅ Solución:
1. Click en "Actualizar Tabla"
2. Esperar a que cargue
3. Si sigue sin aparecer, verificar conexión a Supabase
4. Revisar consola (F12) para errores
```

---

## 💡 Tips y Trucos

### 📌 Atajos de Teclado
```
ESC          → Cerrar cualquier modal
Tab          → Navegar entre campos
Enter        → Enviar formulario
Ctrl+F       → Buscar en página
```

### 🎨 Personalización de Estilos
Editar `styles.css` para cambiar:
- Colores del header
- Estilos de botones
- Tamaños de fuentes
- Anchos de columnas

### 📊 Exportar Datos
Copiar datos de la tabla:
```
1. Seleccionar tabla (Ctrl+A)
2. Copiar (Ctrl+C)
3. Pegar en Excel o similar
```

### 🔄 Actualizar Automáticamente
```javascript
// En consola (F12)
setInterval(() => {
    app.loadPersonas();
    app.loadLaptops();
}, 5000); // Cada 5 segundos
```

---

## 📞 Información de Contacto

Para ayuda o preguntas:
1. Revisar `README_ACTUALIZADO.md`
2. Ver `CAMBIOS_REALIZADOS.md` para detalles técnicos
3. Consultar `CHECKLIST_VERIFICACION.md` para validaciones

---

## 📋 Checklist Antes de Usar

- [ ] Config.js configurado correctamente
- [ ] Base de datos creada en Supabase
- [ ] Script SQL ejecutado sin errores
- [ ] Navegador actualizado (Chrome, Firefox, Edge, Safari)
- [ ] Conexión a internet disponible
- [ ] Servidor local ejecutándose
- [ ] Consola sin errores (F12)

---

**¡Listo para usar! 🚀**

**Versión**: 2.0
**Última actualización**: 18 de noviembre de 2025
