
// To run this script, use the following command from your project's root directory:
// npx tsx ./scripts/seed-categories.ts

import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../src/lib/firebase';
import 'dotenv/config';

// This is the source of truth for the categories.
const categoriesToSeed = [
  'Billing',
  'Technical Support',
  'General Inquiry',
  'Feature Request',
  'Account Access',
];

const categoriesCollection = collection(db, 'categories');

async function syncCategories() {
  console.log("Starting to sync categories...");

  // Get existing categories from Firestore
  const snapshot = await getDocs(categoriesCollection);
  const existingCategories = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  const existingCategoryNames = new Set(existingCategories.map(cat => cat.name));
  const seededCategoryNames = new Set(categoriesToSeed);

  // 1. Delete categories that are in Firestore but not in our seed list
  const categoriesToDelete = existingCategories.filter(cat => !seededCategoryNames.has(cat.name));
  for (const category of categoriesToDelete) {
    try {
      await deleteDoc(doc(db, 'categories', category.id));
      console.log(`  - Deleted category: "${category.name}"`);
    } catch (error) {
      console.error(`  - Error deleting category "${category.name}":`, error);
    }
  }

  // 2. Add categories that are in our seed list but not in Firestore
  const categoriesToAdd = categoriesToSeed.filter(name => !existingCategoryNames.has(name));
  for (const categoryName of categoriesToAdd) {
    try {
      await addDoc(categoriesCollection, { name: categoryName });
      console.log(`  + Added category: "${categoryName}"`);
    } catch (error) {
      console.error(`  + Error adding category "${categoryName}":`, error);
    }
  }

  // 3. Log skipped categories
  const skippedCategories = categoriesToSeed.filter(name => existingCategoryNames.has(name));
  if (skippedCategories.length > 0) {
      skippedCategories.forEach(name => console.log(`  = Skipped (already exists): "${name}"`))
  }


  console.log("\nCategory sync complete.");
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
        syncCategories();
    }
}
