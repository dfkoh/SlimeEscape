define([
    'Engine',
    'Sprite'
], function(
    Engine,
    Sprite
) {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

    var engine = new Engine();
    var sprite = new Sprite();

    game.state.add('main', engine);
    game.state.start('main');

});
