define([
    'Base',
], function(
    Base
) {
    var FONT_STYLE = {
        font: 'jupiter crash',
        fontSize: '42px'
    };

    return Base.extend({
        setup: function(options) {
            this.message = options.message;
            this.subtext = options.subtext || null;
            this.callback = options.callback || this.restart;
        },

        create: function() {
            this.background = this.game.add.tileSprite(0, 0,
                    this.game.width, this.game.height,
                    'util_tiles', 3);

            var t = this.game.add.text(this.game.width/2, this.game.height/2,
                    this.message, FONT_STYLE);
            t.anchor.set(0.5);

            if (this.subtext) {
                var substyle = {
                    font: FONT_STYLE.font,
                    fontSize: '28px'
                }
                var subtext = this.game.add.text(
                        this.game.width/2, this.game.height/2 + 50,
                        this.subtext, substyle);
                subtext.anchor.set(0.5);
            }

            this.game.input.keyboard.addCallbacks(this,
                    null, null, this.callback);
        },

        restart: function() {
            this.game.state.start('level1');
        }
    });
});

