// import { db } from "./db";
// import { inventory, user } from "./schema";

// export async function seedLocations() {
//   const [testUser] = await db.select().from(user).limit(1);
//   await db.insert(inventory).values([
//     { name: "Main Fridge", type: "fridge", house_id: testUser. },
//     { name: "Freezer", type: "freezer", house_id: testUser.id },
//     { name: "Pantry", type: "pantry", house_id: testUser.id },
//     { name: "Kitchen Counter", type: "counter", house_id: testUser.id },
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
