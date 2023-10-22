const { Telegraf, session } = require('telegraf');
const express = require('express');
const cron = require('node-cron');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const port = 3000;

let chatId;

bot.command('start', (ctx) => {
  console.log(ctx.chat.id);
  chatId = ctx.chat.id;
  bot.telegram.sendMessage(ctx.chat.id, 'hey');
});

bot.command('poll', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id, 'Are you eating dinner tomorrow?', poll);
});

bot.action('yes', (ctx) => {
  try {
    console.log('yes');
    ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
});

bot.action('no', (ctx) => {
  try {
    console.log('no');
    ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
});

bot.action('veg', (ctx) => {
  try {
    console.log('veg');
    ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
});

bot.action('halal', (ctx) => {
  try {
    console.log('halal');
    ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error(error);
  }
});

const poll = {
  reply_markup: {
    one_time_keyboard: true,
    inline_keyboard: [
      [
        {
          text: `I'm Eating In!!`,
          one_time_keyboard: true,
          callback_data: 'yes',
        },
        {
          text: `I'm not Eating In D:`,
          one_time_keyboard: true,
          callback_data: 'no',
        },
      ],
      [
        {
          text: `I'm Eating Vegetarian Food`,
          one_time_keyboard: true,
          callback_data: 'veg',
        },
        {
          text: `I'm Eating Halal Food`,
          one_time_keyboard: true,
          callback_data: 'halal',
        },
      ],
    ],
  },
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

bot.launch();

cron.schedule(' */10 * * * * *', () => {
  console.log(chatId);

  if (chatId) bot.telegram.sendMessage(ctx.session.chatId, 'Are you eating dinner tomorrow?');
});
