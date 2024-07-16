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
  apiKey: "AIzaSyDb28-cH3G5svrBk1qBW3X7lpn7SzAGckQ",
  authDomain: "final-project-h2o.firebaseapp.com",
  projectId: "final-project-h2o",
  storageBucket: "final-project-h2o.appspot.com",
  messagingSenderId: "817851075980",
  appId: "1:817851075980:web:be01ef946dec06d5ce1aa9",
  measurementId: "G-YX2RQBRTYM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const type = getAuth();

export { app, auth, RecaptchaVerifier, signInWithPhoneNumber , type ,   GoogleAuthProvider , signInWithPopup , storage };
export type { UserCredential };
