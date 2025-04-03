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
    Create a detailed ${days}-day itinerary for ${cityName}, focusing exclusively on authentic Canadian experiences with HIGHLY SPECIFIC details. The itinerary should include:
    
    For each day:
    1. A catchy title for the day's theme that captures the essence of Canadian culture or local highlights
    2. Exactly three activities divided into morning, afternoon, and evening
    3. For each activity provide:
       - A title prefixed with "Morning:", "Afternoon:", or "Evening:" that's specific and descriptive
       - Realistic start and end times considering Canadian business hours
       - Duration that makes sense for the activity
       - HIGHLY DETAILED description (at least 60 words) of the activity highlighting Canadian significance
       - SPECIFIC location with ACTUAL street addresses, building names, and neighborhoods in ${cityName}
       - PRECISE cost in CAD with realistic price ranges (e.g., "$25-30 CAD per person" not just "Varies")
       - A detailed and helpful traveler tip related to that specific activity, location, or Canadian cultural norms
    
    Use this city description for context: ${cityDescription}
    
    Important guidelines:
    - Make ALL recommendations realistic, specific to ${cityName}, and focus on Canadian culture, nature, and local highlights
    - Include a mix of popular attractions and hidden gems only locals would know
    - Recommend authentic Canadian cuisine and local dining experiences with SPECIFIC restaurant names and dishes
    - Include seasonal activities appropriate for the time of year
    - Ensure activities logically flow and consider travel time between locations using local transit options
    - Highlight Canadian cultural nuances, etiquette, and local customs where relevant
    - For multi-day itineraries, ensure each day has a distinct theme or focus area within ${cityName}
    - NEVER use generic descriptions like "downtown area" or "central district" - always provide specific street names, intersections, or landmarks
    - NEVER use generic costs like "Free" or "Varies" without explanation - always provide specific price ranges or explain what affects the cost
    
    Your itinerary should feel like it was created by a local Canadian who deeply understands the culture and attractions of ${cityName}, with insider knowledge that tourists wouldn't typically have.`;

    const userPrompt = `Please create a highly detailed ${days}-day travel itinerary for ${cityName}, Canada, focusing on authentic Canadian experiences with SPECIFIC details for all activities. 
    
    I need a comprehensive day-by-day plan that includes:
    - Morning activities starting around 8-9am with EXACT addresses and locations
    - Afternoon activities that showcase the best of ${cityName} with SPECIFIC venue names
    - Evening activities including dining at LOCAL Canadian restaurants with ACTUAL restaurant names
    - PRECISE street addresses and locations for every attraction and activity
    - DETAILED cost estimates in Canadian dollars with specific price ranges
    - Local transportation options between activities with route numbers and stop names
    - SPECIFIC and insightful insider tips that only locals would know
    
    Please make this itinerary EXTREMELY detailed and specific to ${cityName}. I need activities that are uniquely Canadian and highlight the city's cultural and natural attractions. Include both popular tourist destinations and authentic hidden gems that locals frequent.
    
    Remember to provide EXACT:
    - Street addresses
    - Attraction and restaurant names
    - Opening hours
    - Cost details
    - Neighborhood names
    - Travel instructions between locations
    
    I want this itinerary to feel like it was created by a local Canadian expert with deep knowledge of ${cityName}.`;

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
      2. Keep all costs in CAD (Canadian dollars) format with SPECIFIC price ranges (e.g., "$25-30 CAD" or "$15 CAD per person")
      3. Make sure every "title" field for activities begins with either "Morning:", "Afternoon:", or "Evening:" followed by specific activity name
      4. Extract EXACT addresses, neighborhoods, or specific locations from the text - never use generic terms like "downtown" without specific street names
      5. Each day must have exactly 3 activities (morning, afternoon, evening)
      6. Day titles should be descriptive and reflect the theme of activities for that day
      7. Make sure all tipTitle and tipDescription fields contain helpful, practical traveler advice that provides insider knowledge
      8. Each day's activities should have sequential IDs starting from (dayNumber-1)*3+1
      9. Description fields should be HIGHLY DETAILED (at least 60 words) with specific Canadian cultural significance
      10. If the exact information isn't available, use reasonable inferences based on the content but always maintain SPECIFICITY with exact locations and prices
      11. NEVER use generic costs like "Free" or "Varies" without explanation - always provide specific price ranges or explain what affects the cost
      
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
        
        // Make sure we return exactly the number of days requested
        if (structuredItinerary.days && structuredItinerary.days.length > days) {
          // Trim excess days if we get more than requested
          structuredItinerary.days = structuredItinerary.days.slice(0, days);
        } else if (structuredItinerary.days && structuredItinerary.days.length < days) {
          // If we get fewer days than requested, add placeholder days to match
          const existingDays = structuredItinerary.days.length;
          for (let i = existingDays; i < days; i++) {
            structuredItinerary.days.push({
              dayNumber: i + 1,
              title: `Day ${i + 1} in ${cityName}`,
              activities: [
                {
                  id: i * 3 + 1,
                  startTime: "9:00 AM",
                  endTime: "12:00 PM",
                  duration: "3 hours",
                  title: `Morning: Exploring ${cityName}'s Main Attractions`,
                  description: `Begin your morning with a visit to the iconic landmarks of ${cityName}. Take your time to explore the architecture, cultural significance, and historical importance of these notable sites. Many visitors find the morning hours ideal for photography and enjoying the attractions before the midday crowds arrive. The experience offers a perfect introduction to the city's character and layout.`,
                  location: `${cityName} City Centre, Main Tourist District`,
                  cost: "$10-25 CAD per person for attraction entry fees",
                  tipTitle: "Morning Visitor Advantage",
                  tipDescription: "Start early around 9 AM to beat the crowds and enjoy shorter lines. Most attractions open at 9 AM, and early morning offers the best lighting for photography."
                },
                {
                  id: i * 3 + 2,
                  startTime: "1:00 PM",
                  endTime: "4:00 PM",
                  duration: "3 hours",
                  title: `Afternoon: Cultural Experience in ${cityName}`,
                  description: `Spend your afternoon immersing yourself in the cultural offerings of ${cityName}. Whether it's visiting museums, cultural centers, or local markets, this is your chance to connect with the authentic side of the city. The afternoon provides ample time to explore indoor venues and engage with local artisans and performers showcasing Canadian heritage.`,
                  location: `Cultural District, Arts Centre Area`,
                  cost: "$15-30 CAD for museum entry and local experiences",
                  tipTitle: "Local Transportation Insight",
                  tipDescription: "Use public transportation to navigate between attractions. Purchase a day pass for approximately $10 CAD which provides unlimited travel and is more economical than individual tickets."
                },
                {
                  id: i * 3 + 3,
                  startTime: "6:00 PM",
                  endTime: "9:00 PM", 
                  duration: "3 hours",
                  title: `Evening: Dining and Entertainment in ${cityName}`,
                  description: `Conclude your day with a delightful culinary experience at one of ${cityName}'s renowned restaurants. The evening atmosphere comes alive with locals and visitors enjoying the city's nightlife. Canadian cuisine offers a diverse range of options from seafood to multicultural influences, reflecting the country's rich heritage and innovation in gastronomy.`,
                  location: `Entertainment District, Restaurant Row`,
                  cost: "$25-50 CAD per person for dinner, excluding drinks",
                  tipTitle: "Dining Reservation Strategy",
                  tipDescription: "Make reservations at popular restaurants at least 1-2 days in advance, especially for weekend dining. Request a table by the window for scenic views if available."
                }
              ]
            });
          }
        }
        
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
                title: `Morning: Exploring ${cityName}'s Main Attractions`,
                description: `Begin your morning with a visit to the iconic landmarks of ${cityName}. Take your time to explore the architecture, cultural significance, and historical importance of these notable sites. Many visitors find the morning hours ideal for photography and enjoying the attractions before the midday crowds arrive. The experience offers a perfect introduction to the city's character and layout.`,
                location: `${cityName} City Centre, Main Tourist District`,
                cost: "$10-25 CAD per person for attraction entry fees",
                tipTitle: "Morning Visitor Advantage",
                tipDescription: "Start early around 9 AM to beat the crowds and enjoy shorter lines. Most attractions open at 9 AM, and early morning offers the best lighting for photography."
              },
              {
                id: i * 3 + 2,
                startTime: "1:00 PM",
                endTime: "4:00 PM",
                duration: "3 hours",
                title: `Afternoon: Cultural Experience in ${cityName}`,
                description: `Spend your afternoon immersing yourself in the cultural offerings of ${cityName}. Whether it's visiting museums, cultural centers, or local markets, this is your chance to connect with the authentic side of the city. The afternoon provides ample time to explore indoor venues and engage with local artisans and performers showcasing Canadian heritage.`,
                location: `Cultural District, Arts Centre Area`,
                cost: "$15-30 CAD for museum entry and local experiences",
                tipTitle: "Local Transportation Insight",
                tipDescription: "Use public transportation to navigate between attractions. Purchase a day pass for approximately $10 CAD which provides unlimited travel and is more economical than individual tickets."
              },
              {
                id: i * 3 + 3,
                startTime: "6:00 PM",
                endTime: "9:00 PM", 
                duration: "3 hours",
                title: `Evening: Dining and Entertainment in ${cityName}`,
                description: `Conclude your day with a delightful culinary experience at one of ${cityName}'s renowned restaurants. The evening atmosphere comes alive with locals and visitors enjoying the city's nightlife. Canadian cuisine offers a diverse range of options from seafood to multicultural influences, reflecting the country's rich heritage and innovation in gastronomy.`,
                location: `Entertainment District, Restaurant Row`,
                cost: "$25-50 CAD per person for dinner, excluding drinks",
                tipTitle: "Dining Reservation Strategy",
                tipDescription: "Make reservations at popular restaurants at least 1-2 days in advance, especially for weekend dining. Request a table by the window for scenic views if available."
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