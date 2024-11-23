const profileRoute = require('./api/profile.route');
// const { handleWebHook } = require("../services/ccpayment.service");

const routeManager = (app) => {
    // API Routes
    // app.use('/webhook', handleWebHook)
    app.use("/api/profile", profileRoute);
}

module.exports = routeManager