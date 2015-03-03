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

    Handles native edits for the purpose of Undo/Redo.
*/
WYMeditor.NativeEditRegistration.prototype
    ._onSensibleNativeEdit = function () {

    var nativeEditRegistration = this;
    nativeEditRegistration.wym.registerModification(true);
};

/**
    WYMeditor.NativeEditRegistration._onAnyNativeEdit
    ==============================================

    Handles native edits for the purpose of Undo/Redo.
*/
WYMeditor.NativeEditRegistration.prototype._onAnyNativeEdit = function () {
    var nativeEditRegistration = this,
        undoRedo = nativeEditRegistration.wym.undoRedo;

    undoRedo.history.changesetsFore = [];
    undoRedo.hasUnregisteredEdits = true;
};
