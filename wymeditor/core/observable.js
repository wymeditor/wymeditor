Wymeditor.Observable = function Observable () {
    this._listeners = {};
}
Wymeditor.Observable.prototype = {
    /*
     * listen
     */
    addListener: function (eventName, callback) {
        if (!Wymeditor.utils.is('String', eventName) || !Wymeditor.utils.is('Function', callback)) {
            throw new Error('Invalid arguments: eventName must be a string and callback a function.');
        }
        eventName = eventName.toLowerCase();
        this._listeners[eventName] = this._listeners[eventName] || [];
        this._listeners[eventName].push(callback);
    },

    /*
     * removeListener
     */
    removeListener: function (eventName, callback) {
        var listeners = [], 
            listener, 
            i;

        if (!Wymeditor.utils.is('String', eventName) || !Wymeditor.utils.is('Function', callback)) {
            throw new Error('Invalid arguments: eventName must be a string and callback a function.');
        }

        eventListeners = this._listeners[eventName.toLowerCase()] || false;

        if (eventListeners) {

            for (i = 0; listener = eventListeners[i]; i++) {
                if (listener !== callback) {
                    listeners.push(listener);
                }
            };

            eventListeners = listeners;
        }
    },

    /*
     * fire
     */
    fireEvent: function (eventName, data) {
        var listener, 
            i;

        if (!Wymeditor.utils.is('String', eventName)) {
            throw new Error('Invalid arguments: eventName must be a string.');
        }

        eventName = eventName.toLowerCase();
        data = data || {};
        data.name = eventName;
        data.source = this;

        eventListeners = eventName in this._listeners &&
                            this._listeners[eventName] || false;

        if (eventListeners) {
            for (i = 0; listener = eventListeners[i]; i++) {
                listener(data);
            };
        }
    }
}
