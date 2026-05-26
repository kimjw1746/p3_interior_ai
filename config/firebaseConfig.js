import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB8GESgmPNmMOWpJjwttSkAfxsJTXjkDGE",
  authDomain: "interior-ai-e7042.firebaseapp.com",
  projectId: "interior-ai-e7042",
  storageBucket: "interior-ai-e7042.firebasestorage.app",
  messagingSenderId: "115400199770",
  appId: "1:115400199770:web:5e20e337566cf1c9915263",
  measurementId: "G-TMJQBV2D0P"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);