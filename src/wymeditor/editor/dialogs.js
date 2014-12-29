"use strict";
/**
    editor.dialog
    =============

    Open a dialog box
*/
WYMeditor.editor.prototype.dialog = function (
    dialogName,
    dialogFeatures,
    bodyHtml
) {
    var wym = this,
        i,
        DIALOGS = WYMeditor.DIALOGS,
        dialog,
        features = dialogFeatures || wym._options.dialogFeatures,
        wDialog,
        sBodyHtml,
        strWindowName,
        h = WYMeditor.Helper,
        dialogHtml,
        doc;

    for (i = 0; i < DIALOGS.length; i++) {
        dialog = DIALOGS[i];
        if (dialog.name === dialogName) {
            break;
        }
        if (i === DIALOGS.length) {
            throw "No such dialog";
        }
    }
    if (dialog.shouldOpen(wym) !== true) {
        return false;
    }

    sBodyHtml = dialog ? dialog.getHtml.call(wym) : bodyHtml;

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
        dialog.title
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

WYMeditor.DIALOGS = [
    {
        name: "CreateLink",
        title: "Link",
        shouldOpen: function (wym) {
            if (
                wym.hasSelection() !== true ||
                wym.selection().isCollapsed === true ||
                wym.selectedContainer() === false
            ) {
                return false;
            }
            return true;
        },
        getHtml: function () {
            var wym = this;
            return wym._options.dialogLinkHtml;
        }
    },
    {
        name: "InsertImage",
        title: "Image",
        shouldOpen: function (wym) {
            if (
                wym.hasSelection() !== true ||
                wym.selection().isCollapsed !== true
            ) {
                return false;
            }
            return true;
        },
        getHtml: function () {
            var wym = this;
            return wym._options.dialogImageHtml;
        }
    },
    {
        name: "InsertTable",
        title: "Table",
        shouldOpen: function (wym) {
            if (
                wym.hasSelection() !== true ||
                wym.selection().isCollapsed !== true
            ) {
                return false;
            }
            return true;
        },
        getHtml: function () {
            var wym = this;
            return wym._options.dialogTableHtml;
        }
    },
    {
        name: "Paste",
        title: "Paste from Word",
        shouldOpen: function (wym) {
            if (
                wym.hasSelection() !== true ||
                wym.selection().isCollapsed !== true
            ) {
                return false;
            }
            return true;
        },
        getHtml: function () {
            var wym = this;
            return wym._options.dialogPasteHtml;
        }
    },
    {
        name: "Preview",
        title: "Preview",
        shouldOpen: function () {
            return true;
        },
        getHtml: function () {
            var wym = this;
            return wym._options.dialogPreviewHtml;
        }
    }
];

WYMeditor.DIALOG_TITLE = "{Wym_Dialog_Title}";
WYMeditor.DIALOG_BODY = "{Wym_Dialog_Body}";
