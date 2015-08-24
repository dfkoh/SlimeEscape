define([
    'Position',
    'Constants'
], function(
    Position,
    Constants
) {

    return Position.extend({

        setup: function(options) {
            Position.prototype.setup.apply(this, arguments);

            this.runSpeed = options.runSpeed || Constants.ENEMY_RUN;
            this.walkSpeed = options.walkSpeed || Constants.ENEMY_WALK;
            this.player = options.player || null;
            this.group = options.group;
            this.level = options.level;
        },

        onRun: function onRun(toPlayer) {
            toPlayer.normalize();
            var vx = toPlayer.x;
            var vy = toPlayer.y;

            if (Math.abs(vx) > Math.abs(vy)) {
                if (vx > 0) {
                    this.direction = Constants.DIRECTION.RIGHT;
                } else {
                    this.direction = Constants.DIRECTION.LEFT;
                }
            } else {
                if (vy > 0) {
                    this.direction = Constants.DIRECTION.DOWN;
                } else {
                    this.direction = Constants.DIRECTION.UP;
                }
            }

            this.sprite.frame = this.direction;

            var collision = false;
            if ((toPlayer.x < 0 && this.isColliding('left')) ||
                    (toPlayer.x > 0 && this.isColliding('right'))) {
                toPlayer.x = 0;
                collision = true;
            }
            if ((toPlayer.y < 0 && this.isColliding('up')) ||
                    (toPlayer.y > 0 && this.isColliding('down'))) {
                toPlayer.y = 0;
                collision = true;
            }

            toPlayer.setMagnitude(this.runSpeed);

            /**
             * Crazy hack to keep enemies from vibrating when there's
             * a wall between you and them. If something is crazy
             * glitchy, this is probably why. Here's the logic:
             *
             * If you're colliding with one wall but not the other,
             * and your last update velocity is almost exactly opposite
             * your current velocity, then just don't move.
             */
            if (this.delayedRunVelocity) {
                var delayedAdd = Phaser.Point.add(
                    this.delayedRunVelocity,
                    this.sprite.body.velocity);

                if (collision && (toPlayer.x || toPlayer.y) &&
                    delayedAdd.getMagnitude() < Constants.ANTI_VIBRATE_THRESHOLD) {
                    // Don't move, you would be vibrating otherwise
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = 0;

                } else {
                    this.sprite.body.velocity = toPlayer;
                    this.delayedRunVelocity = this.sprite.body.velocity;
                }

            } else {
                this.sprite.body.velocity = toPlayer;
                this.delayedRunVelocity = this.sprite.body.velocity;
            }
         },

        onWalk: function onWalk() {
            if (!this.direction || this.isColliding() ||
                this.sprite.body.prev.equals(this.sprite.body.position)) {
                this.changeDirection();
            }

            switch (this.direction) {
                case Constants.DIRECTION.LEFT:
                    this.sprite.body.velocity.x = -this.walkSpeed;
                    this.sprite.body.velocity.y = 0;
                    break;
                case Constants.DIRECTION.RIGHT:
                    this.sprite.body.velocity.x = this.walkSpeed;
                    this.sprite.body.velocity.y = 0;
                    break;
                case Constants.DIRECTION.DOWN:
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = this.walkSpeed;
                    break;
                case Constants.DIRECTION.UP:
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = -this.walkSpeed;
                    break;
            }

            this.sprite.frame = this.direction;
        },

        changeDirection: function() {
            var direction,
                availableDirections = [];

            for (var directionName in Constants.DIRECTION) {
                if (directionName === "NONE") {
                    continue;
                }

                direction = Constants.DIRECTION[directionName];
                if (!this.isColliding(Constants.DIRECTION_STR[direction])) {
                    availableDirections.push(direction);
                }
            }

            if (availableDirections.length > 2) {
                var index = Math.floor(Math.random() * availableDirections.length);
                this.direction = availableDirections[index];
            } else if (availableDirections.length === 1) {
                this.direction = availableDirections[0];
            }
        },

        isColliding: function isColliding(direction) {
            direction = direction || Constants.DIRECTION_STR[this.direction];

            if (!this.sprite || !this.sprite.body) {
                return false;
            }

            if (this.sprite.body.blocked[direction]) {
                return true;
            }
        },

        beSlimed: function() {
            // no-op, override this for slime functionality
        },

        caughtPlayer: function() {
            this.game.state.start(this.level);
        }

    });
});
