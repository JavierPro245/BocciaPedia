export type Gender = 'male' | 'female';

export type DominantHand = 'Derecha' | 'Izquierda';

export type AthleteCategory = 'BC1' | 'BC2' | 'BC3' | 'BC4';

export interface Athlete {

  // ==========================
  // Identificación
  // ==========================

  id: string;

  rut: string;

  firstName: string;

  lastName: string;

  fullName: string;

  // ==========================
  // Cuenta
  // ==========================

  linkedUserId: string | null;

  trainerId?: string;

  // ==========================
  // Contacto
  // ==========================

  email?: string;

  phone?: string;

  // ==========================
  // Fotografía
  // ==========================

  photo?: string;

  // ==========================
  // Datos personales
  // ==========================

  birthDate?: Date;

  gender?: Gender;

  nationality?: string;

  city?: string;

  // ==========================
  // Información deportiva
  // ==========================

  category: AthleteCategory;

  club?: string;

  federation?: string;

  dominantHand?: DominantHand;

  ranking?: number;

  // ==========================
  // Observaciones
  // ==========================

  observations?: string;

  // ==========================
  // Estado
  // ==========================

  active: boolean;

  // ==========================
  // Auditoría
  // ==========================

  createdAt?: any;

  updatedAt?: any;

}