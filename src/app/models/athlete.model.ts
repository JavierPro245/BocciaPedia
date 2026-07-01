export interface Athlete {

  id?: string;

  photo?: string;

  firstName: string;

  lastName: string;

  rut?: string;

  email?: string;

  phone?: string;

  birthDate?: Date;

  category: 'BC1' | 'BC2' | 'BC3' | 'BC4';

  dominantHand?: 'Derecha' | 'Izquierda' | 'Ambas';

  club?: string;

  trainerId?: string;

  assistantId?: string;

  diagnosis?: string;

  observations?: string;

  active: boolean;

}