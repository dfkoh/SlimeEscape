define([
    'Base',
    'Slimer',
    'Enemy',
    'Door'
], function(
    Base,
    Slimer,
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
            this.map.addTilesetImage('new_tiles', 'game_tiles');
            this.background = this.map.createLayer('background');
            this.slimeGroup = this.game.add.group();

            //resizes the game world to match the layer dimensions
            this.background.resizeWorld();

            //collision on wall tile
            this.map.setCollisionBetween(9, 25, true, 'background');

            // Needed for addPlayer and addEnemies
            this.enemyGroup = this.game.add.group();
            this.enemyGroup.enableBody = true;

            this.addSlimer();
            this.addEnemies();
            this.addExit();
        },

        update: function() {
            this.game.physics.arcade.collide(this.slimer.sprite, this.background);
            this.game.physics.arcade.collide(this.enemyGroup, this.background);
            this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);
            this.game.physics.arcade.overlap(this.slimer.sprite, this.door.sprite,
                this.winCallback, null, this);

            var enemy;
            for (var i = 0; i < this.enemies.length; i++) {
                enemy = this.enemies[i];
                enemy.update();
            }

            this.slimer.update();
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
                    player: this.slimer.sprite,
                    group: this.enemyGroup
                });
                this.enemies.push(enemy);
            }
        },

        addSlimer: function addSlimer() {
            var slimeStart = {x: 0, y:0},
                slimeLocs = this.findObjectsByType('slime_start', 'people');

            if (slimeLocs.length > 0) {
                slimeStart = slimeLocs[0];
            }

            this.slimer = new Slimer({
                game: this.game,
                slimeGroup: this.slimeGroup,
                x: slimeStart.x,
                y: slimeStart.y,
                enemies: this.enemyGroup
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
