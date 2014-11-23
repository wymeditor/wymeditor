"use strict";
/* global
    Combokeys
*/
WYMeditor.Keyboard = function (wym) {
    var keyboard = this;

    keyboard._wym = wym;

    keyboard.combokeys = new Combokeys(wym._doc);

    return keyboard;
};

WYMeditor.Keyboard.DEFAULT_KEYBOARD_SHORTCUTS = [
    {
        combo: "ctrl+b",
        cb: function () {
            this._exec(WYMeditor.EXEC_COMMANDS.BOLD);
            return false;
        }
    },
    {
        combo: "ctrl+i",
        cb: function () {
            this._exec(WYMeditor.EXEC_COMMANDS.ITALIC);
            return false;
        }
    }
];


/**
    WYMeditor.keyboard._attachDefaultKeyboardShortcuts
    ================================================

    Attaches the keyboard shortcuts handler to the document.
*/
WYMeditor.Keyboard.prototype._attachDefaultKeyboardShortcuts = function () {
    var keyboard = this,
        SHORTCUTS = keyboard.constructor.DEFAULT_KEYBOARD_SHORTCUTS,
        shortcut,
        i;

    for (i = 0; i < SHORTCUTS.length; i++) {
        shortcut = SHORTCUTS[i];
        keyboard.combokeys.bind(
            shortcut.combo,
            shortcut.cb.bind(keyboard._wym)
        );
    }
};
