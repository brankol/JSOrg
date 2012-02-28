var notifications = (function ($, UTIL) {

    var holder,
        inited,
        publicApi,
        instances = {};

    // TODO: compare this approach with Object.create()
    function Notification(id, content, type, container, animDuration, hideDelay) {
        this.id = id;
        this.el = this.createDom(content, type).appendTo(container).hide(); // BUG: Webkit has issues with sliding hidden elements; fading works though
        this.animDuration = animDuration;
        this.hideDelay = hideDelay;
        this.showTimeout = 0;

        this.show();
    }

    Notification.prototype = {
        // TODO: sticky option, hide button, pull template out and consider a proper templating solution
        // TODO: some kind of aria attribute so screen readers get notified?
        template : '<div class="notification {TYPE}">{CONTENT}</div>', // FIXME: should be based on SMF
        createDom : function (content, type) {
            // FIXME: types should be configurable and mapped to CSS classes
            // types: success, error, info, system, other
            // TODO: Subscribe channel should be /notification/success
            return $(this.template.replace('{CONTENT}', content).replace('{TYPE}', /^(success|error|info)$/.test(type) ? type : 'info'));
        },
        show : function () {
            var that = this;

            if (!that.el.is(':visible')) {
                that.el.slideDown(that.animDuration, function () {
                    that.showTimeout = setTimeout($.proxy(that.hide, that), that.hideDelay);
                });
            } else {
                clearTimeout(that.showTimeout);
                that.showTimeout = setTimeout($.proxy(that.hide, that), that.hideDelay);
            }
        },
        hide : function () {
            this.el.slideUp(this.animDuration, $.proxy(this.destroy, this));
        },
        destroy : function (forceDestroy) {
            // TODO: unbind click on hide btn when implemented
            clearTimeout(this.showTimeout);
            this.el.remove();
            if (!forceDestroy) {
                // notify of completion, provide id
                UTIL.publish('/notification/done', this.id);
            }
        }
    };

    function createHolder() {
        // FIXME: pull template out and consider a proper templating solution
        // FIXME: attachment point should be configurable
        holder = $('<div class="notification_holder"></div>').prependTo('body');
    }

    function destroyHolder() {
        holder.remove();
    }

    function notify(e, data) {
        var id = UTIL.generateId();

        // FIXME: ordering cannot be trusted (in Chrome at least) :(
        // FIXME: model data in a better way? data.body perhaps? data.head?
        // FIXME: 6 arguments! seriously?!
        // IDEA: perhaps form a bridge with the DOM element?
        instances[id] = new Notification(id, data.text, data.type, holder, publicApi.animDuration, publicApi.hideDelay);
    }

    function startListening() {
        UTIL.subscribe('/notification', notify);
    }

    function stopListening() {
        UTIL.unsubscribe('/notification', notify);
    }

    function cleanupInstance(e, id) {
        delete instances[id];
    }

    UTIL.subscribe('/notification/done', cleanupInstance);

    publicApi = {

        animDuration : 400,
        hideDelay : 3000,

        init : function () {
            if (!inited) {
                createHolder();
                startListening();
                inited = true;
            }
        },

        destroy : function () {
            if (inited) {
                stopListening();
                publicApi.reset();
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
