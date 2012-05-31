if (typeof console === 'undefined') { console = { log: function () {}, warn: function () {}, error: function () {}, info: function () {}, dir: function () {} }; }

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

var CW = {},
    APP = {};

CW.formSchema = {};
APP.config = {};
APP.route = {};
APP.module = {};
