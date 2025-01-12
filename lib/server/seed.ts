import { ulid } from "ulid";
import { db } from "./db";
import { location } from "./schema";

export async function seedLocations(houseId: string) {
   const defaultLocations = [
      { name: "Main Fridge", type: "fridge" },
      { name: "Freezer", type: "freezer" },
      { name: "Pantry", type: "pantry" },
      { name: "Kitchen Counter", type: "counter" },
   ] as const;

   await db.insert(location).values(
      defaultLocations.map((loc) => ({
         id: ulid(),
         name: loc.name,
         type: loc.type,
         houseId: houseId,
      })),
   );
}

// For development seeding
if (process.env.NODE_ENV === "development") {
   const TEST_HOUSE_ID = "test_house_id"; // Replace with actual test house ID
   seedLocations(TEST_HOUSE_ID)
      .then(() => {
         console.log("✅ Default locations seeded successfully");
         process.exit(0);
      })
      .catch((error) => {
         console.error("❌ Error seeding default locations:", error);
         process.exit(1);
      });
}
