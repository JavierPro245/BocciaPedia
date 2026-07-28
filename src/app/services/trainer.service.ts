import { Injectable } from '@angular/core';

import {
  doc,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';

import { firestore } from '../firebase.config';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  constructor(
    private userService: UserService
  ) {}

  async assignTrainerRole(uid: string) {

    const user = await this.userService.getUser(uid);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const roles = [...user.roles];

    if (!roles.includes('trainer')) {
      roles.push('trainer');
    }

    await updateDoc(
      doc(firestore, 'users', uid),
      {
        roles,
        updatedAt: serverTimestamp()
      }
    );

  }

  async removeTrainerRole(uid: string) {

    const user = await this.userService.getUser(uid);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const roles = user.roles.filter(r => r !== 'trainer');

    await updateDoc(
      doc(firestore, 'users', uid),
      {
        roles,
        updatedAt: serverTimestamp()
      }
    );

  }

}