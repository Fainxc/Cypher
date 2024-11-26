const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    UserId: { type: Number },
    Reason: { type: String },
});

module.exports = mongoose.model("BotBlacklistsData", Schema)