define([
    'Base',
    'Slimer',
    'Dude',
    'LabWorker',
    'Door',
    'Constants'
], function(
    Base,
    Slimer,
    Dude,
    LabWorker,
    Door,
    Constants
) {

    return Base.extend({

        setup: function setup(options) {
            this.mapName = options.mapName;
            this.winState = options.winState || 'win';
            this.winCallback = options.winCallback || function() {
                this.game.state.start('win');
            };
        },

        create: function() {
            this.map = this.game.add.tilemap(this.mapName);

            //the first parameter is the tileset name as specified in Tiled, the
            //second is the key to the asset
            this.map.addTilesetImage('new_tiles', 'game_tiles');
            this.floor = this.map.createLayer('background');
            this.walls = this.map.createLayer('walls');

            this.slimeGroup = this.game.add.group();
            this.slimeGroup.enableBody = true;

            this.labGroup = this.game.add.group();
            this.labGroup.enableBody = true;

            this.zombieGroup = this.game.add.group();
            this.zombieGroup.enableBody = true;

            //resizes the game world to match the layer dimensions
            this.floor.resizeWorld();
            this.walls.resizeWorld();

            //collision on wall tile
            this.map.setCollisionByExclusion([], true, 'walls');

            this.addSlimer();
            this.addEnemies();
            this.addExit();
            this.dude = null;
        },

        update: function() {
            this.game.physics.arcade.collide(this.labGroup, this.walls);
            this.game.physics.arcade.collide(this.labGroup, this.labGroup);

            this.game.physics.arcade.collide(this.zombieGroup, this.walls);
            this.game.physics.arcade.collide(this.zombieGroup, this.zombieGroup);

            this.game.physics.arcade.collide(this.labGroup, this.zombieGroup);

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

            var enemies = this.getGroupChildren(this.labGroup);
            var enemies = enemies.concat(this.getGroupChildren(this.zombieGroup));

            for (var i = 0; i < enemies.length; i++) {
                enemies[i].update();
            }

            if (this.slimer) { this.slimer.update(); }
            if (this.dude) { this.dude.update(); }
        },

        slimerFinish: function() {
            this.slimer.sprite.destroy();
            this.slimer = null;

            var labWorkers = this.getGroupChildren(this.labGroup);
            for (var i = 0; i < labWorkers.length; i++) {
                labWorkers[i].player = null;
            }

            this.addDude();

            var zombies = this.getGroupChildren(this.zombieGroup);
            for (var i = 0; i < zombies.length; i++) {
                zombies[i].player = this.dude.sprite;
            }
        },

        addEnemies: function addEnemies() {
            var enemyLocs = this.findObjectsByType('enemy_start', 'people'),
                enemy, enemyStart;

            for (var i = 0; i < enemyLocs.length; i++) {
                enemyStart = enemyLocs[i];
                enemy = new LabWorker({
                    x: enemyStart.x,
                    y: enemyStart.y,
                    game: this.game,
                    runSpeed: Constants.LAB_WORKER_RUN,
                    walkSpeed: Constants.LAB_WORKER_WALK,
                    player: this.slimer.sprite,
                    group: this.labGroup,
                    zombieGroup: this.zombieGroup
                });
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
                moveSpeed: Constants.SLIME_SPEED,
                x: slimeStart.x,
                y: slimeStart.y,
                enemies: this.labGroup
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
                moveSpeed: Constants.DUDE_SPEED,
                x: dudeStart.x,
                y: dudeStart.y
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

        getGroupChildren: function getGroupChildren(group) {
            return group.children.map(function (sprite) {
                return sprite.enemy;
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
