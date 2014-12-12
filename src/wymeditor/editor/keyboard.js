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
            this.exec(WYMeditor.EXEC_COMMANDS.BOLD);
            return false;
        }
    },
    {
        combo: "mod+i",
        cb: function () {
            this.exec(WYMeditor.EXEC_COMMANDS.ITALIC);
            return false;
        }
    },
    {
        combo: "mod+k",
        cb: function () {
            this.exec(WYMeditor.EXEC_COMMANDS.CREATE_LINK);
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
                    cb.call(wym);
                };
            }(shortcut.cb))
            /* jshint loopfunc:false */
        );
    }
};
