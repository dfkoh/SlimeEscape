define([
    'Base'
], function(
    Base
) {
    var BADDIE_SPEED = 300;
    return Base.extend({

        init: function(options) {
            this.game = options.game;
            this.player = options.player;
            this.startX = options.x;
            this.startY = options.y;
        },

        create: function() {
            this.sprite = this.game.add.sprite(this.startX, this.startY,
                    'baddie');
            this.game.physics.arcade.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;
        },

        update: function() {
            var toPlayer = Phaser.Point.subtract(
                    this.player.body.position,
                    this.sprite.body.position);
            this.sprite.body.velocity = toPlayer
                .normalize().setMagnitude(BADDIE_SPEED);
        }
    });
});
