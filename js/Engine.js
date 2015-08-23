define([
    'Base',
    'Slimer',
    'Dude',
    'Enemy',
    'Door'
], function(
    Base,
    Slimer,
    Dude,
    Enemy,
    Door
) {

    return Base.extend({

        setup: function setup(options) {
            this.mapName = options.mapName;
            this.winState = options.winState || 'win';
            this.winCallback = options.winCallback || function() {
                this.game.state.start('win');
            };
            this.slimedEnemies = [];
        },

        create: function() {
            this.map = this.game.add.tilemap(this.mapName);

            //the first parameter is the tileset name as specified in Tiled, the
            //second is the key to the asset
            this.map.addTilesetImage('new_tiles', 'game_tiles');
            this.floor = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');
            this.slimeGroup = this.game.add.group();

            //resizes the game world to match the layer dimensions
            this.floor.resizeWorld();
            this.walls.resizeWorld();

            //collision on wall tile
            this.map.setCollisionByExclusion([], true, 'walls');

            // Needed for addPlayer and addEnemies
            this.enemyGroup = this.game.add.group();
            this.enemyGroup.enableBody = true;

            this.addSlimer();
            this.addEnemies();
            this.addExit();
            this.dude = null;
        },

        update: function() {
            this.game.physics.arcade.collide(this.enemyGroup, this.walls);
            this.game.physics.arcade.collide(this.enemyGroup, this.enemyGroup);

            if (this.slimer) {
                this.game.physics.arcade.collide(this.slimer.sprite, this.walls);
                this.game.physics.arcade.overlap(this.slimer.sprite, this.door.sprite,
                        this.slimerFinish, null, this);
            }

            if (this.dude) {
                this.game.physics.arcade.collide(this.dude.sprite, this.walls);
                this.game.physics.arcade.overlap(this.dude.sprite, this.door.sprite,
                        function() {
                            this.game.state.start(this.winState);
                        }, null, this);
            }

            var enemy;
            for (var i = 0; i < this.enemies.length; i++) {
                enemy = this.enemies[i];
                enemy.update();
            }

            if (this.slimer) { this.slimer.update(); }
            if (this.dude) { this.dude.update(); }
        },

        slimerFinish: function() {
            this.slimer.sprite.destroy();
            this.slimer = null;
            this.enemyGroup.destroy();

            this.enemyGroup = this.game.add.group();
            this.enemyGroup.enableBody = true;

            this.enemies = this.slimedEnemies;
            console.log('dude before creation: ' + this.dude);
            this.addDude();
            console.log('dude after creation: ' + this.dude);
            for (var i = 0; i < this.enemies.length; i++) {
                var enemy = this.enemies[i];
                enemy.reanimate(this.dude);
                console.log('enemy player after dudification: ' + enemy.player);
                this.enemyGroup.add(enemy.sprite);
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
                    player: this.slimer.sprite,
                    group: this.enemyGroup,
                    slimedEnemies: this.slimedEnemies
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

        addDude: function addDude() {
            var dudeStart = {x: 0, y:0},
                dudeLocs = this.findObjectsByType('slime_start', 'people');

            if (dudeLocs.length > 0) {
                dudeStart = dudeLocs[0];
            }

            this.dude = new Dude({
                game: this.game,
                slimeGroup: this.slimeGroup,
                x: dudeStart.x,
                y: dudeStart.y,
                enemies: this.enemyGroup
            });
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
