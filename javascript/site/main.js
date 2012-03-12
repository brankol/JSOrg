// require.config({
//     paths: {
//         'text': 'lib/text',
//     }
// });

require([

    'common/init',
    'routes',
    '../lib/bootstrap',
    '../lib/jquery/channel'

], function (common, routes) {

    function exec(module, feature) {
        if (typeof routes[module][feature] === 'string') {
            require([ routes[module][feature] ]);
        }
    }

    jQuery(document).ready(function () {
        var body = document.body,
            module = body.getAttribute('data-module'),
            feature = body.getAttribute('data-feature');

        common.init();
        exec(module, feature);
    });

});
