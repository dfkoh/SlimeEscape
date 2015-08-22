define([
    'Base',
    'Player',
    'Enemy',
    'Door'
], function(
    Base,
    Player,
    Enemy,
    Door
) {

    return Base.extend({

        setup: function setup(options) {
            this.mapName = options.mapName;
            this.winCallback = options.winCallback || function() {
                this.game.state.start('win');
            };
        },

        create: function() {
            this.map = this.game.add.tilemap(this.mapName);

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
            this.addExit();
        },

        update: function() {
            this.game.physics.arcade.collide(this.player.sprite, this.background);
            this.game.physics.arcade.collide(this.enemyGroup, this.background);
            this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);
            this.game.physics.arcade.overlap(this.player.sprite, this.door.sprite,
                this.winCallback, null, this);

            var enemy;
            for (var i = 0; i < this.enemies.length; i++) {
                enemy = this.enemies[i];
                enemy.update();
            }

            this.player.update();
        },

        addEnemies: function addEnemies() {
            var enemyLocs = this.findObjectsByType('enemy_start', 'people'),
                enemy, enemyStart;

            this.enemyGroup = this.game.add.group();
            this.enemyGroup.enableBody = true;
            this.enemies = [];
            for (var i = 0; i < enemyLocs.length; i++) {
                enemyStart = enemyLocs[i];
                enemy = new Enemy({
                    x: enemyStart.x,
                    y: enemyStart.y,
                    game: this.game,
                    player: this.player.sprite,
                    group: this.enemyGroup
                });
                this.enemies.push(enemy);
            }
        },

        addPlayer: function addPlayer() {
            var slimeStart = {x: 0, y:0},
                slimeLocs = this.findObjectsByType('slime_start', 'people');

            if (slimeLocs.length > 0) {
                slimeStart = slimeLocs[0];
            }

            this.player = new Player({
                game: this.game,
                x: slimeStart.x,
                y: slimeStart.y
            });
        },

        addExit: function () {
            var doorLoc = {x: 0, y:0};
            var doorLocs = this.findObjectsByType('door', 'people');
            if (doorLocs.length > 0) { doorLoc = doorLocs[0]; }

            this.door = new Door({
                x: doorLoc.x,
                y: doorLoc.y,
                game: this.game
            });
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
