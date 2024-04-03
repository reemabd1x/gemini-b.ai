import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
// CREATE CLASS AND FUNCTION
const bot = new TelegramBot('6344810463:AAGzsHdJ6Rv6kk99wmcNk3PGLNd3ePwfXnI', { polling: true });
const genAI = new GoogleGenerativeAI('AIzaSyDpNB7IQ4qLwNU_-4g3ye8pSwHjzaKXloY');
const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.get('/', (req, res) => {
    res.json({ run: 'run bot5' })
}); app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })

// PING BOT ----
setInterval(async () => {
    const res = await fetch('https://gemini-b-ai.onrender.com/')
    const data1 = await res.json()
}, 100 * 1000)
console.log('bot is ready...')

async function runText(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };
        const chat = model.startChat({ generationConfig })
        const result = await chat.sendMessage(prompt)
        const response = await result.response.text()
        return response
    } catch (err) { return 'err' }
}
async function runImage(prompt, urlImage) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        // fetch node
        const headers = new Headers(); headers.append('Accept', 'image/jpeg');
        const res = await fetch(urlImage, { headers: headers })
        const data = await res.blob()
        const imagePars = { inlineData: { data: Buffer.from(await data.arrayBuffer()).toString('base64'), mimeType: "image/png", } };
        const result = await model.generateContent([prompt, imagePars]);
        const response = await result.response.text()
        return response
    } catch (err) { return 'err' }
}

async function chatMember(id) {
    const res = await bot.getChatMember('@bashar_prog', id)
    if (res.status != 'left' && res.status != 'kicked') {
        return 'ok'
    } else if (res.status == 'left') {
        bot.sendMessage(id, 'عذرا ! \n يجب عليك اولا الأشتراك بالقناة', {
            'reply_markup': {
                "inline_keyboard": [
                    [{ text: "اشترك من هنا", url: "https://t.me/bashar_prog" }],
                    [{ text: "تابعني على انستكرام", url: "https://instagram.com/bashar1_x" }]
                ]
            }
        })
        return 'none'
    } else if (res.status == 'kicked') {
        bot.sendMessage(id, `انت محضور من الأستخدام, راجع احد المشرفين لمساعدتك`, {
            'reply_markup': {
                "inline_keyboard": [
                    [
                        { text: "bashar", url: "https://t.me/bashar1_x" },
                        { text: "amjad", url: "https://t.me/amjad_kh1" },
                        { text: "hamam", url: "https://t.me/hmam1_x" }
                    ]
                ]
            }
        })
        return 'none'
    }
}
// console.log( await chatMember(5358365084))
const arr_what = ['من مطورك', 'من طورك', 'من صنعك', 'من برمجك', 'من اخترعك', 'منو سواك', 'منو اخترعك', 'منو صنعك', 'منو برمجك', 'منو طورك', 'من بشار']
const arr_dev = ['بشار مرشد الحيوي', 'قام بتطويري بشار حيوي', 'بشار مرشد الحيوي القاطن في الرقة مزرعة ربيعة', 'مطوري بشار مرشد الحيوي', 'قام بإنشائي بشار وبمساعدة من  امجد الخلف']
const arr_bad = ['مرحبا بك كيف حالك اليوم هل انت بحاجة الى مساعدة انا ذكاء اصطناعي قادر على مساعدتك', 'مرحبا انا نموذج ذكاء اصطناعي تم تطويري بواسطة بشار الحيوي', 'انا ذكاء اصطناعي تم تدريبي بواسطة بشار مرشد الحيوي']
const err_msg = ['من فضلك حاول صياغة سؤالك بطريقة اخرى', 'اعتذر اني لم افهم سؤالك جيدا', 'يبدو الأتصال ضعيف حاول مجددا']
const arr_command = ['/start', '/description', '/follow', '/admin']
bot.on('message', async (msg) => {
    if (!arr_command.includes(msg.text)) {
        if (msg.text) {
            if (!msg.reply_to_message) {
                if (await chatMember(msg.chat.id) == 'ok') {
                    const result = await runText(msg.text)
                    // console.log(result)
                    try {
                        if (!arr_what.includes(msg.text)) {
                            if (result == 'err') {
                                bot.sendMessage(msg.chat.id, err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1])
                            } else {
                                if (result.includes("نموذج") && result.includes("لغوي") && result.includes("جوجل")) {
                                    bot.sendMessage(msg.chat.id, arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1])
                                } else {
                                    bot.sendMessage(msg.chat.id, result, { parse_mode: 'Markdown' })
                                    .catch(() => {bot.sendMessage(msg.chat.id, result)})
                                }
                            }
                        } else {
                            bot.sendMessage(msg.chat.id, arr_dev[[Math.floor(Math.random() * arr_dev.length - 1) + 1]])
                        }
                    } catch (err) { console.log('err') }
                }
            } else if (msg.reply_to_message) {
                if (msg.reply_to_message.text) {
                    if (await chatMember(msg.chat.id) == 'ok') {
                        const result = await runText(msg.text)
                        // console.log(result)
                        try {
                            if (!arr_what.includes(msg.text)) {
                                if (result == 'err') {
                                    bot.sendMessage(msg.chat.id, err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1])
                                } else {
                                    if (result.includes("نموذج") && result.includes("لغوي") && result.includes("جوجل")) {
                                        bot.sendMessage(msg.chat.id, arr_bad[Math.floor(Math.random() * arr_bad.length - 1) + 1])
                                    } else {
                                        bot.sendMessage(msg.chat.id, result, { parse_mode: 'Markdown' })
                                        .catch(() => {bot.sendMessage(msg.chat.id, result)})
                                    }
                                }
                            } else {
                                bot.sendMessage(msg.chat.id, arr_dev[[Math.floor(Math.random() * arr_dev.length - 1) + 1]])
                            }

                        } catch (err) { console.log('err') }
                    }
                }
            }
        }
    }
})

bot.on('photo', async (ctx) => {
    if (ctx.caption) {
        if (await chatMember(ctx.chat.id) == 'ok') {
            const urlImage = await bot.getFileLink(ctx.photo[ctx.photo.length - 1].file_id)
            const result = await runImage(ctx.caption, urlImage)
            // console.log(result)
            try {
                if (result == 'err') {
                    bot.sendMessage(ctx.chat.id, err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1])
                } else {
                    bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' })
                    .catch(() => {bot.sendMessage(ctx.chat.id, result)})
                }
            } catch (err) { console.log('err') }
        }
    } else {
        const arr = [
            `عذرا ${ctx.chat.first_name} أسحب الصورة الى اليسار وأكتب تحتها ماذا تريد كي أجيبك`,
            `لا اعلم ماذا تريد بالضبط من الصورة, قم بكتابة ما تريد تحتها عن طريق سحبها الى اليسار`,
            `عفوا ${ctx.chat.first_name} يجب كتابة ما تريد تحت الصورة, أسحب الصورة الى اليسار`,
            `عزيزي ${ctx.chat.first_name} لكي استطيع مساعدتك يجب عليك توضيح ماذا تريد من الصورة, أسحب الصورة الى اليسار`
        ]
        bot.sendMessage(ctx.chat.id, arr[Math.floor(Math.random() * arr.length - 1) + 1])
    }
})
bot.on('message', async (ctx) => {
    runFollow()
    if (!arr_command.includes(ctx.text)) {
        if (ctx.text) {
            if (ctx.reply_to_message) {
                if (ctx.reply_to_message.photo) {
                    if (await chatMember(ctx.chat.id) == 'ok') {
                        const link = ctx.reply_to_message.photo
                        const urlImage = await bot.getFileLink(link[2].file_id)
                        const result = await runImage(ctx.text, urlImage)
                        // console.log(result)
                        try {
                            if (result == 'err') {
                                bot.sendMessage(ctx.chat.id, err_msg[Math.floor(Math.random() * err_msg.length - 1) + 1])
                            } else {
                                bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' })
                                .catch(() => {bot.sendMessage(ctx.chat.id, result)})
                            }
                        } catch (err) { console.log('err') }
                    }
                }
            }
        }
    }
})

bot.on('voice', (msg) => {
    const arr_audio = [ `انا لا استطيع سماع الرسائل الصوتية`, `عفوا لا يمكنني سماع الصوت لم اتدرب جيدا على هذا`, `أتمنى لو كان بامكاني سماع الصوت لاكن لم اتدرب بشكل كاف`]
    bot.sendMessage(msg.chat.id, arr_audio[Math.floor(Math.random() * arr_audio.length - 1) + 1])
})

const runFollow = async (id) => {
    const random = Math.floor(Math.random() * 25 - 1) + 1;
    if (random == 11) {
        bot.sendMessage(id, 'يجب عليك متابعة بشار ..', {
            'reply_markup': {
                "inline_keyboard": [[{ text: "أضغط للمتابعة", url: "https://instagram.com/bashar1_x" }]]
            }
        })
    }
}


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
    {
        command: "admin",
        description: "command admin",
        regexp: /\/admin/
    },
]

bot.onText(command[0].regexp, (msg) => {
    const text = `
أهلا بك يا ${msg.from.first_name} \n \n
حسناً هل أنت بحاجة إلى اي مساعدة او ينقصك بعض المعلومات، لا عليك أنا سوف أساعدك، اسالني وسوف أجيب؛ \n
أنا أملك موسوعة هائلة من المعلومات العامة وأملك المعرفة في أمور عديدة مثل الرياضيات، الطب، الدين، الطبخ، التحليل... وغيرها من الأمور العديدة \n \n
وأنا قادر على تحليل الصور، بإمكانك ارسال لي صورة مع تحديد ماذا تريد من الصورة بكتابة ماذا تريد تحتها.
`
    bot.sendMessage(msg.chat.id, text, {
        'reply_markup': {
            "inline_keyboard": [ [ { text: "شارك للأصدقاء", switch_inline_query: "هذا البوت سوف يساعدك كثيراً" } ] ]
        }
    })
})
bot.onText(command[1].regexp, (msg) => {
    bot.sendMessage(msg.chat.id, `
أنا ذكاء اصطناعي قادر على الإجابة عن كافة الأسئلة والمواضيع العامة، \n
وانا أملك قاعدة بيانات هائلة من جوجل وأملك سيرفر سريع وسلس بفضل مطوري @bashar1_x وكل هذا لكي أقدم افضل أداء وأدق المعلومات؛ \n \n
للمزيد من المعلومات حول هذا البوت، أو حدوث أخطأ أثناء الاستخدام يمكنك مراسلة الحسابات التالية.
    `, {
        'reply_markup': {
            "inline_keyboard": [
                [
                    { text: "Bashar", url: "https://t.me/bashar1_x" },
                    { text: "Amjad", url: "https://t.me/amjad_kh1" },
                    { text: "hamam", url: "https://t.me/hmam1_x" }
                ]
            ]
        }
    })
})
//FOLLOW ME ----------
bot.onText(command[2].regexp, (msg) => {
    bot.sendMessage(msg.chat.id, "تستطيع متابعة مطوري بشار مرشد على..", {
        'reply_markup': {
            "inline_keyboard": [
                [
                    { text: "telegram", url: "https://t.me/bashar1_x" },
                    { text: "instagram", url: "https://instagram.com/bashar1_x" },
                    { text: "facebook", url: "https://facebook.com/bashar1.x" },
                    { text: "whatsapp", url: "https://wa.me/0985780023" }
                ]
            ]
        }
    })
})
bot.onText(command[3].regexp, (msg) => {
    if (msg.chat.id == 5358365084 || msg.chat.id == 6203364714 || msg.chat.id == 5292258678) {
        bot.getChatMemberCount('@bashar_prog').then((res) => {
            // console.log(res)
            bot.sendMessage(msg.chat.id, `.المشتركين (${res})`)
        })
    } else { bot.sendMessage(msg.chat.id, `انت غير مسؤول, مسؤولوا البوت \n @bashar1_x  @amjad_kh1 @hmam1_x`) }
})
bot.setMyCommands(command)
bot.on('polling_error', console.log)
