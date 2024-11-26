const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    AdminIds: { type: String },
    NotableIds: { type: String },
    ContributorIds: { type: String },
    DeveloperIds: { type: String },
    OwnerIds: { type: String },

})


module.exports = mongoose.model("AdminData", Schema)