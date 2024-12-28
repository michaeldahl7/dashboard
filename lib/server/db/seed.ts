import { db } from "./index";
import { location } from "./schema";

export async function seedLocations() {
   await db.insert(location).values([
      { name: "Main Fridge", type: "fridge" },
      { name: "Freezer", type: "freezer" },
      { name: "Pantry", type: "pantry" },
      { name: "Kitchen Counter", type: "counter" },
   ]);
}

// Add this to execute the seed when the file is run directly
if (import.meta.main) {
   seedLocations()
      .then(() => {
         console.log('✅ Locations seeded successfully');
         process.exit(0);
      })
      .catch((error) => {
         console.error('❌ Error seeding locations:', error);
         process.exit(1);
      });
} 