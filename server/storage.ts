import { db } from "./db";
import { users, doctors, userSettings, drugPrices, type User, type Doctor, type InsertDoctor, type UserSettings, type InsertUserSettings, type DrugPrice } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Doctors
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserLocation(userId: string, lat: number, lng: number, address?: string): Promise<UserSettings>;
  updateUserTheme(userId: string, theme: string): Promise<UserSettings>;

  // Drugs
  searchDrugs(query: string): Promise<DrugPrice[]>;
  updateUserAvatar(userId: string, avatarUrl: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // Doctors
  async getDoctors(): Promise<Doctor[]> {
    return await db.select().from(doctors);
  }

  async getDoctor(id: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db.insert(doctors).values(insertDoctor).returning();
    return doctor;
  }

  // Settings
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return settings;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [newSettings] = await db.insert(userSettings).values(settings).returning();
    return newSettings;
  }

  async updateUserLocation(userId: string, lat: number, lng: number, address?: string): Promise<UserSettings> {
    // Check if settings exist, if not create
    let settings = await this.getUserSettings(userId);
    if (!settings) {
       return this.createUserSettings({ userId, locationLat: lat, locationLng: lng, locationName: address, theme: 'light' });
    }

    const [updated] = await db
      .update(userSettings)
      .set({ locationLat: lat, locationLng: lng, locationName: address })
      .where(eq(userSettings.userId, userId))
      .returning();
    return updated;
  }

  async updateUserTheme(userId: string, theme: string): Promise<UserSettings> {
    let settings = await this.getUserSettings(userId);
    if (!settings) {
       return this.createUserSettings({ userId, theme, locationLat: null, locationLng: null, locationName: null });
    }

    const [updated] = await db
      .update(userSettings)
      .set({ theme })
      .where(eq(userSettings.userId, userId))
      .returning();
    return updated;
  }

  // Drugs
  async searchDrugs(query: string): Promise<DrugPrice[]> {
    const results = await db.select().from(drugPrices);
    return results.filter(drug => 
      drug.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
