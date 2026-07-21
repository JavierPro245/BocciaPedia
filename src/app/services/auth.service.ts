import { Injectable } from '@angular/core';

import { onAuthStateChanged } from 'firebase/auth';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { auth, firestore } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  async register(
    name: string,
    email: string,
    password: string
  ) {

    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(credential.user, {
      displayName: name
    });

    await setDoc(
      doc(firestore, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        displayName: name,
        email: credential.user.email,
        photoURL: '',
        roles: [],
        approved: false,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    );

    return credential.user;

  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async logout() {

  await signOut(auth);

}

  resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async loginGoogle() {

  const provider = new GoogleAuthProvider();

  console.log('1. Abriendo popup...');

  const credential = await signInWithPopup(auth, provider);

  console.log('2. Login correcto');
  console.log(credential);

  console.log('3. Usuario autenticado');
  console.log(auth.currentUser);

  const user = credential.user;

  return user;

}

  listenAuthState(callback: (user: any) => void) {

  return onAuthStateChanged(auth, async (firebaseUser) => {

    if (!firebaseUser) {
      callback(null);
      return;
    }

    const userRef = doc(firestore, 'users', firebaseUser.uid);

    let userSnap = await getDoc(userRef);

    // Si el documento aún no existe, créalo
    if (!userSnap.exists()) {

      await setDoc(userRef, {

        uid: firebaseUser.uid,

        displayName: firebaseUser.displayName ?? '',

        email: firebaseUser.email ?? '',

        photoURL: firebaseUser.photoURL ?? '',

        roles: [],

        approved: false,

        active: true,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp()

      });

      // Leer nuevamente el documento recién creado
      userSnap = await getDoc(userRef);

    }

    callback(userSnap.data());

  });

}

}