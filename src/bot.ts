import { url } from "inspector";
import { text } from "stream/consumers";
import { callback } from "telegraf/typings/button";
import { Telegraf, Markup } from "telegraf";
// Import the necessary packages
const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
import Web3 from "web3";
// const Web3 = require('web3');
const web3 = new Web3("https://mantle-mainnet.infura.io/v3/d6cd0989405e4fc8a7d5fc4b7bee6a0b");
// const http = require('http');

// Create a new Express app
// const app = express();
// Load environment variables
dotenv.config();

const token = process.env.TELEGRAM_TOKEN;
console.log("Bot token:", token); // Confirm token is loaded

// Create a new Telegram bot using polling to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Assign telegram channel id
const groupUsername = process.env.GROUP_USERNAME;
const channelUsername = process.env.CHANNEL_USERNAME;
const twitter = process.env.TWITTER_ID;

let groupId: number = 0;
let channelID: number = 0;
let twitterID: number = 0;

let USER_ID: number = 0;
let USER_NAME: string = "Leo_mint";
let chatId: number = 0;
const users: { id: number; username: string }[] = [];

bot
  .getChat(groupUsername)
  .then((chat: any) => {
    groupId = chat.id;
    console.log("Group ID:", groupId);
  })
  .catch((error: any) => {
    console.error("Error getting chat:", error);
  });

bot
  .getChat(channelUsername)
  .then((chat: any) => {
    channelID = chat.id;
    console.log("channel ID:", channelID);
  })
  .catch((error: any) => {
    console.error("Error getting chat:", error);
  });

// Define the inline keyboard layout for interaction
// const options3 = {
//   reply_markup: {
//     inline_keyboard: [
//       [
//         {
//           text: "Play in 1 click  🐉",
//           web_app: { url: "https://general-telegram-game.vercel.app/" },
//         },
//       ],
//       [
//         {
//           text: "Subscribe to the channel  🐸",
//           url: "https://t.me/MikeTokenAnn",
//         },
//       ],
//       [{ text: "How to earn from the game  🐲", callback_data: "earn" }],
//       [{ text: "Task 📝", callback_data: "task" }],
//     ],
//   },
// };

const paidOption = {
  parse_mode: "HTML",
  disable_web_page_preview: true,

  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Play the Game 🚀",
          web_app: { url: "https://general-telegram-game.vercel.app/" },
        },
      ]
    ],
  },
};
const confirmOption = {
  parse_mode: "HTML",
  disable_web_page_preview: true,

  reply_markup: {
    inline_keyboard: [
      [{ text: "Confirm the Payment ❓", callback_data: "check_payment" }],
    ],
  },
};

const options = {
  parse_mode: "HTML",
  disable_web_page_preview: true,

  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Play the Game 🚀",
          web_app: { url: "https://general-telegram-game.vercel.app/" },
        },
      ],
      [
        {
          text: "Enter the Wallet Address  💳",
          callback_data: "pay",
        },
      ],
      [{ text: "Task 📝", callback_data: "task" }],
      [{ text: "Get Friends 👨‍👩‍👦‍👦", callback_data: "friends" }],
    ],
  },
};

// Handle the /start command
bot.onText(/\/start/, (msg: any) => {
  chatId = msg.chat.id;
  const userID = msg.from.id;
  // USER_ID = chatId;

  console.log("--//---myChatID----//---", chatId);

  const welcomeMessage =
    `Hello! Welcome to the CashTree Bot 🌳🌴🌲              \n\nStart our tap-to-earn game by clicking the “Play” button below. Choose your adventure and start tapping the screen to collect coins.   \n\nBoost your passive income and develop your own strategy with multi-taps, higher energy, and referrals. Join our social media to become an active member of the CryptoMonsters society with the exclusive “Cashtree Token.” \n\nIn Cashtree Bot, all activities are rewarded. Gather as many coins as possible. Once $CCT is listed on T1 & T2 exchanges, you'll receive mysterious🎁, valuable prizes directly to your wallets.\n\nDon't forget to invite your friends👨‍👨‍👧‍👦 — you can earn even more together!💰 `;

  // Send the welcome message with the inline keyboard
  bot.sendMessage(chatId, welcomeMessage, options);
});

bot.on("message", async (msg: any) => {
  chatId = msg.chat.id;
  USER_ID = chatId;
  const userID = msg.from.id;
  USER_NAME = msg.from?.username;

  console.log("--//---myChatID----//---", chatId);
  console.log("--//---myUserID----//---", userID);

  // Check if the message is from the specific group and the specific user
  if (msg.chat.id === groupId && msg.from.id === userID) {
    console.log(
      `User ${msg.from.username} (ID: ${msg.from.id}) posted a message in the group.`
    );
    // Here, you can do something with the message, like logging or sending a confirmation
    // bot.sendMessage(
    //   msg.chat.id,
    //   `User ${msg.from.username} posted a message in the group.`
    // );

    try {
      await axios
        .post(
          `https://localhost:5000/api/vibe/${msg.from.username}`
        )
        .then((res: any) => {
          if (res.data.length == 0) {
            axios.post(
              `https://localhost:5000/api/vibe/add`,
              {
                username: msg.from.username,
              }
            );
          } else {
            axios.post(
              `https://localhost:5000/api/vibe/updateMessage/${msg.from.username}`,
              { message: true }
            )
            console.log("--//---OK!!!----//---", res.data);
          }

          console.log("result", false);
        });

      console.log("--//---OK!!!--vibe user--//---", msg.from.username);
    } catch (error) {
      console.error(error);
    }
  }
});

bot.on("callback_query", (callbackQuery: any) => {
  const message = callbackQuery.message;
  const category = callbackQuery.data;
  if (category === "pay") {
    const messagetext =
      "You should pay for the playing the Cashtree Tap to Game. Please input your wallet address 💳. ";
    bot.sendMessage(message.chat.id, messagetext);
    bot.on('message', async (msg: any) => {
      const chatId = msg.chat.id;

      if (web3.utils.isAddress(msg.text)) {
        const walletAddress = msg.text;
        bot.sendMessage(chatId, `Wallet connected: ${walletAddress} \n\nFor playing the game, you should check the payment!`, confirmOption);
      } else {
        bot.sendMessage(chatId, 'Please send a valid Ethereum wallet address.');
      }
    });
  }

  if (category === "check_payment") {
    const messagetext =
      "If you want to check the payment, please input your transaction ID 💰💰";
    bot.sendMessage(message.chat.id, messagetext);
    bot.on('message', async (msg: any) => {
      const chatId = msg.chat.id;
      try {
        const transaction = await getTransactionDetails(msg.text)
        if (transaction && transaction.blockNumber !== undefined) {
          const { recipientAddress, amount } = decodeInputData(transaction.input);
          bot.sendMessage(chatId, `Valid transaction ID                                 \n\nRecipient Address: ${recipientAddress} ,\n\nTransaction Amount: ${amount} \n\nLet's play the game and get more money!`, paidOption);
          return true;
        } else {
          bot.sendMessage(chatId, `Invalid or unconfirmed transaction ID: ${msg.text}`);
          console.log("Invalid or unconfirmed transaction ID:", msg.text);
          return false;
        }
      } catch (error) {
        bot.sendMessage(chatId, `This transaction is not found: ${msg.text}`);
        console.error("Error validating transaction ID:", error);
        return false;
      }
    })
  }

  if (category === "task") {
    const messagetext =
      "   😊   You will gain bonus!  🚀                    \n\n 😎  Join Mike's telegram group  \n       https://t.me/MikeToken \n       You will receive 1000 coins \n\n 🤩  Join Mike's Ann Channel  \n       https://t.me/MikeTokenAnn \n       You will receive 1000 coins \n\n  😍  Follow our twitter!\n       https://twitter.com/MikeTokenio\n       You will receive 1000 coins \n\n";
    bot.sendMessage(message.chat.id, messagetext, options);
  }

  if (category === "friends") {

  }
});

bot.onText(/\/getmembers/, (msg: any) => {
  const chatId = msg.chat.id;

  bot.getChatMembersCount(chatId).then((memberCount: any) => {
    bot.getChatAdministrators(chatId).then((admins: any[]) => {
      const adminList = admins.map((admin) => admin.user.first_name);
      const response = `The number of members in this chat is ${memberCount}.\nThe administrators in this chat are: ${adminList.join(', ')}`;
      
      bot.sendMessage(chatId, response);
    });
  });
});

bot.onText(/\/start (.+)/, async (msg: any, match: any) => {
  const chatId = msg.chat.id;
  const referrerUsername = match[1]; // Extracted from the start parameter

  console.log("--//---OK!!!----//---");
  console.log("--//---referrerUsername----//---", referrerUsername);
  console.log("--//---USER_NAME----//---", USER_NAME);

  try {
    await axios.post(
      `https://localhost:5000/api/friend/add`,
      {
        username: referrerUsername,
        friend: USER_NAME,
      }
    );

    const response00 = await axios.post(
      `https://localhost:5000/api/wallet/add`,
      {
        username: USER_NAME,
      }
    );

    const response0 = await axios.post(
      `https://localhost:5000/api/wallet/updateBalance/${USER_NAME}`,
      { balance: 5000 }
    );

    const response1 = await axios.post(
      `https://localhost:5000/api/wallet/${referrerUsername}`
    );
    const response2 = await axios.post(
      `https://localhost:5000/api/wallet/updateBalance/${referrerUsername}`,
      { balance: 5000 + response1.data.balance }
    );

    console.log(response2.data);
  } catch (error) {
    console.error(error);
  }
});

async function getTransactionDetails(transactionHash: any) {
  try {
    const transaction = await web3.eth.getTransaction(transactionHash);
    if (!transaction) {
      console.error('Transaction not found');
      return null; // Return null explicitly to indicate absence of a transaction
    }
    console.log("------>", transaction)
    return transaction;
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
}
function decodeInputData(inputData: any) {
  // Assuming inputData starts with the method ID for 'transfer', which is 'a9059cbb'
  const recipientAddress = '0x' + inputData.slice(34, 74);
  const amountHex = inputData.slice(74);
  const amount = BigInt(`0x${amountHex}`);

  return { recipientAddress, amount };
}

const app = express();
app.use(cors());
app.use(express.json());

app.post("/joinTG", (req: any, res: any) => {
  console.log("---request---", req.body["username"]);
  const username = req.body["username"];
  console.log("--//---USER_NAME----//---", username);
  console.log("--//---USER_ID----//---", USER_ID);
  // Check if the user is already joined group
  bot
    .getChatMember(groupId, USER_ID)
    .then(async (member: any) => {
      if (member.status !== "left" && member.status !== "kicked") {
        console.log("💪 You will gain 1000 coins!");
        try {
          await axios.post(
            `https://localhost:5000/api/earnings/add`,
            { username: username }
          );
          axios.post(
            `https://localhost:5000/api/earnings/update/joinTelegram/${username}`,
            { status: true, earned: false }
          );
          res.status(200).json({ message: "ok", username: username });
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        res
          .status(400)
          .json({ message: "you are not in group now", username: username });
      }
    })
    .catch((error: any) => {
      console.error("Error checking chat member:", error);
      res
        .status(404)
        .json({ message: "Error checking chat member", username: username });
    });

  // res.json({ message: "ok", username : username });
});

app.post("/joinTC", (req: any, res: any) => {
  console.log("---request---", req.body["username"]);
  const username = req.body["username"];
  console.log("--//---USER_ID----//---", USER_ID);

  bot
    .getChatMember(channelID, USER_ID)
    .then(async (member: any) => {
      if (member.status !== "left" && member.status !== "kicked") {
        console.log("💪 You will gain 1000 coins!");
        try {
          await axios
            .post(
              `https://localhost:5000/api/earnings/add`,
              {
                username: username,
              }
            )
            .then(() => {
              axios.post(
                `https://localhost:5000/api/earnings/update/subscribeTelegram/${username}`,
                {
                  status: true,
                  earned: false,
                }
              );
            });

          res.status(200).json({ message: "ok", username: username });
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        res
          .status(400)
          .json({ message: "you are not in group now", username: username });
        console.log("🤔 you are not in group now");
      }
    })
    .catch((error: any) => {
      console.error("Error checking chat member:", error);
      res
        .status(404)
        .json({ message: "Error checking chat member", username: username });
    });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
