define([
    'Base',
    'Constants'
], function(
    Base,
    Constants
) {

    return Base.extend({

        setup: function(options) {
            this.game = options.game;
            this.startX = options.x;
            this.startY = options.y;
            this.direction = Constants.DIRECTION.NONE;
        }

    });

});
