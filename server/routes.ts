import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cities
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  // Get a city by slug
  app.get("/api/cities/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const city = await storage.getCityBySlug(slug);
      
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      
      res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });

  // Get itinerary for a specific city and duration
  app.get("/api/itinerary", async (req, res) => {
    try {
      const schema = z.object({
        city: z.string(),
        days: z.string().transform(val => parseInt(val, 10))
      });

      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request parameters",
          errors: result.error.format() 
        });
      }
      
      const { city, days } = result.data;
      
      if (days < 1 || days > 7) {
        return res.status(400).json({ message: "Days must be between 1 and 7" });
      }
      
      const itinerary = await storage.getItinerary(city, days);
      
      if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }
      
      res.json(itinerary);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
