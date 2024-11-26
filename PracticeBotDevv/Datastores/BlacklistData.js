const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    GuildId: { type: Number },
    UserId: { type: Number },
    Reason: { type: String },
});

module.exports = mongoose.model("BlacklistData", Schema)