import { Injectable } from '@angular/core';

import { onAuthStateChanged } from 'firebase/auth';
import { reload } from 'firebase/auth';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  signInWithCredential,
  EmailAuthProvider,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  linkWithPopup
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

// =====================================
// Proveedores vinculados
// =====================================

getProviders(): string[] {

  const user = auth.currentUser;

  if (!user) {

    return [];

  }

  return user.providerData.map(
    provider => provider.providerId
  );

}

// =====================================
// ¿Tiene Google?
// =====================================

hasGoogleProvider(): boolean {

  return this.getProviders().includes('google.com');

}

// =====================================
// ¿Tiene contraseña?
// =====================================

hasPasswordProvider(): boolean {

  return this.getProviders().includes('password');

}

// =====================================
// Vincular correo + contraseña
// =====================================

async linkEmailPassword(
  email: string,
  password: string
) {

  const user = auth.currentUser;

  if (!user) {

    throw new Error('No hay un usuario autenticado.');

  }

  const methods =
    await fetchSignInMethodsForEmail(
      auth,
      email
    );

  if (
    methods.length &&
    !methods.includes('password')
  ) {

    throw new Error(
      'Este correo ya pertenece a otra cuenta.'
    );

  }

  const credential =
    EmailAuthProvider.credential(
      email,
      password
    );

  await linkWithCredential(
    user,
    credential
  );

}

// =====================================
// Cambiar contraseña (usuario ya tiene proveedor "password")
// =====================================

async changePassword(
  currentPassword: string,
  newPassword: string
) {

  const user = auth.currentUser;

  if (!user || !user.email) {

    throw new Error('No hay un usuario autenticado.');

  }

  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  // Firebase exige reautenticación reciente antes de permitir un
  // cambio de contraseña, incluso si la sesión sigue activa.
  await reauthenticateWithCredential(user, credential);

  await updatePassword(user, newPassword);

}

// =====================================
// Vincular Google
// =====================================

async linkGoogle() {

  const user = auth.currentUser;

  if (!user) {

    throw new Error('No hay un usuario autenticado.');

  }

  const provider = new GoogleAuthProvider();

  await linkWithPopup(
    user,
    provider
  );

  }

  async reloadCurrentUser() {

  if (!auth.currentUser) {
    return;
  }

  await reload(auth.currentUser);

}

}