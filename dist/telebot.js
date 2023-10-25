"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const firestore_1 = require("firebase/firestore");
const firebase_config_1 = require("./firebase-config");
const cron = require('node-cron');
const dotenv_1 = __importDefault(require("dotenv"));
const express = require('express');
dotenv_1.default.config();
const app = express();
const port = 80;
// INIT BOT=========================================================
const botToken = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : "";
if (!botToken) {
    throw new Error("API Token not available!");
}
;
const bot = new grammy_1.Bot(botToken);
function initial() {
    return {
        breakfastTomorrow: "",
        dinnerTomorrow: "",
        breakfastFeedback: "",
        dinnerFeedback: "",
        day: ""
    };
}
bot.use((0, grammy_1.session)({ initial }));
// bot.command("subscribe", async (ctx) => {
//     await writeChatId(ctx.chat.id);
//     bot.api.sendMessage(ctx.chat.id, "Subscribed to bot!");
// });
bot.command("unsubscribe", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteUser(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Unsubscribed :(");
}));
bot.command("start", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield writeChatId(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Subscribed to bot!");
}));
bot.command("help", ctx => {
    bot.api.sendMessage(ctx.chat.id, welcomeMessage);
});
bot.command("bottest", ctx => {
    sendForm(ctx.chat.id);
});
// INIT BOT=========================================================
// DATA=============================================================
const submitData = (data, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        const docRef = (0, firestore_1.doc)(firebase_config_1.db, date.toLocaleDateString("en-US", { timeZone: "Asia/Singapore" }).replace(/\//g, "-"), chatId.toString());
        yield (0, firestore_1.setDoc)(docRef, data);
    }
    catch (e) {
        console.error(e);
    }
});
// DATA=============================================================
// BREAKFAST===========================================================
// bot.command("bfast", async (ctx) => {
//     await ctx.reply("Are you having breakfast tomorrow?", {
//         reply_markup: breakfast,
//     });
// })
bot.callbackQuery("bfast-yes", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("yes");
    ctx.session.breakfastTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Yes");
}));
bot.callbackQuery("bfast-no", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("no");
    ctx.session.breakfastTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "No");
}));
bot.callbackQuery("bfast-idk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("idk");
    ctx.session.breakfastTomorrow = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Don't Know");
}));
const breakfast = new grammy_1.InlineKeyboard()
    .text("Yes", "bfast-yes")
    .text("No", "bfast-no")
    .text("Idk", "bfast-idk");
// BREAKFAST===========================================================
// DINNER==============================================================
// bot.command("dinz", async (ctx) => {
//     await ctx.reply("Are you having dinner tomorrow?", {
//         reply_markup: dinner,
//     });
// })
bot.callbackQuery("dinner-yes", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-yes");
    ctx.session.dinnerTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Yes");
}));
bot.callbackQuery("dinner-no", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-no");
    ctx.session.dinnerTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "No");
}));
bot.callbackQuery("dinner-idk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-idk");
    ctx.session.dinnerTomorrow = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Don't Know");
}));
const dinner = new grammy_1.InlineKeyboard()
    .text("Yes", "dinner-yes")
    .text("No", "dinner-no")
    .text("Idk", "dinner-idk");
// DINNER==============================================================
// BREAKFAST FEEDBACK==================================================
// bot.command("bfastFeedback", async (ctx) => {
//     await ctx.reply("What did you have for breakfast yesterday?", {
//         reply_markup: breakfastFeedback,
//     });
// })
bot.callbackQuery("bfast-asian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-asian");
    ctx.session.breakfastFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Asian");
}));
bot.callbackQuery("bfast-western", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-western");
    ctx.session.breakfastFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Western");
}));
bot.callbackQuery("bfast-muslim", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-muslim");
    ctx.session.breakfastFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Muslim");
}));
bot.callbackQuery("bfast-grabngo", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-grabngo");
    ctx.session.breakfastFeedback = "grabngo";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Grab and Go");
}));
bot.callbackQuery("bfast-cereal", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-cereal");
    ctx.session.breakfastFeedback = "cereal";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Cereal");
}));
bot.callbackQuery("bfast-nope", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-nope");
    ctx.session.breakfastFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Did not eat");
}));
bot.callbackQuery("bfast-dk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-dk");
    ctx.session.breakfastFeedback = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Forgot what I ate");
}));
const breakfastFeedback = new grammy_1.InlineKeyboard()
    .text("Don't remember", "bfast-dk")
    .text("Didn't eat", "bfast-nope").row()
    .text("Asian", "bfast-asian")
    .text("Western", "bfast-western")
    .text("Muslim", "bfast-muslim").row()
    .text("Grab and Go", "bfast-grabngo")
    .text("Cereal", "bfast-cereal");
// BREAKFAST FEEDBACK==================================================
// DINNER FEEDBACK==================================================
// bot.command("dinnerFeedback", async (ctx) => {
//     await ctx.reply("What did you have for dinner yesterday?", {
//         reply_markup: dinnerFeedback,
//     });
// })
bot.callbackQuery("dinner-asian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-asian");
    ctx.session.dinnerFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Asian");
}));
bot.callbackQuery("dinner-western", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-western");
    ctx.session.dinnerFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Western");
}));
bot.callbackQuery("dinner-muslim", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-muslim");
    ctx.session.dinnerFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Muslim");
}));
bot.callbackQuery("dinner-indian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-indian");
    ctx.session.dinnerFeedback = "indian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Indian");
}));
bot.callbackQuery("dinner-noodles", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-noodles");
    ctx.session.dinnerFeedback = "noodles";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Noodles");
}));
bot.callbackQuery("dinner-vegetarian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-vegetarian");
    ctx.session.dinnerFeedback = "vegetarian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Vegetarian");
}));
bot.callbackQuery("dinner-nope", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-nope");
    ctx.session.dinnerFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Did not eat");
}));
bot.callbackQuery("dinner-dk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-dk");
    ctx.session.dinnerFeedback = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Forgot what I ate");
}));
const dinnerFeedback = new grammy_1.InlineKeyboard()
    .text("Don't remember", "dinner-dk")
    .text("Didn't eat", "dinner-nope").row()
    .text("Asian", "dinner-asian")
    .text("Western", "dinner-western")
    .text("Muslim", "dinner-muslim").row()
    .text("Indian", "dinner-indian")
    .text("Noodles", "dinner-noodles")
    .text("Vegetarian", "dinner-vegetarian");
// DINNER FEEDBACK==================================================
// SUBMIT===========================================================
const submit = new grammy_1.InlineKeyboard().text("Submit!");
bot.callbackQuery("Submit!", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.session.day = new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", weekday: "short" });
    if (ctx.chat)
        yield submitData(ctx.session, ctx.chat.id);
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    ctx.session = initial();
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Thanks for your submission!");
}));
// SUBMIT===========================================================
const sendForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    yield bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    yield bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    yield bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    yield bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    yield bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit });
});
const monForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    yield bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    yield bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    yield bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    yield bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit });
});
const friForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    yield bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    yield bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    yield bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    yield bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit });
});
const satForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    yield bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    yield bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    yield bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit });
});
const sunForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    yield bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    yield bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    yield bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    yield bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit });
});
bot.start();
// Mon
cron.schedule('0 20 * * 1', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            monForm(id);
        }
    }
}), {
    timezone: "Asia/Singapore"
});
// Tues-Thurs
cron.schedule('0 20 * * 2-4', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            sendForm(id);
        }
    }
}), {
    timezone: "Asia/Singapore"
});
// Friday
cron.schedule('0 20 * * 5', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            friForm(id);
        }
    }
}), {
    timezone: "Asia/Singapore"
});
// Saturday
cron.schedule('0 20 * * 6', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            satForm(id);
        }
    }
}), {
    timezone: "Asia/Singapore"
});
// Sunday
cron.schedule('0 20 * * 7', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            sunForm(id);
        }
    }
}), {
    timezone: "Asia/Singapore"
});
app.listen(port, () => {
    console.log(`Tele Bot listening on port ${port}`);
});
const writeChatId = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = (0, firestore_1.doc)(firebase_config_1.db, "users", chatId.toString());
        yield (0, firestore_1.setDoc)(docRef, {
            chatId: chatId
        });
    }
    catch (e) {
        console.error(e);
    }
});
const retrieveIds = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(firebase_config_1.db, "users"));
        const querySnapshot = yield (0, firestore_1.getDocs)(q);
        const res = [];
        querySnapshot.forEach(doc => {
            res.push(doc.data().chatId);
        });
        return res;
    }
    catch (e) {
        console.error(e);
    }
});
const deleteUser = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_config_1.db, "users", chatId.toString()));
});
const welcomeMessage = `🍽️ say HELLO to reseRV 🍝

the reseRV telebot streamlines the existing dining hall meal reservation system by collecting data on meals. (Meals will not be reserved)

Use /start to subscribe to the bot, and a poll will be sent to you daily at 8pm.

Click submit once you have answered all 4 polls!

(Please do not double-click the buttons as it may cause the server to crash!)

With just 4 clicks each day, together we can help RVRC reduce food waste!

(/unsubscribe to unsubscribe to the bot)

/help to get help!

Reserve with reseRV!`;
