import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables
// Use the project API key - this will be overwritten when the environment variable is set
const API_KEY = process.env.OPENAI_API_KEY || "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";
const openai = new OpenAI({ apiKey: API_KEY });
console.log("OpenAI client initialized with API key");

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
    
    // We're using a hardcoded API key if the environment variable isn't set, so we don't need to check
    
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

    try {
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

      try {
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
      } catch (structuringError: any) {
        console.error("Error during JSON structuring, trying to parse the original text:", structuringError);
        
        // If the structuring fails, create a simplified itinerary
        const simplifiedItinerary = {
          days: Array.from({ length: days }, (_, i) => ({
            dayNumber: i + 1,
            title: `Day ${i + 1} in ${cityName}`,
            activities: [
              {
                id: i * 3 + 1,
                startTime: "9:00 AM",
                endTime: "12:00 PM",
                duration: "3 hours",
                title: `Morning: Exploring ${cityName}`,
                description: "Explore the main attractions in the morning.",
                location: `${cityName} downtown area`,
                cost: "Varies",
                tipTitle: "Morning Tip",
                tipDescription: "Start early to avoid crowds."
              },
              {
                id: i * 3 + 2,
                startTime: "1:00 PM",
                endTime: "4:00 PM",
                duration: "3 hours",
                title: `Afternoon: ${cityName} Activities`,
                description: `Enjoy the afternoon in ${cityName}.`,
                location: `${cityName} central area`,
                cost: "Varies",
                tipTitle: "Afternoon Tip",
                tipDescription: "Check local restaurants for lunch specials."
              },
              {
                id: i * 3 + 3,
                startTime: "6:00 PM",
                endTime: "9:00 PM", 
                duration: "3 hours",
                title: `Evening: ${cityName} Nightlife`,
                description: `Experience the evening in ${cityName}.`,
                location: `${cityName} entertainment district`,
                cost: "Varies",
                tipTitle: "Evening Tip",
                tipDescription: "Book restaurants in advance for dinner."
              }
            ]
          }))
        };
        
        // Try to extract some content from the text to make it more specific to the city
        try {
          if (itineraryText.length > 100) {
            // Extract some key phrases
            const lines = itineraryText.split('\n');
            for (let i = 0; i < simplifiedItinerary.days.length; i++) {
              if (lines.length > i * 5) {
                const day = simplifiedItinerary.days[i];
                
                // Find line with a title for this day
                const titleLine = lines.find(line => 
                  line.toLowerCase().includes(`day ${i+1}`) && line.length < 100
                );
                if (titleLine) {
                  day.title = titleLine.trim();
                }
                
                // Add some actual description content
                if (lines.length > 10) {
                  const startIdx = Math.min(i * 10, lines.length - 10);
                  const cityInfo = lines.slice(startIdx, startIdx + 10)
                    .filter(line => line.trim().length > 10)
                    .join(' ');
                  
                  if (cityInfo.length > 30) {
                    day.activities[0].description = cityInfo.substring(0, 200);
                  }
                }
              }
            }
          }
        } catch (parsingError) {
          console.error("Error while trying to improve simple itinerary:", parsingError);
        }
        
        return simplifiedItinerary;
      }
    } catch (apiCallError: any) {
      console.error("Error in initial API call:", apiCallError);
      
      // Check for quota error
      if (apiCallError.message && (
        apiCallError.message.includes('quota') || 
        apiCallError.message.includes('rate limit') ||
        apiCallError.message.includes('429')
      )) {
        throw new Error(`OpenAI API quota exceeded: ${apiCallError.message}`);
      }
      
      // Generic fallback itinerary
      throw new Error(`Failed to generate itinerary: ${apiCallError.message}`);
    }
    
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
  // Basic search function using text matching as a fallback
  const basicSearch = () => {
    return cityList.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) || 
      city.description.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  try {
    if (!query.trim()) {
      return cityList; // Return all cities if query is empty
    }
    
    // We have a fallback API key so we don't need to check for it anymore
    
    const prompt = `You are a travel assistant helping to find Canadian cities that match a user's search query.
    
    The user is searching for: "${query}"
    
    Here is the list of available Canadian cities with their details:
    ${JSON.stringify(cityList, null, 2)}
    
    Return ONLY a JSON array containing the city slugs that best match the user's query. Consider city names, descriptions, and popular landmarks or features. Return only the slugs, nothing else.
    
    For example, if the result is Toronto and Vancouver, return: ["toronto", "vancouver"]`;

    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      if (Array.isArray(result.cities) && result.cities.length > 0) {
        // Filter the city list to include only the matched cities
        const matches = cityList.filter(city => result.cities.includes(city.slug));
        
        // If we found matches, return them
        if (matches.length > 0) {
          return matches;
        }
      }
      
      // If no matches found or invalid format, fall back to basic search
      return basicSearch();
      
    } catch (apiError: any) {
      console.error("Error calling OpenAI API for search:", apiError);
      
      // Log the specific error for quota issues
      if (apiError.message && (
        apiError.message.includes('quota') || 
        apiError.message.includes('rate limit') ||
        apiError.message.includes('429')
      )) {
        console.warn("OpenAI API quota exceeded for search, using basic search instead");
      }
      
      // Fallback to simple search if API fails
      return basicSearch();
    }
  } catch (error: any) {
    console.error("Error searching cities with OpenAI:", error);
    // Fallback to simple search if any other errors occur
    return basicSearch();
  }
}