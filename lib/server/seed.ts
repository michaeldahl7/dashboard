import { db } from "./db";
import { inventory } from "./schema";
import { ulid } from "ulid";

export async function seedLocations(houseId: string) {
   const defaultLocations = [
      { name: "Main Fridge", type: "fridge" },
      { name: "Freezer", type: "freezer" },
      { name: "Pantry", type: "pantry" },
      { name: "Kitchen Counter", type: "counter" },
   ] as const;

   await db.insert(inventory).values(
      defaultLocations.map(location => ({
         id: ulid(),
         name: location.name,
         type: location.type,
         house_id: houseId,
      }))
   );
}

// For development seeding
if (process.env.NODE_ENV === 'development') {
   const TEST_HOUSE_ID = 'test_house_id'; // Replace with actual test house ID
   seedLocations(TEST_HOUSE_ID)
      .then(() => {
         console.log('✅ Default locations seeded successfully');
         process.exit(0);
      })
      .catch((error) => {
         console.error('❌ Error seeding default locations:', error);
         process.exit(1);
      });
}
