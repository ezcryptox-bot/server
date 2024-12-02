const profileRoute = require('./api/profile.route');

const routeManager = (app) => {
    // API Routes
    app.use("/api/profile", profileRoute);
}

module.exports = routeManager