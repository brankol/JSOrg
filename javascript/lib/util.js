/*globals jQuery, APP */

var UTIL = {

    jQ : jQuery({}),

    // FIXME: perhaps switch to a proper pubsub solution?
    // the first argument in a subscribe callback should not be 'event'
    subscribe : function () {
        UTIL.jQ.bind.apply(UTIL.jQ, arguments);
    },

    unsubscribe : function () {
        UTIL.jQ.unbind.apply(UTIL.jQ, arguments);
    },

    publish : function () {
        UTIL.jQ.trigger.apply(UTIL.jQ, arguments);
    },

    // https://gist.github.com/1308368
    generateId : function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},

    exec : function (module, feature, args) {
        var ns = APP,
            feature = (feature === undefined) ? 'init' : feature;

        if (module !== '' && ns[module] && typeof ns[module][feature] === 'function') {
            ns[module][feature](args);
        }
    },

    init : function () {
        var body = document.body,
            module = body.getAttribute('data-module'),
            feature = body.getAttribute('data-feature');

        UTIL.exec('common');
        UTIL.exec(module);
        UTIL.exec(module, feature);

        UTIL.publish('/util/init');
    }

};

jQuery(document).ready(UTIL.init);
