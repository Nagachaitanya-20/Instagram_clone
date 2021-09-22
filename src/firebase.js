// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
import 'firebase/firestore';
const firebaseApp = firebase.initializeApp( {
    apiKey: "AIzaSyCwH8iWvq9acCBIRNxNVUAY2szM6hlZw4s",
    authDomain: "instagram-clone-react-c2b82.firebaseapp.com",
    projectId: "instagram-clone-react-c2b82",
    databaseURL:"https://instagram-clone-react-c2b82.firebaseio.com",
    storageBucket: "instagram-clone-react-c2b82.appspot.com",
    messagingSenderId: "613682265830",
    appId: "1:613682265830:web:ee8341806612cc61ca0527",
    measurementId: "G-9DC3WS9JF8"
  });
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();
  export {db,auth,storage};

  