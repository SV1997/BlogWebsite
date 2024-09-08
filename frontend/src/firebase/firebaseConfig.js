// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDT3Ag-JuiIlfO2PrIFQhwifScsY8IxGig",
  authDomain: "cloneblog-5396d.firebaseapp.com",
  projectId: "cloneblog-5396d",
  storageBucket: "cloneblog-5396d.appspot.com",
  messagingSenderId: "416249220936",
  appId: "1:416249220936:web:24907f94f8c9ca5feded7d",
  measurementId: "G-32VSLER2XS",
  DatabaseURL: "https://cloneblog-5396d-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app};