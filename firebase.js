// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* =====================================================
   FIREBASE CONFIG
===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAH5vWT-YGFVWwp4PS2mA7EwMAqkEoPnQc",
  authDomain: "ywskiny.firebaseapp.com",
  projectId: "ywskiny",
  storageBucket: "ywskiny.firebasestorage.app",
  messagingSenderId: "68204194017",
  appId: "1:68204194017:web:885b87b1cd15f015a82fa0"
};


/* =====================================================
   INITIALIZE FIREBASE
===================================================== */

const app = initializeApp(firebaseConfig);


/* =====================================================
   SERVICES
===================================================== */

export const auth = getAuth(app);

export const db = getFirestore(app);