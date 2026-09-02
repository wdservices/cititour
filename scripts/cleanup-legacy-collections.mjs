// scripts/cleanup-legacy-collections.mjs
import cfg from "../firebase-applet-config.json" with { type: "json" };
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, deleteDoc, doc, collectionGroup } from "firebase/firestore";

const app = initializeApp(cfg);
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  console.log("🚀 Starting Legacy Collection Cleanup in TourPH project...");
  const creds = await signInWithEmailAndPassword(auth, "migrator@tourph.com", "TourPHMigration2026!");
  console.log("Authenticated as:", creds.user.email);

  // 1. Double check properties in subcollections before deleting house_listings
  const subProps = await getDocs(collectionGroup(db, "properties"));
  console.log(`Subcollection properties count: ${subProps.size}`);
  if (subProps.size < 10) {
    throw new Error("Safety check failed: subcollection properties count is too low!");
  }

  // 2. Clean up house_listings
  console.log("\n🧹 Cleaning up legacy collection: 'house_listings'...");
  const houseSnap = await getDocs(collection(db, "house_listings"));
  console.log(`Found ${houseSnap.size} documents in 'house_listings' to delete.`);
  for (const d of houseSnap.docs) {
    console.log(` - Deleting house_listings/${d.id} (${d.data().title || d.data().name})`);
    await deleteDoc(doc(db, "house_listings", d.id));
  }
  console.log("✅ 'house_listings' collection cleaned up.");

  // 3. Clean up foodItems
  console.log("\n🧹 Cleaning up legacy collection: 'foodItems'...");
  const foodSnap = await getDocs(collection(db, "foodItems"));
  console.log(`Found ${foodSnap.size} documents in 'foodItems' to delete.`);
  for (const d of foodSnap.docs) {
    console.log(` - Deleting foodItems/${d.id} (${d.data().name})`);
    await deleteDoc(doc(db, "foodItems", d.id));
  }
  console.log("✅ 'foodItems' collection cleaned up.");

  // 4. Verify post-cleanup state
  console.log("\n=== POST-CLEANUP VERIFICATION ===");
  const postHouseSnap = await getDocs(collection(db, "house_listings"));
  console.log(`Top-level house_listings count: ${postHouseSnap.size}`);

  const postFoodSnap = await getDocs(collection(db, "foodItems"));
  console.log(`Top-level foodItems count: ${postFoodSnap.size}`);

  const postSubProps = await getDocs(collectionGroup(db, "properties"));
  console.log(`Total properties in subcollections: ${postSubProps.size}`);

  const postSubMenu = await getDocs(collectionGroup(db, "menu"));
  console.log(`Total menu items in subcollections: ${postSubMenu.size}`);

  console.log("\n🎉 Cleanup successfully finished!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
