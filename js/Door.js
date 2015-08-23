define([
    'Position'
], function(
    Position
) {

    return Position.extend({
        setup: function(options) {
            Position.prototype.setup.apply(this, arguments);
            this.sprite = this.game.add.sprite(this.startX, this.startY, 'util_tiles', 1)
            this.game.physics.arcade.enable(this.sprite);
        }
    });
});
