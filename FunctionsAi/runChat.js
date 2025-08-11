import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { safetySettings, generationConfig } from '../setting/exportSetting.js'
import { systemInstruction } from "../controllers/systemInstruction.js";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.KEY_XAZTOM);
export const runChat = async (text, nameUser, file) => {
    console.log('run', text);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings, systemInstruction: systemInstruction(nameUser) })
    try {
        const chat = model.startChat({ generationConfig, })
        const result = file ? await chat.sendMessage([file, text]) : await chat.sendMessage(text)
        const response = result.response.text()
        return response
    } catch (err) {
        console.log(err)
        return err }
}

const errorMessages = [
    "Error: Please try again.",
    "Something went wrong. Please try again.",
    "An error occurred.  Try again later.",
    "Failed to process request. Please try again."
];



