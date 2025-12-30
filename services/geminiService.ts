import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Token, ChatMessage, Dish } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

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
                - Politely declining any requests to check the real-time status of a specific token.`,
            },
        });
    }
    return chat;
}

export const getAiAssistantResponse = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {

    if (!API_KEY) {
        return "API Key not configured. Please contact admin.";
    }

    try {
        const contents = [
            ...history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            })),
            {
                role: 'user' as const,
                parts: [{ text: newMessage }]
            }
        ];

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: `You are a friendly and helpful AI assistant for a canteen service named "CanteenQ".
                Your capabilities include:
                - Answering questions about a simple, assumed menu (e.g., sandwiches, pizza, salads, coffee).
                - Providing information about canteen operating hours (e.g., 9 AM to 5 PM).
                - Explaining how the virtual queue system works.
                - Politely declining any requests to check the real-time status of a specific token.`,
            }
        });

        return response.text;
    } catch (error) {
        console.error(error);
        return "AI service is temporarily unavailable.";
    }
};

export const generateNotificationMessage = async (
  token: Token,
  type: 'whatsapp' | 'call'
): Promise<string> => {

    if (!API_KEY) {
        return "API Key not configured.";
    }

    const { customerName, id } = token;

    const prompt =
      type === 'whatsapp'
        ? `Write a friendly WhatsApp message to ${customerName}. Token ${id} is ready.`
        : `Write a polite call script for ${customerName}. Token ${id} is ready.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error(error);
        return "Failed to generate notification.";
    }
};

export const generateDishOfTheDay = async (
  keywords: string
): Promise<Dish | null> => {

    if (!API_KEY) {
        return {
          name: "API Key Not Found",
          description: "Configure Gemini API key to enable this feature."
        };
    }

    const prompt = `Generate a creative dish name and description using: ${keywords}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ['name', 'description']
                }
            }
        });

        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error(error);
        return null;
    }
};