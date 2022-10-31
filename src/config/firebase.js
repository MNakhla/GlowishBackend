require("dotenv").config();
const API_KEY = process.env.FIREBASE_API_KEY;
const AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID;
const APP_ID = process.env.FIREBASE_APP_ID;

const firebase = require("firebase");

const config = {
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
  },
};

const firebaseDB = firebase.initializeApp(config.firebaseConfig);

module.exports = { firebaseDB: firebaseDB };
