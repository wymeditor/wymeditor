/* jshint evil: true, maxlen: 100 */
/* global ObjectHistory, rangy */
"use strict";

/*
 * Undo/Redo
 */

/**
    WYMeditor.UndoRedo
    ==================

    Returns an undoRedo mechanism for a provided editor.

    @param wym An editor instance.
*/
WYMeditor.UndoRedo = function (wym) {
    var undoRedo = this;

    undoRedo.wym = wym;

    // https://github.com/mightyiam/object-history
    undoRedo.history = new ObjectHistory(wym.getCurrentState());
};

/**
    WYMeditor.UndoRedo._add
    =======================

    Adds a history point.
*/

WYMeditor.UndoRedo.prototype._add = function () {
    var undoRedo = this,
        wym = undoRedo.wym,
        currentState;

    currentState = wym.getCurrentState();

    if (currentState.savedSelection) {
        // These refer to the window and the document and can't be processed by
        // the ObjectHistory module. Since they won't be changing, we cant just
        // add them back.
        delete currentState.savedSelection.win;
        delete currentState.savedSelection.doc;
    }

    undoRedo.history.add(currentState);
};

/**
    WYMeditor.UndoRedo._do
    ======================

    Performs either undo or redo.

    @param what A string, either 'un' or 're'.
*/
WYMeditor.UndoRedo.prototype._do = function (what) {
    var undoRedo = this,
        wym = undoRedo.wym,
        history = undoRedo.history,
        state,
        historyChangesetsName,
        historyFunctionName,
        postEventName;

    if (what === 'un') {
        historyChangesetsName = 'changesetsBack';
        historyFunctionName = 'backward';
        postEventName = 'postUndo';
    } else if (what === 're') {
        historyChangesetsName = 'changesetsFore';
        historyFunctionName = 'forward';
        postEventName = 'postRedo';
    } else {
        throw "Single parameter must be either `'un'` or `'re'`.";
    }

    if (history[historyChangesetsName].length === 0) {
        return;
    }

    history[historyFunctionName]();
    state = history.get();
    wym.rawHtml(state.html);

    if (state.savedSelection) {
        // These two were deleted in `UndoRedo._add`.
        state.savedSelection.win = wym._iframe.contentWindow;
        state.savedSelection.doc = wym._doc;
        rangy.restoreSelection(state.savedSelection);
    }

    jQuery(wym.element).trigger(WYMeditor.EVENTS[postEventName]);
};

/**
    WYMeditor.UndoRedo.redo
    =======================
*/
WYMeditor.UndoRedo.prototype.redo = function () {
    var undoRedo = this;

    undoRedo._do('re');
};

/**
    WYMeditor.UndoRedo.undo
    =======================
*/
WYMeditor.UndoRedo.prototype.undo = function () {
    var undoRedo = this;

    undoRedo._do('un');
};

