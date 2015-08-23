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

            this.originalRun = this.runSpeed;
            this.originalWalk = this.walkSpeed;

            this.zombieGroup = options.zombieGroup;
            this.slimeGroup = options.slimeGroup;

            this.slimedEnemies = options.slimedEnemies;
            this.slimed = false;

            this.sprite = this.group.create(this.startX, this.startY, 'baddie');
            this.sprite.enemy = this;
            this.sprite.body.collideWorldBounds = true;
            this.sprite.frame = 0;

            this.onSlime = null;
            this.delayedRunVelocity = null;
        },

        update: function update() {
            if (this.slimed) { return; }

            this.game.physics.arcade.overlap(this.sprite, this.slimeGroup,
                    function(worker, slime) { this.onSlime = slime; },
                    null, this);

            if (this.onSlime && !this.stillOnSlime()) {
                this.onSlime = null;
            }

            if (this.onSlime) {
                this.runSpeed = Math.floor((this.originalRun*2)/3);
                this.walkSpeed = Math.floor((this.originalWalk*2)/3);
            } else {
                this.runSpeed = this.originalRun;
                this.walkSpeed = this.originalWalk;
            }

            if (this.player) {
                var toPlayer = Phaser.Point.subtract(
                        this.player.body.position,
                        this.sprite.body.position);

                // If you're in range, run at the player!
                if (toPlayer.getMagnitude() < Constants.LAB_WORKER_TRIGGER) {
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
        },

        stillOnSlime: function stillOnSlime() {
            return this.game.physics.arcade.intersects(this.sprite.body,
                    this.onSlime.body);
        },

        beSlimed: function() {
            var frame = this.sprite.frame;
            this.group.remove(this.sprite);
            this.sprite.kill();

            var slimeZombie = new SlimeZombie({
                game: this.game,
                group: this.zombieGroup,
                runSpeed: Constants.SLIME_ZOMBIE_RUN,
                walkSpeed: Constants.SLIME_ZOMBIE_WALK,
                x: this.sprite.position.x,
                y: this.sprite.position.y,
                frame: frame
            });
        }

    });
});
