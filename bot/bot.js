console.log("BOT STARTING", process.pid);
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

const MINI_APP = "https://white-stars.onrender.com/";
const CHANNEL = "https://t.me/White_stars_post";

bot.onText(/\/start/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendMessage(
        chatId,
`⭐ Добро пожаловать в WHITE STARS!

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
                            callback_data: "profile"
                        }
                    ]
                ]
            }
        }
    );
});

bot.on("callback_query", async (query) => {

    if (query.data === "profile") {

        const user = query.from;

        await bot.answerCallbackQuery(query.id);

        // Удаляем главное меню
        await bot.deleteMessage(
            query.message.chat.id,
            query.message.message_id
        );

        // Отправляем профиль
        await bot.sendMessage(
            query.message.chat.id,

`👤 Ваш профиль

🆔 ID: ${user.id}
👤 Имя: ${user.first_name || "Не указано"}
📛 Username: ${user.username ? "@" + user.username : "Не указан"}`,

            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "⬅️ Назад",
                                callback_data: "back"
                            }
                        ]
                    ]
                }
            }
        );

    }

    if (query.data === "back") {

        await bot.answerCallbackQuery(query.id);

        // Удаляем профиль
        await bot.deleteMessage(
            query.message.chat.id,
            query.message.message_id
        );

        // Отправляем главное меню заново
        await bot.sendMessage(
            query.message.chat.id,

`⭐ Добро пожаловать в WHITE STARS!

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
                                callback_data: "profile"
                            }
                        ]
                    ]
                }
            }
        );

    }

});