define([
    'Base'
], function(
    Base
) {

    var MOVE_SPEED = 200;
    var SLIME_RATE = 70;
    // These match the frames in the sprite
    var DIRECTION = {
        none: 0,
        left: 1,
        right: 2,
        down: 3,
        up: 4
    };

    return Base.extend({

        setup: function(options) {
            this.game = options.game;
            this.startX = options.x;
            this.startY = options.y;
            this.enemies = options.enemies;
            this.slimeDistance = SLIME_RATE;
            this.slimeGroup = options.slimeGroup;

            this.create();
        },

        attack: function () {
            if (this.attacking) {
                return;
            }

            this.attacking = true;

            // right is the default
            var angle = 0;
            this.attackOffset = new Phaser.Point(this.sprite.width, 0);

            if (this.direction == DIRECTION.left) {
                angle = 180;
                this.attackOffset = new Phaser.Point(-this.sprite.width, 0);
            }
            else if (this.direction == DIRECTION.up) {
                angle = 270;
                this.attackOffset = new Phaser.Point(0, -this.sprite.height);
            }
            else if (this.direction == DIRECTION.down) {
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

        create: function() {
            this.sprite = this.game.add.sprite(this.startX, this.startY, 'slimer');
            this.game.physics.arcade.enable(this.sprite);
            this.sprite.body.collideWorldBounds = true;
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.direction = DIRECTION.none;

            this.spacebar = this.game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
            this.spacebar.onDown.add(this.attack, this);
        },

        slimeEnemy: function(player, enemy) {
            enemy.enemy.beSlimed();
        },

        update: function() {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            if (this.cursors.left.isDown) {
                this.direction = DIRECTION.left;
                this.sprite.body.velocity.x = -MOVE_SPEED;
            } else if (this.cursors.right.isDown) {
                this.direction = DIRECTION.right;
                this.sprite.body.velocity.x = MOVE_SPEED;
            }

            if (this.cursors.up.isDown) {
                this.direction = DIRECTION.up;
                this.sprite.body.velocity.y = -MOVE_SPEED;
            } else if (this.cursors.down.isDown) {
                this.direction = DIRECTION.down;
                this.sprite.body.velocity.y = MOVE_SPEED;
            }

            this.sprite.frame = this.direction;

            if (this.sprite.body.velocity.x === 0 &&
                this.sprite.body.velocity.y === 0) {
                this.sprite.frame = DIRECTION.none;
            }

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
                this.slimeGroup.create(this.sprite.body.x, this.sprite.body.y, 'slime_trail');
                this.slimeDistance = SLIME_RATE;
            }
        }

    });

});
