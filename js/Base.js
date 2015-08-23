define([], function() {

    var Base = function Base(options) {};

    var callIf = function (context, func) {
        if (func) {
            var args = Array.prototype.slice.call(arguments, 2);
            func.apply(context, args);
        }
    };

    Base.extend = function extend() {
        var extended = function (options) {
            callIf(this, this.setup, options);
        };

        for (var property in this) {
            if (property) {
                extended[property] = this[property];
            }
        }

        for (var property in this.prototype) {
            if (property) {
                extended.prototype[property] = this.prototype[property];
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

        console.log(extended.prototype);

        return extended;
    };

    return Base;

});
