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
    undoRedo.history.changesetsFore = [];
    // this is a flag for future actions. For example, on undo, when this flag
    // is true, the state is saved as an undo point before undoing. Otherwise,
    // this state would have been lost forever.
    undoRedo.hasUnregisteredEdits = true;
};
