import OpenAI from "openai";

// Simple test file as requested by the user to verify the OpenAI integration
async function testOpenAI() {
  console.log("Testing OpenAI connection with the environment API key...");
  
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Creating a sample haiku about AI...");
    
    // Try with a simpler, more basic model to avoid quota issues
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      store: true,
      messages: [
        {"role": "user", "content": "write a very short haiku about ai"},
      ],
      max_tokens: 30
    });

    console.log("Result from OpenAI:");
    console.log(completion.choices[0].message);
    
    return completion.choices[0].message;
  } catch (error) {
    console.error("Error testing OpenAI:", error);
    throw error;
  }
}

// For direct testing via command line: 
// npx tsx server/openai-test.ts
// Execute the test immediately for ES modules
testOpenAI()
  .then(() => console.log("Test completed successfully"))
  .catch(err => console.error("Test failed:", err));

export { testOpenAI };