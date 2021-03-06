APP.module.notifications = (function ($, UTIL) {

    var holder,
        inited,
        publicApi,
        instances = {},
        orderedLookup = [],
        config = {
            subChannel : '/notification',
            parentEl : document.body,
            animDuration : 400,
            hideDelay : 3000,
            limit : 5
        };

    // TODO: compare this approach with Object.create()
    function Notification(id, content, type, isSticky, holder, animDuration, hideDelay) {
        this.id = id;
        this.el = this.createDom(content, type).appendTo(holder).hide(); // FIXME: Webkit has issues with sliding hidden elements; fading works though
        this.hideBtn = this.el.find('.js_notification_hide');
        this.animDuration = animDuration;
        this.hideDelay = hideDelay;
        this.showTimeout = 0;

        // hide notification onclick
        this.hideBtn.bind('click', $.proxy(this.hide, this));
        // form a DOM bridge; $('.notification').data('NotificationInstance')
        $.data(this.el[0], 'NotificationInstance', this);
        this.show(isSticky);
    }

    Notification.prototype = {
        // TODO: pull template out and consider a proper templating solution
        template : '<div class="mod notification info {TYPE}"><div class="inner"><div class="bd">{BODY}</div><div class="ft"><span class="js_notification_hide">X</span></div></div></div>',
        createDom : function (content, type) {
            // TODO: types should be configurable and mapped to CSS classes
            // types: success, error, info
            return $(this.template.replace('{BODY}', content).replace('{TYPE}', /^(success|error|info)$/.test(type) ? type : 'info'));
        },
        show : function (isSticky) {
            var that = this;

            if (isSticky) {

                that.el.slideDown(that.animDuration);

            } else {

                if (!that.el.is(':visible')) {
                    that.el.slideDown(that.animDuration, function () {
                        that.showTimeout = setTimeout($.proxy(that.hide, that), that.hideDelay);
                    });
                } else {
                    clearTimeout(that.showTimeout);
                    that.showTimeout = setTimeout($.proxy(that.hide, that), that.hideDelay);
                }

            }
        },
        hide : function () {
            this.el.slideUp(this.animDuration, $.proxy(this.destroy, this));
        },
        destroy : function () {
            this.hideBtn.unbind('click');
            clearTimeout(this.showTimeout);
            $.removeData(this.el[0], 'NotificationInstance');
            this.el.remove();
            // notify of completion, provide id
            cleanupInstance(this.id);
        }
    };

    function createHolder() {
        // TODO: pull template out and consider a proper templating solution
        // TODO: test with screen readers!
        holder = $('<div class="notification_holder" role="region" aria-live="polite" aria-relevant="additions text" aria-atomic="false"></div>').prependTo(config.parentEl);
    }

    function destroyHolder() {
        holder.remove();
    }

    function limitShown() {
        if (orderedLookup.length > config.limit) {
            console.log(orderedLookup.length, config.limit);
            instances[orderedLookup.shift()].destroy();
        }
    }

    function notify(e, data) {
        var id = UTIL.generateId();

        // limitShown();
        // FIXME: 7 arguments! seriously?!
        instances[id] = new Notification(id, data.body, data.type, data.sticky, holder, config.animDuration, config.hideDelay);
        // since we cannot trust hashes to be ordered, a separate array is used to track the notification order
        orderedLookup.push(id);
    }

    function startListening() {
        UTIL.subscribe(config.subChannel, notify);
    }

    function stopListening() {
        UTIL.unsubscribe(config.subChannel, notify);
    }

    function cleanupInstance(id) {
        orderedLookup.splice(orderedLookup.indexOf(id), 1);
        delete instances[id];
    }

    publicApi = {

        init : function (opts) {
            if (!inited) {
                $.extend(config, opts);
                createHolder();
                $.data(holder[0], 'notificationsInstance', this);
                startListening();
                inited = true;
            }
        },

        destroy : function () {
            if (inited) {
                stopListening();
                publicApi.reset();
                $.removeData(holder[0], 'notificationsInstance');
                destroyHolder();
                inited = false;
            }
        },

        reset : function () {
            if (inited) {
                stopListening();
                for (var id in instances) {
                    instances[id].destroy();
                }
                startListening();
            }
        },

        pause : function () {
            if (inited) {
                stopListening();
            }
        },

        resume : function () {
            if (inited) {
                startListening();
            }
        },

        // for debugging; should be removed later
        getInstances : function () {
            console.log(instances, orderedLookup);
        }

    };

    return publicApi;

}(jQuery, UTIL));
