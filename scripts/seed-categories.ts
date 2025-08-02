
// To run this script, use the following command from your project's root directory:
// npx tsx ./scripts/seed-categories.ts

import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '../src/lib/firebase';
import 'dotenv/config';

const categoriesToSeed = [
  'Billing',
  'Technical Support',
  'General Inquiry',
  'Feature Request',
  'Account Access',
];

const categoriesCollection = collection(db, 'categories');

async function seedCategories() {
  console.log("Starting to seed categories...");

  for (const categoryName of categoriesToSeed) {
    // Check if the category already exists to avoid duplicates
    const q = query(categoriesCollection, where("name", "==", categoryName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Category does not exist, so add it
      try {
        await addDoc(categoriesCollection, { name: categoryName });
        console.log(`  Successfully added category: "${categoryName}"`);
      } catch (error) {
        console.error(`  Error adding category "${categoryName}":`, error);
      }
    } else {
      // Category already exists
      console.log(`  Skipping category (already exists): "${categoryName}"`);
    }
  }

  console.log("\nCategory seeding complete.");
  // Node.js process does not exit automatically if there are pending async operations from Firebase SDK.
  // We can exit manually.
  process.exit(0);
}

// Check for Firebase configuration before running
if (process.env.npm_config_user_agent?.includes('studio')) {
    console.warn("This script is intended to be run locally, not within Firebase Studio.")
} else {
    // A very basic check to see if firebase config seems to be placeholder
    if (!db.app.options.apiKey || db.app.options.apiKey.startsWith("YOUR_")) {
        console.error("Firebase configuration in src/lib/firebase.ts seems to be missing or is still a placeholder.");
        console.error("Please update it with your actual Firebase project configuration before running this script.");
        process.exit(1);
    } else {
        seedCategories();
    }
}
