define([
    'Engine',
    'EndScreen'
], function(
    Engine,
    EndScreen
) {

    var game = new Phaser.Game(32 * 20, 32 * 20, Phaser.AUTO, '');

    var engine = new Engine();

    var makeEndScreen = function(options) {
        return {
            init: function() {
                console.log('in EndScreen init ' + options);
                this.message = options.message;
            },
            create: function() {
                this.background = this.game.add.tileSprite(0, 0, 
                        this.game.width, this.game.height,
                        'util_tiles', 3);

                var t = this.game.add.text(this.game.width/2, this.game.height/2,
                        this.message);
                t.anchor.set(0.5);
                this.game.input.keyboard.addCallbacks(this, 
                        null, null, this.restart);
            },
            restart: function() {
                this.game.state.start('main');
            }
        };
    };

    //var win = new EndScreen({message: "You Win!"});
    //var lose = new EndScreen({message: "You Lose..."});
    var win = makeEndScreen({message: "You Win!"});
    var lose = makeEndScreen({message: "You Lose..."});

    console.log(win.message);

    game.state.add('main', engine);
    game.state.add('win', win);
    game.state.add('loss', lose);
    game.state.start('main');

});
