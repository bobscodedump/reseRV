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
const port = 3000;
// INIT BOT=========================================================
const botToken = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : "";
if (!botToken) {
    throw new Error("API Token not available!");
}
const bot = new grammy_1.Bot(botToken);
bot.command("subscribe", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield writeChatId(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Subscribed to bot!");
}));
bot.command("unsubscribe", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteUser(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Unsubscribed to bot");
}));
;
const submitData = (data, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = new Date();
        const docRef = (0, firestore_1.doc)(firebase_config_1.db, date.toLocaleDateString().replace(/\//g, "-"), chatId.toString());
        yield (0, firestore_1.setDoc)(docRef, data);
    }
    catch (e) {
        console.error(e);
    }
});
let currData = {
    breakfastTomorrow: "",
    dinnerTomorrow: "",
    breakfastFeedback: "",
    dinnerFeedback: ""
};
// DATA=============================================================
// BREAKFAST===========================================================
bot.command("bfast", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Are you having breakfast tomorrow?", {
        reply_markup: breakfast,
    });
}));
bot.callbackQuery("bfast-yes", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("yes");
    currData.breakfastTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Yes");
}));
bot.callbackQuery("bfast-no", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("no");
    currData.breakfastTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "No");
}));
bot.callbackQuery("bfast-idk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("idk");
    currData.breakfastTomorrow = "idk";
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
bot.command("dinz", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("Are you having dinner tomorrow?", {
        reply_markup: dinner,
    });
}));
bot.callbackQuery("dinner-yes", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-yes");
    currData.dinnerTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Yes");
}));
bot.callbackQuery("dinner-no", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-no");
    currData.dinnerTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "No");
}));
bot.callbackQuery("dinner-idk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-idk");
    currData.dinnerTomorrow = "idk";
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
bot.command("bfastFeedback", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("What did you have for breakfast yesterday?", {
        reply_markup: breakfastFeedback,
    });
}));
bot.callbackQuery("bfast-asian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-asian");
    currData.breakfastFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Asian");
}));
bot.callbackQuery("bfast-western", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-western");
    currData.breakfastFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Western");
}));
bot.callbackQuery("bfast-muslim", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-muslim");
    currData.breakfastFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Muslim");
}));
bot.callbackQuery("bfast-grabngo", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-grabngo");
    currData.breakfastFeedback = "grabngo";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Grab and Go");
}));
bot.callbackQuery("bfast-cereal", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-cereal");
    currData.breakfastFeedback = "cereal";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Cereal");
}));
bot.callbackQuery("bfast-nope", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-nope");
    currData.breakfastFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Did not eat");
}));
bot.callbackQuery("bfast-dk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("bfast-dk");
    currData.breakfastFeedback = "idk";
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
bot.command("dinnerFeedback", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield ctx.reply("What did you have for dinner yesterday?", {
        reply_markup: dinnerFeedback,
    });
}));
bot.callbackQuery("dinner-asian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-asian");
    currData.dinnerFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Asian");
}));
bot.callbackQuery("dinner-western", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-western");
    currData.dinnerFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Western");
}));
bot.callbackQuery("dinner-muslim", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-muslim");
    currData.dinnerFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Muslim");
}));
bot.callbackQuery("dinner-indian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-indian");
    currData.dinnerFeedback = "indian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Indian");
}));
bot.callbackQuery("dinner-noodles", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-noodles");
    currData.dinnerFeedback = "noodles";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Noodles");
}));
bot.callbackQuery("dinner-vegetarian", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-vegetarian");
    currData.dinnerFeedback = "vegetarian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Vegetarian");
}));
bot.callbackQuery("dinner-nope", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-nope");
    currData.dinnerFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Did not eat");
}));
bot.callbackQuery("dinner-dk", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("dinner-dk");
    currData.dinnerFeedback = "idk";
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
    if (ctx.chat)
        yield submitData(currData, ctx.chat.id);
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    currData = {
        breakfastTomorrow: "",
        dinnerTomorrow: "",
        breakfastFeedback: "",
        dinnerFeedback: ""
    };
    if (ctx.chat)
        ctx.api.sendMessage(ctx.chat.id, "Thanks for your submission!");
}));
// SUBMIT===========================================================
const sendForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    yield bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    yield bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    yield bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    yield bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit });
});
bot.start();
cron.schedule('0 0 20 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
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
