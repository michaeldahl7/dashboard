import { db } from "./index";
import { inventory, user } from "./schema";

export async function seedLocations() {
   const [testUser] = await db.insert(user).values({
      name: "Test User",
      email: "test@example.com",
      avatar_url: "https://avatar.vercel.sh/test",
   }).returning();

   await db.insert(inventory).values([
      { name: "Main Fridge", type: "fridge", user_id: testUser.id },
      { name: "Freezer", type: "freezer", user_id: testUser.id },
      { name: "Pantry", type: "pantry", user_id: testUser.id },
      { name: "Kitchen Counter", type: "counter", user_id: testUser.id },
   ]);
}

// Add this to execute the seed when the file is run directly
if (process.argv[1] === import.meta.url) {
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