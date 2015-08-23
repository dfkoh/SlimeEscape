define([
    'Enemy',
    'SlimeZombie',
    'Constants'
], function(
    Enemy,
    SlimeZombie,
    Constants
) {

    return Enemy.extend({

        setup: function(options) {
            Enemy.prototype.setup.apply(this, arguments);

            this.sprite = this.group.create(this.startX, this.startY,
                    'slimed_baddie');

            this.sprite.enemy = this;
            this.sprite.body.collideWorldBounds = true;
            this.sprite.frame = options.frame || Constants.DIRECTION.NONE;
            this.delayedRunVelocity = null;
        },

        update: function update() {
            if (this.player) {
                var toPlayer = Phaser.Point.subtract(
                        this.player.body.position,
                        this.sprite.body.position);

                // If you're in range, run at the player!
                if (toPlayer.getMagnitude() < Constants.SLIME_ZOMBIE_TRIGGER) {
                    this.onRun(toPlayer);
                } else {
                // If you're out of range, just wander around
                    this.onWalk();
                }

                this.game.physics.arcade.overlap(this.player, this.sprite,
                        this.caughtPlayer, null, this);

            } else {
                this.onWalk();
            }
        }

    });
});
