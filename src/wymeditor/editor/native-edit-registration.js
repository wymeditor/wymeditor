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
        function () {
            nativeEditRegistration._onNativeEdit.call(nativeEditRegistration);
        }
    );
};

/**
    WYMeditor.NativeEditRegistration._onNativeEdit
    ==============================================

    Handles native edits for the purpose of Undo/Redo.
*/
WYMeditor.NativeEditRegistration.prototype._onNativeEdit = function () {
    var nativeEditRegistration = this;

    nativeEditRegistration.wym.registerModification();
};
