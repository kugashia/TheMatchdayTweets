var socket = io();
let i = 0;
var teams= [];
let datapoints = [];
function btnClicked() {
    
    //let input = $("#input").val();
    //let input2 = $("#input2").val();
    //var checked_teams = $('')
    $('#main_cont').html('');

$.each($("input[name='team']:checked"), function(){            
        teams.push($(this).val());
        team1 = $(this).val();
        datapoints.push({label:$(this).val(), y:0});
    $.ajax({
        type: "GET",
        url: "/tweets",
        data: {
            teams: $(this).val(),
            listen: true
        },
        success: (msg) => {
            console.log('This is the msg.team: '+ msg.team);
            socket.emit('listner',{myteam: msg.team});

            console.log('Team from user side: '+ msg.team);
            var id = msg.team;
            i = i+1;
           $('#main_cont').append("<div id="+id+" style=\"overflow:scroll; height:400px;\">"+ id +'</div>');

        },
        error: (err) => {
            console.log(err);
        }
    })
});

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function plot(tweets,dataPoints,avg_sentiment){

    let datapoints = dataPoints;
    $.each(datapoints, function(i,team){
        str_label = team.label;
        str_team = tweets.team;
        console.log("Team being compared in plot: "+str_team);
        if(!str_label.localeCompare(str_team)){
            team.y = avg_sentiment;
        }
   })
   console.log(dataPoints);
        const chartContainer = document.querySelector('#chartContainer');
        const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                data:[
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();
}

socket.on('tweets', (tweets) => {
    sentiment_sum = 0;
    $.each(tweets.tweets, function(i,tweet){

        $('#'+tweets.team).append('<p>'+'<font size="0">'+ tweet.text + '</font>'+'</p>'+'<hr>');
        sentiment_sum = sentiment_sum + tweet.sentiment;
     })
     console.log(tweets);
     console.log('Number of Tweets for '+tweets.team+'is: '+tweets.tweets.length);
     console.log('for'+tweets.team+' senti sum: '+ sentiment_sum);
     avg_sentiment = sentiment_sum/tweets.tweets.length;

     plot(tweets,datapoints,avg_sentiment);
});

socket.on('error', () => {
    console.log('error');
})