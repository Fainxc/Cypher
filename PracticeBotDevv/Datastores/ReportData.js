const mongoose = require("mongoose");


const CurrencySchema = new mongoose.Schema({
    GuildId: { type: String },
    ChannelId: { type: String },
})


module.exports = mongoose.model("ReportData", CurrencySchema)