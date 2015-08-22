define([
    'Base',
    'Enemy'
], function(
    Base,
    Enemy
) {

    var MOVE_SPEED = 300;

    return Base.extend({

        preload: function(){
            this.load.tilemap('test_map', 'assets/map.json',
                    null, Phaser.Tilemap.TILED_JSON);
            this.load.image('game_tiles', 'assets/tileset.png');
            this.load.image('slimer', 'assets/slimer.png');
            this.load.image('baddie', 'assets/baddie.png');
            this.load.spritesheet('util_tiles', 'assets/tileset.png', 32, 32);
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

            this.addPlayer();
            this.addEnemies();

            this.cursors = this.game.input.keyboard.createCursorKeys();
        },

        update: function() {
            var player = this.player;
            var cursors = this.cursors;

            this.game.physics.arcade.collide(player, this.background);

            var enemy;
            for (var i = 0; i < this.enemies.length; i++) {
                enemy = this.enemies[i];
                this.game.physics.arcade.collide(enemy.sprite, this.background);
                enemy.update();
            }

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
        },

        addEnemies: function addEnemies() {
            var enemyLocs = this.findObjectsByType('enemy_start', 'people'),
                enemy, enemyStart;

            this.enemies = [];
            for (var i = 0; i < enemyLocs.length; i++) {
                enemyStart = enemyLocs[i];
                enemy = new Enemy({
                    x: enemyStart.x,
                    y: enemyStart.y,
                    game: this.game,
                    player: this.player
                });
                enemy.create();
                this.enemies.push(enemy);
            }
        },

        addPlayer: function addPlayer() {
            var slimeStart = {x: 0, y:0};

            var slimeLocs = this.findObjectsByType('slime_start', 'people');
            if (slimeLocs.length > 0) {
                slimeStart = slimeLocs[0];
            }

            this.player = this.game.add.sprite(slimeStart.x, slimeStart.y, 'slimer');
            this.game.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;
        },

        findObjectsByType: function findObjectsByType(type, layer) {
            var result = [];
            this.map.objects[layer].forEach(function(obj) {
                if (obj.type === type) {
                    obj.y -= this.map.tileHeight;
                    result.push(obj);
                }
            }, this);
            return result;
        }

    });

});
