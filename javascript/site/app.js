/*globals jQuery, APP, UTIL */

APP.common = {

    init: function () {
        // executed on each page
        notifications.init({
            channel : '/notification',
            animDuration : 300,
            hideDelay : 3500
        });

        jQuery.publish('/notification', { body : 'common.init loaded!', type : 'info'});
    }

};

APP.homepage = {

    init : function () {
        // executed on every feature of this module
        jQuery.publish('/notification', { body : 'Welcome, user #' + APP.config.userId + '!', type : 'success', sticky : true });
    },

    overview : function () {
        // function handleMsg(e, data) {
        //     console.log(data);
        // }
        // jQuery.subscribe('/sys/message', handleMsg);
        // jQuery.unsubscribe('/sys/message', handleMsg);

        // jQuery.publish('/notification', { body : 'homepage.overview loaded! NOT!', type : 'error'});

        // example:

        /**
         * Search Page mediator
         *
         * This module sets up the services and views for the search page,
         * then handles communication between the views and services.
         */
    }

};
