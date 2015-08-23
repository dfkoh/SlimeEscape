define([
    'Engine',
    'EndScreen',
    'LoadAssets'
], function(
    Engine,
    EndScreen,
    LoadAssets
) {

    var game = new Phaser.Game(32 * 20, 32 * 20, Phaser.AUTO, '');
    window.game = game;

    var loading = new LoadAssets({});
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
        mapName: 'level3'
    });

    game.state.add('loading', loading);
    game.state.add('level1', level1);
    game.state.add('level2', level2);
    game.state.add('level3', level3);
    game.state.add('win', win);
    game.state.add('loss', lose);
    game.state.start('loading');

});
