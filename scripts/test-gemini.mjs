import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log("Testing with API Key:", apiKey ? apiKey.slice(0, 10) + "..." : "MISSING");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Explain insurance in one sentence.");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("Caught Error:");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("StatusText:", error.statusText);
        console.error("Details:", JSON.stringify(error.errorDetails, null, 2));
    }
}

test();
