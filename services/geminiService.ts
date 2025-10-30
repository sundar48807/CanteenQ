import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Token, ChatMessage, Dish } from '../types';

// ===================================================================================
// IMPORTANT: PASTE YOUR GOOGLE GEMINI API KEY HERE
//
// To make this application work, you must replace "YOUR_API_KEY_HERE"
// with your actual Google Gemini API key.
//
// WARNING: Do NOT share this file publicly with your API key in it.
// ===================================================================================
const API_KEY = "YOUR_API_KEY_HERE";

const ai = new GoogleGenAI({ apiKey: API_KEY });
let chat: Chat | null = null;

function initializeChat(): Chat {
    if (!chat) {
        chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are a friendly and helpful AI assistant for a canteen service named "CanteenQ". 
                Your capabilities include:
                - Answering questions about a simple, assumed menu (e.g., sandwiches, pizza, salads, coffee).
                - Providing information about canteen operating hours (e.g., 9 AM to 5 PM).
                - Explaining how the virtual queue system works.
                - Politely declining any requests to check the real-time status of a specific token, as you do not have access to that live data. Direct them to use the main app interface for live status.
                Keep your answers concise and friendly.`,
            },
        });
    }
    return chat;
}


export const getAiAssistantResponse = async (history: ChatMessage[], newMessage: string): Promise<string> => {
    if (API_KEY === "YOUR_API_KEY_HERE") {
        return "Please add your API Key in the `services/geminiService.ts` file to use the AI Assistant.";
    }
    try {
        const chatSession = initializeChat();
        const geminiHistory = history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        chatSession.history = geminiHistory;

        const response: GenerateContentResponse = await chatSession.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error getting AI assistant response:", error);
        return "Sorry, I'm having a little trouble thinking right now. Please try again in a moment.";
    }
};


export const generateNotificationMessage = async (
  token: Token,
  type: 'whatsapp' | 'call'
): Promise<string> => {
    if (API_KEY === "YOUR_API_KEY_HERE") {
        return "API Key not configured. Please add it to generate messages.";
    }
  const { customerName, id } = token;

  const prompt =
    type === 'whatsapp'
      ? `You are a friendly canteen assistant for "CanteenQ". Write a short, professional, and friendly WhatsApp message to inform a customer named ${customerName} that their food order with token number ${id} is ready for pickup. Include a pleasant closing.`
      : `You are a friendly canteen assistant for "CanteenQ". Write a short, clear, and polite script for a phone call to inform a customer named ${customerName} that their food order with token number ${id} is ready for pickup. The script should be concise and start by greeting the customer.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error generating notification message:', error);
    return 'We tried to generate a message, but something went wrong. Please notify the customer manually.';
  }
};


export const generateDishOfTheDay = async (keywords: string): Promise<Dish | null> => {
    if (API_KEY === "YOUR_API_KEY_HERE") {
        return { name: "API Key Not Found", description: "Please configure your API key in the code to use the AI generator." };
    }
    const prompt = `You are a creative chef. Based on these keywords: "${keywords}", generate a creative dish name and a short, mouth-watering description (around 15-20 words).`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: {
                            type: Type.STRING,
                            description: 'A creative and catchy name for the dish.'
                        },
                        description: {
                            type: Type.STRING,
                            description: 'A short, enticing description of the dish.'
                        }
                    },
                    required: ['name', 'description']
                }
            }
        });

        const jsonText = response.text.trim();
        const dish: Dish = JSON.parse(jsonText);
        return dish;
    } catch (error) {
        console.error('Error generating Dish of the Day:', error);
        return null;
    }
};