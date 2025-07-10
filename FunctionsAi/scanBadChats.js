import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { safetySettings, generationConfig } from '../setting/exportSetting.js'
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.KEY_XAZTOM);
export const scanBadChats = async (text, file) => {
    console.log('run scan', text);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp", systemInstruction: directions, safetySettings })
    try {
        const chat = model.startChat({ generationConfig })
        const result = file ? await chat.sendMessage([file, text]) : await chat.sendMessage(text)
        const response = result.response.text()
        
        return response.trim()
    } catch (err) { console.log(err); return 'false' }
};
const directions = `You will act as an inspector for harmful or inappropriate messages, specifically focusing on sexually explicit or pornographic content. You will receive a text message, and there may be an image included. Review the content carefully; if there is sexually explicit or pornographic content, write "true", and if there is not, write "false".`;
//const directions = `You will act as an inspector for harmful messages, such as political topics, especially anything related to ISIS. You will receive a text message, and there may be an image included. Review the content; if there is something harmful, write "true" and if there is not, write "false".`
// const directions = `You will act as an inspector for harmful messages, such as insults, political topics, and especially ISIS-related content. A text message may be sent to you, possibly accompanied by an image. Review it to see if there is any harmful content. If there is, write "true"; if there isn't, write "false".`
// const directions = `You will act as an inspector for harmful messages such as insults, abuse, disrespect to others, mockery, incitement to hatred, and belittling others, Open topics related to politics or terrorism, such as ISIS. You will be sent a text message and possibly an image. Examine if there is anything harmful. If there is, write "true", otherwise write "false".`
