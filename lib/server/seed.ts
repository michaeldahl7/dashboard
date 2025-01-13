import { db } from "./db";
import { seed } from "drizzle-seed";
import * as schema from "./schema";
import { location, item } from "./schema/location.schema";
import { eq } from "drizzle-orm";

const TEST_USER_ID = "9YCmRBReTdNCk4YrK5qg72dUbul4R2VdBG";
const TEST_HOUSE_ID = 1;

const commonItems = [
   // Pantry items
   { name: "Pasta", category: "Pantry", quantity: 500, unit: "g", expiryDays: 365 },
   { name: "Rice", category: "Pantry", quantity: 1000, unit: "g", expiryDays: 730 },
   {
      name: "Canned Tomatoes",
      category: "Pantry",
      quantity: 400,
      unit: "g",
      expiryDays: 365,
   },
   { name: "Black Beans", category: "Pantry", quantity: 400, unit: "g", expiryDays: 365 },

   // Refrigerated items
   { name: "Milk", category: "Refrigerated", quantity: 1, unit: "L", expiryDays: 7 },
   {
      name: "Eggs",
      category: "Refrigerated",
      quantity: 12,
      unit: "count",
      expiryDays: 21,
   },
   { name: "Cheese", category: "Refrigerated", quantity: 200, unit: "g", expiryDays: 14 },

   // Freezer items
   {
      name: "Frozen Peas",
      category: "Freezer",
      quantity: 500,
      unit: "g",
      expiryDays: 180,
   },
   {
      name: "Chicken Breast",
      category: "Freezer",
      quantity: 1000,
      unit: "g",
      expiryDays: 90,
   },

   // Spices
   {
      name: "Black Pepper",
      category: "Spices",
      quantity: 100,
      unit: "g",
      expiryDays: 730,
   },
   { name: "Ground Cumin", category: "Spices", quantity: 50, unit: "g", expiryDays: 730 },

   // Snacks
   { name: "Potato Chips", category: "Snacks", quantity: 200, unit: "g", expiryDays: 60 },
   { name: "Mixed Nuts", category: "Snacks", quantity: 250, unit: "g", expiryDays: 90 },

   // Beverages
   {
      name: "Coffee Beans",
      category: "Beverages",
      quantity: 500,
      unit: "g",
      expiryDays: 180,
   },
   {
      name: "Green Tea",
      category: "Beverages",
      quantity: 20,
      unit: "bags",
      expiryDays: 365,
   },
];

async function resetItems() {
   await db.delete(item);
}

async function main() {
   await resetItems();

   // Get existing locations first
   const locations = await db
      .select()
      .from(location)
      .where(eq(location.houseId, TEST_HOUSE_ID));

   if (locations.length === 0) {
      console.error("No locations found for house ID:", TEST_HOUSE_ID);
      process.exit(1);
   }

   console.log(
      "Found locations:",
      locations.map((l) => l.name),
   );

   // Seed items with random locations
   await seed(db, {
      item: schema.item,
   }).refine((f) => ({
      item: {
         count: commonItems.length,
         columns: {
            name: f.valuesFromArray({ values: commonItems.map((item) => item.name) }),
            locationId: f.valuesFromArray({
               values: locations.map((loc) => loc.id),
            }),
            category: f.valuesFromArray({
               values: commonItems.map((item) => item.category),
            }),
            quantity: f.valuesFromArray({
               values: commonItems.map((item) => item.quantity),
            }),
            unit: f.valuesFromArray({
               values: commonItems.map((item) => item.unit),
            }),
            expiresAt: f.date({
               minDate: new Date(),
               maxDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
            }),
            createdAt: f.date({ minDate: new Date() }),
            updatedAt: f.date({ minDate: new Date() }),
            createdById: f.default({ defaultValue: TEST_USER_ID }),
            updatedById: f.default({ defaultValue: TEST_USER_ID }),
         },
      },
   }));
}

main().catch((e) => {
   console.error(e);
   process.exit(1);
});
