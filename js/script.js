let team1 = 'team-1';
let team2 = 'team-2';
let tossTeam1 = '';
let tossTeam2 = '';
let liveMatchesArray = [];

//Live Score Variables
let liveScore = '';
let scoreIndicator = '';
let liveScoresTemplate = document.getElementById('liveScores');
let scoreIndicatorTemplate = document.getElementById('liveScoreIndicators');
let liveScoreStatus = 0;
let spinner = document.getElementById("spinner");

// for matches (upcoming and Recent)
$.post(`https://cricapi.com/api/matches?apikey=${apikey}`, function (response) {
    let matches = response.matches;
    let upcomingMatchesTemplate = document.getElementById("upcomingMatches");
    let upcomingMatchesIndicators = document.getElementById("upcomingMatchesIndicators");
    let upcomingMatches = '';
    let upcomingIndicator = '';
    let upcomingMatchesStatus = 0;

    let recentMatchesTemplate = document.getElementById("recentMatches");
    let recentMatchesIndicators = document.getElementById("recentMatchesIndicators");
    let recentMatches = '';
    let recentIndicator = '';
    let recentMatchesStatus = 0;



    matches.forEach(function (element, index) {
        if (upcomingMatchesStatus == 0) {
            upcommingStatus = "active";
        } else {
            upcommingStatus = "";
        }

        if (recentMatchesStatus == 0) {
            recentStatus = "active";
        } else {
            recentStatus = "";
        }

        if (element.matchStarted == false) {
            upcomingIndicator += `<li data-target="#upcomingMatchesSlider" data-slide-to="${upcomingMatchesStatus}" class="${status}"></li>`;
            upcomingMatches += `<div class="carousel-item ${upcommingStatus}" style="height: 350px;">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="text-center font-weight-bold">
                                    <span class="badge badge-warning">Upcoming Match</span>
                                </h3>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title text-center">${element[team1]}</h5>
                                <h4 class="text-center card-title">
                                    <span class="badge badge-danger">VS</span>
                                </h4>
                                <h5 class="card-title text-center">${element[team2]}</h5>
                                <p class="card-text text-center"><b>Starts on:- </b>${element.date}</p>
                            </div>
                        </div>
                    </div>`;

            upcomingMatchesStatus++;

        } else if (element.winner_team != undefined) {

            if (element.toss_winner_team == response[team1]) {
                tossTeam1 = '<i class="fab fa-bitcoin"></i>';
                tossTeam2 = '';
            } else {
                tossTeam2 = '<i class="fab fa-bitcoin"></i>';
                tossTeam1 = '';
            }

            recentIndicator += `<li data-target="#upcomingMatchesSlider" data-slide-to="${recentMatchesStatus}" class="${status}"></li>`;
            recentMatches += `<div class="carousel-item ${recentStatus}" style="height: 350px;">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="text-center font-weight-bold">
                                    <span class="badge badge-warning">Recent Match</span>
                                </h3>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title text-center">${element[team1]} ${tossTeam1}</h5>
                                <h4 class="text-center card-title">
                                    <span class="badge badge-danger">VS</span>
                                </h4>
                                <h5 class="card-title text-center">${element[team2]} ${tossTeam2}</h5>
                                <p class="card-text text-center"><b>Winner Team:- </b>${element.winner_team}</p>
                            </div>
                        </div>
                    </div>`;

            recentMatchesStatus++;

        } else {
            liveMatchesArray.push(element);

        }

    });

    liveCricketScore();

    upcomingMatchesIndicators.innerHTML = upcomingIndicator;
    upcomingMatchesTemplate.innerHTML = upcomingMatches;

    recentMatchesIndicators.innerHTML = recentIndicator;
    recentMatchesTemplate.innerHTML = recentMatches;
});

//for live scores
function liveCricketScore() {
    liveScore = '';
    scoreIndicator = '';
    liveScoreStatus = 0;

    if (liveMatchesArray != '') {
        liveMatchesArray.forEach(function (element) {
            $.post(`https://cors-anywhere.herokuapp.com/https://cricapi.com/api/cricketScore/`, {
                "unique_id": element.unique_id,
                "apikey": apikey
            }, function (response) {
                spinner.style.display = 'none';

                let score = response.score;
                score = score.split("v ");

                if (liveScoreStatus == 0) {
                    status = "active";
                } else {
                    status = "";
                }

                if (element.toss_winner_team == response[team1]) {
                    tossTeam1 = '<i class="fab fa-bitcoin"></i>';
                    tossTeam2 = '';
                } else {
                    tossTeam2 = '<i class="fab fa-bitcoin"></i>';
                    tossTeam1 = '';
                }

                scoreIndicator += `<li data-target="#liveScoresSlider" data-slide-to="${liveScoreStatus}" class="${status}"></li>`;
                liveScore += `<div class="carousel-item ${status}" style="height: 400px;">
                                <div class="card">
                                    <div class="card-header">
                                        <h3 class="text-center font-weight-bold">
                                            <span class="badge badge-warning">Live Scores</span>
                                        </h3>
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title text-center">${response[team1]} ${tossTeam1}</h5>
                                        <p class="card-text text-center">${score[0]}</p>
                                        <h4 class="text-center card-title">
                                            <span class="badge badge-danger">VS</span>
                                        </h4>
                                        <h5 class="card-title text-center">${response[team2]}  ${tossTeam2}</h5>
                                        <p class="card-text text-center">${score[1]}</p>
                                        <p class="card-text text-center">${response.stat}</p>
                                    </div>
                                </div>
                            </div>`;

                liveScoreStatus++;

                scoreIndicatorTemplate.innerHTML = scoreIndicator;
                liveScoresTemplate.innerHTML = liveScore;
            });

        });
    } else {
        spinner.style.display = 'none';
        let liveScoresSlider = document.getElementById('liveScoresSlider');
        msg = `<div class="jumbotron jumbotron-fluid rounded">
                <div class="container">
                    <h1 class="display-5 text-center"><span class="badge badge-danger">No Live Match!</span></h1>
                </div>
            </div>`;

        liveScoresSlider.innerHTML = msg;
    }
}

//Live Score after 1min
setInterval(() => {
    if (liveMatchesArray != '') {
        liveCricketScore();
    }
}, 60000);


