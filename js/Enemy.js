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
            this.slimed = false;

            this.create();
        },

        create: function() {
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
                    // right
                    this.sprite.frame = 1;
                } else {
                    // left
                    this.sprite.frame = 2;
                }
            } else {
                if (vy > 0) {
                    // up
                    this.sprite.frame = 3;
                } else {
                    // down
                    this.sprite.frame = 4;
                }

            }

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
                case 'left':
                    this.sprite.body.velocity.x = -WALK_SPEED;
                    this.sprite.body.velocity.y = 0;
                    this.sprite.frame = 2;
                    break;
                case 'right':
                    this.sprite.body.velocity.x = WALK_SPEED;
                    this.sprite.body.velocity.y = 0;
                    this.sprite.frame = 1;
                    break;
                case 'down':
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = WALK_SPEED;
                    this.sprite.frame = 3;
                    break;
                case 'up':
                    this.sprite.body.velocity.x = 0;
                    this.sprite.body.velocity.y = -WALK_SPEED;
                    this.sprite.frame = 4;
                    break;
            }
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
