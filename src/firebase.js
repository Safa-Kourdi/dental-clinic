import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1tJov_A_KYFrm19M20luaHIBiqnq1m0A",
  authDomain: "dental-clinc-1e2a9.firebaseapp.com",
  projectId: "dental-clinc-1e2a9",
  storageBucket: "dental-clinc-1e2a9.firebasestorage.app",
  messagingSenderId: "288024272591",
  appId: "1:288024272591:web:9594a49c86371076e821ba",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
