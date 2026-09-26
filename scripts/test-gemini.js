const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There isn't a direct listModels in the client SDK like this usually, 
        // but we can try to hit a simple generateContent call to see the error.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("Success:", result.response.text());
    } catch (error) {
        console.error("Error details:", error);
        if (error.status) console.log("Status:", error.status);
        if (error.statusText) console.log("StatusText:", error.statusText);
    }
}

listModels();
