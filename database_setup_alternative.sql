-- Versión alternativa del script SQL (sin DO blocks para creación de triggers)
-- Más directa y idempotente: usa DROP TRIGGER IF EXISTS antes de CREATE TRIGGER

BEGIN;

-- Función de logging simple (opcional)
CREATE OR REPLACE FUNCTION log_setup_progress(step_name TEXT, status TEXT DEFAULT 'SUCCESS')
RETURNS void AS $$
BEGIN
    IF status = 'SUCCESS' THEN
        RAISE NOTICE '✅ %: Completado exitosamente', step_name;
    ELSIF status = 'ERROR' THEN
        RAISE NOTICE '❌ %: Error detectado', step_name;
    ELSIF status = 'START' THEN
        RAISE NOTICE '🔄 %: Iniciando...', step_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Tabla laptops
CREATE TABLE IF NOT EXISTS laptops (
    id BIGSERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL CHECK (LENGTH(TRIM(marca)) >= 2),
    modelo VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(modelo)) >= 2),
    numero_serie VARCHAR(100) NOT NULL UNIQUE CHECK (LENGTH(TRIM(numero_serie)) >= 5),
    procesador VARCHAR(150) NOT NULL CHECK (LENGTH(TRIM(procesador)) >= 3),
    memoria_ram INTEGER NOT NULL CHECK (memoria_ram > 0),
    almacenamiento INTEGER NOT NULL CHECK (almacenamiento > 0),
    tipo_almacenamiento VARCHAR(50) NOT NULL CHECK (tipo_almacenamiento IN ('SSD', 'HDD', 'eMMC')),
    pantalla_pulgadas NUMERIC(3,1) NOT NULL CHECK (pantalla_pulgadas > 0),
    tarjeta_grafica VARCHAR(150),
    sistema_operativo VARCHAR(100) NOT NULL,
    precio_compra NUMERIC(10,2) NOT NULL CHECK (precio_compra > 0),
    fecha_compra DATE NOT NULL CHECK (fecha_compra <= CURRENT_DATE),
    proveedor VARCHAR(150),
    estado VARCHAR(50) NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Dañado', 'Reparación', 'Vendido')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_laptops_numero_serie ON laptops(numero_serie);
CREATE INDEX IF NOT EXISTS idx_laptops_marca ON laptops(marca);
CREATE INDEX IF NOT EXISTS idx_laptops_estado ON laptops(estado);
CREATE INDEX IF NOT EXISTS idx_laptops_fecha_compra ON laptops(fecha_compra DESC);
CREATE INDEX IF NOT EXISTS idx_laptops_fulltext ON laptops USING GIN (to_tsvector('spanish', marca || ' ' || modelo || ' ' || procesador));

-- Función para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Asegurar que no exista el trigger y crearlo (fuera de DO)
DROP TRIGGER IF EXISTS trigger_update_laptops_updated_at ON laptops;
CREATE TRIGGER trigger_update_laptops_updated_at
    BEFORE UPDATE ON laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tabla de auditoría y función
CREATE TABLE IF NOT EXISTS laptops_audit (
    audit_id BIGSERIAL PRIMARY KEY,
    laptop_id BIGINT,
    operation_type VARCHAR(10) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by TEXT DEFAULT current_user,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_laptops_audit_laptop_id ON laptops_audit(laptop_id);
CREATE INDEX IF NOT EXISTS idx_laptops_audit_operation ON laptops_audit(operation_type);
CREATE INDEX IF NOT EXISTS idx_laptops_audit_changed_at ON laptops_audit(changed_at DESC);

CREATE OR REPLACE FUNCTION laptops_audit_trigger()
RETURNS TRIGGER AS $func$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO laptops_audit (laptop_id, operation_type, old_data)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO laptops_audit (laptop_id, operation_type, old_data, new_data)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO laptops_audit (laptop_id, operation_type, new_data)
        VALUES (NEW.id, 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$func$ LANGUAGE plpgsql;

-- Crear trigger de auditoría asegurando idempotencia
DROP TRIGGER IF EXISTS trigger_laptops_audit ON laptops;
CREATE TRIGGER trigger_laptops_audit
    AFTER INSERT OR UPDATE OR DELETE ON laptops
    FOR EACH ROW EXECUTE FUNCTION laptops_audit_trigger();

-- Vista
CREATE OR REPLACE VIEW laptops_stats AS
SELECT 
    COUNT(*) AS total_laptops,
    COUNT(*) FILTER (WHERE estado = 'Activo') AS laptops_activas,
    COUNT(*) FILTER (WHERE estado = 'Inactivo') AS laptops_inactivas,
    COUNT(*) FILTER (WHERE estado = 'Reparación') AS en_reparacion,
    COUNT(*) FILTER (WHERE estado = 'Vendido') AS vendidas,
    ROUND(AVG(precio_compra), 2) AS precio_promedio,
    MAX(precio_compra) AS precio_maximo,
    MIN(precio_compra) AS precio_minimo,
    SUM(precio_compra) AS valor_total_inventario
FROM laptops;

COMMIT;
