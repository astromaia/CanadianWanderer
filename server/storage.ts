import { cities, type City, type InsertCity } from "@shared/schema";
import { attractions, type Attraction, type InsertAttraction } from "@shared/schema";
import { itineraryItems, type ItineraryItem, type InsertItineraryItem } from "@shared/schema";
import { dayHeaders, type DayHeader, type InsertDayHeader } from "@shared/schema";
import { type CompleteItinerary, type ItineraryDay, type ItineraryActivity } from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // City operations
  getAllCities(): Promise<City[]>;
  getCityById(id: number): Promise<City | undefined>;
  getCityBySlug(slug: string): Promise<City | undefined>;
  createCity(city: InsertCity): Promise<City>;
  
  // Attraction operations
  getAttractionById(id: number): Promise<Attraction | undefined>;
  getAttractionsByCityId(cityId: number): Promise<Attraction[]>;
  createAttraction(attraction: InsertAttraction): Promise<Attraction>;
  
  // Day header operations
  getDayHeadersByCityId(cityId: number): Promise<DayHeader[]>;
  createDayHeader(dayHeader: InsertDayHeader): Promise<DayHeader>;
  
  // Itinerary item operations
  getItineraryItemsByCityAndDay(cityId: number, dayNumber: number): Promise<ItineraryItem[]>;
  createItineraryItem(item: InsertItineraryItem): Promise<ItineraryItem>;
  
  // Combined operations
  getItinerary(citySlug: string, days: number): Promise<CompleteItinerary | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private cities: Map<number, City>;
  private attractions: Map<number, Attraction>;
  private itineraryItems: Map<number, ItineraryItem>;
  private dayHeaders: Map<number, DayHeader>;
  
  private currentCityId: number;
  private currentAttractionId: number;
  private currentItineraryItemId: number;
  private currentDayHeaderId: number;
  
  constructor() {
    this.cities = new Map();
    this.attractions = new Map();
    this.itineraryItems = new Map();
    this.dayHeaders = new Map();
    
    this.currentCityId = 1;
    this.currentAttractionId = 1;
    this.currentItineraryItemId = 1;
    this.currentDayHeaderId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Create cities
    const toronto = this.createCity({
      name: "Toronto",
      slug: "toronto",
      description: "Explore Canada's largest city with iconic landmarks, cultural diversity, and urban adventures.",
      imageUrl: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
    });
    
    const vancouver = this.createCity({
      name: "Vancouver",
      slug: "vancouver",
      description: "Discover the west coast gem with stunning nature, mountains, and ocean all in one breathtaking city.",
      imageUrl: "https://images.unsplash.com/photo-1560813962-ff3d8fcf59ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
    });
    
    const montreal = this.createCity({
      name: "Montreal",
      slug: "montreal",
      description: "Experience the European charm of Canada with rich history, french culture, and amazing food.",
      imageUrl: "https://images.unsplash.com/photo-1519178614-68673b201f36?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
    });
    
    const quebec = this.createCity({
      name: "Quebec City",
      slug: "quebec",
      description: "Step back in time with cobblestone streets, historic architecture, and French heritage.",
      imageUrl: "https://images.unsplash.com/photo-1557456170-0cf4f4d0d362?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
    });
    
    const banff = this.createCity({
      name: "Banff",
      slug: "banff",
      description: "Immerse yourself in the majestic Rocky Mountains with pristine lakes, wildlife, and outdoor activities.",
      imageUrl: "https://images.unsplash.com/photo-1527153818091-1a9638521e2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
    });
    
    const halifax = this.createCity({
      name: "Halifax",
      slug: "halifax",
      description: "Enjoy maritime charm with coastal views, friendly locals, and fresh seafood in Nova Scotia's capital.",
      imageUrl: "https://images.unsplash.com/photo-1588732570005-5012ee9c0224?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
    });
    
    // Create Toronto attractions
    const cnTower = this.createAttraction({
      cityId: toronto.id,
      name: "CN Tower Experience",
      description: "Start your Toronto adventure with spectacular views from one of the world's tallest free-standing structures. Take the glass elevator to the observation deck and walk on the glass floor if you dare!",
      location: "290 Bremner Blvd",
      cost: "$40 CAD per person",
      tipTitle: "Traveler Tip",
      tipDescription: "Purchase tickets online in advance to avoid long lines. For the best experience, try to visit early in the morning to avoid crowds."
    });
    
    const ripleysAquarium = this.createAttraction({
      cityId: toronto.id,
      name: "Ripley's Aquarium of Canada",
      description: "Located at the base of the CN Tower, this aquarium features a moving walkway through an underwater tunnel, where you can observe sharks, rays, and colorful fish swimming overhead.",
      location: "288 Bremner Blvd",
      cost: "$35 CAD per person",
      tipTitle: "Traveler Tip",
      tipDescription: "Check the feeding schedule upon arrival to catch these exciting events. The Dangerous Lagoon tunnel is a must-see attraction!"
    });
    
    const rom = this.createAttraction({
      cityId: toronto.id,
      name: "Royal Ontario Museum",
      description: "Explore Canada's largest museum of world cultures and natural history. The ROM features extensive galleries of art, archaeology and natural science from around the world and across the ages.",
      location: "100 Queen's Park",
      cost: "$23 CAD per person",
      tipTitle: "Traveler Tip",
      tipDescription: "Don't miss the dinosaur exhibit and the crystal architecture of the Michael Lee-Chin Crystal. On Wednesdays, admission is discounted during the last hour before closing."
    });
    
    const distilleryDistrict = this.createAttraction({
      cityId: toronto.id,
      name: "Distillery District & Dinner",
      description: "End your day at this historic and pedestrian-only village set in beautifully restored Victorian industrial buildings. Enjoy boutique shops, art galleries, and dine at one of the many restaurants.",
      location: "55 Mill St",
      cost: "$30-50 CAD for dinner",
      tipTitle: "Traveler Tip",
      tipDescription: "Try the Mill Street Brewery for local craft beers or El Catrin for excellent Mexican food with a beautiful patio during summer months."
    });
    
    const torontoIslands = this.createAttraction({
      cityId: toronto.id,
      name: "Toronto Islands Day Trip",
      description: "Take the ferry to the Toronto Islands for a day of relaxation away from the city bustle. Enjoy beaches, picnic areas, walking trails, and fantastic skyline views.",
      location: "Jack Layton Ferry Terminal",
      cost: "$8.50 CAD round trip",
      tipTitle: "Traveler Tip",
      tipDescription: "Bring a picnic lunch and plenty of water. Rent bikes on the island to explore more efficiently."
    });
    
    const kensingtonMarket = this.createAttraction({
      cityId: toronto.id,
      name: "Kensington Market & Chinatown",
      description: "Explore these vibrant multicultural neighborhoods with their unique shops, international cuisine, and street art.",
      location: "Kensington Ave & Spadina Ave",
      cost: "Free (shopping/food extra)",
      tipTitle: "Traveler Tip",
      tipDescription: "Visit on the last Sunday of the month in summer when the streets are closed to vehicles for Pedestrian Sundays."
    });
    
    const casaLoma = this.createAttraction({
      cityId: toronto.id,
      name: "Casa Loma",
      description: "Explore this Gothic Revival castle and gardens in midtown Toronto, complete with towers, secret passages, and elegant rooms.",
      location: "1 Austin Terrace",
      cost: "$30 CAD per person",
      tipTitle: "Traveler Tip",
      tipDescription: "Don't miss the stunning views of the city from the towers and the beautiful gardens during summer."
    });
    
    const highPark = this.createAttraction({
      cityId: toronto.id,
      name: "High Park Exploration",
      description: "Toronto's largest public park features hiking trails, sports facilities, a zoo, playgrounds, and beautiful cherry blossoms in spring.",
      location: "1873 Bloor St W",
      cost: "Free",
      tipTitle: "Traveler Tip",
      tipDescription: "Visit in late April or early May to see the famous cherry blossoms, but get there early as it gets very crowded."
    });
    
    const stLawrenceMarket = this.createAttraction({
      cityId: toronto.id,
      name: "St. Lawrence Market",
      description: "One of the world's great food markets, featuring over 120 vendors selling fresh food, prepared foods, and unique non-food items.",
      location: "93 Front St E",
      cost: "Free (food costs extra)",
      tipTitle: "Traveler Tip",
      tipDescription: "Try the peameal bacon sandwich at Carousel Bakery, a Toronto specialty. The market is closed on Mondays and Sundays."
    });
    
    // Create Toronto day headers
    for (let day = 1; day <= 7; day++) {
      let title;
      switch (day) {
        case 1: title = "Exploring Downtown Toronto"; break;
        case 2: title = "Nature & Island Adventure"; break;
        case 3: title = "Cultural Exploration"; break;
        case 4: title = "Historic Toronto"; break;
        case 5: title = "Artistic Adventures"; break;
        case 6: title = "Neighborhood Discoveries"; break;
        case 7: title = "Relaxation & Recreation"; break;
        default: title = `Day ${day} in Toronto`;
      }
      
      this.createDayHeader({
        cityId: toronto.id,
        dayNumber: day,
        title
      });
    }
    
    // Create Toronto itinerary items for Day 1
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: cnTower.id,
      dayNumber: 1,
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      duration: "2 hours",
      title: "CN Tower Experience",
      sortOrder: 1
    });
    
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: ripleysAquarium.id,
      dayNumber: 1,
      startTime: "11:30 AM",
      endTime: "1:30 PM",
      duration: "2 hours",
      title: "Ripley's Aquarium of Canada",
      sortOrder: 2
    });
    
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: rom.id,
      dayNumber: 1,
      startTime: "2:00 PM",
      endTime: "5:00 PM",
      duration: "3 hours",
      title: "Royal Ontario Museum",
      sortOrder: 3
    });
    
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: distilleryDistrict.id,
      dayNumber: 1,
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      duration: "3 hours",
      title: "Distillery District & Dinner",
      sortOrder: 4
    });
    
    // Create Toronto itinerary items for Day 2
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: torontoIslands.id,
      dayNumber: 2,
      startTime: "10:00 AM",
      endTime: "3:00 PM",
      duration: "5 hours",
      title: "Toronto Islands Day Trip",
      sortOrder: 1
    });
    
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: distilleryDistrict.id,
      dayNumber: 2,
      startTime: "4:00 PM",
      endTime: "7:00 PM",
      duration: "3 hours",
      title: "Shopping & Dinner at Eaton Centre",
      sortOrder: 2
    });
    
    // Create Toronto itinerary items for Day 3
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: kensingtonMarket.id,
      dayNumber: 3,
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      duration: "2 hours",
      title: "Kensington Market & Chinatown",
      sortOrder: 1
    });
    
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: casaLoma.id,
      dayNumber: 3,
      startTime: "12:00 PM",
      endTime: "3:00 PM",
      duration: "3 hours",
      title: "Casa Loma",
      sortOrder: 2
    });
    
    // Create Toronto itinerary items for Day 4
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: stLawrenceMarket.id,
      dayNumber: 4,
      startTime: "9:00 AM",
      endTime: "11:00 AM",
      duration: "2 hours",
      title: "St. Lawrence Market",
      sortOrder: 1
    });
    
    this.createItineraryItem({
      cityId: toronto.id,
      attractionId: highPark.id,
      dayNumber: 4,
      startTime: "1:00 PM",
      endTime: "5:00 PM",
      duration: "4 hours",
      title: "High Park Exploration",
      sortOrder: 2
    });
    
    // Create data for other cities
    // (In a production app, we would add more comprehensive data for each city)
    
    // Vancouver
    const stanleyPark = this.createAttraction({
      cityId: vancouver.id,
      name: "Stanley Park Seawall",
      description: "Enjoy a scenic walk, bike ride, or rollerblade along the 8.8km seawall that surrounds Vancouver's urban park with ocean views.",
      location: "Stanley Park",
      cost: "Free",
      tipTitle: "Traveler Tip",
      tipDescription: "Rent a bike at the park entrance and plan for 2-3 hours to complete the full loop."
    });
    
    this.createDayHeader({
      cityId: vancouver.id,
      dayNumber: 1,
      title: "Vancouver's Natural Beauty"
    });
    
    this.createItineraryItem({
      cityId: vancouver.id,
      attractionId: stanleyPark.id,
      dayNumber: 1,
      startTime: "9:00 AM",
      endTime: "12:00 PM",
      duration: "3 hours",
      title: "Stanley Park Exploration",
      sortOrder: 1
    });
    
    // More attractions and itinerary items would be added for each city...
  }
  
  // City operations
  async getAllCities(): Promise<City[]> {
    return Array.from(this.cities.values());
  }
  
  async getCityById(id: number): Promise<City | undefined> {
    return this.cities.get(id);
  }
  
  async getCityBySlug(slug: string): Promise<City | undefined> {
    return Array.from(this.cities.values()).find(city => city.slug === slug);
  }
  
  async createCity(city: InsertCity): Promise<City> {
    const id = this.currentCityId++;
    const newCity: City = { ...city, id };
    this.cities.set(id, newCity);
    return newCity;
  }
  
  // Attraction operations
  async getAttractionById(id: number): Promise<Attraction | undefined> {
    return this.attractions.get(id);
  }
  
  async getAttractionsByCityId(cityId: number): Promise<Attraction[]> {
    return Array.from(this.attractions.values()).filter(
      attraction => attraction.cityId === cityId
    );
  }
  
  async createAttraction(attraction: InsertAttraction): Promise<Attraction> {
    const id = this.currentAttractionId++;
    const newAttraction: Attraction = { ...attraction, id };
    this.attractions.set(id, newAttraction);
    return newAttraction;
  }
  
  // Day header operations
  async getDayHeadersByCityId(cityId: number): Promise<DayHeader[]> {
    return Array.from(this.dayHeaders.values()).filter(
      header => header.cityId === cityId
    ).sort((a, b) => a.dayNumber - b.dayNumber);
  }
  
  async createDayHeader(dayHeader: InsertDayHeader): Promise<DayHeader> {
    const id = this.currentDayHeaderId++;
    const newDayHeader: DayHeader = { ...dayHeader, id };
    this.dayHeaders.set(id, newDayHeader);
    return newDayHeader;
  }
  
  // Itinerary item operations
  async getItineraryItemsByCityAndDay(cityId: number, dayNumber: number): Promise<ItineraryItem[]> {
    return Array.from(this.itineraryItems.values())
      .filter(item => item.cityId === cityId && item.dayNumber === dayNumber)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  async createItineraryItem(item: InsertItineraryItem): Promise<ItineraryItem> {
    const id = this.currentItineraryItemId++;
    const newItem: ItineraryItem = { ...item, id };
    this.itineraryItems.set(id, newItem);
    return newItem;
  }
  
  // Combined operations
  async getItinerary(citySlug: string, days: number): Promise<CompleteItinerary | undefined> {
    const city = await this.getCityBySlug(citySlug);
    if (!city) return undefined;
    
    const itineraryDays: ItineraryDay[] = [];
    const dayHeaders = await this.getDayHeadersByCityId(city.id);
    
    for (let dayNumber = 1; dayNumber <= days; dayNumber++) {
      const dayHeader = dayHeaders.find(h => h.dayNumber === dayNumber);
      if (!dayHeader) continue;
      
      const itineraryItems = await this.getItineraryItemsByCityAndDay(city.id, dayNumber);
      
      const activities: ItineraryActivity[] = [];
      
      for (const item of itineraryItems) {
        const attraction = await this.getAttractionById(item.attractionId);
        if (!attraction) continue;
        
        activities.push({
          id: item.id,
          startTime: item.startTime,
          endTime: item.endTime,
          duration: item.duration,
          title: item.title,
          description: attraction.description,
          location: attraction.location,
          cost: attraction.cost,
          tipTitle: attraction.tipTitle,
          tipDescription: attraction.tipDescription
        });
      }
      
      itineraryDays.push({
        dayNumber,
        title: dayHeader.title,
        activities
      });
    }
    
    return {
      city,
      days: itineraryDays
    };
  }
}

export const storage = new MemStorage();
