// require.config({
//     baseUrl: 'javascript/',
//     paths: {
//         'text': 'lib/text',
//     }
// });

require([

    'routes',
    '../lib/bootstrap',
    '../lib/jquery.channel'

], function (routes) {

    var body = document.body,
        module = body.getAttribute('data-module'),
        feature = body.getAttribute('data-feature');

    function exec(module, feature) {
        var ns = routes;

        if (typeof ns[module][feature] === 'string') {
            require([ ns[module][feature] ]);
        }
    }

    if (typeof routes === 'object' && routes !== null) {
        exec(module, feature);
    } else {
        console.warn('No routes found!');
    }

});
