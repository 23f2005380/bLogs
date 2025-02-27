import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

export const firebaseConfig = {
  apiKey: "AIzaSyBwVNQ-t2Cob-ef_mkI2DDx_nto_8P0IJY",
  authDomain: "panch-987e1.firebaseapp.com",
  projectId: "panch-987e1",
  storageBucket: "panch-987e1.appspot.com",
  messagingSenderId: "310641114905",
  appId: "1:310641114905:web:9cf9ffe857299a42ec4f88",
  measurementId: "G-FWR1Y3F4X3",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }

