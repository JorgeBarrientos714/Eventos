-- =====================================================
-- SCRIPT DE MIGRACIÓN - PASO 2: INSCRIPCIÓN A EVENTOS
-- Tabla: NET_INVITADOS_DOCENTES
-- Fecha: 21 de enero de 2026
-- =====================================================

-- 1. Crear tabla NET_INVITADOS_DOCENTES
CREATE TABLE NET_INVITADOS_DOCENTES (
    ID_INVITADO NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ID_REGISTRO_EVENTO NUMBER NOT NULL,
    DNI_INVITADO VARCHAR2(20) NOT NULL,
    NOMBRE_INVITADO VARCHAR2(200) NOT NULL,
    CONSTRAINT FK_INV_DOC_REGISTRO FOREIGN KEY (ID_REGISTRO_EVENTO) 
        REFERENCES NET_REGISTRO_EVENTOS(ID_REGISTRO_EVENTO) ON DELETE CASCADE
);

-- 2. Crear índices para mejorar el rendimiento
CREATE INDEX IDX_INVITADO_REGISTRO ON NET_INVITADOS_DOCENTES(ID_REGISTRO_EVENTO);
CREATE INDEX IDX_INVITADO_DNI ON NET_INVITADOS_DOCENTES(DNI_INVITADO);

-- 3. Agregar comentarios a la tabla y columnas
COMMENT ON TABLE NET_INVITADOS_DOCENTES IS 'Tabla de invitados que los docentes llevan a los eventos';
COMMENT ON COLUMN NET_INVITADOS_DOCENTES.ID_INVITADO IS 'ID único del invitado (autogenerado)';
COMMENT ON COLUMN NET_INVITADOS_DOCENTES.ID_REGISTRO_EVENTO IS 'Referencia al registro del evento del docente';
COMMENT ON COLUMN NET_INVITADOS_DOCENTES.DNI_INVITADO IS 'Número de identidad del invitado';
COMMENT ON COLUMN NET_INVITADOS_DOCENTES.NOMBRE_INVITADO IS 'Nombre completo del invitado';

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. La columna ID_INVITADO se genera automáticamente (IDENTITY)
-- 2. La constraint ON DELETE CASCADE eliminará los invitados si se borra el registro del evento
-- 3. Los índices mejoran las consultas por registro de evento y DNI
-- 4. Asegurarse de que NET_REGISTRO_EVENTOS ya existe antes de ejecutar

-- =====================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- =====================================================
-- Para verificar que la tabla se creó correctamente:
-- SELECT * FROM USER_TABLES WHERE TABLE_NAME = 'NET_INVITADOS_DOCENTES';
-- SELECT * FROM USER_CONSTRAINTS WHERE TABLE_NAME = 'NET_INVITADOS_DOCENTES';
-- SELECT * FROM USER_INDEXES WHERE TABLE_NAME = 'NET_INVITADOS_DOCENTES';

-- =====================================================
-- ROLLBACK (en caso de necesitar revertir)
-- =====================================================
-- DROP TABLE NET_INVITADOS_DOCENTES CASCADE CONSTRAINTS;
