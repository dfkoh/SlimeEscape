define([
    'Player',
    'Constants'
], function(
    Player,
    Constants
) {

    var MOVE_SPEED = 200;
    var SLIME_MOVE_SPEED = 100;

    return Player.extend({

        setup: function(options) {
            Player.prototype.setup.apply(this, arguments);

            this.enemies = options.enemies;
            this.slimeGroup = options.slimeGroup;
            this.onSlime = false;

            this.sprite = this.game.add.sprite(this.startX, this.startY, 'dude');
            this.game.physics.arcade.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;
        },

        update: function() {
            var moveSpeed = MOVE_SPEED;
            if (this.onSlime) {
                moveSpeed = SLIME_MOVE_SPEED;
            }

            Player.prototype.update.apply(this, [moveSpeed]);
        }

    });

});
