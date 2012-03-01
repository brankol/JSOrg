var notifications = (function ($, UTIL) {

    var holder,
        inited,
        publicApi,
        instances = {},
        config = {
            subChannel : '/notification',
            parentEl : document.body,
            animDuration : 400,
            hideDelay : 3000
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
        destroy : function (isSilent) {
            this.hideBtn.unbind('click');
            clearTimeout(this.showTimeout);
            $.removeData(this.el[0], 'NotificationInstance');
            this.el.remove();
            if (!isSilent) {
                // notify of completion, provide id
                cleanupInstance(this.id);
            }
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

    function notify(e, data) {
        var id = UTIL.generateId();

        // FIXME: ordering cannot be trusted (in Chrome at least) :(
        // FIXME: 7 arguments! seriously?!
        instances[id] = new Notification(id, data.body, data.type, data.sticky, holder, config.animDuration, config.hideDelay);
    }

    function startListening() {
        UTIL.subscribe(config.subChannel, notify);
    }

    function stopListening() {
        UTIL.unsubscribe(config.subChannel, notify);
    }

    function cleanupInstance(id) {
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
                    instances[id].destroy(true);
                    cleanupInstance(null, id);
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
            return instances;
        }

    };

    return publicApi;

}(jQuery, UTIL));
