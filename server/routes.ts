import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { storage } from "./storage";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Doctors
  app.get(api.doctors.list.path, async (req, res) => {
    const doctors = await storage.getDoctors();
    res.json(doctors);
  });

  app.get(api.doctors.get.path, async (req, res) => {
    const doctor = await storage.getDoctor(Number(req.params.id));
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  });

  // Settings
  app.get(api.settings.get.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.claims.sub;
    const settings = await storage.getUserSettings(userId);
    res.json(settings || { userId, theme: 'light' });
  });

  app.patch(api.settings.updateLocation.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.claims.sub;
    try {
      const { latitude, longitude, address } = api.settings.updateLocation.input.parse(req.body);
      const updated = await storage.updateUserLocation(userId, latitude, longitude, address);
      res.json(updated);
    } catch (error) {
       res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.settings.toggleTheme.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.claims.sub;
    const { theme } = req.body;
    const updated = await storage.updateUserTheme(userId, theme);
    res.json(updated);
  });

  app.get(api.drugs.search.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const query = req.query.q as string;
    if (!query) return res.json([]);
    const results = await storage.searchDrugs(query);
    res.json(results);
  });

  app.patch(api.profile.updateAvatar.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { avatarUrl } = api.profile.updateAvatar.input.parse(req.body);
      const userId = req.user.claims.sub;
      const updatedUser = await storage.updateUserAvatar(userId, avatarUrl);
      res.json(updatedUser);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed Data
  const doctorsList = await storage.getDoctors();
  if (doctorsList.length === 0) {
    await storage.createDoctor({
      name: "Dr. Emily Smith",
      specialty: "Cardiologist",
      timing: "9:00 AM - 5:00 PM",
      days: "Mon - Fri",
      address: "123 Heart Lane",
      latitude: 40.7128,
      longitude: -74.0060,
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
    });
    await storage.createDoctor({
      name: "Dr. John Doe",
      specialty: "Dermatologist",
      timing: "10:00 AM - 4:00 PM",
      days: "Tue - Sat",
      address: "456 Skin Blvd",
      latitude: 40.7328,
      longitude: -73.9960,
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
    });
     await storage.createDoctor({
      name: "Dr. Sarah Lee",
      specialty: "Pediatrician",
      timing: "8:00 AM - 2:00 PM",
      days: "Mon, Wed, Fri",
      address: "789 Kids Way",
      latitude: 40.7528,
      longitude: -73.9860,
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300"
    });
  }

  const drugList = await storage.searchDrugs("Paracetamol");
  if (drugList.length === 0) {
    const commonDrugs = [
      { name: "Paracetamol", dosageForm: "Tablet", strength: "500mg", ceilingPrice: 2.04 },
      { name: "Amoxicillin", dosageForm: "Capsule", strength: "250mg", ceilingPrice: 5.42 },
      { name: "Metformin", dosageForm: "Tablet", strength: "500mg", ceilingPrice: 1.85 },
      { name: "Atorvastatin", dosageForm: "Tablet", strength: "10mg", ceilingPrice: 8.24 },
      { name: "Amlodipine", dosageForm: "Tablet", strength: "5mg", ceilingPrice: 2.45 },
    ];
    for (const drug of commonDrugs) {
      await db.insert(drugPrices).values(drug);
    }
  }

  return httpServer;
}
