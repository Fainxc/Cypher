const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    UserId: { type: String },
    GuildId: { type: String },
    Logs: { type: Number },
    RequiredLogs: { type: Number },
})


module.exports = mongoose.model("QuotaData", Schema)