define(function () {
    console.log('homepage overview here!');
    jQuery.publish('/notification', { body : 'homepage overview loaded!', type : 'info'});
});
