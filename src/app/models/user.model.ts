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

  // Tokens FCM de los dispositivos donde inició sesión (puede tener
  // más de uno), usados por la Cloud Function para mandar push.
  fcmTokens?: string[];

}