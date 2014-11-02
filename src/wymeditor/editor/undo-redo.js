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
        wym = undoRedo.wym;

    undoRedo.history.add(wym.getCurrentState());
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

    if (what === 'un') {
        if (history.changesetsBack.length === 0) {
            return;
        }
        history.backward();
        postEventName = 'postUndo';
    } else if (what === 're') {
        if (history.changesetsFore.length === 0) {
            return;
        }
        history.forward();
        postEventName = 'postRedo';
    } else {
        throw "Single parameter must be either `'un'` or `'re'`.";
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

    wym.undoRedo = new WYMeditor.UndoRedo(wym);
};
