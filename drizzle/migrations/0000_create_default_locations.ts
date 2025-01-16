import { sql } from "drizzle-orm";
import {
   createDefaultLocationsFunction,
   createDefaultLocationsTrigger,
} from "~/lib/server/schema/location.schema";

export async function up(db: any) {
   await db.execute(createDefaultLocationsFunction);
   await db.execute(createDefaultLocationsTrigger);
}

export async function down(db: any) {
   await db.execute(
      sql`DROP TRIGGER IF EXISTS create_default_locations_trigger ON house`,
   );
   await db.execute(sql`DROP FUNCTION IF EXISTS create_default_locations`);
}
