/*jslint evil: true */
/**
    WYMeditor
    =========

    version @VERSION

    WYMeditor : what you see is What You Mean web-based editor

    Main JS file with core classes and functions.

    Copyright
    ---------

    Copyright (c) 2005 - 2010 Jean-Francois Hovinne, http://www.wymeditor.org/
    Dual licensed under the MIT (MIT-license.txt)
    and GPL (GPL-license.txt) licenses.

    Website
    -------

    For further information visit:
    http://www.wymeditor.org/


    Authors
    -------

    See AUTHORS file
*/

// Global WYMeditor namespace.
if (typeof(WYMeditor) === 'undefined') {
    WYMeditor = {};
}

// Wrap the Firebug console in WYMeditor.console
(function() {
    if (!window.console || !console.firebug) {
        var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
        "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

        WYMeditor.console = {};
        var noOp = function() {};
        for (var i = 0; i < names.length; ++i) {
            WYMeditor.console[names[i]] = noOp;
        }

    } else {
        WYMeditor.console = window.console;
    }
})();

jQuery.extend(WYMeditor, {

/**
    Constants
    =========

    Global WYMeditor constants.

    VERSION             - Defines WYMeditor version.
    INSTANCES           - An array of loaded WYMeditor.editor instances.
    STRINGS             - An array of loaded WYMeditor language pairs/values.
    SKINS               - An array of loaded WYMeditor skins.
    NAME                - The "name" attribute.
    INDEX               - A string replaced by the instance index.
    WYM_INDEX           - A string used to get/set the instance index.
    BASE_PATH           - A string replaced by WYMeditor's base path.
    SKIN_PATH           - A string replaced by WYMeditor's skin path.
    WYM_PATH            - A string replaced by WYMeditor's main JS file path.
    SKINS_DEFAULT_PATH  - The skins default base path.
    SKINS_DEFAULT_CSS   - The skins default CSS file.
    LANG_DEFAULT_PATH   - The language files default path.
    IFRAME_BASE_PATH    - A string replaced by the designmode iframe's base path.
    IFRAME_DEFAULT      - The iframe's default base path.
    JQUERY_PATH         - A string replaced by the computed jQuery path.
    DIRECTION           - A string replaced by the text direction (rtl or ltr).
    LOGO                - A string replaced by WYMeditor logo.
    TOOLS               - A string replaced by the toolbar's HTML.
    TOOLS_ITEMS         - A string replaced by the toolbar items.
    TOOL_NAME           - A string replaced by a toolbar item's name.
    TOOL_TITLE          - A string replaced by a toolbar item's title.
    TOOL_CLASS          - A string replaced by a toolbar item's class.
    CLASSES             - A string replaced by the classes panel's HTML.
    CLASSES_ITEMS       - A string replaced by the classes items.
    CLASS_NAME          - A string replaced by a class item's name.
    CLASS_TITLE         - A string replaced by a class item's title.
    CONTAINERS          - A string replaced by the containers panel's HTML.
    CONTAINERS_ITEMS    - A string replaced by the containers items.
    CONTAINER_NAME      - A string replaced by a container item's name.
    CONTAINER_TITLE     - A string replaced by a container item's title.
    CONTAINER_CLASS     - A string replaced by a container item's class.
    HTML                - A string replaced by the HTML view panel's HTML.
    IFRAME              - A string replaced by the designmode iframe.
    STATUS              - A string replaced by the status panel's HTML.
    DIALOG_TITLE        - A string replaced by a dialog's title.
    DIALOG_BODY         - A string replaced by a dialog's HTML body.
    BODY                - The BODY element.
    STRING              - The "string" type.
    BODY,DIV,P,
    H1,H2,H3,H4,H5,H6,
    PRE,BLOCKQUOTE,
    A,BR,IMG,
    TABLE,TD,TH,
    UL,OL,LI            - HTML elements string representation.
    CLASS,HREF,SRC,
    TITLE,REL,ALT       - HTML attributes string representation.
    DIALOG_LINK         - A link dialog type.
    DIALOG_IMAGE        - An image dialog type.
    DIALOG_TABLE        - A table dialog type.
    DIALOG_PASTE        - A 'Paste from Word' dialog type.
    BOLD                - Command: (un)set selection to <strong>.
    ITALIC              - Command: (un)set selection to <em>.
    CREATE_LINK         - Command: open the link dialog or (un)set link.
    INSERT_IMAGE        - Command: open the image dialog or insert an image.
    INSERT_TABLE        - Command: open the table dialog.
    PASTE               - Command: open the paste dialog.
    INDENT              - Command: nest a list item.
    OUTDENT             - Command: unnest a list item.
    TOGGLE_HTML         - Command: display/hide the HTML view.
    FORMAT_BLOCK        - Command: set a block element to another type.
    PREVIEW             - Command: open the preview dialog.
    UNLINK              - Command: unset a link.
    INSERT_UNORDEREDLIST- Command: insert an unordered list.
    INSERT_ORDEREDLIST  - Command: insert an ordered list.
    MAIN_CONTAINERS     - An array of the main HTML containers used in WYMeditor.
    BLOCKS              - An array of the HTML block elements.
    KEY                 - Standard key codes.
    NODE                - Node types.

*/

    VERSION             : "@VERSION",
    INSTANCES           : [],
    STRINGS             : [],
    SKINS               : [],
    NAME                : "name",
    INDEX               : "{Wym_Index}",
    WYM_INDEX           : "wym_index",
    BASE_PATH           : "{Wym_Base_Path}",
    CSS_PATH            : "{Wym_Css_Path}",
    WYM_PATH            : "{Wym_Wym_Path}",
    SKINS_DEFAULT_PATH  : "skins/",
    SKINS_DEFAULT_CSS   : "skin.css",
    SKINS_DEFAULT_JS    : "skin.js",
    LANG_DEFAULT_PATH   : "lang/",
    IFRAME_BASE_PATH    : "{Wym_Iframe_Base_Path}",
    IFRAME_DEFAULT      : "iframe/default/",
    JQUERY_PATH         : "{Wym_Jquery_Path}",
    DIRECTION           : "{Wym_Direction}",
    LOGO                : "{Wym_Logo}",
    TOOLS               : "{Wym_Tools}",
    TOOLS_ITEMS         : "{Wym_Tools_Items}",
    TOOL_NAME           : "{Wym_Tool_Name}",
    TOOL_TITLE          : "{Wym_Tool_Title}",
    TOOL_CLASS          : "{Wym_Tool_Class}",
    CLASSES             : "{Wym_Classes}",
    CLASSES_ITEMS       : "{Wym_Classes_Items}",
    CLASS_NAME          : "{Wym_Class_Name}",
    CLASS_TITLE         : "{Wym_Class_Title}",
    CONTAINERS          : "{Wym_Containers}",
    CONTAINERS_ITEMS    : "{Wym_Containers_Items}",
    CONTAINER_NAME      : "{Wym_Container_Name}",
    CONTAINER_TITLE     : "{Wym_Containers_Title}",
    CONTAINER_CLASS     : "{Wym_Container_Class}",
    HTML                : "{Wym_Html}",
    IFRAME              : "{Wym_Iframe}",
    STATUS              : "{Wym_Status}",
    DIALOG_TITLE        : "{Wym_Dialog_Title}",
    DIALOG_BODY         : "{Wym_Dialog_Body}",
    STRING              : "string",
    BODY                : "body",
    DIV                 : "div",
    P                   : "p",
    H1                  : "h1",
    H2                  : "h2",
    H3                  : "h3",
    H4                  : "h4",
    H5                  : "h5",
    H6                  : "h6",
    PRE                 : "pre",
    BLOCKQUOTE          : "blockquote",
    A                   : "a",
    BR                  : "br",
    IMG                 : "img",
    TABLE               : "table",
    TR                  : "tr",
    TD                  : "td",
    TH                  : "th",
    UL                  : "ul",
    OL                  : "ol",
    LI                  : "li",
    CLASS               : "class",
    HREF                : "href",
    SRC                 : "src",
    TITLE               : "title",
    REL                 : "rel",
    ALT                 : "alt",
    DIALOG_LINK         : "Link",
    DIALOG_IMAGE        : "Image",
    DIALOG_TABLE        : "Table",
    DIALOG_PASTE        : "Paste_From_Word",
    BOLD                : "Bold",
    ITALIC              : "Italic",
    CREATE_LINK         : "CreateLink",
    INSERT_IMAGE        : "InsertImage",
    INSERT_TABLE        : "InsertTable",
    INSERT_HTML         : "InsertHTML",
    PASTE               : "Paste",
    INDENT              : "Indent",
    OUTDENT             : "Outdent",
    TOGGLE_HTML         : "ToggleHtml",
    FORMAT_BLOCK        : "FormatBlock",
    PREVIEW             : "Preview",
    UNLINK              : "Unlink",
    INSERT_UNORDEREDLIST: "InsertUnorderedList",
    INSERT_ORDEREDLIST  : "InsertOrderedList",

    MAIN_CONTAINERS : ["p","h1","h2","h3","h4","h5","h6","pre","blockquote"],

    BLOCKS : ["address", "blockquote", "div", "dl",
        "fieldset", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
        "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
        "li", "tbody", "td", "tfoot", "th", "thead", "tr"],

    BLOCKING_ELEMENTS : ["table", "blockquote", "pre"],

    NON_BLOCKING_ELEMENTS : ["p", "h1", "h2", "h3", "h4", "h5", "h6"],

    KEY : {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        CTRL: 17,
        END: 35,
        HOME: 36,
        CURSOR: [37, 38, 39, 40],
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46,
        B: 66,
        I: 73,
        R: 82,
        COMMAND: 224
    },

    NODE : {
        ELEMENT: 1,
        ATTRIBUTE: 2,
        TEXT: 3
    },

    /**
        WYMeditor.editor
        ================

        WYMeditor editor main class, instantiated for each editor occurrence.

        See also: WYMeditor.editor.init

        Use
        ---

        Initializes main values (index, elements, paths, ...)
        and calls WYMeditor.editor.init which initializes the editor.

        ### Parameters

        elem - The HTML element to be replaced by the editor.

        options - The hash of options.

        ### Returns

        Nothing.

    */
    editor : function(elem, options) {
        // Store the instance in the INSTANCES array and store the index
        this._index = WYMeditor.INSTANCES.push(this) - 1;
        // The element replaced by the editor
        this._element = elem;
        this._options = options;
        // Store the element's inner value
        this._html = jQuery(elem).val();

        if (this._options.html) {
            this._html = this._options.html;
        }
        // Path to the WYMeditor core
        this._options.wymPath = this._options.wymPath ||
                WYMeditor.computeWymPath();
        // Path to the main JS files
        this._options.basePath = this._options.basePath ||
                WYMeditor.computeBasePath(this._options.wymPath);
        // Path to jQuery (for loading in pop-up dialogs)
        this._options.jQueryPath = this._options.jQueryPath ||
                WYMeditor.computeJqueryPath();
        // Path to skin files
        this._options.skinPath = this._options.skinPath ||
                this._options.basePath + WYMeditor.SKINS_DEFAULT_PATH + this._options.skin + '/';
        // Path to the language files
        this._options.langPath = this._options.langPath ||
                this._options.basePath + WYMeditor.LANG_DEFAULT_PATH;
        // The designmode iframe's base path
        this._options.iframeBasePath = this._options.iframeBasePath ||
                this._options.basePath + WYMeditor.IFRAME_DEFAULT;

        // Initialize the editor instance
        this.init();
    }
});


/********** jQuery Plugin Definition **********/

/**
    wymeditor
    =========

    jQuery plugin function for replacing an HTML element with a WYMeditor
    instance.

    Example
    -------

    `jQuery(".wymeditor").wymeditor({});`
*/
jQuery.fn.wymeditor = function(options) {

    options = jQuery.extend({

        html:       "",
        basePath:   false,
        skinPath:    false,
        wymPath:    false,
        iframeBasePath: false,
        jQueryPath: false,
        styles: false,
        stylesheet: false,
        skin:       "default",
        initSkin:   true,
        loadSkin:   true,
        lang:       "en",
        direction:  "ltr",
        customCommands: [],
        boxHtml:   "" +
            "<div class='wym_box'>" +
                "<div class='wym_area_top'>" +
                    WYMeditor.TOOLS +
                "</div>" +
                "<div class='wym_area_left'></div>" +
                "<div class='wym_area_right'>" +
                    WYMeditor.CONTAINERS +
                    WYMeditor.CLASSES +
                "</div>" +
                "<div class='wym_area_main'>" +
                    WYMeditor.HTML +
                    WYMeditor.IFRAME +
                    WYMeditor.STATUS +
                "</div>" +
                "<div class='wym_area_bottom'>" +
                    WYMeditor.LOGO +
                "</div>" +
            "</div>",

        logoHtml:  '' +
            '<a class="wym_wymeditor_link" ' +
                'href="http://www.wymeditor.org/">WYMeditor</a>',

        iframeHtml: '' +
            '<div class="wym_iframe wym_section">' +
                '<iframe src="' + WYMeditor.IFRAME_BASE_PATH + 'wymiframe.html" ' +
                    'onload="this.contentWindow.parent.WYMeditor.INSTANCES[' +
                        WYMeditor.INDEX + '].initIframe(this)">' +
                '</iframe>' +
            "</div>",

        editorStyles: [],
        toolsHtml: '' +
            '<div class="wym_tools wym_section">' +
                '<h2>{Tools}</h2>' +
                '<ul>' +
                    WYMeditor.TOOLS_ITEMS +
                '</ul>' +
            '</div>',

        toolsItemHtml: '' +
            '<li class="' + WYMeditor.TOOL_CLASS + '">' +
                '<a href="#" name="' + WYMeditor.TOOL_NAME + '"' +
                        'title="' + WYMeditor.TOOL_TITLE + '">' +
                    WYMeditor.TOOL_TITLE +
                '</a>' +
            '</li>',

        toolsItems: [
            {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
            {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
            {'name': 'Superscript', 'title': 'Superscript',
                'css': 'wym_tools_superscript'},
            {'name': 'Subscript', 'title': 'Subscript',
                'css': 'wym_tools_subscript'},
            {'name': 'InsertOrderedList', 'title': 'Ordered_List',
                'css': 'wym_tools_ordered_list'},
            {'name': 'InsertUnorderedList', 'title': 'Unordered_List',
                'css': 'wym_tools_unordered_list'},
            {'name': 'Indent', 'title': 'Indent', 'css': 'wym_tools_indent'},
            {'name': 'Outdent', 'title': 'Outdent', 'css': 'wym_tools_outdent'},
            {'name': 'Undo', 'title': 'Undo', 'css': 'wym_tools_undo'},
            {'name': 'Redo', 'title': 'Redo', 'css': 'wym_tools_redo'},
            {'name': 'CreateLink', 'title': 'Link', 'css': 'wym_tools_link'},
            {'name': 'Unlink', 'title': 'Unlink', 'css': 'wym_tools_unlink'},
            {'name': 'InsertImage', 'title': 'Image', 'css': 'wym_tools_image'},
            {'name': 'InsertTable', 'title': 'Table', 'css': 'wym_tools_table'},
            {'name': 'Paste', 'title': 'Paste_From_Word',
                'css': 'wym_tools_paste'},
            {'name': 'ToggleHtml', 'title': 'HTML', 'css': 'wym_tools_html'},
            {'name': 'Preview', 'title': 'Preview', 'css': 'wym_tools_preview'}
        ],

        containersHtml: '' +
            '<div class="wym_containers wym_section">' +
                '<h2>{Containers}</h2>' +
                '<ul>' +
                    WYMeditor.CONTAINERS_ITEMS +
                '</ul>' +
            '</div>',

        containersItemHtml: '' +
            '<li class="' + WYMeditor.CONTAINER_CLASS + '">' +
                '<a href="#" name="' + WYMeditor.CONTAINER_NAME + '">' +
                    WYMeditor.CONTAINER_TITLE +
                '</a>' +
            '</li>',

        containersItems: [
            {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
            {'name': 'H1', 'title': 'Heading_1', 'css': 'wym_containers_h1'},
            {'name': 'H2', 'title': 'Heading_2', 'css': 'wym_containers_h2'},
            {'name': 'H3', 'title': 'Heading_3', 'css': 'wym_containers_h3'},
            {'name': 'H4', 'title': 'Heading_4', 'css': 'wym_containers_h4'},
            {'name': 'H5', 'title': 'Heading_5', 'css': 'wym_containers_h5'},
            {'name': 'H6', 'title': 'Heading_6', 'css': 'wym_containers_h6'},
            {'name': 'PRE', 'title': 'Preformatted', 'css': 'wym_containers_pre'},
            {'name': 'BLOCKQUOTE', 'title': 'Blockquote',
                'css': 'wym_containers_blockquote'},
            {'name': 'TH', 'title': 'Table_Header', 'css': 'wym_containers_th'}
        ],

        classesHtml: '' +
            '<div class="wym_classes wym_section">' +
                '<h2>{Classes}</h2>' +
                '<ul>' +
                    WYMeditor.CLASSES_ITEMS +
                '</ul>' +
            '</div>',

        classesItemHtml: '' +
            '<li class="wym_classes_' + WYMeditor.CLASS_NAME + '">' +
                '<a href="#" name="' + WYMeditor.CLASS_NAME + '">' +
                    WYMeditor.CLASS_TITLE +
                '</a>' +
            '</li>',

        classesItems:      [],
        statusHtml: '' +
            '<div class="wym_status wym_section">' +
                '<h2>{Status}</h2>' +
            '</div>',

        htmlHtml: '' +
            '<div class="wym_html wym_section">' +
                '<h2>{Source_Code}</h2>' +
                '<textarea class="wym_html_val"></textarea>' +
            '</div>',

        boxSelector:       ".wym_box",
        toolsSelector:     ".wym_tools",
        toolsListSelector: " ul",
        containersSelector:".wym_containers",
        classesSelector:   ".wym_classes",
        htmlSelector:      ".wym_html",
        iframeSelector:    ".wym_iframe iframe",
        iframeBodySelector:".wym_iframe",
        statusSelector:    ".wym_status",
        toolSelector:      ".wym_tools a",
        containerSelector: ".wym_containers a",
        classSelector:     ".wym_classes a",
        htmlValSelector:   ".wym_html_val",

        hrefSelector:      ".wym_href",
        srcSelector:       ".wym_src",
        titleSelector:     ".wym_title",
        relSelector:       ".wym_rel",
        altSelector:       ".wym_alt",
        textSelector:      ".wym_text",

        rowsSelector:      ".wym_rows",
        colsSelector:      ".wym_cols",
        captionSelector:   ".wym_caption",
        summarySelector:   ".wym_summary",

        submitSelector:    "form",
        cancelSelector:    ".wym_cancel",
        previewSelector:   "",

        dialogTypeSelector:    ".wym_dialog_type",
        dialogLinkSelector:    ".wym_dialog_link",
        dialogImageSelector:   ".wym_dialog_image",
        dialogTableSelector:   ".wym_dialog_table",
        dialogPasteSelector:   ".wym_dialog_paste",
        dialogPreviewSelector: ".wym_dialog_preview",

        updateSelector:    ".wymupdate",
        updateEvent:       "click",

        dialogFeatures:    "menubar=no,titlebar=no,toolbar=no,resizable=no" +
            ",width=560,height=300,top=0,left=0",
        dialogFeaturesPreview: "menubar=no,titlebar=no,toolbar=no,resizable=no" +
            ",scrollbars=yes,width=560,height=300,top=0,left=0",

        dialogHtml: '' +
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' +
                    '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
            '<html dir="' + WYMeditor.DIRECTION + '">' +
                '<head>' +
                    '<link rel="stylesheet" type="text/css" media="screen" ' +
                        'href="' + WYMeditor.CSS_PATH + '" />' +
                    '<title>' + WYMeditor.DIALOG_TITLE + '</title>' +
                    '<script type="text/javascript" ' +
                        'src="' + WYMeditor.JQUERY_PATH + '"></script>' +
                    '<script type="text/javascript" ' +
                        'src="' + WYMeditor.WYM_PATH + '"></script>' +
                '</head>' +
                WYMeditor.DIALOG_BODY +
            '</html>',

        dialogLinkHtml: '' +
            '<body class="wym_dialog wym_dialog_link" ' +
                    ' onload="WYMeditor.INIT_DIALOG(' + WYMeditor.INDEX + ')">' +
                '<form>' +
                    '<fieldset>' +
                        '<input type="hidden" class="wym_dialog_type" ' +
                            'value="' + WYMeditor.DIALOG_LINK + '" />' +
                        '<legend>{Link}</legend>' +
                        '<div class="row">' +
                            '<label>{URL}</label>' +
                            '<input type="text" class="wym_href" value="" ' +
                                'size="40" autofocus="autofocus" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Title}</label>' +
                            '<input type="text" class="wym_title" value="" ' +
                                'size="40" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Relationship}</label>' +
                            '<input type="text" class="wym_rel" value="" ' +
                                'size="40" />' +
                        '</div>' +
                        '<div class="row row-indent">' +
                            '<input class="wym_submit" type="submit" ' +
                                'value="{Submit}" />' +
                            '<input class="wym_cancel" type="button" ' +
                                'value="{Cancel}" />' +
                        '</div>' +
                    '</fieldset>' +
                '</form>' +
            '</body>',

        dialogImageHtml: '' +
            '<body class="wym_dialog wym_dialog_image" ' +
                    'onload="WYMeditor.INIT_DIALOG(' + WYMeditor.INDEX + ')">' +
                '<form>' +
                    '<fieldset>' +
                        '<input type="hidden" class="wym_dialog_type" ' +
                            'value="' + WYMeditor.DIALOG_IMAGE + '" />' +
                        '<legend>{Image}</legend>' +
                        '<div class="row">' +
                            '<label>{URL}</label>' +
                            '<input type="text" class="wym_src" value="" ' +
                                'size="40" autofocus="autofocus" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Alternative_Text}</label>' +
                            '<input type="text" class="wym_alt" value="" size="40" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Title}</label>' +
                            '<input type="text" class="wym_title" value="" size="40" />' +
                        '</div>' +
                        '<div class="row row-indent">' +
                            '<input class="wym_submit" type="submit" ' +
                                'value="{Submit}" />' +
                            '<input class="wym_cancel" type="button" ' +
                                'value="{Cancel}" />' +
                        '</div>' +
                    '</fieldset>' +
                '</form>' +
            '</body>',

        dialogTableHtml: '' +
            '<body class="wym_dialog wym_dialog_table" ' +
                    'onload="WYMeditor.INIT_DIALOG(' + WYMeditor.INDEX + ')">' +
                '<form>' +
                    '<fieldset>' +
                        '<input type="hidden" class="wym_dialog_type" ' +
                            'value="' + WYMeditor.DIALOG_TABLE + '" />' +
                        '<legend>{Table}</legend>' +
                        '<div class="row">' +
                            '<label>{Caption}</label>' +
                            '<input type="text" class="wym_caption" value="" ' +
                                'size="40" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Summary}</label>' +
                            '<input type="text" class="wym_summary" value="" ' +
                                'size="40" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Number_Of_Rows}</label>' +
                            '<input type="text" class="wym_rows" value="3" size="3" />' +
                        '</div>' +
                        '<div class="row">' +
                            '<label>{Number_Of_Cols}</label>' +
                            '<input type="text" class="wym_cols" value="2" size="3" />' +
                        '</div>' +
                        '<div class="row row-indent">' +
                            '<input class="wym_submit" type="submit" ' +
                                'value="{Submit}" />' +
                            '<input class="wym_cancel" type="button" ' +
                                'value="{Cancel}" />' +
                        '</div>' +
                    '</fieldset>' +
                '</form>' +
            '</body>',

        dialogPasteHtml: '' +
            '<body class="wym_dialog wym_dialog_paste" ' +
                    'onload="WYMeditor.INIT_DIALOG(' + WYMeditor.INDEX + ')">' +
                '<form>' +
                    '<input type="hidden" class="wym_dialog_type" ' +
                        'value="' + WYMeditor.DIALOG_PASTE + '" />' +
                    '<fieldset>' +
                        '<legend>{Paste_From_Word}</legend>' +
                        '<div class="row">' +
                            '<textarea class="wym_text" rows="10" cols="50" ' +
                                'autofocus="autofocus"></textarea>' +
                        '</div>' +
                        '<div class="row">' +
                            '<input class="wym_submit" type="submit" ' +
                                'value="{Submit}" />' +
                            '<input class="wym_cancel" type="button" ' +
                                'value="{Cancel}" />' +
                        '</div>' +
                    '</fieldset>' +
                '</form>' +
            '</body>',

        dialogPreviewHtml: '' +
            '<body class="wym_dialog wym_dialog_preview" ' +
                'onload="WYMeditor.INIT_DIALOG(' + WYMeditor.INDEX + ')"></body>',

        dialogStyles: [],

        stringDelimiterLeft: "{",
        stringDelimiterRight:"}",

        preInit: null,
        preBind: null,
        postInit: null,

        preInitDialog: null,
        postInitDialog: null

    }, options);

    return this.each(function() {
        // Assigning to _editor because the return value from new isn't
        // actually used, but we need to use new to properly change the
        // prototype
        _editor = new WYMeditor.editor(jQuery(this), options);
    });
};

// Enable accessing of wymeditor instances via $.wymeditors
jQuery.extend({
    wymeditors: function(i) {
        return WYMeditor.INSTANCES[i];
    }
});

/**
    WYMeditor.computeWymPath
    ========================

    Get the relative path to the WYMeditor core js file for usage as
    a src attribute for script inclusion.

    Looks for script tags on the current page and finds the first matching
    src attribute matching any of these values:
    * jquery.wymeditor.pack.js
    * jquery.wymeditor.min.js
    * jquery.wymeditor.packed.js
    * jquery.wymeditor.js
    * /core.js
*/
WYMeditor.computeWymPath = function() {
    var script = jQuery(
        jQuery.grep(
            jQuery('script'),
            function(s){
                if (!s.src) {
                    return null;
                }
                return (
                    s.src.match(
                        /jquery\.wymeditor(\.pack|\.min|\.packed)?\.js(\?.*)?$/ ) ||
                    s.src.match(
                        /\/core\.js(\?.*)?$/ )
                );
            }
        )
    );
    if (script.length > 0) {
        return script.attr('src');
    }
    // We couldn't locate the base path. This will break language loading,
    // dialog boxes and other features.
    WYMeditor.console.warn(
        "Error determining wymPath. No base WYMeditor file located.");
    WYMeditor.console.warn("Assuming wymPath to be the current URL");
    WYMeditor.console.warn("Please pass a correct wymPath option");

    // Guess that the wymPath is the current directory
    return '';
};

/**
    WYMeditor.computeBasePath
    =========================

    Get the relative path to the WYMeditor directory root based on the path to
    the wymeditor base file. This path is used as the basis for loading:
    * Language files
    * Skins
    *
*/
WYMeditor.computeBasePath = function(wymPath) {
    // Strip everything after the last slash to get the base path
    var lastSlashIndex = wymPath.lastIndexOf('/');
    return wymPath.substr(0, lastSlashIndex + 1);
};

/**
    WYMeditor.computeJqueryPath
    ===========================

    Get the relative path to the currently-included jquery javascript file.

    Returns the first script src attribute that matches one of the following
    patterns:

    * jquery.pack.js
    * jquery.min.js
    * jquery.packed.js
    * Plus the jquery-<version> variants
*/
WYMeditor.computeJqueryPath = function() {
    return jQuery(
        jQuery.grep(
            jQuery('script'),
            function(s) {
                return (
                    s.src &&
                    s.src.match(
                        /jquery(-(.*)){0,1}(\.pack|\.min|\.packed)?\.js(\?.*)?$/)
                );
            }
        )
    ).attr('src');
};

/********** DIALOGS **********/

WYMeditor.INIT_DIALOG = function(index) {

    var wym = window.opener.WYMeditor.INSTANCES[index];
    var doc = window.document;
    var selected = wym.selected();
    var dialogType = jQuery(wym._options.dialogTypeSelector).val();
    var sStamp = wym.uniqueStamp();

    if (dialogType == WYMeditor.DIALOG_LINK) {
        // ensure that we select the link to populate the fields
        if (selected && selected.tagName &&
                selected.tagName.toLowerCase != WYMeditor.A) {
            selected = jQuery(selected).parentsOrSelf(WYMeditor.A);
        }

        // fix MSIE selection if link image has been clicked
        if (!selected && wym._selected_image) {
            selected = jQuery(wym._selected_image).parentsOrSelf(WYMeditor.A);
        }
    }

    // pre-init functions
    if (jQuery.isFunction(wym._options.preInitDialog)) {
        wym._options.preInitDialog(wym, window);
    }

    // add css rules from options
    var styles = doc.styleSheets[0];
    var aCss = eval(wym._options.dialogStyles);

    wym.addCssRules(doc, aCss);

    // auto populate fields if selected container (e.g. A)
    if (selected) {
        jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMeditor.HREF));
        jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMeditor.SRC));
        jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMeditor.TITLE));
        jQuery(wym._options.relSelector).val(jQuery(selected).attr(WYMeditor.REL));
        jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMeditor.ALT));
    }

    // auto populate image fields if selected image
    if (wym._selected_image) {
        jQuery(wym._options.dialogImageSelector + " " + wym._options.srcSelector).val(jQuery(wym._selected_image).attr(WYMeditor.SRC));
        jQuery(wym._options.dialogImageSelector + " " + wym._options.titleSelector).val(jQuery(wym._selected_image).attr(WYMeditor.TITLE));
        jQuery(wym._options.dialogImageSelector + " " + wym._options.altSelector).val(jQuery(wym._selected_image).attr(WYMeditor.ALT));
    }

    jQuery(wym._options.dialogLinkSelector + " " +
            wym._options.submitSelector).submit(function() {

        var sUrl = jQuery(wym._options.hrefSelector).val();
        if (sUrl.length > 0) {
            var link;

            if (selected[0] && selected[0].tagName.toLowerCase() == WYMeditor.A) {
                link = selected;
            } else {
                wym._exec(WYMeditor.CREATE_LINK, sStamp);
                link = jQuery("a[href=" + sStamp + "]", wym._doc.body);
            }

            link.attr(WYMeditor.HREF, sUrl);
            link.attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());
            link.attr(WYMeditor.REL, jQuery(wym._options.relSelector).val());
        }
        window.close();
    });

    jQuery(wym._options.dialogImageSelector + " " +
            wym._options.submitSelector).submit(function() {

        var sUrl = jQuery(wym._options.srcSelector).val();
        if (sUrl.length > 0) {

            wym._exec(WYMeditor.INSERT_IMAGE, sStamp);

            var $img = jQuery("img[src$=" + sStamp + "]", wym._doc.body);
            $img.attr(WYMeditor.SRC, sUrl);
            $img.attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());
            $img.attr(WYMeditor.ALT, jQuery(wym._options.altSelector).val());
        }
        window.close();
    });

    var tableOnClick = WYMeditor.MAKE_TABLE_ONCLICK(wym);
    jQuery(wym._options.dialogTableSelector + " " + wym._options.submitSelector)
        .submit(tableOnClick);

    jQuery(wym._options.dialogPasteSelector + " " +
            wym._options.submitSelector).submit(function() {

        var sText = jQuery(wym._options.textSelector).val();
        wym.paste(sText);
        window.close();
    });

    jQuery(wym._options.dialogPreviewSelector + " " +
        wym._options.previewSelector).html(wym.xhtml());

    //cancel button
    jQuery(wym._options.cancelSelector).mousedown(function() {
        window.close();
    });

    //pre-init functions
    if (jQuery.isFunction(wym._options.postInitDialog)) {
        wym._options.postInitDialog(wym, window);
    }

};

/********** TABLE DIALOG ONCLICK **********/

WYMeditor.MAKE_TABLE_ONCLICK = function(wym) {
    var tableOnClick = function() {
        var numRows = jQuery(wym._options.rowsSelector).val();
        var numColumns = jQuery(wym._options.colsSelector).val();
        var caption = jQuery(wym._options.captionSelector).val();
        var summary = jQuery(wym._options.summarySelector).val();

        var table = wym.insertTable(numRows, numColumns, caption, summary);

        window.close();
    };

    return tableOnClick;
};


/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
jQuery.fn.isPhantomNode = function() {
    if (this[0].nodeType == 3) {
        return !(/[^\t\n\r ]/.test(this[0].data));
    }

    return false;
};

WYMeditor.isPhantomNode = function(n) {
    if (n.nodeType == 3) {
        return !(/[^\t\n\r ]/.test(n.data));
    }

    return false;
};

WYMeditor.isPhantomString = function(str) {
    return !(/[^\t\n\r ]/.test(str));
};

// Returns the Parents or the node itself
// jqexpr = a jQuery expression
jQuery.fn.parentsOrSelf = function(jqexpr) {
    var n = this;

    if (n[0].nodeType == 3) {
        n = n.parents().slice(0,1);
    }

//  if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
    if (n.filter(jqexpr).size() == 1) {
        return n;
    } else {
        return n.parents(jqexpr).slice(0,1);
    }
};

// String & array helpers

WYMeditor.Helper = {

    //replace all instances of 'old' by 'rep' in 'str' string
    replaceAll: function(str, old, rep) {
        var rExp = new RegExp(old, "g");
        return str.replace(rExp, rep);
    },

    //insert 'inserted' at position 'pos' in 'str' string
    insertAt: function(str, inserted, pos) {
        return str.substr(0,pos) + inserted + str.substring(pos);
    },

    //trim 'str' string
    trim: function(str) {
        return str.replace(/^(\s*)|(\s*)$/gm,'');
    },

    //return true if 'arr' array contains 'elem', or false
    contains: function(arr, elem) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === elem) {
                return true;
            }
        }
        return false;
    },

    //return 'item' position in 'arr' array, or -1
    indexOf: function(arr, item) {
        var ret=-1;
        for(var i = 0; i < arr.length; i++) {
            if (arr[i] == item) {
                ret = i;
                break;
            }
        }
    return ret;
    },

    //return 'item' object in 'arr' array, checking its 'name' property, or null
    findByName: function(arr, name) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (item.name == name) {
                return item;
            }
        }
        return null;
    }
};


