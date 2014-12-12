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
