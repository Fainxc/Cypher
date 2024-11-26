const mongoose = require("mongoose");


const Schema = new mongoose.Schema({
    GuildId: { type: Number },
    UserId: { type: Number },
    Currency: { type: Number }
})

module.exports = mongoose.model("CurrencyData", Schema)