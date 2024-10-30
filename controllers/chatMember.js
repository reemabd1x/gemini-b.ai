export const chatMember = async (bot, id) => {
    try {
        const result = await bot.getChatMember('@xaztom_channel', id);
        console.log(result);
        if (result.status === 'left') {
            bot.sendMessage(id, 'عذرا يجب عليك اولا الأشتراك بالقناة, Sorry, you must subscribe to the channel first.', {
                'reply_markup': { "inline_keyboard": [[{ text: "اشترك من هنا", url: "https://t.me/xaztom_channel" }]] }
            }); return true
        } else if (result.status === 'kicked') {
            bot.sendMessage(id, 'انت محضور من الأستخدام, راجع المنشئ لمساعدتك, You are banned from use.  Contact the creator for assistance.', {
                'reply_markup': { "inline_keyboard": [[{ text: "Bashar", url: "https://t.me/bashar1_x" }]] }
            }); return true
        } else return false
    } catch (err) { console.log(err) }
}