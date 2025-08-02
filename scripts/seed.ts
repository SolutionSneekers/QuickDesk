
// To run this script, use the following command from your project's root directory:
// npx tsx ./scripts/seed.ts

import { collection, addDoc, getDocs, writeBatch, query, where } from "firebase/firestore";
import { db } from '../src/lib/firebase';
import 'dotenv/config';

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
    password: 'password',
    avatar: 'https://placehold.co/150x150/F97316/FFFFFF/png'
  },
  { 
    name: 'Bob Williams', 
    email: 'bob@example.com', 
    role: 'Support Agent', 
    password: 'password',
    avatar: 'https://placehold.co/150x150/10B981/FFFFFF/png'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'End User',
    password: 'password',
    avatar: 'https://placehold.co/150x150/3B82F6/FFFFFF/png'
  },
   {
    name: 'Diana Miller',
    email: 'diana@example.com',
    role: 'End User',
    password: 'password',
    avatar: 'https://placehold.co/150x150/EC4899/FFFFFF/png'
  }
];

const ticketsToSeed = (userIds: { [email: string]: string }, categoryIds: { [name: string]: string }) => [
    {
        subject: "Cannot reset my password",
        description: "I've tried the 'Forgot Password' link multiple times but I'm not receiving an email. Please help me reset my password.",
        status: "Open",
        categoryId: categoryIds['Account Access'],
        requesterId: userIds['charlie@example.com'],
        assigneeId: userIds['alice@example.com'],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        upvotes: 5,
        downvotes: 0,
        comments: [
            { id: '1', authorId: userIds['charlie@example.com'], content: "I'm still waiting for a response on this. It's been two days.", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isAgent: false },
            { id: '2', authorId: userIds['alice@example.com'], content: "Hi Charlie, apologies for the delay. I'm looking into this for you now and will send a manual reset link shortly.", createdAt: new Date().toISOString(), isAgent: true }
        ]
    },
    {
        subject: "Question about latest invoice",
        description: "I was charged twice this month. Can you please look into this and issue a refund for the duplicate charge?",
        status: "In Progress",
        categoryId: categoryIds['Billing'],
        requesterId: userIds['diana@example.com'],
        assigneeId: userIds['bob@example.com'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        upvotes: 2,
        downvotes: 0,
        comments: []
    },
];

// --- Collections ---
const categoriesCollection = collection(db, 'categories');
const usersCollection = collection(db, 'users');
const ticketsCollection = collection(db, 'tickets');

// --- Helper Functions ---

async function checkIfCollectionExists(collectionRef: any) {
  const snapshot = await getDocs(query(collectionRef));
  return snapshot.docs.length > 0;
}

async function seedCollection(collectionRef: any, data: any[], keyField: string) {
  const batch = writeBatch(db);
  const existingDocs = new Set<string>();
  const snapshot = await getDocs(query(collectionRef));
  snapshot.docs.forEach(doc => existingDocs.add(doc.data()[keyField]));
  
  const newDocs = [];
  for (const item of data) {
    if (!existingDocs.has(item[keyField])) {
      const docRef = doc(collectionRef);
      batch.set(docRef, item);
      newDocs.push({...item, id: docRef.id});
      console.log(`  + Adding ${collectionRef.id}: ${item[keyField]}`);
    } else {
      console.log(`  = Skipping ${collectionRef.id} (already exists): ${item[keyField]}`);
    }
  }

  await batch.commit();
  return newDocs;
}


// --- Main Seeding Logic ---

async function seedDatabase() {
    console.log("Starting database seed...");
    
    // 1. Seed Categories
    console.log("\nSyncing Categories...");
    await seedCollection(categoriesCollection, categoriesToSeed.map(name => ({ name })), 'name');

    // 2. Seed Users
    console.log("\nSyncing Users...");
    await seedCollection(usersCollection, usersToSeed, 'email');

    // 3. Seed Tickets (only if the collection is empty)
    console.log("\nSyncing Tickets...");
    const ticketsExist = await checkIfCollectionExists(ticketsCollection);
    if (!ticketsExist) {
        console.log("  - Tickets collection is empty, proceeding with seed.");
        
        // Fetch created users and categories to get their IDs for relationships
        const usersSnapshot = await getDocs(usersCollection);
        const userIds = Object.fromEntries(usersSnapshot.docs.map(doc => [doc.data().email, doc.id]));

        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoryIds = Object.fromEntries(categoriesSnapshot.docs.map(doc => [doc.data().name, doc.id]));

        const ticketData = ticketsToSeed(userIds, categoryIds);
        await seedCollection(ticketsCollection, ticketData, 'subject');

    } else {
        console.log("  = Tickets collection already contains data. Skipping seed.");
    }

    console.log("\nDatabase seed complete!");
    process.exit(0);
}


// --- Pre-run Checks ---
function run() {
    if (process.env.npm_config_user_agent?.includes('studio')) {
        console.warn("This script is intended to be run locally from your terminal, not within Firebase Studio.")
        console.warn("Run `npm run db:seed` in your local project directory.")
    } else {
        if (!db.app.options.apiKey || db.app.options.apiKey.includes("YOUR_")) {
            console.error("Firebase configuration in src/lib/firebase.ts seems to be missing or is still a placeholder.");
            console.error("Please update it with your actual Firebase project configuration before running this script.");
            process.exit(1);
        } else {
            seedDatabase().catch(error => {
                console.error("Seeding failed:", error);
                process.exit(1);
            });
        }
    }
}

run();
