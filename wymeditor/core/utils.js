Wymeditor.core.utils = {
    slice: function (arr) {
        return Array.prototype.slice.call(arr, Array.prototype.slice.call(arguments, 1));
    }
};