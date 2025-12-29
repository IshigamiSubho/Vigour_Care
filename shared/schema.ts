import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
export * from "./models/auth"; // Export auth models

// Users are handled by Replit Auth (users table in models/auth.ts)

// === DOCTORS ===
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  imageUrl: text("image_url"),
  timing: text("timing").notNull(), // e.g., "9:00 AM - 5:00 PM"
  days: text("days").notNull(), // e.g., "Mon - Fri"
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  address: text("address").notNull(),
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({ id: true });
export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;

// === USER SETTINGS ===
// Extension of the user profile for settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Links to users.id from auth
  locationLat: doublePrecision("location_lat"),
  locationLng: doublePrecision("location_lng"),
  locationName: text("location_name"),
  theme: text("theme").default("light"), // 'light' or 'dark'
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export const updateUserLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});
