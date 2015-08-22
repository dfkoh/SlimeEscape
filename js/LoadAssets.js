define([
    'Base'
], function(
    Base
) {

    return Base.extend({

        preload: function preload() {
            this.load.tilemap('test_map', 'assets/map.json',
                    null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level1', 'assets/level1.json',
                    null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('level2', 'assets/level2.json',
                    null, Phaser.Tilemap.TILED_JSON);

            this.load.image('game_tiles', 'assets/tileset.png');
            this.load.image('slimer', 'assets/slimer.png');
            this.load.image('baddie', 'assets/baddie.png');
            this.load.spritesheet('util_tiles', 'assets/tileset.png', 32, 32);
        },

        create: function create() {
            this.game.state.start('level1');
        },

    });

});
