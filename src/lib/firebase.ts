// This file is for your Firebase configuration.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration.
// You can get this from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyAdP--Dtad2S1ZWiF5NmaKPZOAgCJD9zQk",
  authDomain: "quickdesk-1c68b.firebaseapp.com",
  projectId: "quickdesk-1c68b",
  storageBucket: "quickdesk-1c68b.firebasestorage.app",
  messagingSenderId: "1022743363302",
  appId: "1:1022743363302:web:0f0703605e9d98ca350527"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
