export type UserRole =
  | 'admin'
  | 'trainer'
  | 'athlete'
  | 'assistant'
  | 'referee';

export interface TrainerProfile {

  phone?: string;

  club?: string;

  federation?: string;

  city?: string;

  specialization?: string;

}

export interface User {

  uid: string;

  email: string;

  displayName: string;

  photoURL: string;

  roles: UserRole[];

  approved: boolean;

  active: boolean;

  athleteId: string | null;

  trainerId: string | null;

  createdAt: number;

  updatedAt: number;

  // Perfil específico del entrenador
  trainerProfile?: TrainerProfile;

}