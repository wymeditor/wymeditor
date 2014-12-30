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
        dialogWindowFeatures,
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

    dialogWindowFeatures = wym._options.dialogFeatures || [
        "menubar=no",
        "titlebar=no",
        "toolbar=no",
        "resizable=no",
        "width=560",
        "height=300",
        "top=0",
        "left=0"
    ].join(",");

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
        dialog.windowFeatures || dialogWindowFeatures
    );

    if (
        typeof wDialog !== "object" ||
        wDialog.window !== wDialog
    ) {
        WYMeditor.console.warn("Could not create a dialog window");
        return false;
    }

    // Construct the dialog
    dialogHtml = wym._options.dialogHtml || String() +
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' +
                '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
        '<html dir="' + WYMeditor.DIRECTION + '">' +
            '<head>' +
                '<title>' + WYMeditor.DIALOG_TITLE + '</title>' +
            '</head>' +
            WYMeditor.DIALOG_BODY +
        '</html>';

    // HTML template replacements
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
            placeholder: WYMeditor.DIALOG_TITLE,
            replacement: wym._encloseString(dialog.title)
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

    // Perform HTML template replacements
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

    wym._initDialog(wDialog);

    return wDialog;
};

/*
 * An array of our default dialog objects.
 * Each has the following properties:
 * String `name`
 *     A unique identifier
 * String `title`
 *     Dialog window title.
 * Function `shouldOpen`
 *     Its return value determines whether the dialog should be opened or not.
 *     Is called with the editor as `this`.
 * Function `getHtml`
 *     Used to provide the dialog's body's HTML. Is called with the editor as
 *     `this`.
 */
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
            return wym._options.dialogLinkHtml || String() +
                '<body class="wym_dialog wym_dialog_link">' +
                    '<form>' +
                        '<fieldset>' +
                            '<input type="hidden" class="wym_dialog_type" ' +
                                'value="' + WYMeditor.DIALOG_LINK + '" />' +
                            '<legend>{Link}</legend>' +
                            '<div class="row">' +
                                '<label>{URL}</label>' +
                                '<input type="text" class="wym_href" ' +
                                    'value="" size="40" ' +
                                    'autofocus="autofocus" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Title}</label>' +
                                '<input type="text" class="wym_title" ' +
                                    'value="" size="40" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Relationship}</label>' +
                                '<input type="text" class="wym_rel" ' +
                                    'value="" size="40" />' +
                            '</div>' +
                            '<div class="row row-indent">' +
                                '<input class="wym_submit" type="submit" ' +
                                    'value="{Submit}" />' +
                                '<input class="wym_cancel" type="button" ' +
                                    'value="{Cancel}" />' +
                            '</div>' +
                        '</fieldset>' +
                    '</form>' +
                '</body>';
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
            return wym._options.dialogImageHtml || String() +
                '<body class="wym_dialog wym_dialog_image">' +
                    '<form>' +
                        '<fieldset>' +
                            '<input type="hidden" class="wym_dialog_type" ' +
                                'value="' + WYMeditor.DIALOG_IMAGE + '" />' +
                            '<legend>{Image}</legend>' +
                            '<div class="row">' +
                                '<label>{URL}</label>' +
                                '<input type="text" class="wym_src" ' +
                                    'value="" size="40" ' +
                                    'autofocus="autofocus" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Alternative_Text}</label>' +
                                '<input type="text" class="wym_alt" ' +
                                    'value="" size="40" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Title}</label>' +
                                '<input type="text" class="wym_title" ' +
                                    'value="" size="40" />' +
                            '</div>' +
                            '<div class="row row-indent">' +
                                '<input class="wym_submit" type="submit" ' +
                                    'value="{Submit}" />' +
                                '<input class="wym_cancel" type="button" ' +
                                    'value="{Cancel}" />' +
                            '</div>' +
                        '</fieldset>' +
                    '</form>' +
                '</body>';
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
            return wym._options.dialogTableHtml || String() +
                '<body class="wym_dialog wym_dialog_table">' +
                    '<form>' +
                        '<fieldset>' +
                            '<input type="hidden" class="wym_dialog_type" ' +
                                'value="' + WYMeditor.DIALOG_TABLE + '" />' +
                            '<legend>{Table}</legend>' +
                            '<div class="row">' +
                                '<label>{Caption}</label>' +
                                '<input type="text" class="wym_caption" ' +
                                    'value="" size="40" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Summary}</label>' +
                                '<input type="text" class="wym_summary" ' +
                                    'value="" size="40" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Number_Of_Rows}</label>' +
                                '<input type="text" class="wym_rows" ' +
                                    'value="3" size="3" />' +
                            '</div>' +
                            '<div class="row">' +
                                '<label>{Number_Of_Cols}</label>' +
                                '<input type="text" class="wym_cols" ' +
                                    'value="2" size="3" />' +
                            '</div>' +
                            '<div class="row row-indent">' +
                                '<input class="wym_submit" type="submit" ' +
                                    'value="{Submit}" />' +
                                '<input class="wym_cancel" type="button" ' +
                                    'value="{Cancel}" />' +
                            '</div>' +
                        '</fieldset>' +
                    '</form>' +
                '</body>';
        }
    },
    {
        name: "Paste",
        title: "Paste_From_Word",
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
            return wym._options.dialogPasteHtml || String() +
                '<body class="wym_dialog wym_dialog_paste">' +
                    '<form>' +
                        '<input type="hidden" class="wym_dialog_type" ' +
                            'value="' + WYMeditor.DIALOG_PASTE + '" />' +
                        '<fieldset>' +
                            '<legend>{Paste_From_Word}</legend>' +
                            '<div class="row">' +
                                '<textarea class="wym_text" rows="10" ' +
                                    'cols="50" autofocus="autofocus">' +
                                '</textarea>' +
                            '</div>' +
                            '<div class="row">' +
                                '<input class="wym_submit" type="submit" ' +
                                    'value="{Submit}" />' +
                                '<input class="wym_cancel" type="button" ' +
                                    'value="{Cancel}" />' +
                            '</div>' +
                        '</fieldset>' +
                    '</form>' +
                '</body>';
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
            return wym._options.dialogPreviewHtml || String() +
                '<body class="wym_dialog wym_dialog_preview"></body>';
        },
        windowFeatures: wym._options.dialogFeaturesPreview || [
            "menubar=no",
            "titlebar=no",
            "toolbar=no",
            "resizable=no",
            "width=560",
            "height=300",
            "top=0",
            "left=0",
            "scrollbars=yes"
        ].join(",")
    }
];

WYMeditor.editor.prototype._initDialog = function (wDialog) {
    var wym = this,
        doc = wDialog.document,
        selected = wym.selectedContainer(),
        dialogType = jQuery(wym._options.dialogTypeSelector).val();

    wDialog.onbeforeunload = function () {
        wym.focusOnDocument();
    };

    if (dialogType === WYMeditor.DIALOG_LINK) {
        // ensure that we select the link to populate the fields
        if (selected && selected.tagName &&
                selected.tagName.toLowerCase !== WYMeditor.A) {
            selected = jQuery(selected).parentsOrSelf(WYMeditor.A);
        }
    }

    // pre-init functions
    if (jQuery.isFunction(wym._options.preInitDialog)) {
        wym._options.preInitDialog(wym, wDialog);
    }

    // auto populate fields if selected container (e.g. A)
    if (selected) {
        jQuery(wym._options.hrefSelector, doc).val(jQuery(selected)
            .attr(WYMeditor.HREF));
        jQuery(wym._options.srcSelector, doc).val(jQuery(selected)
            .attr(WYMeditor.SRC));
        jQuery(wym._options.titleSelector, doc).val(jQuery(selected)
            .attr(WYMeditor.TITLE));
        jQuery(wym._options.relSelector, doc).val(jQuery(selected)
            .attr(WYMeditor.REL));
        jQuery(wym._options.altSelector, doc).val(jQuery(selected)
            .attr(WYMeditor.ALT));
    }

    jQuery(
        wym._options.dialogLinkSelector + " " + wym._options.submitSelector,
        doc
    ).submit(function () {
        var href = jQuery(wym._options.hrefSelector, doc).val(),
            title = jQuery(wym._options.titleSelector, doc).val(),
            rel = jQuery(wym._options.relSelector, doc).val();

        wym.link({
            href: href,
            title: title,
            rel: rel
        });
        wDialog.close();
    });

    jQuery(
        wym._options.dialogImageSelector + " " + wym._options.submitSelector,
        doc
    ).submit(function () {
        var imgAttrs = {
            src: jQuery(wym._options.srcSelector, doc).val(),
            title: jQuery(wym._options.titleSelector, doc).val(),
            alt: jQuery(wym._options.altSelector, doc).val()
        };

        wym.focusOnDocument();
        wym.insertImage(imgAttrs);
        wDialog.close();
    });

    jQuery(
        wym._options.dialogTableSelector + " " + wym._options.submitSelector,
        doc
    ).submit(function () {
        var numRows = jQuery(wym._options.rowsSelector, doc).val(),
            numColumns = jQuery(wym._options.colsSelector, doc).val(),
            caption = jQuery(wym._options.captionSelector, doc).val(),
            summary = jQuery(wym._options.summarySelector, doc).val();

        wym.insertTable(numRows, numColumns, caption, summary);
        wDialog.close();
    });

    jQuery(
        wym._options.dialogPasteSelector + " " + wym._options.submitSelector,
        doc
    ).submit(function () {
        var sText = jQuery(wym._options.textSelector, doc).val();
        wym.paste(sText);
        wDialog.close();
    });

    jQuery(
        wym._options.dialogPreviewSelector + " " +
            wym._options.previewSelector,
        doc
    ).html(wym.html());

    //cancel button
    jQuery(
        wym._options.cancelSelector,
        doc
    ).click(function () {
        wDialog.close();
    });

    //pre-init functions
    if (jQuery.isFunction(wym._options.postInitDialog)) {
        wym._options.postInitDialog(wym, wDialog);
    }
};

WYMeditor.DIALOG_TITLE = "{Wym_Dialog_Title}";
WYMeditor.DIALOG_BODY = "{Wym_Dialog_Body}";
WYMeditor.DIALOG_BUTTON_SELECTOR = ".wym_opens_dialog a";
