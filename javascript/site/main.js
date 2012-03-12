// require.config({
//     baseUrl: 'javascript/',
//     paths: {
//         'text': 'lib/text',
//     }
// });

require([

    'common/init',
    'routes',
    '../lib/bootstrap',
    '../lib/jquery.channel'

], function (common, routes) {

    var body = document.body,
        module = body.getAttribute('data-module'),
        feature = body.getAttribute('data-feature');

    function exec(module, feature) {
        var ns = routes;

        if (typeof ns[module][feature] === 'string') {
            require([ ns[module][feature] ]);
        }
    }

    common.init();
    exec(module, feature);

});
