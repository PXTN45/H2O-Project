import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider , 
  signInWithPopup
} from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { type UserCredential } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA6VFimSI3JXxVldFNKOHE1efqnuJf6fXU",
  authDomain: "h2o-project-ts.firebaseapp.com",
  projectId: "h2o-project-ts",
  storageBucket: "h2o-project-ts.appspot.com",
  messagingSenderId: "654241915133",
  appId: "1:654241915133:web:0953ccf12f06cef3779e94",
  measurementId: "G-HCQNE25WL5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const type = getAuth();

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber , type ,   GoogleAuthProvider , signInWithPopup , storage };
export type { UserCredential };
