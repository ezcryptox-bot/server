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
    type: {
        type: String
    },
    transaction: {
        type: Object,
        required: true
    },
}, { timestamp : true})

module.exports = mongoose.model('transaction', Userschema)