define([
    'Base',
], function(
    Base
) {
    var DEFAULT_SCRIPT_SPEED = 75;

    return Base.extend({
        setup: function setup(options) {
            this.nextState = options.nextState || 'level1';
            this.scriptSpeed = options.scriptSpeed || DEFAULT_SCRIPT_SPEED;
            this.script = options.script;
        },
        create: function create() {
            this.game.stage.backgroundColor = '#fff';
            this.shownText = this.game.add.text(
                    100, (this.game.world.height / 2) - 100,
                    "");
            this.running = false;
            var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spacebar.onDown.add(function() {
                this.game.state.start(this.nextState);
            }, this);
        },
        update: function update() {
            if (!this.running) {
                this.running = true;
                this.runScript(0);
            }
        },
        runScript: function runScript(index) {
            if (index >= this.script.length) {
                this.game.state.start(this.nextState);
                return;
            }

            var scriptItem = this.script[index];

            this.textIndex = 0;
            this.scriptText = scriptItem[0];
            this.shownText.setText("");
            this.scriptTimer = new Phaser.Timer(this.game);
            this.scriptTimer.repeat(this.scriptSpeed, this.scriptText.length+1,
                function() {
                    this.shownText.setText(
                            this.scriptText.substr(0, this.textIndex));
                    this.textIndex += 1;
                }, this);

            this.scriptTimer.onComplete.add(function() { 
                    this.game.time.events.add(
                            scriptItem[1], this.runScript, this, index+1);
                }, this);
            //this.scriptTimer.start();
            this.game.time.add(this.scriptTimer);
            this.scriptTimer.start();
        }
    });
});

