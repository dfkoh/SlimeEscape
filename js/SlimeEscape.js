define([
    'Engine',
    'Sprite'
], function(
    Engine,
    Sprite
) {

    var game = new Phaser.Game(32 * 20, 32 * 20, Phaser.AUTO, '');

    var engine = new Engine();

    var loseScreen = {
        create: function() {
            this.background = this.game.add.tileSprite(0, 0, 
                    this.game.width, this.game.height,
                    'util_tiles', 3);
            
            var t = this.game.add.text(this.game.width/2, this.game.height/2,
                    "You Lose");
            t.anchor.set(0.5);
            this.game.input.keyboard.addCallbacks(this, 
                    null, null, this.restart);
        },
        restart: function() {
            this.game.state.start('main');
        }
    }

    game.state.add('main', engine);
    game.state.add('loss', loseScreen);
    game.state.start('main');

});
