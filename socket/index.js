const { Server } = require("socket.io");
const {MEVBot} = require('../mevbot/index.js'); // Assuming MEVBot is exported from bot.js

async function createsocket(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://excryptox-mevbot.netlify.app"]
    },
  });



  const bot = new MEVBot()
  bot.run_(io);

}

module.exports = { createsocket }
