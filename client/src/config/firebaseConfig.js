// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBt2UHJsOVLGdvFBErmJ0rwFRnMNElvXrM",
  authDomain: "project-planner-e362b.firebaseapp.com",
  projectId: "project-planner-e362b",
  storageBucket: "project-planner-e362b.appspot.com",
  messagingSenderId: "590799325407",
  appId: "1:590799325407:web:53e6794f169c40a9ae816a",
  measurementId: "G-0ZLET83LHQ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;