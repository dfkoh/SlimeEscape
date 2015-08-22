define([], function() {

    var Base = function Base() {};

    Base.extend = function extend() {
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
                        this.prototype[property] = obj[property];
                    }
                }
            }
        }

        return this;
    };

    return Base;

});
