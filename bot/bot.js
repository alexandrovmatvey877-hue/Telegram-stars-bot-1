require("dotenv").config();

console.log("BOT STARTING", process.pid);

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});


bot.getMe()
    .then((info) => {

        console.log(
            "BOT CONNECTED:",
            info.username
        );

    })
    .catch(err => {

        console.error(
            "BOT CONNECTION ERROR:",
            err.message
        );

    });


bot.on("polling_error", (err) => {

    console.log(
        "POLL ERROR:",
        err.message
    );

});


// =======================
// CONFIG
// =======================

const MINI_APP =
"https://white-stars.onrender.com/";

const CHANNEL =
"https://t.me/White_stars_post";


// =======================
// Главное меню
// =======================

function sendMenu(chatId, ref = null){

    let appUrl = MINI_APP;


    // если есть реферал
    if(ref){

        appUrl += `?ref=${ref}`;

    }


    bot.sendMessage(
        chatId,

`⭐ Добро пожаловать в WHITE STARS!

Выберите действие:`,

{
reply_markup: {

inline_keyboard: [

[
{
text:"📢 Канал",
url:CHANNEL
}
],


[
{
text:"🚀 Зайти в Mini App",
web_app:{
url:appUrl
}
}
],


[
{
text:"👤 Профиль",
callback_data:"profile"
}
]

]

}

}

);

}



// =======================
// START + REF
// =======================


bot.onText(
/\/start(?:\s(.+))?/,

(msg, match)=>{


const chatId = msg.chat.id;


// реферал
const referrer =
match[1] || null;



console.log(
"START:",
msg.from.id,
"REF:",
referrer
);



sendMenu(
chatId,
referrer
);


});




// =======================
// CALLBACKS
// =======================


bot.on(
"callback_query",

async(query)=>{


if(query.data==="profile"){


const user=query.from;


await bot.answerCallbackQuery(
query.id
);



await bot.deleteMessage(
query.message.chat.id,
query.message.message_id
);



await bot.sendMessage(

query.message.chat.id,


`👤 Ваш профиль


🆔 ID: ${user.id}

👤 Имя:
${user.first_name || "Не указано"}

📛 Username:
${user.username ? "@"+user.username : "Не указан"}`,

{

reply_markup:{

inline_keyboard:[

[
{
text:"⬅️ Назад",
callback_data:"back"
}
]

]

}

}

);


}




if(query.data==="back"){


await bot.answerCallbackQuery(
query.id
);



await bot.deleteMessage(
query.message.chat.id,
query.message.message_id
);



sendMenu(
query.message.chat.id
);


}



});