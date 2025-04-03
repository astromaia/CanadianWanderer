import OpenAI from "openai";

/**
 * Create an OpenAI client using the environment variable
 * This approach ensures we use the latest valid API key
 */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("OpenAI client initialized with environment API key");

// Using a more basic model to avoid quota issues
// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
// Using gpt-3.5-turbo for better reliability and to manage API usage quotas
const MODEL = "gpt-3.5-turbo";

/**
 * Generate a travel itinerary using OpenAI GPT-3.5-turbo
 * @param cityName The name of the city
 * @param cityDescription The description of the city
 * @param days Number of days for the itinerary
 * @returns Generated itinerary data
 */
export async function generateItinerary(cityName: string, cityDescription: string, days: number) {
  try {
    console.log(`Generating itinerary for ${cityName} for ${days} days using ${MODEL}`);
    
    // Environment API key is being used from process.env.OPENAI_API_KEY
    
    const systemPrompt = `You are an expert Canadian travel guide with detailed knowledge of ${cityName}, Canada. 
    Create a detailed ${days}-day itinerary for ${cityName}, focusing exclusively on authentic Canadian experiences. The itinerary should include:
    
    For each day:
    1. A catchy title for the day's theme that captures the essence of Canadian culture or local highlights
    2. Three activities divided into morning, afternoon, and evening
    3. For each activity provide:
       - A title prefixed with "Morning:", "Afternoon:", or "Evening:" that's specific and descriptive
       - Realistic start and end times considering Canadian business hours
       - Duration that makes sense for the activity
       - Detailed description of the activity highlighting Canadian significance
       - Specific location with actual street names or neighborhoods in ${cityName}
       - Approximate cost in CAD with realistic price ranges
       - A helpful traveler tip related to that specific activity, location, or Canadian cultural norms
    
    Use this city description for context: ${cityDescription}
    
    Important guidelines:
    - Make all recommendations realistic, specific to ${cityName}, and focus on Canadian culture, nature, and local highlights
    - Include a mix of popular attractions and hidden gems only locals would know
    - Recommend authentic Canadian cuisine and local dining experiences
    - Include seasonal activities appropriate for the time of year
    - Ensure activities logically flow and consider travel time between locations using local transit options
    - Highlight Canadian cultural nuances, etiquette, and local customs where relevant
    - For multi-day itineraries, ensure each day has a distinct theme or focus area within ${cityName}
    
    Your itinerary should feel like it was created by a local Canadian who deeply understands the culture and attractions of ${cityName}.`;

    const userPrompt = `Please create a detailed ${days}-day travel itinerary for ${cityName}, Canada, focusing on authentic Canadian experiences. 
    
    I'd like a comprehensive day-by-day plan that includes:
    - Morning activities starting around 8-9am
    - Afternoon activities that showcase the best of ${cityName}
    - Evening activities including dining at local Canadian restaurants
    - Specific locations with addresses or neighborhoods
    - Realistic cost estimates in Canadian dollars
    - Local transportation options between activities
    - Insider tips that only locals would know
    
    Please make this itinerary specific to ${cityName} with activities that are uniquely Canadian and highlight the city's cultural and natural attractions. Include both popular must-see destinations and hidden gems.`;

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
      const structuringPrompt = `Convert the following travel itinerary for ${cityName}, Canada into a structured JSON format that follows exactly this structure:
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
                "description": "Detailed description with rich information about the activity",
                "location": "Specific address/location in ${cityName}",
                "cost": "Cost in CAD with actual figures",
                "tipTitle": "Brief title for the traveler tip",
                "tipDescription": "Detailed helpful tip for travelers about this specific activity"
              },
              {
                "id": 2,
                "startTime": "12:30 PM",
                "endTime": "4:00 PM",
                "duration": "3.5 hours",
                "title": "Afternoon: Activity name",
                "description": "Detailed description",
                "location": "Specific address/location",
                "cost": "Cost in CAD",
                "tipTitle": "Afternoon Activity Tip",
                "tipDescription": "Helpful tip for travelers"
              },
              {
                "id": 3,
                "startTime": "6:00 PM",
                "endTime": "9:00 PM",
                "duration": "3 hours",
                "title": "Evening: Activity name",
                "description": "Detailed description",
                "location": "Specific address/location",
                "cost": "Cost in CAD",
                "tipTitle": "Evening Activity Tip",
                "tipDescription": "Helpful tip for travelers"
              }
            ]
          }
        ]
      }
      
      Important conversion rules:
      1. Extract information from the original text to populate each field accurately
      2. Keep all costs in CAD (Canadian dollars) format
      3. Make sure every "title" field for activities begins with either "Morning:", "Afternoon:", or "Evening:"
      4. Extract actual addresses, neighborhoods, or specific locations from the text
      5. Each day must have exactly 3 activities (morning, afternoon, evening)
      6. Day titles should be descriptive and reflect the theme of activities for that day
      7. Make sure all tipTitle and tipDescription fields contain helpful, practical traveler advice
      8. Each day's activities should have sequential IDs starting from (dayNumber-1)*3+1
      9. If the exact information isn't available in the text, use the most reasonable inference based on the content
      
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
    
    // Environment API key is being used from process.env.OPENAI_API_KEY
    
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