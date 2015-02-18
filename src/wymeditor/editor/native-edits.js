"use strict";

/*
 * Native edits
 */

/**
    WYMeditor.NativeEdits
    =====================

    Constructs a native edits handling mechanism for a provided editor.
*/
WYMeditor.NativeEdits = function (wym) {
    var nativeEdits = this;

    nativeEdits.wym = wym;


    // https:/github.com/mightyiam/edited
    nativeEdits.edited = new WYMeditor.EXTERNAL_MODULES.Edited(
        wym._doc.body,
        function () {
            nativeEdits._onNativeEdit.call(nativeEdits);
        }
    );
};

/**
    WYMeditor.NativeEdits._onNativeEdit
    ===================================

    Handles native edits for the purpose of Undo/Redo.
*/
WYMeditor.NativeEdits.prototype._onNativeEdit = function () {
    var nativeEdits = this;

    nativeEdits.wym.registerModification();
};
