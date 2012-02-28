/*globals jQuery, APP, UTIL */

APP.common = {

    init: function () {
        // executed on each page
        notifications.init();
        UTIL.publish('/notification', { body : 'common.init loaded!', type : 'info'});
    }

};

APP.module = {

    init : function () {
        // executed on every feature of this module
        UTIL.publish('/notification', { body : 'Welcome, user #' + APP.config.userId + '!', type : 'success', sticky : true });
    },

    feature : function () {
        // function handleMsg(e, data) {
        //     console.log(data);
        // }
        // UTIL.subscribe('/sys/message', handleMsg);
        // UTIL.unsubscribe('/sys/message', handleMsg);

        UTIL.publish('/notification', { body : 'module.feature loaded! NOT!', type : 'error'});

        // example:

        /**
         * Search Page mediator
         *
         * This module sets up the services and views for the search page,
         * then handles communication between the views and services.
         */
    }

};
