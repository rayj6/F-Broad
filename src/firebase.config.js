import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtzMgNmlfjBewqOu_5_FOEe2jGeCFW8Sg",
    authDomain: "f-broad.firebaseapp.com",
    projectId: "f-broad",
    storageBucket: "f-broad.appspot.com",
    messagingSenderId: "555800348827",
    appId: "1:555800348827:web:ff7429df9aec014a541e3e",
};

const app = initializeApp(firebaseConfig);
const Database = getDatabase(app);
const Auth = getAuth(app);
const Store = getFirestore(app);

export { Database, Auth, Store };
