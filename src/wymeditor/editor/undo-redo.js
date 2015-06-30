/* global
    rangy
*/
"use strict";

/*
 * Undo/Redo
 */

/**
    WYMeditor.UndoRedo
    ==================

    Constructs an undoRedo mechanism for a provided editor.

    Also sets keyboard shortcuts for undo and redo.

    @param wym An editor instance.
*/
WYMeditor.UndoRedo = function (wym) {
    var undoRedo = this;

    undoRedo.wym = wym;

    wym.keyboard.combokeys.bind(
        "mod+z",
        function () {
            wym.undoRedo.undo();
            // Prevents native action. Caution: not covered by tests.
            return false;
        }
    );
    wym.keyboard.combokeys.bind(
        ["shift+meta+z", "mod+y"],
        function () {
            wym.undoRedo.redo();
            // Prevents native action. Caution: not covered by tests.
            return false;
        }
    );
};

/**
    WYMeditor.UndoRedo._onBodyFocus
    ===============================

    This method should be called on focus of the document's body.

    It makes sure that the first undo point contains a selection.

    After the editor's instantiation there is no selection. The first
    selection is made along with the first focus.

    This method will run before the native action (in which the selection
    is made). Therefore the instantiation of object-history is called using
    `setTimeout`, which is after the selection happens.
*/
WYMeditor.UndoRedo.prototype._onBodyFocus = function () {
    var undoRedo = this,
        wym = undoRedo.wym;

    if (undoRedo.history) {
        return;
    }

    setTimeout(function () {
        undoRedo._instantiateHistory(wym.getCurrentState());
    }, 0);
};

/**
    WYMeditor.UndoRedo._add
    =======================

    Adds a history point.
*/

WYMeditor.UndoRedo.prototype._add = function () {
    var undoRedo = this,
        wym = undoRedo.wym;

    if (!undoRedo.history) {
        // history was not instantiated yet
        return;
    }

    undoRedo.history.add(wym.getCurrentState());
    undoRedo.hasUnregisteredModification = false;
};

/**
    WYMeditor.UndoRedo._do
    ======================

    Performs either undo or redo.

    @param what One of two possible constants:
        * `WYMeditor.UndoRedo.UN`
        * `WYMeditor.UndoRedo.RE`
*/
WYMeditor.UndoRedo.prototype._do = function (what) {
    var undoRedo = this,
        wym = undoRedo.wym,
        history = undoRedo.history,
        state,
        postEventName;

    if (!undoRedo.history) {
        // history was not instantiated yet
        return;
    }

    if (what === WYMeditor.UndoRedo.UN) {
        if (history.lengthBackward() === 0) {
            return;
        }
        if (undoRedo.hasUnregisteredModification) {
            // in order to be able to 'redo' to this yet unregistered state
            undoRedo._add();
        }
        history.backward();
        postEventName = 'postUndo';
    } else if (what === WYMeditor.UndoRedo.RE) {
        if (history.lengthForward() === 0) {
            return;
        }
        history.forward();
        postEventName = 'postRedo';
    } else {
        throw "Single parameter must be either `'un'` or `'re'` " +
            "(there are constants for those).";
    }

    state = history.get();
    wym.rawHtml(state.html);

    if (state.savedSelection) {
        // The `contentWindow` and `document` (`win` and `doc` properties) were
        // deleted before the state was saved. See `editor.getCurrentState`
        // code comments to understand why.
        //
        // Restore them now.
        state.savedSelection.win = wym._iframe.contentWindow;
        state.savedSelection.doc = wym._doc;
        rangy.restoreSelection(state.savedSelection);
    }

    jQuery(wym.element).trigger(WYMeditor.EVENTS[postEventName]);
};
WYMeditor.UndoRedo.UN = 'un';
WYMeditor.UndoRedo.RE = 're';

/**
    WYMeditor.UndoRedo.redo
    =======================
*/
WYMeditor.UndoRedo.prototype.redo = function () {
    var undoRedo = this;

    undoRedo._do(WYMeditor.UndoRedo.RE);
};

/**
    WYMeditor.UndoRedo.undo
    =======================
*/
WYMeditor.UndoRedo.prototype.undo = function () {
    var undoRedo = this;

    undoRedo._do(WYMeditor.UndoRedo.UN);
};

/**
    WYMeditor.UndoRedo.reset
    ========================

    Forgets all changes.
*/
WYMeditor.UndoRedo.prototype.reset = function () {
    var undoRedo = this,
        wym = undoRedo.wym;

    undoRedo._instantiateHistory(wym.getCurrentState());

    undoRedo.hasUnregisteredModification = null;
};

/**
    WYMeditor.UndoRedo._instantiateHistory
    ======================================

    Instantiates object-history[1] to keep track of undo/redo
    history.

    @param WymState initialState Initial editor state.
        Obtained with `wym.getCurrentState()`.

    1. https://github.com/PolicyStat/object-history
*/
WYMeditor.UndoRedo.prototype._instantiateHistory = function (initialState) {
    var undoRedo = this;

    undoRedo.history = new WYMeditor.EXTERNAL_MODULES
        .ObjectHistory(
            initialState,
            {limit: 100} // hard coded undo limit
        );
};
