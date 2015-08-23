define([
    'Player',
    'Constants'
], function(
    Player,
    Constants
) {

    var SLIME_RATE = 80,
        MOVE_SPEED = 80;
    // These match the frames in the sprite

    return Player.extend({

        setup: function(options) {
            Player.prototype.setup.apply(this, arguments);

            this.enemies = options.enemies;
            this.slimeDistance = SLIME_RATE;
            this.slimeGroup = options.slimeGroup;

            this.sprite = this.game.add.sprite(this.startX, this.startY, 'slimer');
            this.game.physics.arcade.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;

            this.spacebar = this.game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
            this.spacebar.onDown.add(this.attack, this);
        },

        attack: function () {
            if (this.attacking) {
                return;
            }

            this.attacking = true;

            // right is the default
            var angle = 0;
            this.attackOffset = new Phaser.Point(this.sprite.width, 0);

            if (this.direction === Constants.DIRECTION.LEFT) {
                angle = 180;
                this.attackOffset = new Phaser.Point(-this.sprite.width, 0);
            }
            else if (this.direction === Constants.DIRECTION.UP) {
                angle = 270;
                this.attackOffset = new Phaser.Point(0, -this.sprite.height);
            }
            else if (this.direction === Constants.DIRECTION.DOWN) {
                angle = 90;
                this.attackOffset = new Phaser.Point(0, this.sprite.height);
            }

            var attackPoint = Phaser.Point.add(
                    this.sprite.body.position,
                    this.attackOffset);

            this.attackSprite = this.game.add.sprite(0, 0, 'slime_attack');
            this.game.physics.arcade.enable(this.attackSprite);

            this.attackSprite.anchor.setTo(0.5, 0.5);

            // Account for the fact that the anchor is in the middle
            this.attackOffset.x += this.attackSprite.width / 2;
            this.attackOffset.y += this.attackSprite.width / 2;

            // Position and rotate the attackSprite
            this.attackSprite.position = Phaser.Point.add(
                    this.sprite.body.position, this.attackOffset);
            this.attackSprite.angle = angle;

            this.attackSprite.animations.add('fire', null, 12);
            this.attackSprite.animations.play('fire');

            this.game.time.events.add(500, function() {
                this.attackSprite.kill();
                this.attackSprite = null;
                this.attacking = false;
            }, this);
        },

        slimeEnemy: function(player, enemy) {
            enemy.enemy.beSlimed();
        },

        update: function() {
            Player.prototype.update.apply(this);

            if (this.attackSprite) {
                this.attackSprite.position = Phaser.Point.add(
                        this.sprite.body.position, this.attackOffset);

                this.game.physics.arcade.overlap(
                        this.attackSprite, this.enemies, this.slimeEnemy,
                        null, this);
            }

            // Update slime distance and lay down a slime
            var distance = Phaser.Point.subtract(
                    this.sprite.body.prev,
                    this.sprite.body.position);
            this.slimeDistance -= distance.getMagnitude();

            if (this.slimeDistance <= 0) {
                sprite = this.slimeGroup.create(
                        this.sprite.body.x, this.sprite.body.y, 
                        'slime_puddle');
                sprite.animations.add('ooze', null, 4);
                sprite.animations.play('ooze');

                this.slimeDistance = SLIME_RATE;
            }
        }

    });

});
