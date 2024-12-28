ALTER TABLE "location" RENAME TO "inventory";--> statement-breakpoint
ALTER TABLE "inventory_item" RENAME TO "item";--> statement-breakpoint
ALTER TABLE "item" RENAME COLUMN "location_id" TO "inventory_id";--> statement-breakpoint
ALTER TABLE "item" DROP CONSTRAINT "inventory_item_location_id_location_id_fk";
--> statement-breakpoint
ALTER TABLE "inventory" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "item" ADD CONSTRAINT "item_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item" DROP COLUMN "expiry_date";--> statement-breakpoint
ALTER TABLE "item" DROP COLUMN "notes";