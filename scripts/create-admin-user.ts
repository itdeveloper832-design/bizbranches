// This script helps create admin users in Firebase Authentication
// Run this script with: npx ts-node scripts/create-admin-user.ts

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyC1dRJtLFMhBqieIj6JrtZsd4j0jd1xM_Y',
  authDomain: 'branches-app-ff0a2.firebaseapp.com',
  projectId: 'branches-app-ff0a2',
  storageBucket: 'branches-app-ff0a2.appspot.com',
  messagingSenderId: '817543103901',
  appId: '1:817543103901:web:0f1de5eacc949505dc9b74',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

async function createAdminUser(email: string, password: string) {
  try {
    // Check if user already exists
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    if (signInMethods.length > 0) {
      console.log(`User ${email} already exists`)
      return
    }

    // Create new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log(`✅ Admin user created successfully!`)
    console.log(`Email: ${email}`)
    console.log(`User ID: ${userCredential.user.uid}`)
    
    // Note: In production, you should also add this user to a Firestore 'admins' collection
    // with role information for better security management
    
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
  }
}

// Example usage - replace with your actual admin credentials
async function main() {
  console.log('Creating admin users...')
  
  // Create main admin
  await createAdminUser('admin@pakbizbranches.online', 'Admin@2026!Secure')
  
  // Create support admin
  await createAdminUser('support@pakbizbranhces.online', 'Support@2026!Secure')
  
  console.log('\n📝 Important Notes:')
  console.log('1. Change these passwords immediately after first login')
  console.log('2. In production, use stronger passwords')
  console.log('3. Consider implementing role-based access in Firestore')
  console.log('4. Enable email verification in Firebase Console')
  console.log('5. Set up proper password policies')
  
  process.exit(0)
}

main().catch(console.error)
