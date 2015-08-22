define([
    'Base',
], function(
    Base
) {
    return Base.extend({
        init: function(options) {
            console.log('in EndScreen init ' + options + ' ' + arguments);
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
    });
});

