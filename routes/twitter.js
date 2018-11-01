const router = require('express').Router();
const mongoose = require('mongoose');
let Twit = require('twit');
let natural = require('natural');
let q = require('q');
const path = require('path');
var mongoDB = require('../config/db');

let listen = require('../models/io').listen;

const Tweets = require('../models/Tweets');
const keys = require('../config/keys');
const Pusher = require('pusher');
let Analyzer = natural.SentimentAnalyzer;
let stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
let tokenizer = new natural.WordTokenizer();
//let tweet_to_go = [{}];


let T = new Twit({
    consumer_key: 'wYQhPXqScu3tkeZckC30HeKi6',
    consumer_secret: '8iQ09NHpttVmuEGyX50mDpuhy4tlV82v7bdtRNalVoeBpQ960i',
    access_token: '2733425926-NIg3PBBrkv9QkFSpIF8kzvfAmvWlbRaj01zscDu',
    access_token_secret: '1MQzrB7ripK2Ff923TdVkXQMVGE7Hujmyt53KiYce7jaa'
});

function similarity_check(tweet_to_go, tweet_text){

    if(Object.keys(tweet_to_go).length >= 1){
        var ii;

        for(ii = 0; ii < Object.keys(tweet_to_go).length-1; ii++){
            if(!tweet_to_go[ii].text.localeCompare(tweet_text)){
                return false;
            }
        }
        return true;
    }
    else{
        return true;
    }

}

let run_sentiment = (data) => {
    return new Promise((resolve) => {
        let tweets = new Array();
        for (let i = 0; i < data.length; i++) {
            let tweet = new Object();
            tweet.text = data[i].text;
            tweet.sentiment = analyzer.getSentiment(tokenizer.tokenize(tweet.text));
            tweets.push(tweet);
        }

        console.log(typeof tweets);
        resolve(tweets);
    });
}


/* GET home page. */
router.get('/tweets', function(req, res, next) {

        var team = req.query.teams;
        console.log('TEAMMMMM: '+team);
        let params = {
            q: '@'+team,
            count: 100,
            tweet_mode: 'extended',
        }

        T.get('search/tweets', params,searchedData);
        
        function searchedData(err, data, response) {

            if (err) {
                console.log(err);
                res.status(500).end();
            } else {
                  
                filter(data).then((filteredTweets) => {
                    uploadToDB(team, filteredTweets).then(() =>  res.send({success: true, message: 'db done for'+ team,team: team}));
                }).then(() => {
                    if (!(JSON.parse(req.query.listen))) {
                        listen(team);
                    } 
                }).catch((err) => console.log('catched'));;
            } 
        }
         
});

module.exports.getDB = (team) => {
    return mongoDB.db.collection('tweets').findOne({key: team}).then((data) => { return run_sentiment(data.tweets) });
}

let filter = (data) => {
    return new Promise((resolve) => {
        let tweets = new Array();
        for (let i = 0; i < data.statuses.length; i++) {
            let tweet = new Object();
            tweet.text = data.statuses[i].full_text;
            tweets.push(tweet);
        }
        resolve(tweets);
    })
}

let uploadToDB = (team, filteredTweets) => {

    let DB = mongoDB.db.collection('tweets');

    return new Promise((resolve, reject) =>{    
        DB.findOne({key: team}, (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                res.status(500).end();
                } else if (data) {
                    resolve(DB.updateOne({key: team}, {$push: {'tweets': {$each: filteredTweets}}}));
                    console.log('data for team updated');
                } else {
                    console.log('data for team inserted');
                    let dbTweets = {
                        key: team,
                        tweets: filteredTweets
                    }
                    resolve(DB.insertOne(dbTweets));
                }
            });
        });
}

module.exports.router = router;
