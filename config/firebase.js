const admin = require('firebase-admin')
const path = require('path')

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    return admin
  }

  // Option 1: Use FIREBASE_SERVICE_ACCOUNT env var (JSON string) - for Docker/production
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }
  // Option 2: Use service account file in project root - for local development
  else {
    const serviceAccountPath = path.resolve(__dirname, '../nulltagram-firebase-admin-sdk.json')
    const serviceAccount = require(serviceAccountPath)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  }

  return admin
}

initializeFirebase()

const db = admin.firestore()
const auth = admin.auth()

module.exports = { admin, db, auth }
