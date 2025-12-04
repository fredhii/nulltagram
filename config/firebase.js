const admin = require('firebase-admin')
const path = require('path')
const fs = require('fs')

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  if (admin.apps.length > 0) {
    return admin
  }

  // Option 1: Use FIREBASE_SERVICE_ACCOUNT env var (JSON string) - for Docker/production
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      })
      console.log('Firebase initialized with FIREBASE_SERVICE_ACCOUNT env var')
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err.message)
      process.exit(1)
    }
  }
  // Option 2: Use service account file in project root - for local development
  else {
    const serviceAccountPath = path.resolve(__dirname, '../nulltagram-firebase-admin-sdk.json')

    if (!fs.existsSync(serviceAccountPath)) {
      console.error('='.repeat(60))
      console.error('Firebase credentials not found!')
      console.error('')
      console.error('Please set one of the following:')
      console.error('  1. FIREBASE_SERVICE_ACCOUNT env var (JSON string)')
      console.error('  2. Place nulltagram-firebase-admin-sdk.json in project root')
      console.error('')
      console.error('For Docker, create a .env file with:')
      console.error('  FIREBASE_SERVICE_ACCOUNT=\'{"type":"service_account",...}\'')
      console.error('='.repeat(60))
      process.exit(1)
    }

    const serviceAccount = require(serviceAccountPath)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    console.log('Firebase initialized with local service account file')
  }

  return admin
}

initializeFirebase()

const db = admin.firestore()
const auth = admin.auth()

module.exports = { admin, db, auth }
