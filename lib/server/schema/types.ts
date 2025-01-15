import type { LocationSelect, ItemSelect, LocationTypeSelect } from "./location.schema";

export type UserRole = "admin" | "member";
export type OnboardingStep = "username" | "house" | "inventory" | "completed";
export type InviteStatus = "pending" | "accepted" | "rejected";

export interface LocationWithItems extends LocationSelect {
   items: ItemSelect[];
   type: LocationTypeSelect;
}
