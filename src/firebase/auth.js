import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, requireFirebase } from './firebaseConfig';
import { createUserProfile, updateUserProfile } from './firestore';

export async function registerWithEmail({ displayName, email, password }) {
  requireFirebase();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await createUserProfile(credential.user, displayName);
  return credential.user;
}

export async function loginWithEmail(email, password) {
  requireFirebase();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function logoutUser() {
  requireFirebase();
  await signOut(auth);
}

export async function sendReset(email) {
  requireFirebase();
  await sendPasswordResetEmail(auth, email);
}

export async function updateAuthDisplayName(user, displayName) {
  requireFirebase();
  await updateProfile(user, { displayName });
  await updateUserProfile(user.uid, { displayName });
}
