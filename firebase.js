// install firebase to build and set up project on firebase website
import firebase from "firebase";

//from set up project
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 
const firebaseConfig = {
  apiKey: "AIzaSyDZUHDaojsimm-NvTdoqCB15B4c58ECVm0",
  authDomain: "whatsapp-clone-e2794.firebaseapp.com",
  projectId: "whatsapp-clone-e2794",
  storageBucket: "whatsapp-clone-e2794.appspot.com",
  messagingSenderId: "594150226091",
  appId: "1:594150226091:web:4fefd320db5314795d1fee",
  measurementId: "G-VKGCG1CL5J"
};

// Check if app has not bein initialised and if so initialise it, if its already initialised run it
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

//Database - use the initialised app's firestore for the database
const db = app.firestore();

//Authentication
const auth = app.auth();

//Provider - Google
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };