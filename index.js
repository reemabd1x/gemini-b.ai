import express from "express";
import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import { runChat } from "./FunctionsAi/runChat.js";
import { scanBadChats } from "./FunctionsAi/scanBadChats.js";
import { getBufferFiles } from "./controllers/getBufferFiles.js";
import { commands } from "./controllers/commands.js";
const app = express();
const bot = new TelegramBot('7935204461:AAGw2YA1Z5OD6JP_EJ18a2iYIcLG7Ul-2hU', { polling: true });
dotenv.config();
// FUNCTIONS RUN IN PRIVATE
bot.on('text', async (ctx) => {
    try {
        if (ctx.chat.type !== 'private') return; if (ctx.entities) return
        if (ctx.reply_to_message) return
        console.log('text user', ctx);
        const result = await runChat(ctx.text, ctx.from?.first_name || 'brother');
        bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })
    } catch (err) { console.log(err), sendError(ctx.chat.id) }
});

bot.on('document', async (ctx) => {
    try {
        if (ctx.chat.type !== 'private') return; if (ctx.entities) return
        if (ctx.document.mime_type !== 'application/pdf') return bot.sendMessage(ctx.chat.id, 'to pdf',)
        console.log('doc user', ctx);
        const urlDoc = await bot.getFileLink(ctx.document.file_id)
        const inlineData = await getBufferFiles(urlDoc, 'application/pdf')
        const result = await runChat(ctx?.caption || '?', ctx.from?.first_name || 'brother', inlineData)
        bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })
    } catch (err) { console.log(err), sendError(ctx.chat.id) }
});

bot.on('photo', async (ctx) => {
    try {
        if (ctx.chat.type !== 'private') return; if (ctx.entities) return
        console.log('photo user', ctx);
        const urlPhoto = await bot.getFileLink(ctx.photo[ctx.photo.length - 1].file_id)
        const inlineData = await getBufferFiles(urlPhoto, 'image/jpeg')
        const result = await runChat(ctx?.caption || '?', ctx.from?.first_name || 'brother', inlineData)
        bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })
    } catch (err) { console.log(err), sendError(ctx.chat.id) }
});

bot.on('text', async (ctx) => {
    try {
        if (ctx.chat.type !== 'private') return; if (ctx.entities) return
        if (ctx?.reply_to_message) {

            if (ctx?.reply_to_message?.photo) {
                console.log('reply user photo', ctx);
                const link = ctx.reply_to_message.photo
                const urlPhoto = await bot.getFileLink(link[link.length - 1].file_id)
                const inlineData = await getBufferFiles(urlPhoto, 'image/jpeg')
                const result = await runChat(ctx?.text || '...', ctx.from?.first_name || 'brother', inlineData)
                bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })

            } else if (ctx?.reply_to_message?.document) {
                console.log('reply user docs', ctx);
                if (ctx.reply_to_message.document.mime_type !== 'application/pdf') return bot.sendMessage(ctx.chat.id, 'It must be in pdf format.',)
                const link = ctx.reply_to_message.document
                const urlDoc = await bot.getFileLink(link.file_id)
                const inlineData = await getBufferFiles(urlDoc, 'application/pdf')
                const result = await runChat(ctx?.caption || '...', ctx.from?.first_name || 'brother', inlineData)
                bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })

            } else if (ctx?.reply_to_message?.text) {
                console.log('reply user text', ctx);
                const allText = `${ctx?.reply_to_message?.text || ''} \n\n\n ${ctx.text}`
                const result = await runChat(allText, ctx.from?.first_name || 'brother',);
                bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })
            }
        }
    } catch (err) { console.log(err), sendError(ctx.chat.id) }
});


// // // COMMANDS
bot.onText(/\/start/, async (ctx) => { //command start
    try {
        console.log('regx start', ctx);
        const result = await runChat('How can I benefit from you?', ctx.from?.first_name || 'brother');
        bot.sendMessage(ctx.chat.id, result, {
            parse_mode: 'Markdown',
            'reply_markup': { "inline_keyboard": [[{ text: "to bot", url: "https://t.me/xaztom_bot" }]] }
        })
        .catch(() => { bot.sendMessage(ctx.chat.id, result) })
    } catch (err) { console.log(err), sendError(ctx.chat.id) }
})

bot.onText(commands[0].regexp, async (ctx) => { //command xaztom
    try {
        console.log('regx xaztom', ctx);
        if (ctx.chat.type !== 'supergroup') return bot.sendMessage(ctx.chat.id, 'It only works in groups.')
        if (!ctx?.reply_to_message) return bot.sendMessage(ctx.chat.id, 'reply message.')

        let endReplace = ctx.text.replace("/xaztom@xaztom_bot", "");
        console.log(endReplace);
        if (ctx.reply_to_message?.text) {
            console.log('c reply user text', ctx);
            const result = await runChat(ctx.reply_to_message.text + endReplace, ctx.reply_to_message.from?.first_name || 'brother');
            bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })

        } else if (ctx.reply_to_message?.photo) {
            console.log('c reply user photo', ctx);
            const link = ctx.reply_to_message.photo
            const urlPhoto = await bot.getFileLink(link[link.length - 1].file_id)
            const inlineData = await getBufferFiles(urlPhoto, 'image/jpeg')
            const result = await runChat(ctx?.reply_to_message?.caption || '...' + endReplace, ctx.reply_to_message.from?.first_name || 'brother', inlineData)
            bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })

        } else if (ctx.reply_to_message?.document) {
            console.log('reply user docs', ctx);
            if (ctx.reply_to_message.document.mime_type !== 'application/pdf') return bot.sendMessage(ctx.chat.id, 'It must be in pdf format.',)
            const link = ctx.reply_to_message.document
            const urlDoc = await bot.getFileLink(link.file_id)
            const inlineData = await getBufferFiles(urlDoc, 'application/pdf')
            const result = await runChat(ctx?.reply_to_message?.caption || '...' + endReplace, ctx.reply_to_message.from?.first_name || 'brother', inlineData)
            bot.sendMessage(ctx.chat.id, result, { parse_mode: 'Markdown' }).catch(() => { bot.sendMessage(ctx.chat.id, result) })
        }
    } catch (err) { console.log(err), sendError(ctx.chat.id) }

})

// // SCAN BAD CHATS
bot.on('message', async (ctx) => {
    try {
        if (ctx.chat.type !== 'supergroup') return;
        console.log(ctx);

        if (ctx?.photo) {
            const urlPhoto = await bot.getFileLink(ctx.photo[0].file_id)
            const inlineData = await getBufferFiles(urlPhoto, 'image/jpeg')
            const result = await scanBadChats(ctx?.caption || '..', inlineData)
            console.log(result);
            result === 'true' ? await bot.deleteMessage(ctx.chat.id, ctx.message_id) : null

        } else {
            const result = await scanBadChats(ctx.text);
            console.log(result);
            result === 'true' ? await bot.deleteMessage(ctx.chat.id, ctx.message_id) : null
        }
    } catch (err) { console.log(err) }
})


const sendError = (id) => {
    const errorMessages = [
        "Error: Please try again.",
        "Something went wrong. Please try again.",
        "An error occurred.  Try again later.",
        "Failed to process request. Please try again."
    ];
    bot.sendMessage(id, errorMessages[Math.floor(Math.random() * errorMessages.length - 1) + 1])
}


app.use(express.json()); app.use(express.urlencoded())
app.get('/', (req, res) => {
    res.json({ run: 'run xaztom bot1' })
}); app.listen(process.env.PORT || 3000, () => { console.log(`listen`) })

// PING BOT ----
setInterval(async () => {
    try { const res = await fetch('https://gemini-b-ai.onrender.com/') }
    catch (err) { console.log('err intrv') }
}, 100 * 1000)

bot.setMyCommands(commands)
app.listen(3000, () => { console.log('listen this bot in messages...') });
