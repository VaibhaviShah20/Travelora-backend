// // Note the different package name here!
// import { GoogleGenAI } from '@google/genai';

// const ai = new GoogleGenAI({ apiKey: "AIzaSyBLe35Vy_1QHV1W5MkA_DtkIdb-vxtaigI" });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash', // Corrected model name
//     contents: 'Why is the sky blue?',
//   });
//   console.log(response.text);
// }

// main();

import { GoogleGenAI } from '@google/genai';
// import dotenv from 'dotenv';

// dotenv.config({ path: '.env.local' });

const GEMINI_API_KEY = 'AIzaSyAgUhFBehVuTQw5EyEAYhXSXXKjlDmoG-4';
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main() {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Why is the sky blue?',
    });
    console.log(response.text);
}

main();