import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import { getDatabase } from 'firebase/database';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig= {
  apiKey: "AIzaSyBABoRsC8uGPgQWCTRSP5aEnTJI3ciUEvY",
  authDomain: "internship-b513f.firebaseapp.com",
  projectId: "internship-b513f",
  storageBucket: "internship-b513f.appspot.com",
  messagingSenderId: "534926851092",
  appId: "1:534926851092:web:c6cc137a4a08a16ea3fb01"
}

const app = initializeApp(firebaseConfig);

export default app
export const auth = getAuth();
export const db = getDatabase();
export const firestore = getFirestore();
