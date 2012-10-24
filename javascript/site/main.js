require([

    // libraries
    'jquery',

    // modules
    'common/init',
    'routes',

    // plugins (app-wide)
    'libs/jquery/channel'

], function ($, common, routes) {

    function exec(module, feature) {
        if (typeof routes[module][feature] === 'string') {
            require([ routes[module][feature] ]);
        }
    }

    $(document).ready(function () {
        var body = document.body,
            module = body.getAttribute('data-module'),
            feature = body.getAttribute('data-feature');

        common.init();
        exec(module, feature);
    });

});
