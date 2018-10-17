const router = require('express').Router();
let Twit = require('twit');
let natural = require('natural');
let q = require('q');
const path = require('path');
let Analyzer = natural.SentimentAnalyzer;
let stemmer = natural.PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
let tokenizer = new natural.WordTokenizer();

let T = new Twit({
    consumer_key: 'wYQhPXqScu3tkeZckC30HeKi6',
    consumer_secret: '8iQ09NHpttVmuEGyX50mDpuhy4tlV82v7bdtRNalVoeBpQ960i',
    access_token: '2733425926-NIg3PBBrkv9QkFSpIF8kzvfAmvWlbRaj01zscDu',
    access_token_secret: '1MQzrB7ripK2Ff923TdVkXQMVGE7Hujmyt53KiYce7jaa'
});

router.post('/tweets', function(req,res){
    console.log(req.body);
    let team_name = req.body.Team;
    let params = {
        q: '@'+team_name,
        count: 10
        } 
        
    T.get('search/tweets', params,searchedData);

    function searchedData(err, data, response) {
        var tweet_data = data.statuses[0];
        console.log(tweet_data);
        let i;
        let tweet_to_go = {};
        //var hashtags = data.statuses[0].entities.hashtags;
        
        for(i = 0; i < 10; i++){ 
            let tweet_text = data.statuses[i].text;
            let t_username = data.statuses[i].user.name;
            let tweet_data = data.statuses[i];
            //var t_user_color = data.statuses[0].user.profile-background_color;
            console.log('User: '+ data.statuses[i].user.name +'\n Tweets: '+ tweet_text);

        if('extended_entities' in tweet_data)
        {   //var media_length = data.statuses[0].extended_entities.media.length;
            console.log(data.statuses[0].extended_entities);
            let picture = data.statuses[i].extended_entities.media[0].media_url_https;
            let photo = "photo";
            let media_type = data.statuses[i].extended_entities.media[0].type;
            console.log('pHOTO: '+ picture);
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
        
        res.render(path.join(__dirname,'../views/main'),{
        tweet: tweet_to_go
    })
    
    }


})



/*
T.get('search/tweets', params,searchedData);

function searchedData(err, data, response) {
console.log(data);
var hashtags = data.statuses[0].entities.hashtags; 
var tweet_text = data.statuses[0].text;
var t_username = data.statuses[0].user.name;
//var t_user_color = data.statuses[0].user.profile-background_color;
console.log('User: '+ data.statuses[0].user.name +'\n Tweets: '+ tweet_text);

} 
*/

module.exports = router;