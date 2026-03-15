const fetch = require('node-fetch');

const VITE_OLLAMA_API_KEY = "b09e386e027e4105b5e6bdc30a8739fb.TSavfw07XVF0UujAJfXnA8so";
const VITE_OLLAMA_API_URL = "http://localhost:11434";
const VITE_MODEL_ID = "stable-beluga:latest";

async function testOllama() {
  console.log("Testing Ollama API connection...");
  console.log("URL:", `${VITE_OLLAMA_API_URL}/api/chat`);
  console.log("Model:", VITE_MODEL_ID);
  
  try {
    const response = await fetch(`${VITE_OLLAMA_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VITE_OLLAMA_API_KEY}`
      },
      body: JSON.stringify({
        model: VITE_MODEL_ID,
        messages: [{ role: 'user', content: 'Hello' }],
        stream: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("API Connection Successful!");
      console.log("Response:", data.message?.content || JSON.stringify(data));
    } else {
      console.error("API Connection Failed with status:", response.status);
      const errorText = await response.text();
      console.error("Error details:", errorText);
    }
  } catch (error) {
    console.error("Connectivity Error:", error.message);
    console.log("\nPossible solutions:");
    console.log("1. Make sure Ollama is running (check your taskbar or run 'ollama serve')");
    console.log("2. Make sure the model '" + VITE_MODEL_ID + "' is downloaded (run 'ollama pull " + VITE_MODEL_ID + "')");
    console.log("3. Check if the port 11434 is correct.");
  }
}

testOllama();
