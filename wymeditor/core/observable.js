Wymeditor.core.Observable = function () {
    this.listeners = {};
}
Wymeditor.core.Observable.prototype = {
    /*
     * listen
     */
    addListener: function (eventName, callback) {
        if (!eventName || !callback)
            return false;
        eventName = eventName.toLowerCase();

        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(callback);
    },

    /*
     * removeListener
     */
    removeListener: function (eventName, callback) {
        eventListeners = this.listeners[eventName.toLowerCase()] || false;

        if (eventListeners) {
            var a = [];

            for (var i=0, j=eventListeners.length; i < j; ++i) {
                if (eventListeners[i] !== callback) {
                    a.push(eventListeners[i]);
                }
            };

            eventListeners = a;
            return true;
        }
        return false;
    },

    /*
     * fire
     */
    fireEvent: function (eventName, data) {
        if (!eventName)
            return false;
        eventName = eventName.toLowerCase();

        data = data || {};
        data.name = eventName;
        data.scope = this;

        eventListeners = this.listeners[eventName] || false;

        if (eventListeners) {
            for (listenter in eventListeners) {
                listener(data);
            };
            return true;
        }
        return false;
    }
}
