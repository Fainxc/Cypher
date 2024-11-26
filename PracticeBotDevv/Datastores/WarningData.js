const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    GuildId: { type: String },
    UserId: { type: String },
    Reason: { type: String },
});

module.exports = mongoose.model("WarningData", Schema)