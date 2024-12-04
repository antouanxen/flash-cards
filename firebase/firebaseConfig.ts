import * as dotenv from 'dotenv'
import * as firebase from "firebase-admin";

dotenv.config()
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

if (!serviceAccountKey) {
    throw new Error('Firebase account key is not set or is empty')
}

const serviceAccount = JSON.parse(serviceAccountKey)

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount as firebase.ServiceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    })    
}

export default firebase