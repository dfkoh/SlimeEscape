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
        SLIME_RATE: 100,
        DUDE_SPEED: 220,

        ENEMY_RUN: 150,
        ENEMY_WALK: 60,
        ENEMY_TRIGGER_DISTANCE: 150,

        ANTI_VIBRATE_THRESHOLD: 0,

        LAB_WORKER_RUN: 140,
        LAB_WORKER_WALK: 60,
        LAB_WORKER_TRIGGER: 150,

        SLIME_ZOMBIE_RUN: 180,
        SLIME_ZOMBIE_WALK: 20,
        SLIME_ZOMBIE_TRIGGER: 200


    }

});
