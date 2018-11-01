const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const TweetSchema = new Schema({
    text: {
        type: String,
    },
    sentiment: {
        type: String,
    }
});

const TeamSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    tweets: TweetSchema
})

const Tweets = mongoose.model('tweets', TeamSchema);

module.exports = Tweets;