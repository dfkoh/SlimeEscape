define([
    'Player',
    'Constants'
], function(
    Player,
    Constants
) {

    var MOVE_SPEED = 200;
    var SLIME_MOVE_SPEED = 100;

    return Player.extend({

        setup: function(options) {
            Player.prototype.setup.apply(this, arguments);

            this.enemies = options.enemies;
            this.slimeGroup = options.slimeGroup;
            this.onSlime = null;

            this.sprite = this.game.add.sprite(this.startX, this.startY, 'dude');
            this.game.physics.arcade.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;
        },

        stillOnSlime: function stillOnSlime() {
            return this.game.physics.arcade.intersects(this.sprite.body,
                    this.onSlime.body);
        },

        update: function update() {
            this.moveSpeed = MOVE_SPEED;
            this.game.physics.arcade.overlap(this.sprite, this.slimeGroup, 
                    function(dude, slime) { this.onSlime = slime; }, 
                    null, this);

            if (this.onSlime && !this.stillOnSlime()) { 
                this.onSlime = null;
            }
                
            if (this.onSlime) {
                this.moveSpeed = SLIME_MOVE_SPEED;
            }

            Player.prototype.update.apply(this);
        }

    });

});
