import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private currentUserSubject =
    new BehaviorSubject<User | null>(null);

  currentUser$ =
    this.currentUserSubject.asObservable();

  // Indica si Firebase ya respondió por primera vez
  private initializedSubject =
    new BehaviorSubject<boolean>(false);

  initialized$ =
    this.initializedSubject.asObservable();

  constructor() { }

  setUser(user: User | null) {

    this.currentUserSubject.next(user);

    this.initializedSubject.next(true);

  }

  getUser() {

    return this.currentUserSubject.value;

  }

  isInitialized() {

    return this.initializedSubject.value;

  }

  clear() {

    this.currentUserSubject.next(null);

    this.initializedSubject.next(true);

  }

}