import fetch from "node-fetch"
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
const bot = new TelegramBot("6344810463:AAGzsHdJ6Rv6kk99wmcNk3PGLNd3ePwfXnI", { polling: true })
const genAI = new GoogleGenerativeAI("AIzaSyDpNB7IQ4qLwNU_-4g3ye8pSwHjzaKXloY");


const app = express();
app.get('/', (req, res) => {
    res.send('hi world')
}); app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })


// READE PHOTO FUNCTION ---
bot.on("photo", async (ctx) => {
    if (ctx.caption) {
        const remov = await bot.sendMessage(ctx.chat.id, '📁')
        const file_link = await bot.getFileLink(ctx.photo[ctx.photo.length - 1].file_id)
        console.log('fetch---')
        const headers = new Headers(); headers.append('Accept', 'image/jpeg');
        fetch(file_link, { headers: headers })
            .then(response => response.blob())
            .then(async (blob) => {
                const buff = Buffer.from(await blob.arrayBuffer()).toString('base64')
                const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                const prompt = ctx.caption;
                const image = { inlineData: { data: buff, mimeType: "image/png", } };
                const result = await model.generateContent([prompt, image]);
                bot.deleteMessage(ctx.chat.id, remov.message_id)
                console.log("_______rest______1_", result.response.text());
                bot.sendMessage(ctx.chat.id, result.response.text())
            })
            .catch(() => { bot.sendMessage(ctx.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })
    } else {
        const arr = [
            `عذرا ${ctx.chat.first_name} أسحب الصورة الى اليسار وأكتب تحتها ماذا تريد كي أجيبك`,
            `لا اعلم ماذا تريد بالضبط من الصورة, قم بكتابة ما تريد تحتها عن طريق سحبها الى اليسار`,
            `عفوا ${ctx.chat.first_name} يجب كتابة ما تريد تحت الصورة, أسحب الصورة الى اليسار`,
            `عزيزي ${ctx.chat.first_name} لكي استطيع مساعدتك يجب عليك توضيح ماذا تريد من الصورة, أسحب الصورة الى اليسار`
        ]
        const random = Math.floor(Math.random() * arr.length - 1) + 1;
        bot.sendMessage(ctx.chat.id, arr[random])
    }
})


bot.on('message', async (ctx) => {
    if (ctx.text) {
        if (ctx.reply_to_message) {
            if (ctx.reply_to_message.photo) {
                const remov = await bot.sendMessage(ctx.chat.id, '📁')
                const link = ctx.reply_to_message.photo
                const file_link = await bot.getFileLink(link[0].file_id)
                console.log('fetch---')
                const headers = new Headers(); headers.append('Accept', 'image/jpeg');
                fetch(file_link, { headers: headers })
                    .then(response => response.blob())
                    .then(async (blob) => {
                        const buff = Buffer.from(await blob.arrayBuffer()).toString('base64')
                        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
                        const prompt = ctx.text;
                        const image = { inlineData: { data: buff, mimeType: "image/png", } };
                        const result = await model.generateContent([prompt, image]);
                        bot.deleteMessage(ctx.chat.id, remov.message_id)
                        console.log("_______rest______2_", result.response.text());
                        bot.sendMessage(ctx.chat.id, result.response.text())
                    })
                    .catch(() => { bot.sendMessage(ctx.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })
            }
        }
    }
})



// SEND MSG IN USER ------
bot.on("message", async (msg) => {
    if (msg.text && msg.text != '/start' && msg.text != '/description' && msg.text != '/follow') {
        if (!msg.reply_to_message) {
            console.log('msg ----1')
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
            const chat = model.startChat({ generationConfig });
            const result = await chat.sendMessage(msg.text);
            console.log("_______rest______3_", result.response.text())
            bot.sendMessage(msg.chat.id, result.response.text())
                .catch(() => { bot.sendMessage(ctx.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })
        }
    }
})



bot.on('message', async (msg) => {
    if (msg.text && msg.text != '/start' && msg.text != '/description' && msg.text != '/follow') {
        if (msg.reply_to_message) {
            if (msg.reply_to_message.text) {
                const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
                const chat = model.startChat({ generationConfig });
                const result = await chat.sendMessage(msg.text);
                console.log("_______rest______4_", result.response.text())
                bot.sendMessage(msg.chat.id, result.response.text())
                    .catch(() => { bot.sendMessage(ctx.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })
            }
        }
    }
})



bot.on('message', (msg) => {
    console.log('ok')
    const use = `
هناك شخص يستخدم البوت:
name: ${msg.from.first_name + " " + msg.from.last_name || "لا يوجد"}
id: ${msg.from.id || "لا يوجد"}
user: ${msg.from.username}
  `
    if (msg.chat.id != 6203364714 && msg.chat.id != 5358365084) {
        bot.sendMessage(5358365084, use)
        bot.sendMessage(6203364714, use)
    }

})


// COMMANDS ----
const command = [
    {
        command: "start",
        description: "Start now",
        regexp: /\/start/
    },
    {
        command: "description",
        description: "Description this bot",
        regexp: /\/description/
    },
    {
        command: "follow",
        description: "Follw Developer",
        regexp: /\/follow/
    },
]

bot.onText(command[0].regexp, (msg) => {
    const text = `
مرحباً ${msg.chat.first_name}


كيف بأمكاني مساعدتك اليوم, أنا قادر على مساعدتك بأي شيء تحتاجه في حياتك 
وبأمكاني الأجابة عن كافة الأسئلة
مثل :الرياضة, الطبخ, المعادلات االحسابية, حل الاسئلة الأمتحانية, مجال البرمجيات, الطب, الحياة اليومية, وغيرها من الأمور.

وأنا قادر على تحليل الصور
بأمكانك أرسال لي صور معا تحديد ماذا تريد من الصورة, وسأقوم بأجابتك
`
    bot.sendMessage(msg.chat.id, text, {
        'reply_markup': {
            "inline_keyboard": [
                [
                    { text: "شارك للأصدقاء", switch_inline_query: "هذا البوت سوف يساعدك كثيراً" }
                ]
            ]
        }
    })
})


bot.onText(command[1].regexp, (msg) => {
    bot.sendMessage(msg.chat.id, `
لقم تم تطويري لكي أساعدك وأسهل عليك حياتك اليومية سوف تجدني فل كل حين,
قد قام تطويري بشار الحيوي وبمساعدة من كوكل لكي اكون قادر علي خدمتك متا ما أردت;


تستطيع مراسله الحسابات في الأسفل, للأستفسار عن طريقة عمل البوت بشكل أوضح أو حدوث اي خطأ يواجهك 

    `, {
        'reply_markup': {
            "inline_keyboard": [
                [
                    { text: "Bashar", url: "https://t.me/bashar1_x" },
                    { text: "Amjad", url: "https://t.me/amjad1_x" }
                ]
            ]
        }
    })
})

//FOLLOW ME ----------
bot.onText(command[2].regexp, (msg) => {
    bot.sendMessage(msg.chat.id, "تستطيع متابعة المطور على..", {
        'reply_markup': {
            "inline_keyboard": [
                [
                    { text: "telegram", url: "https://t.me/bashar1_x" },
                    { text: "instagram", url: "https://instagram.com/bashar1_x" },
                    { text: "facebook", url: "https://facebook.com/bashar1.x" },
                    { text: "whatsapp", url: "https://wa.me/0938768556" }
                ]
            ]
        }
    })
})

bot.on('voice', (msg) => {
    console.log("audio")
    const arr = [
        `انا لا استطيع سماع الرسأل الصوتية`,
        `عفون لا يمكنني سماع الصوت لم اتدرب جيدا على هذا`,
        `أتمنا لو كان بأمكاني سماع الصوت لاكن لم اتدرب بشكل كافي`
    ]
    const random = Math.floor(Math.random() * arr.length - 1) + 1;
    bot.sendMessage(msg.chat.id, arr[random])
})

bot.setMyCommands(command)
bot.on("polling_error", console.log)
