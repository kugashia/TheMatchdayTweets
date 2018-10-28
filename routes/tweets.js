const router = require('express').Router();
const mongoose = require('mongoose');
let Twit = require('twit');
let natural = require('natural');
let q = require('q');
const path = require('path');

const Tweets = require('../models/Tweets');
const keys = require('../config/keys');
const Pusher = require('pusher');
let Analyzer = natural.SentimentAnalyzer;
let stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
let tokenizer = new natural.WordTokenizer();
//let tweet_to_go = [{}];

var pusher = new Pusher({
    appId: keys.pusherAppId,
    key: keys.pusherKey,
    secret: keys.pusherSecret,
    cluster: keys.pusherCluster,
    encrypted: keys.pusherEncrypted
});

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
/* GET home page. */
router.get('/tweets', function(req, res, next) {

    //console.log('Checked teams: 1- '+ req.query.teams[0]+" length of teams array: "+ req.query.teams.length);
        var teams = req.query.teams;
        var num_result = 1;
        var tweet_to_go = new Object;
        
        let params = {
        q: '@'+teams,
        count: num_result,
        tweet_mode: 'extended',
        }

        T.get('search/tweets', params,searchedData);
        
        function searchedData(err, data, response) {
 
            let i;
            let tracker_index = 0;
            //console.log(data);
            for(i = 0; i < num_result; i++){ 
                let tweet_text = data.statuses[i].full_text;
                let t_username = data.statuses[i].user.name;
                let tweet_data = data.statuses[i];

            //If Tweetalready existsor not
            var notSimilar = similarity_check(tweet_to_go, tweet_text);
            
            if(notSimilar){
                let newTweet = {
                    txt: tweet_text,
                    team: teams,
                    sentiment: 3
                }
                new Tweets(newTweet).save().then(tweet => {
                    pusher.trigger('matchday-tweets','team-sentiment',{
                        txt: tweet.txt,
                        team: tweet.team,
                        sentiment: parseInt(tweet.sentiment)
                    })
                })
            if('extended_entities' in tweet_data)
            {   
                let picture = data.statuses[i].extended_entities.media[0].media_url_https;
                let photo = "photo";
                let media_type = data.statuses[i].extended_entities.media[0].type;
               // console.log('pHOTO: '+ picture);
                tweet_to_go[tracker_index] = {
                    text: tweet_text,
                    user: t_username,
                    media: data.statuses[i].extended_entities.media[0].media_url_https,
                    class: "something"
                }
    
            }
            else{
                tweet_to_go[tracker_index]= {
                    text: tweet_text,
                    user: t_username,
                    media: '',
                    class: "hide"
                }
            
            }
            tracker_index = tracker_index + 1;
        }

        }
         Tweets.find().then(tweet => res.json({ success: true, tweet: tweet }));
         //res.send(tweet_to_go);
        }
         
});


module.exports = router;