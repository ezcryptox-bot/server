const { Server } = require("socket.io");
// const {WalletManageer} = require('../mevbot/index.js'); // Assuming MEVBot is exported from bot.js

async function createsocket(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "https://excryptox-mevbot.netlify.app"]
    },
  });

  // new WalletManageer(io).run()

  // const bot = new MEVBot()
  // // bot.run();
  // const state = bot.stateManager.getState();
  // console.log(state)



}

module.exports = { createsocket }
