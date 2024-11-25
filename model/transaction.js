const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean
    },
    transaction: {
        type: Object,
        required: true
    },
}, { timestamp : true})

module.exports = mongoose.model('transaction', Userschema)