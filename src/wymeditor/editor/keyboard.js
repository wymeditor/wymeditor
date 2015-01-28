"use strict";
WYMeditor.Keyboard = function (wym) {
    var keyboard = this;

    keyboard._wym = wym;

    keyboard.combokeys = new WYMeditor.EXTERNAL_MODULES.Combokeys(wym._doc);

    return keyboard;
};

WYMeditor.Keyboard.DEFAULT_KEYBOARD_SHORTCUTS = [
    {
        combo: "mod+b",
        cb: function () {
            var wym = this;
            wym.exec(WYMeditor.EXEC_COMMANDS.BOLD);
            // Prevents native action. Caution: not covered by tests.
            return false;
        }
    },
    {
        combo: "mod+i",
        cb: function () {
            var wym = this;
            wym.exec(WYMeditor.EXEC_COMMANDS.ITALIC);
            // Prevents native action. Caution: not covered by tests.
            return false;
        }
    },
    {
        combo: "mod+k",
        cb: function () {
            var wym = this;
            wym.dialog(WYMeditor.DIALOGS.CreateLink);
            // Prevents native action. Caution: not covered by tests.
            return false;
        }
    },
    {
        combo: "tab",
        cb: function () {
            // Default action of WebKit and Blink is to create a span.
            // See https://stackoverflow.com/q/22404724
            // For consistency across browsers, prevent the default action in
            // them all
            return false;
        }
    }
];

/**
    WYMeditor.keyboard._attachDefaultKeyboardShortcuts
    ================================================

    Binds the default keyboard shortcuts.
*/
WYMeditor.Keyboard.prototype._attachDefaultKeyboardShortcuts = function () {
    var keyboard = this,
        wym = keyboard._wym,
        SHORTCUTS = keyboard.constructor.DEFAULT_KEYBOARD_SHORTCUTS,
        shortcut,
        i;

    for (i = 0; i < SHORTCUTS.length; i++) {
        shortcut = SHORTCUTS[i];
        keyboard.combokeys.bind(
            shortcut.combo,
            // With `Function.prototype.bind` available, the expression below
            // can be simply `shortcut.cb.bind(wym)`.
            /* jshint loopfunc:true */
            (function (cb) {
                return function () {
                    // This return statement is for Combokeys to receive the
                    // `false` value of callbacks, for preventing default
                    // actions.
                    return cb.call(wym);
                };
            }(shortcut.cb))
            /* jshint loopfunc:false */
        );
    }
};
