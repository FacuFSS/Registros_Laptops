# 🧪 Guía de Prueba - Sistema de Registro de Laptops

## Verificación de Cambios

### 1. Verificar `index.html`
```bash
# Buscar referencias a personas (no deben existir):
grep -c "personas" index.html  # Resultado esperado: 0 o mínimo
grep -c "personas-tab" index.html  # Resultado esperado: 0
grep -c "editPersonForm" index.html  # Resultado esperado: 0
grep -c "deletePersonName" index.html  # Resultado esperado: 0

# Verificar estructura de laptop:
grep -c "laptopForm" index.html  # Resultado esperado: 1
grep -c "editLaptopModal" index.html  # Resultado esperado: 1
grep -c "deleteLaptopModal" index.html  # Resultado esperado: 1
```

### 2. Verificar `app.js`
```bash
# No debe haber referencias a personas:
grep -c "loadPersonas" app.js  # Resultado esperado: 0
grep -c "handleFormSubmit(e)" app.js  # Resultado esperado: 0
grep -c "editPersona" app.js  # Resultado esperado: 0
grep -c "deletePersona" app.js  # Resultado esperado: 0
grep -c "PersonasApp" app.js  # Resultado esperado: 0 (debe ser LaptopsApp)

# Debe tener solo referencias a laptops:
grep -c "LaptopsApp" app.js  # Resultado esperado: 1
grep -c "handleLaptopFormSubmit" app.js  # Resultado esperado: 1
grep -c "loadLaptops" app.js  # Resultado esperado: 2+ (definición + uso)
```

### 3. Verificar `supabaseConnection.js`
```bash
# No debe haber métodos de personas:
grep -c "async getAllPersonas" supabaseConnection.js  # Resultado esperado: 0
grep -c "async createPersona" supabaseConnection.js  # Resultado esperado: 0
grep -c "validatePersonData" supabaseConnection.js  # Resultado esperado: 0

# Debe tener solo métodos de laptops:
grep -c "async getAllLaptops" supabaseConnection.js  # Resultado esperado: 1
grep -c "async createLaptop" supabaseConnection.js  # Resultado esperado: 1
grep -c "validateLaptopData" supabaseConnection.js  # Resultado esperado: 1
```

---

## Pruebas Funcionales

### Test 1: Carga de Página
1. Abrir `index.html` en navegador
2. **Esperado**: 
   - Título: "Sistema de Registro de Laptops"
   - Un formulario con 15 campos de laptop
   - Una tabla vacía (sin datos)
   - Notificación: "X laptops cargadas"

### Test 2: Crear Laptop
1. Completar formulario con datos de prueba:
   ```
   Marca: Dell
   Modelo: XPS 13
   Número de Serie: ABC123XYZ
   Procesador: Intel Core i7
   RAM: 16 GB
   Almacenamiento: 512 GB SSD
   Pantalla: 13.4"
   Tarjeta Gráfica: Intel Iris Xe
   S.O.: Windows 11
   Precio: 1299.99
   Fecha Compra: 2024-01-15
   Proveedor: Dell Direct
   Estado: Activo
   Notas: Prueba de creación
   ```
2. Click en "Registrar Laptop"
3. **Esperado**: 
   - Notificación: "Laptop registrada exitosamente"
   - Formulario se limpia
   - Nueva fila aparece en la tabla

### Test 3: Ver en Tabla
1. Verificar que la laptop aparezca con:
   - ID generado automáticamente
   - Marca: Dell
   - Modelo: XPS 13
   - Procesador: Intel Core i7
   - RAM: 16 GB
   - Almacenamiento: 512 GB SSD
   - Precio: $1,299.99
   - Estado: Activo (en color verde)
   - Botones: ✏️ Editar y 🗑️ Eliminar

### Test 4: Editar Laptop
1. Click en botón "✏️ Editar"
2. **Esperado**: Modal se abre con datos precompletados
3. Cambiar Estado a "Inactivo"
4. Click en "Guardar Cambios"
5. **Esperado**: 
   - Notificación: "Laptop actualizada exitosamente"
   - Modal se cierra
   - Tabla se recarga
   - Estado ahora aparece como "Inactivo" (en color gris)

### Test 5: Buscar Laptop
1. Escribir "Dell" en campo de búsqueda
2. **Esperado**: Tabla filtra mostrando solo laptops con "Dell" en marca/modelo
3. Limpiar búsqueda
4. **Esperado**: Tabla muestra todas las laptops nuevamente

### Test 6: Eliminar Laptop
1. Click en botón "🗑️ Eliminar"
2. **Esperado**: Modal de confirmación aparece
3. Click en "Eliminar"
4. **Esperado**: 
   - Notificación: "Laptop eliminada exitosamente"
   - Modal se cierra
   - Fila desaparece de tabla

### Test 7: Validación de Campos
1. Intentar enviar formulario sin llenar campos requeridos
2. **Esperado**: Validación HTML (campos requeridos)
3. Llenar solo algunos campos y enviar
4. **Esperado**: Mensaje de error por validación

---

## Verificación de Ausencia de Personas

### Test 8: No hay Interfaz de Personas
1. Verificar que NO existan:
   - ❌ Pestañas (tabs) en la interfaz
   - ❌ Sección de "Registro de Personas"
   - ❌ Campo "Persona (Propietario)" en formulario de laptop
   - ❌ Columna "Propietario" en tabla de laptops
   - ❌ Botones para editar/eliminar personas
   - ❌ Modal de edición de personas

### Test 9: No hay Llamadas a Métodos de Personas
1. Abrir DevTools (F12)
2. Ir a Consola
3. Verificar que no haya errores como:
   - "loadPersonas is not a function"
   - "editPersona is not a function"
   - "getAllPersonas is not a function"
4. **Esperado**: Console limpia (solo logs de inicialización)

---

## Checklist de Éxito

- [ ] Página carga sin errores
- [ ] Solo se ve formulario de laptop
- [ ] Tabla muestra solo laptops (sin personas)
- [ ] Crear laptop funciona
- [ ] Editar laptop funciona
- [ ] Eliminar laptop funciona
- [ ] Búsqueda de laptop funciona
- [ ] No hay referencias a personas en UI
- [ ] No hay errores en consola
- [ ] Notificaciones funcionan correctamente

---

## Si Hay Problemas

### Error: "app is not defined"
- Verificar que `<script src="app.js"></script>` esté al final del HTML
- Asegurarse que `config.js` y `supabaseConnection.js` carguen primero

### Error: "LaptopsApp is not a function"
- Revisar que la clase esté correctamente nombrada como `LaptopsApp` en app.js
- Verificar que `window.app = new LaptopsApp()` esté al final del archivo

### Tabla no carga laptops
- Abrir DevTools → Network
- Verificar que llamada a Supabase tenga status 200
- Revisar que la tabla `laptops` tenga datos en la BD

### Formulario no envía datos
- Verificar que `handleLaptopFormSubmit` esté definido
- Revisar que el atributo `id` del formulario sea exactamente `laptopForm`
- Verificar que Supabase esté inicializado correctamente

---

**Última actualización**: 2024
**Estado**: Listo para pruebas
