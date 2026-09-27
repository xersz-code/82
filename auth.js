import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import { auth } from "./firebase.js";

export async function login(email, password) {
  return signInWithEmailAndPassword(
    auth,
    email,
    password
  );
}

export async function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(
    auth,
    callback
  );
}