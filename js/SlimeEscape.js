define([
    'Engine',
    'Sprite'
], function(
    Engine,
    Sprite
) {

    var game = new Phaser.Game(800, 800, Phaser.AUTO, '');

    var engine = new Engine();

    game.state.add('main', engine);
    game.state.start('main');

});
