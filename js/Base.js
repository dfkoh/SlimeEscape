define([], function() {

    var Base = function Base(options) {
        this.callIf(this.init, options);
    };

    Base.prototype.callIf = function callIf(func) {
        if (func) {
            var args = Array.prototype.slice.call(arguments, 1);
            func.apply(this, args);
        }
    };

    Base.extend = function extend() {
        var extended = function() {};

        for (var property in this) {
            if (property) {
                extended.prototype[property] = this[property];
            }
        }

        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];

            if (typeof obj !== 'object') {
                continue;
            }

            if (Array.isArray(obj)) {
                this.extend.apply(this, obj);
            } else {
                for (var property in obj) {
                    if (property) {
                        extended.prototype[property] = obj[property];
                    }
                }
            }
        }

        return extended;
    };

    return Base;

});
