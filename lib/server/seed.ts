import { db } from "./db";
import { location, item, locationType, itemCategory } from "./schema/location.schema";
import type { QuantityUnit } from "./schema/location.schema";

const TEST_USER_ID = "foPmkmsU61wv17OuBBtbt2FP6u2bvMOG";
const TEST_HOUSE_ID = 1;

interface SeedItem {
   name: string;
   category: string;
   location: string;
   quantity: number;
   unit: QuantityUnit;
   expiryDays: number;
}

const seedData = {
   locations: [
      { name: "Pantry", isDefault: true },
      { name: "Refrigerator", isDefault: true },
      { name: "Freezer", isDefault: true },
      { name: "Counter", isDefault: true },
   ],
   categories: [
      { name: "Dairy", isDefault: true },
      { name: "Meat", isDefault: true },
      { name: "Grains", isDefault: true },
      { name: "Canned", isDefault: true },
      { name: "Spices", isDefault: true },
      { name: "Snacks", isDefault: true },
      { name: "Beverages", isDefault: true },
      { name: "Frozen", isDefault: true },
   ],
   items: [
      {
         name: "Pasta",
         category: "Grains",
         location: "Pantry",
         quantity: 500,
         unit: "grams",
         expiryDays: 365,
      },
      {
         name: "Rice",
         category: "Grains",
         location: "Pantry",
         quantity: 1000,
         unit: "grams",
         expiryDays: 730,
      },
      {
         name: "Milk",
         category: "Dairy",
         location: "Refrigerator",
         quantity: 1,
         unit: "liters",
         expiryDays: 7,
      },
      {
         name: "Eggs",
         category: "Dairy",
         location: "Refrigerator",
         quantity: 12,
         unit: "pieces",
         expiryDays: 21,
      },
      {
         name: "Black Pepper",
         category: "Spices",
         location: "Spice Rack",
         quantity: 100,
         unit: "grams",
         expiryDays: 730,
      },
      {
         name: "Frozen Peas",
         category: "Frozen",
         location: "Freezer",
         quantity: 500,
         unit: "grams",
         expiryDays: 180,
      },
   ] satisfies SeedItem[],
};

async function seed() {
   // Reset tables
   await Promise.all([
      db.delete(item),
      db.delete(location),
      db.delete(locationType),
      db.delete(itemCategory),
   ]);

   // Create location types and categories
   const [locationTypes, categories] = await Promise.all([
      db
         .insert(locationType)
         .values(seedData.locations.map((l) => ({ ...l, houseId: TEST_HOUSE_ID })))
         .returning(),
      db
         .insert(itemCategory)
         .values(seedData.categories.map((c) => ({ ...c, houseId: TEST_HOUSE_ID })))
         .returning(),
   ]);

   // Create locations
   const locations = await db
      .insert(location)
      .values(
         locationTypes.map((type) => ({
            name: type.name,
            typeId: type.id,
            houseId: TEST_HOUSE_ID,
            isCustom: false,
         })),
      )
      .returning();

   // Create maps for lookups
   const locationMap = new Map(locations.map((l) => [l.name, l.id]));
   const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

   // Create items
   await db.insert(item).values(
      seedData.items.map((itemData) => ({
         name: itemData.name,
         locationId: locationMap.get(itemData.location)!,
         categoryId: categoryMap.get(itemData.category)!,
         quantity: itemData.quantity,
         unit: itemData.unit,
         expiryDate: new Date(Date.now() + itemData.expiryDays * 24 * 60 * 60 * 1000),
      })),
   );
}

seed().catch((e) => {
   console.error(e);
   process.exit(1);
});
