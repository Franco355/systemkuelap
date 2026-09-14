export type HomeStats = {
    investigadores: number;
    universidades: number;
    paises: number;
    areasInvestigacion: number;
};

export type HomeMiembro = {
    id: number;
    nombre: string;
    universidad: string | null;
    pais: string | null;
    grado: string | null;
};

export type HomePais = {
    id: number;
    nombre: string;
};

export type HomeImagen = {
    id: number;
    nombre: string;
    url: string;
};

export type EmpresaValor = {
    id: number;
    nombre: string;
    descripcion: string;
};

export type HomeEvento = {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    fechaInicio: string;
    modalidad: string | null;
    tipo: string | null;
    lugar: string | null;
    inscripcion: string | null;
    estado: 'proxima' | 'pasada';
};
