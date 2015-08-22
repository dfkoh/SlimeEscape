define([
    'Engine'
], function(
    Engine
) {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

    var engine = new Engine();

    game.state.add('main', engine);
    game.state.start('main');

});
