import { Bot, GrammyError, HttpError, InlineKeyboard, Keyboard } from "grammy";
import { collection, addDoc, doc, getDoc, setDoc, query, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase-config";
const cron = require('node-cron');
import dotenv from 'dotenv';
const express = require('express');

dotenv.config();
const app = express();
const port = 3000;

// INIT BOT=========================================================
const botToken = process.env.BOT_TOKEN ? process.env.BOT_TOKEN as string : "";

if (!botToken) {
    throw new Error("API Token not available!");
}

const bot = new Bot(botToken)

bot.command("subscribe", async (ctx) => {
    await writeChatId(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Subscribed to bot!");
});

bot.command("unsubscribe", async (ctx) => {
    await deleteUser(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Unsubscribed to bot");
})
// INIT BOT=========================================================

// DATA=============================================================
interface data {
    breakfastTomorrow: string;
    dinnerTomorrow: string;
    breakfastFeedback: string;
    dinnerFeedback: string;
};

const submitData = async (data: data, chatId: number) => {
    try {
        const date = new Date()
        const docRef = doc(db, date.toLocaleDateString().replace(/\//g, "-"), chatId.toString());
        await setDoc(docRef, data);
    } catch (e) {
        console.error(e);
    }
}

let currData: data = {
    breakfastTomorrow: "",
    dinnerTomorrow: "",
    breakfastFeedback: "",
    dinnerFeedback: ""
}
// DATA=============================================================
// BREAKFAST===========================================================

bot.command("bfast", async (ctx) => {
    await ctx.reply("Are you having breakfast tomorrow?", {
        reply_markup: breakfast,
    });
})

bot.callbackQuery("bfast-yes", async (ctx) => {
    console.log("yes");
    currData.breakfastTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Yes");
});

bot.callbackQuery("bfast-no", async (ctx) => {
    console.log("no");
    currData.breakfastTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "No");
});

bot.callbackQuery("bfast-idk", async (ctx) => {
    console.log("idk");
    currData.breakfastTomorrow = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Don't Know");
});

const breakfast = new InlineKeyboard()
    .text("Yes", "bfast-yes")
    .text("No", "bfast-no")
    .text("Idk", "bfast-idk");

// BREAKFAST===========================================================
// DINNER==============================================================

bot.command("dinz", async (ctx) => {
    await ctx.reply("Are you having dinner tomorrow?", {
        reply_markup: dinner,
    });
})

bot.callbackQuery("dinner-yes", async (ctx) => {
    console.log("dinner-yes");
    currData.dinnerTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Yes");
});

bot.callbackQuery("dinner-no", async (ctx) => {
    console.log("dinner-no");
    currData.dinnerTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "No");
});

bot.callbackQuery("dinner-idk", async (ctx) => {
    console.log("dinner-idk");
    currData.dinnerTomorrow = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Don't Know");
});

const dinner = new InlineKeyboard()
    .text("Yes", "dinner-yes")
    .text("No", "dinner-no")
    .text("Idk", "dinner-idk");

// DINNER==============================================================
// BREAKFAST FEEDBACK==================================================
bot.command("bfastFeedback", async (ctx) => {
    await ctx.reply("What did you have for breakfast yesterday?", {
        reply_markup: breakfastFeedback,
    });
})

bot.callbackQuery("bfast-asian", async (ctx) => {
    console.log("bfast-asian");
    currData.breakfastFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Asian");
});

bot.callbackQuery("bfast-western", async (ctx) => {
    console.log("bfast-western");
    currData.breakfastFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Western");
});

bot.callbackQuery("bfast-muslim", async (ctx) => {
    console.log("bfast-muslim");
    currData.breakfastFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Muslim");
});

bot.callbackQuery("bfast-grabngo", async (ctx) => {
    console.log("bfast-grabngo");
    currData.breakfastFeedback = "grabngo";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Grab and Go");
});

bot.callbackQuery("bfast-cereal", async (ctx) => {
    console.log("bfast-cereal");
    currData.breakfastFeedback = "cereal";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Cereal");
});

bot.callbackQuery("bfast-nope", async (ctx) => {
    console.log("bfast-nope");
    currData.breakfastFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Did not eat");
});

bot.callbackQuery("bfast-dk", async (ctx) => {
    console.log("bfast-dk");
    currData.breakfastFeedback = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Forgot what I ate");
});

const breakfastFeedback = new InlineKeyboard()
    .text("Don't remember", "bfast-dk")
    .text("Didn't eat", "bfast-nope").row()
    .text("Asian", "bfast-asian")
    .text("Western", "bfast-western")
    .text("Muslim", "bfast-muslim").row()
    .text("Grab and Go", "bfast-grabngo")
    .text("Cereal", "bfast-cereal")

// BREAKFAST FEEDBACK==================================================
// DINNER FEEDBACK==================================================
bot.command("dinnerFeedback", async (ctx) => {
    await ctx.reply("What did you have for dinner yesterday?", {
        reply_markup: dinnerFeedback,
    });
})

bot.callbackQuery("dinner-asian", async (ctx) => {
    console.log("dinner-asian");
    currData.dinnerFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Asian");
});

bot.callbackQuery("dinner-western", async (ctx) => {
    console.log("dinner-western");
    currData.dinnerFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Western");
});

bot.callbackQuery("dinner-muslim", async (ctx) => {
    console.log("dinner-muslim");
    currData.dinnerFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Muslim");
});

bot.callbackQuery("dinner-indian", async (ctx) => {
    console.log("dinner-indian");
    currData.dinnerFeedback = "indian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Indian");
});

bot.callbackQuery("dinner-noodles", async (ctx) => {
    console.log("dinner-noodles");
    currData.dinnerFeedback = "noodles";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Noodles");
});

bot.callbackQuery("dinner-vegetarian", async (ctx) => {
    console.log("dinner-vegetarian");
    currData.dinnerFeedback = "vegetarian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Vegetarian");
});

bot.callbackQuery("dinner-nope", async (ctx) => {
    console.log("dinner-nope");
    currData.dinnerFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Did not eat");
});

bot.callbackQuery("dinner-dk", async (ctx) => {
    console.log("dinner-dk");
    currData.dinnerFeedback = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Forgot what I ate");
});

const dinnerFeedback = new InlineKeyboard()
    .text("Don't remember", "dinner-dk")
    .text("Didn't eat", "dinner-nope").row()
    .text("Asian", "dinner-asian")
    .text("Western", "dinner-western")
    .text("Muslim", "dinner-muslim").row()
    .text("Indian", "dinner-indian")
    .text("Noodles", "dinner-noodles")
    .text("Vegetarian", "dinner-vegetarian")

// DINNER FEEDBACK==================================================
// SUBMIT===========================================================
const submit = new InlineKeyboard().text("Submit!");

bot.callbackQuery("Submit!", async (ctx) => {
    if (ctx.chat) await submitData(currData, ctx.chat.id);
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    currData = {
        breakfastTomorrow: "",
        dinnerTomorrow: "",
        breakfastFeedback: "",
        dinnerFeedback: ""
    }
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Thanks for your submission!");
})
// SUBMIT===========================================================

const sendForm = async (id: number) => {
    await bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    await bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    await bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    await bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    await bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit })
}

bot.start();

cron.schedule('0 0 20 * * *', async () => {
    const data = await retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            sendForm(id);
        }
    }
}, {
    timezone: "Asia/Singapore"
});

cron.schedule('*/14 * * * *', () => {
    console.log("stay awake");
})

app.listen(port, () => {
    console.log(`Tele Bot listening on port ${port}`);
});

const writeChatId = async (chatId: number): Promise<void> => {
    try {
        const docRef = doc(db, "users", chatId.toString());
        await setDoc(docRef, {
            chatId: chatId
        })
    } catch (e) {
        console.error(e)
    }
}

const retrieveIds = async (): Promise<number[] | undefined> => {
    try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const res: number[] = [];
        querySnapshot.forEach(doc => {
            res.push(doc.data().chatId);
        })
        return res;
    } catch (e) {
        console.error(e);
    }
}

const deleteUser = async (chatId: number): Promise<void> => {
    await deleteDoc(doc(db, "users", chatId.toString()));
}