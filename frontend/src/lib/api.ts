// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Interfaz para el docente que viene del backend
export interface DocenteAPI {
    id: number;
    nIdentificacion?: string;
    rtn?: string;
    primerNombre?: string;
    segundoNombre?: string;
    tercerNombre?: string;
    primerApellido?: string;
    segundoApellido?: string;
    genero?: string;
    telefono1?: string;
    telefono2?: string;
    fechaNacimiento?: Date;
    correo1?: string;
    correo2?: string;
    direccionResidencia?: string;
    idMunicipioResidencia?: number;
    grupoEtnicoTexto?: string;
    municipioResidencia?: {
        id: number;
        nombres: string;
    };
}

/**
 * Buscar un docente por su número de identificación (DNI)
 * @param identificacion - Número de identificación del docente
 * @returns Docente encontrado o null si no existe
 */
export async function buscarDocentePorDNI(identificacion: string): Promise<DocenteAPI | null> {
    try {
        const url = `${API_BASE_URL}/eventos/docente/${identificacion}`;
        console.log('🔍 Buscando docente en:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('📡 Respuesta del servidor:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        if (response.status === 404) {
            console.log('❌ Docente no encontrado (404)');
            return null;
        }

        if (!response.ok) {
            throw new Error(`Error al buscar docente: ${response.statusText}`);
        }

        const docente: DocenteAPI = await response.json();
        console.log('✅ Docente encontrado:', docente);
        return docente;
    } catch (error) {
        console.error('💥 Error al buscar docente:', error);
        throw error;
    }
}

/**
 * Registrar un nuevo docente en un evento
 * @param eventoId - ID del evento
 * @param docenteData - Datos del docente a registrar
 */
export async function registrarDocenteEnEvento(
    eventoId: string,
    docenteData: {
        dni: string;
        nombre: string;
        telefono: string;
        genero: string;
        fechaNacimiento: string;
        discapacidad: string;
        detalleDiscapacidad?: string;
        municipio: string;
        grupoEtnico: string;
    }
) {
    try {
        const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(docenteData),
        });

        if (!response.ok) {
            throw new Error(`Error al registrar docente: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al registrar docente:', error);
        throw error;
    }
}

/**
 * Formatear el nombre completo del docente
 */
export function formatearNombreCompleto(docente: DocenteAPI): string {
    const nombres = [
        docente.primerNombre,
        docente.segundoNombre,
        docente.tercerNombre
    ].filter(Boolean).join(' ');

    const apellidos = [
        docente.primerApellido,
        docente.segundoApellido
    ].filter(Boolean).join(' ');

    return `${nombres} ${apellidos}`.trim();
}
