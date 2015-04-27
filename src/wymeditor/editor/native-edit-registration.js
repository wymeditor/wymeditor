"use strict";

/*
 * Native edits
 */

/**
    WYMeditor.NativeEditRegistration
    ================================

    Constructs a native edits registration mechanism for a provided editor.
*/
WYMeditor.NativeEditRegistration = function (wym) {
    var nativeEditRegistration = this;

    nativeEditRegistration.wym = wym;


    // https:/github.com/mightyiam/edited
    nativeEditRegistration.edited = new WYMeditor.EXTERNAL_MODULES.Edited(
        wym._doc.body,
        nativeEditRegistration._onSensibleNativeEdit
            .bind(nativeEditRegistration),
        nativeEditRegistration._onAnyNativeEdit
            .bind(nativeEditRegistration)
    );
};

/**
    WYMeditor.NativeEditRegistration._onSensibleNativeEdit
    ======================================================

    Handles "sensible" native edits.
    Sensible according to https://github.com/PolicyStat/edited
*/
WYMeditor.NativeEditRegistration.prototype
    ._onSensibleNativeEdit = function () {

    var nativeEditRegistration = this;
    nativeEditRegistration.wym.registerModification(true);
};

/**
    WYMeditor.NativeEditRegistration._onAnyNativeEdit
    =================================================

    Handles all native edits.
*/
WYMeditor.NativeEditRegistration.prototype._onAnyNativeEdit = function () {
    var nativeEditRegistration = this,
        undoRedo = nativeEditRegistration.wym.undoRedo;

    // remove redo points
    if (undoRedo.history) {
        undoRedo.history.forgetAllForward();
    }

    // Non-native modifications are registered when they are performed.
    // Contrary to those, native edits (e.g. typing) aren't registered 
    // until word boundaries are reached (space, enter) or edit actions 
    // (backspace, delete, cut, paste, etc). 
    // This handles an undo after e.g. only part of word is typed.
    //
    // A state with unregistered modifications will be lost upon an undo
    // and redo because it was never registered.
    // The last registered state doesn't include it and that will be the result
    // of the undo and redo operation.
    // This flag lets the undo operation know that it should add the current
    // state as a history point (register it) before undoing.
    // Then the next redo will revert to this state.
    undoRedo.hasUnregisteredModification = true;
};
