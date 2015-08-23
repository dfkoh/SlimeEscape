define([], function() {

    return {

        // These match the frames in the sprite
        DIRECTION: {
            NONE: 0,
            LEFT: 1,
            RIGHT: 2,
            DOWN: 3,
            UP: 4
        },

        DIRECTION_STR: {
            0: null,
            1: 'left',
            2: 'right',
            3: 'down',
            4: 'up'
        },

        SLIME_SPEED: 100,
        DUDE_SPEED: 200,

        ENEMY_RUN_SPEED: 150,
        ENEMY_WALK_SPEED: 60,
        ENEMY_TRIGGER_DISTANCE: 150,
        ANTI_VIBRATE_THRESHOLD: 0


    }

});
