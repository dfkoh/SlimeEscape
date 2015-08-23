define([
    'Position',
    'Constants'
], function(
    Position,
    Constants
) {
    var RUN_SPEED = 200,
        WALK_SPEED = 70,
        TRIGGER_DISTANCE = 200;

    return Position.extend({

        setup: function(options) {
            Position.prototype.setup.apply(this, arguments);

            this.player = options.player;
            this.group = options.group;
            this.slimed = false;

            this.sprite = this.group.create(this.startX, this.startY, 'baddie');
            this.sprite.enemy = this;
            this.sprite.body.collideWorldBounds = true;
            this.sprite.frame = 0;
        },

        update: function update() {
            if (this.slimed) { return; }

            var toPlayer = Phaser.Point.subtract(
                    this.player.body.position,
                    this.sprite.body.position);

            // If you're in range, run at the player!
            if (toPlayer.getMagnitude() < TRIGGER_DISTANCE) {
                this.onRun(toPlayer);
            } else {
            // If you're out of range, just wander around
                this.onWalk();
            }

            this.game.physics.arcade.overlap(this.player, this.sprite,
                    this.caughtPlayer, null, this);
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
                    this.direction = Constants.DIRECTION.UP;
                } else {
                    this.direction = Constants.DIRECTION.DOWN;
                }
            }

            this.sprite.frame = this.direction;

            if ((toPlayer.x < 0 && this.isColliding('left')) ||
                    (toPlayer.x > 0 && this.isColliding('right'))) {
                toPlayer.x = 0;
            }

            if ((toPlayer.y < 0 && this.isColliding('up')) ||
                    (toPlayer.y > 0 && this.isColliding('down'))) {
                toPlayer.y = 0;
            }

            this.sprite.body.velocity = toPlayer
                .setMagnitude(RUN_SPEED);
         },

        onWalk: function onWalk() {
            if (!this.direction || this.isColliding()) {
                this.changeDirection();
            }

            switch (this.direction) {
                case Constants.DIRECTION.LEFT:
                    this.sprite.body.velocity.x = -WALK_SPEED;
                    this.sprite.body.velocity.y = 0;
                    break;
                case Constants.DIRECTION.RIGHT:
                    this.sprite.body.velocity.x = WALK_SPEED;
                    this.sprite.body.velocity.y = 0;
                    break;
                case Constants.DIRECTION.DOWN:
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = WALK_SPEED;
                    break;
                case Constants.DIRECTION.UP:
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = -WALK_SPEED;
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
            return (
                this.sprite.body.blocked[direction] ||
                this.sprite.body.touching[direction]);
        },

        beSlimed: function() {
            var frame = this.sprite.frame;
            this.sprite.kill();
            this.sprite = this.game.add.sprite(
                    this.sprite.position.x, this.sprite.position.y,
                    'slimed_baddie');
            this.sprite.frame = frame;
            this.slimed = true;
        },

        caughtPlayer: function() {
            this.game.state.start('loss');
        }
    });
});
