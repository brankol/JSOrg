define(['common/notifications'], function (notifications) {
    return {
        init : function () {
            console.info('pvt common reporting for duty, sir!');

            notifications.init({
                channel : '/notification',
                animDuration : 300,
                animStart : 'fadeIn',
                animEnd : 'fadeOut',
                hideDelay : 3500
            });

            jQuery.publish('/notification', { body : 'common.init loaded!', type : 'info'});
        }
    };
});
