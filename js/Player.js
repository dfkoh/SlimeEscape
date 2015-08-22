define([
    'Base'
], function(
    Base
) {

    var MOVE_SPEED = 200;
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

            this.create();
        },

        attack: function () {
            if (this.attacking) {
                return;
            }

            console.log('attacking!');

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
            console.log(this.attackPoint);

            this.attackSprite = this.game.add.sprite(
                attackPoint.x, attackPoint.y, 'slime_attack');


            this.game.physics.arcade.enable(this.attackSprite);
            this.attackSprite.anchor.setTo(0.5, 0.5);
            this.attackSprite.position.x += this.attackSprite.width / 2;
            this.attackSprite.position.y += this.attackSprite.height / 2;

            this.attackSprite.angle = angle;

            console.log(this.attackSprite.position);
            console.log(this.attackSprite.angle);

            this.attackSprite.animations.add('fire', null, 12); 
            this.attackSprite.animations.play('fire');

            this.game.time.events.add(500, function() { 
                console.log('done attacking.');
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

            if (this.sprite.body.velocity.x === 0 &&
                this.sprite.body.velocity.y === 0) {
                this.direction = DIRECTION.none;
            }

            this.sprite.frame = this.direction;
            
            if (this.attackSprite) {
                this.attackSprite.position = Phaser.Point.add(
                        this.sprite.body.position, this.attackOffset);
                this.attackSprite.position.x += this.attackSprite.width / 2;
                this.attackSprite.position.y += this.attackSprite.height / 2;

                this.game.physics.arcade.overlap(
                        this.attackSprite, this.enemies, this.slimeEnemy,
                        null, this);
            }
        }
    });
});
