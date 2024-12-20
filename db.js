const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.mongoURL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

module.exports = mongoose;
