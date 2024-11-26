const mongoose = require('./db');

const PatreonUserSchema = new mongoose.Schema({
    discordUserId: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    premiumStatus: { type: Boolean, required: true, default: false },
    tier: { type: String, required: false },
    updatedAt: { type: Date, default: Date.now },
});

const PatreonUser = mongoose.model('PatreonUser', PatreonUserSchema);
module.exports = PatreonUser;
