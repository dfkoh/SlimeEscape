define([
    'Position',
    'Constants'
], function(
    Position,
    Constants
) {

    var MOVE_SPEED = 200;

    console.log('extending position...');
    return Position.extend({

        setup: function(options) {
            Position.prototype.setup.apply(this, arguments);
            this.cursors = this.game.input.keyboard.createCursorKeys();
        },

        update: function(moveSpeed) {
            if (!moveSpeed) { 
                moveSpeed = MOVE_SPEED;
            }

            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            if (this.cursors.left.isDown) {
                this.direction = Constants.DIRECTION.LEFT;
                this.sprite.body.velocity.x = -moveSpeed;
            } else if (this.cursors.right.isDown) {
                this.direction = Constants.DIRECTION.RIGHT;
                this.sprite.body.velocity.x = moveSpeed;
            }

            if (this.cursors.up.isDown) {
                this.direction = Constants.DIRECTION.UP;
                this.sprite.body.velocity.y = -moveSpeed;
            } else if (this.cursors.down.isDown) {
                this.direction = Constants.DIRECTION.DOWN;
                this.sprite.body.velocity.y = moveSpeed;
            }

            this.sprite.frame = this.direction;

            if (this.sprite.body.velocity.x === 0 &&
                this.sprite.body.velocity.y === 0) {
                this.sprite.frame = Constants.DIRECTION.NONE;
            }
        }

    });

});
