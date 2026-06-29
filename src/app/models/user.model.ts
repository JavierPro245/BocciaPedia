export interface User {
  uid: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;

  fotoPerfil: string;

  rol: 'Administrador' | 'Entrenador' | 'Deportista' | 'Arbitro';

  activo: boolean;
  fechaCreacion: Date;
}