import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDFLgBF-lZjCMDSvPUN8zPSsTp6_03wIgo",
    authDomain: "movie-booking-137b3.firebaseapp.com",
    projectId: "movie-booking-137b3",
    storageBucket: "movie-booking-137b3.firebasestorage.app",
    messagingSenderId: "244582926742",
    appId: "1:244582926742:web:d472f9aadf8dcc5310f5b7",
    measurementId: "G-B6SRCMVQJ7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;