// Firebase Configuration
// Replace these with your Firebase project credentials from console.firebase.google.com
const firebaseConfig = {
  apiKey: "AIzaSyAYmj30zcTLi2EU0V10BOzYoTwK19AWVIA",
  authDomain: "chat-bot-5ee35.firebaseapp.com",
  databaseURL: "https://chat-bot-5ee35-default-rtdb.firebaseio.com",
  projectId: "chat-bot-5ee35",
  storageBucket: "chat-bot-5ee35.firebasestorage.app",
  messagingSenderId: "216943552798",
  appId: "1:216943552798:web:b8b7645e3876a056c3810f",
  measurementId: "G-ESW4CGNSR3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = firebase.database();
const auth = firebase.auth();

// Export for use in other files
window.firebaseDB = database;
window.firebaseAuth = auth;
