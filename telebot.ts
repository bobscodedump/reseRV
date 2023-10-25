import { Bot, Context, InlineKeyboard, SessionFlavor, session, } from "grammy";
import { collection, doc, setDoc, query, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "./firebase-config";
const cron = require('node-cron');
import dotenv from 'dotenv';
const express = require('express');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// INIT BOT=========================================================
const botToken = process.env.BOT_TOKEN ? process.env.BOT_TOKEN as string : "";

if (!botToken) {
    throw new Error("API Token not available!");
}

interface data {
    breakfastTomorrow: string;
    dinnerTomorrow: string;
    breakfastFeedback: string;
    dinnerFeedback: string;
    day: string;
};

type MyContext = Context & SessionFlavor<data>;

const bot = new Bot<MyContext>(botToken);

function initial(): data {
    return {
        breakfastTomorrow: "",
        dinnerTomorrow: "",
        breakfastFeedback: "",
        dinnerFeedback: "",
        day: ""
    }
}

bot.use(session({ initial }));

// bot.command("subscribe", async (ctx) => {
//     await writeChatId(ctx.chat.id);
//     bot.api.sendMessage(ctx.chat.id, "Subscribed to bot!");
// });

bot.command("unsubscribe", async (ctx) => {
    await deleteUser(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Unsubscribed :(");
})

bot.command("start", async (ctx) => {
    await writeChatId(ctx.chat.id);
    bot.api.sendMessage(ctx.chat.id, "Subscribed to bot!");
})

bot.command("help", ctx => {
    bot.api.sendMessage(ctx.chat.id, welcomeMessage);
})

bot.command("bottest", ctx => {
    sendForm(ctx.chat.id);
})

// INIT BOT=========================================================

// DATA=============================================================
const submitData = async (data: data, chatId: number) => {
    try {
        const date = new Date()
        const docRef = doc(db, date.toLocaleDateString("en-US", { timeZone: "Asia/Singapore" }).replace(/\//g, "-"), chatId.toString());
        await setDoc(docRef, data);
    } catch (e) {
        console.error(e);
    }
}
// DATA=============================================================
// BREAKFAST===========================================================

// bot.command("bfast", async (ctx) => {
//     await ctx.reply("Are you having breakfast tomorrow?", {
//         reply_markup: breakfast,
//     });
// })

bot.callbackQuery("bfast-yes", async (ctx) => {
    console.log("yes");
    ctx.session.breakfastTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Yes");
});

bot.callbackQuery("bfast-no", async (ctx) => {
    console.log("no");
    ctx.session.breakfastTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "No");
});

bot.callbackQuery("bfast-idk", async (ctx) => {
    console.log("idk");
    ctx.session.breakfastTomorrow = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Don't Know");
});

const breakfast = new InlineKeyboard()
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

bot.callbackQuery("dinner-yes", async (ctx) => {
    console.log("dinner-yes");
    ctx.session.dinnerTomorrow = "yes";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Yes");
});

bot.callbackQuery("dinner-no", async (ctx) => {
    console.log("dinner-no");
    ctx.session.dinnerTomorrow = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "No");
});

bot.callbackQuery("dinner-idk", async (ctx) => {
    console.log("dinner-idk");
    ctx.session.dinnerTomorrow = "idk";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Don't Know");
});

const dinner = new InlineKeyboard()
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

bot.callbackQuery("bfast-asian", async (ctx) => {
    console.log("bfast-asian");
    ctx.session.breakfastFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Asian");
});

bot.callbackQuery("bfast-western", async (ctx) => {
    console.log("bfast-western");
    ctx.session.breakfastFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Western");
});

bot.callbackQuery("bfast-muslim", async (ctx) => {
    console.log("bfast-muslim");
    ctx.session.breakfastFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Muslim");
});

bot.callbackQuery("bfast-grabngo", async (ctx) => {
    console.log("bfast-grabngo");
    ctx.session.breakfastFeedback = "grabngo";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Grab and Go");
});

bot.callbackQuery("bfast-cereal", async (ctx) => {
    console.log("bfast-cereal");
    ctx.session.breakfastFeedback = "cereal";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Cereal");
});

bot.callbackQuery("bfast-nope", async (ctx) => {
    console.log("bfast-nope");
    ctx.session.breakfastFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Did not eat");
});

bot.callbackQuery("bfast-dk", async (ctx) => {
    console.log("bfast-dk");
    ctx.session.breakfastFeedback = "idk";
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
// bot.command("dinnerFeedback", async (ctx) => {
//     await ctx.reply("What did you have for dinner yesterday?", {
//         reply_markup: dinnerFeedback,
//     });
// })

bot.callbackQuery("dinner-asian", async (ctx) => {
    console.log("dinner-asian");
    ctx.session.dinnerFeedback = "asian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Asian");
});

bot.callbackQuery("dinner-western", async (ctx) => {
    console.log("dinner-western");
    ctx.session.dinnerFeedback = "western";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Western");
});

bot.callbackQuery("dinner-muslim", async (ctx) => {
    console.log("dinner-muslim");
    ctx.session.dinnerFeedback = "muslim";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Muslim");
});

bot.callbackQuery("dinner-indian", async (ctx) => {
    console.log("dinner-indian");
    ctx.session.dinnerFeedback = "indian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Indian");
});

bot.callbackQuery("dinner-noodles", async (ctx) => {
    console.log("dinner-noodles");
    ctx.session.dinnerFeedback = "noodles";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Noodles");
});

bot.callbackQuery("dinner-vegetarian", async (ctx) => {
    console.log("dinner-vegetarian");
    ctx.session.dinnerFeedback = "vegetarian";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Vegetarian");
});

bot.callbackQuery("dinner-nope", async (ctx) => {
    console.log("dinner-nope");
    ctx.session.dinnerFeedback = "no";
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Did not eat");
});

bot.callbackQuery("dinner-dk", async (ctx) => {
    console.log("dinner-dk");
    ctx.session.dinnerFeedback = "idk";
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
    ctx.session.day = new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore", weekday: "short" });
    if (ctx.chat) await submitData(ctx.session, ctx.chat.id);
    ctx.editMessageReplyMarkup({ reply_markup: undefined });
    ctx.session = initial();
    if (ctx.chat) ctx.api.sendMessage(ctx.chat.id, "Thanks for your submission!");
})
// SUBMIT===========================================================

const sendForm = async (id: number) => {
    await bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    await bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    await bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    await bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    await bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    await bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit })
}

const monForm = async (id: number) => {
    await bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    await bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    await bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    await bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    await bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit })
}

const friForm = async (id: number) => {
    await bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    await bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    await bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    await bot.api.sendMessage(id, "Did you have dinner yesterday?", { reply_markup: dinnerFeedback });
    await bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit })
}

const satForm = async (id: number) => {
    await bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    await bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    await bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    await bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit })
}

const sunForm = async (id: number) => {
    await bot.api.sendMessage(id, "Remember: please do not double click the buttons!");
    await bot.api.sendMessage(id, "Are you having breakfast tomorrow?", { reply_markup: breakfast });
    await bot.api.sendMessage(id, "Are you having dinner tomorrow?", { reply_markup: dinner });
    await bot.api.sendMessage(id, "Did you have breakfast yesterday?", { reply_markup: breakfastFeedback });
    await bot.api.sendMessage(id, "Hit submit when you're done!", { reply_markup: submit })
}

bot.start();

// Mon
cron.schedule('0 20 * * 1', async () => {
    const data = await retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            monForm(id);
        }
    }
}, {
    timezone: "Asia/Singapore"
});

// Tues-Thurs
cron.schedule('0 20 * * 2-4', async () => {
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

// Friday
cron.schedule('0 20 * * 5', async () => {
    const data = await retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            friForm(id);
        }
    }
}, {
    timezone: "Asia/Singapore"
});

// Saturday
cron.schedule('0 20 * * 6', async () => {
    const data = await retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            satForm(id);
        }
    }
}, {
    timezone: "Asia/Singapore"
});

// Sunday
cron.schedule('0 20 * * 7', async () => {
    const data = await retrieveIds();
    if (data) {
        for (const id of data) {
            console.log(id);
            sunForm(id);
        }
    }
}, {
    timezone: "Asia/Singapore"
});

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

const welcomeMessage = `🍽️ say HELLO to reseRV 🍝

the reseRV telebot streamlines the existing dining hall meal reservation system by collecting data on meals. (Meals will not be reserved)

Use /start to subscribe to the bot, and a poll will be sent to you daily at 8pm.

Click submit once you have answered all 4 polls!

(Please do not double-click the buttons as it may cause the server to crash!)

With just 4 clicks each day, together we can help RVRC reduce food waste!

(/unsubscribe to unsubscribe to the bot)

/help to get help!

Reserve with reseRV!`