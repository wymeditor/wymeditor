"use strict";
/**
    editor.dialog
    =============

    Open a dialog box
*/
WYMeditor.editor.prototype.dialog = function (
    dialogType,
    dialogFeatures,
    bodyHtml
) {
    var wym = this,
        features = dialogFeatures || wym._options.dialogFeatures,
        wDialog,
        sBodyHtml,
        strWindowName,
        h = WYMeditor.Helper,
        dialogHtml,
        doc;

    if (wym._shouldDialogOpen(dialogType) !== true) {
        return false;
    }

    sBodyHtml = "";

    switch (dialogType) {

        case (WYMeditor.DIALOG_LINK):
            sBodyHtml = wym._options.dialogLinkHtml;
            break;
        case (WYMeditor.DIALOG_IMAGE):
            sBodyHtml = wym._options.dialogImageHtml;
            break;
        case (WYMeditor.DIALOG_TABLE):
            sBodyHtml = wym._options.dialogTableHtml;
            break;
        case (WYMeditor.DIALOG_PASTE):
            sBodyHtml = wym._options.dialogPasteHtml;
            break;
        case (WYMeditor.EXEC_COMMANDS.PREVIEW):
            sBodyHtml = wym._options.dialogPreviewHtml;
            break;
        default:
            sBodyHtml = bodyHtml;
            break;
    }

    // `strWindowName` is unique in order to make testing dialogs in Trident 7
    // simpler. This means that an infinite number of dialog windows may be
    // opened concurrently. Ideally, `strWindowName` should be a constant
    // so that a single dialog window will be reused. This will make testing in
    // Trident 7 slightly more complex, as it seems that `window.close()` is
    // performed asynchronously.
    strWindowName = wym.uniqueStamp();
    wDialog = window.open('', strWindowName, features);
    if (
        typeof wDialog !== "object" ||
        wDialog.window !== wDialog
    ) {
        WYMeditor.console.warn("Could not create a dialog window");
        return false;
    }

    // Construct the dialog
    dialogHtml = wym._options.dialogHtml;
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.BASE_PATH,
        wym._options.basePath
    );
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.DIRECTION,
        wym._options.direction
    );
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.WYM_PATH,
        wym._options.wymPath
    );
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.JQUERY_PATH,
        wym._options.jQueryPath
    );
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.DIALOG_TITLE,
        wym._encloseString(dialogType)
    );
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.DIALOG_BODY,
        sBodyHtml
    );
    dialogHtml = h.replaceAllInStr(
        dialogHtml,
        WYMeditor.INDEX,
        wym._index
    );

    dialogHtml = wym.replaceStrings(dialogHtml);

    doc = wDialog.document;
    doc.write(dialogHtml);
    doc.close();
    return wDialog;
};


/**
    editor._shouldDialogOpen
    ========================

    Returns true if the provided dialog type should open.
*/
WYMeditor.editor.prototype._shouldDialogOpen = function (dialogType) {
    var wym = this,
        DIALOGS = {},
        hasSelection,
        selection,
        selectedContainer;

    if (typeof dialogType !== "string") {
        throw "Expected a string";
    }

    DIALOGS[WYMeditor.DIALOG_LINK] = function () {
        if (
            hasSelection !== true ||
            selection.isCollapsed === true ||
            selectedContainer === false
        ) {
            return false;
        }
        return true;
    };
    DIALOGS[WYMeditor.DIALOG_IMAGE] = function () {
        if (
            hasSelection !== true ||
            selection.isCollapsed !== true
        ) {
            return false;
        }
        return true;
    };
    DIALOGS[WYMeditor.DIALOG_TABLE] = function () {
        if (
            hasSelection !== true ||
            selection.isCollapsed !== true
        ) {
            return false;
        }
        return true;
    };
    DIALOGS[WYMeditor.DIALOG_PASTE] = function () {
        if (
            hasSelection !== true ||
            selection.isCollapsed !== true
        ) {
            return false;
        }
        return true;
    };
    DIALOGS[WYMeditor.EXEC_COMMANDS.PREVIEW] = function () {
        return true;
    };

    if (DIALOGS.hasOwnProperty(dialogType) !== true) {
        throw "No such dialog type";
    }

    hasSelection = wym.hasSelection();
    if (hasSelection) {
        selection = wym.selection();
        selectedContainer = wym.selectedContainer();
    }

    return DIALOGS[dialogType]();
};
