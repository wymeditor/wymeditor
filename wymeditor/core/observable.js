Wymeditor.core.Observable = function () {
    this._listeners = {};
}
Wymeditor.core.Observable.prototype = {
    /*
     * listen
     */
    addListener: function (eventName, callback) {
        if (!eventName || !callback)
            return false;
        eventName = eventName.toLowerCase();

        this._listeners[eventName] = this._listeners[eventName] || [];
        this._listeners[eventName].push(callback);
        return true;
    },

    /*
     * removeListener
     */
    removeListener: function (eventName, callback) {
        eventListeners = this._listeners[eventName.toLowerCase()] || false;

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
        var listener;
        if (!eventName)
            return false;
        eventName = eventName.toLowerCase();

        data = data || {};
        data.name = eventName;
        data.source = this;

        eventListeners = eventName in this._listeners &&
                            this._listeners[eventName] || false;

        if (eventListeners) {
            for (var i = 0; listener = eventListeners[i]; i++) {
                listener(data);
            };
            return true;
        }
        return false;
    }
}
