define([
    'Base'
], function(
    Base
) {

    var MOVE_SPEED = 300;

    return Base.extend({

        preload: function(){
            this.load.tilemap('test_map', 'assets/map.json',
                    null, Phaser.Tilemap.TILED_JSON);
            this.load.image('game_tiles', 'assets/tileset.png');
            this.load.image('slimer', 'assets/slimer.png');
        },

        create: function() {
            this.map = this.game.add.tilemap('test_map');

            //the first parameter is the tileset name as specified in Tiled, the
            //second is the key to the asset
            this.map.addTilesetImage('tiles', 'game_tiles');
            this.background = this.map.createLayer('background');

            //resizes the game world to match the layer dimensions
            this.background.resizeWorld();

            //collision on wall tile
            this.map.setCollision(3, true, 'background');

            this.player = this.game.add.sprite(0, 0, 'slimer');

            this.game.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;

            this.cursors = this.game.input.keyboard.createCursorKeys();
        },

        update: function() {
            var player = this.player;
            var cursors = this.cursors;

            this.game.physics.arcade.collide(player, this.background);

            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if (cursors.left.isDown) {
                player.body.velocity.x = -MOVE_SPEED;
            }
            else if (cursors.right.isDown) {
                player.body.velocity.x = MOVE_SPEED;
            }

            if (cursors.up.isDown) {
                player.body.velocity.y = -MOVE_SPEED;
            }
            else if (cursors.down.isDown) {
                player.body.velocity.y = MOVE_SPEED;
            }
        }
    });

});
