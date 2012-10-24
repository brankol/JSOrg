require.config({

    // Initialize the application with the main application file
    deps : ['bootstrap', 'main'],

    paths : {
        // JavaScript folders
        libs : '../lib',

        // Libraries
        jquery : '../lib/jquery/jquery',
    },

    shim : {
        // jQuery plugins
        'libs/jquery/channel' : ['jquery']
    }

});
