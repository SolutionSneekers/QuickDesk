
// --- Important ---
// This script is designed to be run from your LOCAL machine, not from within a cloud environment.
// It requires a Firebase Admin SDK Service Account key to create users in Firebase Authentication.

// --- Pre-run Setup ---
// 1. Go to your Firebase Project Settings > Service accounts.
// 2. Click "Generate new private key" and download the JSON file.
// 3. Rename the file to `serviceAccountKey.json` and place it in the ROOT of your project directory.
// 4. IMPORTANT: Add `serviceAccountKey.json` to your `.gitignore` file to prevent it from being committed.
// 5. Make sure your `src/lib/firebase.ts` is correctly configured with your project's client-side config.

// --- How to Run ---
// npx tsx ./scripts/seed.ts

import * as admin from 'firebase-admin';
import { collection, doc, writeBatch, getDocs, query, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase'; // This is the client-side DB for writing Firestore data
import 'dotenv/config';
import * as path from 'path';

// --- Service Account Initialization ---
// The script will automatically look for the GOOGLE_APPLICATION_CREDENTIALS env var.
// If not found, it tries to use a local service account file.
try {
  // Correctly resolve the path to the project's root directory
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Initialized Firebase Admin with local service account key.');
} catch (error) {
  console.error('Could not initialize Firebase Admin SDK.');
  console.error('Please ensure serviceAccountKey.json is in your project root, or GOOGLE_APPLICATION_CREDENTIALS is set.');
  process.exit(1);
}

const auth = admin.auth();

// --- Data to Seed ---

const categoriesToSeed = [
  'Billing',
  'Technical Support',
  'General Inquiry',
  'Feature Request',
  'Account Access',
];

const usersToSeed = [
  { 
    name: 'Admin User', 
    email: 'admin@quickdesk.com', 
    role: 'Admin', 
    password: 'admin123456789',
    avatar: 'https://placehold.co/150x150/7F56D9/FFFFFF/png'
  }
];


// --- Main Seeding Logic ---

async function seedDatabase() {
  console.log("Starting database seed...");

  // 1. Seed Categories
  console.log("\nSyncing Categories...");
  const categoriesBatch = writeBatch(db);
  const categoriesCollection = collection(db, 'categories');
  const existingCategoriesSnap = await getDocs(query(categoriesCollection));
  const existingCategoryNames = new Set(existingCategoriesSnap.docs.map(d => d.data().name));
  
  categoriesToSeed.forEach(name => {
    if (!existingCategoryNames.has(name)) {
      const docRef = doc(categoriesCollection);
      categoriesBatch.set(docRef, { name });
      console.log(`  + Adding category: ${name}`);
    } else {
      console.log(`  = Skipping category (already exists): ${name}`);
    }
  });
  await categoriesBatch.commit();
  
  // 2. Seed Users
  console.log("\nSyncing Users (Auth and Firestore)...");
  
  for (const user of usersToSeed) {
    try {
      let userRecord;
      try {
        // Check if user exists in Auth
        userRecord = await auth.getUserByEmail(user.email);
        console.log(`  = Skipping Auth user (already exists): ${user.email}`);
      } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
          // Create user in Auth
          userRecord = await auth.createUser({
            email: user.email,
            emailVerified: true,
            password: user.password,
            displayName: user.name,
            photoURL: user.avatar,
          });
          console.log(`  + Added Auth user: ${user.email}`);
        } else {
          throw error; // Re-throw other auth errors
        }
      }

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', userRecord.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create user in Firestore
        await setDoc(userDocRef, {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        });
        console.log(`  + Added Firestore user document for: ${user.email}`);
      } else {
         console.log(`  = Firestore user document already exists for: ${user.email}`);
      }
    } catch (error) {
      console.error(`  ! Error processing user ${user.email}:`, error);
    }
  }

  // 3. Clear Tickets (if any existed from previous seeds)
  console.log("\nChecking for old tickets...");
  const ticketsCollection = collection(db, 'tickets');
  const existingTicketsSnap = await getDocs(query(ticketsCollection));
  if (!existingTicketsSnap.empty) {
      console.log(`  - Found ${existingTicketsSnap.size} old tickets. Deleting...`);
      const deleteBatch = writeBatch(db);
      existingTicketsSnap.docs.forEach(ticketDoc => {
          deleteBatch.delete(ticketDoc.ref);
      });
      await deleteBatch.commit();
      console.log("  - Old tickets deleted.");
  } else {
      console.log("  = No old tickets found to delete.");
  }


  console.log("\nDatabase seed complete!");
  process.exit(0);
}

// --- Pre-run Checks ---
function run() {
  if (process.env.npm_config_user_agent?.includes('studio')) {
    console.warn("This script is intended to be run locally from your terminal, not within Firebase Studio.");
    console.warn("To run this script:");
    console.warn("1. Download a service account key for your project and save it as 'serviceAccountKey.json' in your project root.");
    console.warn("2. Ensure the key file is added to your .gitignore.");
    console.warn("3. Run `npm run db:seed` in your local project directory terminal.");
  } else {
    seedDatabase().catch(error => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
  }
}

run();
