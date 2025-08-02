
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
  const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');
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
  },
  { 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    role: 'Support Agent', 
    password: 'password123',
    avatar: 'https://placehold.co/150x150/F97316/FFFFFF/png'
  },
  { 
    name: 'Bob Williams', 
    email: 'bob@example.com', 
    role: 'Support Agent', 
    password: 'password123',
    avatar: 'https://placehold.co/150x150/10B981/FFFFFF/png'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'End User',
    password: 'password123',
    avatar: 'https://placehold.co/150x150/3B82F6/FFFFFF/png'
  },
   {
    name: 'Diana Miller',
    email: 'diana@example.com',
    role: 'End User',
    password: 'password123',
    avatar: 'https://placehold.co/150x150/EC4899/FFFFFF/png'
  }
];

const ticketsToSeed = (userIds: { [email: string]: string }) => [
  {
    subject: "Cannot reset my password",
    description: "I've tried the 'Forgot Password' link multiple times but I'm not receiving an email. Please help me reset my password.",
    status: "Open",
    categoryName: 'Account Access',
    requesterEmail: 'charlie@example.com',
    assigneeEmail: 'alice@example.com',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    upvotes: 5,
    downvotes: 0,
    comments: [
      { authorEmail: 'charlie@example.com', content: "I'm still waiting for a response on this. It's been two days.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isAgent: false },
      { authorEmail: 'alice@example.com', content: "Hi Charlie, apologies for the delay. I'm looking into this for you now and will send a manual reset link shortly.", createdAt: new Date().toISOString(), isAgent: true }
    ]
  },
  {
    subject: "Question about latest invoice",
    description: "I was charged twice this month. Can you please look into this and issue a refund for the duplicate charge?",
    status: "In Progress",
    categoryName: 'Billing',
    requesterEmail: 'diana@example.com',
    assigneeEmail: 'bob@example.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    upvotes: 2,
    downvotes: 0,
    comments: []
  },
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
  
  // Fetch all categories to create a name-to-ID map
  const allCategoriesSnap = await getDocs(categoriesCollection);
  const categoryNameToIdMap = new Map(allCategoriesSnap.docs.map(d => [d.data().name, d.id]));


  // 2. Seed Users
  console.log("\nSyncing Users (Auth and Firestore)...");
  const userEmailToIdMap = new Map<string, string>();

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
      userEmailToIdMap.set(user.email, userRecord.uid);
    } catch (error) {
      console.error(`  ! Error processing user ${user.email}:`, error);
    }
  }


  // 3. Seed Tickets
  console.log("\nSyncing Tickets...");
  const ticketsCollection = collection(db, 'tickets');
  const existingTicketsSnap = await getDocs(query(ticketsCollection));
  if (existingTicketsSnap.empty) {
    console.log("  - Tickets collection is empty, proceeding with seed.");
    const ticketsBatch = writeBatch(db);
    const ticketData = ticketsToSeed(Object.fromEntries(userEmailToIdMap));

    ticketData.forEach(ticket => {
        const docRef = doc(ticketsCollection);
        const requesterId = userEmailToIdMap.get(ticket.requesterEmail);
        const assigneeId = userEmailToIdMap.get(ticket.assigneeEmail);
        const categoryId = categoryNameToIdMap.get(ticket.categoryName);

        if (!requesterId || !categoryId) {
            console.error(`  ! Skipping ticket "${ticket.subject}" due to missing requester or category.`);
            return;
        }

        const comments = ticket.comments.map(c => ({
            ...c,
            authorId: userEmailToIdMap.get(c.authorEmail)
        })).filter(c => c.authorId);

        const newTicket = {
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt,
            upvotes: ticket.upvotes,
            downvotes: ticket.downvotes,
            requesterId,
            assigneeId: assigneeId || null,
            categoryId,
            comments: comments.map(({authorEmail, ...rest}) => rest), // remove authorEmail
        };
        ticketsBatch.set(docRef, newTicket);
        console.log(`  + Adding ticket: "${ticket.subject}"`);
    });
    await ticketsBatch.commit();
  } else {
     console.log("  = Tickets collection already has data. Skipping seed.");
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
