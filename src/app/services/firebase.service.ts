import { Injectable } from '@angular/core';

import { auth } from '../firebase.config';
import { firestore } from '../firebase.config';
import { storage } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = auth;

  firestore = firestore;

  storage = storage;

  constructor() { }

}