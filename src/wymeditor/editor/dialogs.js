"use strict";
/**
    editor.dialog
    =============

    Open a dialog box
*/
WYMeditor.editor.prototype.dialog = function (dialogName) {
    var wym = this,
        i,
        DIALOGS = WYMeditor.DIALOGS,
        dialog,
        wDialog,
        strWindowName,
        htmlStrReplacements,
        dialogHtml,
        doc;

    // Loops through the available dialogs and assigns the desired dialog,
    // according to the provided `dialogName` to `dialog`. Throws if not found.
    for (i = 0; i < DIALOGS.length; i++) {
        dialog = DIALOGS[i];
        if (dialog.name === dialogName) {
            break;
        }
        if (i + 1 === DIALOGS.length) {
            throw "No such dialog";
        }
    }

    // Return `false` early if this dialog should not open. Use the dialog's
    // own function to check this.
    if (dialog.shouldOpen.call(wym) !== true) {
        return false;
    }

    // `strWindowName` is unique in order to make testing dialogs in Trident 7
    // simpler. This means that an infinite number of dialog windows may be
    // opened concurrently. Ideally, `strWindowName` should be a constant
    // so that a single dialog window will be reused. This will make testing in
    // Trident 7 slightly more complex, as it seems that `window.close()` is
    // performed asynchronously.
    strWindowName = wym.uniqueStamp();
    wDialog = window.open(
        '',
        strWindowName,
        dialog.features ? dialog.features : wym._options.dialogFeatures
    );
    if (
        typeof wDialog !== "object" ||
        wDialog.window !== wDialog
    ) {
        WYMeditor.console.warn("Could not create a dialog window");
        return false;
    }

    // Construct the dialog
    dialogHtml = wym._options.dialogHtml;

    // HTML string replacements
    htmlStrReplacements = [
        {
            placeholder: WYMeditor.BASE_PATH,
            replacement: wym._options.basePath
        },
        {
            placeholder: WYMeditor.DIRECTION,
            replacement: wym._options.direction
        },
        {
            placeholder: WYMeditor.WYM_PATH,
            replacement: wym._options.wymPath
        },
        {
            placeholder: WYMeditor.JQUERY_PATH,
            replacement: wym._options.jQueryPath
        },
        {
            placeholder: WYMeditor.DIALOG_TITLE,
            replacement: dialog.title
        },
        {
            placeholder: WYMeditor.DIALOG_BODY,
            replacement: dialog.getHtml.call(wym)
        },
        {
            placeholder: WYMeditor.INDEX,
            replacement: wym._index
        }
    ];

    for (i = 0; i < htmlStrReplacements.length; i++) {
        dialogHtml = WYMeditor.Helper.replaceAllInStr(
            dialogHtml,
            htmlStrReplacements[i].placeholder,
            htmlStrReplacements[i].replacement
        );
    }

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
        shouldOpen: function () {
            var wym = this;
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
        shouldOpen: function () {
            var wym = this;
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
        shouldOpen: function () {
            var wym = this;
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
        shouldOpen: function () {
            var wym = this;
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
