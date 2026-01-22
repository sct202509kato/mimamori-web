// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebaseコンソールからコピペしてここに入れる
const firebaseConfig = {
    apiKey: "AIzaSyA7mbIVVQ5qnfu9J4qm-1CTvwfYmDrqsw4",
    authDomain: "mimamori-4b3a8.firebaseapp.com",
    projectId: "mimamori-4b3a8",
    appId: "1:317351415186:web:e390dc0f6290826be7c54b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
