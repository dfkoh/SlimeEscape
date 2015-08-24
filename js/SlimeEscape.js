define([
    'Engine',
    'EndScreen',
    'LoadAssets',
    'Script'
], function(
    Engine,
    EndScreen,
    LoadAssets,
    Script
) {

    var game = new Phaser.Game(32 * 20, 32 * 20, Phaser.AUTO, '');
    window.game = game;

    var INTRO_SCRIPT = [
        ["Deep inside a government facility\nin an undisclosed location...", 1500],
        ["An experiment gone horribly wrong\nrampages through the laboratory...", 2000],
        ["The monster spread toxic waste\nthroughout the lab.", 500],
        ["And transformed the workers who\ndared approach too close.", 1000],
        ["Now you, intrepid janitor,\nmust catch the monster!", 2000]
    ];

    var ENDING_SCRIPT = [
        ["Janitor: Ha, I finally caught you!", 1300],
        ["Slime: Where did you come from?", 1000],
        ["Janitor: I followed you from lab 32J.", 1000],
        ["Slime: What do you want?", 1200],
        ["Janitor: Oh, I noticed you dropped\nyour keys in the elevator.", 2000],
        ["Slime: Ah, I was wondering\nwhere those went.", 1300],
        ["Slime: Thanks!", 500],
        ["Janitor: Long day at work?", 1000],
        ["Slime: Yeah, first I messed up\nmy experiment, and then I had\nto slime a whole bunch of people\non my way out.", 2500],
        ["Janitor: Mondays, am I right?", 2000],
        ["Slime: Yeah.", 500],
        ["Janitor: Anyway, have a good night!", 1200],
        ["Slime: You too. Thanks again!", 3000]
    ];


    var loading = new LoadAssets({startState: 'intro'});
    var intro = new Script({nextState: 'level1', script: INTRO_SCRIPT});
    var ending = new Script({nextState: 'win', script: ENDING_SCRIPT});
    var win = new EndScreen({message: "You Win!"});
    var lose = new EndScreen({message: "You Lose..."});

    var level1 = new Engine({
        mapName: 'level1',
        winState: 'level2'
    });
    window.level1 = level1;

    var level2 = new Engine({
        mapName: 'level2',
        winState: 'level3'
    });

    var level3 = new Engine({
        mapName: 'level3',
        winState: 'level4'
    });

    var level4 = new Engine({
        mapName: 'level4',
        winState: 'ending'
    });


    game.state.add('loading', loading);
    game.state.add('intro', intro);
    game.state.add('level1', level1);
    game.state.add('level2', level2);
    game.state.add('level3', level3);
    game.state.add('level4', level4);
    game.state.add('ending', ending);
    game.state.add('win', win);
    game.state.add('loss', lose);
    game.state.start('loading');

});
