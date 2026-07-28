import { Injectable } from '@angular/core';

import { onAuthStateChanged } from 'firebase/auth';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signInWithCredential
} from 'firebase/auth';

import { Capacitor } from '@capacitor/core';

import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot
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

    athleteId: null,

    trainerId: null,

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

  // ANDROID / IOS
  if (Capacitor.isNativePlatform()) {

    const result = await GoogleSignIn.signIn();

    if (!result.idToken) {
      throw new Error('Google no devolvió un ID Token.');
    }

    const credential = GoogleAuthProvider.credential(result.idToken);

    const userCredential = await signInWithCredential(
      auth,
      credential
    );

    return userCredential.user;

  }

  // WEB (localhost)
  const provider = new GoogleAuthProvider();

  const userCredential = await signInWithPopup(
    auth,
    provider
  );

  return userCredential.user;

}

  listenAuthState(callback: (user: any) => void) {

  let unsubscribeUser: (() => void) | null = null;

  return onAuthStateChanged(auth, async (firebaseUser) => {

    if (unsubscribeUser) {
      unsubscribeUser();
      unsubscribeUser = null;
    }

    if (!firebaseUser) {
      callback(null);
      return;
    }

    const userRef = doc(firestore, 'users', firebaseUser.uid);

    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {

      await setDoc(userRef, {

        uid: firebaseUser.uid,

        displayName: firebaseUser.displayName ?? '',

        email: firebaseUser.email ?? '',

        photoURL: firebaseUser.photoURL ?? '',

        roles: [],

        approved: false,

        active: true,

        athleteId: null,

        trainerId: null,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp()

      });

    }

    unsubscribeUser = onSnapshot(userRef, snapshot => {

      if (!snapshot.exists()) {

        callback(null);

        return;

      }

      callback(snapshot.data());

    });

  });

}

// =====================================
// Usuario autenticado
// =====================================

getCurrentUser() {

  return auth.currentUser;

}

}