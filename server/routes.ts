import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { generateItinerary, searchCities } from "./openai";
import { CompleteItinerary } from "../shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all cities with optional search functionality
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      
      // If search parameter is provided, filter cities using OpenAI
      if (req.query.search) {
        const searchResults = await searchCities(String(req.query.search), cities);
        return res.json(searchResults);
      }
      
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
        days: z.string().transform(val => parseInt(val, 10)),
        useAI: z.enum(['true', 'false']).optional()
      });

      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request parameters",
          errors: result.error.format() 
        });
      }
      
      const { city: citySlug, days, useAI } = result.data;
      
      if (days < 1 || days > 7) {
        return res.status(400).json({ message: "Days must be between 1 and 7" });
      }
      
      // Get city data
      const cityData = await storage.getCityBySlug(citySlug);
      if (!cityData) {
        return res.status(404).json({ message: "City not found" });
      }
      
      // Try to get from database first if AI is not explicitly requested
      let itinerary = null;
      if (useAI !== 'true') {
        itinerary = await storage.getItinerary(citySlug, days);
      }
      
      // If we don't have it in our database or AI is requested, generate with OpenAI
      if (!itinerary || useAI === 'true') {
        console.log(`Generating AI itinerary for ${cityData.name} (${days} days)`);
        
        // Always try to get stored itinerary first as a backup
        const storedItinerary = await storage.getItinerary(citySlug, days);
        
        try {
          // Check if we're dealing with quota exceeded error
          if (req.query.skipAI === 'true') {
            throw new Error('AI generation skipped due to quota limitations');
          }
          
          const generatedItinerary = await generateItinerary(
            cityData.name,
            cityData.description,
            days
          );
          
          // Format the OpenAI response to match our schema
          const aiItinerary: CompleteItinerary = {
            city: cityData,
            days: generatedItinerary.days.map((day: any) => ({
              dayNumber: day.dayNumber,
              title: day.title,
              activities: day.activities.map((activity: any) => ({
                id: activity.id || Math.floor(Math.random() * 10000),  // Generate ID if not provided
                startTime: activity.startTime,
                endTime: activity.endTime,
                duration: activity.duration,
                title: activity.title,
                description: activity.description,
                location: activity.location,
                cost: activity.cost,
                tipTitle: activity.tipTitle,
                tipDescription: activity.tipDescription
              }))
            }))
          };
          
          return res.json(aiItinerary);
        } catch (error: any) {
          console.error("Error generating AI itinerary:", error);
          
          // Check if error is related to quota limits
          const isQuotaError = error.message && (
            error.message.includes('quota') || 
            error.message.includes('rate limit') ||
            error.message.includes('429')
          );
          
          // If we have a stored itinerary, return that as fallback
          if (storedItinerary) {
            console.log("Falling back to stored itinerary");
            
            // Add a flag to the response to indicate we're using a fallback
            return res.json({
              ...storedItinerary,
              _fallback: true,
              _fallbackReason: isQuotaError ? 
                "AI quota exceeded, using pre-built itinerary instead" : 
                "Error generating AI itinerary, using pre-built itinerary instead"
            });
          }
          
          // Special error message for quota issues
          if (isQuotaError) {
            return res.status(429).json({
              message: "Our AI service is currently at capacity. Please try again later or use pre-built itineraries.",
              error: "AI quota exceeded",
              useStoredItinerary: true
            });
          }
          
          return res.status(500).json({ 
            message: "Failed to generate itinerary with AI",
            error: error.message || String(error),
            useStoredItinerary: true
          });
        }
      }
      
      res.json(itinerary);
    } catch (error: any) {
      console.error("Error fetching itinerary:", error);
      res.status(500).json({ message: "Failed to fetch itinerary" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
