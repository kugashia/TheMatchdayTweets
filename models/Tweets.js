const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const TweetSchema = new Schema({
    txt: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        required: false
    }
});

const Tweets = mongoose.model('tweets', TweetSchema);

module.exports = Tweets;