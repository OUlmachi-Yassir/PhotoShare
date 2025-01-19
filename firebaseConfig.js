import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCwQWzB8ZrtIESrC28g50rEJUCNT6Y_stk",
    authDomain: "instaphone-1776f.firebaseapp.com",
    projectId: "instaphone-1776f",
    storageBucket: "instaphone-1776f.firebasestorage.app",
    messagingSenderId: "441682134496",
    appId: "1:441682134496:web:fbb9f885d91d83d4c09785",
    measurementId: "G-3L86Y38W5M"
  };

  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
