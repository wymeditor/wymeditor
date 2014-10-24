/**
 * Copyright (c) 2011 PolicyStat LLC.
 * MIT licensed (MIT-license.txt)
 *
 * This plugin adds the ability to use tab and shift+tab to indent/outdent
 * lists, mimicking a user's expected behavior when inside an editor.
 *
 * @author Wes Winham (winhamwr@gmail.com)
 */

function ListPlugin(options, wym) {
    var listPlugin = this;
    ListPlugin._options = jQuery.extend({}, options);
    listPlugin._wym = wym;

    listPlugin.init();
}

ListPlugin.prototype.init = function() {
    var listPlugin = this;
    listPlugin._wym.listPlugin = listPlugin;

    listPlugin.bindEvents();
};

ListPlugin.prototype.bindEvents = function() {
    var listPlugin = this,
        wym = listPlugin._wym;

    // Bind a key listener so we can handle tabs
    // With jQuery 1.3, live() can be used to simplify handler logic
    jQuery(wym._doc).bind('keydown', listPlugin.handleKeyDown);
};

/**
 * Handle any tab presses when inside list items and indent/outdent.
 */
ListPlugin.prototype.handleKeyDown = function(evt) {
    var doc = this,
        wym = WYMeditor.INSTANCES[doc.title],
        listPlugin = wym.listPlugin,
        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
    // We only care about tabs when we're inside a list
    if (name != "li") {
        return null;
    }

    // Handle tab presses
    if (evt.which == WYMeditor.KEY_CODE.TAB) {
        if (evt.shiftKey) {
            wym.exec(WYMeditor.OUTDENT);
            return false; // Short-circuit normal tab behavior
        } else {
            wym.exec(WYMeditor.INDENT);
            return false;
        }
    }

    return null;
};
