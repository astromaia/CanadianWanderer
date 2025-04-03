import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generate a travel itinerary using OpenAI GPT-4o
 * @param cityName The name of the city
 * @param cityDescription The description of the city
 * @param days Number of days for the itinerary
 * @returns Generated itinerary data
 */
export async function generateItinerary(cityName: string, cityDescription: string, days: number) {
  try {
    console.log(`Generating itinerary for ${cityName} for ${days} days`);
    
    const systemPrompt = `You are an expert Canadian travel guide with detailed knowledge of ${cityName}. 
    Create a detailed ${days}-day itinerary for ${cityName}, Canada. The itinerary should include:
    
    For each day:
    1. A catchy title for the day's theme
    2. Three activities divided into morning, afternoon, and evening
    3. For each activity provide:
       - A title prefixed with "Morning:", "Afternoon:", or "Evening:"
       - Start and end times
       - Duration
       - Detailed description of the activity
       - Specific location (address if possible)
       - Approximate cost in CAD
       - A helpful traveler tip related to that specific activity or location
    
    Use this city description for context: ${cityDescription}
    
    Make all recommendations realistic, specific to ${cityName}, and focus on Canadian culture and highlights.
    Ensure activities logically flow and consider travel time between locations.`;

    const userPrompt = `Please create a ${days}-day travel itinerary for ${cityName}, Canada. Include morning, afternoon, and evening activities for each day.`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const itineraryText = response.choices[0].message.content;
    
    if (!itineraryText) {
      throw new Error("Failed to generate itinerary content");
    }
    
    // Now send a followup request to structure the data correctly
    const structuringPrompt = `Convert the following travel itinerary for ${cityName} into a structured JSON format that follows this structure:
    {
      "days": [
        {
          "dayNumber": 1,
          "title": "Day's theme/title",
          "activities": [
            {
              "id": 1,
              "startTime": "9:00 AM",
              "endTime": "11:30 AM",
              "duration": "2.5 hours",
              "title": "Morning: Activity name",
              "description": "Detailed description",
              "location": "Specific address/location",
              "cost": "Cost in CAD",
              "tipTitle": "Morning Activity Tip",
              "tipDescription": "Helpful tip for travelers"
            },
            // Afternoon activity (similar structure)
            // Evening activity (similar structure)
          ]
        },
        // Additional days follow the same structure
      ]
    }
    
    Original itinerary text:
    ${itineraryText}`;

    const structuredResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: structuringPrompt }],
      temperature: 0.2,
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const structuredItinerary = JSON.parse(structuredResponse.choices[0].message.content || "{}");
    console.log("Successfully generated structured itinerary");
    
    return structuredItinerary;
    
  } catch (error: any) {
    console.error("Error generating itinerary with OpenAI:", error);
    throw new Error(`Failed to generate itinerary: ${error.message || error}`);
  }
}

/**
 * Search for cities that match the search query
 * @param query The search query
 * @param cityList List of all cities
 * @returns Filtered list of cities that match the query
 */
export async function searchCities(query: string, cityList: any[]) {
  try {
    if (!query.trim()) {
      return cityList; // Return all cities if query is empty
    }
    
    const prompt = `You are a travel assistant helping to find Canadian cities that match a user's search query.
    
    The user is searching for: "${query}"
    
    Here is the list of available Canadian cities with their details:
    ${JSON.stringify(cityList, null, 2)}
    
    Return ONLY a JSON array containing the city slugs that best match the user's query. Consider city names, descriptions, and popular landmarks or features. Return only the slugs, nothing else.
    
    For example, if the result is Toronto and Vancouver, return: ["toronto", "vancouver"]`;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (Array.isArray(result.cities)) {
      // Filter the city list to include only the matched cities
      return cityList.filter(city => result.cities.includes(city.slug));
    } else {
      // Fallback to simple text matching if the model doesn't return the expected format
      return cityList.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) || 
        city.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  } catch (error: any) {
    console.error("Error searching cities with OpenAI:", error);
    // Fallback to simple search if API fails
    return cityList.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) || 
      city.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}