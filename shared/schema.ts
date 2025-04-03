import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the users table (keeping it from the base schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define the cities table
export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertCitySchema = createInsertSchema(cities).pick({
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
});

export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

// Define the attractions table
export const attractions = pgTable("attractions", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  cost: text("cost"),
  tipTitle: text("tip_title"),
  tipDescription: text("tip_description"),
});

export const insertAttractionSchema = createInsertSchema(attractions).pick({
  cityId: true,
  name: true,
  description: true,
  location: true,
  cost: true,
  tipTitle: true,
  tipDescription: true,
});

export type InsertAttraction = z.infer<typeof insertAttractionSchema>;
export type Attraction = typeof attractions.$inferSelect;

// Define the itinerary items table
export const itineraryItems = pgTable("itinerary_items", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").notNull(),
  attractionId: integer("attraction_id").notNull(),
  dayNumber: integer("day_number").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  duration: text("duration").notNull(),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const insertItineraryItemSchema = createInsertSchema(itineraryItems).pick({
  cityId: true,
  attractionId: true,
  dayNumber: true,
  startTime: true,
  endTime: true,
  duration: true,
  title: true,
  sortOrder: true,
});

export type InsertItineraryItem = z.infer<typeof insertItineraryItemSchema>;
export type ItineraryItem = typeof itineraryItems.$inferSelect;

// Define the day headers
export const dayHeaders = pgTable("day_headers", {
  id: serial("id").primaryKey(),
  cityId: integer("city_id").notNull(),
  dayNumber: integer("day_number").notNull(),
  title: text("title").notNull(),
});

export const insertDayHeaderSchema = createInsertSchema(dayHeaders).pick({
  cityId: true,
  dayNumber: true,
  title: true,
});

export type InsertDayHeader = z.infer<typeof insertDayHeaderSchema>;
export type DayHeader = typeof dayHeaders.$inferSelect;

// Define a type for the complete itinerary data structure (used for API responses)
export type ItineraryDay = {
  dayNumber: number;
  title: string;
  activities: ItineraryActivity[];
};

export type ItineraryActivity = {
  id: number;
  startTime: string;
  endTime: string;
  duration: string;
  title: string;
  description: string;
  location: string;
  cost?: string;
  tipTitle?: string;
  tipDescription?: string;
};

export type CompleteItinerary = {
  city: City;
  days: ItineraryDay[];
};
