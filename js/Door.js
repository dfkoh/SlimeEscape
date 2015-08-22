define([
    'Base'
], function(
    Base
) {

    return Base.extend({

        setup: function(options) {
            this.game = options.game;
            this.startX = options.x;
            this.startY = options.y;

            this.create();
        },

        create: function() {
            this.sprite = this.game.add.sprite(this.startX, this.startY, 'util_tiles', 1)
            this.game.physics.arcade.enable(this.sprite);
        }
    });
});
