import fetch from "node-fetch"

import TelegramBot from "node-telegram-bot-api";

import express from "express";

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

const bot = new TelegramBot("6344810463:AAGzsHdJ6Rv6kk99wmcNk3PGLNd3ePwfXnI", { polling: true })

const genAI = new GoogleGenerativeAI("AIzaSyDpNB7IQ4qLwNU_-4g3ye8pSwHjzaKXloY");





const app = express();

app.use(express.json())

app.use(express.urlencoded())

app.get('/', (req, res) => {

    res.json({run: 'run bot'})

}); app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })



// PING BOT ----

setInterval( async () => {

const res = await fetch('https://gemini-b-ai.onrender.com/')
const data1 = await res.json()
},100 *1000)



// READE PHOTO FUNCTION ---

bot.on("photo", async (ctx) => {

    if (ctx.caption) {

        bot.getChatMember('@bashar_prog', ctx.chat.id).then(async (member) => {

            if (member.status != 'left' && member.status != 'kicked') {

                const remov = await bot.sendMessage(ctx.chat.id, '📁')

                const file_link = await bot.getFileLink(ctx.photo[ctx.photo.length - 1].file_id)

                // console.log('fetch---')

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

                        // console.log("_______rest______1_", result.response.text());

                        bot.sendMessage(ctx.chat.id, result.response.text(), {

                            parse_mode: 'Markdown'

                        })

                    })

                    .catch(() => { bot.sendMessage(ctx.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })

            } else if (member.status == 'kicked') {

                bot.sendMessage(ctx.chat.id, `انت محضور من الأستخدام, راجع احد المشرفين لمساعدتك`, {

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

            } else if (member.status == 'left') {

                bot.sendMessage(ctx.chat.id, 'عذرا ! \n يجب عليك اولا الأشتراك بالقناة', {

                    'reply_markup': {

                        "inline_keyboard": [

                            [{ text: "اشترك من هنا", url: "https://t.me/bashar_prog" }],

                            [{ text: "تابعني على انستكرام", url: "https://instagram.com/bashar1_x" }]

                        ]

                    }

                })

            }

        })

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

                bot.getChatMember('@bashar_prog', ctx.chat.id).then(async (member) => {

                    if (member.status != 'left' && member.status != 'kicked') {

                        const remov = await bot.sendMessage(ctx.chat.id, '📁')

                        const link = ctx.reply_to_message.photo

                        const file_link = await bot.getFileLink(link[0].file_id)

                        // console.log('fetch---')

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

                                // console.log("_______rest______2_", result.response.text());

                                bot.sendMessage(ctx.chat.id, result.response.text(), {

                                    parse_mode: 'Markdown'

                                })

                            })

                            .catch(() => { bot.sendMessage(ctx.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })

                    } else if (member.status == 'kicked') {

                        bot.sendMessage(ctx.chat.id, `انت محضور من الأستخدام, راجع احد المشرفين لمساعدتك`, {

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

                    } else if (member.status == 'left') {

                        bot.sendMessage(ctx.chat.id, 'عذرا ! \n يجب عليك اولا الأشتراك بالقناة', {

                            'reply_markup': {

                                "inline_keyboard": [

                                    [{ text: "اشترك من هنا", url: "https://t.me/bashar_prog" }],

                                    [{ text: "تابعني على انستكرام", url: "https://instagram.com/bashar1_x" }]

                                ]

                            }

                        })

                    }

                })

            }

        }

    }

})







// SEND MSG IN USER ------

bot.on("message", async (msg) => {

    if (msg.text && msg.text != '/start' && msg.text != '/description' && msg.text != '/follow' && msg.text != '/admin') {

        if (!msg.reply_to_message) {

            bot.getChatMember('@bashar_prog', msg.chat.id).then(async (member) => {

                if (member.status != 'left' && member.status != 'kicked') {

                    // console.log('msg ----1')

                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                    const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };

                    const chat = model.startChat({ generationConfig })

                    const result = await chat.sendMessage(msg.text)

                        .catch(() => { bot.sendMessage(msg.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })

                    // console.log("_______rest______3_", result.response.text())

                    bot.sendMessage(msg.chat.id, result.response.text(), {

                        parse_mode: 'Markdown'

                    })

                } else if (member.status == 'kicked') {

                    bot.sendMessage(msg.chat.id, `انت محضور من الأستخدام, راجع احد المشرفين لمساعدتك`, {

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

                } else if (member.status == 'left') {

                    bot.sendMessage(msg.chat.id, 'عذرا ! \n يجب عليك اولا الأشتراك بالقناة', {

                        'reply_markup': {

                            "inline_keyboard": [

                                [{ text: "اشترك من هنا", url: "https://t.me/bashar_prog" }],

                                [{ text: "تابعني على انستكرام", url: "https://instagram.com/bashar1_x" }]

                            ]

                        }

                    })

                }

            })



        }

    }

})







bot.on('message', async (msg) => {

    if (msg.text && msg.text != '/start' && msg.text != '/description' && msg.text != '/follow' && msg.text != '/admin') {

        if (msg.reply_to_message) {

            if (msg.reply_to_message.text) {

                bot.getChatMember('@bashar_prog', msg.chat.id).then(async (member) => {

                    if (member.status != 'left' && member.status != 'kicked') {

                        // bot.sendMessage(msg.chat.id, 'yas');

                        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

                        const generationConfig = { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 1000, };

                        const chat = model.startChat({ generationConfig })

                        const result = await chat.sendMessage(msg.text)

                            .catch(() => { bot.sendMessage(msg.chat.id, 'عذرا حدث خطأ ما ربما بسبب الأنترنيت, حاول مجددا') })

                        // console.log("_______rest______4_", result.response.text())

                        bot.sendMessage(msg.chat.id, result.response.text(), {

                            parse_mode: 'Markdown'

                        })

                    } else if (member.status == 'kicked') {

                        bot.sendMessage(msg.chat.id, `انت محضور من الأستخدام, راجع احد المشرفين لمساعدتك`, {

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

                    } else if (member.status == 'left') {

                        bot.sendMessage(msg.chat.id, 'عذرا ! \n يجب عليك اولا الأشتراك بالقناة', {

                            'reply_markup': {

                                "inline_keyboard": [

                                    [{ text: "اشترك من هنا", url: "https://t.me/bashar_prog" }],

                                    [{ text: "تابعني على انستكرام", url: "https://instagram.com/bashar1_x" }]

                                ]

                            }

                        })

                    }

                })



            }

        }

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

    {

        command: "admin",

        description: "command admin",

        regexp: /\/admin/

    },

]



bot.onText(command[0].regexp, (msg) => {

    const text = `

أهلا بك يا ${msg.from.first_name}



حسناً هل أنت بحاجة إلى اي مساعدة او ينقصك بعض المعلومات، لا عليك أنا سوف أساعدك، اسالني وسوف أجيب؛

أنا أملك موسوعة هائلة من المعلومات العامة وأملك المعرفة في أمور عديدة مثل الرياضيات، الطب، الدين، الطبخ، التحليل... وغيرها من الأمور العديدة

    

وأنا قادر على تحليل الصور، بإمكانك ارسال لي صورة مع تحديد ماذا تريد من الصورة بكتابة ماذا تريد تحتها.

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

أنا ذكاء اصطناعي قادر على الإجابة عن كافة الأسئلة والمواضيع العامة،

وانا أملك قاعدة بيانات هائلة من جوجل وأملك سيرفر سريع وسلس بفضل مطوري @bashar1_x وكل هذا لكي أقدم افضل أداء وأدق المعلومات؛

    

للمزيد من المعلومات حول هذا البوت،

أو حدوث أخطأ أثناء الاستخدام يمكنك مراسلة الحسابات التالية.

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

    bot.sendMessage(msg.chat.id, "تستطيع متابعة المطور على..", {

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

    } else {

        bot.sendMessage(msg.chat.id, `انت غير مسؤول, مسؤولوا البوت \n @bashar1_x  @amjad_kh1 @hmam1_x`)

    }

})



bot.on('voice', (msg) => {

    // console.log("audio")

    const arr = [

        `انا لا استطيع سماع الرسائل الصوتية`,

        `عفوا لا يمكنني سماع الصوت لم اتدرب جيدا على هذا`,

        `أتمنى لو كان بامكاني سماع الصوت لاكن لم اتدرب بشكل كاف`

    ]

    const random = Math.floor(Math.random() * arr.length - 1) + 1;

    bot.sendMessage(msg.chat.id, arr[random])

})



bot.setMyCommands(command)

bot.on("polling_error", console.log)
