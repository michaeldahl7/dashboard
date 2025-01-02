import { db } from "~/lib/server/db";
import { house, houseMember, type InsertHouse, type InsertHouseMember } from "~/lib/server/db/schema";
import { nanoid } from "nanoid";

export const houseApi = {
  async createHouse(data: { name: string; ownerId: string }) {
    const newHouse: InsertHouse = {
      id: nanoid(),
      name: data.name,
      owner_id: data.ownerId,
    };

    // Create house
    await db.insert(house).values(newHouse);

    // Add owner as a member with admin role
    const membership: InsertHouseMember = {
      id: nanoid(),
      house_id: newHouse.id,
      user_id: data.ownerId,
      role: "admin",
    };

    await db.insert(houseMember).values(membership);

    return newHouse;
  },

  async inviteMember(data: { houseId: string; userId: string }) {
    const membership: InsertHouseMember = {
      id: nanoid(),
      house_id: data.houseId,
      user_id: data.userId,
      role: "member",
    };

    return await db.insert(houseMember).values(membership);
  },

  async getUserHouses(userId: string) {
    return await db.query.houseMember.findMany({
      where: (hm, { eq }) => eq(hm.user_id, userId),
      with: {
        house: true,
      },
    });
  },

  async getHouseMembers(houseId: string) {
    return await db.query.houseMember.findMany({
      where: (hm, { eq }) => eq(hm.house_id, houseId),
      with: {
        user: true,
      },
    });
  },
}; 