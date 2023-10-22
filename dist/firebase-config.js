"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyA44bSlJEjbBU-NEQhSGBr0C16c3R2jSJo',
    authDomain: 'reserv-4bfec.firebaseapp.com',
    projectId: 'reserv-4bfec',
    storageBucket: 'reserv-4bfec.appspot.com',
    messagingSenderId: '474976916639',
    appId: '1:474976916639:web:1eda8ae5a42fc0a6a6beaa',
    measurementId: 'G-26XDGLPFPS',
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
