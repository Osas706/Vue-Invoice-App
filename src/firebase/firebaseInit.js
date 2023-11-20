import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyDmWH-K9_fjNgz5zF6r34sXBnvH4T3pjNo",
    authDomain: "invoice-app-7cb5a.firebaseapp.com",
    projectId: "invoice-app-7cb5a",
    storageBucket: "invoice-app-7cb5a.appspot.com",
    messagingSenderId: "189749840005",
    appId: "1:189749840005:web:f74a1415dd9fe733fb41ec"
};

const firebaseApp = initializeApp(firebaseConfig); 

export default getFirestore(firebaseApp);