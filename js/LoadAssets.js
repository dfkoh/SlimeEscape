define([
    'Base'
], function(
    Base
) {

    return Base.extend({

        setup: function setup(options) {
            this.startState = options.startState || 'level1';
        },

        preload: function preload() {
            this.load.tilemap('level1', 'assets/level1.json',
                    null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level2', 'assets/level2.json',
                    null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level3', 'assets/level3.json',
                    null, Phaser.Tilemap.TILED_JSON);

            this.load.image('game_tiles', 'assets/background_tiles.png');
            this.load.image('door', 'assets/door.png');
            this.load.spritesheet('slimer', 'assets/slimer.png', 30, 30);
            this.load.spritesheet('slime_attack', 'assets/slime_attack.png',
                                  32, 32);
            this.load.spritesheet('slime_puddle', 'assets/slime_puddle.png',
                                  32, 32);
            this.load.spritesheet('dude', 'assets/dude.png', 30, 30);
            this.load.spritesheet('baddie', 'assets/baddie.png', 30, 30);
            this.load.spritesheet('slimed_baddie', 'assets/slimed_baddie.png',
                    30, 30);

            this.load.image('slime_trail', 'assets/slime_trail.png');
            this.load.spritesheet('util_tiles', 'assets/tileset.png', 32, 32);
        },

        create: function create() {
            this.game.state.start(this.startState);
        }

    });

});
