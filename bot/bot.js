require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");


const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    {
        polling: true
    }
);


const MINI_APP = "https://white-stars.onrender.com/";

const CHANNEL = "https://t.me/White_stars_post";


bot.onText(/\/start/, async (msg) => {

    const chatId = msg.chat.id;


    bot.sendMessage(
        chatId,

        `⭐ Добро пожаловать в White Stars!

Ваше цифровое пространство уже доступно.

Выберите действие:`,

        {
            reply_markup: {

                inline_keyboard: [

                    [
                        {
                            text: "📢 Канал",
                            url: CHANNEL
                        }
                    ],

                    [
                        {
                            text: "🚀 Зайти в Mini App",
                            web_app: {
                                url: MINI_APP
                            }
                        }
                    ],

                    [
                        {
                            text: "👤 Профиль",
                            web_app: {
                                url: MINI_APP + "profile.html"
                            }
                        }
                    ]

                ]

            }
        }
    );

});


console.log("🤖 WHITE STARS bot started");