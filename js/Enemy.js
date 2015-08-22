define([
    'Base'
], function(
    Base
) {
    var RUN_SPEED = 200,
        WALK_SPEED = 70,
        TRIGGER_DISTANCE = 200,
        DIRECTIONS = ['left', 'right', 'up', 'down'];

    return Base.extend({

        setup: function(options) {
            this.game = options.game;
            this.player = options.player;
            this.startX = options.x;
            this.startY = options.y;
            this.group = options.group;
            this.direction = null;

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

            // If you're in range, run at the player!
            if (toPlayer.getMagnitude() < TRIGGER_DISTANCE) {
                this.sprite.body.velocity = toPlayer
                    .normalize().setMagnitude(RUN_SPEED);

            // If you're out of range, just wander around
            } else {

                if (!this.direction || this.isColliding()) {
                    this.changeDirection();
                }

                switch (this.direction) {
                    case 'left':
                        this.sprite.body.velocity.x = -WALK_SPEED;
                        this.sprite.body.velocity.y = 0;
                        break;
                    case 'right':
                        this.sprite.body.velocity.x = WALK_SPEED;
                        this.sprite.body.velocity.y = 0;
                        break;
                    case 'down':
                        this.sprite.body.velocity.x = 0;
                        this.sprite.body.velocity.y = WALK_SPEED;
                        break;
                    case 'up':
                        this.sprite.body.velocity.x = 0;
                        this.sprite.body.velocity.y = -WALK_SPEED;
                        break;
                }
            }

            this.game.physics.arcade.overlap(this.player, this.sprite,
                    this.caughtPlayer, null, this);
        },

        changeDirection: function() {
            var currentDirection,
                availableDirections = [];

            for (var i = 0; i < DIRECTIONS.length; i++) {
                currentDirection = DIRECTIONS[i];
                if (!this.isColliding(currentDirection)) {
                    availableDirections.push(currentDirection);
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
            direction = direction || this.direction;
            return (
                this.sprite.body.blocked[direction] ||
                this.sprite.body.touching[direction]);
        },

        caughtPlayer: function() {
            this.game.state.start('loss');
        }
    });
});
