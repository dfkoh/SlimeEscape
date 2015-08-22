define([
    'Base'
], function(
    Base
) {

    var MOVE_SPEED = 300;
    // These match the frames in the sprite
    var DIRECTION = {
        none: 0,
        left: 1,
        right: 2,
        down: 3,
        up: 4
    }
    return Base.extend({

        setup: function(options) {
            this.game = options.game;
            this.startX = options.x;
            this.startY = options.y;

            this.create();
        },

        create: function() {
            this.sprite = this.game.add.sprite(this.startX, this.startY, 'slimer');
            this.game.physics.arcade.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.direction = DIRECTION.none;
        },

        update: function() {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            if (this.cursors.left.isDown) {
                this.direction = DIRECTION.left;
                this.sprite.body.velocity.x = -MOVE_SPEED;
            }
            else if (this.cursors.right.isDown) {
                this.direction = DIRECTION.right;
                this.sprite.body.velocity.x = MOVE_SPEED;
            }

            if (this.cursors.up.isDown) {
                this.direction = DIRECTION.up;
                this.sprite.body.velocity.y = -MOVE_SPEED;
            }
            else if (this.cursors.down.isDown) {
                this.direction = DIRECTION.down;
                this.sprite.body.velocity.y = MOVE_SPEED;
            }
            this.sprite.frame = this.direction;
        }
    });
});
