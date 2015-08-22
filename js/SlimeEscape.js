define([
    'Engine',
    'EndScreen'
], function(
    Engine,
    EndScreen
) {

    var game = new Phaser.Game(32 * 20, 32 * 20, Phaser.AUTO, '');

    var engine = new Engine();

    var win = new EndScreen({message: "You Win!"});
    var lose = new EndScreen({message: "You Lose..."});

    game.state.add('main', engine);
    game.state.add('win', win);
    game.state.add('loss', lose);
    game.state.start('main');

});
