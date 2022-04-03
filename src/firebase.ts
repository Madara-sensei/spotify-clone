import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyD0pLtgd2gjZhPpIOWYAE9dhNr7yi8FFqk",
    authDomain: "spotify-clone-8a48a.firebaseapp.com",
    projectId: "spotify-clone-8a48a",
    storageBucket: "spotify-clone-8a48a.appspot.com",
    messagingSenderId: "282345240339",
    appId: "1:282345240339:web:e4184240b750d72c834ce6"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const db = firebaseApp.firestore();

export { auth, googleProvider };
export default db;