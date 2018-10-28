async function btnClicked() {    
    var teams= [];
    $.each($("input[name='team']:checked"),async function(){            
        teams.push($(this).val());

    let n;
    let t;
    for(n = 0; n < 1; n++){
    $.ajax({
        type: "GET",
        url: "/tweets",
        data: {
            teams: $(this).val(),
            //teams: teams
            //team2: input2
        },
        success: (tweet_to_go) => {
           //("#tweetsTable").html("");
           var i;
            $.each(tweet_to_go.tweet, function(i,tweeets){
               // var j = i+1;
                 $('#tweet_text').append('<li>'+' '+ tweeets.txt + '</li>'+'<hr>');
            })
            console.log(tweet_to_go);
            
             
        },
        error: (err) => {
            console.log(err);
        }
    })

    await sleep(1000);
    }
});
//await sleep(1000);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }