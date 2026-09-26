import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const apiKey = process.env.GEMINI_API_KEY;

async function listModelsVerbose() {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const res = await fetch(listUrl);
        const data = await res.json();
        console.log("--- FULL MODEL LIST (VERBOSE) ---");
        data.models?.forEach(m => {
            console.log(`Model: ${m.name}`);
            console.log(`   Methods: ${m.supportedGenerationMethods.join(", ")}`);
        });
        console.log("---------------------------------");
    } catch (e) {
        console.error("Error:", e.message);
    }
}

listModelsVerbose();
