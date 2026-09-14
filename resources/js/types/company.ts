export type RedSocial = {
    id: number;
    tipo: string;
    enlace: string;
};

export type Empresa = {
    nombre: string;
    nombreCorto: string;
    descripcion: string;
    correo: string | null;
    telefono: string | null;
    direccion: string | null;
    redes: RedSocial[];
};
