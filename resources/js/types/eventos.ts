export type EstadoEventoNombre =
    | 'Programado'
    | 'En curso'
    | 'Finalizado'
    | 'Cancelado'
    | 'Pospuesto';

export type AdminEvento = {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    tipo: string | null;
    idTipoEvento: number;
    modalidad: string | null;
    idModalidad: number;
    estado: EstadoEventoNombre;
    esManual: boolean;
    fechaInicio: string;
    fechaFin: string;
    fecInicioInscripcion: string;
    fecFinInscripcion: string;
    lugar: string | null;
    inscripcion: string | null;
    creadoEn: string | null;
    actualizadoEn: string | null;
};

export type LookupOption = {
    id: number;
    nombre: string;
};
