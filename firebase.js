// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBxnnTtH58SUX3Sl5TvDaQivtMHAQsFaQs",
  authDomain: "tripak-e1507.firebaseapp.com",
  projectId: "tripak-e1507",
  storageBucket: "tripak-e1507.appspot.com",
  messagingSenderId: "491631230502",
  appId: "1:491631230502:web:a1e1ffb484b72b8bf7b0e7"

};

// Initialize Firebase
let app;

if (firebase.default.apps.length === 0) {
  app = firebase.default.initializeApp(firebaseConfig);
} else {
  app = firebase.default.app()
}

const auth = firebase.default.auth()
const db = firebase.default.firestore()
const sg = firebase.default.storage()

export { auth, db, sg };