// import { db } from "./index";
// import { inventory, user } from "./schema";

// export async function seedLocations() {
//   const [testUser] = await db.select().from(user).limit(1);
//   await db.insert(inventory).values([
//     { name: "Main Fridge", type: "fridge", user_id: testUser.id },
//     { name: "Freezer", type: "freezer", user_id: testUser.id },
//     { name: "Pantry", type: "pantry", user_id: testUser.id },
//     { name: "Kitchen Counter", type: "counter", user_id: testUser.id },
//   ]);
// }

// // Run immediately
// seedLocations()
//   .then(() => {
//     console.log('✅ Locations seeded successfully');
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error('❌ Error seeding locations:', error);
//     process.exit(1);
//   });
