

//title screen
var engine = function(){};

engine.prototype = {

    preload: function(){ 
        this.load.tilemap('test_map', 'assets/map.json', 
                          null, Phaser.Tilemap.TILED_JSON);
        this.load.image('game_tiles', 'assets/tileset.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('test_map');

        //the first parameter is the tileset name as specified in Tiled, the
        //second is the key to the asset
        this.map.addTilesetImage('tiles', 'game_tiles');

        //create layer
        this.background = this.map.createLayer('background');

        //collision on blockedLayer
        this.map.setCollision(2, true, 'background');

        //resizes the game world to match the layer dimensions
        this.background.resizeWorld();
    },

    update: function() {
    }
}

var game = new Phaser.Game(1000, 1000, Phaser.AUTO, 'main');
game.state.add('main', engine);
game.state.start('main');
