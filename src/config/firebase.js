import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp20gNm1bcn2BVI9ppp85yhak5XSrd-zg",
  authDomain: "olx-x-1695a.firebaseapp.com",
  projectId: "olx-x-1695a",
  storageBucket: "olx-x-1695a.appspot.com",
  messagingSenderId: "104395264898",
  appId: "1:104395264898:web:1e7956eb8f67d9e0c8f59b",
  measurementId: "G-29QQF58X7M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// const firebaseConfig = {
//   apiKey: "AIzaSyDCQoIukATbZtSmhd_fKHbm42OSziG9AMk",
//   authDomain: "olx-clone-aa078.firebaseapp.com",
//   projectId: "olx-clone-aa078",
//   storageBucket: "olx-clone-aa078.firebasestorage.app",
//   messagingSenderId: "494233973375",
//   appId: "1:494233973375:web:34f7bdcc7c16c8b842c54a",
//   measurementId: "G-6FZHV9KGQS"
// };
