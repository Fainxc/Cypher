const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    Staff: { type: String },
    Verified: { type: String },
    Contributor: { type: String },
    Notable: { type: String },
    Trusted: { type: String },
    HalloweenBadge: { type: String },

})


module.exports = mongoose.model("BadgesData", Schema)