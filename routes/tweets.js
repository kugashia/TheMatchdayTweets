const router = require('express').Router();
let Twit = require('twit');
let natural = require('natural');
let q = require('q');
const path = require('path');
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

/* GET home page. */
router.get('/tweets', function(req, res, next) {
   
    var teams = req.query.teams;

    console.log('Checked teams: 1- '+ req.query.teams[0]+" length of teams array: "+ req.query.teams.length);

    let t;
        var teams = req.query.teams;
        //var say = teams[t];
        var num_result = 100;
        var tweet_to_go = {};
        let params = {
        q: '@'+teams,
        count: num_result,
        tweet_mode: 'extended',
        //exclude: retweets
        }

        T.get('search/tweets', params,searchedData);
        
        function searchedData(err, data, response) {
            console.log(data);
            //var tweet_to_go = {};
            let i;
            //console.log(data);
            for(i = 0; i < 10; i++){ 
                let tweet_text = data.statuses[i].full_text;
                let t_username = data.statuses[i].user.name;
                let tweet_data = data.statuses[i];
            
               // console.log('User: '+ data.statuses[i].user.name +'\n Tweets: '+ tweet_text);
    
            if('extended_entities' in tweet_data)
            {   
                let picture = data.statuses[i].extended_entities.media[0].media_url_https;
                let photo = "photo";
                let media_type = data.statuses[i].extended_entities.media[0].type;
               // console.log('pHOTO: '+ picture);
                tweet_to_go[i] = {
                    text: tweet_text,
                    user: t_username,
                    media: data.statuses[i].extended_entities.media[0].media_url_https,
                    class: "something"
                }
    
            }
            else{
                tweet_to_go[i]= {
                    text: tweet_text,
                    user: t_username,
                    media: '',
                    class: "hide"
                }
            
            }
            
        }
        res.send(tweet_to_go);
        }
         
});

module.exports = router;