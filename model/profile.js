const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    email: {
        type: String,
        required: true,
        unique : true
    }, 
    userId: {
        type: String,
        required: true,
        unique : true
    }, 
    user: {
        type: Object,
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    profit:{
        type: Number,
        default: 0
    },
    isRunning: {
        type: Boolean,
        default: false
    },
    nextWithdraw: {
        type: Date,
        default: new Date()
    },
    walletAddress: {
        type: String,
    },
    is_2fa: {
        type: Boolean,
    },
    activities: {
        type: Array,
    },
    settings: {
        type: Object,
    },
    is_suspend: {
        type: Boolean,
    }
}, { timestamp : true})

module.exports = mongoose.model('profile', Userschema)