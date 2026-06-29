export interface Athlete {

  id?: string;

  firstName: string;

  lastName: string;

  rut: string;

  email: string;

  phone: string;

  birthDate: Date;

  category: string;

  club: string;

  coach: string;

  country: string;

  region: string;

  city: string;

  address: string;

  photo: string;

  observations: string;

  active: boolean;

  createdAt: Date;

  updatedAt?: Date;

}