import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAKlKfsLPKsDGkGYqv9jIq6rbChAxebaF4",
    authDomain: "izigo-82ed2.firebaseapp.com",
    projectId: "izigo-82ed2",
    storageBucket: "izigo-82ed2.appspot.com",
    messagingSenderId: "878029325287",
    appId: "1:878029325287:web:891f58f5e8020ab95a3342",
    measurementId: "G-3QJVJKNZ34"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
export default firebase;
