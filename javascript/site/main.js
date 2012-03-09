require([

    'routes',
    '../lib/bootstrap',
    '../lib/jquery.channel'

], function (routes) {

    console.log(routes);

    jQuery.subscribe('/msg', function (data) {
        console.log(data);
    });

    // config = pages[document.body.getAttribute('data-page')];
    // config && require([ config ]);

});
