const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routeManager = require('./routes/route.manager.js')
const { createsocket } = require("./socket");
const { createServer } = require("node:http");


// ============ Initilize the app ========================
require("dotenv").config();
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const server = createServer(app);
async function main() {
    createsocket(server);
}
main();


// ============================= Landing home server =======================
app.get("/", (req, res) => {
    res.send("Welcome to Mevbot backend server");
})

app.use(express.text());

// application routes
routeManager(app)
 
app.use(function (err, req, res, next) {
    res.status(500).json({
        status: false,
        code: 500,
        error: `Can't find ${err.stack}`
    });
});

// 404 handler
app.use(function (req, res, next) {
    res.status(404).json({
        status: false,
        code: 404,
        error: `Can't find ${req.originalUrl}`
    });
});

mongoose.set('strictQuery', false);
//   const dbUri = `mongodb+srv://highscoreteh:AoUXugCyZEfpBmMx@cluster0.xmpkpjc.mongodb.net/mevbot?retryWrites=true&w=majority`
const dbUri = `mongodb://localhost:27017/mevbot`;
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Database connected'))
    .catch((err) => console.log(err))
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log("Running on port " + PORT)
})