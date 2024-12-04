"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const firebase = require("firebase-admin");
dotenv.config();
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccountKey) {
    throw new Error('Firebase account key is not set or is empty');
}
const serviceAccount = JSON.parse(serviceAccountKey);
if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}
exports.default = firebase;
//# sourceMappingURL=firebaseConfig.js.map