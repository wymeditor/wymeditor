Wymeditor.Range = function () {
    if (window.getSelection) { // W3C Range
    } else if (document.selection) { // IE TextRange
    }
};
Wymeditor.Range.prototype = {
    isCollapsed: function () {},

    insert: function () {},
    replace: function () {},

    wrap: function () {},
    unwrap: function () {}
}