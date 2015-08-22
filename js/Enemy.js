define([
    'Base'
], function(
    Base
) {
    var BADDIE_SPEED = 300;
    return Base.extend({

        setup: function(options) {
            this.game = options.game;
            this.player = options.player;
            this.startX = options.x;
            this.startY = options.y;
            this.group = options.group;

            this.create();
        },

        create: function() {
            this.sprite = this.group.create(this.startX, this.startY, 'baddie');
            this.sprite.body.collideWorldBounds = true;
        },

        update: function() {
            var toPlayer = Phaser.Point.subtract(
                    this.player.body.position,
                    this.sprite.body.position);
            this.sprite.body.velocity = toPlayer
                .normalize().setMagnitude(BADDIE_SPEED);

            this.game.physics.arcade.overlap(this.player, this.sprite,
                    this.caughtPlayer, null, this);
        },

        caughtPlayer: function() {
            this.game.state.start('loss');
        }
    });
});
