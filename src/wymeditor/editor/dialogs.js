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
        doc,
        selectedContainer;

    if (DIALOGS.hasOwnProperty(dialogName) !== true) {
        throw "No such dialog";
    }

    dialog = DIALOGS[dialogName];

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
        dialog.windowFeatures ?
            dialog.windowFeatures.call(wym) : dialogWindowFeatures
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
            replacement: dialog.getBodyHtml.call(wym)
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
    jQuery(doc.body).addClass(dialog.bodyClass);
    doc.close();

    selectedContainer = wym.selectedContainer();

    wDialog.onbeforeunload = function () {
        wym.focusOnDocument();
    };

    // pre-init functions
    if (jQuery.isFunction(wym._options.preInitDialog)) {
        wym._options.preInitDialog(wym, wDialog);
    }

    // auto populate fields if selected container (e.g. A)
    if (selectedContainer) {
        jQuery(".wym_href", doc).val(jQuery(selectedContainer)
            .attr(WYMeditor.HREF));
        jQuery(".wym_src", doc).val(jQuery(selectedContainer)
            .attr(WYMeditor.SRC));
        jQuery(".wym_title", doc).val(jQuery(selectedContainer)
            .attr(WYMeditor.TITLE));
        jQuery(".wym_rel", doc).val(jQuery(selectedContainer)
            .attr(WYMeditor.REL));
        jQuery(".wym_alt", doc).val(jQuery(selectedContainer)
            .attr(WYMeditor.ALT));
    }

    if (dialog.submitHandler) {
        jQuery("form", doc).submit(function () {
            dialog.submitHandler.call(wym, wDialog);
        });
    }

    //cancel button
    jQuery(".wym_cancel", doc).click(function () {
        wDialog.close();
    });

    //pre-init functions
    if (jQuery.isFunction(wym._options.postInitDialog)) {
        wym._options.postInitDialog(wym, wDialog);
    }

    return wDialog;
};

/*
 * An object of default dialogs.
 *
 * Each has the following properties:
 * String `title`
 *     Dialog window title.
 * Function `shouldOpen`
 *     Its return value determines whether the dialog should be opened or not.
 *     Is called with the editor as `this`.
 * Function `getBodyHtml`
 *     Used to provide the dialog's body's HTML. Is called with the editor as
 *     `this`.
 * String `bodyClass`
 *     A class that will be added to the body of the dialog window's document.
 * Function `getWindowFeatures`
 *     Used to provide the dialog's window features, for passing to
 *     `window.open`. Is called with the editor as `this`.
 */
WYMeditor.DIALOGS = {
    link: {
        title: "Link",
        shouldOpen: function () {
            var wym = this,
                selectedContainer;
            if (wym.hasSelection() !== true) {
                return false;
            }
            selectedContainer = wym.selectedContainer();
            if (selectedContainer === false) {
                return false;
            }
            if (
                wym.selection().isCollapsed &&
                selectedContainer.tagName.toLowerCase() !== "a"
            ) {
                return false;
            }
            return true;
        },
        getBodyHtml: function () {
            return String() +
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
                '</form>';
        },
        bodyClass: "wym_dialog_link",
        submitHandler: function (wDialog) {
            var wym = this,
                href = jQuery(".wym_href", wDialog.document).val(),
                title = jQuery(".wym_title", wDialog.document).val(),
                rel = jQuery(".wym_rel", wDialog.document).val();

            wym.link({
                href: href,
                title: title,
                rel: rel
            });
            wDialog.close();
        }
    },
    image: {
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
        getBodyHtml: function () {
            return String() +
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
                '</form>';
        },
        bodyClass: "wym_dialog_image",
        submitHandler: function (wDialog) {
            var wym = this,
                imgAttrs = {
                    src: jQuery(".wym_src", wDialog.document).val(),
                    title: jQuery(".wym_title", wDialog.document).val(),
                    alt: jQuery(".wym_alt", wDialog.document).val()
                };

            wym.focusOnDocument();
            wym.insertImage(imgAttrs);
            wDialog.close();
        }
    },
    insertTable: {
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
        getBodyHtml: function () {
            return String() +
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
                '</form>';
        },
        bodyClass: "wym_dialog_table",
        submitHandler: function (wDialog) {
            var wym = this,
                numRows = jQuery(".wym_rows", wDialog.document).val(),
                numColumns = jQuery(".wym_cols", wDialog.document).val(),
                caption = jQuery(".wym_caption", wDialog.document).val(),
                summary = jQuery(".wym_summary", wDialog.document).val();

            wym.insertTable(numRows, numColumns, caption, summary);
            wDialog.close();
        }
    },
    paste: {
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
        getBodyHtml: function () {
            return String() +
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
                '</form>';
        },
        bodyClass: "wym_dialog_paste",
        submitHandler: function (wDialog) {
            var wym = this,
                sText = jQuery(".wym_text", wDialog.document).val();
            wym.paste(sText);
            wDialog.close();
        }
    },
    preview: {
        title: "Preview",
        shouldOpen: function () {
            return true;
        },
        getBodyHtml: function () {
            var wym = this;
            return wym.html();
        },
        windowFeatures: function () {
            return [
                "menubar=no",
                "titlebar=no",
                "toolbar=no",
                "resizable=no",
                "width=560",
                "height=300",
                "top=0",
                "left=0",
                "scrollbars=yes"
            ].join(",");
        },
        bodyClass: "wym_dialog_preview"
    }
};

WYMeditor.DIALOG_TITLE = "{Wym_Dialog_Title}";
WYMeditor.DIALOG_BODY = "{Wym_Dialog_Body}";
WYMeditor.DIALOG_BUTTON_SELECTOR = ".wym_opens_dialog a";
