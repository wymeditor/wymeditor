Wymeditor = {
    /*
    extend: function (Base, Construct, prototype) {
        Extended = function() {
            //Base.apply(this, arguments);
            Construct.apply(Base, arguments);
        };

        Extended.prototype = new Base();

        for (var i in prototype) {
            Extended.prototype[i] = prototype[i];
        }

        return Extended;
    },*/
    extend: jQuery.extend
};