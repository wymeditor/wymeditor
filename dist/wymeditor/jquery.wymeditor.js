/* jshint strict: false, maxlen: 90, evil: true */
/* global -$, WYMeditor: true, console */

/*@version 1.0.0-b6 */
/**
    WYMeditor
    =========

    version 1.0.0-b6

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
if (typeof (WYMeditor) === 'undefined') {
    /* jshint -W079 */
    var WYMeditor = {};
    /* jshint +W079 */
}

// Wrap the Firebug console in WYMeditor.console
(function () {
    if (typeof window.console === 'undefined' &&
        typeof console === 'undefined') {
        // No in-browser console logging available
        var names = [
                "log", "debug", "info", "warn", "error", "assert", "dir",
                "dirxml", "group", "groupEnd", "time", "timeEnd", "count",
                "trace", "profile", "profileEnd"
            ],
            noOp = function () {},
            i;

        WYMeditor.console = {};
        for (i = 0; i < names.length; i += 1) {
            WYMeditor.console[names[i]] = noOp;
        }
    } else if (typeof console !== 'undefined') {
        // ie8+
        WYMeditor.console = console;
    } else if (window.console.firebug) {
        // FF with firebug
        WYMeditor.console = window.console;
    } else if (window.console) {
        // Chrome
        WYMeditor.console = window.console;
    }
}());

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
    WYM_PATH            - A string replaced by WYMeditor's main JS file path.
    IFRAME_BASE_PATH    - String replaced by the designmode iframe's base path.
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
    KEY                 - Standard key codes.
    NODE                - Node types.

*/

    A                   : "a",
    ALT                 : "alt",
    BASE_PATH           : "{Wym_Base_Path}",
    BLOCKQUOTE          : "blockquote",
    BODY                : "body",
    BOLD                : "Bold",
    CLASS               : "class",
    CLASSES             : "{Wym_Classes}",
    CLASSES_ITEMS       : "{Wym_Classes_Items}",
    CLASS_NAME          : "{Wym_Class_Name}",
    CLASS_TITLE         : "{Wym_Class_Title}",
    CONTAINERS          : "{Wym_Containers}",
    CONTAINERS_ITEMS    : "{Wym_Containers_Items}",
    CONTAINER_CLASS     : "{Wym_Container_Class}",
    CONTAINER_NAME      : "{Wym_Container_Name}",
    CONTAINER_TITLE     : "{Wym_Containers_Title}",
    CREATE_LINK         : "CreateLink",
    DIALOG_BODY         : "{Wym_Dialog_Body}",
    DIALOG_IMAGE        : "Image",
    DIALOG_LINK         : "Link",
    DIALOG_PASTE        : "Paste_From_Word",
    DIALOG_TABLE        : "Table",
    DIALOG_TITLE        : "{Wym_Dialog_Title}",
    DIRECTION           : "{Wym_Direction}",
    DIV                 : "div",
    FORMAT_BLOCK        : "FormatBlock",
    H1                  : "h1",
    H2                  : "h2",
    H3                  : "h3",
    H4                  : "h4",
    H5                  : "h5",
    H6                  : "h6",
    HREF                : "href",
    HTML                : "{Wym_Html}",
    IFRAME              : "{Wym_Iframe}",
    IFRAME_BASE_PATH    : "{Wym_Iframe_Base_Path}",
    IFRAME_DEFAULT      : "iframe/default/",
    IMG                 : "img",
    INDENT              : "Indent",
    INDEX               : "{Wym_Index}",
    INSERT_HTML         : "InsertHTML",
    INSERT_IMAGE        : "InsertImage",
    INSERT_ORDEREDLIST  : "InsertOrderedList",
    INSERT_TABLE        : "InsertTable",
    INSERT_UNORDEREDLIST: "InsertUnorderedList",
    INSTANCES           : [],
    ITALIC              : "Italic",
    JQUERY_PATH         : "{Wym_Jquery_Path}",
    LI                  : "li",
    LOGO                : "{Wym_Logo}",
    NAME                : "name",
    NBSP                : '\xA0',
    NEWLINE             : "\n",
    OL                  : "ol",
    OUTDENT             : "Outdent",
    P                   : "p",
    PASTE               : "Paste",
    PRE                 : "pre",
    PREVIEW             : "Preview",
    REL                 : "rel",
    SKINS               : [],
    SRC                 : "src",
    STATUS              : "{Wym_Status}",
    STRING              : "string",
    STRINGS             : [],
    TABLE               : "table",
    TD                  : "td",
    TH                  : "th",
    TITLE               : "title",
    TOGGLE_HTML         : "ToggleHtml",
    TOOLS               : "{Wym_Tools}",
    TOOLS_ITEMS         : "{Wym_Tools_Items}",
    TOOL_CLASS          : "{Wym_Tool_Class}",
    TOOL_NAME           : "{Wym_Tool_Name}",
    TOOL_TITLE          : "{Wym_Tool_Title}",
    TR                  : "tr",
    UL                  : "ul",
    UNLINK              : "Unlink",
    VERSION             : "1.0.0-b6",
    WYM_INDEX           : "wym_index",
    WYM_PATH            : "{Wym_Wym_Path}",

    // Containers that we allow at the root of the document (as a direct child
    // of the body tag)
    MAIN_CONTAINERS : [
        "blockquote",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "pre"
    ],

    // Containers that we explicitly do not allow at the root of the document.
    // These containers must be wrapped in a valid main container.
    FORBIDDEN_MAIN_CONTAINERS : [
        "a",
        "b",
        "em",
        "i",
        "span",
        "strong",
        "sub",
        "sup"
    ],

    // All block (as opposed to inline) tags
    BLOCKS : [
        "address",
        "blockquote",
        "dd",
        "div",
        "dl",
        "dt",
        "fieldset",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "li",
        "noscript",
        "ol",
        "p",
        "pre",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "tr",
        "ul"
    ],

    // The subset of the `MAIN_CONTAINERS` that prevent the user from using
    // up/down/enter/backspace from moving above or below them. They
    // effectively block the creation of new blocks.
    BLOCKING_ELEMENTS : [
        "blockquote",
        "pre",
        "table"
    ],

    // Elements that are not containers. They don't generally have any child
    // nodes.
    NON_CONTAINING_ELEMENTS : [
        "br",
        "col",
        "hr",
        "img"
    ],

    // Elements that should not contain collapsed selection directly.
    NO_CARET_ELEMENTS: [
        "blockquote",
        "br",
        "col",
        "colgroup",
        "dl",
        "hr",
        "img",
        "ol",
        "table",
        "tbody",
        "tfoot",
        "thead",
        "tr",
        "ul"
    ],

    // Inline elements.
    INLINE_ELEMENTS : [
        "a",
        "abbr",
        "acronym",
        "b",
        "bdo",
        "big",
        "br",
        "button",
        "cite",
        "code",
        "dfn",
        "em",
        "i",
        "img",
        "input",
        "kbd",
        "label",
        "map",
        "object",
        "q",
        "samp",
        "script",
        "select",
        "small",
        "span",
        "strong",
        "sub",
        "sup",
        "textarea",
        "tt",
        "var"
    ],

    // The remaining `MAIN_CONTAINERS` that are not considered
    // `BLOCKING_ELEMENTS`
    NON_BLOCKING_ELEMENTS : [
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p"
    ],

    // The elements that define a type of list.
    LIST_TYPE_ELEMENTS : [
        "ol",
        "ul"
    ],

    // The elements that define a heading
    HEADING_ELEMENTS : [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6"
    ],

    // The elements that are allowed to be turned in to lists. If an item in
    // this array isn't in the MAIN_CONTAINERS array, then its contents will be
    // turned in to a list instead.
    POTENTIAL_LIST_ELEMENTS : [
        "blockquote",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "pre",
        "td"
    ],

    // The elements that are allowed to have a table inserted after them or
    // within them.
    POTENTIAL_TABLE_INSERT_ELEMENTS : [
        "blockquote",
        "div",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "li",
        "p",
        "pre"
    ],

    // The elements that are allowed to have a table inserted inline within
    // them.
    INLINE_TABLE_INSERTION_ELEMENTS : [
        "li"
    ],

    // The elements used in tables that can be selected by the user by clicking
    // in them.
    SELECTABLE_TABLE_ELEMENTS: [
        "caption",
        "td",
        "th"
    ],

    // Class for marking br elements used to space apart blocking elements in
    // the editor.
    BLOCKING_ELEMENT_SPACER_CLASS: "wym-blocking-element-spacer",

    // Class used to flag an element for removal by the xhtml parser so that
    // the element is removed from the output and only shows up internally
    // within the editor.
    EDITOR_ONLY_CLASS: "wym-editor-only",

    // Classes that will be removed from all tags' class attribute by the
    // parser.
    CLASSES_REMOVED_BY_PARSER: [
        "apple-style-span"
    ],

    // Keyboard mappings so that we don't have to remember that 38 means up
    // when reading keyboard handlers
    KEY : {
        B: 66,
        BACKSPACE: 8,
        COMMAND: 224,
        CTRL: 17,
        CURSOR: [37, 38, 39, 40],
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        HOME: 36,
        I: 73,
        LEFT: 37,
        R: 82,
        RIGHT: 39,
        TAB: 9,
        UP: 38
    },

    // Key codes for the keys that can potentially create a block element when
    // inputted
    POTENTIAL_BLOCK_ELEMENT_CREATION_KEYS : [
        8,   // BACKSPACE
        13,  // ENTER
        37,  // LEFT
        38,  // UP
        39,  // RIGHT
        40,  // DOWN
        46   // DELETE
    ],

    EVENTS : {
        'postBlockMaybeCreated': 'wym-postBlockMaybeCreated',
        'postIframeInitialization': 'wym-postIframeInitialization'
    },

    // domNode.nodeType constants
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
    editor : function (elem, options) {
        // Store the instance in the INSTANCES array and store the index
        this._index = WYMeditor.INSTANCES.push(this) - 1;
        // The element replaced by the editor
        this._element = elem;
        this._options = options;
        // Path to the WYMeditor core
        this._options.wymPath = this._options.wymPath ||
            WYMeditor.computeWymPath();
        // Path to the main JS files
        this._options.basePath = this._options.basePath ||
            WYMeditor.computeBasePath(this._options.wymPath);
        // Path to jQuery (for loading in pop-up dialogs)
        this._options.jQueryPath = this._options.jQueryPath ||
            WYMeditor.computeJqueryPath();
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
jQuery.fn.wymeditor = function (options) {

    options = jQuery.extend({

        html:       "",
        basePath:   false,
        wymPath:    false,
        iframeBasePath: false,
        jQueryPath: false,
        skin:       "default",
        lang:       "en",
        direction:  "ltr",
        customCommands: [],

        // These values will override the default for their respective
        // `DocumentStructureManager.structureRules`
        structureRules: {
            defaultRootContainer:  'p'
        },

        boxHtml: String() +
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

        logoHtml: String() +
            '<a class="wym_wymeditor_link" ' +
                'href="http://www.wymeditor.org/">WYMeditor</a>',

        iframeHtml: String() +
            '<div class="wym_iframe wym_section">' +
                '<iframe src="' + WYMeditor.IFRAME_BASE_PATH + 'wymiframe.html">' +
                '</iframe>' +
            "</div>",

        toolsHtml: String() +
            '<div class="wym_tools wym_section">' +
                '<h2>{Tools}</h2>' +
                '<ul>' +
                    WYMeditor.TOOLS_ITEMS +
                '</ul>' +
            '</div>',

        toolsItemHtml: String() +
            '<li class="' + WYMeditor.TOOL_CLASS + '">' +
                '<a href="#" name="' + WYMeditor.TOOL_NAME + '" ' +
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

        containersHtml: String() +
            '<div class="wym_containers wym_section">' +
                '<h2>{Containers}</h2>' +
                '<ul>' +
                    WYMeditor.CONTAINERS_ITEMS +
                '</ul>' +
            '</div>',

        containersItemHtml: String() +
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

        classesHtml: String() +
            '<div class="wym_classes wym_section">' +
                '<h2>{Classes}</h2>' +
                '<ul>' +
                    WYMeditor.CLASSES_ITEMS +
                '</ul>' +
            '</div>',

        classesItemHtml: String() +
            '<li class="wym_classes_' + WYMeditor.CLASS_NAME + '">' +
                '<a href="#" name="' + WYMeditor.CLASS_NAME + '">' +
                    WYMeditor.CLASS_TITLE +
                '</a>' +
            '</li>',

        classesItems:      [],
        statusHtml: String() +
            '<div class="wym_status wym_section">' +
                '<h2>{Status}</h2>' +
            '</div>',

        htmlHtml: String() +
            '<div class="wym_html wym_section">' +
                '<h2>{Source_Code}</h2>' +
                '<textarea class="wym_html_val"></textarea>' +
            '</div>',

        boxSelector:        ".wym_box",
        toolsSelector:      ".wym_tools",
        toolsListSelector:  " ul",
        containersSelector: ".wym_containers",
        classesSelector:    ".wym_classes",
        htmlSelector:       ".wym_html",
        iframeSelector:     ".wym_iframe iframe",
        iframeBodySelector: ".wym_iframe",
        statusSelector:     ".wym_status",
        toolSelector:       ".wym_tools a",
        containerSelector:  ".wym_containers a",
        classSelector:      ".wym_classes a",
        htmlValSelector:    ".wym_html_val",

        hrefSelector:       ".wym_href",
        srcSelector:        ".wym_src",
        titleSelector:      ".wym_title",
        relSelector:        ".wym_rel",
        altSelector:        ".wym_alt",
        textSelector:       ".wym_text",

        rowsSelector:       ".wym_rows",
        colsSelector:       ".wym_cols",
        captionSelector:    ".wym_caption",
        summarySelector:    ".wym_summary",

        submitSelector:     "form",
        cancelSelector:     ".wym_cancel",
        previewSelector:    "",

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

        dialogHtml: String() +
            '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' +
                    '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
            '<html dir="' + WYMeditor.DIRECTION + '">' +
                '<head>' +
                    '<title>' + WYMeditor.DIALOG_TITLE + '</title>' +
                    '<script type="text/javascript" ' +
                        'src="' + WYMeditor.JQUERY_PATH + '"></script>' +
                    '<script type="text/javascript" ' +
                        'src="' + WYMeditor.WYM_PATH + '"></script>' +
                '</head>' +
                WYMeditor.DIALOG_BODY +
            '</html>',

        dialogLinkHtml: String() +
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

        dialogImageHtml: String() +
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

        dialogTableHtml: String() +
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

        dialogPasteHtml: String() +
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

        dialogPreviewHtml: String() +
            '<body class="wym_dialog wym_dialog_preview" ' +
                'onload="WYMeditor.INIT_DIALOG(' + WYMeditor.INDEX + ')"></body>',

        stringDelimiterLeft:  "{",
        stringDelimiterRight: "}",

        preInit: null,
        preBind: null,
        postInit: null,

        preInitDialog: null,
        postInitDialog: null

    }, options);

    return this.each(function () {
        // Assigning to _editor because the return value from new isn't
        // actually used, but we need to use new to properly change the
        // prototype
        this._wym = new WYMeditor.editor(jQuery(this), options);
    });
};

// Enable accessing of wymeditor instances via jQuery.wymeditors
jQuery.extend({
    wymeditors: function (i) {
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
WYMeditor.computeWymPath = function () {
    var script = jQuery(
        jQuery.grep(
            jQuery('script'),
            function (s) {
                if (!s.src) {
                    return null;
                }
                return (
                    s.src.match(
                        /jquery\.wymeditor(\.pack|\.min|\.packed)?\.js(\?.*)?$/
                    ) ||
                    s.src.match(
                            /\/core\.js(\?.*)?$/
                        )
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
        "Error determining wymPath. No base WYMeditor file located."
    );
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
WYMeditor.computeBasePath = function (wymPath) {
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
WYMeditor.computeJqueryPath = function () {
    return jQuery(
        jQuery.grep(
            jQuery('script'),
            function (s) {
                return (
                    s.src &&
                    s.src.match(
                            /jquery(-(.*)){0,1}(\.pack|\.min|\.packed)?\.js(\?.*)?$/
                        )
                );
            }
        )
    ).attr('src');
};

/********** DIALOGS **********/

WYMeditor.INIT_DIALOG = function (index) {
    var wym = window.opener.WYMeditor.INSTANCES[index],
        selected = wym.selectedContainer(),
        dialogType = jQuery(wym._options.dialogTypeSelector).val(),
        sStamp = wym.uniqueStamp(),
        tableOnClick;

    if (dialogType === WYMeditor.DIALOG_LINK) {
        // ensure that we select the link to populate the fields
        if (selected && selected.tagName &&
                selected.tagName.toLowerCase !== WYMeditor.A) {
            selected = jQuery(selected).parentsOrSelf(WYMeditor.A);
        }

        // fix MSIE selection if link image has been clicked
        if (!selected && wym._selectedImage) {
            selected = jQuery(wym._selectedImage).parentsOrSelf(WYMeditor.A);
        }
    }

    // pre-init functions
    if (jQuery.isFunction(wym._options.preInitDialog)) {
        wym._options.preInitDialog(wym, window);
    }

    // auto populate fields if selected container (e.g. A)
    if (selected) {
        jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMeditor.HREF));
        jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMeditor.SRC));
        jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMeditor.TITLE));
        jQuery(wym._options.relSelector).val(jQuery(selected).attr(WYMeditor.REL));
        jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMeditor.ALT));
    }

    // auto populate image fields if selected image
    if (wym._selectedImage) {
        jQuery(
            wym._options.dialogImageSelector + " " + wym._options.srcSelector
        ).val(jQuery(wym._selectedImage).attr(WYMeditor.SRC));
        jQuery(
            wym._options.dialogImageSelector + " " + wym._options.titleSelector
        ).val(jQuery(wym._selectedImage).attr(WYMeditor.TITLE));
        jQuery(
            wym._options.dialogImageSelector + " " + wym._options.altSelector
        ).val(jQuery(wym._selectedImage).attr(WYMeditor.ALT));
    }

    jQuery(wym._options.dialogLinkSelector + " " +
            wym._options.submitSelector).submit(function () {

        var sUrl = jQuery(wym._options.hrefSelector).val(),
            link;
        if (sUrl.length > 0) {

            if (selected[0] && selected[0].tagName.toLowerCase() === WYMeditor.A) {
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
            wym._options.submitSelector).submit(function () {

        var sUrl = jQuery(wym._options.srcSelector).val(),
            $img;
        if (sUrl.length > 0) {

            wym._exec(WYMeditor.INSERT_IMAGE, sStamp);

            $img = jQuery("img[src$=" + sStamp + "]", wym._doc.body);
            $img.attr(WYMeditor.SRC, sUrl);
            $img.attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());
            $img.attr(WYMeditor.ALT, jQuery(wym._options.altSelector).val());
        }
        window.close();
    });

    tableOnClick = WYMeditor.MAKE_TABLE_ONCLICK(wym);
    jQuery(wym._options.dialogTableSelector + " " + wym._options.submitSelector)
        .submit(tableOnClick);

    jQuery(wym._options.dialogPasteSelector + " " +
            wym._options.submitSelector).submit(function () {

        var sText = jQuery(wym._options.textSelector).val();
        wym.paste(sText);
        window.close();
    });

    jQuery(wym._options.dialogPreviewSelector + " " +
        wym._options.previewSelector).html(wym.xhtml());

    //cancel button
    jQuery(wym._options.cancelSelector).mousedown(function () {
        window.close();
    });

    //pre-init functions
    if (jQuery.isFunction(wym._options.postInitDialog)) {
        wym._options.postInitDialog(wym, window);
    }

};

/********** TABLE DIALOG ONCLICK **********/

WYMeditor.MAKE_TABLE_ONCLICK = function (wym) {
    var tableOnClick = function () {
        var numRows = jQuery(wym._options.rowsSelector).val(),
            numColumns = jQuery(wym._options.colsSelector).val(),
            caption = jQuery(wym._options.captionSelector).val(),
            summary = jQuery(wym._options.summarySelector).val();

        wym.insertTable(numRows, numColumns, caption, summary);

        window.close();
    };

    return tableOnClick;
};


/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
jQuery.fn.isPhantomNode = function () {
    if (this[0].nodeType === WYMeditor.NODE.TEXT) {
        return !(/[^\t\n\r ]/.test(this[0].data));
    }

    return false;
};

/**
    jQuery.fn.nextContentsUntil
    ===========================

    Acts like jQuery.nextUntil() but includes text nodes and comments and only
    works on the first element in the given jQuery collection..
*/
jQuery.fn.nextContentsUntil = function (selector, filter) {
    var matched = [],
        $matched,
        cur = this.get(0);

    selector = selector ? selector : '';
    filter = filter ? filter : '';

    if (!cur) {
        // Called on an empty selector. The sibling of nothing is nothing
        return jQuery();
    }
    // We don't want to include this element, only its siblings
    cur = cur.nextSibling;

    while (cur) {
        if (!jQuery(cur).is(selector)) {
            matched.push(cur);
            cur = cur.nextSibling;
        } else {
            break;
        }
    }

    $matched = jQuery(matched);
    if (filter) {
        return $matched.filter(filter);
    }
    return $matched;
};
/**
    jQuery.fn.nextAllContents
    =========================

    Acts like jQuery.nextAll() but includes text nodes and comments and only
    works on the first element in the given jQuery collection..

    Mostly cribbed from the jQuery source.
*/
jQuery.fn.nextAllContents = function () {
    return jQuery(this).nextContentsUntil('', '');
};

/**
    jQuery.fn.prevContentsUntil
    ===========================

    Acts like jQuery.prevUntil() but includes text nodes and comments and only
    works on the first element in the given jQuery collection..
*/
jQuery.fn.prevContentsUntil = function (selector, filter) {
    var matched = [],
        $matched,
        cur = this.get(0);

    selector = selector ? selector : '';
    filter = filter ? filter : '';

    if (!cur) {
        // Called on an empty selector. The sibling of nothing is nothing
        return jQuery();
    }
    // We don't want to include this element, only its siblings
    cur = cur.previousSibling;

    while (cur) {
        if (!jQuery(cur).is(selector)) {
            matched.push(cur);
            cur = cur.previousSibling;
        } else {
            break;
        }
    }

    $matched = jQuery(matched);
    if (filter) {
        return $matched.filter(filter);
    }
    return $matched;
};

/**
    jQuery.fn.prevAllContents
    =========================

    Acts like jQuery.prevAll() but includes text nodes and comments and only
    works on the first element in the given jQuery collection..

    Mostly cribbed from the jQuery source.
*/
jQuery.fn.prevAllContents = function () {
    return jQuery(this).prevContentsUntil('', '');
};

WYMeditor.isPhantomNode = function (n) {
    if (n.nodeType === WYMeditor.NODE.TEXT) {
        return !(/[^\t\n\r ]/.test(n.data));
    }

    return false;
};

WYMeditor.isPhantomString = function (str) {
    return !(/[^\t\n\r ]/.test(str));
};

// Returns the Parents or the node itself
// jqexpr = a jQuery expression
jQuery.fn.parentsOrSelf = function (jqexpr) {
    var n = this;

    if (n[0].nodeType === WYMeditor.NODE.TEXT) {
        n = n.parents().slice(0, 1);
    }

//  if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
    if (n.filter(jqexpr).size() === 1) {
        return n;
    } else {
        return n.parents(jqexpr).slice(0, 1);
    }
};

/*
    WYMeditor.changeNodeType
    ========================

    Change the type (tagName) of the given node, while retaining all content,
    properties and attributes.
*/
WYMeditor.changeNodeType = function (node, newTag) {
    var newNode,
        i,
        attributes = node.attributes;

    // In ie6, have to create the node as part of wrapInner before we can copy
    // over attributes
    jQuery(node).wrapInner('<' + newTag + '>');
    newNode = jQuery(node).children().get(0);

    // Copy attributes
    for (i = 0; i < attributes.length; i++) {
        if (attributes[i].specified) {
            // We only care about specified attributes
            newNode.setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
        }
    }

    // Not copying inline CSS or properties/events

    jQuery(node).contents().unwrap();
    return newNode;
};

// String & array helpers

WYMeditor.Helper = {

    //replace all instances of 'old' by 'rep' in 'str' string
    replaceAll: function (str, old, rep) {
        var rExp = new RegExp(old, "g");
        return str.replace(rExp, rep);
    },

    //insert 'inserted' at position 'pos' in 'str' string
    insertAt: function (str, inserted, pos) {
        return str.substr(0, pos) + inserted + str.substring(pos);
    },

    //trim 'str' string
    trim: function (str) {
        return str.replace(/^(\s*)|(\s*)$/gm, '');
    },

    //return true if 'arr' array contains 'elem', or false
    contains: function (arr, elem) {
        var i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === elem) {
                return true;
            }
        }
        return false;
    },

    //return 'item' position in 'arr' array, or -1
    indexOf: function (arr, item) {
        var ret = -1, i;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i] === item) {
                ret = i;
                break;
            }
        }
        return ret;
    },

    //return 'item' object in 'arr' array, checking its 'name' property, or null
    findByName: function (arr, name) {
        var i, item;
        for (i = 0; i < arr.length; i += 1) {
            item = arr[i];
            if (item.name === name) {
                return item;
            }
        }
        return null;
    }
};



/*jshint evil: true, camelcase: false, maxlen: 100 */
/* global -$, rangy */
"use strict";

/**
    WYMeditor.editor.init
    =====================

    Initialize a wymeditor instance, including detecting the
    current browser and enabling the browser-specific subclass.
*/
WYMeditor.editor.prototype.init = function () {
    // Load the browser-specific subclass
    // If this browser isn't supported, do nothing
    var WymClass = false,
        SaxListener,
        prop,
        h,
        iframeHtml,
        boxHtml,
        aTools,
        sTools,
        oTool,
        sTool,
        i,
        aClasses,
        sClasses,
        oClass,
        sClass,
        aContainers,
        sContainers,
        sContainer,
        oContainer,
        wym;

    if (jQuery.browser.msie) {
        WymClass = new WYMeditor.WymClassExplorer(this);
    } else if (jQuery.browser.mozilla) {
        WymClass = new WYMeditor.WymClassMozilla(this);
    } else if (jQuery.browser.opera) {
        WymClass = new WYMeditor.WymClassOpera(this);
    } else if (jQuery.browser.safari || jQuery.browser.webkit ||
               jQuery.browser.chrome) {
        WymClass = new WYMeditor.WymClassSafari(this);
    }

    if (WymClass === false) {
        return;
    }

    if (jQuery.isFunction(this._options.preInit)) {
        this._options.preInit(this);
    }

    this.parser = null;
    this.helper = null;

    SaxListener = new WYMeditor.XhtmlSaxListener();
    this.parser = new WYMeditor.XhtmlParser(SaxListener);

    this.helper = new WYMeditor.XmlHelper();

    // Extend the editor object with the browser-specific version.
    // We're not using jQuery.extend because we *want* to copy properties via
    // the prototype chain
    for (prop in WymClass) {
        /*jshint forin: false*/
        // Explicitly not using hasOwnProperty for the inheritance here
        // because we want to go up the prototype chain to get all of the
        // browser-specific editor methods. This is kind of a code smell,
        // but works just fine.
        this[prop] = WymClass[prop];
    }

    wym = this;

    // Load wymbox
    wym._box = jQuery(wym._element).hide().after(
        wym._options.boxHtml
    ).next().addClass(
        'wym_box_' + wym._index
    );

    // Store the instance index and replaced element in wymbox
    // but keep it compatible with jQuery < 1.2.3, see #122
    if (jQuery.isFunction(jQuery.fn.data)) {
        jQuery.data(wym._box.get(0), WYMeditor.WYM_INDEX, wym._index);
        jQuery.data(wym._element.get(0), WYMeditor.WYM_INDEX, wym._index);
    }

    h = WYMeditor.Helper;

    // Construct the iframe
    iframeHtml = wym._options.iframeHtml;
    iframeHtml = h.replaceAll(iframeHtml, WYMeditor.INDEX, wym._index);
    iframeHtml = h.replaceAll(
        iframeHtml,
        WYMeditor.IFRAME_BASE_PATH,
        wym._options.iframeBasePath
    );

    // Construct wymbox
    boxHtml = jQuery(wym._box).html();

    boxHtml = h.replaceAll(boxHtml, WYMeditor.LOGO, wym._options.logoHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS, wym._options.toolsHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS, wym._options.containersHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES, wym._options.classesHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.HTML, wym._options.htmlHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.IFRAME, iframeHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.STATUS, wym._options.statusHtml);

    // Construct the tools list
    aTools = eval(wym._options.toolsItems);
    sTools = "";

    for (i = 0; i < aTools.length; i += 1) {
        oTool = aTools[i];
        sTool = '';
        if (oTool.name && oTool.title) {
            sTool = wym._options.toolsItemHtml;
        }
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_NAME, oTool.name);
        sTool = h.replaceAll(
            sTool,
            WYMeditor.TOOL_TITLE,
            wym._options.stringDelimiterLeft + oTool.title + wym._options.stringDelimiterRight
        );
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_CLASS, oTool.css);
        sTools += sTool;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS_ITEMS, sTools);

    // Construct the classes list
    aClasses = eval(wym._options.classesItems);
    sClasses = "";

    for (i = 0; i < aClasses.length; i += 1) {
        oClass = aClasses[i];
        sClass = '';
        if (oClass.name && oClass.title) {
            sClass = wym._options.classesItemHtml;
        }
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_NAME, oClass.name);
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_TITLE, oClass.title);
        sClasses += sClass;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES_ITEMS, sClasses);

    // Construct the containers list
    aContainers = eval(wym._options.containersItems);
    sContainers = "";

    for (i = 0; i < aContainers.length; i += 1) {
        oContainer = aContainers[i];
        sContainer = '';
        if (oContainer.name && oContainer.title) {
            sContainer = wym._options.containersItemHtml;
        }
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_NAME,
            oContainer.name
        );
        sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_TITLE,
            wym._options.stringDelimiterLeft +
            oContainer.title +
            wym._options.stringDelimiterRight);
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_CLASS,
            oContainer.css
        );
        sContainers += sContainer;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS_ITEMS, sContainers);

    // I10n
    boxHtml = wym.replaceStrings(boxHtml);

    // Load the html in wymbox
    jQuery(wym._box).html(boxHtml);

    // Hide the html value
    jQuery(wym._box).find(wym._options.htmlSelector).hide();

    wym.documentStructureManager = new WYMeditor.DocumentStructureManager(
        wym,
        wym._options.structureRules.defaultRootContainer
    );

    // Some browsers like to trigger an iframe's load event multiple times
    // depending on all sorts of small, annoying details. Instead of attempting
    // to work-around old ones and predict new ones, let's just ensure the
    // initialization only happens once. All methods of detecting load are
    // unreliable.
    wym._iframe_initialized = false;

    jQuery(wym._box).find('iframe').load(function () {
        if (wym._iframe_initialized === true) {
            return;
        }
        wym._iframe_initialized = wym.initIframe(this);
    });

    wym.initSkin();
};

/**
    WYMeditor.editor.bindEvents
    ===========================

    Bind all event handlers including tool/container clicks, focus events
    and change events.
*/
WYMeditor.editor.prototype.bindEvents = function () {
    var wym = this,
        $html_val;

    // Handle click events on tools buttons
    jQuery(this._box).find(this._options.toolSelector).click(function () {
        wym._iframe.contentWindow.focus(); //See #154
        wym.exec(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle click events on containers buttons
    jQuery(this._box).find(this._options.containerSelector).click(function () {
        wym.container(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle keyup event on html value: set the editor value
    // Handle focus/blur events to check if the element has focus, see #147
    $html_val = jQuery(this._box).find(this._options.htmlValSelector);
    $html_val.keyup(function () {
        jQuery(wym._doc.body).html(jQuery(this).val());
    });
    $html_val.focus(function () {
        jQuery(this).toggleClass('hasfocus');
    });
    $html_val.blur(function () {
        jQuery(this).toggleClass('hasfocus');
    });

    // Handle click events on classes buttons
    jQuery(this._box).find(this._options.classSelector).click(function () {
        var aClasses = eval(wym._options.classesItems),
            sName = jQuery(this).attr(WYMeditor.NAME),

            oClass = WYMeditor.Helper.findByName(aClasses, sName),
            jqexpr;

        if (oClass) {
            jqexpr = oClass.expr;
            wym.toggleClass(sName, jqexpr);
        }
        wym._iframe.contentWindow.focus(); //See #154
        return false;
    });

    // Handle update event on update element
    jQuery(this._options.updateSelector).bind(this._options.updateEvent, function () {
        wym.update();
    });
};

WYMeditor.editor.prototype.ready = function () {
    return this._doc !== null;
};

/**
    WYMeditor.editor.box
    ====================

    Get the wymbox container.
*/
WYMeditor.editor.prototype.box = function () {
    return this._box;
};

/**
    WYMeditor.editor._html
    ======================

    Get or set the wymbox html value. If you want to get the wymbox html, you
    should use WYMeditor.editor.xhtml() instead of this so that the html is
    parsed and receives cross-browser cleanup. Only use this if you have a
    specific reason not to use WYMeditor.editor.xhtml().
*/
WYMeditor.editor.prototype._html = function (html) {
    if (typeof html === 'string') {
        jQuery(this._doc.body).html(html);
        this.update();
    } else {
        return jQuery(this._doc.body).html();
    }
};

/**
    WYMeditor.editor.html
    =====================

    Deprecated. Use WYMeditor.editor.xhtml or WYMeditor.editor._html instead.
    Calling this function will give a console warning.
*/
WYMeditor.editor.prototype.html = function (html) {
    WYMeditor.console.warn("The function WYMeditor.editor.html() is deprecated. " +
                           "Use either WYMeditor.editor.xhtml() or " +
                           "WYMeditor.editor._html() instead.");
    if (typeof html === 'string') {
        this._html(html);
    } else {
        return this._html();
    }
};

/**
    WYMeditor.editor.xhtml
    ======================

    Take the current editor's DOM and apply strict xhtml nesting rules to
    enforce a valid, well-formed, semantic xhtml result.
*/
WYMeditor.editor.prototype.xhtml = function () {
    return this.parser.parse(this._html());
};

/**
    WYMeditor.editor.exec
    =====================

    Execute a button command on the currently-selected container. The command
    can be anything from "indent this element" to "open a dialog to create a
    table."

    `cmd` is a string corresponding to the command that should be run, roughly
    matching the designMode execCommand strategy (and falling through to
    execCommand in some cases).
*/
WYMeditor.editor.prototype.exec = function (cmd) {
    var container, custom_run, _this = this;
    switch (cmd) {

    case WYMeditor.CREATE_LINK:
        container = this.container();
        if (container || this._selectedImage) {
            this.dialog(WYMeditor.DIALOG_LINK);
        }
        break;

    case WYMeditor.INSERT_IMAGE:
        this.dialog(WYMeditor.DIALOG_IMAGE);
        break;

    case WYMeditor.INSERT_TABLE:
        this.dialog(WYMeditor.DIALOG_TABLE);
        break;

    case WYMeditor.PASTE:
        this.dialog(WYMeditor.DIALOG_PASTE);
        break;

    case WYMeditor.TOGGLE_HTML:
        this.update();
        this.toggleHtml();
        break;

    case WYMeditor.PREVIEW:
        this.dialog(WYMeditor.PREVIEW, this._options.dialogFeaturesPreview);
        break;

    case WYMeditor.INSERT_ORDEREDLIST:
        this.insertOrderedlist();
        break;

    case WYMeditor.INSERT_UNORDEREDLIST:
        this.insertUnorderedlist();
        break;

    case WYMeditor.INDENT:
        this.indent();
        break;

    case WYMeditor.OUTDENT:
        this.outdent();
        break;


    default:
        custom_run = false;
        jQuery.each(this._options.customCommands, function () {
            if (cmd === this.name) {
                custom_run = true;
                this.run.apply(_this);
                return false;
            }
        });
        if (!custom_run) {
            this._exec(cmd);
        }
        break;
    }
};

/**
    WYMeditor.editor.selection
    ==========================

    Override the default selection function to use rangy.
*/
WYMeditor.editor.prototype.selection = function () {
    if (window.rangy && !rangy.initialized) {
        rangy.init();
    }

    var iframe = this._iframe,
        sel = rangy.getIframeSelection(iframe);

    return sel;
};

/**
    WYMeditor.editor.selection
    ==========================

    Return the selected node.
*/
WYMeditor.editor.prototype.selected = function () {
    var sel = this.selection(),
        node = sel.focusNode,
        caretPos,
        isBodyTag,
        isTextNode;

    if (node) {
        if (jQuery.browser.msie) {
            // For collapsed selections, we have to use the ghetto "caretPos"
            // hack to find the selection, otherwise it always says that the
            // body element is selected
            isBodyTag = node.tagName && node.tagName.toLowerCase() === "body";
            isTextNode = node.nodeName === "#text";

            if (sel.isCollapsed && (isBodyTag || isTextNode)) {
                caretPos = this._iframe.contentWindow.document.caretPos;
                if (caretPos && caretPos.parentElement) {
                    node = caretPos.parentElement();
                }
            }
        }
        if (node.nodeName === "#text") {
            return node.parentNode;
        } else {
            return node;
        }
    } else {
        return null;
    }
};

/**
    WYMeditor.editor.selection_collapsed
    ====================================

    Return true if all selections are collapsed, false otherwise.
*/
WYMeditor.editor.prototype.selection_collapsed = function () {
    var sel = this.selection(),
        collapsed = false;

    jQuery.each(sel.getAllRanges(), function () {
        if (this.collapsed) {
            collapsed = true;
            //break
            return false;
        }
    });

    return collapsed;
};

/**
    WYMeditor.editor.selected_contains
    ==================================

    Return an array of nodes that match a jQuery selector
    within the current selection.
*/
WYMeditor.editor.prototype.selected_contains = function (selector) {
    var sel = this.selection(),
        matches = [];

    jQuery.each(sel.getAllRanges(), function () {
        jQuery.each(this.getNodes(), function () {
            if (jQuery(this).is(selector)) {
                matches.push(this);
            }
        });
    });

    return matches;
};

/**
    WYMeditor.editor.selected_parents_contains
    ==================================

    Return an array of nodes that match the selector within
    the selection's parents.
*/
WYMeditor.editor.prototype.selected_parents_contains = function (selector) {
    var $matches = jQuery([]),
        $selected = jQuery(this.selected());
    if ($selected.is(selector)) {
        $matches = $matches.add($selected);
    }
    $matches = $matches.add($selected.parents(selector));
    return $matches;
};

/**
    WYMeditor.editor.container
    ==========================

    Get or set the selected container.
*/
WYMeditor.editor.prototype.container = function (sType) {
    if (typeof (sType) === 'undefined') {
        return this.selected();
    }

    var container = null,
        aTypes,
        newNode,
        blockquote,
        nodes,
        lgt,
        firstNode,
        x;

    if (sType.toLowerCase() === WYMeditor.TH) {
        container = this.container();

        // Find the TD or TH container
        switch (container.tagName.toLowerCase()) {

        case WYMeditor.TD:
        case WYMeditor.TH:
            break;
        default:
            aTypes = [WYMeditor.TD, WYMeditor.TH];
            container = this.findUp(this.container(), aTypes);
            break;
        }

        // If it exists, switch
        if (container !== null) {
            sType = WYMeditor.TD;
            if (container.tagName.toLowerCase() === WYMeditor.TD) {
                sType = WYMeditor.TH;
            }
            this.switchTo(container, sType, false);
            this.update();
        }
    } else {
        // Set the container type
        aTypes = [
            WYMeditor.P,
            WYMeditor.DIV,
            WYMeditor.H1,
            WYMeditor.H2,
            WYMeditor.H3,
            WYMeditor.H4,
            WYMeditor.H5,
            WYMeditor.H6,
            WYMeditor.PRE,
            WYMeditor.BLOCKQUOTE
        ];
        container = this.findUp(this.container(), aTypes);

        if (container) {
            if (sType.toLowerCase() === WYMeditor.BLOCKQUOTE) {
                // Blockquotes must contain a block level element
                blockquote = this.findUp(
                    this.container(),
                    WYMeditor.BLOCKQUOTE
                );
                if (blockquote === null) {
                    newNode = this._doc.createElement(sType);
                    container.parentNode.insertBefore(newNode, container);
                    newNode.appendChild(container);
                    this.setFocusToNode(newNode.firstChild);
                } else {
                    nodes = blockquote.childNodes;
                    lgt = nodes.length;

                    if (lgt > 0) {
                        firstNode = nodes.item(0);
                    }
                    for (x = 0; x < lgt; x += 1) {
                        blockquote.parentNode.insertBefore(
                            nodes.item(0),
                            blockquote
                        );
                    }
                    blockquote.parentNode.removeChild(blockquote);
                    if (firstNode) {
                        this.setFocusToNode(firstNode);
                    }
                }
            } else {
                // Not a blockquote
                this.switchTo(container, sType);
            }

            this.update();
        }
    }

    return false;
};

/**
    WYMeditor.editor.isForbiddenMainContainer
    =========================================

    Determines whether a container with the passed tagName is allowed to be a
    main container (i.e. if it is allowed to be a container in the root of the
    document). Returns true if a container with the passed tagName is *not* an
    allowable main container, and returns false if otherwise.

    @param tagName A string of the tag name to be determined if it can be a
                   main container or not
*/
WYMeditor.editor.prototype.isForbiddenMainContainer = function (tagName) {
    return jQuery.inArray(tagName.toLowerCase(),
                          WYMeditor.FORBIDDEN_MAIN_CONTAINERS) > -1;
};

/**
    WYMeditor.editor.keyCanCreateBlockElement
    =========================================

    Determines whether the key represented by the passed keyCode can create a
    block element within the editor when inputted. Returns true if the key can
    create a block element when inputted, and returns false if otherwise.

    @param keyCode A numberic key code representing a key
*/
WYMeditor.editor.prototype.keyCanCreateBlockElement = function (keyCode) {
    return jQuery.inArray(keyCode,
                    WYMeditor.POTENTIAL_BLOCK_ELEMENT_CREATION_KEYS) > -1;
};

/**
    WYMeditor.editor.toggleClass
    ============================

    Toggle a class on the selected element or one of its parents
*/
WYMeditor.editor.prototype.toggleClass = function (sClass, jqexpr) {
    var container = null;
    if (this._selectedImage) {
        container = this._selectedImage;
    } else {
        container = jQuery(this.selected());
    }
    container = jQuery(container).parentsOrSelf(jqexpr);
    jQuery(container).toggleClass(sClass);

    if (!jQuery(container).attr(WYMeditor.CLASS)) {
        jQuery(container).removeAttr(this._class);
    }
};

/**
    WYMeditor.editor.findUp
    =======================

    Return the first parent or self container, based on its type

    `filter` is a string or an array of strings on which to filter the container
*/
WYMeditor.editor.prototype.findUp = function (node, filter) {
    if (typeof (node) === 'undefined' || node === null) {
        return null;
    }

    if (node.nodeName === "#text") {
        // For text nodes, we need to look from the nodes container object
        node = node.parentNode;
    }
    var tagname = node.tagName.toLowerCase(),
        bFound,
        i;
    if (typeof (filter) === WYMeditor.STRING) {
        while (tagname !== filter && tagname !== WYMeditor.BODY) {
            node = node.parentNode;
            tagname = node.tagName.toLowerCase();
        }
    } else {
        bFound = false;
        while (!bFound && tagname !== WYMeditor.BODY) {
            for (i = 0; i < filter.length; i += 1) {
                if (tagname === filter[i]) {
                    bFound = true;
                    break;
                }
            }
            if (!bFound) {
                node = node.parentNode;
                if (node === null) {
                    // No parentNode, so we're not going to find anything
                    // up the ancestry chain that matches
                    return null;
                }
                tagname = node.tagName.toLowerCase();
            }
        }
    }

    if (tagname === WYMeditor.BODY) {
        return null;
    }

    return node;
};

/**
    WYMeditor.editor.switchTo
    =========================

    Switch the type of the given `node` to type `sType`. If stripAttrs is true,
    the attributes of node will not be included in the the new type. If
    stripAttrs is false (or undefined), the attributes of node will be
    preserved through the switch.
*/
WYMeditor.editor.prototype.switchTo = function (node, sType, stripAttrs, setFocus) {
    var newNode = this._doc.createElement(sType),
        html = jQuery(node).html(),
        attrs = node.attributes,
        i;

    if (typeof setFocus === "undefined") {
        setFocus = true;
    }

    if (!stripAttrs) {
        for (i = 0; i < attrs.length; ++i) {
            newNode.setAttribute(attrs.item(i).nodeName,
                                 attrs.item(i).nodeValue);
        }
    }
    newNode.innerHTML = html;
    node.parentNode.replaceChild(newNode, node);

    if (setFocus === true) {
        this.setFocusToNode(newNode);
    }

    return newNode;
};

WYMeditor.editor.prototype.replaceStrings = function (sVal) {
    var key;
    // Check if the language file has already been loaded
    // if not, get it via a synchronous ajax call
    if (!WYMeditor.STRINGS[this._options.lang]) {
        WYMeditor.console.error(
            "WYMeditor: language '" + this._options.lang + "' not found."
        );
        WYMeditor.console.error(
            "Unable to perform i10n."
        );
        return sVal;
    }

    // Replace all the strings in sVal and return it
    for (key in WYMeditor.STRINGS[this._options.lang]) {
        if (WYMeditor.STRINGS[this._options.lang].hasOwnProperty(key)) {
            sVal = WYMeditor.Helper.replaceAll(
                sVal,
                this._options.stringDelimiterLeft + key + this._options.stringDelimiterRight,
                WYMeditor.STRINGS[this._options.lang][key]
            );
        }
    }
    return sVal;
};

WYMeditor.editor.prototype.encloseString = function (sVal) {
    return this._options.stringDelimiterLeft +
        sVal +
        this._options.stringDelimiterRight;
};

/**
    editor.status
    =============

    Print the given string as a status message.
*/
WYMeditor.editor.prototype.status = function (sMessage) {
    // Print status message
    jQuery(this._box).find(this._options.statusSelector).html(sMessage);
};

/**
    editor.update
    =============

    Update the element and textarea values.
*/
WYMeditor.editor.prototype.update = function () {
    var html;

    html = this.xhtml();
    jQuery(this._element).val(html);
    jQuery(this._box).find(this._options.htmlValSelector).not('.hasfocus').val(html); //#147
    this.fixBodyHtml();
};

/**
    editor.fixBodyHtml
    ==================

    Adjust the editor body html to account for editing changes where
    perfect HTML is not optimal. For instance, <br> elements are useful between
    certain block elements.
*/
WYMeditor.editor.prototype.fixBodyHtml = function () {
    var wym = this;

    wym.spaceBlockingElements();
    wym.fixDoubleBr();

    jQuery(wym._element).trigger(WYMeditor.EVENTS.postBlockMaybeCreated, wym);
};

/**
    editor.spaceBlockingElements
    ============================

    Insert <br> elements between adjacent blocking elements and
    p elements, between block elements or blocking elements and the
    start/end of the document.
*/
WYMeditor.editor.prototype.spaceBlockingElements = function () {
    var blockingSelector =
            WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION.join(', '),
        $body = jQuery(this._doc).find('body.wym_iframe'),
        children = $body.children(),

        placeholderNode,
        $firstChild,
        $lastChild,
        blockSepSelector,
        blockInListSepSelector,
        $blockInList;

    if (jQuery.browser.mozilla) {
        placeholderNode = '<br ' +
                            'class="' +
                            WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                            WYMeditor.EDITOR_ONLY_CLASS + '" ' +
                            '_moz_editor_bogus_node="TRUE" ' +
                            '_moz_dirty=""' +
                          '/>';
    } else {
        placeholderNode = '<br ' +
                            'class="' +
                            WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                            WYMeditor.EDITOR_ONLY_CLASS + '"' +
                          '/>';
    }

    // Make sure that we still have a placeholder node at both the begining and
    // end
    if (children.length > 0) {
        $firstChild = jQuery(children[0]);
        $lastChild = jQuery(children[children.length - 1]);

        if ($firstChild.is(blockingSelector)) {
            $firstChild.before(placeholderNode);
        }

        if ($lastChild.is(blockingSelector) &&
            !(jQuery.browser.msie && jQuery.browser.version < "7.0")) {

            $lastChild.after(placeholderNode);
        }
    }

    blockSepSelector = this._getBlockSepSelector();

    // Put placeholder nodes between consecutive blocking elements and between
    // blocking elements and normal block-level elements
    $body.find(blockSepSelector).before(placeholderNode);

    blockInListSepSelector = this._getBlockInListSepSelector();
    $blockInList = $body.find(blockInListSepSelector);

    // The $blockInList selection must be iterated over to only add placeholder
    // nodes after blocking elements at the end of a list item rather than all
    // blocking elements in a list. No jQuery selection that is supported on
    // all browsers can do this check, so that is why it must be done by using
    // `each` to iterate over the selection. Note that the handling of the
    // spacing of other blocking elements in a list besides after the last
    // blocking element in a list item is already handled by the
    // blockSepSelector used before this.
    $blockInList.each(function () {
        var $block = jQuery(this);

        if (!$block.next(blockingSelector).length &&
           !$block.next(WYMeditor.BR).length) {

            $block.after(placeholderNode);
        }
    });
};

/**
    editor._getBlockSepSelector
    =============================

    Build a string representing a jquery selector that will find all
    elements which need a spacer <br> before them. This includes all consecutive
    blocking elements and between blocking elements and normal non-blocking
    elements.
*/
WYMeditor.editor.prototype._getBlockSepSelector = function () {
    if (typeof (this._blockSpacersSel) !== 'undefined') {
        return this._blockSpacersSel;
    }

    var wym = this,
        blockCombo = [],
        containersBlockingNav =
            WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION,
        containersNotBlockingNav;

    // Generate the list of non-blocking elements by removing the blocking
    // elements from the list of validRootContainers
    containersNotBlockingNav = jQuery.grep(
        wym.documentStructureManager.structureRules.validRootContainers,
        function (item) {
            return jQuery.inArray(item, containersBlockingNav) === -1;
        }
    );

    // Consecutive blocking elements need separators
    jQuery.each(
        containersBlockingNav,
        function (indexO, elementO) {
            jQuery.each(
                containersBlockingNav,
                function (indexI, elementI) {
                    blockCombo.push(elementO + ' + ' + elementI);
                }
            );
        }
    );

    // A blocking element either followed by or preceeded by a not blocking
    // element needs separators
    jQuery.each(
        containersBlockingNav,
        function (indexO, elementO) {
            jQuery.each(
                containersNotBlockingNav,
                function (indexI, elementI) {
                    blockCombo.push(elementO + ' + ' + elementI);
                    blockCombo.push(elementI + ' + ' + elementO);
                }
            );
        }
    );
    this._blockSpacersSel = blockCombo.join(', ');
    return this._blockSpacersSel;
};

/*
    editor._getBlockInListSepSelector
    ==================================

    Returns a selector for getting all of the block elements in lists
    or sublists. The block elements at the end of lists or sublists should have
    a spacer line break after them in the editor at all times.
*/
WYMeditor.editor.prototype._getBlockInListSepSelector = function () {
    if (typeof (this._blockInListSpacersSel) !== 'undefined') {
        return this._blockInListSpacersSel;
    }

    var blockCombo = [];

    jQuery.each(WYMeditor.LIST_TYPE_ELEMENTS, function (indexO, elementO) {
        jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' ' + elementI);
        });
    });

    this._blockInListSpacersSel = blockCombo.join(', ');
    return this._blockInListSpacersSel;
};

/**
    editor.fixDoubleBr
    ==================

    Remove the <br><br> elements that are inserted between
    paragraphs, usually after hitting enter from an existing paragraph.
*/
WYMeditor.editor.prototype.fixDoubleBr = function () {
    var $body = jQuery(this._doc).find('body.wym_iframe'),
        $last_br;

    // Strip consecutive brs unless they're in a pre tag
    $body.children('br + br').filter(':not(pre br)').remove();

    // Also remove any brs between two p's
    $body.find('p + br').next('p').prev('br').remove();

    // Remove brs floating at the end after a p
    $last_br = $body.find('p + br').slice(-1);
    if ($last_br.length > 0) {
        if ($last_br.next().length === 0) {
            $last_br.remove();
        }
    }
};

/**
    editor.dialog
    =============

    Open a dialog box
*/
WYMeditor.editor.prototype.dialog = function (dialogType, dialogFeatures, bodyHtml) {
    var features = dialogFeatures || this._wym._options.dialogFeatures,
        wDialog = window.open('', 'dialog', features),
        sBodyHtml,
        h = WYMeditor.Helper,
        dialogHtml,
        doc;

    if (wDialog) {
        sBodyHtml = "";

        switch (dialogType) {

        case (WYMeditor.DIALOG_LINK):
            sBodyHtml = this._options.dialogLinkHtml;
            break;
        case (WYMeditor.DIALOG_IMAGE):
            sBodyHtml = this._options.dialogImageHtml;
            break;
        case (WYMeditor.DIALOG_TABLE):
            sBodyHtml = this._options.dialogTableHtml;
            break;
        case (WYMeditor.DIALOG_PASTE):
            sBodyHtml = this._options.dialogPasteHtml;
            break;
        case (WYMeditor.PREVIEW):
            sBodyHtml = this._options.dialogPreviewHtml;
            break;
        default:
            sBodyHtml = bodyHtml;
            break;
        }

        // Construct the dialog
        dialogHtml = this._options.dialogHtml;
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.BASE_PATH,
            this._options.basePath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIRECTION,
            this._options.direction
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.WYM_PATH,
            this._options.wymPath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.JQUERY_PATH,
            this._options.jQueryPath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIALOG_TITLE,
            this.encloseString(dialogType)
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIALOG_BODY,
            sBodyHtml
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.INDEX,
            this._index
        );

        dialogHtml = this.replaceStrings(dialogHtml);

        doc = wDialog.document;
        doc.write(dialogHtml);
        doc.close();
    }
};

/**
    editor.toggleHtml
    =================

    Show/Hide the HTML textarea.
*/
WYMeditor.editor.prototype.toggleHtml = function () {
    jQuery(this._box).find(this._options.htmlSelector).toggle();
};

WYMeditor.editor.prototype.uniqueStamp = function () {
    var now = new Date();
    return "wym-" + now.getTime();
};

/**
    Paste the given array of paragraph-items at the given range inside the given $container.

    It has already been determined that the paragraph has multiple lines and
    that the container we're pasting to is a block container capable of accepting
    further nested blocks.
*/
WYMeditor.editor.prototype._handleMultilineBlockContainerPaste = function (
    wym, $container, range, paragraphStrings
) {

    var i,
        $insertAfter,
        html,
        blockSplitter,
        leftSide,
        rightSide,
        rangeNodeComparison,
        $splitRightParagraph,
        firstParagraphString,
        firstParagraphHtml,
        blockParent,
        blockParentType;


    // Now append all subsequent paragraphs
    $insertAfter = jQuery(blockParent);

    // Just need to split the current container and put new block elements
    // in between
    blockSplitter = 'p';
    if ($container.is('li')) {
        // Instead of creating paragraphs on line breaks, we'll need to create li's
        blockSplitter = 'li';
    }
    // Split the selected element then build and insert the appropriate html
    // This accounts for cases where the start selection is at the
    // start of a node or in the middle of a text node by splitting the
    // text nodes using rangy's splitBoundaries()
    range.splitBoundaries(); // Split any partially-select text nodes
    blockParent = wym.findUp(
        range.startContainer,
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']
    );
    blockParentType = blockParent.tagName;
    leftSide = [];
    rightSide = [];
    jQuery(blockParent).contents().each(function (index, element) {
        // Capture all of the dom nodes to the left and right of our
        // range. We can't remove them in the same step because that
        // loses the selection in webkit

        rangeNodeComparison = range.compareNode(element);
        if (rangeNodeComparison === range.NODE_BEFORE ||
                (rangeNodeComparison === range.NODE_BEFORE_AND_AFTER &&
                 range.startOffset === range.startContainer.length)) {
            // Because of the way splitBoundaries() works, the
            // collapsed selection might appear in the right-most index
            // of the border node, which means it will show up as
            //
            // eg. | is the selection and <> are text node boundaries
            // <foo|><bar>
            //
            // We detect that case by counting any
            // NODE_BEFORE_AND_AFTER result where the offset is at the
            // very end of the node as a member of the left side
            leftSide.push(element);
        } else {
            rightSide.push(element);
        }
    });
    // Now remove all of the left and right nodes
    for (i = 0; i < leftSide.length; i++) {
        jQuery(leftSide[i]).remove();
    }
    for (i = 0; i < rightSide.length; i++) {
        jQuery(rightSide[i]).remove();
    }

    // Rebuild our split nodes and add the inserted content
    if (leftSide.length > 0) {
        // We have left-of-selection content
        // Put the content back inside our blockParent
        jQuery(blockParent).prepend(leftSide);
    }
    if (rightSide.length > 0) {
        // We have right-of-selection content.
        // Split it off in to a node of the same type after our
        // blockParent
        $splitRightParagraph = jQuery('<' + blockParentType + '>' +
            '</' + blockParentType + '>', wym._doc);
        $splitRightParagraph.insertAfter(jQuery(blockParent));
        $splitRightParagraph.append(rightSide);
    }

    // Insert the first paragraph in to the current node, and then
    // start appending subsequent paragraphs
    firstParagraphString = paragraphStrings.splice(
        0,
        1
    )[0];
    firstParagraphHtml = firstParagraphString.split(WYMeditor.NEWLINE).join('<br />');
    jQuery(blockParent).html(jQuery(blockParent).html() + firstParagraphHtml);

    // Now append all subsequent paragraphs
    $insertAfter = jQuery(blockParent);
    for (i = 0; i < paragraphStrings.length; i++) {
        html = '<' + blockSplitter + '>' +
            (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
            '</' + blockSplitter + '>';
        $insertAfter = jQuery(html, wym._doc).insertAfter($insertAfter);
    }
};

/**
    editor.paste
    ============

    Paste text into the editor below the carret, used for "Paste from Word".

    Takes the string to insert as an argument. Two or more newlines separates
    paragraphs. May contain inline HTML.
*/
WYMeditor.editor.prototype.paste = function (str) {
    var container = this.selected(),
        paragraphStrings,
        j,
        textNodesToInsert,
        blockSplitter,
        $container,
        html = '',
        paragraphs,
        i,
        isSingleLine = false,
        sel,
        textNode,
        wym,
        range,
        insertionNodes;
    wym = this;
    sel = rangy.getIframeSelection(wym._iframe);
    range = sel.getRangeAt(0);
    $container = jQuery(container);

    // Start by collapsing the range to the start of the selection. We're
    // punting on implementing a paste that also replaces existing content for
    // now,
    range.collapse(true); // Collapse to the the begining of the selection

    // Split string into paragraphs by two or more newlines
    paragraphStrings = str.split(new RegExp(WYMeditor.NEWLINE + '{2,}', 'g'));

    if (paragraphStrings.length === 1) {
        // This is a one-line paste, which is an easy case.
        // We try not to wrap these in paragraphs
        isSingleLine = true;
    }

    if (typeof container === 'undefined' ||
            (container && container.tagName.toLowerCase() === WYMeditor.BODY)) {
        // No selection, or body selection. Paste at the end of the document

        if (isSingleLine) {
            // Easy case. Wrap the string in p tags
            paragraphs = jQuery(
                '<p>' + paragraphStrings[0] + '</p>',
                this._doc
            ).appendTo(this._doc.body);
        } else {
            // Need to build paragraphs and insert them at the end
            blockSplitter = 'p';
            for (i = paragraphStrings.length - 1; i >= 0; i -= 1) {
                // Going backwards because rangy.insertNode leaves the
                // selection in front of the inserted node
                html = '<' + blockSplitter + '>' +
                    (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
                    '</' + blockSplitter + '>';
                // Build multiple nodes from the HTML because ie6 chokes
                // creating multiple nodes implicitly via jquery
                insertionNodes = jQuery(html, wym._doc);
                for (j = insertionNodes.length - 1; j >= 0; j--) {
                    // Loop backwards through all of the nodes because
                    // insertNode moves that direction
                    range.insertNode(insertionNodes[j]);
                }
            }
        }
    } else {
        // Pasting inside an existing element
        if (isSingleLine || $container.is('pre')) {
            // Easy case. Insert a text node at the current selection
            textNode = this._doc.createTextNode(str);
            range.insertNode(textNode);
        } else if ($container.is('p,h1,h2,h3,h4,h5,h6,li')) {
            wym._handleMultilineBlockContainerPaste(wym, $container, range, paragraphStrings);
        } else {
            // We're in a container that doesn't accept nested paragraphs (eg. td). Use
            // <br> separators everywhere instead
            textNodesToInsert = str.split(WYMeditor.NEWLINE);
            for (i = textNodesToInsert.length - 1; i >= 0; i -= 1) {
                // Going backwards because rangy.insertNode leaves the
                // selection in front of the inserted node
                textNode = this._doc.createTextNode(textNodesToInsert[i]);
                range.insertNode(textNode);
                if (i > 0) {
                    // Don't insert an opening br
                    range.insertNode(jQuery('<br />', wym._doc).get(0));
                }
            }
        }
    }
};

WYMeditor.editor.prototype.insert = function (html) {
    // Do we have a selection?
    var selection = this._iframe.contentWindow.getSelection(),
        range,
        node;
    if (selection.focusNode !== null) {
        // Overwrite selection with provided html
        range = selection.getRangeAt(0);
        node = range.createContextualFragment(html);
        range.deleteContents();
        range.insertNode(node);
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.editor.prototype.wrap = function (left, right) {
    this.insert(
        left + this._iframe.contentWindow.getSelection().toString() + right
    );
};

WYMeditor.editor.prototype.unwrap = function () {
    this.insert(this._iframe.contentWindow.getSelection().toString());
};

WYMeditor.editor.prototype.setFocusToNode = function (node, toStart) {
    var range = rangy.createRange(this._doc),
        selection = rangy.getIframeSelection(this._iframe);
    toStart = toStart || false;

    range.selectNodeContents(node);
    range.collapse(toStart);
    selection.setSingleRange(range);
};

/**
    editor.splitListItemContents
    =============================

    Utility

    Splits a list item into the content that should stay with the li as it is
    indented/outdent and the things that should stay at their current indent level.

    `itemContents` are what a user would consider that list's contents
    `sublistContents` are the sub-items that are nested inside the li
    (basically everything after the first ol/ul inclusive).

    The returned object has `itemContents` and `sublistContents` properties.
*/
WYMeditor.editor.prototype.splitListItemContents = function ($listItem) {
    var $allContents,
        i,
        elmnt,
        hitSublist = false,
        splitObject = {itemContents: [], sublistContents: []};

    $allContents = $listItem.contents();

    for (i = 0; i < $allContents.length; i++) {
        elmnt = $allContents.get(i);
        if (hitSublist || jQuery(elmnt).is('ol,ul')) {
            // We've hit the first sublist. Everything from this point on is
            // considered `sublistContents`
            hitSublist = true;
            splitObject.sublistContents.push(elmnt);
        } else {
            splitObject.itemContents.push(elmnt);
        }
    }

    return splitObject;
};

/**
    editor.joinAdjacentLists
    ========================

    Utility

    Joins two lists if they are adjacent and are of the same type.

    The end result will be `listTwo`s contents being appended to `listOne`
*/
WYMeditor.editor.prototype.joinAdjacentLists = function (listOne, listTwo) {
    var $listTwoContents;

    if (typeof listOne === 'undefined' ||
            typeof listTwo === 'undefined') {
        // Invalid arguments
        return;
    }
    if (listOne.nextSibling !== listTwo ||
            listOne.tagName.toLowerCase() !== listTwo.tagName.toLowerCase()) {
        return;
    }

    $listTwoContents = jQuery(listTwo).contents();
    $listTwoContents.unwrap(); // Kill listTwo
    $listTwoContents.detach();
    jQuery(listOne).append($listTwoContents);
};

/**
    editor._indentSingleItem
    ========================

    Indent a single list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype._indentSingleItem = function (listItem) {
    var wym = this,
        $liToIndent,
        listType,
        spacerHtml,
        containerHtml,

        splitContent,
        $itemContents,
        $sublistContents,

        $prevLi,
        $prevSublist,
        $firstSublist,

        $spacer,
        $spacerContents;

    // The algorithm used here is generally:
    // 1. Ensure there's a previous li to put the `liToIndent`.
    // 2. Move the `liToIndent` into a sublist in the previous li.
    // 3. If we added a spacer_li after `liToIndent` remove it and move its
    // contents inside `liToIndent`.

    // For step 2, the sublist to use can either be:
    // 1. An existing sublist of the correct type at the end of the previous li.
    // 2. An existing sublist inside `liToIndent`.
    // 3. A new sublist that we create.

    $liToIndent = jQuery(listItem);
    listType = $liToIndent.parent()[0].tagName.toLowerCase();

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym.splitListItemContents($liToIndent);
    $sublistContents = jQuery(splitContent.sublistContents);
    $itemContents = jQuery(splitContent.itemContents);

    $prevLi = $liToIndent.prev().filter('li');
    // Ensure we actually have a previous li in which to put the `liToIndent`
    if ($prevLi.length === 0) {
        spacerHtml = '<li class="spacer_li"></li>';
        $liToIndent.before(spacerHtml);
        $prevLi = $liToIndent.prev();
    }

    // Move `liToIndent` to a sublist inside its previous sibling li
    $prevSublist = $prevLi.contents().last().filter('ol,ul');
    if ($prevSublist.length > 0) {
        // Case 1: We have a sublist at the appropriate level as a previous
        // sibling. Leave the sublist contents where they are and join the
        // previous sublist

        // Join our node at the end of the target sublist
        $prevSublist.append($liToIndent);

        // Stick all of the sublist contents at the end of the previous li
        $sublistContents.detach();
        $prevLi.append($sublistContents);

        // If we just moved two lists of the same type next to eachother, join
        // them
        $firstSublist = $sublistContents.first();
        wym.joinAdjacentLists($prevSublist.get(0), $firstSublist.get(0));
    } else {
        if ($sublistContents.length > 0) {
            // Case 2: We need to move our existing sublist to the previous li
            $sublistContents.detach();
            $prevLi.append($sublistContents);
            $prevSublist = $sublistContents.first();
        } else {
            // Case 3: Create a spacer sublist in the previous li in which to
            // place `liToIndent`
            containerHtml = '<' + listType + '></' + listType + '>';
            $prevLi.append(containerHtml);
            $prevSublist = $prevLi.contents().last();
        }

        // Move our li to the start of the sublist
        $prevSublist.prepend($liToIndent);
    }

    // If we eliminated the need for a spacer_li, remove it
    if ($liToIndent.next().is('.spacer_li')) {
        $spacer = $liToIndent.next('.spacer_li');
        $spacerContents = $spacer.contents();
        $spacerContents.detach();
        $liToIndent.append($spacerContents);
        $spacer.remove();
    }

};

/**
    editor._outdentSingleItem
    ========================

    Outdent a single list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype._outdentSingleItem = function (
    listItem,
    keepSublistContentsIndentation
) {
    keepSublistContentsIndentation =
        typeof keepSublistContentsIndentation !== 'undefined' ?
        keepSublistContentsIndentation : true;

    var wym = this,
        $liToOutdent,
        listType,
        spacerListHtml,

        splitContent,
        $itemContents,
        $sublistContents,

        $parentLi,
        $parentList,

        $subsequentSiblingContent,
        $subsequentParentListSiblingContent,

        $sublist;

    // The algorithm used here is generally:
    // 1. Gather all subsequent sibling content in `liToIndent`s list along
    // with all subsequent sibling content in `liToIndent`s parent list.
    // 2. Move `liToIndent` after the li whose sublist it's in.
    // 3. Create a sublist of the same type of `liToIndent`s parent list inside
    // `liToIndent`.
    // 4. If `liToIndent` has a sublist, use a spacer_li and list to hold its
    // position inside the new sublist.
    // 5. Append all original subsequent siblings inside the created sublist.
    // 6. Append all of `liToIndent`s original parent list subsequent sibling
    // content after the created sublist.
    // 7. Remove `liToOutdent`'s original parent list and parent li if either
    // are now empty

    $liToOutdent = jQuery(listItem);
    listType = $liToOutdent.parent()[0].tagName.toLowerCase();

    // If this list item isn't already indented at least one level, don't allow
    // outdenting
    if (!$liToOutdent.parent().parent().is('ol,ul,li')) {
        return;
    }
    if (!$liToOutdent.parent().parent().is('li')) {
        // We have invalid list nesting and we need to fix that
        WYMeditor.console.log(
            'Attempting to fix invalid list nesting before outdenting.'
        );
        wym.correctInvalidListNesting(listItem);
    }

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym.splitListItemContents($liToOutdent);
    $sublistContents = jQuery(splitContent.sublistContents);
    $itemContents = jQuery(splitContent.itemContents);

    // Gather subsequent sibling and parent sibling content
    $parentLi = $liToOutdent.parent().parent('li');
    // Invalid HTML could cause this selector to fail, which breaks our logic.
    // Bail out rather than possibly losing content
    if ($parentLi.length === 0) {
        WYMeditor.console.error('Invalid list. No parentLi found, so aborting outdent');
        return;
    }
    $parentList = $liToOutdent.parent();
    $subsequentSiblingContent = $liToOutdent.nextAllContents();
    $subsequentParentListSiblingContent = $parentList.nextAllContents();

    // Move the li to after the parent li
    $liToOutdent.detach();
    $parentLi.after($liToOutdent);

    // If this node has one or more sublists, they will need to be indented
    // by one with a fake parent to hold their previous position
    if (
        $sublistContents.length > 0 &&
        // This is a trigger to prevent this
        keepSublistContentsIndentation === true
    ) {
        spacerListHtml = '<' + listType + '>' +
            '<li class="spacer_li"></li>' +
            '</' + listType + '>';
        $liToOutdent.append(spacerListHtml);
        $sublist = $liToOutdent.children().last();
        // Add all of the sublistContents inside our new spacer li
        $sublistContents.detach();
        $sublist.children('li').append($sublistContents);
    }

    if ($subsequentSiblingContent.length > 0) {
        // Nest the previously-subsequent items inside the list to
        // retain order and their indent level
        if (typeof $sublist === 'undefined') {
            // Insert a sublist if we don't already have one
            spacerListHtml = '<' + listType + '></' + listType + '>';
            $liToOutdent.append(spacerListHtml);
            $sublist = $liToOutdent.children().last();
        }
        $subsequentSiblingContent.detach();
        $sublist.append($subsequentSiblingContent);
    }

    // If we have a parentItem with content after our parent list
    // eg. <ol>
    //       <li>one
    //         <ul ...>
    //         two
    //         <ul ...>
    //         three
    //       </li>
    //     </ol>
    // we'll need to split that parentItem to retain proper content ordering
    if ($subsequentParentListSiblingContent.length > 0) {
        // Move the subsequent content in to a new list item after our parent li
        $subsequentParentListSiblingContent.detach();

        // If our last content and the first content in the subsequent content
        // are both text nodes, insert a <br /> spacer to avoid crunching the
        // text together visually. This maintains the same "visual" structure.
        if ($liToOutdent.contents().length > 0 &&
                $liToOutdent.contents().last()[0].nodeType === WYMeditor.NODE.TEXT &&
                $subsequentParentListSiblingContent[0].nodeType === WYMeditor.NODE.TEXT) {
            $liToOutdent.append('<br />');
        }

        $liToOutdent.append($subsequentParentListSiblingContent);
    }

    // Remove our parentList if it's empty and if we just removed that, the
    // parentLi is likely to be empty also
    if ($parentList.contents().length === 0) {
        $parentList.remove();
    }
    if ($parentLi.contents().length === 0) {
        $parentLi.remove();
    }
};

/**
    editor.correctInvalidListNesting
    ================================

    Take an li/ol/ul and correct any list nesting issues in the entire list
    tree.

    Corrected lists have the following properties:
    1. ol and ul nodes *only* allow li children.
    2. All li nodes have either an ol or ul parent.

    The `alreadyCorrected` argument is used to indicate if a correction has
    already been made, which means we need to return true even if no further
    corrections are made.

    Returns true if any nodes were corrected.
 */
WYMeditor.editor.prototype.correctInvalidListNesting = function (listItem, alreadyCorrected) {
    // Travel up the dom until we're at the root ol/ul/li
    var currentNode = listItem,
        $currentNode,
        parentNode,
        tagName;

    // Browsers can sometimes create `p` elements within `li` elements. This
    // is issue 430.
    // Check for this issue: If the `currentNode` is a `p` within a `li`
    if (currentNode !== null &&
        currentNode.tagName.toLowerCase() === 'p' &&
        currentNode.parentNode.tagName.toLowerCase() === 'li') {

        // Fix this `p` using the dedicated function
        this._correctBlockInList(currentNode);

        // Don't proceed with further list correction.
        return;
    }

    if (typeof alreadyCorrected === 'undefined') {
        alreadyCorrected = false;
    }
    if (!currentNode) {
        return alreadyCorrected;
    }
    while (currentNode.parentNode) {
        parentNode = currentNode.parentNode;
        if (parentNode.nodeType !== WYMeditor.NODE.ELEMENT) {
            // Our parent is outside a valid list structure. Stop at this node.
            break;
        }
        tagName = parentNode.tagName.toLowerCase();
        if (tagName !== 'ol' && tagName !== 'ul' && tagName !== 'li') {
            // Our parent is outside a valid list structure. Stop at this node.
            break;

        }
        // We're still traversing up a list structure. Keep going
        currentNode = parentNode;
    }
    // Cache a jQuery currentNode
    $currentNode = jQuery(currentNode);

    // We have the root node. Make sure it's legit
    if ($currentNode.is('li')) {
        // We have an li as the "root" because its missing a parent list.
        // Correct this problem and then try again to correct the nesting.
        WYMeditor.console.log(
            "Correcting orphaned root li before correcting invalid list nesting."
        );
        this._correctOrphanedListItem(currentNode);
        return this.correctInvalidListNesting(currentNode, true);
    }
    if (!$currentNode.is('ol,ul')) {
        WYMeditor.console.error("Can't correct invalid list nesting. No root list found");
        return alreadyCorrected;
    }
    return this._correctInvalidListNesting(currentNode, alreadyCorrected);
};
/**
    editor._correctOrphanedListItem
    ===============================

    Ensure that the given ophaned list item has a proper list parent.

    Uses the sibling nodes to determine what kind of list should be used. Also
    wraps sibling adjacent orphaned li nodes in the same list.
 */
WYMeditor.editor.prototype._correctOrphanedListItem = function (listNode) {
    var prevAdjacentLis,
        nextAdjacentLis,
        $adjacentLis = jQuery(),
        prevList,
        prevNode;

    prevAdjacentLis = jQuery(listNode).prevContentsUntil(':not(li)');
    nextAdjacentLis = jQuery(listNode).nextContentsUntil(':not(li)');

    // Merge the collections together
    $adjacentLis = $adjacentLis.add(prevAdjacentLis);
    $adjacentLis = $adjacentLis.add(listNode);
    $adjacentLis = $adjacentLis.add(nextAdjacentLis);

    // Determine if we have a list node in which to insert all of our orphaned
    // li's
    prevNode = $adjacentLis[0].previousSibling;
    if (prevNode && jQuery(prevNode).is('ol,ul')) {
        prevList = prevNode;
    } else {
        // No previous existing list to use. Need to create one
        $adjacentLis.before('<ol></ol>');
        prevList = $adjacentLis.prev()[0];
    }

    // Insert all of the adjacent orphaned lists inside the new parent
    jQuery(prevList).append($adjacentLis);
};

/**
    editor._correctBlockInList
    ========================

    Browsers insert `p` elements into lists. This breaks desired list
    structure. Fix it.

    @param pToRemove The `p` element that requires replacing with a `li`
 */
WYMeditor.editor.prototype._correctBlockInList = function (pToRemove) {
    var pSiblings,
        liContentBeforeP,
        liContentAfterP,
        parentList,
        parentLiIndex,
        threeLis = '<li></li><li data-wym-caret=""></li><li></li>',
        newLi;

    // if the `p` element was created at the end of a list
    if (jQuery(pToRemove).next().length === 0) {

         //Insert a `li` where it is supposed to be: after the unwanted `p`
         //element's parent.
        jQuery(pToRemove.parentNode).after('<li data-wym-caret=""></li>');

        // Save the new `li`
        newLi = jQuery(this._doc).find('body.wym_iframe [data-wym-caret=""]')[0];

        // Set caret position to the new `li`
        this.setFocusToNode(newLi);

        // Teleport contents of `p` to new `li`
        jQuery(newLi).append(jQuery(pToRemove).contents());

        // Clean up the caret position marker
        newLi.removeAttribute('data-wym-caret');

        // And remove the `p`.
        jQuery(pToRemove).remove();

    } else if (
        // If the `p` element was created not at the end of a list.
        jQuery(pToRemove).next().length > 0  &&
        pToRemove.nextSibling.tagName.toLowerCase() === 'ol' ||
        pToRemove.nextSibling.tagName.toLowerCase() === 'ul'
       ) {

        // Save the `p`'s siblings
        pSiblings = jQuery(pToRemove).parent().contents();

        // Collect before `p`
        liContentBeforeP = jQuery(pSiblings).slice(
            0, jQuery(pSiblings).index(pToRemove)
        );

        // And after it
        liContentAfterP = pSiblings.slice(
            pSiblings.index(pToRemove) + 1
        );

        // The parent list because we're going to cut the branch that
        // we're sitting on
        parentList = jQuery(pToRemove).parent().parent();

        // Get the index of the parent `li` for re-insertion later
        parentLiIndex = jQuery(pToRemove).parent('li').index();

        // Remove the parent `li` (branch we're sitting on)
        jQuery(pToRemove).parent('li').remove();

        // Append three list items; one for the content from before the
        // `p`, one for replacing the `p` and one for the content from
        // after the `p`

        // If the parent `li` was first in the list
        if (parentLiIndex === 0) {
            // Prepend the three `li`s to the list
            parentList.prepend(threeLis);
        // If the parent `li` was not first in the list
        } else {
            // Insert the three `li`s after the object that was before it
            parentList.children().eq(parentLiIndex - 1).after(threeLis);
        }

        // Append content from before the `p`
        parentList.children('li').eq(parentLiIndex).append(
            liContentBeforeP
        );

        // Save the new `li`
        newLi = jQuery(this._doc).find('body.wym_iframe [data-wym-caret=""]')[0];

        // Teleport contents of `p` to it's replacement `li`
        jQuery(newLi).append(jQuery(pToRemove).contents());

        // Append content from after the `p`
        parentList.children('li').eq(parentLiIndex + 2).append(
            liContentAfterP
        );

        // Set caret
        this.setFocusToNode(newLi);

        // Clean up the caret position marker
        jQuery(this._doc).find(
            'body.wym_iframe [data-wym-caret=""]'
        )[0].removeAttribute('data-wym-caret');
    }
};

/**
    editor._correctInvalidListNesting
    ================================

    This is the function that actually does the list correction.
    correctInvalidListNesting is just a helper function that first finds the root
    of the list.

    Returns true if any correction was made.

    We use a reverse preorder traversal to navigate the DOM because we might be:

    * Making nodes children of their previous sibling (in the <ol><li></li><ol>...</ol></ol> case)
    * Adding nodes at the current level (wrapping any non-li node inside a ul/ol in a new li node)

    Adapted from code at: Tavs Dokkedahl from
    http://www.jslab.dk/articles/non.recursive.preorder.traversal.part3
 */
WYMeditor.editor.prototype._correctInvalidListNesting = function (listNode, alreadyCorrected) {
    var rootNode = listNode,
        currentNode = listNode,
        wasCorrected = false,
        previousSibling,
        tagName,
        ancestorNode,
        nodesToMove,
        targetLi,
        lastContentNode,
        spacerHtml = '<li class="spacer_li"></li>';
    if (typeof alreadyCorrected !== 'undefined') {
        wasCorrected = alreadyCorrected;
    }

    while (currentNode) {
        if (currentNode._wym_visited) {
            // This node has already been visited.
            // Remove mark for visited nodes
            currentNode._wym_visited = false;
            // Once we reach the root element again traversal
            // is done and we can break
            if (currentNode === rootNode) {
                break;
            }
            if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
            } else {
                currentNode = currentNode.parentNode;
            }
        } else {
            // This is the first visit for this node

            // All non-li nodes must have an
            // ancestor li node that's closer than any ol/ul ancestor node.
            // Basically, everything needs to be inside an li node.
            if (currentNode !== rootNode && !jQuery(currentNode).is('li')) {
                // We have a non-li node.
                // Ensure that we have an li ancestor before we have any ol/ul
                // ancestors

                ancestorNode = currentNode;
                while (ancestorNode.parentNode) {
                    ancestorNode = ancestorNode.parentNode;
                    if (jQuery(ancestorNode).is('li')) {
                        // Everything is ok. Hit an li before a ol/ul
                        break;
                    }

                    if (ancestorNode.nodeType !== WYMeditor.NODE.ELEMENT) {
                        // Our parent is outside a valid list structure. Stop at this node.
                        break;
                    }
                    tagName = ancestorNode.tagName.toLowerCase();
                    if (tagName === 'ol' || tagName === 'ul') {
                        // We've hit a list container before any list item.
                        // This isn't valid html and causes editing problems.
                        //
                        // Convert the list to a valid structure that closely
                        // mimics the layout and behavior of invalidly nested
                        // content inside a list. The browser treats the
                        // content similar to how it would treat that same
                        // content separated by a <br /> within its previous
                        // sibling list item, so recreate that structure.
                        //
                        // The algorithm for performing this is basically:
                        // 1. Gather this and any previous siblings up until the
                        // previous li (if one exists) as content to move.
                        // 2. If we don't have any previous or subsequent li
                        // sibling, create a spacer li in which to insert all
                        // the gathered content.
                        // 3. Move all of the content to the previous li or the
                        // subsequent li (in that priority).
                        WYMeditor.console.log("Fixing orphaned list content");
                        wasCorrected = true;

                        // Gather this and previous sibling until the previous li
                        nodesToMove = [currentNode];
                        previousSibling = currentNode;
                        targetLi = null;
                        while (previousSibling.previousSibling) {
                            previousSibling = previousSibling.previousSibling;
                            if (jQuery(previousSibling).is('li')) {
                                targetLi = previousSibling;
                                // We hit an li. Store it as the target in
                                // which to move the nodes
                                break;
                            }
                            nodesToMove.push(previousSibling);
                        }

                        // We have our nodes ordered right to left and we need
                        // them left to right
                        nodesToMove.reverse();

                        // If there are no previous siblings, we can join the next li instead
                        if (!targetLi && nodesToMove.length === 1) {
                            if (jQuery(currentNode.nextSibling).is('li')) {
                                targetLi = currentNode.nextSibling;
                            }
                        }

                        // If we still don't have an li in which to move, we
                        // need to create a spacer li
                        if (!targetLi) {
                            jQuery(nodesToMove[0]).before(spacerHtml);
                            targetLi = jQuery(nodesToMove[0]).prev()[0];
                        }

                        // Move all of our content inside the li we've chosen
                        // If the last content node inside the target li is
                        // text and so is the first content node to move, separate them
                        // with a <br /> to preserve the visual layout of them
                        // being on separate lines
                        lastContentNode = jQuery(targetLi).contents().last();
                        if (lastContentNode.length === 1 &&
                                lastContentNode[0].nodeType === WYMeditor.NODE.TEXT) {
                            if (nodesToMove[0].nodeType === WYMeditor.NODE.TEXT) {
                                jQuery(targetLi).append('<br />');
                            }
                        }
                        jQuery(targetLi).append(jQuery(nodesToMove));

                        break;

                    }
                    // We're still traversing up a list structure. Keep going
                }
            }

            if (currentNode.lastChild) {
                // Since we have childnodes, mark this as visited because
                // we'll return later
                currentNode._wym_visited = true;
                currentNode = currentNode.lastChild;
            } else if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
            } else {
                currentNode = currentNode.parentNode;
            }
        }
    }

    return wasCorrected;
};

/**
    editor.correctpotentialblockinlist
    ==================================

    Issue #430. Browsers create block elements like `p` when enter is pressed
    inside an empty list item. This breaks desired list structure. This
    function tests for this particular situation and calls for the correcting
    function if it detects that this is indeed the case.

    @param evtWhich the event, to check whether it is an enter
    @param container the current container node, to test on perhaps deliver
                     on to the correcting function.
 */
WYMeditor.editor.prototype.correctPotentialBlockInList = function (
    evt_which, container
    ) {
    var wym = this;

    if (evt_which === WYMeditor.KEY.ENTER &&
        container.tagName.toLowerCase() === "p" &&
        container.parentNode.tagName.toLowerCase() === "li") {
        wym._correctBlockInList(container);
    }
};

/**
    editor.getCommonParentList
    ==========================

    Get the common parent ol/ul for the given li nodes. If the parent ol/ul for
    each cell isn't the same, returns null.

    @param listItems An array of list item nodes to check for a common parent
    @param getClosest If true, checks if the closest list parent to each list
                      node is the same. If false, checks if the furthest list
                      parent to each list node is the same.
 */
WYMeditor.editor.prototype.getCommonParentList = function (listItems, getClosest) {
    var firstLi,
        parentList,
        rootList,
        haveCommonParent = true;

    listItems = jQuery(listItems).filter('li');
    if (listItems.length === 0) {
        return null;
    }
    firstLi = listItems[0];
    parentList = jQuery(firstLi).parents('ol,ul');
    parentList = (getClosest ? parentList.first() : parentList.last());

    if (parentList.length === 0) {
        return null;
    }
    rootList = parentList[0];

    // Ensure that all of the li's have the same parent list
    jQuery(listItems).each(function (index, elmnt) {
        parentList = jQuery(elmnt).parents('ol,ul');
        parentList = (getClosest ? parentList.first() : parentList.last());
        if (parentList.length === 0 || parentList[0] !== rootList) {
            haveCommonParent = false;
        }
    });

    if (!haveCommonParent) {
        return null;
    }
    return rootList;
};

/**
    editor._getSelectedListItems
    ============================

    Based on the given selection, determine which li nodes are "selected" from
    the user's standpoint. These are the li nodes that they would expect to be
    affected by an action with the given selection.

    Generally, this means any li which has at least some of its text content
    highlighted will be returned.
*/
WYMeditor.editor.prototype._getSelectedListItems = function (sel) {
    var wym = this,
        i,
        j,
        range,
        selectedLiChild,
        selectedLi,
        nodes = [],
        liNodes = [],
        containsNodeTextFilter,
        node;

    // This is a helper function that is called within a loop later on.
    // It is here because we don't write functions in a loop.
    function returnIfHasParentLi(index, node) {
        if (
            node.parentNode &&
            node.parentNode.tagName &&
            node.parentNode.tagName.toLowerCase() === 'li'
        ) {
                return node;
        }
    }

    // Filter function to remove undesired nodes from what rangy.getNodes()
    // gives
    containsNodeTextFilter = function (testNode) {
        var fullyContainsNodeText;

        // Include any partially-selected textNodes
        if (rangy.dom.isCharacterDataNode(testNode)) {
            return testNode;
        }

        try {
            fullyContainsNodeText = range.containsNodeText(testNode);
        } catch (e) {
            // Rangy throws an exception on an internal
            // intersection call on the last node that's
            // actually in the selection
            return true;
        }

        if (fullyContainsNodeText === true) {
            // If we fully contain any text in this node, it's definitely
            // selected
            return true;
        }
    };

    // Iterate through all of the selection ranges and include any li nodes
    // that are user-selected in each range
    for (i = 0; i < sel.rangeCount; i++) {
        range = sel.getRangeAt(i);

        if (
        // If range is within one parent list item and
            wym.findUp(
                range.startContainer,
                'li'
            ) === wym.findUp(
                range.endContainer,
               'li') &&
        // is not across lists:
            jQuery(range.getNodes()).filter('ol, ul').length === 0
        ) {
            // If the range is directly within a list item:
            if (
                range.startContainer.tagName &&
                range.startContainer.tagName.toLowerCase() === 'li'
            ) {
                // Save the first node in the range
                selectedLiChild = range.startContainer
                    .childNodes[range.startOffset];
            // Otherwise
            } else {
                // Save the closest ancestor of the range's container
                // that is a child of a list item.
                selectedLiChild = jQuery(range.startContainer)
                    .parents().andSelf().map(returnIfHasParentLi).last();
            }
            // If a list precedes:
            if (jQuery(selectedLiChild).prevAll('ol, ul').length > 0) {
                // return the emtpy array.
                return liNodes;
            }
        }

        if (range.collapsed === true) {
            // Collapsed ranges don't return the range they're in as part of
            // getNodes, so let's find the next list item up
            selectedLi = wym.findUp(range.startContainer, 'li');
            if (selectedLi) {
                nodes = nodes.concat([selectedLi]);
            }
            liNodes = nodes;
        } else {
            // getNodes includes the parent list item whenever we have our
            // selection in a sublist. We need to make a distinction between
            // when the parent list item is actually selected and when it's
            // only sort of selected because we're selecting a sub-item
            // (meaning it's partially selected).
            // In the following case, we don't want `2` as one of our nodes:
            // 1
            // 2
            //   2.1
            //   2|.2
            // 3|
            nodes = nodes.concat(
                range.getNodes(
                    [],
                    containsNodeTextFilter
                )
            );

            // We also need to include the parent li if we selected a non-li, non-list node.
            // eg. if we select text inside an li, the user is actually
            // selecting that entire li
            liNodes = [];
            for (j = 0; j < nodes.length; j++) {
                node = nodes[j];
                if (!jQuery(node).is('li,ol,ul')) {
                    // Crawl up the dom until we find an li
                    while (node.parentNode) {
                        node = node.parentNode;
                        if (jQuery(node).is('li')) {
                            // If it isn't a duplicate
                            if (jQuery.inArray(node, liNodes) === -1) {
                                // Add it to liNodes
                                liNodes.push(node);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    return liNodes;
};

/**
    editor._selectionOnlyInList
    ===========================

    Tests if all of the nodes within the passed selection are contained in one
    list. Returns true if all of the nodes are within one list, and returns
    false if otherwise.

    @param sel A selection to test for being entirely contained within one
               list.
*/
WYMeditor.editor.prototype._selectionOnlyInList = function (sel) {
    var wym = this._wym,
        selStartNode,
        selEndNode,
        i;

    for (i = 0; i < sel.rangeCount; ++i) {
        selStartNode = wym.findUp(sel.getRangeAt(i).startContainer, ['li']);
        selEndNode = wym.findUp(sel.getRangeAt(i).endContainer, ['li']);

        // If the start or end node is not contained within a list item, return
        // false.
        if (!selStartNode || !selEndNode) {
            return false;
        }

        // If the two list items do not have a common parent list, return
        // false.
        if (!wym.getCommonParentList([selStartNode, selEndNode], false)) {
            return false;
        }
    }

    return true;
};

/**
    editor.indent
    =============

    Indent the selected list items via the dom.

    Only list items that have a common list will be indented.
 */
WYMeditor.editor.prototype.indent = function () {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        manipulationFunc,
        i;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = rangy.getIframeSelection(this._iframe);

    // If all of the selected nodes are not contained within one list, don't
    // perform the action.
    if (!wym._selectionOnlyInList(sel)) {
        return false;
    }

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);
    if (listItems.length === 0) {
        return false;
    }

    manipulationFunc = function () {
        var domChanged = false;

        for (i = 0; i < listItems.length; i++) {
            wym._indentSingleItem(listItems[i]);
            domChanged = true;
        }

        return domChanged;
    };
    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.outdent
    ==============

    Outdent a list item, accounting for firefox bugs to ensure consistent
    behavior and valid HTML.
*/
WYMeditor.editor.prototype.outdent = function () {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        manipulationFunc,
        i;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = rangy.getIframeSelection(this._iframe);

    // If all of the selected nodes are not contained within one list, don't
    // perform the action.
    if (!wym._selectionOnlyInList(sel)) {
        return false;
    }

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);

    if (listItems.length === 0) {
        return false;
    }

    manipulationFunc = function () {
        var domChanged = false;

        for (i = 0; i < listItems.length; i++) {
            wym._outdentSingleItem(listItems[i]);
            domChanged = true;
        }

        return domChanged;
    };
    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.restoreSelectionAfterManipulation
    ========================================

    A helper function to ensure that the selection is restored to the same
    location after a potentially-complicated dom manipulation is performed. This
    also handles the case where the dom manipulation throws and error by cleaning
    up any selection markers that were added to the dom.

    `manipulationFunc` is a function that takes no arguments and performs the
    manipulation. It should return `true` if changes were made that could have
    potentially destroyed the selection.
*/
WYMeditor.editor.prototype.restoreSelectionAfterManipulation = function (manipulationFunc) {
    var savedSelection = rangy.saveSelection(rangy.dom.getIframeWindow(this._iframe)),
        changesMade = true;

    // If something goes wrong, we don't want to leave selection markers
    // floating around
    try {
        changesMade = manipulationFunc();
        if (changesMade) {
            rangy.restoreSelection(savedSelection);
        } else {
            rangy.removeMarkers(savedSelection);
        }
    } catch (e) {
        WYMeditor.console.error("Error during manipulation");
        WYMeditor.console.error(e);
        rangy.removeMarkers(savedSelection);
    }

    return changesMade;
};

/**
    editor.insertOrderedlist
    =========================

    Convert the selected block in to an ordered list.

    If the selection is already inside a list, switch the type of the nearest
    parent list to an `<ol>`. If the selection is in a block element that can be a
    valid list, place that block element's contents inside an ordered list.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertOrderedList)`.
 */
WYMeditor.editor.prototype.insertOrderedlist = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym._insertList('ol');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.insertUnorderedlist
    =========================

    Convert the selected block in to an unordered list.

    Exactly the same as `editor.insert_orderedlist` except with `<ol>` instead.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertUnorderedList)`.
 */
WYMeditor.editor.prototype.insertUnorderedlist = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selected(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym._insertList('ul');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor._insertList
    =========================


 */
WYMeditor.editor.prototype._insertList = function (listType) {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        $listItems,
        $parentListsOfDifferentType,
        i,
        potentialListBlock;

    // Get a list of of potentially selected list items.
    listItems = wym._getSelectedListItems(sel);
    // If the selection contains list items:
    if (listItems.length > 0) {
        // Cache a jQuery object of the list items.
        $listItems = jQuery(listItems);
        // Get a jQuery object of potential parent lists of selected list
        // items that are of a different list type.
        $parentListsOfDifferentType = $listItems.parent().filter(
            ':not(' + listType + ')'
        );
        // If there are any parent lists of selected list
        // items that are of a different list type:
        if ($parentListsOfDifferentType.length > 0) {
            // Iterate through list items:
            for (i = 0; i < $parentListsOfDifferentType.length; i++) {
                // Call for the change of the type of the parent list item to
                // the desired type.
                this._changeListType($parentListsOfDifferentType[i], listType);
            }
            // Return true.
            return true;
        // If all the list types of parent lists of selected list items are
        // the same as the requested list type:
        } else {
            // Call for the de-listing of the selected list items.
            this._removeItemsFromList($listItems);
            // Return true.
            return true;
        }
    }
    // Get a potential block element from selection that could be converted
    // into a list:
    // TODO: Use `_containerRules['root']` minus the ol/ul and
    // `_containerRules['contentsCanConvertToList']
    potentialListBlock = this.findUp(this.selected(), WYMeditor.POTENTIAL_LIST_ELEMENTS);
    // If it exists:
    if (potentialListBlock) {
        // Call for the conversion of that block element into a list.
        this._convertToList(potentialListBlock, listType);
        // Return true.
        return true;
    }

    // The user has something selected that wouldn't be a valid list
    return false;
};

WYMeditor.editor.prototype._changeListType = function (list, listType) {
    // Wrap the contents in a new list of `listType` and remove the old list
    // container.
    return WYMeditor.changeNodeType(list, listType);
};

WYMeditor.editor.prototype._convertToList = function (blockElement, listType) {
    var $blockElement = jQuery(blockElement),
        newListHtml,
        $newList;

    // ie6 doesn't support calling wrapInner with a dom node. Build html
    newListHtml = '<' + listType + '><li></li></' + listType + '>';

    if (this.findUp(blockElement, WYMeditor.MAIN_CONTAINERS) === blockElement) {
        // TODO: Handle ol/ul elements, since these are now in the `root`
        // containers list

        // This is a main container block, so we can just replace it with the
        // list structure
        $blockElement.wrapInner(newListHtml);
        $newList = $blockElement.children();
        $newList.unwrap();

        return $newList.get(0);
    }
    // We're converting a block that's not a main container, so we need to nest
    // this list around its contents and NOT remove the container (eg. a td
    // node).
    $blockElement.wrapInner(newListHtml);
    $newList = $blockElement.children();

    return $newList.get(0);
};

/**
    editor._removeItemsFromList
    ===========================

    De-list the provided list items.

    @param listItems An array of list items that are assumed to be
                     of a single selection range and concurrent.

*/
WYMeditor.editor.prototype._removeItemsFromList = function ($listItems) {

    var $listItem,
        i,
        j,
        $childNodesToTransfer,
        k,
        rootContainer = this.documentStructureManager.structureRules.defaultRootContainer;

    // Filter out all list items that have parents within the list items.
    $listItems = $listItems.not($listItems.find('li'));
    // Iterate through the list items:
    for (i = 0; i < $listItems.length; i++) {
        // Cache a jQuery object of the current list item in the iteration.
        $listItem = jQuery($listItems[i]);

        // At this stage we determine the type of element this list item
        // will be transformed into.

        // If the parent of the list item is nested within a list:
        if ($listItem.parent().parent('li').length === 1) {
            // Call for the transformation of it into a span element.
            $listItem = jQuery(this.switchTo(
                $listItem[0], 'span', false, false));
        // If the parent of the list item is not nested within a list:
        } else {
            // Call for the transformation of it into a default root container.
            $listItem = jQuery(this.switchTo(
                $listItem[0],
                rootContainer,
                false,
                false
            ));
        }

        // The transformation should be complete and the object is no longer
        // a list item, hence we call it 'the de-listed object'.
        //
        // At this stage we move the de-listed object according to its
        // relation to its potential sibling nodes.

        // If the de-listed object is the only node in its parent list:
        if ($listItem.parent().children().length === 1) {
            // Move it to before its parent list.
            $listItem.parent().before($listItem);
            //Remove its parent list.
            $listItem.next().remove();
        } else if (
        // The de-listed object is the first node in its parent list.
            $listItem[0] === $listItem.parent().children().first()[0]
        ) {
            // Move it to before its parent list.
            $listItem.parent().before($listItem);
        } else if (
            // The de-listed object is not the first node in its parent list and
            $listItem[0] !== $listItem.parent().children().first()[0] &&
            // it is not the last node in its parent list.
            $listItem[0] !== $listItem.parent().children().last()[0]
        ) {
            // Create a new list of the same type as its parent list before its
            // parent list.
            $listItem.parent().before([''
                , '<' + $listItem.parent()[0].tagName + '>'
                , '</' + $listItem.parent()[0].tagName + '>'
                ].join('')
            );
            // Move all the sibling nodes that precede the de-listed item to
            // the list that is before their parent list.
            jQuery($listItem.prevAll().toArray().reverse()).appendTo(
                $listItem.parent().prev()
            );
            // Move the de-listed item to before its parent list.
            $listItem.parent().before($listItem);
        // Else, if the de-listed object is the last node in its parent list:
        } else if ($listItem[0] === $listItem.parent().children().last()[0]) {
            // Move this iteration's de-listed item to after its parent list.
            $listItem.parent().after($listItem);
        }

        // The de-listed object should now be at it's final destination.

        // Iterate over the contents of the de-listed object.
        for (j = 0; j < $listItem.contents().length; j++) {
            if (
            // If The node is an element and
                $listItem.contents()[j].tagName &&
            // is not the Rangy selection boundary:and
                $listItem.contents(
                    )[j].className !== 'rangySelectionBoundary' &&
            // is a block type element and
                jQuery.inArray(
                    $listItem.contents()[j].tagName.toLowerCase(),
                    WYMeditor.BLOCKS
                ) !== -1
            ) {
                // Save the contents of the de-listed object starting from the first
                // block type element onward.
                $childNodesToTransfer = $listItem.contents().slice(j);
                // If the de-listed object is of the default root container type:
                if (
                    $listItem[0].tagName.toLowerCase() ===
                        rootContainer
                ) {
                    // Iterate over the previously saved partial contents of it:
                    for (k = 0; k < $childNodesToTransfer.length; k++) {
                        // If this node is a text node:
                        if ($childNodesToTransfer[k].nodeType === 3) {
                            // Wrap it with the default root container.
                            $childNodesToTransfer.eq(k).wrap(
                                '<' + rootContainer + ' />'
                            );
                        } else if (
                        // Otherwise, if it is an element and
                            ($childNodesToTransfer[k].tagName) &&
                        // it is not a block element:
                            jQuery.inArray(
                                $childNodesToTransfer[k].tagName.toLowerCase(),
                                WYMeditor.BLOCKS
                            ) === -1
                        ) {
                            // Transform its type into the default root container.
                            this.switchTo(
                            $childNodesToTransfer[k],
                            rootContainer, false, false
                        );
                        }
                    }
                }
                // Move the partial contents of the de-listed object to after
                // it.
                $listItem.after($listItem.contents().slice(j));
                // Break
                break;
            }
        }

        // At this stage we add `br` elements that may be necessary because
        // by turning a `li` element into a `span` element we turn a block
        // type element into an inline type element.

        // If the de-listed object is a span:
        if ($listItem[0].tagName.toLowerCase() === 'span') {
            if (
            // The de-listed object has a node immediately before it and
                $listItem[0].previousSibling &&
            // That is a text node, or
                $listItem[0].previousSibling.nodeType === 3 ||
            // The de-listed object has an element immediately before it and
                $listItem.prev().length === 1 &&
            // That is not a block type element:
                jQuery.inArray(
                    $listItem.prev()[0].tagName.toLowerCase(),
                    WYMeditor.BLOCKS
                ) === -1
            ) {
                // Insert a br element before the de-listed object.
                $listItem.before('<br/>');
            }
            if (
            // The de-listed object has a node immediately after it and
                $listItem[0].nextSibling &&
            // That is a text node, or
                $listItem[0].nextSibling.nodeType === 3 ||
            // The de-listed object has an element immediately after it and
                $listItem.next().length === 1 &&
            // That is not a block type element:
                jQuery.inArray(
                    $listItem.next()[0].tagName.toLowerCase(),
                    WYMeditor.BLOCKS
                ) === -1
            ) {
                // Insert a br element after the de-listed object.
                $listItem.after('<br/>');
            }

            // The de-listed item should now have `br` elements before and/or
            // after it, as appropriate.
            //
            // At this stage, if the span has no attributes, there is no use
            // for it being a span so we replace it with it's contents.

            // If the de-listed item has no attributes:
            if ($listItem[0].attributes.length === 0) {
                // Move its contents before it.
                $listItem.before($listItem.contents());
                // Remove it.
                $listItem.remove();
            }
        }
    }
};
/**
     editor.insertTable
     ==================

     Insert a table at the current selection with the given number of rows
     and columns and with the given caption and summary text.
*/
WYMeditor.editor.prototype.insertTable = function (rows, columns, caption, summary) {
    if ((rows <= 0) || (columns <= 0)) {
        // We need rows and columns to make a table

        // TODO: It seems to me we should warn the user when zero columns and/or
        // rows were entered.
        return;
    }

    var table = this._doc.createElement(WYMeditor.TABLE),
        newRow = null,
        newCaption,

        x,
        y,
        container,
        selectedNode;

    // Create the table caption
    newCaption = table.createCaption();
    newCaption.innerHTML = caption;

    // Create the rows and cells
    for (x = 0; x < rows; x += 1) {
        newRow = table.insertRow(x);
        for (y = 0; y < columns; y += 1) {
            newRow.insertCell(y);
        }
    }

    if (summary !== "") {
        // Only need to set the summary if we actually have a summary
        jQuery(table).attr('summary', summary);
    }

    // Find the currently-selected container
    container = jQuery(
        this.findUp(this.container(), WYMeditor.POTENTIAL_TABLE_INSERT_ELEMENTS)
    ).get(0);

    if (!container || !container.parentNode) {
        // No valid selected container. Put the table at the end.
        jQuery(this._doc.body).append(table);

    } else if (jQuery.inArray(container.nodeName.toLowerCase(),
                       WYMeditor.INLINE_TABLE_INSERTION_ELEMENTS) > -1) {
        // Insert table after selection if container is allowed to have tables
        // inserted inline.
        selectedNode = this.selection().focusNode;

        // If the selection is within a table, move the selection to the parent
        // table to avoid nesting the tables.
        if (jQuery.inArray(selectedNode.nodeName.toLowerCase(),
                           WYMeditor.SELECTABLE_TABLE_ELEMENTS) > -1 ||
            jQuery.inArray(selectedNode.parentNode.nodeName.toLowerCase(),
                           WYMeditor.SELECTABLE_TABLE_ELEMENTS) > -1) {

            while (selectedNode.nodeName.toLowerCase() !== WYMeditor.TABLE) {
                selectedNode = selectedNode.parentNode;
            }
        }

        // If the list item itself is selected, append the table to it. If the
        // selection is within the list item, put the table after it. Either
        // way, this ensures the table will always be inserted within the list
        // item.
        if (selectedNode.nodeName.toLowerCase() === WYMeditor.LI) {
            jQuery(selectedNode).append(table);
        } else {
            jQuery(selectedNode).after(table);
        }

    } else {
        // If the table is not allowed to be inserted inline with the
        // container, insert it after the container.
        jQuery(container).after(table);
    }

    // Handle any browser-specific cleanup
    this.afterInsertTable(table);
    this.fixBodyHtml();

    return table;
};

/**
    editor.afterInsertTable
    =======================

    Handle cleanup/normalization after inserting a table. Different browsers
    need slightly different tweaks.
*/
WYMeditor.editor.prototype.afterInsertTable = function () {
};

WYMeditor.editor.prototype.listen = function () {
    var wym = this;

    // Don't use jQuery.find() on the iframe body
    // because of MSIE + jQuery + expando issue (#JQ1143)

    jQuery(wym._doc.body).bind("mousedown", function (e) {
        wym.mousedown(e);
    });

    jQuery(wym._doc).bind('paste', function () {
        wym.handlePasteEvent();
    });
};

WYMeditor.editor.prototype.handlePasteEvent = function () {
    var wym = this;

    // The paste event happens *before* the paste actually occurs.
    // Use a timer to delay execution until after whatever is being pasted has
    // actually been added.
    window.setTimeout(
        function () {
            jQuery(wym._element).trigger(
                WYMeditor.EVENTS.postBlockMaybeCreated,
                wym
            );
        },
        20
    );
};

WYMeditor.editor.prototype.mousedown = function (evt) {
    // Store the selected image if we clicked an <img> tag
    this._selectedImage = null;
    if (evt.target.tagName.toLowerCase() === WYMeditor.IMG) {
        this._selectedImage = evt.target;
    }
};

/**
    WYMeditor.editor.initSkin
    =========================

    Apply the appropriate CSS class to "activate" that skin's CSS and call the
    skin's javascript `init` method.
*/
WYMeditor.editor.prototype.initSkin = function () {
    // Put the classname (ex. wym_skin_default) on wym_box
    jQuery(this._box).addClass("wym_skin_" + this._options.skin);

    // Init the skin, if needed
    if (typeof WYMeditor.SKINS[this._options.skin] !== "undefined") {
        if (typeof WYMeditor.SKINS[this._options.skin].init === "function") {
            WYMeditor.SKINS[this._options.skin].init(this);
        }
    } else {
        WYMeditor.console.warn(
            "Chosen skin _" + this.options.skin + "_ not found."
        );
    }
};

/* jshint evil: true, camelcase: false, maxlen: 100 */
/* global -$, rangy */
"use strict";

/**
    WYMeditor.editor.init
    =====================

    Initialize a wymeditor instance, including detecting the
    current browser and enabling the browser-specific subclass.
*/
WYMeditor.editor.prototype.init = function () {
    // Load the browser-specific subclass
    // If this browser isn't supported, do nothing
    var WymClass = false,
        SaxListener,
        prop,
        h,
        iframeHtml,
        boxHtml,
        aTools,
        sTools,
        oTool,
        sTool,
        i,
        aClasses,
        sClasses,
        oClass,
        sClass,
        aContainers,
        sContainers,
        sContainer,
        oContainer,
        wym;

    if (jQuery.browser.msie) {
        WymClass = new WYMeditor.WymClassTrident(this);
    } else if (jQuery.browser.mozilla) {
        WymClass = new WYMeditor.WymClassGecko(this);
    } else if (jQuery.browser.safari || jQuery.browser.webkit ||
               jQuery.browser.chrome) {
        if (jQuery.browser.version === '537.36') {
            // This seems to indicate Blink. See:
            // https://stackoverflow.com/questions/20655470
            //WymClass = new WYMeditor.WymClassBlink(this);
            // For now we use the WebKit editor class in Blink.
            WymClass = new WYMeditor.WymClassWebKit(this);
        } else {
            WymClass = new WYMeditor.WymClassWebKit(this);
        }
    }

    if (WymClass === false) {
        return;
    }

    if (jQuery.isFunction(this._options.preInit)) {
        this._options.preInit(this);
    }

    this.parser = null;
    this.helper = null;

    SaxListener = new WYMeditor.XhtmlSaxListener();
    this.parser = new WYMeditor.XhtmlParser(SaxListener);

    this.helper = new WYMeditor.XmlHelper();

    // Extend the editor object with the browser-specific version.
    // We're not using jQuery.extend because we *want* to copy properties via
    // the prototype chain
    for (prop in WymClass) {
        /*jshint forin: false*/
        // Explicitly not using hasOwnProperty for the inheritance here
        // because we want to go up the prototype chain to get all of the
        // browser-specific editor methods. This is kind of a code smell,
        // but works just fine.
        this[prop] = WymClass[prop];
    }

    wym = this;

    // Load wymbox
    wym._box = jQuery(wym._element).hide().after(
        wym._options.boxHtml
    ).next().addClass(
        'wym_box_' + wym._index
    );

    // Store the instance index and replaced element in wymbox
    // but keep it compatible with jQuery < 1.2.3, see #122
    if (jQuery.isFunction(jQuery.fn.data)) {
        jQuery.data(wym._box.get(0), WYMeditor.WYM_INDEX, wym._index);
        jQuery.data(wym._element.get(0), WYMeditor.WYM_INDEX, wym._index);
    }

    h = WYMeditor.Helper;

    // Construct the iframe
    iframeHtml = wym._options.iframeHtml;
    iframeHtml = h.replaceAll(iframeHtml, WYMeditor.INDEX, wym._index);
    iframeHtml = h.replaceAll(
        iframeHtml,
        WYMeditor.IFRAME_BASE_PATH,
        wym._options.iframeBasePath
    );

    // Construct wymbox
    boxHtml = jQuery(wym._box).html();

    boxHtml = h.replaceAll(boxHtml, WYMeditor.LOGO, wym._options.logoHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS, wym._options.toolsHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS, wym._options.containersHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES, wym._options.classesHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.HTML, wym._options.htmlHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.IFRAME, iframeHtml);
    boxHtml = h.replaceAll(boxHtml, WYMeditor.STATUS, wym._options.statusHtml);

    // Construct the tools list
    aTools = eval(wym._options.toolsItems);
    sTools = "";

    for (i = 0; i < aTools.length; i += 1) {
        oTool = aTools[i];
        sTool = '';
        if (oTool.name && oTool.title) {
            sTool = wym._options.toolsItemHtml;
        }
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_NAME, oTool.name);
        sTool = h.replaceAll(
            sTool,
            WYMeditor.TOOL_TITLE,
            wym._options.stringDelimiterLeft + oTool.title + wym._options.stringDelimiterRight
        );
        sTool = h.replaceAll(sTool, WYMeditor.TOOL_CLASS, oTool.css);
        sTools += sTool;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS_ITEMS, sTools);

    // Construct the classes list
    aClasses = eval(wym._options.classesItems);
    sClasses = "";

    for (i = 0; i < aClasses.length; i += 1) {
        oClass = aClasses[i];
        sClass = '';
        if (oClass.name && oClass.title) {
            sClass = wym._options.classesItemHtml;
        }
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_NAME, oClass.name);
        sClass = h.replaceAll(sClass, WYMeditor.CLASS_TITLE, oClass.title);
        sClasses += sClass;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES_ITEMS, sClasses);

    // Construct the containers list
    aContainers = eval(wym._options.containersItems);
    sContainers = "";

    for (i = 0; i < aContainers.length; i += 1) {
        oContainer = aContainers[i];
        sContainer = '';
        if (oContainer.name && oContainer.title) {
            sContainer = wym._options.containersItemHtml;
        }
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_NAME,
            oContainer.name
        );
        sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_TITLE,
            wym._options.stringDelimiterLeft +
            oContainer.title +
            wym._options.stringDelimiterRight);
        sContainer = h.replaceAll(
            sContainer,
            WYMeditor.CONTAINER_CLASS,
            oContainer.css
        );
        sContainers += sContainer;
    }

    boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS_ITEMS, sContainers);

    // I10n
    boxHtml = wym.replaceStrings(boxHtml);

    // Load the html in wymbox
    jQuery(wym._box).html(boxHtml);

    // Hide the html value
    jQuery(wym._box).find(wym._options.htmlSelector).hide();

    wym.documentStructureManager = new WYMeditor.DocumentStructureManager(
        wym,
        wym._options.structureRules.defaultRootContainer
    );

    // Some browsers like to trigger an iframe's load event multiple times
    // depending on all sorts of small, annoying details. Instead of attempting
    // to work-around old ones and predict new ones, let's just ensure the
    // initialization only happens once. All methods of detecting load are
    // unreliable.
    wym.iframeInitialized = false;

    jQuery(wym._box).find('iframe').load(function () {
        if (wym.iframeInitialized === true) {
            return;
        }
        wym.initIframe(this);
    });

    wym.initSkin();
};

/**
    WYMeditor.editor.postIframeInit

    Part of the editor's initialization, which must be done after the
    iframe's initialization.
*/
WYMeditor.editor.prototype.postIframeInit = function () {
    var wym = this;

    if (jQuery.isFunction(wym._options.postInit)) {
        wym._options.postInit(wym);
    }

    // Add event listeners to doc elements, e.g. images
    wym.listen();

    jQuery(wym._element).trigger(
        WYMeditor.EVENTS.postIframeInitialization,
        wym._wym
    );
};

/**
    WYMeditor.editor.bindEvents
    ===========================

    Bind all event handlers including tool/container clicks, focus events
    and change events.
*/
WYMeditor.editor.prototype.bindEvents = function () {
    var wym = this,
        $html_val;

    // Handle click events on tools buttons
    jQuery(this._box).find(this._options.toolSelector).click(function () {
        wym._iframe.contentWindow.focus(); //See #154
        wym.exec(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle click events on containers buttons
    jQuery(this._box).find(this._options.containerSelector).click(function () {
        wym.mainContainer(jQuery(this).attr(WYMeditor.NAME));
        return false;
    });

    // Handle keyup event on html value: set the editor value
    // Handle focus/blur events to check if the element has focus, see #147
    $html_val = jQuery(this._box).find(this._options.htmlValSelector);
    $html_val.keyup(function () {
        jQuery(wym._doc.body).html(jQuery(this).val());
    });
    $html_val.focus(function () {
        jQuery(this).toggleClass('hasfocus');
    });
    $html_val.blur(function () {
        jQuery(this).toggleClass('hasfocus');
    });

    // Handle click events on classes buttons
    jQuery(this._box).find(this._options.classSelector).click(function () {
        var aClasses = eval(wym._options.classesItems),
            sName = jQuery(this).attr(WYMeditor.NAME),

            oClass = WYMeditor.Helper.findByName(aClasses, sName),
            jqexpr;

        if (oClass) {
            jqexpr = oClass.expr;
            wym.toggleClass(sName, jqexpr);
        }
        wym._iframe.contentWindow.focus(); //See #154
        return false;
    });

    // Handle update event on update element
    jQuery(this._options.updateSelector).bind(this._options.updateEvent, function () {
        wym.update();
    });
};

WYMeditor.editor.prototype.ready = function () {
    return this._doc !== null;
};

/**
    WYMeditor.editor.box
    ====================

    Get the wymbox container.
*/
WYMeditor.editor.prototype.box = function () {
    return this._box;
};

/**
    WYMeditor.editor._html
    ======================

    Get or set the wymbox html value. If you want to get the wymbox html, you
    should use WYMeditor.editor.xhtml() instead of this so that the html is
    parsed and receives cross-browser cleanup. Only use this if you have a
    specific reason not to use WYMeditor.editor.xhtml().
*/
WYMeditor.editor.prototype._html = function (html) {
    if (typeof html === 'string') {
        jQuery(this._doc.body).html(html);
        this.update();
    } else {
        return jQuery(this._doc.body).html();
    }
};

/**
    WYMeditor.editor.html
    =====================

    Deprecated. Use WYMeditor.editor.xhtml or WYMeditor.editor._html instead.
    Calling this function will give a console warning.
*/
WYMeditor.editor.prototype.html = function (html) {
    WYMeditor.console.warn("The function WYMeditor.editor.html() is deprecated. " +
                           "Use either WYMeditor.editor.xhtml() or " +
                           "WYMeditor.editor._html() instead.");
    if (typeof html === 'string') {
        this._html(html);
    } else {
        return this._html();
    }
};

/**
    WYMeditor.editor.xhtml
    ======================

    Take the current editor's DOM and apply strict xhtml nesting rules to
    enforce a valid, well-formed, semantic xhtml result.
*/
WYMeditor.editor.prototype.xhtml = function () {
    return this.parser.parse(this._html());
};

/**
    WYMeditor.editor.exec
    =====================

    Execute a button command on the currently-selected container. The command
    can be anything from "indent this element" to "open a dialog to create a
    table."

    `cmd` is a string corresponding to the command that should be run, roughly
    matching the designMode execCommand strategy (and falling through to
    execCommand in some cases).
*/
WYMeditor.editor.prototype.exec = function (cmd) {
    var container, custom_run, _this = this;
    switch (cmd) {

    case WYMeditor.CREATE_LINK:
        container = this.mainContainer();
        if (container || this._selectedImage) {
            this.dialog(WYMeditor.DIALOG_LINK);
        }
        break;

    case WYMeditor.INSERT_IMAGE:
        this.dialog(WYMeditor.DIALOG_IMAGE);
        break;

    case WYMeditor.INSERT_TABLE:
        this.dialog(WYMeditor.DIALOG_TABLE);
        break;

    case WYMeditor.PASTE:
        this.dialog(WYMeditor.DIALOG_PASTE);
        break;

    case WYMeditor.TOGGLE_HTML:
        this.update();
        this.toggleHtml();
        break;

    case WYMeditor.PREVIEW:
        this.dialog(WYMeditor.PREVIEW, this._options.dialogFeaturesPreview);
        break;

    case WYMeditor.INSERT_ORDEREDLIST:
        this.insertOrderedlist();
        break;

    case WYMeditor.INSERT_UNORDEREDLIST:
        this.insertUnorderedlist();
        break;

    case WYMeditor.INDENT:
        this.indent();
        break;

    case WYMeditor.OUTDENT:
        this.outdent();
        break;


    default:
        custom_run = false;
        jQuery.each(this._options.customCommands, function () {
            if (cmd === this.name) {
                custom_run = true;
                this.run.apply(_this);
                return false;
            }
        });
        if (!custom_run) {
            this._exec(cmd);
        }
        break;
    }
};

/**
    WYMeditor.editor.selection
    ==========================

    Override the default selection function to use rangy.
*/
WYMeditor.editor.prototype.selection = function () {
    if (window.rangy && !rangy.initialized) {
        rangy.init();
    }

    var iframe = this._iframe,
        sel = rangy.getIframeSelection(iframe);

    return sel;
};

/**
    WYMeditor.editor.nodeAfterSel
    =============================

    Returns the node that is immediately after the selection.
*/
WYMeditor.editor.prototype.nodeAfterSel = function () {
    var sel = this.selection(),
        noNodeErrorStr = "There is no node immediately after the selection.";

    // Different browsers describe selection differently. Here be dragons.
    if (
        sel.anchorNode.tagName &&
        jQuery.inArray(
            sel.anchorNode.tagName.toLowerCase(),
            WYMeditor.NON_CONTAINING_ELEMENTS
        ) === -1
    ) {
        if (sel.anchorNode.childNodes.length === 0) {
            throw noNodeErrorStr;
        }
        return sel.anchorNode.childNodes[sel.anchorOffset];
    }

    if (
        sel.focusNode.nodeType === WYMeditor.NODE.TEXT &&
        sel.focusNode.data.length === sel.focusOffset
    ) {
        if (!sel.focusNode.nextSibling) {
            throw noNodeErrorStr;
        }
        return sel.focusNode.nextSibling;
    }

    return sel.focusNode;
};

/**
    WYMeditor.editor.selectedContainer
    =============================

    Returns the selection's container.

    Not to be confused with `.mainContainer`, which sets and gets the
    selection's main container.
*/
WYMeditor.editor.prototype.selectedContainer = function () {
    var focusNode = this.selection().focusNode;

        if (
            focusNode.nodeType === WYMeditor.NODE.TEXT || (

                focusNode.tagName &&

                jQuery.inArray(
                    focusNode.tagName.toLowerCase(),
                    WYMeditor.NON_CONTAINING_ELEMENTS
                ) > -1
            )
        ) {
            return focusNode.parentNode;
        } else {
            return focusNode;
        }

};

/**
    WYMeditor.editor.selection_collapsed
    ====================================

    Return true if all selections are collapsed, false otherwise.
*/
WYMeditor.editor.prototype.selection_collapsed = function () {
    var sel = this.selection(),
        collapsed = false;

    jQuery.each(sel.getAllRanges(), function () {
        if (this.collapsed) {
            collapsed = true;
            //break
            return false;
        }
    });

    return collapsed;
};

/**
    WYMeditor.editor.selected_contains
    ==================================

    Return an array of nodes that match a jQuery selector
    within the current selection.
*/
WYMeditor.editor.prototype.selected_contains = function (selector) {
    var sel = this.selection(),
        matches = [];

    jQuery.each(sel.getAllRanges(), function () {
        jQuery.each(this.getNodes(), function () {
            if (jQuery(this).is(selector)) {
                matches.push(this);
            }
        });
    });

    return matches;
};

/**
    WYMeditor.editor.selected_parents_contains
    ==========================================

    Return an array of nodes that match the selector within
    the selection's parents.
*/
WYMeditor.editor.prototype.selected_parents_contains = function (selector) {
    var $matches = jQuery([]),
        $selected = jQuery(this.selectedContainer());
    if ($selected.is(selector)) {
        $matches = $matches.add($selected);
    }
    $matches = $matches.add($selected.parents(selector));
    return $matches;
};

/**
    WYMeditor.editor.isBlockNode
    =============================

    Returns true if the provided node is a block type node. Otherwise
    returns false.

    @param node The node to check.
*/

WYMeditor.editor.prototype.isBlockNode = function (node) {
    if (
        node.tagName &&
        jQuery.inArray(
            node.tagName.toLowerCase(),
            WYMeditor.BLOCKS
        ) > -1
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.editor.isInlineNode
    =============================

    Returns true if the provided node is an in-line type node. Otherwise
    returns false.

    @param node The node to check.
*/

WYMeditor.editor.prototype.isInlineNode = function (node) {
    if (
        node.nodeType === WYMeditor.NODE.TEXT ||
        jQuery.inArray(
            node.tagName.toLowerCase(),
            WYMeditor.INLINE_ELEMENTS
        ) > -1
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.editor.isListNode
    =============================

    Returns true if the provided node is a list element. Otherwise
    returns false.

    @param node The node to check.
*/

WYMeditor.editor.prototype.isListNode= function (node) {
    if (
        node.tagName &&
        jQuery.inArray(
            node.tagName.toLowerCase(),
            WYMeditor.LIST_TYPE_ELEMENTS
        ) > -1
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.editor.mainContainer
    ==============================

    Get or set the selected main container.
*/
WYMeditor.editor.prototype.mainContainer = function (sType) {
    if (typeof (sType) === 'undefined') {
        return this.selectedContainer();
    }

    var container = null,
        aTypes,
        newNode,
        blockquote,
        nodes,
        lgt,
        firstNode,
        x;

    if (sType.toLowerCase() === WYMeditor.TH) {
        container = this.mainContainer();

        // Find the TD or TH container
        switch (container.tagName.toLowerCase()) {

        case WYMeditor.TD:
        case WYMeditor.TH:
            break;
        default:
            aTypes = [WYMeditor.TD, WYMeditor.TH];
            container = this.findUp(this.mainContainer(), aTypes);
            break;
        }

        // If it exists, switch
        if (container !== null) {
            sType = WYMeditor.TD;
            if (container.tagName.toLowerCase() === WYMeditor.TD) {
                sType = WYMeditor.TH;
            }
            this.switchTo(container, sType, false);
            this.update();
        }
    } else {
        // Set the container type
        aTypes = [
            WYMeditor.P,
            WYMeditor.DIV,
            WYMeditor.H1,
            WYMeditor.H2,
            WYMeditor.H3,
            WYMeditor.H4,
            WYMeditor.H5,
            WYMeditor.H6,
            WYMeditor.PRE,
            WYMeditor.BLOCKQUOTE
        ];
        container = this.findUp(this.mainContainer(), aTypes);

        if (container) {
            if (sType.toLowerCase() === WYMeditor.BLOCKQUOTE) {
                // Blockquotes must contain a block level element
                blockquote = this.findUp(
                    this.mainContainer(),
                    WYMeditor.BLOCKQUOTE
                );
                if (blockquote === null) {
                    newNode = this._doc.createElement(sType);
                    container.parentNode.insertBefore(newNode, container);
                    newNode.appendChild(container);
                    this.setCaretIn(newNode.firstChild);
                } else {
                    nodes = blockquote.childNodes;
                    lgt = nodes.length;

                    if (lgt > 0) {
                        firstNode = nodes.item(0);
                    }
                    for (x = 0; x < lgt; x += 1) {
                        blockquote.parentNode.insertBefore(
                            nodes.item(0),
                            blockquote
                        );
                    }
                    blockquote.parentNode.removeChild(blockquote);
                    if (firstNode) {
                        this.setCaretIn(firstNode);
                    }
                }
            } else {
                // Not a blockquote
                this.switchTo(container, sType);
            }

            this.update();
        }
    }

    return false;
};

/**
    WYMeditor.editor.isForbiddenMainContainer
    =========================================

    Determines whether a container with the passed tagName is allowed to be a
    main container (i.e. if it is allowed to be a container in the root of the
    document). Returns true if a container with the passed tagName is *not* an
    allowable main container, and returns false if otherwise.

    @param tagName A string of the tag name to be determined if it can be a
                   main container or not
*/
WYMeditor.editor.prototype.isForbiddenMainContainer = function (tagName) {
    return jQuery.inArray(tagName.toLowerCase(),
                          WYMeditor.FORBIDDEN_MAIN_CONTAINERS) > -1;
};

/**
    WYMeditor.editor.keyCanCreateBlockElement
    =========================================

    Determines whether the key represented by the passed keyCode can create a
    block element within the editor when inputted. Returns true if the key can
    create a block element when inputted, and returns false if otherwise.

    @param keyCode A numberic key code representing a key
*/
WYMeditor.editor.prototype.keyCanCreateBlockElement = function (keyCode) {
    return jQuery.inArray(keyCode,
                    WYMeditor.POTENTIAL_BLOCK_ELEMENT_CREATION_KEYS) > -1;
};

/**
    WYMeditor.editor.toggleClass
    ============================

    Toggle a class on the selected element or one of its parents
*/
WYMeditor.editor.prototype.toggleClass = function (sClass, jqexpr) {
    var container = null;
    if (this._selectedImage) {
        container = this._selectedImage;
    } else {
        container = jQuery(this.selectedContainer());
    }
    container = jQuery(container).parentsOrSelf(jqexpr);
    jQuery(container).toggleClass(sClass);

    if (!jQuery(container).attr(WYMeditor.CLASS)) {
        jQuery(container).removeAttr(this._class);
    }
};

/**
    WYMeditor.editor.findUp
    =======================

    Return the first parent or self container, based on its type

    `filter` is a string or an array of strings on which to filter the container
*/
WYMeditor.editor.prototype.findUp = function (node, filter) {
    if (typeof (node) === 'undefined' || node === null) {
        return null;
    }

    if (node.nodeName === "#text") {
        // For text nodes, we need to look from the nodes container object
        node = node.parentNode;
    }
    var tagname = node.tagName.toLowerCase(),
        bFound,
        i;
    if (typeof (filter) === WYMeditor.STRING) {
        while (tagname !== filter && tagname !== WYMeditor.BODY) {
            node = node.parentNode;
            tagname = node.tagName.toLowerCase();
        }
    } else {
        bFound = false;
        while (!bFound && tagname !== WYMeditor.BODY) {
            for (i = 0; i < filter.length; i += 1) {
                if (tagname === filter[i]) {
                    bFound = true;
                    break;
                }
            }
            if (!bFound) {
                node = node.parentNode;
                if (node === null) {
                    // No parentNode, so we're not going to find anything
                    // up the ancestry chain that matches
                    return null;
                }
                tagname = node.tagName.toLowerCase();
            }
        }
    }

    if (tagname === WYMeditor.BODY) {
        return null;
    }

    return node;
};

/**
    WYMeditor.editor.switchTo
    =========================

    Switch the type of the given `node` to type `sType`. If stripAttrs is true,
    the attributes of node will not be included in the the new type. If
    stripAttrs is false (or undefined), the attributes of node will be
    preserved through the switch.
*/
WYMeditor.editor.prototype.switchTo = function (node, sType, stripAttrs) {
    var newNode = this._doc.createElement(sType),
        html = jQuery(node).html(),
        attrs = node.attributes,
        i;

    if (node.tagName.toLowerCase() === 'img') {
        throw "Will not change the tag of this element.";
    }

    if (!stripAttrs) {
        for (i = 0; i < attrs.length; ++i) {
            newNode.setAttribute(attrs.item(i).nodeName,
                                 attrs.item(i).nodeValue);
        }
    }
    newNode.innerHTML = html;
    node.parentNode.replaceChild(newNode, node);

    this.setCaretIn(newNode);
};

WYMeditor.editor.prototype.replaceStrings = function (sVal) {
    var key;
    // Check if the language file has already been loaded
    // if not, get it via a synchronous ajax call
    if (!WYMeditor.STRINGS[this._options.lang]) {
        WYMeditor.console.error(
            "WYMeditor: language '" + this._options.lang + "' not found."
        );
        WYMeditor.console.error(
            "Unable to perform i10n."
        );
        return sVal;
    }

    // Replace all the strings in sVal and return it
    for (key in WYMeditor.STRINGS[this._options.lang]) {
        if (WYMeditor.STRINGS[this._options.lang].hasOwnProperty(key)) {
            sVal = WYMeditor.Helper.replaceAll(
                sVal,
                this._options.stringDelimiterLeft + key + this._options.stringDelimiterRight,
                WYMeditor.STRINGS[this._options.lang][key]
            );
        }
    }
    return sVal;
};

WYMeditor.editor.prototype.encloseString = function (sVal) {
    return this._options.stringDelimiterLeft +
        sVal +
        this._options.stringDelimiterRight;
};

/**
    editor.status
    =============

    Print the given string as a status message.
*/
WYMeditor.editor.prototype.status = function (sMessage) {
    // Print status message
    jQuery(this._box).find(this._options.statusSelector).html(sMessage);
};

/**
    editor.update
    =============

    Update the element and textarea values.
*/
WYMeditor.editor.prototype.update = function () {
    var html;

    html = this.xhtml();
    jQuery(this._element).val(html);
    jQuery(this._box).find(this._options.htmlValSelector).not('.hasfocus').val(html); //#147
    this.fixBodyHtml();
};

/**
    editor.fixBodyHtml
    ==================

    Adjust the editor body html to account for editing changes where
    perfect HTML is not optimal. For instance, <br> elements are useful between
    certain block elements.
*/
WYMeditor.editor.prototype.fixBodyHtml = function () {
    var wym = this;

    wym.spaceBlockingElements();
    wym.fixDoubleBr();

    jQuery(wym._element).trigger(WYMeditor.EVENTS.postBlockMaybeCreated, wym);
};

/**
    editor.spaceBlockingElements
    ============================

    Insert <br> elements between adjacent blocking elements and
    p elements, between block elements or blocking elements and the
    start/end of the document.
*/
WYMeditor.editor.prototype.spaceBlockingElements = function () {
    var blockingSelector =
            WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION.join(', '),
        $body = jQuery(this._doc).find('body.wym_iframe'),
        children = $body.children(),

        placeholderNode,
        $firstChild,
        $lastChild,
        blockSepSelector,
        blockInListSepSelector,
        $blockInList;

    if (jQuery.browser.mozilla) {
        placeholderNode = '<br ' +
                            'class="' +
                            WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                            WYMeditor.EDITOR_ONLY_CLASS + '" ' +
                            '_moz_editor_bogus_node="TRUE" ' +
                            '_moz_dirty=""' +
                          '/>';
    } else {
        placeholderNode = '<br ' +
                            'class="' +
                            WYMeditor.BLOCKING_ELEMENT_SPACER_CLASS + ' ' +
                            WYMeditor.EDITOR_ONLY_CLASS + '"' +
                          '/>';
    }

    // Make sure that we still have a placeholder node at both the begining and
    // end
    if (children.length > 0) {
        $firstChild = jQuery(children[0]);
        $lastChild = jQuery(children[children.length - 1]);

        if ($firstChild.is(blockingSelector)) {
            $firstChild.before(placeholderNode);
        }

        if ($lastChild.is(blockingSelector) &&
            !(jQuery.browser.msie && jQuery.browser.version < "7.0")) {

            $lastChild.after(placeholderNode);
        }
    }

    blockSepSelector = this._getBlockSepSelector();

    // Put placeholder nodes between consecutive blocking elements and between
    // blocking elements and normal block-level elements
    $body.find(blockSepSelector).before(placeholderNode);

    blockInListSepSelector = this._getBlockInListSepSelector();
    $blockInList = $body.find(blockInListSepSelector);

    // The $blockInList selection must be iterated over to only add placeholder
    // nodes after blocking elements at the end of a list item rather than all
    // blocking elements in a list. No jQuery selection that is supported on
    // all browsers can do this check, so that is why it must be done by using
    // `each` to iterate over the selection. Note that the handling of the
    // spacing of other blocking elements in a list besides after the last
    // blocking element in a list item is already handled by the
    // blockSepSelector used before this.
    $blockInList.each(function () {
        var $block = jQuery(this);

        if (!$block.next(blockingSelector).length &&
           !$block.next('br').length) {

            $block.after(placeholderNode);
        }
    });
};

/**
    editor._getBlockSepSelector
    ===========================

    Build a string representing a jquery selector that will find all
    elements which need a spacer <br> before them. This includes all consecutive
    blocking elements and between blocking elements and normal non-blocking
    elements.
*/
WYMeditor.editor.prototype._getBlockSepSelector = function () {
    if (typeof (this._blockSpacersSel) !== 'undefined') {
        return this._blockSpacersSel;
    }

    var wym = this,
        blockCombo = [],
        containersBlockingNav =
            WYMeditor.DocumentStructureManager.CONTAINERS_BLOCKING_NAVIGATION,
        containersNotBlockingNav;

    // Generate the list of non-blocking elements by removing the blocking
    // elements from the list of validRootContainers
    containersNotBlockingNav = jQuery.grep(
        wym.documentStructureManager.structureRules.validRootContainers,
        function (item) {
            return jQuery.inArray(item, containersBlockingNav) === -1;
        }
    );

    // Consecutive blocking elements need separators
    jQuery.each(
        containersBlockingNav,
        function (indexO, elementO) {
            jQuery.each(
                containersBlockingNav,
                function (indexI, elementI) {
                    blockCombo.push(elementO + ' + ' + elementI);
                }
            );
        }
    );

    // A blocking element either followed by or preceeded by a not blocking
    // element needs separators
    jQuery.each(
        containersBlockingNav,
        function (indexO, elementO) {
            jQuery.each(
                containersNotBlockingNav,
                function (indexI, elementI) {
                    blockCombo.push(elementO + ' + ' + elementI);
                    blockCombo.push(elementI + ' + ' + elementO);
                }
            );
        }
    );
    this._blockSpacersSel = blockCombo.join(', ');
    return this._blockSpacersSel;
};

/*
    editor._getBlockInListSepSelector
    =================================

    Returns a selector for getting all of the block elements in lists
    or sublists. The block elements at the end of lists or sublists should have
    a spacer line break after them in the editor at all times.
*/
WYMeditor.editor.prototype._getBlockInListSepSelector = function () {
    if (typeof (this._blockInListSpacersSel) !== 'undefined') {
        return this._blockInListSpacersSel;
    }

    var blockCombo = [];

    jQuery.each(WYMeditor.LIST_TYPE_ELEMENTS, function (indexO, elementO) {
        jQuery.each(WYMeditor.BLOCKING_ELEMENTS, function (indexI, elementI) {
            blockCombo.push(elementO + ' ' + elementI);
        });
    });

    this._blockInListSpacersSel = blockCombo.join(', ');
    return this._blockInListSpacersSel;
};

/**
    editor.fixDoubleBr
    ==================

    Remove the <br><br> elements that are inserted between
    paragraphs, usually after hitting enter from an existing paragraph.
*/
WYMeditor.editor.prototype.fixDoubleBr = function () {
    var $body = jQuery(this._doc).find('body.wym_iframe'),
        $last_br;

    // Strip consecutive brs unless they're in a pre tag
    $body.children('br + br').filter(':not(pre br)').remove();

    // Also remove any brs between two p's
    $body.find('p + br').next('p').prev('br').remove();

    // Remove brs floating at the end after a p
    $last_br = $body.find('p + br').slice(-1);
    if ($last_br.length > 0) {
        if ($last_br.next().length === 0) {
            $last_br.remove();
        }
    }
};

/**
    editor.dialog
    =============

    Open a dialog box
*/
WYMeditor.editor.prototype.dialog = function (dialogType, dialogFeatures, bodyHtml) {
    var features = dialogFeatures || this._wym._options.dialogFeatures,
        wDialog = window.open('', 'dialog', features),
        sBodyHtml,
        h = WYMeditor.Helper,
        dialogHtml,
        doc;

    if (wDialog) {
        sBodyHtml = "";

        switch (dialogType) {

        case (WYMeditor.DIALOG_LINK):
            sBodyHtml = this._options.dialogLinkHtml;
            break;
        case (WYMeditor.DIALOG_IMAGE):
            sBodyHtml = this._options.dialogImageHtml;
            break;
        case (WYMeditor.DIALOG_TABLE):
            sBodyHtml = this._options.dialogTableHtml;
            break;
        case (WYMeditor.DIALOG_PASTE):
            sBodyHtml = this._options.dialogPasteHtml;
            break;
        case (WYMeditor.PREVIEW):
            sBodyHtml = this._options.dialogPreviewHtml;
            break;
        default:
            sBodyHtml = bodyHtml;
            break;
        }

        // Construct the dialog
        dialogHtml = this._options.dialogHtml;
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.BASE_PATH,
            this._options.basePath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIRECTION,
            this._options.direction
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.WYM_PATH,
            this._options.wymPath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.JQUERY_PATH,
            this._options.jQueryPath
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIALOG_TITLE,
            this.encloseString(dialogType)
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.DIALOG_BODY,
            sBodyHtml
        );
        dialogHtml = h.replaceAll(
            dialogHtml,
            WYMeditor.INDEX,
            this._index
        );

        dialogHtml = this.replaceStrings(dialogHtml);

        doc = wDialog.document;
        doc.write(dialogHtml);
        doc.close();
    }
};

/**
    editor.toggleHtml
    =================

    Show/Hide the HTML textarea.
*/
WYMeditor.editor.prototype.toggleHtml = function () {
    jQuery(this._box).find(this._options.htmlSelector).toggle();
};

WYMeditor.editor.prototype.uniqueStamp = function () {
    var now = new Date();
    return "wym-" + now.getTime();
};

/**
    Paste the given array of paragraph-items at the given range inside the given $container.

    It has already been determined that the paragraph has multiple lines and
    that the container we're pasting to is a block container capable of accepting
    further nested blocks.
*/
WYMeditor.editor.prototype._handleMultilineBlockContainerPaste = function (
    wym, $container, range, paragraphStrings
) {

    var i,
        $insertAfter,
        html,
        blockSplitter,
        leftSide,
        rightSide,
        rangeNodeComparison,
        $splitRightParagraph,
        firstParagraphString,
        firstParagraphHtml,
        blockParent,
        blockParentType;


    // Now append all subsequent paragraphs
    $insertAfter = jQuery(blockParent);

    // Just need to split the current container and put new block elements
    // in between
    blockSplitter = 'p';
    if ($container.is('li')) {
        // Instead of creating paragraphs on line breaks, we'll need to create li's
        blockSplitter = 'li';
    }
    // Split the selected element then build and insert the appropriate html
    // This accounts for cases where the start selection is at the
    // start of a node or in the middle of a text node by splitting the
    // text nodes using rangy's splitBoundaries()
    range.splitBoundaries(); // Split any partially-select text nodes
    blockParent = wym.findUp(
        range.startContainer,
        ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li']
    );
    blockParentType = blockParent.tagName;
    leftSide = [];
    rightSide = [];
    jQuery(blockParent).contents().each(function (index, element) {
        // Capture all of the dom nodes to the left and right of our
        // range. We can't remove them in the same step because that
        // loses the selection in webkit

        rangeNodeComparison = range.compareNode(element);
        if (rangeNodeComparison === range.NODE_BEFORE ||
                (rangeNodeComparison === range.NODE_BEFORE_AND_AFTER &&
                 range.startOffset === range.startContainer.length)) {
            // Because of the way splitBoundaries() works, the
            // collapsed selection might appear in the right-most index
            // of the border node, which means it will show up as
            //
            // eg. | is the selection and <> are text node boundaries
            // <foo|><bar>
            //
            // We detect that case by counting any
            // NODE_BEFORE_AND_AFTER result where the offset is at the
            // very end of the node as a member of the left side
            leftSide.push(element);
        } else {
            rightSide.push(element);
        }
    });
    // Now remove all of the left and right nodes
    for (i = 0; i < leftSide.length; i++) {
        jQuery(leftSide[i]).remove();
    }
    for (i = 0; i < rightSide.length; i++) {
        jQuery(rightSide[i]).remove();
    }

    // Rebuild our split nodes and add the inserted content
    if (leftSide.length > 0) {
        // We have left-of-selection content
        // Put the content back inside our blockParent
        jQuery(blockParent).prepend(leftSide);
    }
    if (rightSide.length > 0) {
        // We have right-of-selection content.
        // Split it off in to a node of the same type after our
        // blockParent
        $splitRightParagraph = jQuery('<' + blockParentType + '>' +
            '</' + blockParentType + '>', wym._doc);
        $splitRightParagraph.insertAfter(jQuery(blockParent));
        $splitRightParagraph.append(rightSide);
    }

    // Insert the first paragraph in to the current node, and then
    // start appending subsequent paragraphs
    firstParagraphString = paragraphStrings.splice(
        0,
        1
    )[0];
    firstParagraphHtml = firstParagraphString.split(WYMeditor.NEWLINE).join('<br />');
    jQuery(blockParent).html(jQuery(blockParent).html() + firstParagraphHtml);

    // Now append all subsequent paragraphs
    $insertAfter = jQuery(blockParent);
    for (i = 0; i < paragraphStrings.length; i++) {
        html = '<' + blockSplitter + '>' +
            (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
            '</' + blockSplitter + '>';
        $insertAfter = jQuery(html, wym._doc).insertAfter($insertAfter);
    }
};

/**
    editor.paste
    ============

    Paste text into the editor below the carret, used for "Paste from Word".

    Takes the string to insert as an argument. Two or more newlines separates
    paragraphs. May contain inline HTML.
*/
WYMeditor.editor.prototype.paste = function (str) {
    var container = this.selectedContainer(),
        paragraphStrings,
        j,
        textNodesToInsert,
        blockSplitter,
        $container,
        html = '',
        paragraphs,
        i,
        isSingleLine = false,
        sel,
        textNode,
        wym,
        range,
        insertionNodes;
    wym = this;
    sel = rangy.getIframeSelection(wym._iframe);
    range = sel.getRangeAt(0);
    $container = jQuery(container);

    // Start by collapsing the range to the start of the selection. We're
    // punting on implementing a paste that also replaces existing content for
    // now,
    range.collapse(true); // Collapse to the the begining of the selection

    // Split string into paragraphs by two or more newlines
    paragraphStrings = str.split(new RegExp(WYMeditor.NEWLINE + '{2,}', 'g'));

    if (paragraphStrings.length === 1) {
        // This is a one-line paste, which is an easy case.
        // We try not to wrap these in paragraphs
        isSingleLine = true;
    }

    if (typeof container === 'undefined' ||
            (container && container.tagName.toLowerCase() === WYMeditor.BODY)) {
        // No selection, or body selection. Paste at the end of the document

        if (isSingleLine) {
            // Easy case. Wrap the string in p tags
            paragraphs = jQuery(
                '<p>' + paragraphStrings[0] + '</p>',
                this._doc
            ).appendTo(this._doc.body);
        } else {
            // Need to build paragraphs and insert them at the end
            blockSplitter = 'p';
            for (i = paragraphStrings.length - 1; i >= 0; i -= 1) {
                // Going backwards because rangy.insertNode leaves the
                // selection in front of the inserted node
                html = '<' + blockSplitter + '>' +
                    (paragraphStrings[i].split(WYMeditor.NEWLINE).join('<br />')) +
                    '</' + blockSplitter + '>';
                // Build multiple nodes from the HTML because ie6 chokes
                // creating multiple nodes implicitly via jquery
                insertionNodes = jQuery(html, wym._doc);
                for (j = insertionNodes.length - 1; j >= 0; j--) {
                    // Loop backwards through all of the nodes because
                    // insertNode moves that direction
                    range.insertNode(insertionNodes[j]);
                }
            }
        }
    } else {
        // Pasting inside an existing element
        if (isSingleLine || $container.is('pre')) {
            // Easy case. Insert a text node at the current selection
            textNode = this._doc.createTextNode(str);
            range.insertNode(textNode);
        } else if ($container.is('p,h1,h2,h3,h4,h5,h6,li')) {
            wym._handleMultilineBlockContainerPaste(wym, $container, range, paragraphStrings);
        } else {
            // We're in a container that doesn't accept nested paragraphs (eg. td). Use
            // <br> separators everywhere instead
            textNodesToInsert = str.split(WYMeditor.NEWLINE);
            for (i = textNodesToInsert.length - 1; i >= 0; i -= 1) {
                // Going backwards because rangy.insertNode leaves the
                // selection in front of the inserted node
                textNode = this._doc.createTextNode(textNodesToInsert[i]);
                range.insertNode(textNode);
                if (i > 0) {
                    // Don't insert an opening br
                    range.insertNode(jQuery('<br />', wym._doc).get(0));
                }
            }
        }
    }
};

WYMeditor.editor.prototype.insert = function (html) {
    // Do we have a selection?
    var selection = this._iframe.contentWindow.getSelection(),
        range,
        node;
    if (selection.focusNode !== null) {
        // Overwrite selection with provided html
        range = selection.getRangeAt(0);
        node = range.createContextualFragment(html);
        range.deleteContents();
        range.insertNode(node);
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.editor.prototype.wrap = function (left, right) {
    this.insert(
        left + this._iframe.contentWindow.getSelection().toString() + right
    );
};

WYMeditor.editor.prototype.unwrap = function () {
    this.insert(this._iframe.contentWindow.getSelection().toString());
};

/**
    editor.canSetCaretBefore
    ========================

    Returns true if it is OK to set a collapsed selection immediately before
    a node. Otherwise returns false.

    @param node A node to check about.
 */
WYMeditor.editor.prototype.canSetCaretBefore = function (node) {
    if (node.nodeType === WYMeditor.NODE.TEXT) {
        return true;
    }
    if (
        node.tagName &&
        node.tagName.toLowerCase() === 'br'
    ) {
        if (
            !node.previousSibling
        ) {
            return true;

        } else if (
            node.previousSibling.tagName &&
            node.previousSibling.tagName.toLowerCase() === 'br'
        ) {
            return true;

        } else if (this.isBlockNode(node.previousSibling)) {
            return true;

        } else if (node.previousSibling.nodeType === WYMeditor.NODE.TEXT) {
            return true;
        }
    }
    return false;
};

/**
    editor.setCaretBefore
    =====================

    Sets a collapsed selection to immediately before a provided node.

    Not to be confused with `editor.setCaretIn`, which sets a collapsed
    selection inside a container node, at the start.

    @param node A node to set the selection to immediately before of.
 */
WYMeditor.editor.prototype.setCaretBefore = function (node) {
    var
        range = rangy.createRange(this._doc),
        selection = rangy.getIframeSelection(this._iframe);

    if (!this.canSetCaretBefore(node)) {
        throw "Can't set caret before this node.";
    }

    range.selectNode(node);
    range.collapse(true);

    selection.setSingleRange(range);
};

/**
    editor.canSetCaretIn
    ====================

    Returns true if it is OK to set a collapsed selection inside a node.
    Otherwise returns false.

    @param node A node to check about.
 */
WYMeditor.editor.prototype.canSetCaretIn = function (node) {

    if (
        node.nodeType === WYMeditor.NODE.TEXT ||
        (
            node.tagName &&
            jQuery.inArray(
                node.tagName.toLowerCase(),
                WYMeditor.NO_CARET_ELEMENTS
            ) > -1
        )
    ) {
        return false;
    }
    // Rangy issue #209.
    if (this.isInlineNode(node)) {

        if (node.childNodes.length === 0) {
            // Not possible to work-around this issue.
            return false;
        }
        // It is possible to work-around this issue by setting a non-collapsed
        // selection. Warn about this.
        WYMeditor.console.warn("Can set a non-collapsed selection. Rangy issue #209.");
    }
    return true;
};

/**
    editor.setCaretIn
    =================

    Sets a collapsed selection to inside provided container element, at the start.

    Not to be confused with `editor.setCaretBefore`, which sets a collapsed
    selection immediately before a node.

    @param element An element to set the selection inside of, at the start.
 */
WYMeditor.editor.prototype.setCaretIn = function (element) {
    var range = rangy.createRange(this._doc),
        selection = rangy.getIframeSelection(this._iframe);

    if (
        !this.canSetCaretIn(element)
    ) {
        throw "The element must be able to contain other elements. Perhaps " +
            " you would like to use `setCaretBefore`, instead.";
    }

    range.selectNodeContents(element);

    // Rangy issue #209.
    if (this.isInlineNode(element)) {

        // Don't collapse the range. As long as
        // this occurs only in tests it is probably OK. Warn.
        WYMeditor.console.warn("Can't set a collapsed selection. Setting " +
           "a non-collapsed selection, instead. Rangy issue #209.");
    } else {
        range.collapse(true);
    }

    selection.setSingleRange(range);
};

/**
    editor.splitListItemContents
    ============================

    Utility

    Splits a list item into the content that should stay with the li as it is
    indented/outdent and the things that should stay at their current indent level.

    `itemContents` are what a user would consider that list's contents
    `sublistContents` are the sub-items that are nested inside the li
    (basically everything after the first ol/ul inclusive).

    The returned object has `itemContents` and `sublistContents` properties.
*/
WYMeditor.editor.prototype.splitListItemContents = function ($listItem) {
    var $allContents,
        i,
        elmnt,
        hitSublist = false,
        splitObject = {itemContents: [], sublistContents: []};

    $allContents = $listItem.contents();

    for (i = 0; i < $allContents.length; i++) {
        elmnt = $allContents.get(i);
        if (hitSublist || jQuery(elmnt).is('ol,ul')) {
            // We've hit the first sublist. Everything from this point on is
            // considered `sublistContents`
            hitSublist = true;
            splitObject.sublistContents.push(elmnt);
        } else {
            splitObject.itemContents.push(elmnt);
        }
    }

    return splitObject;
};

/**
    editor.joinAdjacentLists
    ========================

    Utility

    Joins two lists if they are adjacent and are of the same type.

    The end result will be `listTwo`s contents being appended to `listOne`
*/
WYMeditor.editor.prototype.joinAdjacentLists = function (listOne, listTwo) {
    var $listTwoContents;

    if (typeof listOne === 'undefined' ||
            typeof listTwo === 'undefined') {
        // Invalid arguments
        return;
    }
    if (listOne.nextSibling !== listTwo ||
            listOne.tagName.toLowerCase() !== listTwo.tagName.toLowerCase()) {
        return;
    }

    $listTwoContents = jQuery(listTwo).contents();
    $listTwoContents.unwrap(); // Kill listTwo
    $listTwoContents.detach();
    jQuery(listOne).append($listTwoContents);
};

/**
    editor._indentSingleItem
    ========================

    Indent a single list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype._indentSingleItem = function (listItem) {
    var wym = this,
        $liToIndent,
        listType,
        spacerHtml,
        containerHtml,

        splitContent,
        $itemContents,
        $sublistContents,

        $prevLi,
        $prevSublist,
        $firstSublist,

        $spacer,
        $spacerContents;

    // The algorithm used here is generally:
    // 1. Ensure there's a previous li to put the `liToIndent`.
    // 2. Move the `liToIndent` into a sublist in the previous li.
    // 3. If we added a spacer_li after `liToIndent` remove it and move its
    // contents inside `liToIndent`.

    // For step 2, the sublist to use can either be:
    // 1. An existing sublist of the correct type at the end of the previous li.
    // 2. An existing sublist inside `liToIndent`.
    // 3. A new sublist that we create.

    $liToIndent = jQuery(listItem);
    listType = $liToIndent.parent()[0].tagName.toLowerCase();

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym.splitListItemContents($liToIndent);
    $sublistContents = jQuery(splitContent.sublistContents);
    $itemContents = jQuery(splitContent.itemContents);

    $prevLi = $liToIndent.prev().filter('li');
    // Ensure we actually have a previous li in which to put the `liToIndent`
    if ($prevLi.length === 0) {
        spacerHtml = '<li class="spacer_li"></li>';
        $liToIndent.before(spacerHtml);
        $prevLi = $liToIndent.prev();
    }

    // Move `liToIndent` to a sublist inside its previous sibling li
    $prevSublist = $prevLi.contents().last().filter('ol,ul');
    if ($prevSublist.length > 0) {
        // Case 1: We have a sublist at the appropriate level as a previous
        // sibling. Leave the sublist contents where they are and join the
        // previous sublist

        // Join our node at the end of the target sublist
        $prevSublist.append($liToIndent);

        // Stick all of the sublist contents at the end of the previous li
        $sublistContents.detach();
        $prevLi.append($sublistContents);

        // If we just moved two lists of the same type next to eachother, join
        // them
        $firstSublist = $sublistContents.first();
        wym.joinAdjacentLists($prevSublist.get(0), $firstSublist.get(0));
    } else {
        if ($sublistContents.length > 0) {
            // Case 2: We need to move our existing sublist to the previous li
            $sublistContents.detach();
            $prevLi.append($sublistContents);
            $prevSublist = $sublistContents.first();
        } else {
            // Case 3: Create a spacer sublist in the previous li in which to
            // place `liToIndent`
            containerHtml = '<' + listType + '></' + listType + '>';
            $prevLi.append(containerHtml);
            $prevSublist = $prevLi.contents().last();
        }

        // Move our li to the start of the sublist
        $prevSublist.prepend($liToIndent);
    }

    // If we eliminated the need for a spacer_li, remove it
    if ($liToIndent.next().is('.spacer_li')) {
        $spacer = $liToIndent.next('.spacer_li');
        $spacerContents = $spacer.contents();
        $spacerContents.detach();
        $liToIndent.append($spacerContents);
        $spacer.remove();
    }

};

/**
    editor._outdentSingleItem
    =========================

    Outdent a single list item via the dom, ensuring that the selected node moves in
    exactly one level and all other nodes stay at the same level.
 */
WYMeditor.editor.prototype._outdentSingleItem = function (listItem) {
    var wym = this,
        $liToOutdent,
        listType,
        spacerListHtml,

        splitContent,
        $itemContents,
        $sublistContents,

        $parentLi,
        $parentList,

        $subsequentSiblingContent,
        $subsequentParentListSiblingContent,

        $sublist;

    // The algorithm used here is generally:
    // 1. Gather all subsequent sibling content in `liToIndent`s list along
    // with all subsequent sibling content in `liToIndent`s parent list.
    // 2. Move `liToIndent` after the li whose sublist it's in.
    // 3. Create a sublist of the same type of `liToIndent`s parent list inside
    // `liToIndent`.
    // 4. If `liToIndent` has a sublist, use a spacer_li and list to hold its
    // position inside the new sublist.
    // 5. Append all original subsequent siblings inside the created sublist.
    // 6. Append all of `liToIndent`s original parent list subsequent sibling
    // content after the created sublist.
    // 7. Remove `liToOutdent`'s original parent list and parent li if either
    // are now empty

    $liToOutdent = jQuery(listItem);
    listType = $liToOutdent.parent()[0].tagName.toLowerCase();

    // If this list item isn't already indented at least one level, don't allow
    // outdenting
    if (!$liToOutdent.parent().parent().is('ol,ul,li')) {
        return;
    }
    if (!$liToOutdent.parent().parent().is('li')) {
        // We have invalid list nesting and we need to fix that
        WYMeditor.console.log(
            'Attempting to fix invalid list nesting before outdenting.'
        );
        wym.correctInvalidListNesting(listItem);
    }

    // Separate out the contents into things that should stay with the li as it
    // moves and things that should stay at their current level
    splitContent = wym.splitListItemContents($liToOutdent);
    $sublistContents = jQuery(splitContent.sublistContents);
    $itemContents = jQuery(splitContent.itemContents);

    // Gather subsequent sibling and parent sibling content
    $parentLi = $liToOutdent.parent().parent('li');
    // Invalid HTML could cause this selector to fail, which breaks our logic.
    // Bail out rather than possibly losing content
    if ($parentLi.length === 0) {
        WYMeditor.console.error('Invalid list. No parentLi found, so aborting outdent');
        return;
    }
    $parentList = $liToOutdent.parent();
    $subsequentSiblingContent = $liToOutdent.nextAllContents();
    $subsequentParentListSiblingContent = $parentList.nextAllContents();

    // Move the li to after the parent li
    $liToOutdent.detach();
    $parentLi.after($liToOutdent);

    // If this node has one or more sublists, they will need to be indented
    // by one with a fake parent to hold their previous position
    if ($sublistContents.length > 0) {
        spacerListHtml = '<' + listType + '>' +
            '<li class="spacer_li"></li>' +
            '</' + listType + '>';
        $liToOutdent.append(spacerListHtml);
        $sublist = $liToOutdent.children().last();
        // Add all of the sublistContents inside our new spacer li
        $sublistContents.detach();
        $sublist.children('li').append($sublistContents);
    }

    if ($subsequentSiblingContent.length > 0) {
        // Nest the previously-subsequent items inside the list to
        // retain order and their indent level
        if (typeof $sublist === 'undefined') {
            // Insert a sublist if we don't already have one
            spacerListHtml = '<' + listType + '></' + listType + '>';
            $liToOutdent.append(spacerListHtml);
            $sublist = $liToOutdent.children().last();
        }
        $subsequentSiblingContent.detach();
        $sublist.append($subsequentSiblingContent);
    }

    // If we have a parentItem with content after our parent list
    // eg. <ol>
    //       <li>one
    //         <ul ...>
    //         two
    //         <ul ...>
    //         three
    //       </li>
    //     </ol>
    // we'll need to split that parentItem to retain proper content ordering
    if ($subsequentParentListSiblingContent.length > 0) {
        // Move the subsequent content in to a new list item after our parent li
        $subsequentParentListSiblingContent.detach();

        // If our last content and the first content in the subsequent content
        // are both text nodes, insert a <br /> spacer to avoid crunching the
        // text together visually. This maintains the same "visual" structure.
        if ($liToOutdent.contents().length > 0 &&
                $liToOutdent.contents().last()[0].nodeType === WYMeditor.NODE.TEXT &&
                $subsequentParentListSiblingContent[0].nodeType === WYMeditor.NODE.TEXT) {
            $liToOutdent.append('<br />');
        }

        $liToOutdent.append($subsequentParentListSiblingContent);
    }

    // Remove our parentList if it's empty and if we just removed that, the
    // parentLi is likely to be empty also
    if ($parentList.contents().length === 0) {
        $parentList.remove();
    }
    if ($parentLi.contents().length === 0) {
        $parentLi.remove();
    }
};

/**
    editor.correctInvalidListNesting
    ================================

    Take an li/ol/ul and correct any list nesting issues in the entire list
    tree.

    Corrected lists have the following properties:
    1. ol and ul nodes *only* allow li children.
    2. All li nodes have either an ol or ul parent.

    The `alreadyCorrected` argument is used to indicate if a correction has
    already been made, which means we need to return true even if no further
    corrections are made.

    Returns true if any nodes were corrected.
 */
WYMeditor.editor.prototype.correctInvalidListNesting = function (listItem, alreadyCorrected) {
    // Travel up the dom until we're at the root ol/ul/li
    var currentNode = listItem,
        parentNode,
        tagName;
    if (typeof alreadyCorrected === 'undefined') {
        alreadyCorrected = false;
    }
    if (!currentNode) {
        return alreadyCorrected;
    }
    while (currentNode.parentNode) {
        parentNode = currentNode.parentNode;
        if (parentNode.nodeType !== WYMeditor.NODE.ELEMENT) {
            // Our parent is outside a valid list structure. Stop at this node.
            break;
        }
        tagName = parentNode.tagName.toLowerCase();
        if (tagName !== 'ol' && tagName !== 'ul' && tagName !== 'li') {
            // Our parent is outside a valid list structure. Stop at this node.
            break;

        }
        // We're still traversing up a list structure. Keep going
        currentNode = parentNode;
    }
    // We have the root node. Make sure it's legit
    if (jQuery(currentNode).is('li')) {
        // We have an li as the "root" because its missing a parent list.
        // Correct this problem and then try again to correct the nesting.
        WYMeditor.console.log(
            "Correcting orphaned root li before correcting invalid list nesting."
        );
        this._correctOrphanedListItem(currentNode);
        return this.correctInvalidListNesting(currentNode, true);
    }
    if (!jQuery(currentNode).is('ol,ul')) {
        WYMeditor.console.error("Can't correct invalid list nesting. No root list found");
        return alreadyCorrected;
    }
    return this._correctInvalidListNesting(currentNode, alreadyCorrected);
};

/**
    editor._isPOrDivAfterEnterInEmptynestedLi(container)
    ====================================================

    Detects one of the types of resulting DOM in issue #430.

    The case is when a 'p' or a 'div' are introduced into the parent 'li'.
    Since we don't allow a 'p' or a 'div' directly within 'li's it is replaced
    with a 'br'.

    Returns true if detected positively and false otherwise.

    @param container An element to check this about.
 */

WYMeditor.editor.prototype._isPOrDivAfterEnterInEmptynestedLi = function
(container) {
    if (
        jQuery.inArray(
            container.tagName.toLowerCase(),
            WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS
        ) > -1 &&
        container.parentNode.tagName.toLowerCase() === 'li'
    ) {
        switch (container.childNodes.length) {
            case 0:
                return true;
            case 1:
                if (
                    container.childNodes[0].tagName &&
                    container.childNodes[0].tagName.toLowerCase() === 'br'
                ) {
                    return true;
                } else if (
                    container.childNodes[0].nodeType === WYMeditor.NODE.TEXT &&
                    container.childNodes[0].data === WYMeditor.NBSP
                ) {
                    return true;
                }
        }
    }
    return false;
};

/**
    editor._isSpilledListAfterEnterInEmptyLi
    ========================================

    Detects one of the types of resulting DOM in issue #430.

    In this type of resulting DOM, the contents of a `li` have been
    "spilled" after that `li`.

    Returns true if detected positively and false otherwise.

    @param container An element to check this about.
 */

WYMeditor.editor.prototype._isSpilledListAfterEnterInEmptyLi = function
(container) {
    if (
        container.tagName.toLowerCase() === 'li' &&
        container.previousSibling &&
        this.isListNode(container.previousSibling) &&
        container.previousSibling.previousSibling &&
        container.previousSibling.previousSibling.tagName
            .toLowerCase() === 'li' &&
        this.isListNode(container.parentNode)
    ) {
        return true;
    }
    return false;
};

/**
    editor.handlePotentialEnterInEmptyNestedLi
    ==========================================

    Issue #430. When the caret is in an empty nested `li` and the enter key is
    pressed, browsers perform DOM manipulations that are different than what
    we desire.

    This detects two out of three types of the DOM manipulations and calls for
    their correction.

    The third type of DOM manipulation is harder to detect, but, luckily, it
    is tolerable, so it goes undetected. This results in a difference in UX
    across browsers.

    For detailed information on this please see the issue #430's description.

    @param keyPressed The code of the key that was pressed, to check whether
                      it is an enter.
    @param container The currently selected container.
 */

WYMeditor.editor.prototype.handlePotentialEnterInEmptyNestedLi = function (
    keyPressed, container) {

    if (keyPressed !== WYMeditor.KEY.ENTER) {
        // Only an enter key press can result a p/div in an empty nested list.
        return null;
    }

    if (this._isPOrDivAfterEnterInEmptynestedLi(container)) {
        this._replaceNodeWithBrAndSetCaret(container);
    } else if (this._isSpilledListAfterEnterInEmptyLi(container)) {
        this._appendSiblingsUntilNextLiToPreviousLi(container);
        this._replaceNodeWithBrAndSetCaret(container);
    }
};

/**
    editor._replaceNodeWithBrAndSetCaret
    ====================================

    Replaces a node with a `br` element and sets caret before it.

    If the previousSibling is inline (except for a `br`) then another `br`
    is added before.

    @param node This is the node to be replaced.
*/
WYMeditor.editor.prototype._replaceNodeWithBrAndSetCaret = function (node) {
    var $node = jQuery(node);

    if (
        node.previousSibling &&
        !node.previousSibling.tagName ||
        node.previousSibling.tagName.toLowerCase() !== 'br' &&
        this.isInlineNode(node.previousSibling)
    ) {
        $node.before('<br />');
    }
        $node.before('<br />');
        this.setCaretBefore(node.previousSibling);
        $node.remove();

};

/**
    editor._appendSiblingsUntilNextLiToPreviousLi
    =============================================

    This corrects the type of resulting DOM from issue #430 where the
    contents of a `li` have been spilled to after that `li`.

    It only corrects the spillage itself and doesn't modify the new `li`.

    @param newLi This is the new 'li' that was created. It is supposed to
                 contain the caret.
*/

WYMeditor.editor.prototype._appendSiblingsUntilNextLiToPreviousLi =
    function (newLi) {

    var $newLi = jQuery(newLi),
        // The spilled nodes are a subset of these.
        $parentContents = $newLi.parent().contents(),
        // This is the `li` that spilled its contents.
        $sadLi = $newLi.prevAll('li').first(),
        // This is the next `li` after the newLi. If it exists, it marks the
        // end of the spill.
        $nextLi = $newLi.nextAll('li').first(),
        // The spill start index is after the source `li`.
        spillStart = $sadLi.index() + 1,
        $spilled;

    if ($nextLi.length === 1) {
        $spilled = $parentContents.slice(spillStart, $nextLi.index());
    } else {
        // There are no `li` elements after our newLi. The spill ends at the
        // end of its parent.
        $spilled = $parentContents.slice(spillStart);
    }
    $sadLi.append($spilled);
};

/**
    editor._correctOrphanedListItem
    ===============================

    Ensure that the given ophaned list item has a proper list parent.

    Uses the sibling nodes to determine what kind of list should be used. Also
    wraps sibling adjacent orphaned li nodes in the same list.
 */
WYMeditor.editor.prototype._correctOrphanedListItem = function (listNode) {
    var prevAdjacentLis,
        nextAdjacentLis,
        $adjacentLis = jQuery(),
        prevList,
        prevNode;

    prevAdjacentLis = jQuery(listNode).prevContentsUntil(':not(li)');
    nextAdjacentLis = jQuery(listNode).nextContentsUntil(':not(li)');

    // Merge the collections together
    $adjacentLis = $adjacentLis.add(prevAdjacentLis);
    $adjacentLis = $adjacentLis.add(listNode);
    $adjacentLis = $adjacentLis.add(nextAdjacentLis);

    // Determine if we have a list node in which to insert all of our orphaned
    // li's
    prevNode = $adjacentLis[0].previousSibling;
    if (prevNode && jQuery(prevNode).is('ol,ul')) {
        prevList = prevNode;
    } else {
        // No previous existing list to use. Need to create one
        $adjacentLis.before('<ol></ol>');
        prevList = $adjacentLis.prev()[0];
    }

    // Insert all of the adjacent orphaned lists inside the new parent
    jQuery(prevList).append($adjacentLis);
};

/**
    editor._correctInvalidListNesting
    =================================

    This is the function that actually does the list correction.
    correctInvalidListNesting is just a helper function that first finds the root
    of the list.

    Returns true if any correction was made.

    We use a reverse preorder traversal to navigate the DOM because we might be:

    * Making nodes children of their previous sibling (in the <ol><li></li><ol>...</ol></ol> case)
    * Adding nodes at the current level (wrapping any non-li node inside a ul/ol in a new li node)

    Adapted from code at: Tavs Dokkedahl from
    http://www.jslab.dk/articles/non.recursive.preorder.traversal.part3
 */
WYMeditor.editor.prototype._correctInvalidListNesting = function (listNode, alreadyCorrected) {
    var rootNode = listNode,
        currentNode = listNode,
        wasCorrected = false,
        previousSibling,
        tagName,
        ancestorNode,
        nodesToMove,
        targetLi,
        lastContentNode,
        spacerHtml = '<li class="spacer_li"></li>';
    if (typeof alreadyCorrected !== 'undefined') {
        wasCorrected = alreadyCorrected;
    }

    while (currentNode) {
        if (currentNode._wym_visited) {
            // This node has already been visited.
            // Remove mark for visited nodes
            currentNode._wym_visited = false;
            // Once we reach the root element again traversal
            // is done and we can break
            if (currentNode === rootNode) {
                break;
            }
            if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
            } else {
                currentNode = currentNode.parentNode;
            }
        } else {
            // This is the first visit for this node

            // All non-li nodes must have an
            // ancestor li node that's closer than any ol/ul ancestor node.
            // Basically, everything needs to be inside an li node.
            if (currentNode !== rootNode && !jQuery(currentNode).is('li')) {
                // We have a non-li node.
                // Ensure that we have an li ancestor before we have any ol/ul
                // ancestors

                ancestorNode = currentNode;
                while (ancestorNode.parentNode) {
                    ancestorNode = ancestorNode.parentNode;
                    if (jQuery(ancestorNode).is('li')) {
                        // Everything is ok. Hit an li before a ol/ul
                        break;
                    }

                    if (ancestorNode.nodeType !== WYMeditor.NODE.ELEMENT) {
                        // Our parent is outside a valid list structure. Stop at this node.
                        break;
                    }
                    tagName = ancestorNode.tagName.toLowerCase();
                    if (tagName === 'ol' || tagName === 'ul') {
                        // We've hit a list container before any list item.
                        // This isn't valid html and causes editing problems.
                        //
                        // Convert the list to a valid structure that closely
                        // mimics the layout and behavior of invalidly nested
                        // content inside a list. The browser treats the
                        // content similar to how it would treat that same
                        // content separated by a <br /> within its previous
                        // sibling list item, so recreate that structure.
                        //
                        // The algorithm for performing this is basically:
                        // 1. Gather this and any previous siblings up until the
                        // previous li (if one exists) as content to move.
                        // 2. If we don't have any previous or subsequent li
                        // sibling, create a spacer li in which to insert all
                        // the gathered content.
                        // 3. Move all of the content to the previous li or the
                        // subsequent li (in that priority).
                        WYMeditor.console.log("Fixing orphaned list content");
                        wasCorrected = true;

                        // Gather this and previous sibling until the previous li
                        nodesToMove = [currentNode];
                        previousSibling = currentNode;
                        targetLi = null;
                        while (previousSibling.previousSibling) {
                            previousSibling = previousSibling.previousSibling;
                            if (jQuery(previousSibling).is('li')) {
                                targetLi = previousSibling;
                                // We hit an li. Store it as the target in
                                // which to move the nodes
                                break;
                            }
                            nodesToMove.push(previousSibling);
                        }

                        // We have our nodes ordered right to left and we need
                        // them left to right
                        nodesToMove.reverse();

                        // If there are no previous siblings, we can join the next li instead
                        if (!targetLi && nodesToMove.length === 1) {
                            if (jQuery(currentNode.nextSibling).is('li')) {
                                targetLi = currentNode.nextSibling;
                            }
                        }

                        // If we still don't have an li in which to move, we
                        // need to create a spacer li
                        if (!targetLi) {
                            jQuery(nodesToMove[0]).before(spacerHtml);
                            targetLi = jQuery(nodesToMove[0]).prev()[0];
                        }

                        // Move all of our content inside the li we've chosen
                        // If the last content node inside the target li is
                        // text and so is the first content node to move, separate them
                        // with a <br /> to preserve the visual layout of them
                        // being on separate lines
                        lastContentNode = jQuery(targetLi).contents().last();
                        if (lastContentNode.length === 1 &&
                                lastContentNode[0].nodeType === WYMeditor.NODE.TEXT) {
                            if (nodesToMove[0].nodeType === WYMeditor.NODE.TEXT) {
                                jQuery(targetLi).append('<br />');
                            }
                        }
                        jQuery(targetLi).append(jQuery(nodesToMove));

                        break;

                    }
                    // We're still traversing up a list structure. Keep going
                }
            }

            if (currentNode.lastChild) {
                // Since we have childnodes, mark this as visited because
                // we'll return later
                currentNode._wym_visited = true;
                currentNode = currentNode.lastChild;
            } else if (currentNode.previousSibling) {
                currentNode = currentNode.previousSibling;
            } else {
                currentNode = currentNode.parentNode;
            }
        }
    }

    return wasCorrected;
};

/**
    editor.getCommonParentList
    ==========================

    Get the common parent ol/ul for the given li nodes. If the parent ol/ul for
    each cell isn't the same, returns null.

    @param listItems An array of list item nodes to check for a common parent
    @param getClosest If true, checks if the closest list parent to each list
                      node is the same. If false, checks if the furthest list
                      parent to each list node is the same.
 */
WYMeditor.editor.prototype.getCommonParentList = function (listItems, getClosest) {
    var firstLi,
        parentList,
        rootList,
        haveCommonParent = true;

    listItems = jQuery(listItems).filter('li');
    if (listItems.length === 0) {
        return null;
    }
    firstLi = listItems[0];
    parentList = jQuery(firstLi).parents('ol,ul');
    parentList = (getClosest ? parentList.first() : parentList.last());

    if (parentList.length === 0) {
        return null;
    }
    rootList = parentList[0];

    // Ensure that all of the li's have the same parent list
    jQuery(listItems).each(function (index, elmnt) {
        parentList = jQuery(elmnt).parents('ol,ul');
        parentList = (getClosest ? parentList.first() : parentList.last());
        if (parentList.length === 0 || parentList[0] !== rootList) {
            haveCommonParent = false;
        }
    });

    if (!haveCommonParent) {
        return null;
    }
    return rootList;
};

/**
    editor._getSelectedListItems
    ============================

    Based on the given selection, determine which li nodes are "selected" from
    the user's standpoint. These are the li nodes that they would expect to be
    affected by an action with the given selection.

    Generally, this means any li which has at least some of its text content
    highlighted will be returned.
*/
WYMeditor.editor.prototype._getSelectedListItems = function (sel) {
    var wym = this,
        i,
        j,
        range,
        selectedLi,
        nodes = [],
        liNodes = [],
        containsNodeTextFilter,
        parentsToAdd,
        node;

    // Filter function to remove undesired nodes from what rangy.getNodes()
    // gives
    containsNodeTextFilter = function (testNode) {
        var fullyContainsNodeText;

        // Include any partially-selected textNodes
        if (rangy.dom.isCharacterDataNode(testNode)) {
            return testNode;
        }

        try {
            fullyContainsNodeText = range.containsNodeText(testNode);
        } catch (e) {
            // Rangy throws an exception on an internal
            // intersection call on the last node that's
            // actually in the selection
            return true;
        }

        if (fullyContainsNodeText === true) {
            // If we fully contain any text in this node, it's definitely
            // selected
            return true;
        }
    };

    // Iterate through all of the selection ranges and include any li nodes
    // that are user-selected in each range
    for (i = 0; i < sel.rangeCount; i++) {
        range = sel.getRangeAt(i);
        if (range.collapsed === true) {
            // Collapsed ranges don't return the range they're in as part of
            // getNodes, so let's find the next list item up
            selectedLi = wym.findUp(range.startContainer, 'li');
            if (selectedLi) {
                nodes = nodes.concat([selectedLi]);
            }
        } else {
            // getNodes includes the parent list item whenever we have our
            // selection in a sublist. We need to make a distinction between
            // when the parent list item is actually selected and when it's
            // only sort of selected because we're selecting a sub-item
            // (meaning it's partially selected).
            // In the following case, we don't want `2` as one of our nodes:
            // 1
            // 2
            //   2.1
            //   2|.2
            // 3|
            nodes = nodes.concat(
                range.getNodes(
                    [],
                    containsNodeTextFilter
                )
            );

            // We also need to include the parent li if we selected a non-li, non-list node.
            // eg. if we select text inside an li, the user is actually
            // selecting that entire li
            parentsToAdd = [];
            for (j = 0; j < nodes.length; j++) {
                node = nodes[j];
                if (!jQuery(node).is('li,ol,ul')) {
                    // Crawl up the dom until we find an li
                    while (node.parentNode) {
                        node = node.parentNode;
                        if (jQuery(node).is('li')) {
                            parentsToAdd.push(node);
                            break;
                        }
                    }
                }
            }
            // Add in all of the new parents if they're not already included
            // (no duplicates)
            for (j = 0; j < parentsToAdd.length; j++) {
                if (jQuery.inArray(parentsToAdd[j], nodes) === -1) {
                    nodes.push(parentsToAdd[j]);
                }
            }


        }
    }

    // Filter out the non-li nodes
    for (i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === WYMeditor.NODE.ELEMENT &&
                nodes[i].tagName.toLowerCase() === WYMeditor.LI) {
            liNodes.push(nodes[i]);
        }
    }

    return liNodes;
};

/**
    editor._selectionOnlyInList
    ===========================

    Tests if all of the nodes within the passed selection are contained in one
    list. Returns true if all of the nodes are within one list, and returns
    false if otherwise.

    @param sel A selection to test for being entirely contained within one
               list.
*/
WYMeditor.editor.prototype._selectionOnlyInList = function (sel) {
    var wym = this._wym,
        selStartNode,
        selEndNode,
        i;

    for (i = 0; i < sel.rangeCount; ++i) {
        selStartNode = wym.findUp(sel.getRangeAt(i).startContainer, ['li']);
        selEndNode = wym.findUp(sel.getRangeAt(i).endContainer, ['li']);

        // If the start or end node is not contained within a list item, return
        // false.
        if (!selStartNode || !selEndNode) {
            return false;
        }

        // If the two list items do not have a common parent list, return
        // false.
        if (!wym.getCommonParentList([selStartNode, selEndNode], false)) {
            return false;
        }
    }

    return true;
};

/**
    editor.indent
    =============

    Indent the selected list items via the dom.

    Only list items that have a common list will be indented.
 */
WYMeditor.editor.prototype.indent = function () {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        manipulationFunc,
        i;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selectedContainer(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = rangy.getIframeSelection(this._iframe);

    // If all of the selected nodes are not contained within one list, don't
    // perform the action.
    if (!wym._selectionOnlyInList(sel)) {
        return false;
    }

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);
    if (listItems.length === 0) {
        return false;
    }

    manipulationFunc = function () {
        var domChanged = false;

        for (i = 0; i < listItems.length; i++) {
            wym._indentSingleItem(listItems[i]);
            domChanged = true;
        }

        return domChanged;
    };
    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.outdent
    ==============

    Outdent a list item, accounting for firefox bugs to ensure consistent
    behavior and valid HTML.
*/
WYMeditor.editor.prototype.outdent = function () {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        manipulationFunc,
        i;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selectedContainer(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // We just changed and restored the selection when possibly correcting the
    // lists
    sel = rangy.getIframeSelection(this._iframe);

    // If all of the selected nodes are not contained within one list, don't
    // perform the action.
    if (!wym._selectionOnlyInList(sel)) {
        return false;
    }

    // Gather the li nodes the user means to affect based on their current
    // selection
    listItems = wym._getSelectedListItems(sel);

    if (listItems.length === 0) {
        return false;
    }

    manipulationFunc = function () {
        var domChanged = false;

        for (i = 0; i < listItems.length; i++) {
            wym._outdentSingleItem(listItems[i]);
            domChanged = true;
        }

        return domChanged;
    };
    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.restoreSelectionAfterManipulation
    ========================================

    A helper function to ensure that the selection is restored to the same
    location after a potentially-complicated dom manipulation is performed. This
    also handles the case where the dom manipulation throws and error by cleaning
    up any selection markers that were added to the dom.

    `manipulationFunc` is a function that takes no arguments and performs the
    manipulation. It should return `true` if changes were made that could have
    potentially destroyed the selection.
*/
WYMeditor.editor.prototype.restoreSelectionAfterManipulation = function (manipulationFunc) {
    var savedSelection = rangy.saveSelection(rangy.dom.getIframeWindow(this._iframe)),
        changesMade = true;

    // If something goes wrong, we don't want to leave selection markers
    // floating around
    try {
        changesMade = manipulationFunc();
        if (changesMade) {
            rangy.restoreSelection(savedSelection);
        } else {
            rangy.removeMarkers(savedSelection);
        }
    } catch (e) {
        WYMeditor.console.error("Error during manipulation");
        WYMeditor.console.error(e);
        rangy.removeMarkers(savedSelection);
    }

    return changesMade;
};

/**
    editor.insertOrderedlist
    ========================

    Convert the selected block in to an ordered list.

    If the selection is already inside a list, switch the type of the nearest
    parent list to an `<ol>`. If the selection is in a block element that can be a
    valid list, place that block element's contents inside an ordered list.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertOrderedList)`.
 */
WYMeditor.editor.prototype.insertOrderedlist = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selectedContainer(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym._insertList('ol');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor.insertUnorderedlist
    ==========================

    Convert the selected block in to an unordered list.

    Exactly the same as `editor.insert_orderedlist` except with `<ol>` instead.

    Pure dom implementation consistently cross-browser implementation of
    `execCommand(InsertUnorderedList)`.
 */
WYMeditor.editor.prototype.insertUnorderedlist = function () {
    var wym = this,
        manipulationFunc;

    // First, make sure this list is properly structured
    manipulationFunc = function () {
        var selectedBlock = wym.selectedContainer(),
            potentialListBlock = wym.findUp(
                selectedBlock,
                ['ol', 'ul', 'li']
            );
        return wym.correctInvalidListNesting(potentialListBlock);
    };
    if (wym.restoreSelectionAfterManipulation(manipulationFunc)) {
        // We actually made some list correction
        // Don't actually perform the action if we've potentially just changed
        // the list, and maybe the list appearance as a result.
        return true;
    }

    // Actually perform the list insertion
    manipulationFunc = function () {
        return wym._insertList('ul');
    };

    return wym.restoreSelectionAfterManipulation(manipulationFunc);
};

/**
    editor._insertList
    ==================

    Convert the selected block in to the specified type of list.

    If the selection is already inside a list, switch the type of the nearest
    parent list to an `<ol>`. If the selection is in a block element that can be a
    valid list, place that block element's contents inside an ordered list.

    Returns `true` if a change was made, `false` otherwise.
 */
WYMeditor.editor.prototype._insertList = function (listType) {
    var wym = this._wym,
        sel = rangy.getIframeSelection(this._iframe),
        listItems,
        rootList,
        selectedBlock,
        potentialListBlock;

    listItems = wym._getSelectedListItems(sel);

    // If we've selected some list items all in the same list, we want to
    // change the type of that list.
    if (listItems.length !== 0) {
        // If the selection is across paragraphs and other items at the root level,
        // don't indent
        rootList = wym.getCommonParentList(listItems, true);
        if (rootList) {
            this._changeListType(rootList, listType);
            return true;
        } else {
            // We have a selection across multiple root-level lists. Punt on
            // this case for now.
            // TODO: Handle multiple root-level lists properly
            return false;
        }

    }

    // If we've selected a block-level item that's appropriate to convert in to a list,
    // convert it.
    selectedBlock = this.selectedContainer();
    // TODO: Use `_containerRules['root']` minus the ol/ul and
    // `_containerRules['contentsCanConvertToList']
    potentialListBlock = this.findUp(selectedBlock, WYMeditor.POTENTIAL_LIST_ELEMENTS);
    if (potentialListBlock) {
        this._convertToList(potentialListBlock, listType);
        return true;
    }

    // The user has something selected that wouldn't be a valid list
    return false;
};

WYMeditor.editor.prototype._changeListType = function (list, listType) {
    // Wrap the contents in a new list of `listType` and remove the old list
    // container.
    return WYMeditor.changeNodeType(list, listType);
};

WYMeditor.editor.prototype._convertToList = function (blockElement, listType) {
    var $blockElement = jQuery(blockElement),
        newListHtml,
        $newList;

    // ie6 doesn't support calling wrapInner with a dom node. Build html
    newListHtml = '<' + listType + '><li></li></' + listType + '>';

    if (this.findUp(blockElement, WYMeditor.MAIN_CONTAINERS) === blockElement) {
        // TODO: Handle ol/ul elements, since these are now in the `root`
        // containers list

        // This is a main container block, so we can just replace it with the
        // list structure
        $blockElement.wrapInner(newListHtml);
        $newList = $blockElement.children();
        $newList.unwrap();

        return $newList.get(0);
    }
    // We're converting a block that's not a main container, so we need to nest
    // this list around its contents and NOT remove the container (eg. a td
    // node).
    $blockElement.wrapInner(newListHtml);
    $newList = $blockElement.children();

    return $newList.get(0);
};

/**
     editor.insertTable
     ==================

     Insert a table at the current selection with the given number of rows
     and columns and with the given caption and summary text.
*/
WYMeditor.editor.prototype.insertTable = function (rows, columns, caption, summary) {
    if ((rows <= 0) || (columns <= 0)) {
        // We need rows and columns to make a table

        // TODO: It seems to me we should warn the user when zero columns and/or
        // rows were entered.
        return;
    }

    var table = this._doc.createElement(WYMeditor.TABLE),
        newRow = null,
        newCaption,

        x,
        y,
        container,
        selectedNode;

    // Create the table caption
    newCaption = table.createCaption();
    newCaption.innerHTML = caption;

    // Create the rows and cells
    for (x = 0; x < rows; x += 1) {
        newRow = table.insertRow(x);
        for (y = 0; y < columns; y += 1) {
            newRow.insertCell(y);
        }
    }

    if (summary !== "") {
        // Only need to set the summary if we actually have a summary
        jQuery(table).attr('summary', summary);
    }

    // Find the currently-selected container
    container = jQuery(
        this.findUp(this.mainContainer(), WYMeditor.POTENTIAL_TABLE_INSERT_ELEMENTS)
    ).get(0);

    if (!container || !container.parentNode) {
        // No valid selected container. Put the table at the end.
        jQuery(this._doc.body).append(table);

    } else if (jQuery.inArray(container.nodeName.toLowerCase(),
                       WYMeditor.INLINE_TABLE_INSERTION_ELEMENTS) > -1) {
        // Insert table after selection if container is allowed to have tables
        // inserted inline.
        selectedNode = this.selection().focusNode;

        // If the selection is within a table, move the selection to the parent
        // table to avoid nesting the tables.
        if (jQuery.inArray(selectedNode.nodeName.toLowerCase(),
                           WYMeditor.SELECTABLE_TABLE_ELEMENTS) > -1 ||
            jQuery.inArray(selectedNode.parentNode.nodeName.toLowerCase(),
                           WYMeditor.SELECTABLE_TABLE_ELEMENTS) > -1) {

            while (selectedNode.nodeName.toLowerCase() !== WYMeditor.TABLE) {
                selectedNode = selectedNode.parentNode;
            }
        }

        // If the list item itself is selected, append the table to it. If the
        // selection is within the list item, put the table after it. Either
        // way, this ensures the table will always be inserted within the list
        // item.
        if (selectedNode.nodeName.toLowerCase() === WYMeditor.LI) {
            jQuery(selectedNode).append(table);
        } else {
            jQuery(selectedNode).after(table);
        }

    } else {
        // If the table is not allowed to be inserted inline with the
        // container, insert it after the container.
        jQuery(container).after(table);
    }

    // Handle any browser-specific cleanup
    this.afterInsertTable(table);
    this.fixBodyHtml();

    return table;
};

/**
    editor.afterInsertTable
    =======================

    Handle cleanup/normalization after inserting a table. Different browsers
    need slightly different tweaks.
*/
WYMeditor.editor.prototype.afterInsertTable = function () {
};

WYMeditor.editor.prototype.listen = function () {
    var wym = this;

    // Don't use jQuery.find() on the iframe body
    // because of MSIE + jQuery + expando issue (#JQ1143)

    jQuery(wym._doc.body).bind("mousedown", function (e) {
        wym.mousedown(e);
    });

    jQuery(wym._doc).bind('paste', function () {
        wym.handlePasteEvent();
    });
};

WYMeditor.editor.prototype.handlePasteEvent = function () {
    var wym = this;

    // The paste event happens *before* the paste actually occurs.
    // Use a timer to delay execution until after whatever is being pasted has
    // actually been added.
    window.setTimeout(
        function () {
            jQuery(wym._element).trigger(
                WYMeditor.EVENTS.postBlockMaybeCreated,
                wym
            );
        },
        20
    );
};

WYMeditor.editor.prototype.mousedown = function (evt) {
    // Store the selected image if we clicked an <img> tag
    this._selectedImage = null;
    if (evt.target.tagName.toLowerCase() === WYMeditor.IMG) {
        this._selectedImage = evt.target;
    }
};

/**
    WYMeditor.editor.initSkin
    =========================

    Apply the appropriate CSS class to "activate" that skin's CSS and call the
    skin's javascript `init` method.
*/
WYMeditor.editor.prototype.initSkin = function () {
    // Put the classname (ex. wym_skin_default) on wym_box
    jQuery(this._box).addClass("wym_skin_" + this._options.skin);

    // Init the skin, if needed
    if (typeof WYMeditor.SKINS[this._options.skin] !== "undefined") {
        if (typeof WYMeditor.SKINS[this._options.skin].init === "function") {
            WYMeditor.SKINS[this._options.skin].init(this);
        }
    } else {
        WYMeditor.console.warn(
            "Chosen skin _" + this.options.skin + "_ not found."
        );
    }
};

/*jslint maxlen: 90 */
/* global -$ */
"use strict";

/**
 * WYMeditor.DocumentStructureManager
 * ==================================
 *
 * This manager controls the rules for the subset of HTML that WYMeditor will
 * allow the user to create. For technical users, there are justifiable reasons
 * to use any in-spec HTML, but for users of WYMeditor (not implementors), the
 * goal is make it intuitive for them to create the structured markup that will
 * fit their needs.
 *
 * For example, while it's valid HTML to have a mix
 * of DIV and P tags at the top level of a document, in practice, this is
 * confusing for non-technical users. The DocumentStructureManager allows the
 * WYMeditor implementor to standardize on P tags in the root of the document,
 * which will automatically convert DIV tags in the root to P tags.
 *
 */
WYMeditor.DocumentStructureManager = function (wym, defaultRootContainer) {
    this._wym = wym;
    this.structureRules = WYMeditor.DocumentStructureManager.DEFAULTS;
    this.setDefaultRootContainer(defaultRootContainer);
};

jQuery.extend(WYMeditor.DocumentStructureManager, {
    // Only these containers are allowed as valid `defaultRootContainer`
    // options.
    VALID_DEFAULT_ROOT_CONTAINERS : [
        "p",
        "div"
    ],

    // Cooresponding titles for use in the containers panel for the valid
    // default root containers
    DEFAULT_ROOT_CONTAINER_TITLES : {
        p: "Paragraph",
        div: "Division"
    },

    // These containers prevent the user from using up/down/enter/backspace
    // to move above or below them, thus effectively blocking the creation
    // of new blocks. We must use temporary spacer elements to correct this
    // while the document is being edited.
    CONTAINERS_BLOCKING_NAVIGATION : ["table", "blockquote", "pre"],


    DEFAULTS : {
        // By default, this container will be used for all root contents. This
        // defines the container used when "enter" is pressed from the root and
        // also which container wraps or replaces containers found at the root
        // that aren't allowed. Only
        // `DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS` are allowed
        // here. Whichever you choose, the VALID_DEFAULT_ROOT_CONTAINERS will
        // be automatically converted when found at the top level of your
        // document.
        defaultRootContainer: 'p',

        // These containers cannot be used as root containers. This includes
        // any default root containers that are not the chosen default root
        // container. By default, this is set to the list of valid root
        // containers that are not the defaultRootContainer.
        notValidRootContainers: ['div'],

        // Only these containers are allowed as a direct child of the body tag.
        // All other containers located there will be wrapped in the
        // `defaultRootContainer`, unless they're one of the tags in
        // `convertIfRoot`.
        validRootContainers: [
            'p',
            'div',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'pre',
            'blockquote',
            'table',
            'ol',
            'ul'
        ],

        // If these tags are found in the root, they'll be converted to the
        // `defaultRootContainer` container instead of the default of being
        // wrapped.
        convertIfRootContainers: [
            'div'
        ],

        // The elements that are allowed to be turned in to lists.
        validListConversionTargetContainers: [
            "p",
            "div",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "pre",
            "blockquote",
            "td",
            "th"
        ],

        // For most block elements, the default behavior when a user attempts
        // to convert it to a list is to convert that block to a ol/ul and wrap
        // the contents in an li. For containers in `wrapContentsInList`,
        // instead of converting the container, we should just wrap the
        // contents of the container in a ul/ol + li.
        wrapContentsInList: [
            'td',
            'th'
        ]
    }
});

/**
 * Set the default container created/used in the root.
 *
 * @param defaultRootContainer String A string representation of the tag to
 * use.
 */
WYMeditor.DocumentStructureManager.prototype.setDefaultRootContainer = function
(
    defaultRootContainer
) {
    var validContainers,
        index,
        DSManager;

    if (this.structureRules.defaultRootContainer === defaultRootContainer) {
        // This is already our current configuration. No need to do the
        // work again.
        return;
    }

    // Make sure the new container is one of the valid options
    DSManager = WYMeditor.DocumentStructureManager;
    validContainers = DSManager.VALID_DEFAULT_ROOT_CONTAINERS;
    index = jQuery.inArray(defaultRootContainer, validContainers);
    if (index === -1) {
        throw new Error(
            "a defaultRootContainer of '" +
            defaultRootContainer +
            "' is not supported"
        );
    }

    this.structureRules.defaultRootContainer = defaultRootContainer;

    // No other possible option for default root containers is valid expect for
    // the one choosen default root container
    this.structureRules.notValidRootContainers =
        WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;
    this.structureRules.notValidRootContainers.splice(index, 1);

    this.adjustDefaultRootContainerUI();

    // TODO: Actually do all of the switching required to move from p to div or
    // from div to p for the topLevelContainer
};

/**
    adjustDefaultRootContainerUI
    ============================

    Adds a new link for the default root container to the containers panel in
    the editor if needed, and removes any other links for valid default root
    containers form the containers panel besides the link for the chosen
    default root container.
*/
WYMeditor.DocumentStructureManager.prototype.adjustDefaultRootContainerUI = function () {
    var wym = this._wym,
        defaultRootContainer = this.structureRules.defaultRootContainer,
        $containerItems,
        $containerLink,
        $newContainerItem,
        containerName,
        newContainerLinkNeeded,
        newContainerLinkHtml,
        i,
        DSManager;

    $containerItems = jQuery(wym._box).find(wym._options.containersSelector)
                                      .find('li');
    newContainerLinkNeeded = true;

    // Remove container links for any other valid default root container from
    // the containers panel besides the link for the chosen default root
    // container
    for (i = 0; i < $containerItems.length; ++i) {
        $containerLink = $containerItems.eq(i).find('a');
        containerName = $containerLink.attr('name').toLowerCase();
        if (jQuery.inArray(containerName,
                           this.structureRules.notValidRootContainers) > -1) {
            $containerItems.eq(i).remove();
        }
        if (containerName === defaultRootContainer) {
            newContainerLinkNeeded = false;
        }
    }

    // Add new link for the default root container to the containers panel if
    // needed
    if (newContainerLinkNeeded) {
        newContainerLinkHtml = wym._options.containersItemHtml;
        newContainerLinkHtml = WYMeditor.Helper.replaceAll(
            newContainerLinkHtml,
            WYMeditor.CONTAINER_NAME,
            defaultRootContainer.toUpperCase()
        );
        DSManager = WYMeditor.DocumentStructureManager;
        newContainerLinkHtml = WYMeditor.Helper.replaceAll(
            newContainerLinkHtml,
            WYMeditor.CONTAINER_TITLE,
            DSManager.DEFAULT_ROOT_CONTAINER_TITLES[defaultRootContainer]
        );
        newContainerLinkHtml = WYMeditor.Helper.replaceAll(
            newContainerLinkHtml,
            WYMeditor.CONTAINER_CLASS,
            "wym_containers_" + defaultRootContainer
        );
        $newContainerItem = jQuery(newContainerLinkHtml);
        $containerItems = jQuery(wym._box).find(wym._options.containersSelector)
                                          .find('li');
        $containerItems.eq(0).before($newContainerItem);

        // Bind click event for the new link
        $newContainerItem.find('a').click(function () {
            wym.mainContainer(jQuery(this).attr(WYMeditor.NAME));
            return false;
        });
    }
};


/*jslint evil: true */
/* global -$ */
"use strict";

WYMeditor.WymClassGecko = function (wym) {
    this._wym = wym;
    this._class = "class";
};

// Placeholder cell to allow content in TD cells for FF 3.5+
WYMeditor.WymClassGecko.CELL_PLACEHOLDER = '<br _moz_dirty="" />';

// Firefox 3.5 and 3.6 require the CELL_PLACEHOLDER and 4.0 doesn't
WYMeditor.WymClassGecko.NEEDS_CELL_FIX = parseInt(
    jQuery.browser.version, 10) === 1 &&
    jQuery.browser.version >= '1.9.1' &&
    jQuery.browser.version < '2.0';

WYMeditor.WymClassGecko.prototype.initIframe = function (iframe) {
    var wym = this;

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    this._doc.title = this._wym._index;

    // Set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    // Init html value
    if (this._wym._options.html) {
        this._html(this._wym._options.html);
    } else {
        this._html(this._element[0].value);
    }

    this.enableDesignMode();

    if (jQuery.isFunction(this._options.preBind)) {
        this._options.preBind(this);
    }

    // Bind external events
    this._wym.bindEvents();

    jQuery(this._doc).bind("keydown", this.keydown);
    jQuery(this._doc).bind("keyup", this.keyup);
    jQuery(this._doc).bind("click", this.click);
    // Bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", function () {
        // Fix scope
        wym.enableDesignMode.call(wym);
    });

    wym.iframeInitialized = true;

    wym.postIframeInit();
};

/** @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassGecko.prototype._html = function (html) {
    if (typeof html === 'string') {
        //disable designMode
        try {
            this._doc.designMode = "off";
        } catch (e) {
            //do nothing
        }

        //replace em by i and strong by bold
        //(designMode issue)
        html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>");
        html = html.replace(/<\/em>/gi, "</i>");
        html = html.replace(/<strong(\b[^>]*)>/gi, "<b$1>");
        html = html.replace(/<\/strong>/gi, "</b>");

        //update the html body
        jQuery(this._doc.body).html(html);
        this._wym.fixBodyHtml();

        //re-init designMode
        this.enableDesignMode();
    } else {
        return jQuery(this._doc.body).html();
    }
    return false;
};

WYMeditor.WymClassGecko.prototype._exec = function (cmd, param) {
    if (!this.selectedContainer()) {
        return false;
    }

    if (param) {
        this._doc.execCommand(cmd, '', param);
    } else {
        this._doc.execCommand(cmd, '', null);
    }

    //set to P if parent = BODY
    var container = this.selectedContainer();
    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        this.fixBodyHtml();
    }

    return true;
};

//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassGecko.prototype.keydown = function (evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    if (evt.ctrlKey) {
        if (evt.which === 66) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            return false;
        }
        if (evt.which === 73) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            return false;
        }
    }

    return true;
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassGecko.prototype.keyup = function (evt) {
    // 'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title],
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    wym._selectedImage = null;
    container = null;

    // If the inputted key cannont create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (wym.isForbiddenMainContainer(name)) {
            name = parentName;
        }

        // Replace text nodes with default root tags and make sure the
        // container is valid if it is a root container
        if (name === WYMeditor.BODY ||
                (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY)) {

            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new
    // one, then we should ensure the container is valid and the formatting is
    // proper.
    if (wym.keyCanCreateBlockElement(evt.which)) {
        // If the selected container is a root container, make sure it is not a
        // different possible default root container than the chosen one.
        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }
        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
        }

        // Call for the check for--and possible correction of--issue #430.
        wym.handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};

WYMeditor.WymClassGecko.prototype.click = function () {
    var wym = WYMeditor.INSTANCES[this.title],
        container = wym.selectedContainer(),
        sel;

    if (WYMeditor.WymClassGecko.NEEDS_CELL_FIX === true) {
        if (container && container.tagName.toLowerCase() === WYMeditor.TR) {
            // Starting with FF 3.6, inserted tables need some content in their
            // cells before they're editable
            jQuery(WYMeditor.TD, wym._doc.body).append(
                WYMeditor.WymClassGecko.CELL_PLACEHOLDER);

            // The user is still going to need to move out of and then back in
            // to this cell if the table was inserted via an inner_html call
            // (like via the manual HTML editor).
            // TODO: Use rangy or some other selection library to consistently
            // put the users selection out of and then back in this cell
            // so that it appears to be instantly editable
            // Once accomplished, can remove the afterInsertTable handling
        }
    }

    if (container && container.tagName.toLowerCase() === WYMeditor.BODY) {
        // A click in the body means there is no content at all, so we
        // should automatically create a starter paragraph
        sel = wym._iframe.contentWindow.getSelection();
        if (sel.isCollapsed === true) {
            // If the selection isn't collapsed, we might have a selection that
            // drags over the body, but we shouldn't turn everything in to a
            // paragraph tag. Otherwise, double-clicking in the space to the
            // right of an h2 tag would turn it in to a paragraph
            wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
        }
    }
};

WYMeditor.WymClassGecko.prototype.enableDesignMode = function () {
    if (this._doc.designMode === "off") {
        try {
            this._doc.designMode = "on";
            this._doc.execCommand("styleWithCSS", '', false);
            this._doc.execCommand("enableObjectResizing", false, true);
        } catch (e) {}
    }
};

/*
 * Fix new cell contents and ability to insert content at the front and end of
 * the contents.
 */
WYMeditor.WymClassGecko.prototype.afterInsertTable = function (table) {
    if (WYMeditor.WymClassGecko.NEEDS_CELL_FIX === true) {
        // In certain FF versions, inserted tables need some content in their
        // cells before they're editable, otherwise the user has to move focus
        // in and then out of a cell first, even with our click() hack
        jQuery(table).find('td').each(function (index, element) {
            jQuery(element).append(WYMeditor.WymClassGecko.CELL_PLACEHOLDER);
        });
    }
};

/*jslint evil: true */
/* global rangy, -$ */
"use strict";

WYMeditor.WymClassTrident = function (wym) {
    this._wym = wym;
    this._class = "className";
};

WYMeditor.WymClassTrident.prototype.initIframe = function (iframe) {
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;

    if (this._doc.designMode !== "On") {
        this._doc.designMode = "On";
        // Initializing designMode triggers the load event again, thus
        // triggering this method again. We can short-circuit this run and do
        // all of the work in the next trigger
        return false;
    }
    this._doc.title = this._wym._index;

    // Set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    // Init html value
    if (this._wym._options.html) {
        this._html(this._wym._options.html);
    } else {
        this._html(this._element[0].value);
    }

    // Handle events
    var wym = this;

    this._doc.body.onfocus = function () {
        wym._doc.designMode = "on";
        wym._doc = iframe.contentWindow.document;
    };
    this._doc.onbeforedeactivate = function () {
        wym.saveCaret();
    };
    jQuery(this._doc).bind('keyup', wym.keyup);
    this._doc.onkeyup = function () {
        wym.saveCaret();
    };
    this._doc.onclick = function () {
        wym.saveCaret();
    };

    this._doc.body.onbeforepaste = function () {
        wym._iframe.contentWindow.event.returnValue = false;
    };

    this._doc.body.onpaste = function () {
        wym._iframe.contentWindow.event.returnValue = false;
        wym.paste(window.clipboardData.getData("Text"));
    };

    if (jQuery.isFunction(this._options.preBind)) {
        this._options.preBind(this);
    }

    this._wym.bindEvents();

    wym.iframeInitialized = true;

    wym.postIframeInit();
};

(function (editorInitSkin) {
    WYMeditor.WymClassTrident.prototype.initSkin = function () {
        // Mark container items as unselectable (#203)
        // Fix for issue explained:
        // http://stackoverflow.com/questions/
        // 1470932/ie8-iframe-designmode-loses-selection
        jQuery(this._box).find(
            this._options.containerSelector
        ).attr('unselectable', 'on');

        editorInitSkin.call(this);
    };
}(WYMeditor.editor.prototype.initSkin));

WYMeditor.WymClassTrident.prototype._exec = function (cmd, param) {
    if (param) {
        this._doc.execCommand(cmd, false, param);
    } else {
        this._doc.execCommand(cmd);
    }
};

WYMeditor.WymClassTrident.prototype.saveCaret = function () {
    this._doc.caretPos = this._doc.selection.createRange();
};

WYMeditor.WymClassTrident.prototype.insert = function (html) {

    // Get the current selection
    var range = this._doc.selection.createRange(),
        $selectionParents;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(this._options.iframeBodySelector)) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(html);
        } catch (e) {}
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.WymClassTrident.prototype.wrap = function (left, right) {
    // Get the current selection
    var range = this._doc.selection.createRange(),
        $selectionParents;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(this._options.iframeBodySelector)) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(left + range.text + right);
        } catch (e) {}
    }
};

/**
    wrapWithContainer
    =================

    Wraps the passed node in a container of the passed type. Also, restores the
    selection to being after the node within its new container.

    @param node A DOM node to be wrapped in a container
    @param containerType A string of an HTML tag that specifies the container
                         type to use for wrapping the node.
*/
WYMeditor.WymClassTrident.prototype.wrapWithContainer = function (
    node, containerType
) {
    var wym = this._wym,
        $wrappedNode,
        selection,
        range;

    $wrappedNode = jQuery(node).wrap('<' + containerType + ' />');
    selection = rangy.getIframeSelection(wym._iframe);
    range = rangy.createRange(wym._doc);
    range.selectNodeContents($wrappedNode[0]);
    range.collapse();
    selection.setSingleRange(range);
};

WYMeditor.WymClassTrident.prototype.unwrap = function () {
    // Get the current selection
    var range = this._doc.selection.createRange(),
        $selectionParents,
        text;

    // Check if the current selection is inside the editor
    $selectionParents = jQuery(range.parentElement()).parents();
    if ($selectionParents.is(this._options.iframeBodySelector)) {
        try {
            // Unwrap selection
            text = range.text;
            this._exec('Cut');
            range.pasteHTML(text);
        } catch (e) {}
    }
};

WYMeditor.WymClassTrident.prototype.keyup = function (evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title],
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName,
        forbiddenMainContainer = false,
        selectedNode;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    this._selectedImage = null;

    // If the pressed key can't create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        selectedNode = wym.selection().focusNode;
        if (container !== null) {
            name = container.tagName.toLowerCase();
        }
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (wym.isForbiddenMainContainer(name)) {
            name = parentName;
            forbiddenMainContainer = true;
        }

        // Wrap text nodes and forbidden main containers with default root node
        // tags
        if (name === WYMeditor.BODY && selectedNode.nodeName === "#text") {
            // If we're in a forbidden main container, switch the selected node
            // to its parent node so that we wrap the forbidden main container
            // itself and not its inner text content
            if (forbiddenMainContainer) {
                selectedNode = selectedNode.parentNode;
            }
            wym.wrapWithContainer(selectedNode, defaultRootContainer);
            wym.fixBodyHtml();
        }

        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym.switchTo(container, defaultRootContainer);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new
    // one, then we should ensure the container is valid and the formatting is
    // proper.
    if (wym.keyCanCreateBlockElement(evt.which)) {
        // If the selected container is a root container, make sure it is not a
        // different possible default root container than the chosen one.
        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }
        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym.switchTo(container, defaultRootContainer);
        }

        // Call for the check for--and possible correction of--issue #430.
        wym.handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // IE8 bug https://github.com/wymeditor/wymeditor/issues/446
        if (jQuery.browser.msie && jQuery.browser.version === "8.0" &&
           container.parentNode) {
            if (parentName === 'ul' || parentName === 'ol') {
                wym.correctInvalidListNesting(container);
            }
        }

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};

/*jslint evil: true */
/* global -$ */
"use strict";

WYMeditor.WymClassWebKit = function (wym) {
    this._wym = wym;
    this._class = "class";
};

WYMeditor.WymClassWebKit.prototype.initIframe = function (iframe) {
    var wym = this;

    wym._iframe = iframe;
    wym._doc = iframe.contentDocument;

    wym._doc.title = wym._wym._index;

    // Set the text direction
    jQuery('html', wym._doc).attr('dir', wym._options.direction);

    // Init designMode
    wym._doc.designMode = "on";

    // Init html value
    if (wym._wym._options.html) {
        wym._html(wym._wym._options.html);
    } else {
        wym._html(wym._element[0].value);
    }

    if (jQuery.isFunction(wym._options.preBind)) {
        wym._options.preBind(wym);
    }

    // Bind external events
    wym._wym.bindEvents();

    jQuery(wym._doc).bind("keydown", wym.keydown);
    jQuery(wym._doc).bind("keyup", wym.keyup);

    wym.iframeInitialized = true;

    wym.postIframeInit();
};

WYMeditor.WymClassWebKit.prototype._exec = function (cmd, param) {
    if (!this.selectedContainer()) {
        return false;
    }

    var container,
        $container,
        tagName,
        structureRules,
        noClassOrAppleSpan;

    if (param) {
        this._doc.execCommand(cmd, '', param);
    } else {
        this._doc.execCommand(cmd, '', null);
    }

    container = this.selectedContainer();
    if (container) {
        $container = jQuery(container);
        tagName = container.tagName.toLowerCase();

        // Wrap this content in the default root container if we're in the body
        if (tagName === WYMeditor.BODY) {
            structureRules = this.documentStructureManager.structureRules;
            this._exec(
                WYMeditor.FORMAT_BLOCK,
                structureRules.defaultRootContainer
            );
            this.fixBodyHtml();
        }

        // If the cmd was FORMAT_BLOCK, check if the block was moved outside
        // the body after running the command. If it was moved outside, move it
        // back inside the body. This was added because running FORMAT_BLOCK on
        // an image inserted outside of a container was causing it to be moved
        // outside the body (See issue #400).
        if (cmd === WYMeditor.FORMAT_BLOCK &&
            $container.siblings('body.wym_iframe').length) {

            $container.siblings('body.wym_iframe').append(container);
        }

        // If the container is a span, strip it out if it doesn't have a class
        // but has an inline style of 'font-weight: normal;'.
        if (tagName === 'span') {
            noClassOrAppleSpan = !$container.attr('class') ||
                $container.attr('class').toLowerCase() === 'apple-style-span';
            if (noClassOrAppleSpan &&
                $container.attr('style') === 'font-weight: normal;') {

                $container.contents().unwrap();
            }
        }
    }

    return true;
};

//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassWebKit.prototype.keydown = function (e) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title];

    if (e.ctrlKey) {
        if (e.which === WYMeditor.KEY.B) {
            //CTRL+b => STRONG
            wym._exec(WYMeditor.BOLD);
            e.preventDefault();
        }
        if (e.which === WYMeditor.KEY.I) {
            //CTRL+i => EMPHASIS
            wym._exec(WYMeditor.ITALIC);
            e.preventDefault();
        }
    } else if (e.shiftKey && e.which === WYMeditor.KEY.ENTER) {
        // Safari 4 and earlier would show a proper linebreak in the editor and
        // then strip it upon save with the default action in the case of
        // inserting a new line after bold text
        wym._exec('InsertLineBreak');
        e.preventDefault();
    }
};

// Keyup handler, mainly used for cleanups
WYMeditor.WymClassWebKit.prototype.keyup = function (evt) {
    //'this' is the doc
    var wym = WYMeditor.INSTANCES[this.title],
        container,
        defaultRootContainer,
        notValidRootContainers,
        name,
        parentName;

    notValidRootContainers =
        wym.documentStructureManager.structureRules.notValidRootContainers;
    defaultRootContainer =
        wym.documentStructureManager.structureRules.defaultRootContainer;
    wym._selectedImage = null;

    // Fix to allow shift + return to insert a line break in older safari
    if (jQuery.browser.version < 534.1) {
        // Not needed in AT MAX chrome 6.0. Probably safe earlier
        if (evt.which === WYMeditor.KEY.ENTER && evt.shiftKey) {
            wym._exec('InsertLineBreak');
        }
    }

    // If the inputted key cannont create a block element and is not a command,
    // check to make sure the selection is properly wrapped in a container
    if (!wym.keyCanCreateBlockElement(evt.which) &&
            evt.which !== WYMeditor.KEY.CTRL &&
            evt.which !== WYMeditor.KEY.COMMAND &&
            !evt.metaKey &&
            !evt.ctrlKey) {

        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }

        // Fix forbidden main containers
        if (wym.isForbiddenMainContainer(name)) {
            name = parentName;
        }

        // Replace text nodes with default root tags and make sure the
        // container is valid if it is a root container
        if (name === WYMeditor.BODY ||
                (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY)) {

            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
            wym.fixBodyHtml();
        }
    }

    // If we potentially created a new block level element or moved to a new
    // one, then we should ensure the container is valid and the formatting is
    // proper.
    if (wym.keyCanCreateBlockElement(evt.which)) {
        // If the selected container is a root container, make sure it is not a
        // different possible default root container than the chosen one.
        container = wym.selectedContainer();
        name = container.tagName.toLowerCase();
        if (container.parentNode) {
            parentName = container.parentNode.tagName.toLowerCase();
        }
        if (jQuery.inArray(name, notValidRootContainers) > -1 &&
                parentName === WYMeditor.BODY) {
            wym._exec(WYMeditor.FORMAT_BLOCK, defaultRootContainer);
        }

        // Call for the check for--and possible correction of--issue #430.
        wym.handlePotentialEnterInEmptyNestedLi(evt.which, container);

        // Fix formatting if necessary
        wym.fixBodyHtml();
    }
};

// GLOBALS
WYMeditor.LEXER_ENTER = 1;
WYMeditor.LEXER_MATCHED = 2;
WYMeditor.LEXER_UNMATCHED = 3;
WYMeditor.LEXER_EXIT = 4;
WYMeditor.LEXER_SPECIAL = 5;


/**
*    Accepts text and breaks it into tokens.
*    Some optimisation to make the sure the
*    content is only scanned by the PHP regex
*    parser once. Lexer modes must not start
*    with leading underscores.
*
*    Sets up the lexer in case insensitive matching
*    by default.
*    @param Parser parser  Handling strategy by reference.
*    @param string start            Starting handler.
*    @param boolean case            True for case sensitive.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.Lexer = function(parser, start, case_sensitive)
{
    start = start || 'accept';
    this._case = case_sensitive || false;
    this._regexes = {};
    this._parser = parser;
    this._mode = new WYMeditor.StateStack(start);
    this._mode_handlers = {};
    this._mode_handlers[start] = start;
    return this;
};

/**
*    Adds a token search pattern for a particular
*    parsing mode. The pattern does not change the
*    current mode.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @access public
*/
WYMeditor.Lexer.prototype.addPattern = function(pattern, mode)
{
    mode = mode || "accept";
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern);
    if (typeof this._mode_handlers[mode] == 'undefined') {
        this._mode_handlers[mode] = mode;
    }
};

/**
*    Adds a pattern that will enter a new parsing
*    mode. Useful for entering parenthesis, strings,
*    tags, etc.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @param string new_mode     Change parsing to this new
*                                nested mode.
*    @access public
*/
WYMeditor.Lexer.prototype.addEntryPattern = function(pattern, mode, new_mode)
{
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern, new_mode);
    if (typeof this._mode_handlers[new_mode] == 'undefined') {
        this._mode_handlers[new_mode] = new_mode;
    }
};

/**
*    Adds a pattern that will exit the current mode
*    and re-enter the previous one.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Mode to leave.
*    @access public
*/
WYMeditor.Lexer.prototype.addExitPattern = function(pattern, mode)
{
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern, "__exit");
    if (typeof this._mode_handlers[mode] == 'undefined') {
        this._mode_handlers[mode] = mode;
    }
};

/**
*    Adds a pattern that has a special mode. Acts as an entry
*    and exit pattern in one go, effectively calling a special
*    parser handler for this token only.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @param string special      Use this mode for this one token.
*    @access public
*/
WYMeditor.Lexer.prototype.addSpecialPattern =  function(pattern, mode, special)
{
    if (typeof this._regexes[mode] == 'undefined') {
        this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
    }
    this._regexes[mode].addPattern(pattern, '_'+special);
    if (typeof this._mode_handlers[special] == 'undefined') {
        this._mode_handlers[special] = special;
    }
};

/**
*    Adds a mapping from a mode to another handler.
*    @param string mode        Mode to be remapped.
*    @param string handler     New target handler.
*    @access public
*/
WYMeditor.Lexer.prototype.mapHandler = function(mode, handler)
{
    this._mode_handlers[mode] = handler;
};

/**
*    Splits the page text into tokens. Will fail
*    if the handlers report an error or if no
*    content is consumed. If successful then each
*    unparsed and parsed token invokes a call to the
*    held listener.
*    @param string raw        Raw HTML text.
*    @return boolean           True on success, else false.
*    @access public
*/
WYMeditor.Lexer.prototype.parse = function(raw) {
    if (typeof this._parser == 'undefined') {
        return false;
    }

    var length = raw.length;
    var parsed;
    while (typeof (parsed = this._reduce(raw)) == 'object') {
        raw = parsed[0];
        var unmatched = parsed[1];
        var matched = parsed[2];
        var mode = parsed[3];

        if (! this._dispatchTokens(unmatched, matched, mode)) {
            return false;
        }

        if (raw === '') {
            return true;
        }
        if (raw.length == length) {
            return false;
        }
        length = raw.length;
    }
    if (! parsed ) {
        return false;
    }

    return this._invokeParser(raw, WYMeditor.LEXER_UNMATCHED);
};

/**
*    Sends the matched token and any leading unmatched
*    text to the parser changing the lexer to a new
*    mode if one is listed.
*    @param string unmatched    Unmatched leading portion.
*    @param string matched      Actual token match.
*    @param string mode         Mode after match. A boolean
*                                false mode causes no change.
*    @return boolean             False if there was any error
*                                from the parser.
*    @access private
*/
WYMeditor.Lexer.prototype._dispatchTokens = function(unmatched, matched, mode) {
    mode = mode || false;

    if (! this._invokeParser(unmatched, WYMeditor.LEXER_UNMATCHED)) {
        return false;
    }

    if (typeof mode == 'boolean') {
        return this._invokeParser(matched, WYMeditor.LEXER_MATCHED);
    }
    if (this._isModeEnd(mode)) {
        if (! this._invokeParser(matched, WYMeditor.LEXER_EXIT)) {
            return false;
        }
        return this._mode.leave();
    }
    if (this._isSpecialMode(mode)) {
        this._mode.enter(this._decodeSpecial(mode));
        if (! this._invokeParser(matched, WYMeditor.LEXER_SPECIAL)) {
            return false;
        }
        return this._mode.leave();
    }
    this._mode.enter(mode);

    return this._invokeParser(matched, WYMeditor.LEXER_ENTER);
};

/**
*    Tests to see if the new mode is actually to leave
*    the current mode and pop an item from the matching
*    mode stack.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
WYMeditor.Lexer.prototype._isModeEnd = function(mode) {
    return (mode === "__exit");
};

/**
*    Test to see if the mode is one where this mode
*    is entered for this token only and automatically
*    leaves immediately afterwoods.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
WYMeditor.Lexer.prototype._isSpecialMode = function(mode) {
    return (mode.substring(0,1) == "_");
};

/**
*    Strips the magic underscore marking single token
*    modes.
*    @param string mode    Mode to decode.
*    @return string         Underlying mode name.
*    @access private
*/
WYMeditor.Lexer.prototype._decodeSpecial = function(mode) {
    return mode.substring(1);
};

/**
*    Calls the parser method named after the current
*    mode. Empty content will be ignored. The lexer
*    has a parser handler for each mode in the lexer.
*    @param string content        Text parsed.
*    @param boolean is_match      Token is recognised rather
*                                  than unparsed data.
*    @access private
*/
WYMeditor.Lexer.prototype._invokeParser = function(content, is_match) {
    if (content === '') {
        return true;
    }
    var current = this._mode.getCurrent();
    var handler = this._mode_handlers[current];
    var result = this._parser[handler](content, is_match);
    return result;
};

/**
*    Tries to match a chunk of text and if successful
*    removes the recognised chunk and any leading
*    unparsed data. Empty strings will not be matched.
*    @param string raw         The subject to parse. This is the
*                               content that will be eaten.
*    @return array/boolean      Three item list of unparsed
*                               content followed by the
*                               recognised token and finally the
*                               action the parser is to take.
*                               True if no match, false if there
*                               is a parsing error.
*    @access private
*/
WYMeditor.Lexer.prototype._reduce = function(raw) {
    var matched = this._regexes[this._mode.getCurrent()].match(raw);
    var match = matched[1];
    var action = matched[0];
    if (action) {
        var unparsed_character_count = raw.indexOf(match);
        var unparsed = raw.substr(0, unparsed_character_count);
        raw = raw.substring(unparsed_character_count + match.length);
        return [raw, unparsed, match, action];
    }
    return true;
};


/**
*    Compounded regular expression. Any of
*    the contained patterns could match and
*    when one does, it's label is returned.
*
*    Constructor. Starts with no patterns.
*    @param boolean case    True for case sensitive, false
*                            for insensitive.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.ParallelRegex = function(case_sensitive)
{
    this._case = case_sensitive;
    this._patterns = [];
    this._labels = [];
    this._regex = null;
    return this;
};


/**
*    Adds a pattern with an optional label.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string label        Label of regex to be returned
*                                on a match.
*    @access public
*/
WYMeditor.ParallelRegex.prototype.addPattern = function(pattern, label)
{
    label = label || true;
    var count = this._patterns.length;
    this._patterns[count] = pattern;
    this._labels[count] = label;
    this._regex = null;
};

/**
*    Attempts to match all patterns at once against
*    a string.
*    @param string subject      String to match against.
*
*    @return boolean             True on success.
*    @return string match         First matched portion of
*                                subject.
*    @access public
*/
WYMeditor.ParallelRegex.prototype.match = function(subject)
{
    if (this._patterns.length === 0) {
        return [false, ''];
    }
    var matches = subject.match(this._getCompoundedRegex());

    if(!matches){
        return [false, ''];
    }
    var match = matches[0];
    for (var i = 1; i < matches.length; i++) {
        if (matches[i]) {
            return [this._labels[i-1], match];
        }
    }
    return [true, matches[0]];
};

/**
*    Compounds the patterns into a single
*    regular expression separated with the
*    "or" operator. Caches the regex.
*    Will automatically escape (, ) and / tokens.
*    @param array patterns    List of patterns in order.
*    @access private
*/
WYMeditor.ParallelRegex.prototype._getCompoundedRegex = function()
{
    if (this._regex === null) {
        for (var i = 0, count = this._patterns.length; i < count; i++) {
            this._patterns[i] = '(' + this._untokenizeRegex(this._tokenizeRegex(this._patterns[i]).replace(/([\/\(\)])/g,'\\$1')) + ')';
        }
        this._regex = new RegExp(this._patterns.join("|") ,this._getPerlMatchingFlags());
    }
    return this._regex;
};

/**
* Escape lookahead/lookbehind blocks
*/
WYMeditor.ParallelRegex.prototype._tokenizeRegex = function(regex)
{
    return regex.
    replace(/\(\?(i|m|s|x|U)\)/,     '~~~~~~Tk1\$1~~~~~~').
    replace(/\(\?(\-[i|m|s|x|U])\)/, '~~~~~~Tk2\$1~~~~~~').
    replace(/\(\?\=(.*)\)/,          '~~~~~~Tk3\$1~~~~~~').
    replace(/\(\?\!(.*)\)/,          '~~~~~~Tk4\$1~~~~~~').
    replace(/\(\?\<\=(.*)\)/,        '~~~~~~Tk5\$1~~~~~~').
    replace(/\(\?\<\!(.*)\)/,        '~~~~~~Tk6\$1~~~~~~').
    replace(/\(\?\:(.*)\)/,          '~~~~~~Tk7\$1~~~~~~');
};

/**
* Unscape lookahead/lookbehind blocks
*/
WYMeditor.ParallelRegex.prototype._untokenizeRegex = function(regex)
{
    return regex.
    replace(/~~~~~~Tk1(.{1})~~~~~~/,    "(?\$1)").
    replace(/~~~~~~Tk2(.{2})~~~~~~/,    "(?\$1)").
    replace(/~~~~~~Tk3(.*)~~~~~~/,      "(?=\$1)").
    replace(/~~~~~~Tk4(.*)~~~~~~/,      "(?!\$1)").
    replace(/~~~~~~Tk5(.*)~~~~~~/,      "(?<=\$1)").
    replace(/~~~~~~Tk6(.*)~~~~~~/,      "(?<!\$1)").
    replace(/~~~~~~Tk7(.*)~~~~~~/,      "(?:\$1)");
};


/**
*    Accessor for perl regex mode flags to use.
*    @return string       Perl regex flags.
*    @access private
*/
WYMeditor.ParallelRegex.prototype._getPerlMatchingFlags = function()
{
    return (this._case ? "m" : "mi");
};


/**
*    States for a stack machine.
*
*    Constructor. Starts in named state.
*    @param string start        Starting state name.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.StateStack = function(start)
{
    this._stack = [start];
    return this;
};

/**
*    Accessor for current state.
*    @return string       State.
*    @access public
*/
WYMeditor.StateStack.prototype.getCurrent = function()
{
    return this._stack[this._stack.length - 1];
};

/**
*    Adds a state to the stack and sets it
*    to be the current state.
*    @param string state        New state.
*    @access public
*/
WYMeditor.StateStack.prototype.enter = function(state)
{
    this._stack.push(state);
};

/**
*    Leaves the current state and reverts
*    to the previous one.
*    @return boolean    False if we drop off
*                       the bottom of the list.
*    @access public
*/
WYMeditor.StateStack.prototype.leave = function()
{
    if (this._stack.length == 1) {
        return false;
    }
    this._stack.pop();
    return true;
};


/**
* This are the rules for breaking the XHTML code into events
* handled by the provided parser.
*
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlLexer = function(parser) {
    jQuery.extend(this, new WYMeditor.Lexer(parser, 'Text'));

    this.mapHandler('Text', 'Text');

    this.addTokens();

    this.init();

    return this;
};


WYMeditor.XhtmlLexer.prototype.init = function() {
};

WYMeditor.XhtmlLexer.prototype.addTokens = function() {
    this.addCommentTokens('Text');
    this.addScriptTokens('Text');
    this.addCssTokens('Text');
    this.addTagTokens('Text');
};

WYMeditor.XhtmlLexer.prototype.addCommentTokens = function(scope) {
    this.addEntryPattern("<!--", scope, 'Comment');
    this.addExitPattern("-->", 'Comment');
};

WYMeditor.XhtmlLexer.prototype.addScriptTokens = function(scope) {
    this.addEntryPattern("<script", scope, 'Script');
    this.addExitPattern("</script>", 'Script');
};

WYMeditor.XhtmlLexer.prototype.addCssTokens = function(scope) {
    this.addEntryPattern("<style", scope, 'Css');
    this.addExitPattern("</style>", 'Css');
};

WYMeditor.XhtmlLexer.prototype.addTagTokens = function(scope) {
    this.addSpecialPattern("<\\s*[a-z0-9:\-]+\\s*/>", scope, 'SelfClosingTag');
    this.addSpecialPattern("<\\s*[a-z0-9:\-]+\\s*>", scope, 'OpeningTag');
    this.addEntryPattern("<[a-z0-9:\-]+"+'[\\\/ \\\>]+', scope, 'OpeningTag');
    this.addInTagDeclarationTokens('OpeningTag');

    this.addSpecialPattern("</\\s*[a-z0-9:\-]+\\s*>", scope, 'ClosingTag');

};

WYMeditor.XhtmlLexer.prototype.addInTagDeclarationTokens = function(scope) {
    this.addSpecialPattern('\\s+', scope, 'Ignore');

    this.addAttributeTokens(scope);

    this.addExitPattern('/>', scope);
    this.addExitPattern('>', scope);

};

WYMeditor.XhtmlLexer.prototype.addAttributeTokens = function(scope) {
    this.addSpecialPattern("\\s*[a-z-_0-9]*:?[a-z-_0-9]+\\s*(?=\=)\\s*", scope, 'TagAttributes');

    this.addEntryPattern('=\\s*"', scope, 'DoubleQuotedAttribute');
    this.addPattern("\\\\\"", 'DoubleQuotedAttribute');
    this.addExitPattern('"', 'DoubleQuotedAttribute');

    this.addEntryPattern("=\\s*'", scope, 'SingleQuotedAttribute');
    this.addPattern("\\\\'", 'SingleQuotedAttribute');
    this.addExitPattern("'", 'SingleQuotedAttribute');

    this.addSpecialPattern('=\\s*[^>\\s]*', scope, 'UnquotedAttribute');
};


/**
* XHTML Parser.
*
* This XHTML parser will trigger the events available on on
* current SaxListener
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlParser = function(Listener, mode) {
    mode = mode || 'Text';
    this._Lexer = new WYMeditor.XhtmlLexer(this);
    this._Listener = Listener;
    this._mode = mode;
    this._matches = [];
    this._last_match = '';
    this._current_match = '';

    return this;
};

WYMeditor.XhtmlParser.prototype.parse = function(raw) {
    this._Lexer.parse(this.beforeParsing(raw));
    return this.afterParsing(this._Listener.getResult());
};

WYMeditor.XhtmlParser.prototype.beforeParsing = function(raw) {
    if (raw.match(/class="MsoNormal"/) || raw.match(/ns = "urn:schemas-microsoft-com/)) {
        // Useful for cleaning up content pasted from other sources (MSWord)
        this._Listener.avoidStylingTagsAndAttributes();
    }

    return this._Listener.beforeParsing(raw);
};

WYMeditor.XhtmlParser.prototype.afterParsing = function(parsed) {
    if (this._Listener._avoiding_tags_implicitly) {
        this._Listener.allowStylingTagsAndAttributes();
    }
    return this._Listener.afterParsing(parsed);
};


WYMeditor.XhtmlParser.prototype.Ignore = function(match, state) {
    return true;
};

WYMeditor.XhtmlParser.prototype.Text = function(text) {
    this._Listener.addContent(text);
    return true;
};

WYMeditor.XhtmlParser.prototype.Comment = function(match, status) {
    return this._addNonTagBlock(match, status, 'addComment');
};

WYMeditor.XhtmlParser.prototype.Script = function(match, status) {
    return this._addNonTagBlock(match, status, 'addScript');
};

WYMeditor.XhtmlParser.prototype.Css = function(match, status) {
    return this._addNonTagBlock(match, status, 'addCss');
};

WYMeditor.XhtmlParser.prototype._addNonTagBlock = function(match, state, type) {
    switch (state) {
        case WYMeditor.LEXER_ENTER:
            this._non_tag = match;
            break;
        case WYMeditor.LEXER_UNMATCHED:
            this._non_tag += match;
            break;
        case WYMeditor.LEXER_EXIT:
            switch(type) {
                case 'addComment':
                    this._Listener.addComment(this._non_tag+match);
                    break;
                case 'addScript':
                    this._Listener.addScript(this._non_tag+match);
                    break;
                case 'addCss':
                    this._Listener.addCss(this._non_tag+match);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.SelfClosingTag = function(match, state) {
    var result = this.OpeningTag(match, state);
    var tag = this.normalizeTag(match);
    return this.ClosingTag(match, state);
};

WYMeditor.XhtmlParser.prototype.OpeningTag = function(match, state) {
    switch (state){
        case WYMeditor.LEXER_ENTER:
            this._tag = this.normalizeTag(match);
            this._tag_attributes = {};
            break;
        case WYMeditor.LEXER_SPECIAL:
            this._callOpenTagListener(this.normalizeTag(match));
            break;
        case WYMeditor.LEXER_EXIT:
            this._callOpenTagListener(this._tag, this._tag_attributes);
            break;
        default:
            break;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.ClosingTag = function(match, state) {
    this._callCloseTagListener(this.normalizeTag(match));
    return true;
};

WYMeditor.XhtmlParser.prototype._callOpenTagListener = function(tag, attributes) {
    attributes = attributes || {};
    this.autoCloseUnclosedBeforeNewOpening(tag);

    if (this._Listener.isBlockTag(tag)) {
        this._Listener._tag_stack.push(tag);
        this._Listener.fixNestingBeforeOpeningBlockTag(tag, attributes);
        this._Listener.openBlockTag(tag, attributes);
        this._increaseOpenTagCounter(tag);
    } else if (this._Listener.isInlineTag(tag)) {
        this._Listener.inlineTag(tag, attributes);
    } else {
        this._Listener.openUnknownTag(tag, attributes);
        this._increaseOpenTagCounter(tag);
    }
    this._Listener.last_tag = tag;
    this._Listener.last_tag_opened = true;
    this._Listener.last_tag_attributes = attributes;
};

WYMeditor.XhtmlParser.prototype._callCloseTagListener = function(tag) {
    if (this._decreaseOpenTagCounter(tag)) {
        this.autoCloseUnclosedBeforeTagClosing(tag);

        if (this._Listener.isBlockTag(tag)) {
            var expected_tag = this._Listener._tag_stack.pop();
            if (expected_tag === false) {
                return;
            } else if (expected_tag !== tag) {
                // If we are expecting extra block closing tags, put the
                // expected tag back on the tag stack.
                if (this._Listener._extraBlockClosingTags) {
                    this._Listener._tag_stack.push(expected_tag);
                    this._Listener.removedExtraBlockClosingTag();
                    return;
                }

                tag = expected_tag;
            }
            this._Listener.closeBlockTag(tag);
        }
    } else {
        if(!this._Listener.isInlineTag(tag)) {
            this._Listener.closeUnopenedTag(tag);
        }
    }

    this._Listener.last_tag = tag;
    this._Listener.last_tag_opened = false;
};

WYMeditor.XhtmlParser.prototype._increaseOpenTagCounter = function(tag) {
    this._Listener._open_tags[tag] = this._Listener._open_tags[tag] || 0;
    this._Listener._open_tags[tag]++;
};

WYMeditor.XhtmlParser.prototype._decreaseOpenTagCounter = function(tag) {
    if (this._Listener._open_tags[tag]) {
        this._Listener._open_tags[tag]--;
        if (this._Listener._open_tags[tag] === 0) {
            this._Listener._open_tags[tag] = undefined;
        }
        return true;
    }
    return false;
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeNewOpening = function(new_tag) {
    this._autoCloseUnclosed(new_tag, false);
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeTagClosing = function(tag) {
    this._autoCloseUnclosed(tag, true);
};

WYMeditor.XhtmlParser.prototype._autoCloseUnclosed = function(new_tag, closing) {
    closing = closing || false;
    if (this._Listener._open_tags) {
        for (var tag in this._Listener._open_tags) {
            var counter = this._Listener._open_tags[tag];
            if (counter > 0 && this._Listener.shouldCloseTagAutomatically(tag, new_tag, closing)) {
                this._callCloseTagListener(tag, true);
            }
        }
    }
};

WYMeditor.XhtmlParser.prototype.getTagReplacements = function() {
    return this._Listener.getTagReplacements();
};

WYMeditor.XhtmlParser.prototype.normalizeTag = function(tag) {
    tag = tag.replace(/^([\s<\/>]*)|([\s<\/>]*)$/gm,'').toLowerCase();
    var tags = this._Listener.getTagReplacements();
    if (tags[tag]) {
        return tags[tag];
    }
    return tag;
};

WYMeditor.XhtmlParser.prototype.TagAttributes = function(match, state) {
    if (WYMeditor.LEXER_SPECIAL == state) {
        this._current_attribute = match;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.DoubleQuotedAttribute = function(match, state) {
    if (WYMeditor.LEXER_UNMATCHED == state) {
        this._tag_attributes[this._current_attribute] = match;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.SingleQuotedAttribute = function(match, state) {
    if (WYMeditor.LEXER_UNMATCHED == state) {
        this._tag_attributes[this._current_attribute] = match;
    }
    return true;
};

WYMeditor.XhtmlParser.prototype.UnquotedAttribute = function(match, state) {
    this._tag_attributes[this._current_attribute] = match.replace(/^=/,'');
    return true;
};


/**
* XHTML Sax parser.
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlSaxListener = function() {
    this.output = '';
    this.helper = new WYMeditor.XmlHelper();
    this._open_tags = {};
    this.validator = WYMeditor.XhtmlValidator;
    this._tag_stack = [];
    this.avoided_tags = [];
    this._insert_before_closing = [];
    this._insert_after_closing = [];
    this._last_node_was_text = false;

    // A string of the tag name of the last open tag added to the output.
    this._lastAddedOpenTag = '';

    // A boolean that should be set to true when the parser is within a list
    // item and that should be set to false when the parser is no longer
    // withing a list item.
    this._insideLI = false;

    // An array of tags that should have their contents unwrapped if the tag is
    // within a list item.
    this.tagsToUnwrapInLists =
        WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;

    // If any of these inline tags is found in the root, just remove them.
    this._rootInlineTagsToRemove = ['br'];

    // A counter to keep track of the number of extra block closing tags that
    // should be expected by the parser because of the removal of that
    // element's opening tag.
    this._extraBlockClosingTags = 0;

    this._insideTagToRemove = false;
    // A boolean that indicates if a spacer line break should be added before
    // the next element in a list item to preserve spacing because of the
    // unwrapping of a block tag before the element.
    this._addSpacerBeforeElementInLI = false;

    // This flag is set to true if the parser is currently inside a tag flagged
    // for removal. Nothing will be added to the output while this flag is set
    // to true.
    this._insideTagToRemove = false;

    // If the last tag was not added to the output, this flag is set to true.
    // This is needed because if we are trying to fix an invalid tag by nesting
    // it in the last outputted tag as in the case of some invalid lists, if
    // the last tag was removed, the invalid tag should just be removed as well
    // instead of trying to fix it by nesting it in a tag that was already
    // removed from the output.
    this._lastTagRemoved = false;

    // When correcting invalid list nesting, situations can occur that will
    // result in an extra closing LI tags coming up later in the parser. When
    // one of these situations occurs, this counter is incremented so that it
    // can be referenced to find how many extra LI closing tags to expect. This
    // counter should be decremented everytime one of these extra LI closing
    // tags is removed.
    this._extraLIClosingTags = 0;

    // This is for storage of a tag's index in the tag stack so that the
    // Listener can use it to check for when the tag has been closed (i.e. when
    // the top of the tag stack is at the stored index again).
    this._removedTagStackIndex = 0;

    this.entities = {
        '&nbsp;':'&#160;','&iexcl;':'&#161;','&cent;':'&#162;',
        '&pound;':'&#163;','&curren;':'&#164;','&yen;':'&#165;',
        '&brvbar;':'&#166;','&sect;':'&#167;','&uml;':'&#168;',
        '&copy;':'&#169;','&ordf;':'&#170;','&laquo;':'&#171;',
        '&not;':'&#172;','&shy;':'&#173;','&reg;':'&#174;',
        '&macr;':'&#175;','&deg;':'&#176;','&plusmn;':'&#177;',
        '&sup2;':'&#178;','&sup3;':'&#179;','&acute;':'&#180;',
        '&micro;':'&#181;','&para;':'&#182;','&middot;':'&#183;',
        '&cedil;':'&#184;','&sup1;':'&#185;','&ordm;':'&#186;',
        '&raquo;':'&#187;','&frac14;':'&#188;','&frac12;':'&#189;',
        '&frac34;':'&#190;','&iquest;':'&#191;','&Agrave;':'&#192;',
        '&Aacute;':'&#193;','&Acirc;':'&#194;','&Atilde;':'&#195;',
        '&Auml;':'&#196;','&Aring;':'&#197;','&AElig;':'&#198;',
        '&Ccedil;':'&#199;','&Egrave;':'&#200;','&Eacute;':'&#201;',
        '&Ecirc;':'&#202;','&Euml;':'&#203;','&Igrave;':'&#204;',
        '&Iacute;':'&#205;','&Icirc;':'&#206;','&Iuml;':'&#207;',
        '&ETH;':'&#208;','&Ntilde;':'&#209;','&Ograve;':'&#210;',
        '&Oacute;':'&#211;','&Ocirc;':'&#212;','&Otilde;':'&#213;',
        '&Ouml;':'&#214;','&times;':'&#215;','&Oslash;':'&#216;',
        '&Ugrave;':'&#217;','&Uacute;':'&#218;','&Ucirc;':'&#219;',
        '&Uuml;':'&#220;','&Yacute;':'&#221;','&THORN;':'&#222;',
        '&szlig;':'&#223;','&agrave;':'&#224;','&aacute;':'&#225;',
        '&acirc;':'&#226;','&atilde;':'&#227;','&auml;':'&#228;',
        '&aring;':'&#229;','&aelig;':'&#230;','&ccedil;':'&#231;',
        '&egrave;':'&#232;','&eacute;':'&#233;','&ecirc;':'&#234;',
        '&euml;':'&#235;','&igrave;':'&#236;','&iacute;':'&#237;',
        '&icirc;':'&#238;','&iuml;':'&#239;','&eth;':'&#240;',
        '&ntilde;':'&#241;','&ograve;':'&#242;','&oacute;':'&#243;',
        '&ocirc;':'&#244;','&otilde;':'&#245;','&ouml;':'&#246;',
        '&divide;':'&#247;','&oslash;':'&#248;','&ugrave;':'&#249;',
        '&uacute;':'&#250;','&ucirc;':'&#251;','&uuml;':'&#252;',
        '&yacute;':'&#253;','&thorn;':'&#254;','&yuml;':'&#255;',
        '&OElig;':'&#338;','&oelig;':'&#339;','&Scaron;':'&#352;',
        '&scaron;':'&#353;','&Yuml;':'&#376;','&fnof;':'&#402;',
        '&circ;':'&#710;','&tilde;':'&#732;','&Alpha;':'&#913;',
        '&Beta;':'&#914;','&Gamma;':'&#915;','&Delta;':'&#916;',
        '&Epsilon;':'&#917;','&Zeta;':'&#918;','&Eta;':'&#919;',
        '&Theta;':'&#920;','&Iota;':'&#921;','&Kappa;':'&#922;',
        '&Lambda;':'&#923;','&Mu;':'&#924;','&Nu;':'&#925;',
        '&Xi;':'&#926;','&Omicron;':'&#927;','&Pi;':'&#928;',
        '&Rho;':'&#929;','&Sigma;':'&#931;','&Tau;':'&#932;',
        '&Upsilon;':'&#933;','&Phi;':'&#934;','&Chi;':'&#935;',
        '&Psi;':'&#936;','&Omega;':'&#937;','&alpha;':'&#945;',
        '&beta;':'&#946;','&gamma;':'&#947;','&delta;':'&#948;',
        '&epsilon;':'&#949;','&zeta;':'&#950;','&eta;':'&#951;',
        '&theta;':'&#952;','&iota;':'&#953;','&kappa;':'&#954;',
        '&lambda;':'&#955;','&mu;':'&#956;','&nu;':'&#957;',
        '&xi;':'&#958;','&omicron;':'&#959;','&pi;':'&#960;',
        '&rho;':'&#961;','&sigmaf;':'&#962;','&sigma;':'&#963;',
        '&tau;':'&#964;','&upsilon;':'&#965;','&phi;':'&#966;',
        '&chi;':'&#967;','&psi;':'&#968;','&omega;':'&#969;',
        '&thetasym;':'&#977;','&upsih;':'&#978;','&piv;':'&#982;',
        '&ensp;':'&#8194;','&emsp;':'&#8195;','&thinsp;':'&#8201;',
        '&zwnj;':'&#8204;','&zwj;':'&#8205;','&lrm;':'&#8206;',
        '&rlm;':'&#8207;','&ndash;':'&#8211;','&mdash;':'&#8212;',
        '&lsquo;':'&#8216;','&rsquo;':'&#8217;','&sbquo;':'&#8218;',
        '&ldquo;':'&#8220;','&rdquo;':'&#8221;','&bdquo;':'&#8222;',
        '&dagger;':'&#8224;','&Dagger;':'&#8225;','&bull;':'&#8226;',
        '&hellip;':'&#8230;','&permil;':'&#8240;','&prime;':'&#8242;',
        '&Prime;':'&#8243;','&lsaquo;':'&#8249;','&rsaquo;':'&#8250;',
        '&oline;':'&#8254;','&frasl;':'&#8260;','&euro;':'&#8364;',
        '&image;':'&#8465;','&weierp;':'&#8472;','&real;':'&#8476;',
        '&trade;':'&#8482;','&alefsym;':'&#8501;','&larr;':'&#8592;',
        '&uarr;':'&#8593;','&rarr;':'&#8594;','&darr;':'&#8595;',
        '&harr;':'&#8596;','&crarr;':'&#8629;','&lArr;':'&#8656;',
        '&uArr;':'&#8657;','&rArr;':'&#8658;','&dArr;':'&#8659;',
        '&hArr;':'&#8660;','&forall;':'&#8704;','&part;':'&#8706;',
        '&exist;':'&#8707;','&empty;':'&#8709;','&nabla;':'&#8711;',
        '&isin;':'&#8712;','&notin;':'&#8713;','&ni;':'&#8715;',
        '&prod;':'&#8719;','&sum;':'&#8721;','&minus;':'&#8722;',
        '&lowast;':'&#8727;','&radic;':'&#8730;','&prop;':'&#8733;',
        '&infin;':'&#8734;','&ang;':'&#8736;','&and;':'&#8743;',
        '&or;':'&#8744;','&cap;':'&#8745;','&cup;':'&#8746;',
        '&int;':'&#8747;','&there4;':'&#8756;','&sim;':'&#8764;',
        '&cong;':'&#8773;','&asymp;':'&#8776;','&ne;':'&#8800;',
        '&equiv;':'&#8801;','&le;':'&#8804;','&ge;':'&#8805;',
        '&sub;':'&#8834;','&sup;':'&#8835;','&nsub;':'&#8836;',
        '&sube;':'&#8838;','&supe;':'&#8839;','&oplus;':'&#8853;',
        '&otimes;':'&#8855;','&perp;':'&#8869;','&sdot;':'&#8901;',
        '&lceil;':'&#8968;','&rceil;':'&#8969;','&lfloor;':'&#8970;',
        '&rfloor;':'&#8971;','&lang;':'&#9001;','&rang;':'&#9002;',
        '&loz;':'&#9674;','&spades;':'&#9824;','&clubs;':'&#9827;',
        '&hearts;':'&#9829;','&diams;':'&#9830;'};

    this.block_tags = [
        "a", "abbr", "acronym", "address", "area", "b",
        "base", "bdo", "big", "blockquote", "body", "button",
        "caption", "cite", "code", "colgroup", "dd", "del", "div",
        "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2",
        "h3", "h4", "h5", "h6", "html", "i", "iframe", "ins",
        "kbd", "label", "legend", "li", "map", "noscript",
        "object", "ol", "optgroup", "option", "p", "param", "pre", "q",
        "samp", "script", "select", "small", "span", "strong", "style",
        "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
        "thead", "title", "tr", "tt", "ul", "var", "extends"];


    this.inline_tags = ["br", "col", "hr", "img", "input"];

    return this;
};

WYMeditor.XhtmlSaxListener.prototype.shouldCloseTagAutomatically = function(tag, now_on_tag, closing) {
    closing = closing || false;
    if (tag == 'td') {
        if ((closing && now_on_tag == 'tr') || (!closing && now_on_tag == 'td')) {
            return true;
        }
    } else if (tag == 'option') {
        if ((closing && now_on_tag == 'select') || (!closing && now_on_tag == 'option')) {
            return true;
        }
    }
    return false;
};

WYMeditor.XhtmlSaxListener.prototype.beforeParsing = function(raw) {
    this.output = '';

    // Reset attributes that might bleed over between parsing
    this._insert_before_closing = [];
    this._insert_after_closing = [];
    this._open_tags = {};
    this._tag_stack = [];
    this._last_node_was_text = false;
    this._lastTagRemoved = false;
    this._insideTagToRemove = false;
    this.last_tag = null;

    return raw;
};

WYMeditor.XhtmlSaxListener.prototype.afterParsing = function(xhtml) {
    xhtml = this.replaceNamedEntities(xhtml);
    xhtml = this.joinRepeatedEntities(xhtml);
    xhtml = this.removeEmptyTags(xhtml);
    xhtml = this.removeBrInPre(xhtml);

    return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.replaceNamedEntities = function(xhtml) {
    for (var entity in this.entities) {
        xhtml = xhtml.replace(new RegExp(entity, 'g'), this.entities[entity]);
    }
    return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.joinRepeatedEntities = function(xhtml) {
    var tags = 'em|strong|sub|sup|acronym|pre|del|address';
    return xhtml.replace(new RegExp('<\/('+tags+')><\\1>' ,''), '').
            replace(
                new RegExp('(\s*<('+tags+')>\s*){2}(.*)(\s*<\/\\2>\s*){2}' ,''),
                '<\$2>\$3<\$2>');
};

WYMeditor.XhtmlSaxListener.prototype.removeEmptyTags = function(xhtml) {
    return xhtml.replace(
            new RegExp(
                '<('+this.block_tags.join("|").
                    replace(/\|td/,'').
                    replace(/\|th/, '') +
                ')>(<br \/>|&#160;|&nbsp;|\\s)*<\/\\1>' ,'g'),
            '');
};

WYMeditor.XhtmlSaxListener.prototype.removeBrInPre = function(xhtml) {
    var matches = xhtml.match(new RegExp('<pre[^>]*>(.*?)<\/pre>','gmi'));
    if (matches) {
        for (var i=0; i<matches.length; i++) {
            xhtml = xhtml.replace(
                matches[i],
                matches[i].replace(new RegExp('<br \/>', 'g'), String.fromCharCode(13,10)));
        }
    }
    return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.getResult = function() {
    return this.output;
};

WYMeditor.XhtmlSaxListener.prototype.getTagReplacements = function() {
    return {'b':'strong', 'i':'em'};
};

WYMeditor.XhtmlSaxListener.prototype.getTagForStyle = function (style) {
    if (/sub/.test(style)) {
        return 'sub';
    } else if (/super/.test(style)) {
        return 'sup';
    } else if (/bold/.test(style)) {
        return 'strong';
    } else if (/italic/.test(style)) {
        return 'em';
    }

    return false;
};

WYMeditor.XhtmlSaxListener.prototype.addContent = function(text) {
    if (this.last_tag && this.last_tag == 'li') {
        // We should strip trailing newlines from text inside li tags because
        // IE adds random significant newlines inside nested lists
        text = text.replace(/(\r|\n|\r\n)+$/g, '');

        // Let's also normalize multiple newlines down to a single space
        text = text.replace(/(\r|\n|\r\n)+/g, ' ');
    }
    if (text.replace(/^\s+|\s+$/g, '').length > 0) {
        // Don't count it as text if it's empty
        this._last_node_was_text = true;
        if (this._addSpacerBeforeElementInLI) {
            this.output += '<br />';
            this._addSpacerBeforeElementInLI = false;
        }
    }
    if (!this._insideTagToRemove) {
        this.output += text;
    }
};

WYMeditor.XhtmlSaxListener.prototype.addComment = function(text) {
    if (this.remove_comments || this._insideTagToRemove) {
        return;
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addScript = function(text) {
    if (this.remove_scripts || this._insideTagToRemove) {
        return;
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addCss = function(text) {
    if (this.remove_embeded_styles || this._insideTagToRemove) {
        return;
    }
    this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.openBlockTag = function(tag, attributes) {
    var lastNodeWasText = this._last_node_was_text;
    this._last_node_was_text = false;

    if (this._insideTagToRemove) {
        // If we're currently in a block marked for removal, don't add it to
        // the output.
        return;
    }
    if (this._shouldRemoveTag(tag, attributes)) {
        // If this tag is marked for removal, set a flag signifying that
        // we're in a tag to remove and mark the position in the tag stack
        // of this tag so that we know when we've reached the end of it.
        this._insideTagToRemove = true;
        this._removedTagStackIndex = this._tag_stack.length - 1;
        return;
    }

    // If we're currently inside an LI and this tag is not allowed inside
    // an LI, unwrap the tag by not adding it to the output.
    if (this._insideLI && jQuery.inArray(tag, this.tagsToUnwrapInLists) > -1) {
        if (this._lastAddedOpenTag !== 'li' || lastNodeWasText) {
            // If there was content inside the LI before this unwrapped block,
            // insert a line break so that the content retains its spacing.
            this.output += '<br />';
            this._addSpacerBeforeElementInLI = false;
        }
        this._tag_stack.pop();
        this._extraBlockClosingTags++;
        return;
    }

    // Add a line break spacer before adding the open block tag if necessary
    // and if the tag is not a list element.
    if (this._addSpacerBeforeElementInLI &&
            tag !== 'li' &&
            jQuery.inArray(tag, WYMeditor.LIST_TYPE_ELEMENTS) === -1) {
        this.output += '<br />';
        this._addSpacerBeforeElementInLI = false;
    }

    attributes = this.validator.getValidTagAttributes(tag, attributes);
    attributes = this.removeUnwantedClasses(attributes);

    // Handle Mozilla and Safari styled spans
    if (tag === 'span' && attributes.style) {
        var new_tag = this.getTagForStyle(attributes.style);
        if (new_tag) {
            tag = new_tag;
            this._tag_stack.pop();
            this._tag_stack.push(tag);
            attributes.style = '';
        }
    }

    if (tag === 'li') {
        this._insideLI = true;
        this._addSpacerBeforeElementInLI = false;
    }

    this.output += this.helper.tag(tag, attributes, true);
    this._lastAddedOpenTag = tag;
    this._lastTagRemoved = false;
};

WYMeditor.XhtmlSaxListener.prototype.inlineTag = function(tag, attributes) {
    if (this._insideTagToRemove || this._shouldRemoveTag(tag, attributes)) {
        // If we're currently in a block marked for removal or if this tag is
        // marked for removal, don't add it to the output.
        return;
    }
    this._last_node_was_text = false;

    attributes = this.validator.getValidTagAttributes(tag, attributes);
    attributes = this.removeUnwantedClasses(attributes);
    this.output += this.helper.tag(tag, attributes);
    this._lastTagRemoved = false;
};

WYMeditor.XhtmlSaxListener.prototype.openUnknownTag = function(tag, attributes) {
    //this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.XhtmlSaxListener.prototype.closeBlockTag = function(tag) {
    this._last_node_was_text = false;
    if (this._insideTagToRemove) {
        if (this._tag_stack.length === this._removedTagStackIndex) {
            // If we've reached the index in the tag stack were the tag to be
            // removed started, we're no longer inside that tag and can turn
            // the insideTagToRemove flag off.
            this._insideTagToRemove = false;
        }
        this._lastTagRemoved = true;
        return;
    }

    if (tag === 'li') {
        this._insideLI = false;
        this._addSpacerBeforeElementInLI = false;
    }
    if (jQuery.inArray(tag, WYMeditor.LIST_TYPE_ELEMENTS) > -1) {
        this._insideLI = false;
    }

    this.output = this.output.replace(/<br \/>$/, '') +
        this._getClosingTagContent('before', tag) +
        "</"+tag+">" +
        this._getClosingTagContent('after', tag);
};

WYMeditor.XhtmlSaxListener.prototype.removedExtraBlockClosingTag = function () {
    this._extraBlockClosingTags--;
    this._addSpacerBeforeElementInLI = true;
    this._last_node_was_text = false;
};

WYMeditor.XhtmlSaxListener.prototype.closeUnknownTag = function(tag) {
    //this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.closeUnopenedTag = function(tag) {
    this._last_node_was_text = false;
    if (this._insideTagToRemove) {
        return;
    }

    if (tag === 'li' && this._extraLIClosingTags) {
        this._extraLIClosingTags--;
    } else {
        this.output += "</" + tag + ">";
    }
};

WYMeditor.XhtmlSaxListener.prototype.avoidStylingTagsAndAttributes = function() {
    this.avoided_tags = ['div','span'];
    this.validator.skiped_attributes = ['style'];
    this.validator.skiped_attribute_values = ['MsoNormal','main1']; // MS Word attributes for class
    this._avoiding_tags_implicitly = true;
};

WYMeditor.XhtmlSaxListener.prototype.allowStylingTagsAndAttributes = function() {
    this.avoided_tags = [];
    this.validator.skiped_attributes = [];
    this.validator.skiped_attribute_values = [];
    this._avoiding_tags_implicitly = false;
};

WYMeditor.XhtmlSaxListener.prototype.isBlockTag = function(tag) {
    return !WYMeditor.Helper.contains(this.avoided_tags, tag) &&
            WYMeditor.Helper.contains(this.block_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.isInlineTag = function(tag) {
    return !WYMeditor.Helper.contains(this.avoided_tags, tag) &&
            WYMeditor.Helper.contains(this.inline_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentAfterClosingTag = function(tag, content) {
    this._insertContentWhenClosingTag('after', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentBeforeClosingTag = function(tag, content) {
    this._insertContentWhenClosingTag('before', tag, content);
};

/*
    removeUnwantedClasses
    =====================

    Removes the unwanted classes specified in the
    WYMeditor.CLASSES_REMOVED_BY_PARSER constant from the passed attributes
    object and returns the attributes object after the removals. The passed
    attributes object should be in a format with attribute names as properties
    and those attributes' values as those properties' values. The class
    matching for removal is case insensitive.
*/
WYMeditor.XhtmlSaxListener.prototype.removeUnwantedClasses = function(attributes) {
    var pattern,
        i;

    if (!attributes["class"]) {
        return attributes;
    }

    for (i = 0; i < WYMeditor.CLASSES_REMOVED_BY_PARSER.length; ++i) {
        pattern = new RegExp('(^|\\s)' + WYMeditor.CLASSES_REMOVED_BY_PARSER[i] +
                             '($|\\s)', 'gi');
        attributes["class"] = attributes["class"].replace(pattern, '$1');
    }

    // Remove possible trailing space that could have been left over if the
    // last class was removed
    attributes["class"] = attributes["class"].replace(/\s$/, '');
    return attributes;
};

WYMeditor.XhtmlSaxListener.prototype.fixNestingBeforeOpeningBlockTag = function(tag, attributes) {
    if (!this._last_node_was_text && (tag == 'ul' || tag == 'ol') && this.last_tag &&
            !this.last_tag_opened && this.last_tag == 'li') {
        // We have a <li></li><ol>... situation. The new list should be a
        // child of the li tag. Not a sibling.

        if (this._lastTagRemoved) {
            // If the previous li tag was removed, the new list should be
            // removed with it.
            this._insideTagToRemove = true;
            this._removedTagStackIndex = this._tag_stack.length - 1;
        } else if (!this._shouldRemoveTag(tag, attributes)){
            // If this tag is not going to be removed, remove the last closing
            // li tag
            this.output = this.output.replace(/<\/li>\s*$/, '');
            this.insertContentAfterClosingTag(tag, '</li>');
        }
    } else if ((tag == 'ul' || tag == 'ol') && this.last_tag &&
            this.last_tag_opened && (this.last_tag == 'ul' || this.last_tag == 'ol')) {
        // We have a <ol|ul><ol|ul>... situation. The new list should be have
        // a li tag parent and shouldn't be directly nested.

        // If this tag is not going to be removed, add an opening li tag before
        // and after this tag
        if (!this._shouldRemoveTag(tag, attributes)) {
            this.output += this.helper.tag('li', {}, true);
            this.insertContentAfterClosingTag(tag, '</li>');
        }
        this._last_node_was_text = false;
    } else if (tag == 'li') {
        // Closest open tag that's not this tag
        if (this._tag_stack.length >= 2) {
            var closestOpenTag = this._tag_stack[this._tag_stack.length - 2];
            if (closestOpenTag == 'li' && !this._shouldRemoveTag(tag, attributes)){
                // Pop the tag off of the stack to indicate we closed it
                this._open_tags.li -= 1;
                if (this._open_tags.li === 0) {
                    this._open_tags.li = undefined;
                }
                this._tag_stack.splice(this._tag_stack.length - 2, 1);
                this._last_node_was_text = false;

                if (!this._insideTagToRemove) {
                    // If not inside a tag to remove, close the outer LI now
                    // before adding the LI that was nested within it to the
                    // output.
                    this.output += '</li>';
                } else if (this._tag_stack.length - 1 ===
                           this._removedTagStackIndex) {
                    // If the outer LI was the start of a block to be removed,
                    // reset the flag for removing a tag.
                    this._insideTagToRemove = false;
                    this._lastTagRemoved = true;
                    this._extraLIClosingTags++;
                }
            }
        }
        // Opening a new li tag while another li tag is still open.
        // LI tags aren't allowed to be nested within eachother
        // It probably means we forgot to close the last LI tag
        //return true;
    }
};

WYMeditor.XhtmlSaxListener.prototype._insertContentWhenClosingTag = function(position, tag, content) {
    if (!this['_insert_'+position+'_closing']) {
        this['_insert_'+position+'_closing'] = [];
    }
    if (!this['_insert_'+position+'_closing'][tag]) {
        this['_insert_'+position+'_closing'][tag] = [];
    }
    this['_insert_'+position+'_closing'][tag].push(content);
};

WYMeditor.XhtmlSaxListener.prototype._getClosingTagContent = function(position, tag) {
    if (this['_insert_'+position+'_closing'] &&
            this['_insert_'+position+'_closing'][tag] &&
            this['_insert_'+position+'_closing'][tag].length > 0) {
        return this['_insert_'+position+'_closing'][tag].pop();
    }
    return '';
};

/*
    _shouldRemoveTag
    ================

    Specifies if the passed tag with the passed attributes should be removed
    from the output or not, based on the current state.
*/
WYMeditor.XhtmlSaxListener.prototype._shouldRemoveTag = function(tag, attributes) {
    if (this._isEditorOnlyTag(tag, attributes)) {
        return true;
    }
    if (this._isRootInlineTagToRemove(tag, attributes, this._tag_stack)) {
        return true;
    }

    return false;
};

/*
    _isEditorOnlyTag
    ================

    Is the passed-in tag, as evaluated in the current state, a tag that should
    only exist in the editor, but not in the final output. Editor-only tags
    exist to aid with manipulation and browser-bug workarounds, but aren't
    actual content that should be kept in the authoritative HTML.
*/
WYMeditor.XhtmlSaxListener.prototype._isEditorOnlyTag = function(tag, attributes) {
    var classes;

    if (!attributes["class"]) {
        return false;
    }

    classes = attributes["class"].split(" ");
    if (WYMeditor.Helper.contains(classes, WYMeditor.EDITOR_ONLY_CLASS)) {
        return true;
    }
    return false;
};

/*
    Is this tag one of the tags that should be removed if found at the root.
*/
WYMeditor.XhtmlSaxListener.prototype._isRootInlineTagToRemove = function(
    tag, attributes, currentTagStack
) {
    if (!this.isInlineTag(tag)) {
        return false;
    }
    if (currentTagStack.length > 0) {
        // We're not at the root
        return false;
    }

    if (WYMeditor.Helper.contains(this._rootInlineTagsToRemove, tag)) {
        return true;
    }
    return false;
};

/**
* XhtmlValidator for validating tag attributes
*
* @author Bermi Ferrer - http://bermi.org
*/
WYMeditor.XhtmlValidator = {
    "_attributes":
    {
        "core":
        {
            "except":[
            "base",
            "head",
            "html",
            "meta",
            "param",
            "script",
            "style",
            "title"
            ],
            "attributes":[
            "class",
            "id",
            "style",
            "title",
            "accesskey",
            "tabindex",
            "/^data-.*/"
            ]
        },
        "language":
        {
            "except":[
            "base",
            "br",
            "hr",
            "iframe",
            "param",
            "script"
            ],
            "attributes":
            {
                "dir":[
                "ltr",
                "rtl"
                ],
                "0":"lang",
                "1":"xml:lang"
            }
        },
        "keyboard":
        {
            "attributes":
            {
                "accesskey":/^(\w){1}$/,
                "tabindex":/^(\d)+$/
            }
        }
    },
    "_events":
    {
        "window":
        {
            "only":[
            "body"
            ],
            "attributes":[
            "onload",
            "onunload"
            ]
        },
        "form":
        {
            "only":[
            "form",
            "input",
            "textarea",
            "select",
            "a",
            "label",
            "button"
            ],
            "attributes":[
            "onchange",
            "onsubmit",
            "onreset",
            "onselect",
            "onblur",
            "onfocus"
            ]
        },
        "keyboard":
        {
            "except":[
            "base",
            "bdo",
            "br",
            "frame",
            "frameset",
            "head",
            "html",
            "iframe",
            "meta",
            "param",
            "script",
            "style",
            "title"
            ],
            "attributes":[
            "onkeydown",
            "onkeypress",
            "onkeyup"
            ]
        },
        "mouse":
        {
            "except":[
            "base",
            "bdo",
            "br",
            "head",
            "html",
            "meta",
            "param",
            "script",
            "style",
            "title"
            ],
            "attributes":[
            "onclick",
            "ondblclick",
            "onmousedown",
            "onmousemove",
            "onmouseover",
            "onmouseout",
            "onmouseup"
            ]
        }
    },
    "_tags":
    {
        "a":
        {
            "attributes":
            {
                "0":"charset",
                "1":"coords",
                "2":"href",
                "3":"hreflang",
                "4":"name",
                "5":"rel",
                "6":"rev",
                "shape":/^(rect|rectangle|circ|circle|poly|polygon)$/,
                "7":"type"
            }
        },
        "0":"abbr",
        "1":"acronym",
        "2":"address",
        "area":
        {
            "attributes":
            {
                "0":"alt",
                "1":"coords",
                "2":"href",
                "nohref":/^(true|false)$/,
                "shape":/^(rect|rectangle|circ|circle|poly|polygon)$/
            },
            "required":[
            "alt"
            ]
        },
        "3":"b",
        "base":
        {
            "attributes":[
            "href"
            ],
            "required":[
            "href"
            ]
        },
        "bdo":
        {
            "attributes":
            {
                "dir":/^(ltr|rtl)$/
            },
            "required":[
            "dir"
            ]
        },
        "4":"big",
        "blockquote":
        {
            "attributes":[
            "cite"
            ]
        },
        "5":"body",
        "6":"br",
        "button":
        {
            "attributes":
            {
                "disabled":/^(disabled)$/,
                "type":/^(button|reset|submit)$/,
                "0":"value"
            },
            "inside":"form"
        },
        "7":"caption",
        "8":"cite",
        "9":"code",
        "col":
        {
            "attributes":
            {
                "align":/^(right|left|center|justify)$/,
                "0":"char",
                "1":"charoff",
                "span":/^(\d)+$/,
                "valign":/^(top|middle|bottom|baseline)$/,
                "2":"width"
            },
            "inside":"colgroup"
        },
        "colgroup":
        {
            "attributes":
            {
                "align":/^(right|left|center|justify)$/,
                "0":"char",
                "1":"charoff",
                "span":/^(\d)+$/,
                "valign":/^(top|middle|bottom|baseline)$/,
                "2":"width"
            }
        },
        "10":"dd",
        "del":
        {
            "attributes":
            {
                "0":"cite",
                "datetime":/^([0-9]){8}/
            }
        },
        "11":"div",
        "12":"dfn",
        "13":"dl",
        "14":"dt",
        "15":"em",
        "fieldset":
        {
            "inside":"form"
        },
        "form":
        {
            "attributes":
            {
                "0":"action",
                "1":"accept",
                "2":"accept-charset",
                "3":"enctype",
                "method":/^(get|post)$/
            },
            "required":[
            "action"
            ]
        },
        "head":
        {
            "attributes":[
            "profile"
            ]
        },
        "16":"h1",
        "17":"h2",
        "18":"h3",
        "19":"h4",
        "20":"h5",
        "21":"h6",
        "22":"hr",
        "html":
        {
            "attributes":[
            "xmlns"
            ]
        },
        "23":"i",
        "img":
        {
            "attributes":[
            "alt",
            "src",
            "height",
            "ismap",
            "longdesc",
            "usemap",
            "width"
            ],
            "required":[
            "alt",
            "src"
            ]
        },
        "input":
        {
            "attributes":
            {
                "0":"accept",
                "1":"alt",
                "checked":/^(checked)$/,
                "disabled":/^(disabled)$/,
                "maxlength":/^(\d)+$/,
                "2":"name",
                "readonly":/^(readonly)$/,
                "size":/^(\d)+$/,
                "3":"src",
                "type":/^(button|checkbox|file|hidden|image|password|radio|reset|submit|text)$/,
                "4":"value"
            },
            "inside":"form"
        },
        "ins":
        {
            "attributes":
            {
                "0":"cite",
                "datetime":/^([0-9]){8}/
            }
        },
        "24":"kbd",
        "label":
        {
            "attributes":[
            "for"
            ],
            "inside":"form"
        },
        "25":"legend",
        "26":"li",
        "link":
        {
            "attributes":
            {
                "0":"charset",
                "1":"href",
                "2":"hreflang",
                "media":/^(all|braille|print|projection|screen|speech|,|;| )+$/i,
                //next comment line required by Opera!
                /*"rel":/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,*/
                "rel":/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,
                "rev":/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,
                "3":"type"
            },
            "inside":"head"
        },
        "map":
        {
            "attributes":[
            "id",
            "name"
            ],
            "required":[
            "id"
            ]
        },
        "meta":
        {
            "attributes":
            {
                "0":"content",
                "http-equiv":/^(content\-type|expires|refresh|set\-cookie)$/i,
                "1":"name",
                "2":"scheme"
            },
            "required":[
            "content"
            ]
        },
        "27":"noscript",
        "object":
        {
            "attributes":[
            "archive",
            "classid",
            "codebase",
            "codetype",
            "data",
            "declare",
            "height",
            "name",
            "standby",
            "type",
            "usemap",
            "width"
            ]
        },
        "28":"ol",
        "optgroup":
        {
            "attributes":
            {
                "0":"label",
                "disabled": /^(disabled)$/
            },
            "required":[
            "label"
            ]
        },
        "option":
        {
            "attributes":
            {
                "0":"label",
                "disabled":/^(disabled)$/,
                "selected":/^(selected)$/,
                "1":"value"
            },
            "inside":"select"
        },
        "29":"p",
        "param":
        {
            "attributes":
            {
                "0":"type",
                "valuetype":/^(data|ref|object)$/,
                "1":"valuetype",
                "2":"value"
            },
            "required":[
            "name"
            ]
        },
        "30":"pre",
        "q":
        {
            "attributes":[
            "cite"
            ]
        },
        "31":"samp",
        "script":
        {
            "attributes":
            {
                "type":/^(text\/ecmascript|text\/javascript|text\/jscript|text\/vbscript|text\/vbs|text\/xml)$/,
                "0":"charset",
                "defer":/^(defer)$/,
                "1":"src"
            },
            "required":[
            "type"
            ]
        },
        "select":
        {
            "attributes":
            {
                "disabled":/^(disabled)$/,
                "multiple":/^(multiple)$/,
                "0":"name",
                "1":"size"
            },
            "inside":"form"
        },
        "32":"small",
        "33":"span",
        "34":"strong",
        "style":
        {
            "attributes":
            {
                "0":"type",
                "media":/^(screen|tty|tv|projection|handheld|print|braille|aural|all)$/
            },
            "required":[
            "type"
            ]
        },
        "35":"sub",
        "36":"sup",
        "table":
        {
            "attributes":
            {
                "0":"border",
                "1":"cellpadding",
                "2":"cellspacing",
                "frame":/^(void|above|below|hsides|lhs|rhs|vsides|box|border)$/,
                "rules":/^(none|groups|rows|cols|all)$/,
                "3":"summary",
                "4":"width"
            }
        },
        "tbody":
        {
            "attributes":
            {
                "align":/^(right|left|center|justify)$/,
                "0":"char",
                "1":"charoff",
                "valign":/^(top|middle|bottom|baseline)$/
            }
        },
        "td":
        {
            "attributes":
            {
                "0":"abbr",
                "align":/^(left|right|center|justify|char)$/,
                "1":"axis",
                "2":"char",
                "3":"charoff",
                "colspan":/^(\d)+$/,
                "4":"headers",
                "rowspan":/^(\d)+$/,
                "scope":/^(col|colgroup|row|rowgroup)$/,
                "valign":/^(top|middle|bottom|baseline)$/
            }
        },
        "textarea":
        {
            "attributes":[
            "cols",
            "rows",
            "disabled",
            "name",
            "readonly"
            ],
            "required":[
            "cols",
            "rows"
            ],
            "inside":"form"
        },
        "tfoot":
        {
            "attributes":
            {
                "align":/^(right|left|center|justify)$/,
                "0":"char",
                "1":"charoff",
                "valign":/^(top|middle|bottom)$/,
                "2":"baseline"
            }
        },
        "th":
        {
            "attributes":
            {
                "0":"abbr",
                "align":/^(left|right|center|justify|char)$/,
                "1":"axis",
                "2":"char",
                "3":"charoff",
                "colspan":/^(\d)+$/,
                "4":"headers",
                "rowspan":/^(\d)+$/,
                "scope":/^(col|colgroup|row|rowgroup)$/,
                "valign":/^(top|middle|bottom|baseline)$/
            }
        },
        "thead":
        {
            "attributes":
            {
                "align":/^(right|left|center|justify)$/,
                "0":"char",
                "1":"charoff",
                "valign":/^(top|middle|bottom|baseline)$/
            }
        },
        "37":"title",
        "tr":
        {
            "attributes":
            {
                "align":/^(right|left|center|justify|char)$/,
                "0":"char",
                "1":"charoff",
                "valign":/^(top|middle|bottom|baseline)$/
            }
        },
        "38":"tt",
        "39":"ul",
        "40":"var"
    },

    // Temporary skiped attributes
    skiped_attributes : [],
    skiped_attribute_values : [],

    getValidTagAttributes: function(tag, attributes)
    {
        var valid_attributes = {};
        var possible_attributes = this.getPossibleTagAttributes(tag);
        for(var attribute in attributes) {
            var value = attributes[attribute];
            attribute = attribute.toLowerCase(); // ie8 uses colSpan
            var h = WYMeditor.Helper;
            if(!h.contains(this.skiped_attributes, attribute) && !h.contains(this.skiped_attribute_values, value)){
                if (typeof value != 'function' && h.contains(possible_attributes, attribute)) {
                    if (this.doesAttributeNeedsValidation(tag, attribute)) {
                        if(this.validateAttribute(tag, attribute, value)){
                            valid_attributes[attribute] = value;
                        }
                    }else{
                        valid_attributes[attribute] = value;
                    }
                } else {
                    jQuery.each(possible_attributes, function() {
                        if(this.match(/\/(.*)\//)) {
                            regex = new RegExp(this.match(/\/(.*)\//)[1]);
                            if(regex.test(attribute)) {
                                valid_attributes[attribute] = value;
                            }
                        }
                    });
                }
            }
        }
        return valid_attributes;
    },
    getUniqueAttributesAndEventsForTag : function(tag)
    {
        var result = [];

        if (this._tags[tag] && this._tags[tag].attributes) {
            for (var k in this._tags[tag].attributes) {
                result.push(parseInt(k, 10) == k ? this._tags[tag].attributes[k] : k);
            }
        }
        return result;
    },
getDefaultAttributesAndEventsForTags : function()
{
    var result = [];
    for (var key in this._events){
        result.push(this._events[key]);
    }
    for (key in this._attributes){
        result.push(this._attributes[key]);
    }
    return result;
},
isValidTag : function(tag)
{
    if(this._tags[tag]){
        return true;
    }
    for(var key in this._tags){
        if(this._tags[key] == tag){
            return true;
        }
    }
    return false;
},
getDefaultAttributesAndEventsForTag : function(tag)
{
    var default_attributes = [];
    if (this.isValidTag(tag)) {
        var default_attributes_and_events = this.getDefaultAttributesAndEventsForTags();

    for(var key in default_attributes_and_events) {
        var defaults = default_attributes_and_events[key];
        if(typeof defaults == 'object'){
            var h = WYMeditor.Helper;
            if ((defaults['except'] && h.contains(defaults['except'], tag)) || (defaults['only'] && !h.contains(defaults['only'], tag))) {
                continue;
            }

    var tag_defaults = defaults['attributes'] ? defaults['attributes'] : defaults['events'];
    for(var k in tag_defaults) {
        default_attributes.push(typeof tag_defaults[k] != 'string' ? k : tag_defaults[k]);
    }
}
}
}
return default_attributes;
},
doesAttributeNeedsValidation: function(tag, attribute)
{
    return this._tags[tag] && ((this._tags[tag]['attributes'] && this._tags[tag]['attributes'][attribute]) || (this._tags[tag]['required'] &&
        WYMeditor.Helper.contains(this._tags[tag]['required'], attribute)));
},
validateAttribute : function(tag, attribute, value)
{
    if ( this._tags[tag] &&
        (this._tags[tag]['attributes'] && this._tags[tag]['attributes'][attribute] && value.length > 0 && !value.match(this._tags[tag]['attributes'][attribute])) || // invalid format
        (this._tags[tag] && this._tags[tag]['required'] && WYMeditor.Helper.contains(this._tags[tag]['required'], attribute) && value.length === 0)) // required attribute
    {
        return false;
    }
    return typeof this._tags[tag] != 'undefined';
},
getPossibleTagAttributes : function(tag)
{
    if (!this._possible_tag_attributes) {
        this._possible_tag_attributes = {};
    }
    if (!this._possible_tag_attributes[tag]) {
        this._possible_tag_attributes[tag] = this.getUniqueAttributesAndEventsForTag(tag).concat(this.getDefaultAttributesAndEventsForTag(tag));
    }
    return this._possible_tag_attributes[tag];
}
};


/********** XHTML LEXER/PARSER **********/

/*
* @name xml
* @description Use these methods to generate XML and XHTML compliant tags and
* escape tag attributes correctly
* @author Bermi Ferrer - http://bermi.org
* @author David Heinemeier Hansson http://loudthinking.com
*/
WYMeditor.XmlHelper = function()
{
    this._entitiesDiv = document.createElement('div');
    return this;
};


/*
* @name tag
* @description
* Returns an empty HTML tag of type *name* which by default is XHTML
* compliant. Setting *open* to true will create an open tag compatible
* with HTML 4.0 and below. Add HTML attributes by passing an attributes
* array to *options*. For attributes with no value like (disabled and
* readonly), give it a value of true in the *options* array.
*
* Examples:
*
*   this.tag('br')
*    # => <br />
*   this.tag ('br', false, true)
*    # => <br>
*   this.tag ('input', jQuery({type:'text',disabled:true }) )
*    # => <input type="text" disabled="disabled" />
*/
WYMeditor.XmlHelper.prototype.tag = function(name, options, open)
{
    options = options || false;
    open = open || false;
    return '<'+name+(options ? this.tagOptions(options) : '')+(open ? '>' : ' />');
};

/*
* @name contentTag
* @description
* Returns a XML block tag of type *name* surrounding the *content*. Add
* XML attributes by passing an attributes array to *options*. For attributes
* with no value like (disabled and readonly), give it a value of true in
* the *options* array. You can use symbols or strings for the attribute names.
*
*   this.contentTag ('p', 'Hello world!' )
*    # => <p>Hello world!</p>
*   this.contentTag('div', this.contentTag('p', "Hello world!"), jQuery({class : "strong"}))
*    # => <div class="strong"><p>Hello world!</p></div>
*   this.contentTag("select", options, jQuery({multiple : true}))
*    # => <select multiple="multiple">...options...</select>
*/
WYMeditor.XmlHelper.prototype.contentTag = function(name, content, options)
{
    options = options || false;
    return '<'+name+(options ? this.tagOptions(options) : '')+'>'+content+'</'+name+'>';
};

/*
* @name cdataSection
* @description
* Returns a CDATA section for the given +content+.  CDATA sections
* are used to escape blocks of text containing characters which would
* otherwise be recognized as markup. CDATA sections begin with the string
* <tt>&lt;![CDATA[</tt> and } with (and may not contain) the string
* <tt>]]></tt>.
*/
WYMeditor.XmlHelper.prototype.cdataSection = function(content)
{
    return '<![CDATA['+content+']]>';
};


/*
* @name escapeOnce
* @description
* Returns the escaped +xml+ without affecting existing escaped entities.
*
*  this.escapeOnce( "1 > 2 &amp; 3")
*    # => "1 &gt; 2 &amp; 3"
*/
WYMeditor.XmlHelper.prototype.escapeOnce = function(xml)
{
    return this._fixDoubleEscape(this.escapeEntities(xml));
};

/*
* @name _fixDoubleEscape
* @description
* Fix double-escaped entities, such as &amp;amp;, &amp;#123;, etc.
*/
WYMeditor.XmlHelper.prototype._fixDoubleEscape = function(escaped)
{
    return escaped.replace(/&amp;([a-z]+|(#\d+));/ig, "&$1;");
};

/*
* @name tagOptions
* @description
* Takes an array like the one generated by Tag.parseAttributes
*  [["src", "http://www.editam.com/?a=b&c=d&amp;f=g"], ["title", "Editam, <Simplified> CMS"]]
* or an object like {src:"http://www.editam.com/?a=b&c=d&amp;f=g", title:"Editam, <Simplified> CMS"}
* and returns a string properly escaped like
* ' src = "http://www.editam.com/?a=b&amp;c=d&amp;f=g" title = "Editam, &lt;Simplified&gt; CMS"'
* which is valid for strict XHTML
*/
WYMeditor.XmlHelper.prototype.tagOptions = function(options)
{
    var xml = this;
    xml._formated_options = '';

    for (var key in options) {
        var formated_options = '';
        var value = options[key];
        if(typeof value != 'function' && value.length > 0) {

    if(parseInt(key, 10) == key && typeof value == 'object'){
        key = value.shift();
        value = value.pop();
    }
    if(key !== '' && value !== ''){
        xml._formated_options += ' '+key+'="'+xml.escapeOnce(value)+'"';
    }
}
}
return xml._formated_options;
};

/*
* @name escapeEntities
* @description
* Escapes XML/HTML entities <, >, & and ". If seccond parameter is set to false it
* will not escape ". If set to true it will also escape '
*/
WYMeditor.XmlHelper.prototype.escapeEntities = function(string, escape_quotes)
{
    this._entitiesDiv.innerHTML = string;
    this._entitiesDiv.textContent = string;
    var result = this._entitiesDiv.innerHTML;
    if(typeof escape_quotes == 'undefined'){
        if(escape_quotes !== false) result = result.replace('"', '&quot;');
        if(escape_quotes === true)  result = result.replace('"', '&#039;');
    }
    return result;
};

/*
* Parses a string conatining tag attributes and values an returns an array formated like
*  [["src", "http://www.editam.com"], ["title", "Editam, Simplified CMS"]]
*/
WYMeditor.XmlHelper.prototype.parseAttributes = function(tag_attributes)
{
    // Use a compounded regex to match single quoted, double quoted and unquoted attribute pairs
    var result = [];
    var matches = tag_attributes.split(/((=\s*")(")("))|((=\s*\')(\')(\'))|((=\s*[^>\s]*))/g);
    if(matches.toString() != tag_attributes){
        for (var k in matches) {
            var v = matches[k];
            if(typeof v != 'function' && v.length !== 0){
                var re = new RegExp('(\\w+)\\s*'+v);
                var match = tag_attributes.match(re);
                if(match) {
                    var value = v.replace(/^[\s=]+/, "");
                    var delimiter = value.charAt(0);
                    delimiter = delimiter == '"' ? '"' : (delimiter=="'"?"'":'');
                    if(delimiter !== ''){
                        value = delimiter == '"' ? value.replace(/^"|"+$/g, '') :  value.replace(/^'|'+$/g, '');
                    }
                    tag_attributes = tag_attributes.replace(match[0],'');
                    result.push([match[1] , value]);
                }
            }
        }
    }
    return result;
};

WYMeditor.STRINGS.bg = {
    Strong:           'Получер',
    Emphasis:         'Курсив',
    Superscript:      'Горен индекс',
    Subscript:        'Долен индекс',
    Ordered_List:     'Подреден списък',
    Unordered_List:   'Неподреден списък',
    Indent:           'Блок навътре',
    Outdent:          'Блок навън',
    Undo:             'Стъпка назад',
    Redo:             'Стъпка напред',
    Link:             'Създай хипервръзка',
    Unlink:           'Премахни хипервръзката',
    Image:            'Изображение',
    Table:            'Таблица',
    HTML:             'HTML',
    Paragraph:        'Абзац',
    Heading_1:        'Заглавие 1',
    Heading_2:        'Заглавие 2',
    Heading_3:        'Заглавие 3',
    Heading_4:        'Заглавие 4',
    Heading_5:        'Заглавие 5',
    Heading_6:        'Заглавие 6',
    Preformatted:     'Преформатиран',
    Blockquote:       'Цитат',
    Table_Header:     'Заглавие на таблицата',
    URL:              'URL',
    Title:            'Заглавие',
    Alternative_Text: 'Алтернативен текст',
    Caption:          'Етикет',
    Summary:          'Общо',
    Number_Of_Rows:   'Брой редове',
    Number_Of_Cols:   'Брой колони',
    Submit:           'Изпрати',
    Cancel:           'Отмени',
    Choose:           'Затвори',
    Preview:          'Предварителен преглед',
    Paste_From_Word:  'Вмъкни от MS WORD',
    Tools:            'Инструменти',
    Containers:       'Контейнери',
    Classes:          'Класове',
    Status:           'Статус',
    Source_Code:      'Източник, код'
};


WYMeditor.STRINGS.ca = {
    Strong:           'Ressaltar',
    Emphasis:         'Emfatitzar',
    Superscript:      'Superindex',
    Subscript:        'Subindex',
    Ordered_List:     'Llistat ordenat',
    Unordered_List:   'Llistat sense ordenar',
    Indent:           'Indentat',
    Outdent:          'Sense indentar',
    Undo:             'Desfer',
    Redo:             'Refer',
    Link:             'Enllaçar',
    Unlink:           'Eliminar enllaç',
    Image:            'Imatge',
    Table:            'Taula',
    HTML:             'HTML',
    Paragraph:        'Paràgraf',
    Heading_1:        'Capçalera 1',
    Heading_2:        'Capçalera 2',
    Heading_3:        'Capçalera 3',
    Heading_4:        'Capçalera 4',
    Heading_5:        'Capçalera 5',
    Heading_6:        'Capçalera 6',
    Preformatted:     'Pre-formatejat',
    Blockquote:       'Cita',
    Table_Header:     'Capçalera de la taula',
    URL:              'URL',
    Title:            'Títol',
    Alternative_Text: 'Text alternatiu',
    Caption:          'Llegenda',
    Summary:          'Summary',
    Number_Of_Rows:   'Nombre de files',
    Number_Of_Cols:   'Nombre de columnes',
    Submit:           'Enviar',
    Cancel:           'Cancel·lar',
    Choose:           'Triar',
    Preview:          'Vista prèvia',
    Paste_From_Word:  'Pegar des de Word',
    Tools:            'Eines',
    Containers:       'Contenidors',
    Classes:          'Classes',
    Status:           'Estat',
    Source_Code:      'Codi font'
};


WYMeditor.STRINGS.cs = {
    Strong:           'Tučné',
    Emphasis:         'Kurzíva',
    Superscript:      'Horní index',
    Subscript:        'Dolní index',
    Ordered_List:     'Číslovaný seznam',
    Unordered_List:   'Nečíslovaný seznam',
    Indent:           'Zvětšit odsazení',
    Outdent:          'Zmenšit odsazení',
    Undo:             'Zpět',
    Redo:             'Znovu',
    Link:             'Vytvořit odkaz',
    Unlink:           'Zrušit odkaz',
    Image:            'Obrázek',
    Table:            'Tabulka',
    HTML:             'HTML',
    Paragraph:        'Odstavec',
    Heading_1:        'Nadpis 1. úrovně',
    Heading_2:        'Nadpis 2. úrovně',
    Heading_3:        'Nadpis 3. úrovně',
    Heading_4:        'Nadpis 4. úrovně',
    Heading_5:        'Nadpis 5. úrovně',
    Heading_6:        'Nadpis 6. úrovně',
    Preformatted:     'Předformátovaný text',
    Blockquote:       'Citace',
    Table_Header:     'Hlavičková buňka tabulky',
    URL:              'Adresa',
    Title:            'Text po najetí myší',
    Alternative_Text: 'Text pro případ nezobrazení obrázku',
    Caption:          'Titulek tabulky',
    Summary:          'Shrnutí obsahu',
    Number_Of_Rows:   'Počet řádek',
    Number_Of_Cols:   'Počet sloupců',
    Submit:           'Vytvořit',
    Cancel:           'Zrušit',
    Choose:           'Vybrat',
    Preview:          'Náhled',
    Paste_From_Word:  'Vložit z Wordu',
    Tools:            'Nástroje',
    Containers:       'Typy obsahu',
    Classes:          'Třídy',
    Status:           'Stav',
    Source_Code:      'Zdrojový kód'
};


WYMeditor.STRINGS.cy = {
    Strong:           'Bras',
    Emphasis:         'Italig',
    Superscript:      'Uwchsgript',
    Subscript:        'Is-sgript',
    Ordered_List:     'Rhestr mewn Trefn',
    Unordered_List:   'Pwyntiau Bwled',
    Indent:           'Mewnoli',
    Outdent:          'Alloli',
    Undo:             'Dadwneud',
    Redo:             'Ailwneud',
    Link:             'Cysylltu',
    Unlink:           'Datgysylltu',
    Image:            'Delwedd',
    Table:            'Tabl',
    HTML:             'HTML',
    Paragraph:        'Paragraff',
    Heading_1:        'Pennawd 1',
    Heading_2:        'Pennawd 2',
    Heading_3:        'Pennawd 3',
    Heading_4:        'Pennawd 4',
    Heading_5:        'Pennawd 5',
    Heading_6:        'Pennawd 6',
    Preformatted:     'Rhagfformat',
    Blockquote:       'Bloc Dyfyniad',
    Table_Header:     'Pennyn Tabl',
    URL:              'URL',
    Title:            'Teitl',
    Alternative_Text: 'Testun Amgen',
    Caption:          'Pennawd',
    Summary:          'Crynodeb',
    Number_Of_Rows:   'Nifer y rhesi',
    Number_Of_Cols:   'Nifer y colofnau',
    Submit:           'Anfon',
    Cancel:           'Diddymu',
    Choose:           'Dewis',
    Preview:          'Rhagolwg',
    Paste_From_Word:  'Gludo o Word',
    Tools:            'Offer',
    Containers:       'Cynhwysyddion',
    Classes:          'Dosbarthiadau',
    Status:           'Statws',
    Source_Code:      'Cod ffynhonnell'
};


WYMeditor.STRINGS['da'] = {
    Strong:           'Fed',
    Emphasis:         'Skrå',
    Superscript:      'Superscript',
    Subscript:        'Subscript',
    Ordered_List:     'Ordnet liste',
    Unordered_List:   'Uordnet liste',
    Indent:           'Indrykke',
    Outdent:          'Udrykke',
    Undo:             'Fortryd',
    Redo:             'Fortryd',
    Link:             'Link',
    Unlink:           'Fjern link',
    Image:            'Billede',
    Table:            'Tabel',
    HTML:             'HTML',
    Paragraph:        'Paragraf',
    Heading_1:        'Overskrift 1',
    Heading_2:        'Overskrift 2',
    Heading_3:        'Overskrift 3',
    Heading_4:        'Overskrift 4',
    Heading_5:        'Overskrift 5',
    Heading_6:        'Overskrift 6',
    Preformatted:     'Forudformateret',
    Blockquote:       'Citat',
    Table_Header:     'Tabel Overskrift',
    URL:              'URL',
    Title:            'Titel',
    Alternative_Text: 'Alternativ tekst',
    Caption:          'Billedtekst',
    Summary:          'Resumé',
    Number_Of_Rows:   'Antal rækker',
    Number_Of_Cols:   'Antal kolonner',
    Submit:           'Indsend',
    Cancel:           'Afbryd',
    Choose:           'Vælg',
    Preview:          'Forhåndsvisning',
    Paste_From_Word:  'Indsæt fra Word',
    Tools:            'Værktøjer',
    Containers:       'Containere',
    Classes:          'Klasser',
    Status:           'Status',
    Source_Code:      'Kildekode'
};


WYMeditor.STRINGS.de = {
    Strong:           'Fett',
    Emphasis:         'Kursiv',
    Superscript:      'Text hochstellen',
    Subscript:        'Text tiefstellen',
    Ordered_List:     'Geordnete Liste einfügen',
    Unordered_List:   'Ungeordnete Liste einfügen',
    Indent:           'Einzug erhöhen',
    Outdent:          'Einzug vermindern',
    Undo:             'Befehle rückgängig machen',
    Redo:             'Befehle wiederherstellen',
    Link:             'Hyperlink einfügen',
    Unlink:           'Hyperlink entfernen',
    Image:            'Bild einfügen',
    Table:            'Tabelle einfügen',
    HTML:             'HTML anzeigen/verstecken',
    Paragraph:        'Absatz',
    Heading_1:        'Überschrift 1',
    Heading_2:        'Überschrift 2',
    Heading_3:        'Überschrift 3',
    Heading_4:        'Überschrift 4',
    Heading_5:        'Überschrift 5',
    Heading_6:        'Überschrift 6',
    Preformatted:     'Vorformatiert',
    Blockquote:       'Zitat',
    Table_Header:     'Tabellenüberschrift',
    URL:              'URL',
    Title:            'Titel',
    Alternative_Text: 'Alternativer Text',
    Caption:          'Tabellenüberschrift',
    Summary:          'Summary',
    Number_Of_Rows:   'Anzahl Zeilen',
    Number_Of_Cols:   'Anzahl Spalten',
    Submit:           'Absenden',
    Cancel:           'Abbrechen',
    Choose:           'Auswählen',
    Preview:          'Vorschau',
    Paste_From_Word:  'Aus Word einfügen',
    Tools:            'Werkzeuge',
    Containers:       'Inhaltstyp',
    Classes:          'Klassen',
    Status:           'Status',
    Source_Code:      'Quellcode'
};


WYMeditor.STRINGS.en = {
    Strong:           'Strong',
    Emphasis:         'Emphasis',
    Superscript:      'Superscript',
    Subscript:        'Subscript',
    Ordered_List:     'Ordered List',
    Unordered_List:   'Unordered List',
    Indent:           'Indent',
    Outdent:          'Outdent',
    Undo:             'Undo',
    Redo:             'Redo',
    Link:             'Link',
    Unlink:           'Unlink',
    Image:            'Image',
    Table:            'Table',
    HTML:             'HTML',
    Paragraph:        'Paragraph',
    Heading_1:        'Heading 1',
    Heading_2:        'Heading 2',
    Heading_3:        'Heading 3',
    Heading_4:        'Heading 4',
    Heading_5:        'Heading 5',
    Heading_6:        'Heading 6',
    Preformatted:     'Preformatted',
    Blockquote:       'Blockquote',
    Table_Header:     'Table Header',
    URL:              'URL',
    Title:            'Title',
    Relationship:     'Relationship',
    Alternative_Text: 'Alternative text',
    Caption:          'Caption',
    Summary:          'Summary',
    Number_Of_Rows:   'Number of rows',
    Number_Of_Cols:   'Number of cols',
    Submit:           'Submit',
    Cancel:           'Cancel',
    Choose:           'Choose',
    Preview:          'Preview',
    Paste_From_Word:  'Paste from Word',
    Tools:            'Tools',
    Containers:       'Formatting',
    Classes:          'Style',
    Status:           'Status',
    Source_Code:      'Source code'
};

WYMeditor.STRINGS.es = {
    Strong:           'Resaltar',
    Emphasis:         'Enfatizar',
    Superscript:      'Superindice',
    Subscript:        'Subindice',
    Ordered_List:     'Lista ordenada',
    Unordered_List:   'Lista sin ordenar',
    Indent:           'Indentado',
    Outdent:          'Sin indentar',
    Undo:             'Deshacer',
    Redo:             'Rehacer',
    Link:             'Enlazar',
    Unlink:           'Eliminar enlace',
    Image:            'Imagen',
    Table:            'Tabla',
    HTML:             'HTML',
    Paragraph:        'Párrafo',
    Heading_1:        'Cabecera 1',
    Heading_2:        'Cabecera 2',
    Heading_3:        'Cabecera 3',
    Heading_4:        'Cabecera 4',
    Heading_5:        'Cabecera 5',
    Heading_6:        'Cabecera 6',
    Preformatted:     'Preformateado',
    Blockquote:       'Cita',
    Table_Header:     'Cabecera de la tabla',
    URL:              'URL',
    Title:            'Título',
    Alternative_Text: 'Texto alternativo',
    Caption:          'Leyenda',
    Summary:          'Summary',
    Number_Of_Rows:   'Número de filas',
    Number_Of_Cols:   'Número de columnas',
    Submit:           'Enviar',
    Cancel:           'Cancelar',
    Choose:           'Seleccionar',
    Preview:          'Vista previa',
    Paste_From_Word:  'Pegar desde Word',
    Tools:            'Herramientas',
    Containers:       'Contenedores',
    Classes:          'Clases',
    Status:           'Estado',
    Source_Code:      'Código fuente'
};


//Translation To Persian: Ghassem Tofighi (http://ght.ir)
WYMeditor.STRINGS.fa = {
    Strong:           'پررنگ',//Strong
    Emphasis:         'ایتالیک',//Emphasis
    Superscript:      'بالانويس‌ ',//Superscript
    Subscript:        'زيرنويس‌',//Subscript
    Ordered_List:     'لیست مرتب',//Ordered List
    Unordered_List:   'لیست نامرتب',//Unordered List
    Indent:           'افزودن دندانه',//Indent
    Outdent:          'کاهش دندانه',//Outdent
    Undo:             'واگردانی',//Undo
    Redo:             'تکرار',//Redo
    Link:             'ساختن پیوند',//Link
    Unlink:           'برداشتن پیوند',//Unlink
    Image:            'تصویر',//Image
    Table:            'جدول',//Table
    HTML:             'HTML',//HTML
    Paragraph:        'پاراگراف',//Paragraph
    Heading_1:        'سرتیتر ۱',//Heading 1
    Heading_2:        'سرتیتر ۲',//Heading 2
    Heading_3:        'سرتیتر ۳',//Heading 3
    Heading_4:        'سرتیتر ۴',//Heading 4
    Heading_5:        'سرتیتر ۵',//Heading 5
    Heading_6:        'سرتیتر ۶',//Heading 6
    Preformatted:     'قالب آماده',//Preformatted
    Blockquote:       'نقل قول',//Blockquote
    Table_Header:     'سرجدول',//Table Header
    URL:              'آدرس اینترنتی',//URL
    Title:            'عنوان',//Title
    Alternative_Text: 'متن جایگزین',//Alternative text
    Caption:          'عنوان',//Caption
    Summary:          'Summary',
    Number_Of_Rows:   'تعداد سطرها',//Number of rows
    Number_Of_Cols:   'تعداد ستون‌ها',//Number of cols
    Submit:           'فرستادن',//Submit
    Cancel:           'لغو',//Cancel
    Choose:           'انتخاب',//Choose
    Preview:          'پیش‌نمایش',//Preview
    Paste_From_Word:  'انتقال از ورد',//Paste from Word
    Tools:            'ابزار',//Tools
    Containers:       '‌قالب‌ها',//Containers
    Classes:          'کلاس‌ها',//Classes
    Status:           'وضعیت',//Status
    Source_Code:      'کد مبدأ'//Source code
};


WYMeditor.STRINGS.fi = {
    Strong:           'Lihavoitu',
    Emphasis:         'Korostus',
    Superscript:      'Yläindeksi',
    Subscript:        'Alaindeksi',
    Ordered_List:     'Numeroitu lista',
    Unordered_List:   'Luettelomerkit',
    Indent:           'Suurenna sisennystä',
    Outdent:          'Pienennä sisennystä',
    Undo:             'Kumoa',
    Redo:             'Toista',
    Link:             'Linkitä',
    Unlink:           'Poista linkitys',
    Image:            'Kuva',
    Table:            'Taulukko',
    HTML:             'HTML',
    Paragraph:        'Kappale',
    Heading_1:        'Otsikko 1',
    Heading_2:        'Otsikko 2',
    Heading_3:        'Otsikko 3',
    Heading_4:        'Otsikko 4',
    Heading_5:        'Otsikko 5',
    Heading_6:        'Otsikko 6',
    Preformatted:     'Esimuotoilu',
    Blockquote:       'Sitaatti',
    Table_Header:     'Taulukon otsikko',
    URL:              'URL',
    Title:            'Otsikko',
    Alternative_Text: 'Vaihtoehtoinen teksti',
    Caption:          'Kuvateksti',
    Summary:          'Yhteenveto',
    Number_Of_Rows:   'Rivien määrä',
    Number_Of_Cols:   'Palstojen määrä',
    Submit:           'Lähetä',
    Cancel:           'Peruuta',
    Choose:           'Valitse',
    Preview:          'Esikatsele',
    Paste_From_Word:  'Tuo Wordista',
    Tools:            'Työkalut',
    Containers:       'Muotoilut',
    Classes:          'Luokat',
    Status:           'Tila',
    Source_Code:      'Lähdekoodi'
};

WYMeditor.STRINGS.fr = {
    Strong:           'Mise en évidence',
    Emphasis:         'Emphase',
    Superscript:      'Exposant',
    Subscript:        'Indice',
    Ordered_List:     'Liste Ordonnée',
    Unordered_List:   'Liste Non-Ordonnée',
    Indent:           'Imbriqué',
    Outdent:          'Non-imbriqué',
    Undo:             'Annuler',
    Redo:             'Rétablir',
    Link:             'Lien',
    Unlink:           'Supprimer le Lien',
    Image:            'Image',
    Table:            'Tableau',
    HTML:             'HTML',
    Paragraph:        'Paragraphe',
    Heading_1:        'Titre 1',
    Heading_2:        'Titre 2',
    Heading_3:        'Titre 3',
    Heading_4:        'Titre 4',
    Heading_5:        'Titre 5',
    Heading_6:        'Titre 6',
    Preformatted:     'Pré-formatté',
    Blockquote:       'Citation',
    Table_Header:     'Cellule de titre',
    URL:              'URL',
    Title:            'Titre',
    Alternative_Text: 'Texte alternatif',
    Caption:          'Légende',
    Summary:          'Résumé',
    Number_Of_Rows:   'Nombre de lignes',
    Number_Of_Cols:   'Nombre de colonnes',
    Submit:           'Envoyer',
    Cancel:           'Annuler',
    Choose:           'Choisir',
    Preview:          'Prévisualisation',
    Paste_From_Word:  'Copier depuis Word',
    Tools:            'Outils',
    Containers:       'Type de texte',
    Classes:          'Type de contenu',
    Status:           'Infos',
    Source_Code:      'Code source'
};


WYMeditor.STRINGS.gl = {
    Strong:           'Moita énfase',
    Emphasis:         'Énfase',
    Superscript:      'Superíndice',
    Subscript:        'Subíndice',
    Ordered_List:     'Lista ordenada',
    Unordered_List:   'Lista sen ordenar',
    Indent:           'Aniñar',
    Outdent:          'Desaniñar',
    Undo:             'Desfacer',
    Redo:             'Refacer',
    Link:             'Ligazón',
    Unlink:           'Desligar',
    Image:            'Imaxe',
    Table:            'Táboa',
    HTML:             'HTML',
    Paragraph:        'Parágrafo',
    Heading_1:        'Título 1',
    Heading_2:        'Título 2',
    Heading_3:        'Título 3',
    Heading_4:        'Título 4',
    Heading_5:        'Título 5',
    Heading_6:        'Título 6',
    Preformatted:     'Preformatado',
    Blockquote:       'Cita en parágrafo',
    Table_Header:     'Cabeceira da táboa',
    URL:              'URL',
    Title:            'Título',
    Alternative_Text: 'Texto alternativo',
    Caption:          'Título',
    Summary:          'Resumo',
    Number_Of_Rows:   'Número de filas',
    Number_Of_Cols:   'Número de columnas',
    Submit:           'Enviar',
    Cancel:           'Cancelar',
    Choose:           'Escoller',
    Preview:          'Previsualizar',
    Paste_From_Word:  'Colar dende Word',
    Tools:            'Ferramentas',
    Containers:       'Contenedores',
    Classes:          'Clases',
    Status:           'Estado',
    Source_Code:      'Código fonte'
};


WYMeditor.STRINGS.he = {
    Strong:           'חזק',
    Emphasis:         'מובלט',
    Superscript:      'כתב עילי',
    Subscript:        'כתב תחתי',
    Ordered_List:     'רשימה ממוספרת',
    Unordered_List:   'רשימה לא ממוספרת',
    Indent:           'הזחה פנימה',
    Outdent:          'הזחה החוצה',
    Undo:             'בטל פעולה',
    Redo:             'בצע מחדש פעולה',
    Link:             'קישור',
    Unlink:           'בטל קישור',
    Image:            'תמונה',
    Table:            'טבלה',
    HTML:             'קוד HTML',
    Paragraph:        'פסקה',
    Heading_1:        'כותרת 1 ; תג &lt;h1&gt;',
    Heading_2:        'כותרת 2 ; תג &lt;h2&gt;',
    Heading_3:        'כותרת 3 ; תג &lt;h3&gt;',
    Heading_4:        'כותרת 4 ; תג &lt;h4&gt;',
    Heading_5:        'כותרת 5 ; תג &lt;h5&gt;',
    Heading_6:        'כותרת 6 ; תג &lt;h6&gt;',
    Preformatted:     'משמר רווחים',
    Blockquote:       'ציטוט',
    Table_Header:     'כותרת טבלה',
    URL:              'קישור (URL)',
    Title:            'כותרת',
    Alternative_Text: 'טקסט חלופי',
    Caption:          'כותרת',
    Summary:          'סיכום',
    Number_Of_Rows:   'מספר שורות',
    Number_Of_Cols:   'מספר טורים',
    Submit:           'שלח',
    Cancel:           'בטל',
    Choose:           'בחר',
    Preview:          'תצוגה מקדימה',
    Paste_From_Word:  'העתק מ-Word',
    Tools:            'כלים',
    Containers:       'מיכלים',
    Classes:          'מחלקות',
    Status:           'מצב',
    Source_Code:      'קוד מקור'
};


WYMeditor.STRINGS.hr = {
    Strong:           'Podebljano',
    Emphasis:         'Naglašeno',
    Superscript:      'Iznad',
    Subscript:        'Ispod',
    Ordered_List:     'Pobrojana lista',
    Unordered_List:   'Nepobrojana lista',
    Indent:           'Uvuci',
    Outdent:          'Izvuci',
    Undo:             'Poništi promjenu',
    Redo:             'Ponovno promjeni',
    Link:             'Hiperveza',
    Unlink:           'Ukloni hipervezu',
    Image:            'Slika',
    Table:            'Tablica',
    HTML:             'HTML',
    Paragraph:        'Paragraf',
    Heading_1:        'Naslov 1',
    Heading_2:        'Naslov 2',
    Heading_3:        'Naslov 3',
    Heading_4:        'Naslov 4',
    Heading_5:        'Naslov 5',
    Heading_6:        'Naslov 6',
    Preformatted:     'Unaprijed formatirano',
    Blockquote:       'Citat',
    Table_Header:     'Zaglavlje tablice',
    URL:              'URL',
    Title:            'Naslov',
    Alternative_Text: 'Alternativni tekst',
    Caption:          'Zaglavlje',
    Summary:          'Sažetak',
    Number_Of_Rows:   'Broj redova',
    Number_Of_Cols:   'Broj kolona',
    Submit:           'Snimi',
    Cancel:           'Odustani',
    Choose:           'Izaberi',
    Preview:          'Pregled',
    Paste_From_Word:  'Zalijepi iz Word-a',
    Tools:            'Alati',
    Containers:       'Kontejneri',
    Classes:          'Klase',
    Status:           'Status',
    Source_Code:      'Izvorni kod'
};


WYMeditor.STRINGS.hu = {
    Strong:           'Félkövér',
    Emphasis:         'Kiemelt',
    Superscript:      'Felső index',
    Subscript:        'Alsó index',
    Ordered_List:     'Rendezett lista',
    Unordered_List:   'Rendezetlen lista',
    Indent:           'Bekezdés',
    Outdent:          'Bekezdés törlése',
    Undo:             'Visszavon',
    Redo:             'Visszaállít',
    Link:             'Link',
    Unlink:           'Link törlése',
    Image:            'Kép',
    Table:            'Tábla',
    HTML:             'HTML',
    Paragraph:        'Bekezdés',
    Heading_1:        'Címsor 1',
    Heading_2:        'Címsor 2',
    Heading_3:        'Címsor 3',
    Heading_4:        'Címsor 4',
    Heading_5:        'Címsor 5',
    Heading_6:        'Címsor 6',
    Preformatted:     'Előformázott',
    Blockquote:       'Idézet',
    Table_Header:     'Tábla Fejléc',
    URL:              'Webcím',
    Title:            'Megnevezés',
    Alternative_Text: 'Alternatív szöveg',
    Caption:          'Fejléc',
    Summary:          'Summary',
    Number_Of_Rows:   'Sorok száma',
    Number_Of_Cols:   'Oszlopok száma',
    Submit:           'Elküld',
    Cancel:           'Mégsem',
    Choose:           'Választ',
    Preview:          'Előnézet',
    Paste_From_Word:  'Másolás Word-ból',
    Tools:            'Eszközök',
    Containers:       'Tartalmak',
    Classes:          'Osztályok',
    Status:           'Állapot',
    Source_Code:      'Forráskód'
};


WYMeditor.STRINGS.it = {
    Strong:           'Grassetto',
    Emphasis:         'Corsetto',
    Superscript:      'Apice',
    Subscript:        'Pedice',
    Ordered_List:     'Lista Ordinata',
    Unordered_List:   'Lista Puntata',
    Indent:           'Indenta',
    Outdent:          'Caccia',
    Undo:             'Indietro',
    Redo:             'Avanti',
    Link:             'Inserisci Link',
    Unlink:           'Togli Link',
    Image:            'Inserisci Immagine',
    Table:            'Inserisci Tabella',
    HTML:             'HTML',
    Paragraph:        'Paragrafo',
    Heading_1:        'Heading 1',
    Heading_2:        'Heading 2',
    Heading_3:        'Heading 3',
    Heading_4:        'Heading 4',
    Heading_5:        'Heading 5',
    Heading_6:        'Heading 6',
    Preformatted:     'Preformattato',
    Blockquote:       'Blockquote',
    Table_Header:     'Header Tabella',
    URL:              'Indirizzo',
    Title:            'Titolo',
    Alternative_Text: 'Testo Alternativo',
    Caption:          'Caption',
    Summary:          'Summary',
    Number_Of_Rows:   'Numero di Righe',
    Number_Of_Cols:   'Numero di Colonne',
    Submit:           'Invia',
    Cancel:           'Cancella',
    Choose:           'Scegli',
    Preview:          'Anteprima',
    Paste_From_Word:  'Incolla',
    Tools:            'Tools',
    Containers:       'Contenitori',
    Classes:          'Classi',
    Status:           'Stato',
    Source_Code:      'Codice Sorgente'
};


WYMeditor.STRINGS.ja = {
    Strong: '強調<strong>',
    Emphasis: '強調<em>',
    Superscript: '上付き',
    Subscript: '下付き',
    Ordered_List: '番号付きリスト',
    Unordered_List: '番号無リスト',
    Indent: 'インデントを増やす',
    Outdent: 'インデントを減らす',
    Undo: '元に戻す',
    Redo: 'やり直す',
    Link: 'リンク',
    Unlink: 'リンク取消',
    Image: '画像',
    Table: 'テーブル',
    HTML: 'HTML',
    Paragraph: '段落',
    Heading_1: '見出し 1',
    Heading_2: '見出し 2',
    Heading_3: '見出し 3',
    Heading_4: '見出し 4',
    Heading_5: '見出し 5',
    Heading_6: '見出し 6',
    Preformatted: '整形済みテキスト',
    Blockquote: '引用文',
    Table_Header: '表見出し',
    URL: 'URL',
    Title: 'タイトル',
    Alternative_Text: '代替テキスト',
    Caption: 'キャプション',
    Summary: 'サマリー',
    Number_Of_Rows: '行数',
    Number_Of_Cols: '列数',
    Submit: '送信',
    Cancel: 'キャンセル',
    Choose: '選択',
    Preview: 'プレビュー',
    Paste_From_Word: '貼り付け',
    Tools: 'ツール',
    Containers: 'コンテナ',
    Classes: 'クラス',
    Status: 'ステータス',
    Source_Code: 'ソースコード'
};

WYMeditor.STRINGS.lt = {
    Strong:           'Pusjuodis',
    Emphasis:         'Kursyvas',
    Superscript:      'Viršutinis indeksas',
    Subscript:        'Apatinis indeksas',
    Ordered_List:     'Numeruotas sąrašas',
    Unordered_List:   'Suženklintas sąrašas',
    Indent:           'Padidinti įtrauką',
    Outdent:          'Sumažinti įtrauką',
    Undo:             'Atšaukti',
    Redo:             'Atstatyti',
    Link:             'Nuoroda',
    Unlink:           'Panaikinti nuorodą',
    Image:            'Vaizdas',
    Table:            'Lentelė',
    HTML:             'HTML',
    Paragraph:        'Paragrafas',
    Heading_1:        'Antraštinis 1',
    Heading_2:        'Antraštinis 2',
    Heading_3:        'Antraštinis 3',
    Heading_4:        'Antraštinis 4',
    Heading_5:        'Antraštinis 5',
    Heading_6:        'Antraštinis 6',
    Preformatted:     'Formuotas',
    Blockquote:       'Citata',
    Table_Header:     'Lentelės antraštė',
    URL:              'URL',
    Title:            'Antraštinis tekstas',
    Relationship:     'Sąryšis',
    Alternative_Text: 'Alternatyvus tekstas',
    Caption:          'Antraštė',
    Summary:          'Santrauka',
    Number_Of_Rows:   'Eilučių skaičius',
    Number_Of_Cols:   'Stulpelių skaičius',
    Submit:           'Išsaugoti',
    Cancel:           'Nutraukti',
    Choose:           'Rinktis',
    Preview:          'Peržiūra',
    Paste_From_Word:  'Įkelti iš MS Word',
    Tools:            'Įrankiai',
    Containers:       'Stiliai',
    Classes:          'Klasės',
    Status:           'Statusas',
    Source_Code:      'Išeities tekstas'
};
WYMeditor.STRINGS.nb = {
    Strong:           'Fet',
    Emphasis:         'Uthevet',
    Superscript:      'Opphøyet',
    Subscript:        'Nedsenket',
    Ordered_List:     'Nummerert liste',
    Unordered_List:   'Punktliste',
    Indent:           'Rykk inn',
    Outdent:          'Rykk ut',
    Undo:             'Angre',
    Redo:             'Gjenta',
    Link:             'Lenke',
    Unlink:           'Ta bort lenken',
    Image:            'Bilde',
    Table:            'Tabell',
    HTML:             'HTML',
    Paragraph:        'Avsnitt',
    Heading_1:        'Overskrift 1',
    Heading_2:        'Overskrift 2',
    Heading_3:        'Overskrift 3',
    Heading_4:        'Overskrift 4',
    Heading_5:        'Overskrift 5',
    Heading_6:        'Overskrift 6',
    Preformatted:     'Preformatert',
    Blockquote:       'Sitat',
    Table_Header:     'Tabelloverskrift',
    URL:              'URL',
    Title:            'Tittel',
    Alternative_Text: 'Alternativ tekst',
    Caption:          'Overskrift',
    Summary:          'Sammendrag',
    Number_Of_Rows:   'Antall rader',
    Number_Of_Cols:   'Antall kolonner',
    Submit:           'Ok',
    Cancel:           'Avbryt',
    Choose:           'Velg',
    Preview:          'Forhåndsvis',
    Paste_From_Word:  'Lim inn fra Word',
    Tools:            'Verktøy',
    Containers:       'Formatering',
    Classes:          'Klasser',
    Status:           'Status',
    Source_Code:      'Kildekode'
};


WYMeditor.STRINGS.nl = {
    Strong:           'Sterk benadrukken',
    Emphasis:         'Benadrukken',
    Superscript:      'Bovenschrift',
    Subscript:        'Onderschrift',
    Ordered_List:     'Geordende lijst',
    Unordered_List:   'Ongeordende lijst',
    Indent:           'Inspringen',
    Outdent:          'Terugspringen',
    Undo:             'Ongedaan maken',
    Redo:             'Opnieuw uitvoeren',
    Link:             'Linken',
    Unlink:           'Ontlinken',
    Image:            'Afbeelding',
    Table:            'Tabel',
    HTML:             'HTML',
    Paragraph:        'Paragraaf',
    Heading_1:        'Kop 1',
    Heading_2:        'Kop 2',
    Heading_3:        'Kop 3',
    Heading_4:        'Kop 4',
    Heading_5:        'Kop 5',
    Heading_6:        'Kop 6',
    Preformatted:     'Voorgeformatteerd',
    Blockquote:       'Citaat',
    Table_Header:     'Tabel-kop',
    URL:              'URL',
    Title:            'Titel',
    Relationship:     'Relatie',
    Alternative_Text: 'Alternatieve tekst',
    Caption:          'Bijschrift',
    Summary:          'Summary',
    Number_Of_Rows:   'Aantal rijen',
    Number_Of_Cols:   'Aantal kolommen',
    Submit:           'Versturen',
    Cancel:           'Annuleren',
    Choose:           'Kiezen',
    Preview:          'Voorbeeld bekijken',
    Paste_From_Word:  'Plakken uit Word',
    Tools:            'Hulpmiddelen',
    Containers:       'Teksttypes',
    Classes:          'Klassen',
    Status:           'Status',
    Source_Code:      'Broncode'
};
WYMeditor.STRINGS.nn = {
    Strong:           'Feit',
    Emphasis:         'Utheva',
    Superscript:      'Opphøgd',
    Subscript:        'Nedsenka',
    Ordered_List:     'Nummerert liste',
    Unordered_List:   'Punktliste',
    Indent:           'Rykk inn',
    Outdent:          'Rykk ut',
    Undo:             'Angre',
    Redo:             'Gjentaka',
    Link:             'Lenkje',
    Unlink:           'Ta bort lenkja',
    Image:            'Bilete',
    Table:            'Tabell',
    HTML:             'HTML',
    Paragraph:        'Avsnitt',
    Heading_1:        'Overskrift 1',
    Heading_2:        'Overskrift 2',
    Heading_3:        'Overskrift 3',
    Heading_4:        'Overskrift 4',
    Heading_5:        'Overskrift 5',
    Heading_6:        'Overskrift 6',
    Preformatted:     'Preformatert',
    Blockquote:       'Sitat',
    Table_Header:     'Tabelloverskrift',
    URL:              'URL',
    Title:            'Tittel',
    Alternative_Text: 'Alternativ tekst',
    Caption:          'Overskrift',
    Summary:          'Samandrag',
    Number_Of_Rows:   'Tal på rader',
    Number_Of_Cols:   'Tal på kolonnar',
    Submit:           'Ok',
    Cancel:           'Avbryt',
    Choose:           'Vel',
    Preview:          'Førehandsvis',
    Paste_From_Word:  'Lim inn frå Word',
    Tools:            'Verkty',
    Containers:       'Formatering',
    Classes:          'Klassar',
    Status:           'Status',
    Source_Code:      'Kjeldekode'
};


WYMeditor.STRINGS.pl = {
    Strong:           'Nacisk',
    Emphasis:         'Emfaza',
    Superscript:      'Indeks górny',
    Subscript:        'Indeks dolny',
    Ordered_List:     'Lista numerowana',
    Unordered_List:   'Lista wypunktowana',
    Indent:           'Zwiększ wcięcie',
    Outdent:          'Zmniejsz wcięcie',
    Undo:             'Cofnij',
    Redo:             'Ponów',
    Link:             'Wstaw link',
    Unlink:           'Usuń link',
    Image:            'Obraz',
    Table:            'Tabela',
    HTML:             'Źródło HTML',
    Paragraph:        'Akapit',
    Heading_1:        'Nagłówek 1',
    Heading_2:        'Nagłówek 2',
    Heading_3:        'Nagłówek 3',
    Heading_4:        'Nagłówek 4',
    Heading_5:        'Nagłówek 5',
    Heading_6:        'Nagłówek 6',
    Preformatted:     'Preformatowany',
    Blockquote:       'Cytat blokowy',
    Table_Header:     'Nagłówek tabeli',
    URL:              'URL',
    Title:            'Tytuł',
    Alternative_Text: 'Tekst alternatywny',
    Caption:          'Tytuł tabeli',
    Summary:          'Summary',
    Number_Of_Rows:   'Liczba wierszy',
    Number_Of_Cols:   'Liczba kolumn',
    Submit:           'Wyślij',
    Cancel:           'Anuluj',
    Choose:           'Wybierz',
    Preview:          'Podgląd',
    Paste_From_Word:  'Wklej z Worda',
    Tools:            'Narzędzia',
    Containers:       'Format',
    Classes:          'Styl',
    Status:           'Status',
    Source_Code:      'Kod źródłowy'
};


WYMeditor.STRINGS['pt-br'] = {
    Strong:           'Resaltar',
    Emphasis:         'Enfatizar',
    Superscript:      'Sobre escrito',
    Subscript:        'Sub escrito ',
    Ordered_List:     'Lista ordenada',
    Unordered_List:   'Lista desordenada',
    Indent:           'Indentado',
    Outdent:          'Desidentar',
    Undo:             'Desfazer',
    Redo:             'Refazer',
    Link:             'Link',
    Unlink:           'Remover Link',
    Image:            'Imagem',
    Table:            'Tabela',
    HTML:             'HTML',
    Paragraph:        'Parágrafo',
    Heading_1:        'Título 1',
    Heading_2:        'Título 2',
    Heading_3:        'Título 3',
    Heading_4:        'Título 4',
    Heading_5:        'Título 5',
    Heading_6:        'Título 6',
    Preformatted:     'Preformatado',
    Blockquote:       'Citação',
    Table_Header:     'Título de tabela',
    URL:              'URL',
    Title:            'Título',
    Alternative_Text: 'Texto alternativo',
    Caption:          'Legenda',
    Summary:          'Summary',
    Number_Of_Rows:   'Número de linhas',
    Number_Of_Cols:   'Número de colunas',
    Submit:           'Enviar',
    Cancel:           'Cancelar',
    Choose:           'Selecionar',
    Preview:          'Previsualizar',
    Paste_From_Word:  'Copiar do Word',
    Tools:            'Ferramentas',
    Containers:       'Conteneiners',
    Classes:          'Classes',
    Status:           'Estado',
    Source_Code:      'Código fonte'
};


WYMeditor.STRINGS.pt = {
    Strong:           'Negrito',
    Emphasis:         'Itálico',
    Superscript:      'Sobrescrito',
    Subscript:        'Subsescrito',
    Ordered_List:     'Lista Numerada',
    Unordered_List:   'Lista Marcada',
    Indent:           'Aumentar Indentaçã',
    Outdent:          'Diminuir Indentaçã',
    Undo:             'Desfazer',
    Redo:             'Restaurar',
    Link:             'Link',
    Unlink:           'Tirar link',
    Image:            'Imagem',
    Table:            'Tabela',
    HTML:             'HTML',
    Paragraph:        'Parágrafo',
    Heading_1:        'Título 1',
    Heading_2:        'Título 2',
    Heading_3:        'Título 3',
    Heading_4:        'Título 4',
    Heading_5:        'Título 5',
    Heading_6:        'Título 6',
    Preformatted:     'Pré-formatado',
    Blockquote:       'Citação',
    Table_Header:     'Cabeçalho Tabela',
    URL:              'URL',
    Title:            'Título',
    Alternative_Text: 'Texto Alterativo',
    Caption:          'Título Tabela',
    Summary:          'Summary',
    Number_Of_Rows:   'Número de Linhas',
    Number_Of_Cols:   'Número de Colunas',
    Submit:           'Enviar',
    Cancel:           'Cancelar',
    Choose:           'Escolha',
    Preview:          'Prever',
    Paste_From_Word:  'Colar do Word',
    Tools:            'Ferramentas',
    Containers:       'Containers',
    Classes:          'Classes',
    Status:           'Status',
    Source_Code:      'Código Fonte'
};


WYMeditor.STRINGS.ru = {
    Strong:           'Жирный',
    Emphasis:         'Наклонный',
    Superscript:      'Надстрочный',
    Subscript:        'Подстрочный',
    Ordered_List:     'Нумерованый список',
    Unordered_List:   'Ненумерованый список',
    Indent:           'Увеличить отступ',
    Outdent:          'Уменьшить отступ',
    Undo:             'Отменить',
    Redo:             'Повторить',
    Link:             'Ссылка',
    Unlink:           'Удалить ссылку',
    Image:            'Изображение',
    Table:            'Таблица',
    HTML:             'Править HTML',
    Paragraph:        'Параграф',
    Heading_1:        'Заголовок 1',
    Heading_2:        'Заголовок 2',
    Heading_3:        'Заголовок 3',
    Heading_4:        'Заголовок 4',
    Heading_5:        'Заголовок 5',
    Heading_6:        'Заголовок 6',
    Preformatted:     'Preformatted',
    Blockquote:       'Цитата',
    Table_Header:     'Заголовок таблицы',
    URL:              'URL',
    Title:            'Заголовок',
    Alternative_Text: 'Альтернативный текст',
    Caption:          'Надпись',
    Summary:          'Summary',
    Number_Of_Rows:   'Кол-во строк',
    Number_Of_Cols:   'Кол-во столбцов',
    Submit:           'Отправить',
    Cancel:           'Отмена',
    Choose:           'Выбор',
    Preview:          'Просмотр',
    Paste_From_Word:  'Вставить из Word',
    Tools:            'Инструменты',
    Containers:       'Контейнеры',
    Classes:          'Классы',
    Status:           'Статус',
    Source_Code:      'Исходный код'
};


WYMeditor.STRINGS.sk = {
    Strong:           'Tučné',
    Emphasis:         'Kurzíva',
    Superscript:      'Horný index',
    Subscript:        'Dolný index',
    Ordered_List:     'Číslovaný zoznam',
    Unordered_List:   'Nečíslovaný zoznam',
    Indent:           'Zväčšiť odsadenie',
    Outdent:          'Zmenšiť odsadenie',
    Undo:             'Vrátiť',
    Redo:             'Opakovať',
    Link:             'Vytvoriť odkaz',
    Unlink:           'Zrušiť odkaz',
    Image:            'Obrázok',
    Table:            'Tabuľka',
    HTML:             'HTML',
    Paragraph:        'Odstavec',
    Heading_1:        'Nadpis 1. úrovne',
    Heading_2:        'Nadpis 2. úrovne',
    Heading_3:        'Nadpis 3. úrovne',
    Heading_4:        'Nadpis 4. úrovne',
    Heading_5:        'Nadpis 5. úrovne',
    Heading_6:        'Nadpis 6. úrovne',
    Preformatted:     'Predformátovaný text',
    Blockquote:       'Citácia',
    Table_Header:     'Hlavička tabuľky',
    URL:              'URL adresa',
    Title:            'Titulok',
    Alternative_Text: 'Alternatívny text',
    Caption:          'Titulok tabuľky',
    Summary:          'Zhrnutie obsahu',
    Number_Of_Rows:   'Počet riadkov',
    Number_Of_Cols:   'Počet stĺpcov',
    Submit:           'Odoslať',
    Cancel:           'Zrušiť',
    Choose:           'Vybrať',
    Preview:          'Náhľad',
    Paste_From_Word:  'Vložiť z Wordu',
    Tools:            'Nástroje',
    Containers:       'Typy obsahu',
    Classes:          'Triedy',
    Status:           'Stav',
    Source_Code:      'Zdrojový kód'
};


WYMeditor.STRINGS.sv = {
    Strong:           'Viktigt',
    Emphasis:         'Betoning',
    Superscript:      'Upphöjt',
    Subscript:        'Nedsänkt',
    Ordered_List:     'Nummerlista',
    Unordered_List:   'Punktlista',
    Indent:           'Indrag',
    Outdent:          'Utdrag',
    Undo:             'Ångra',
    Redo:             'Gör om',
    Link:             'Länk',
    Unlink:           'Ta bort länk',
    Image:            'Bild',
    Table:            'Tabell',
    HTML:             'HTML',
    Paragraph:        'Paragraf',
    Heading_1:        'Rubrik 1',
    Heading_2:        'Rubrik 2',
    Heading_3:        'Rubrik 3',
    Heading_4:        'Rubrik 4',
    Heading_5:        'Rubrik 5',
    Heading_6:        'Rubrik 6',
    Preformatted:     'Förformaterad',
    Blockquote:       'Blockcitat',
    Table_Header:     'Tabellrubrik',
    URL:              'URL',
    Title:            'Titel',
    Relationship:     'Relation',
    Alternative_Text: 'Alternativ text',
    Caption:          'Överskrift',
    Summary:          'Summary',
    Number_Of_Rows:   'Antal rader',
    Number_Of_Cols:   'Antal kolumner',
    Submit:           'Skicka',
    Cancel:           'Avbryt',
    Choose:           'Välj',
    Preview:          'Förhandsgranska',
    Paste_From_Word:  'Klistra in från Word',
    Tools:            'Verktyg',
    Containers:       'Formatering',
    Classes:          'Klasser',
    Status:           'Status',
    Source_Code:      'Källkod'
};


WYMeditor.STRINGS.tr = {
    Strong: 'Kalın',
    Emphasis: 'Vurgu',
    Superscript: 'Üstsimge',
    Subscript: 'Altsimge',
    Ordered_List: 'Sıralı List',
    Unordered_List: 'Sırasız List',
    Indent: 'Girintile',
    Outdent: 'Çıkıntıla',
    Undo: 'Geri Al',
    Redo: 'Yinele',
    Link: 'Bağlantı',
    Unlink: 'Bağlantıyı Kaldır',
    Image: 'Resim',
    Table: 'Tablo',
    HTML: 'HTML',
    Paragraph: 'Parağraf',
    Heading_1: 'Başlık 1',
    Heading_2: 'Başlık 2',
    Heading_3: 'Başlık 3',
    Heading_4: 'Başlık 4',
    Heading_5: 'Başlık 5',
    Heading_6: 'Başlık 6',
    Preformatted: 'Önceden Formatlı',
    Blockquote: 'Alıntı',
    Table_Header: 'Tablo Başlığı',
    URL: 'URL',
    Title: 'Başlık',
    Alternative_Text: 'Alternatif Metin',
    Caption: 'Etiket',
    Summary: 'Özet',
    Number_Of_Rows: 'Satır sayısı',
    Number_Of_Cols: 'Sütun sayısı',
    Submit: 'Gönder',
    Cancel: 'İptal',
    Choose: 'Seç',
    Preview: 'Önizleme',
    Paste_From_Word: 'Word\'den yapıştır',
    Tools: 'Araçlar',
    Containers: 'Kapsayıcılar',
    Classes: 'Sınıflar',
    Status: 'Durum',
    Source_Code: 'Kaynak Kodu'
};


WYMeditor.STRINGS.zh_cn = {
    Strong: '加粗',
    Emphasis: '斜体',
    Superscript: '上标',
    Subscript: '下标',
    Ordered_List: '有序列表',
    Unordered_List: '无序列表',
    Indent: '增加缩进',
    Outdent: '减少缩进',
    Undo: '撤消',
    Redo: '重做',
    Link: '链接',
    Unlink: '取消链接',
    Image: '图片',
    Table: '表格',
    HTML: 'HTML源代码',
    Paragraph: '段落',
    Heading_1: '标题 1',
    Heading_2: '标题 2',
    Heading_3: '标题 3',
    Heading_4: '标题 4',
    Heading_5: '标题 5',
    Heading_6: '标题 6',
    Preformatted: '原始文本',
    Blockquote: '引语',
    Table_Header: '表头',
    URL: '地址',
    Title: '提示文字',
    Alternative_Text: '失效文字',
    Caption: '标题',
    Summary: 'Summary',
    Number_Of_Rows: '行数',
    Number_Of_Cols: '列数',
    Submit: '提交',
    Cancel: '放弃',
    Choose: '选择',
    Preview: '预览',
    Paste_From_Word: '从Word粘贴纯文本',
    Tools: '工具',
    Containers: '容器',
    Classes: '预定义样式',
    Status: '状态',
    Source_Code: '源代码',
    Attachment: '附件',
    NewParagraph: '新段落'
};


WYMeditor.STRINGS.zh_tw = {
    Strong: '加粗',
    Emphasis: '斜體',
    Superscript: '上標',
    Subscript: '下標',
    Ordered_List: '有序列表',
    Unordered_List: '無序列表',
    Indent: '增加縮排',
    Outdent: '減少縮排',
    Undo: '取消',
    Redo: '重做',
    Link: '鏈結',
    Unlink: '取消鏈結',
    Image: '圖片',
    Table: '表格',
    HTML: 'HTML 源代碼',
    Paragraph: '段落',
    Heading_1: '標題 1',
    Heading_2: '標題 2',
    Heading_3: '標題 3',
    Heading_4: '標題 4',
    Heading_5: '標題 5',
    Heading_6: '標題 6',
    Preformatted: '原始文本',
    Blockquote: '引語',
    Table_Header: '表格頂部',
    URL: '地址',
    Title: '提示文字',
    Alternative_Text: '失效文字',
    Caption: '主題',
    Summary: '大綱',
    Number_Of_Rows: '行數',
    Number_Of_Cols: '列數',
    Submit: '提交',
    Cancel: '放棄',
    Choose: '選擇',
    Preview: '預覽',
    Paste_From_Word: '從Word複制純文本',
    Tools: '工具',
    Containers: '容器',
    Classes: '預定義樣式',
    Status: '狀態',
    Source_Code: '源代碼',
    Attachment: '附件',
    NewParagraph: '新段落'
};

/**
 * @license Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Copyright 2011, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.2
 * Build date: 13 November 2011
 */
window['rangy'] = (function() {


    var OBJECT = "object", FUNCTION = "function", UNDEFINED = "undefined";

    var domRangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer", "START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"];

    var domRangeMethods = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore",
        "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents",
        "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"];

    var textRangeProperties = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"];

    // Subset of TextRange's full set of methods that we're interested in
    var textRangeMethods = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark",
        "moveToElementText", "parentElement", "pasteHTML", "select", "setEndPoint", "getBoundingClientRect"];

    /*----------------------------------------------------------------------------------------------------------------*/

    // Trio of functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(o, p) {
        var t = typeof o[p];
        return t == FUNCTION || (!!(t == OBJECT && o[p])) || t == "unknown";
    }

    function isHostObject(o, p) {
        return !!(typeof o[p] == OBJECT && o[p]);
    }

    function isHostProperty(o, p) {
        return typeof o[p] != UNDEFINED;
    }

    // Creates a convenience function to save verbose repeated calls to tests functions
    function createMultiplePropertyTest(testFunc) {
        return function(o, props) {
            var i = props.length;
            while (i--) {
                if (!testFunc(o, props[i])) {
                    return false;
                }
            }
            return true;
        };
    }

    // Next trio of functions are a convenience to save verbose repeated calls to previous two functions
    var areHostMethods = createMultiplePropertyTest(isHostMethod);
    var areHostObjects = createMultiplePropertyTest(isHostObject);
    var areHostProperties = createMultiplePropertyTest(isHostProperty);

    function isTextRange(range) {
        return range && areHostMethods(range, textRangeMethods) && areHostProperties(range, textRangeProperties);
    }

    var api = {
        version: "1.2.2",
        initialized: false,
        supported: true,

        util: {
            isHostMethod: isHostMethod,
            isHostObject: isHostObject,
            isHostProperty: isHostProperty,
            areHostMethods: areHostMethods,
            areHostObjects: areHostObjects,
            areHostProperties: areHostProperties,
            isTextRange: isTextRange
        },

        features: {},

        modules: {},
        config: {
            alertOnWarn: false,
            preferTextRange: false
        }
    };

    function fail(reason) {
        window.alert("Rangy not supported in your browser. Reason: " + reason);
        api.initialized = true;
        api.supported = false;
    }

    api.fail = fail;

    function warn(msg) {
        var warningMessage = "Rangy warning: " + msg;
        if (api.config.alertOnWarn) {
            window.alert(warningMessage);
        } else if (typeof window.console != UNDEFINED && typeof window.console.log != UNDEFINED) {
            window.console.log(warningMessage);
        }
    }

    api.warn = warn;

    if ({}.hasOwnProperty) {
        api.util.extend = function(o, props) {
            for (var i in props) {
                if (props.hasOwnProperty(i)) {
                    o[i] = props[i];
                }
            }
        };
    } else {
        fail("hasOwnProperty not supported");
    }

    var initListeners = [];
    var moduleInitializers = [];

    // Initialization
    function init() {
        if (api.initialized) {
            return;
        }
        var testRange;
        var implementsDomRange = false, implementsTextRange = false;

        // First, perform basic feature tests

        if (isHostMethod(document, "createRange")) {
            testRange = document.createRange();
            if (areHostMethods(testRange, domRangeMethods) && areHostProperties(testRange, domRangeProperties)) {
                implementsDomRange = true;
            }
            testRange.detach();
        }

        var body = isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];

        if (body && isHostMethod(body, "createTextRange")) {
            testRange = body.createTextRange();
            if (isTextRange(testRange)) {
                implementsTextRange = true;
            }
        }

        if (!implementsDomRange && !implementsTextRange) {
            fail("Neither Range nor TextRange are implemented");
        }

        api.initialized = true;
        api.features = {
            implementsDomRange: implementsDomRange,
            implementsTextRange: implementsTextRange
        };

        // Initialize modules and call init listeners
        var allListeners = moduleInitializers.concat(initListeners);
        for (var i = 0, len = allListeners.length; i < len; ++i) {
            try {
                allListeners[i](api);
            } catch (ex) {
                if (isHostObject(window, "console") && isHostMethod(window.console, "log")) {
                    window.console.log("Init listener threw an exception. Continuing.", ex);
                }

            }
        }
    }

    // Allow external scripts to initialize this library in case it's loaded after the document has loaded
    api.init = init;

    // Execute listener immediately if already initialized
    api.addInitListener = function(listener) {
        if (api.initialized) {
            listener(api);
        } else {
            initListeners.push(listener);
        }
    };

    var createMissingNativeApiListeners = [];

    api.addCreateMissingNativeApiListener = function(listener) {
        createMissingNativeApiListeners.push(listener);
    };

    function createMissingNativeApi(win) {
        win = win || window;
        init();

        // Notify listeners
        for (var i = 0, len = createMissingNativeApiListeners.length; i < len; ++i) {
            createMissingNativeApiListeners[i](win);
        }
    }

    api.createMissingNativeApi = createMissingNativeApi;

    /**
     * @constructor
     */
    function Module(name) {
        this.name = name;
        this.initialized = false;
        this.supported = false;
    }

    Module.prototype.fail = function(reason) {
        this.initialized = true;
        this.supported = false;

        throw new Error("Module '" + this.name + "' failed to load: " + reason);
    };

    Module.prototype.warn = function(msg) {
        api.warn("Module " + this.name + ": " + msg);
    };

    Module.prototype.createError = function(msg) {
        return new Error("Error in Rangy " + this.name + " module: " + msg);
    };

    api.createModule = function(name, initFunc) {
        var module = new Module(name);
        api.modules[name] = module;

        moduleInitializers.push(function(api) {
            initFunc(api, module);
            module.initialized = true;
            module.supported = true;
        });
    };

    api.requireModules = function(modules) {
        for (var i = 0, len = modules.length, module, moduleName; i < len; ++i) {
            moduleName = modules[i];
            module = api.modules[moduleName];
            if (!module || !(module instanceof Module)) {
                throw new Error("Module '" + moduleName + "' not found");
            }
            if (!module.supported) {
                throw new Error("Module '" + moduleName + "' not supported");
            }
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Wait for document to load before running tests

    var docReady = false;

    var loadHandler = function(e) {

        if (!docReady) {
            docReady = true;
            if (!api.initialized) {
                init();
            }
        }
    };

    // Test whether we have window and document objects that we will need
    if (typeof window == UNDEFINED) {
        fail("No window found");
        return;
    }
    if (typeof document == UNDEFINED) {
        fail("No document found");
        return;
    }

    if (isHostMethod(document, "addEventListener")) {
        document.addEventListener("DOMContentLoaded", loadHandler, false);
    }

    // Add a fallback in case the DOMContentLoaded event isn't supported
    if (isHostMethod(window, "addEventListener")) {
        window.addEventListener("load", loadHandler, false);
    } else if (isHostMethod(window, "attachEvent")) {
        window.attachEvent("onload", loadHandler);
    } else {
        fail("Window does not have required addEventListener or attachEvent method");
    }

    return api;
})();
rangy.createModule("DomUtil", function(api, module) {

    var UNDEF = "undefined";
    var util = api.util;

    // Perform feature tests
    if (!util.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"])) {
        module.fail("document missing a Node creation method");
    }

    if (!util.isHostMethod(document, "getElementsByTagName")) {
        module.fail("document missing getElementsByTagName method");
    }

    var el = document.createElement("div");
    if (!util.areHostMethods(el, ["insertBefore", "appendChild", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]))) {
        module.fail("Incomplete Element implementation");
    }

    // innerHTML is required for Range's createContextualFragment method
    if (!util.isHostProperty(el, "innerHTML")) {
        module.fail("Element is missing innerHTML property");
    }

    var textNode = document.createTextNode("test");
    if (!util.areHostMethods(textNode, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] ||
            !util.areHostObjects(el, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) ||
            !util.areHostProperties(textNode, ["data"]))) {
        module.fail("Incomplete Text Node implementation");
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Removed use of indexOf because of a bizarre bug in Opera that is thrown in one of the Acid3 tests. I haven't been
    // able to replicate it outside of the test. The bug is that indexOf returns -1 when called on an Array that
    // contains just the document as a single element and the value searched for is the document.
    var arrayContains = /*Array.prototype.indexOf ?
        function(arr, val) {
            return arr.indexOf(val) > -1;
        }:*/

        function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

    // Opera 11 puts HTML elements in the null namespace, it seems, and IE 7 has undefined namespaceURI
    function isHtmlNamespace(node) {
        var ns;
        return typeof node.namespaceURI == UNDEF || ((ns = node.namespaceURI) === null || ns == "http://www.w3.org/1999/xhtml");
    }

    function parentElement(node) {
        var parent = node.parentNode;
        return (parent.nodeType == 1) ? parent : null;
    }

    function getNodeIndex(node) {
        var i = 0;
        while( (node = node.previousSibling) ) {
            i++;
        }
        return i;
    }

    function getNodeLength(node) {
        var childNodes;
        return isCharacterDataNode(node) ? node.length : ((childNodes = node.childNodes) ? childNodes.length : 0);
    }

    function getCommonAncestor(node1, node2) {
        var ancestors = [], n;
        for (n = node1; n; n = n.parentNode) {
            ancestors.push(n);
        }

        for (n = node2; n; n = n.parentNode) {
            if (arrayContains(ancestors, n)) {
                return n;
            }
        }

        return null;
    }

    function isAncestorOf(ancestor, descendant, selfIsAncestor) {
        var n = selfIsAncestor ? descendant : descendant.parentNode;
        while (n) {
            if (n === ancestor) {
                return true;
            } else {
                n = n.parentNode;
            }
        }
        return false;
    }

    function getClosestAncestorIn(node, ancestor, selfIsAncestor) {
        var p, n = selfIsAncestor ? node : node.parentNode;
        while (n) {
            p = n.parentNode;
            if (p === ancestor) {
                return n;
            }
            n = p;
        }
        return null;
    }

    function isCharacterDataNode(node) {
        var t = node.nodeType;
        return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
    }

    function insertAfter(node, precedingNode) {
        var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
        if (nextNode) {
            parent.insertBefore(node, nextNode);
        } else {
            parent.appendChild(node);
        }
        return node;
    }

    // Note that we cannot use splitText() because it is bugridden in IE 9.
    function splitDataNode(node, index) {
        var newNode = node.cloneNode(false);
        newNode.deleteData(0, index);
        node.deleteData(index, node.length - index);
        insertAfter(newNode, node);
        return newNode;
    }

    function getDocument(node) {
        if (node.nodeType == 9) {
            return node;
        } else if (typeof node.ownerDocument != UNDEF) {
            return node.ownerDocument;
        } else if (typeof node.document != UNDEF) {
            return node.document;
        } else if (node.parentNode) {
            return getDocument(node.parentNode);
        } else {
            throw new Error("getDocument: no document found for node");
        }
    }

    function getWindow(node) {
        var doc = getDocument(node);
        if (typeof doc.defaultView != UNDEF) {
            return doc.defaultView;
        } else if (typeof doc.parentWindow != UNDEF) {
            return doc.parentWindow;
        } else {
            throw new Error("Cannot get a window object for node");
        }
    }

    function getIframeDocument(iframeEl) {
        if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument;
        } else if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow.document;
        } else {
            throw new Error("getIframeWindow: No Document object found for iframe element");
        }
    }

    function getIframeWindow(iframeEl) {
        if (typeof iframeEl.contentWindow != UNDEF) {
            return iframeEl.contentWindow;
        } else if (typeof iframeEl.contentDocument != UNDEF) {
            return iframeEl.contentDocument.defaultView;
        } else {
            throw new Error("getIframeWindow: No Window object found for iframe element");
        }
    }

    function getBody(doc) {
        return util.isHostObject(doc, "body") ? doc.body : doc.getElementsByTagName("body")[0];
    }

    function getRootContainer(node) {
        var parent;
        while ( (parent = node.parentNode) ) {
            node = parent;
        }
        return node;
    }

    function comparePoints(nodeA, offsetA, nodeB, offsetB) {
        // See http://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level-2-Range-Comparing
        var nodeC, root, childA, childB, n;
        if (nodeA == nodeB) {

            // Case 1: nodes are the same
            return offsetA === offsetB ? 0 : (offsetA < offsetB) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeB, nodeA, true)) ) {

            // Case 2: node C (container B or an ancestor) is a child node of A
            return offsetA <= getNodeIndex(nodeC) ? -1 : 1;
        } else if ( (nodeC = getClosestAncestorIn(nodeA, nodeB, true)) ) {

            // Case 3: node C (container A or an ancestor) is a child node of B
            return getNodeIndex(nodeC) < offsetB  ? -1 : 1;
        } else {

            // Case 4: containers are siblings or descendants of siblings
            root = getCommonAncestor(nodeA, nodeB);
            childA = (nodeA === root) ? root : getClosestAncestorIn(nodeA, root, true);
            childB = (nodeB === root) ? root : getClosestAncestorIn(nodeB, root, true);

            if (childA === childB) {
                // This shouldn't be possible

                throw new Error("comparePoints got to case 4 and childA and childB are the same!");
            } else {
                n = root.firstChild;
                while (n) {
                    if (n === childA) {
                        return -1;
                    } else if (n === childB) {
                        return 1;
                    }
                    n = n.nextSibling;
                }
                throw new Error("Should not be here!");
            }
        }
    }

    function fragmentFromNodeChildren(node) {
        var fragment = getDocument(node).createDocumentFragment(), child;
        while ( (child = node.firstChild) ) {
            fragment.appendChild(child);
        }
        return fragment;
    }

    function inspectNode(node) {
        if (!node) {
            return "[No node]";
        }
        if (isCharacterDataNode(node)) {
            return '"' + node.data + '"';
        } else if (node.nodeType == 1) {
            var idAttr = node.id ? ' id="' + node.id + '"' : "";
            return "<" + node.nodeName + idAttr + ">[" + node.childNodes.length + "]";
        } else {
            return node.nodeName;
        }
    }

    /**
     * @constructor
     */
    function NodeIterator(root) {
        this.root = root;
        this._next = root;
    }

    NodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            var n = this._current = this._next;
            var child, next;
            if (this._current) {
                child = n.firstChild;
                if (child) {
                    this._next = child;
                } else {
                    next = null;
                    while ((n !== this.root) && !(next = n.nextSibling)) {
                        n = n.parentNode;
                    }
                    this._next = next;
                }
            }
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.root = null;
        }
    };

    function createIterator(root) {
        return new NodeIterator(root);
    }

    /**
     * @constructor
     */
    function DomPosition(node, offset) {
        this.node = node;
        this.offset = offset;
    }

    DomPosition.prototype = {
        equals: function(pos) {
            return this.node === pos.node & this.offset == pos.offset;
        },

        inspect: function() {
            return "[DomPosition(" + inspectNode(this.node) + ":" + this.offset + ")]";
        }
    };

    /**
     * @constructor
     */
    function DOMException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "DOMException: " + this.codeName;
    }

    DOMException.prototype = {
        INDEX_SIZE_ERR: 1,
        HIERARCHY_REQUEST_ERR: 3,
        WRONG_DOCUMENT_ERR: 4,
        NO_MODIFICATION_ALLOWED_ERR: 7,
        NOT_FOUND_ERR: 8,
        NOT_SUPPORTED_ERR: 9,
        INVALID_STATE_ERR: 11
    };

    DOMException.prototype.toString = function() {
        return this.message;
    };

    api.dom = {
        arrayContains: arrayContains,
        isHtmlNamespace: isHtmlNamespace,
        parentElement: parentElement,
        getNodeIndex: getNodeIndex,
        getNodeLength: getNodeLength,
        getCommonAncestor: getCommonAncestor,
        isAncestorOf: isAncestorOf,
        getClosestAncestorIn: getClosestAncestorIn,
        isCharacterDataNode: isCharacterDataNode,
        insertAfter: insertAfter,
        splitDataNode: splitDataNode,
        getDocument: getDocument,
        getWindow: getWindow,
        getIframeWindow: getIframeWindow,
        getIframeDocument: getIframeDocument,
        getBody: getBody,
        getRootContainer: getRootContainer,
        comparePoints: comparePoints,
        inspectNode: inspectNode,
        fragmentFromNodeChildren: fragmentFromNodeChildren,
        createIterator: createIterator,
        DomPosition: DomPosition
    };

    api.DOMException = DOMException;
});rangy.createModule("DomRange", function(api, module) {
    api.requireModules( ["DomUtil"] );


    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DOMException = api.DOMException;
    
    /*----------------------------------------------------------------------------------------------------------------*/

    // Utility functions

    function isNonTextPartiallySelected(node, range) {
        return (node.nodeType != 3) &&
               (dom.isAncestorOf(node, range.startContainer, true) || dom.isAncestorOf(node, range.endContainer, true));
    }

    function getRangeDocument(range) {
        return dom.getDocument(range.startContainer);
    }

    function dispatchEvent(range, type, args) {
        var listeners = range._listeners[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; ++i) {
                listeners[i].call(range, {target: range, args: args});
            }
        }
    }

    function getBoundaryBeforeNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node));
    }

    function getBoundaryAfterNode(node) {
        return new DomPosition(node.parentNode, dom.getNodeIndex(node) + 1);
    }

    function insertNodeAtPosition(node, n, o) {
        var firstNodeInserted = node.nodeType == 11 ? node.firstChild : node;
        if (dom.isCharacterDataNode(n)) {
            if (o == n.length) {
                dom.insertAfter(node, n);
            } else {
                n.parentNode.insertBefore(node, o == 0 ? n : dom.splitDataNode(n, o));
            }
        } else if (o >= n.childNodes.length) {
            n.appendChild(node);
        } else {
            n.insertBefore(node, n.childNodes[o]);
        }
        return firstNodeInserted;
    }

    function cloneSubtree(iterator) {
        var partiallySelected;
        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {
            partiallySelected = iterator.isPartiallySelectedSubtree();

            node = node.cloneNode(!partiallySelected);
            if (partiallySelected) {
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(cloneSubtree(subIterator));
                subIterator.detach(true);
            }

            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function iterateSubtree(rangeIterator, func, iteratorState) {
        var it, n;
        iteratorState = iteratorState || { stop: false };
        for (var node, subRangeIterator; node = rangeIterator.next(); ) {
            //log.debug("iterateSubtree, partially selected: " + rangeIterator.isPartiallySelectedSubtree(), nodeToString(node));
            if (rangeIterator.isPartiallySelectedSubtree()) {
                // The node is partially selected by the Range, so we can use a new RangeIterator on the portion of the
                // node selected by the Range.
                if (func(node) === false) {
                    iteratorState.stop = true;
                    return;
                } else {
                    subRangeIterator = rangeIterator.getSubtreeIterator();
                    iterateSubtree(subRangeIterator, func, iteratorState);
                    subRangeIterator.detach(true);
                    if (iteratorState.stop) {
                        return;
                    }
                }
            } else {
                // The whole node is selected, so we can use efficient DOM iteration to iterate over the node and its
                // descendant
                it = dom.createIterator(node);
                while ( (n = it.next()) ) {
                    if (func(n) === false) {
                        iteratorState.stop = true;
                        return;
                    }
                }
            }
        }
    }

    function deleteSubtree(iterator) {
        var subIterator;
        while (iterator.next()) {
            if (iterator.isPartiallySelectedSubtree()) {
                subIterator = iterator.getSubtreeIterator();
                deleteSubtree(subIterator);
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
        }
    }

    function extractSubtree(iterator) {

        for (var node, frag = getRangeDocument(iterator.range).createDocumentFragment(), subIterator; node = iterator.next(); ) {


            if (iterator.isPartiallySelectedSubtree()) {
                node = node.cloneNode(false);
                subIterator = iterator.getSubtreeIterator();
                node.appendChild(extractSubtree(subIterator));
                subIterator.detach(true);
            } else {
                iterator.remove();
            }
            if (node.nodeType == 10) { // DocumentType
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }
            frag.appendChild(node);
        }
        return frag;
    }

    function getNodesInRange(range, nodeTypes, filter) {
        //log.info("getNodesInRange, " + nodeTypes.join(","));
        var filterNodeTypes = !!(nodeTypes && nodeTypes.length), regex;
        var filterExists = !!filter;
        if (filterNodeTypes) {
            regex = new RegExp("^(" + nodeTypes.join("|") + ")$");
        }

        var nodes = [];
        iterateSubtree(new RangeIterator(range, false), function(node) {
            if ((!filterNodeTypes || regex.test(node.nodeType)) && (!filterExists || filter(node))) {
                nodes.push(node);
            }
        });
        return nodes;
    }

    function inspect(range) {
        var name = (typeof range.getName == "undefined") ? "Range" : range.getName();
        return "[" + name + "(" + dom.inspectNode(range.startContainer) + ":" + range.startOffset + ", " +
                dom.inspectNode(range.endContainer) + ":" + range.endOffset + ")]";
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // RangeIterator code partially borrows from IERange by Tim Ryan (http://github.com/timcameronryan/IERange)

    /**
     * @constructor
     */
    function RangeIterator(range, clonePartiallySelectedTextNodes) {
        this.range = range;
        this.clonePartiallySelectedTextNodes = clonePartiallySelectedTextNodes;



        if (!range.collapsed) {
            this.sc = range.startContainer;
            this.so = range.startOffset;
            this.ec = range.endContainer;
            this.eo = range.endOffset;
            var root = range.commonAncestorContainer;

            if (this.sc === this.ec && dom.isCharacterDataNode(this.sc)) {
                this.isSingleCharacterDataNode = true;
                this._first = this._last = this._next = this.sc;
            } else {
                this._first = this._next = (this.sc === root && !dom.isCharacterDataNode(this.sc)) ?
                    this.sc.childNodes[this.so] : dom.getClosestAncestorIn(this.sc, root, true);
                this._last = (this.ec === root && !dom.isCharacterDataNode(this.ec)) ?
                    this.ec.childNodes[this.eo - 1] : dom.getClosestAncestorIn(this.ec, root, true);
            }

        }
    }

    RangeIterator.prototype = {
        _current: null,
        _next: null,
        _first: null,
        _last: null,
        isSingleCharacterDataNode: false,

        reset: function() {
            this._current = null;
            this._next = this._first;
        },

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            // Move to next node
            var current = this._current = this._next;
            if (current) {
                this._next = (current !== this._last) ? current.nextSibling : null;

                // Check for partially selected text nodes
                if (dom.isCharacterDataNode(current) && this.clonePartiallySelectedTextNodes) {
                    if (current === this.ec) {

                        (current = current.cloneNode(true)).deleteData(this.eo, current.length - this.eo);
                    }
                    if (this._current === this.sc) {

                        (current = current.cloneNode(true)).deleteData(0, this.so);
                    }
                }
            }

            return current;
        },

        remove: function() {
            var current = this._current, start, end;

            if (dom.isCharacterDataNode(current) && (current === this.sc || current === this.ec)) {
                start = (current === this.sc) ? this.so : 0;
                end = (current === this.ec) ? this.eo : current.length;
                if (start != end) {
                    current.deleteData(start, end - start);
                }
            } else {
                if (current.parentNode) {
                    current.parentNode.removeChild(current);
                } else {

                }
            }
        },

        // Checks if the current node is partially selected
        isPartiallySelectedSubtree: function() {
            var current = this._current;
            return isNonTextPartiallySelected(current, this.range);
        },

        getSubtreeIterator: function() {
            var subRange;
            if (this.isSingleCharacterDataNode) {
                subRange = this.range.cloneRange();
                subRange.collapse();
            } else {
                subRange = new Range(getRangeDocument(this.range));
                var current = this._current;
                var startContainer = current, startOffset = 0, endContainer = current, endOffset = dom.getNodeLength(current);

                if (dom.isAncestorOf(current, this.sc, true)) {
                    startContainer = this.sc;
                    startOffset = this.so;
                }
                if (dom.isAncestorOf(current, this.ec, true)) {
                    endContainer = this.ec;
                    endOffset = this.eo;
                }

                updateBoundaries(subRange, startContainer, startOffset, endContainer, endOffset);
            }
            return new RangeIterator(subRange, this.clonePartiallySelectedTextNodes);
        },

        detach: function(detachRange) {
            if (detachRange) {
                this.range.detach();
            }
            this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null;
        }
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    // Exceptions

    /**
     * @constructor
     */
    function RangeException(codeName) {
        this.code = this[codeName];
        this.codeName = codeName;
        this.message = "RangeException: " + this.codeName;
    }

    RangeException.prototype = {
        BAD_BOUNDARYPOINTS_ERR: 1,
        INVALID_NODE_TYPE_ERR: 2
    };

    RangeException.prototype.toString = function() {
        return this.message;
    };

    /*----------------------------------------------------------------------------------------------------------------*/

    /**
     * Currently iterates through all nodes in the range on creation until I think of a decent way to do it
     * TODO: Look into making this a proper iterator, not requiring preloading everything first
     * @constructor
     */
    function RangeNodeIterator(range, nodeTypes, filter) {
        this.nodes = getNodesInRange(range, nodeTypes, filter);
        this._next = this.nodes[0];
        this._position = 0;
    }

    RangeNodeIterator.prototype = {
        _current: null,

        hasNext: function() {
            return !!this._next;
        },

        next: function() {
            this._current = this._next;
            this._next = this.nodes[ ++this._position ];
            return this._current;
        },

        detach: function() {
            this._current = this._next = this.nodes = null;
        }
    };

    var beforeAfterNodeTypes = [1, 3, 4, 5, 7, 8, 10];
    var rootContainerNodeTypes = [2, 9, 11];
    var readonlyNodeTypes = [5, 6, 10, 12];
    var insertableNodeTypes = [1, 3, 4, 5, 7, 8, 10, 11];
    var surroundNodeTypes = [1, 3, 4, 5, 7, 8];

    function createAncestorFinder(nodeTypes) {
        return function(node, selfIsAncestor) {
            var t, n = selfIsAncestor ? node : node.parentNode;
            while (n) {
                t = n.nodeType;
                if (dom.arrayContains(nodeTypes, t)) {
                    return n;
                }
                n = n.parentNode;
            }
            return null;
        };
    }

    var getRootContainer = dom.getRootContainer;
    var getDocumentOrFragmentContainer = createAncestorFinder( [9, 11] );
    var getReadonlyAncestor = createAncestorFinder(readonlyNodeTypes);
    var getDocTypeNotationEntityAncestor = createAncestorFinder( [6, 10, 12] );

    function assertNoDocTypeNotationEntityAncestor(node, allowSelf) {
        if (getDocTypeNotationEntityAncestor(node, allowSelf)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertNotDetached(range) {
        if (!range.startContainer) {
            throw new DOMException("INVALID_STATE_ERR");
        }
    }

    function assertValidNodeType(node, invalidTypes) {
        if (!dom.arrayContains(invalidTypes, node.nodeType)) {
            throw new RangeException("INVALID_NODE_TYPE_ERR");
        }
    }

    function assertValidOffset(node, offset) {
        if (offset < 0 || offset > (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length)) {
            throw new DOMException("INDEX_SIZE_ERR");
        }
    }

    function assertSameDocumentOrFragment(node1, node2) {
        if (getDocumentOrFragmentContainer(node1, true) !== getDocumentOrFragmentContainer(node2, true)) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    function assertNodeNotReadOnly(node) {
        if (getReadonlyAncestor(node, true)) {
            throw new DOMException("NO_MODIFICATION_ALLOWED_ERR");
        }
    }

    function assertNode(node, codeName) {
        if (!node) {
            throw new DOMException(codeName);
        }
    }

    function isOrphan(node) {
        return !dom.arrayContains(rootContainerNodeTypes, node.nodeType) && !getDocumentOrFragmentContainer(node, true);
    }

    function isValidOffset(node, offset) {
        return offset <= (dom.isCharacterDataNode(node) ? node.length : node.childNodes.length);
    }

    function assertRangeValid(range) {
        assertNotDetached(range);
        if (isOrphan(range.startContainer) || isOrphan(range.endContainer) ||
                !isValidOffset(range.startContainer, range.startOffset) ||
                !isValidOffset(range.endContainer, range.endOffset)) {
            throw new Error("Range error: Range is no longer valid after DOM mutation (" + range.inspect() + ")");
        }
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Test the browser's innerHTML support to decide how to implement createContextualFragment
    var styleEl = document.createElement("style");
    var htmlParsingConforms = false;
    try {
        styleEl.innerHTML = "<b>x</b>";
        htmlParsingConforms = (styleEl.firstChild.nodeType == 3); // Opera incorrectly creates an element node
    } catch (e) {
        // IE 6 and 7 throw
    }

    api.features.htmlParsingConforms = htmlParsingConforms;

    var createContextualFragment = htmlParsingConforms ?

        // Implementation as per HTML parsing spec, trusting in the browser's implementation of innerHTML. See
        // discussion and base code for this implementation at issue 67.
        // Spec: http://html5.org/specs/dom-parsing.html#extensions-to-the-range-interface
        // Thanks to Aleks Williams.
        function(fragmentStr) {
            // "Let node the context object's start's node."
            var node = this.startContainer;
            var doc = dom.getDocument(node);

            // "If the context object's start's node is null, raise an INVALID_STATE_ERR
            // exception and abort these steps."
            if (!node) {
                throw new DOMException("INVALID_STATE_ERR");
            }

            // "Let element be as follows, depending on node's interface:"
            // Document, Document Fragment: null
            var el = null;

            // "Element: node"
            if (node.nodeType == 1) {
                el = node;

            // "Text, Comment: node's parentElement"
            } else if (dom.isCharacterDataNode(node)) {
                el = dom.parentElement(node);
            }

            // "If either element is null or element's ownerDocument is an HTML document
            // and element's local name is "html" and element's namespace is the HTML
            // namespace"
            if (el === null || (
                el.nodeName == "HTML"
                && dom.isHtmlNamespace(dom.getDocument(el).documentElement)
                && dom.isHtmlNamespace(el)
            )) {

            // "let element be a new Element with "body" as its local name and the HTML
            // namespace as its namespace.""
                el = doc.createElement("body");
            } else {
                el = el.cloneNode(false);
            }

            // "If the node's document is an HTML document: Invoke the HTML fragment parsing algorithm."
            // "If the node's document is an XML document: Invoke the XML fragment parsing algorithm."
            // "In either case, the algorithm must be invoked with fragment as the input
            // and element as the context element."
            el.innerHTML = fragmentStr;

            // "If this raises an exception, then abort these steps. Otherwise, let new
            // children be the nodes returned."

            // "Let fragment be a new DocumentFragment."
            // "Append all new children to fragment."
            // "Return fragment."
            return dom.fragmentFromNodeChildren(el);
        } :

        // In this case, innerHTML cannot be trusted, so fall back to a simpler, non-conformant implementation that
        // previous versions of Rangy used (with the exception of using a body element rather than a div)
        function(fragmentStr) {
            assertNotDetached(this);
            var doc = getRangeDocument(this);
            var el = doc.createElement("body");
            el.innerHTML = fragmentStr;

            return dom.fragmentFromNodeChildren(el);
        };

    /*----------------------------------------------------------------------------------------------------------------*/

    var rangeProperties = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed",
        "commonAncestorContainer"];

    var s2s = 0, s2e = 1, e2e = 2, e2s = 3;
    var n_b = 0, n_a = 1, n_b_a = 2, n_i = 3;

    function RangePrototype() {}

    RangePrototype.prototype = {
        attachListener: function(type, listener) {
            this._listeners[type].push(listener);
        },

        compareBoundaryPoints: function(how, range) {
            assertRangeValid(this);
            assertSameDocumentOrFragment(this.startContainer, range.startContainer);

            var nodeA, offsetA, nodeB, offsetB;
            var prefixA = (how == e2s || how == s2s) ? "start" : "end";
            var prefixB = (how == s2e || how == s2s) ? "start" : "end";
            nodeA = this[prefixA + "Container"];
            offsetA = this[prefixA + "Offset"];
            nodeB = range[prefixB + "Container"];
            offsetB = range[prefixB + "Offset"];
            return dom.comparePoints(nodeA, offsetA, nodeB, offsetB);
        },

        insertNode: function(node) {
            assertRangeValid(this);
            assertValidNodeType(node, insertableNodeTypes);
            assertNodeNotReadOnly(this.startContainer);

            if (dom.isAncestorOf(node, this.startContainer, true)) {
                throw new DOMException("HIERARCHY_REQUEST_ERR");
            }

            // No check for whether the container of the start of the Range is of a type that does not allow
            // children of the type of node: the browser's DOM implementation should do this for us when we attempt
            // to add the node

            var firstNodeInserted = insertNodeAtPosition(node, this.startContainer, this.startOffset);
            this.setStartBefore(firstNodeInserted);
        },

        cloneContents: function() {
            assertRangeValid(this);

            var clone, frag;
            if (this.collapsed) {
                return getRangeDocument(this).createDocumentFragment();
            } else {
                if (this.startContainer === this.endContainer && dom.isCharacterDataNode(this.startContainer)) {
                    clone = this.startContainer.cloneNode(true);
                    clone.data = clone.data.slice(this.startOffset, this.endOffset);
                    frag = getRangeDocument(this).createDocumentFragment();
                    frag.appendChild(clone);
                    return frag;
                } else {
                    var iterator = new RangeIterator(this, true);
                    clone = cloneSubtree(iterator);
                    iterator.detach();
                }
                return clone;
            }
        },

        canSurroundContents: function() {
            assertRangeValid(this);
            assertNodeNotReadOnly(this.startContainer);
            assertNodeNotReadOnly(this.endContainer);

            // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
            // no non-text nodes.
            var iterator = new RangeIterator(this, true);
            var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                    (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
            iterator.detach();
            return !boundariesInvalid;
        },

        surroundContents: function(node) {
            assertValidNodeType(node, surroundNodeTypes);

            if (!this.canSurroundContents()) {
                throw new RangeException("BAD_BOUNDARYPOINTS_ERR");
            }

            // Extract the contents
            var content = this.extractContents();

            // Clear the children of the node
            if (node.hasChildNodes()) {
                while (node.lastChild) {
                    node.removeChild(node.lastChild);
                }
            }

            // Insert the new node and add the extracted contents
            insertNodeAtPosition(node, this.startContainer, this.startOffset);
            node.appendChild(content);

            this.selectNode(node);
        },

        cloneRange: function() {
            assertRangeValid(this);
            var range = new Range(getRangeDocument(this));
            var i = rangeProperties.length, prop;
            while (i--) {
                prop = rangeProperties[i];
                range[prop] = this[prop];
            }
            return range;
        },

        toString: function() {
            assertRangeValid(this);
            var sc = this.startContainer;
            if (sc === this.endContainer && dom.isCharacterDataNode(sc)) {
                return (sc.nodeType == 3 || sc.nodeType == 4) ? sc.data.slice(this.startOffset, this.endOffset) : "";
            } else {
                var textBits = [], iterator = new RangeIterator(this, true);

                iterateSubtree(iterator, function(node) {
                    // Accept only text or CDATA nodes, not comments

                    if (node.nodeType == 3 || node.nodeType == 4) {
                        textBits.push(node.data);
                    }
                });
                iterator.detach();
                return textBits.join("");
            }
        },

        // The methods below are all non-standard. The following batch were introduced by Mozilla but have since
        // been removed from Mozilla.

        compareNode: function(node) {
            assertRangeValid(this);

            var parent = node.parentNode;
            var nodeIndex = dom.getNodeIndex(node);

            if (!parent) {
                throw new DOMException("NOT_FOUND_ERR");
            }

            var startComparison = this.comparePoint(parent, nodeIndex),
                endComparison = this.comparePoint(parent, nodeIndex + 1);

            if (startComparison < 0) { // Node starts before
                return (endComparison > 0) ? n_b_a : n_b;
            } else {
                return (endComparison > 0) ? n_a : n_i;
            }
        },

        comparePoint: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            if (dom.comparePoints(node, offset, this.startContainer, this.startOffset) < 0) {
                return -1;
            } else if (dom.comparePoints(node, offset, this.endContainer, this.endOffset) > 0) {
                return 1;
            }
            return 0;
        },

        createContextualFragment: createContextualFragment,

        toHtml: function() {
            assertRangeValid(this);
            var container = getRangeDocument(this).createElement("div");
            container.appendChild(this.cloneContents());
            return container.innerHTML;
        },

        // touchingIsIntersecting determines whether this method considers a node that borders a range intersects
        // with it (as in WebKit) or not (as in Gecko pre-1.9, and the default)
        intersectsNode: function(node, touchingIsIntersecting) {
            assertRangeValid(this);
            assertNode(node, "NOT_FOUND_ERR");
            if (dom.getDocument(node) !== getRangeDocument(this)) {
                return false;
            }

            var parent = node.parentNode, offset = dom.getNodeIndex(node);
            assertNode(parent, "NOT_FOUND_ERR");

            var startComparison = dom.comparePoints(parent, offset, this.endContainer, this.endOffset),
                endComparison = dom.comparePoints(parent, offset + 1, this.startContainer, this.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },


        isPointInRange: function(node, offset) {
            assertRangeValid(this);
            assertNode(node, "HIERARCHY_REQUEST_ERR");
            assertSameDocumentOrFragment(node, this.startContainer);

            return (dom.comparePoints(node, offset, this.startContainer, this.startOffset) >= 0) &&
                   (dom.comparePoints(node, offset, this.endContainer, this.endOffset) <= 0);
        },

        // The methods below are non-standard and invented by me.

        // Sharing a boundary start-to-end or end-to-start does not count as intersection.
        intersectsRange: function(range, touchingIsIntersecting) {
            assertRangeValid(this);

            if (getRangeDocument(range) != getRangeDocument(this)) {
                throw new DOMException("WRONG_DOCUMENT_ERR");
            }

            var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.endContainer, range.endOffset),
                endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.startContainer, range.startOffset);

            return touchingIsIntersecting ? startComparison <= 0 && endComparison >= 0 : startComparison < 0 && endComparison > 0;
        },

        intersection: function(range) {
            if (this.intersectsRange(range)) {
                var startComparison = dom.comparePoints(this.startContainer, this.startOffset, range.startContainer, range.startOffset),
                    endComparison = dom.comparePoints(this.endContainer, this.endOffset, range.endContainer, range.endOffset);

                var intersectionRange = this.cloneRange();

                if (startComparison == -1) {
                    intersectionRange.setStart(range.startContainer, range.startOffset);
                }
                if (endComparison == 1) {
                    intersectionRange.setEnd(range.endContainer, range.endOffset);
                }
                return intersectionRange;
            }
            return null;
        },

        union: function(range) {
            if (this.intersectsRange(range, true)) {
                var unionRange = this.cloneRange();
                if (dom.comparePoints(range.startContainer, range.startOffset, this.startContainer, this.startOffset) == -1) {
                    unionRange.setStart(range.startContainer, range.startOffset);
                }
                if (dom.comparePoints(range.endContainer, range.endOffset, this.endContainer, this.endOffset) == 1) {
                    unionRange.setEnd(range.endContainer, range.endOffset);
                }
                return unionRange;
            } else {
                throw new RangeException("Ranges do not intersect");
            }
        },

        containsNode: function(node, allowPartial) {
            if (allowPartial) {
                return this.intersectsNode(node, false);
            } else {
                return this.compareNode(node) == n_i;
            }
        },

        containsNodeContents: function(node) {
            return this.comparePoint(node, 0) >= 0 && this.comparePoint(node, dom.getNodeLength(node)) <= 0;
        },

        containsRange: function(range) {
            return this.intersection(range).equals(range);
        },

        containsNodeText: function(node) {
            var nodeRange = this.cloneRange();
            nodeRange.selectNode(node);
            var textNodes = nodeRange.getNodes([3]);
            if (textNodes.length > 0) {
                nodeRange.setStart(textNodes[0], 0);
                var lastTextNode = textNodes.pop();
                nodeRange.setEnd(lastTextNode, lastTextNode.length);
                var contains = this.containsRange(nodeRange);
                nodeRange.detach();
                return contains;
            } else {
                return this.containsNodeContents(node);
            }
        },

        createNodeIterator: function(nodeTypes, filter) {
            assertRangeValid(this);
            return new RangeNodeIterator(this, nodeTypes, filter);
        },

        getNodes: function(nodeTypes, filter) {
            assertRangeValid(this);
            return getNodesInRange(this, nodeTypes, filter);
        },

        getDocument: function() {
            return getRangeDocument(this);
        },

        collapseBefore: function(node) {
            assertNotDetached(this);

            this.setEndBefore(node);
            this.collapse(false);
        },

        collapseAfter: function(node) {
            assertNotDetached(this);

            this.setStartAfter(node);
            this.collapse(true);
        },

        getName: function() {
            return "DomRange";
        },

        equals: function(range) {
            return Range.rangesEqual(this, range);
        },

        inspect: function() {
            return inspect(this);
        }
    };

    function copyComparisonConstantsToObject(obj) {
        obj.START_TO_START = s2s;
        obj.START_TO_END = s2e;
        obj.END_TO_END = e2e;
        obj.END_TO_START = e2s;

        obj.NODE_BEFORE = n_b;
        obj.NODE_AFTER = n_a;
        obj.NODE_BEFORE_AND_AFTER = n_b_a;
        obj.NODE_INSIDE = n_i;
    }

    function copyComparisonConstants(constructor) {
        copyComparisonConstantsToObject(constructor);
        copyComparisonConstantsToObject(constructor.prototype);
    }

    function createRangeContentRemover(remover, boundaryUpdater) {
        return function() {
            assertRangeValid(this);

            var sc = this.startContainer, so = this.startOffset, root = this.commonAncestorContainer;

            var iterator = new RangeIterator(this, true);

            // Work out where to position the range after content removal
            var node, boundary;
            if (sc !== root) {
                node = dom.getClosestAncestorIn(sc, root, true);
                boundary = getBoundaryAfterNode(node);
                sc = boundary.node;
                so = boundary.offset;
            }

            // Check none of the range is read-only
            iterateSubtree(iterator, assertNodeNotReadOnly);

            iterator.reset();

            // Remove the content
            var returnValue = remover(iterator);
            iterator.detach();

            // Move to the new position
            boundaryUpdater(this, sc, so, sc, so);

            return returnValue;
        };
    }

    function createPrototypeRange(constructor, boundaryUpdater, detacher) {
        function createBeforeAfterNodeSetter(isBefore, isStart) {
            return function(node) {
                assertNotDetached(this);
                assertValidNodeType(node, beforeAfterNodeTypes);
                assertValidNodeType(getRootContainer(node), rootContainerNodeTypes);

                var boundary = (isBefore ? getBoundaryBeforeNode : getBoundaryAfterNode)(node);
                (isStart ? setRangeStart : setRangeEnd)(this, boundary.node, boundary.offset);
            };
        }

        function setRangeStart(range, node, offset) {
            var ec = range.endContainer, eo = range.endOffset;
            if (node !== range.startContainer || offset !== range.startOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(ec) || dom.comparePoints(node, offset, ec, eo) == 1) {
                    ec = node;
                    eo = offset;
                }
                boundaryUpdater(range, node, offset, ec, eo);
            }
        }

        function setRangeEnd(range, node, offset) {
            var sc = range.startContainer, so = range.startOffset;
            if (node !== range.endContainer || offset !== range.endOffset) {
                // Check the root containers of the range and the new boundary, and also check whether the new boundary
                // is after the current end. In either case, collapse the range to the new position
                if (getRootContainer(node) != getRootContainer(sc) || dom.comparePoints(node, offset, sc, so) == -1) {
                    sc = node;
                    so = offset;
                }
                boundaryUpdater(range, sc, so, node, offset);
            }
        }

        function setRangeStartAndEnd(range, node, offset) {
            if (node !== range.startContainer || offset !== range.startOffset || node !== range.endContainer || offset !== range.endOffset) {
                boundaryUpdater(range, node, offset, node, offset);
            }
        }

        constructor.prototype = new RangePrototype();

        api.util.extend(constructor.prototype, {
            setStart: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStart(this, node, offset);
            },

            setEnd: function(node, offset) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeEnd(this, node, offset);
            },

            setStartBefore: createBeforeAfterNodeSetter(true, true),
            setStartAfter: createBeforeAfterNodeSetter(false, true),
            setEndBefore: createBeforeAfterNodeSetter(true, false),
            setEndAfter: createBeforeAfterNodeSetter(false, false),

            collapse: function(isStart) {
                assertRangeValid(this);
                if (isStart) {
                    boundaryUpdater(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset);
                } else {
                    boundaryUpdater(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset);
                }
            },

            selectNodeContents: function(node) {
                // This doesn't seem well specified: the spec talks only about selecting the node's contents, which
                // could be taken to mean only its children. However, browsers implement this the same as selectNode for
                // text nodes, so I shall do likewise
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, true);

                boundaryUpdater(this, node, 0, node, dom.getNodeLength(node));
            },

            selectNode: function(node) {
                assertNotDetached(this);
                assertNoDocTypeNotationEntityAncestor(node, false);
                assertValidNodeType(node, beforeAfterNodeTypes);

                var start = getBoundaryBeforeNode(node), end = getBoundaryAfterNode(node);
                boundaryUpdater(this, start.node, start.offset, end.node, end.offset);
            },

            extractContents: createRangeContentRemover(extractSubtree, boundaryUpdater),

            deleteContents: createRangeContentRemover(deleteSubtree, boundaryUpdater),

            canSurroundContents: function() {
                assertRangeValid(this);
                assertNodeNotReadOnly(this.startContainer);
                assertNodeNotReadOnly(this.endContainer);

                // Check if the contents can be surrounded. Specifically, this means whether the range partially selects
                // no non-text nodes.
                var iterator = new RangeIterator(this, true);
                var boundariesInvalid = (iterator._first && (isNonTextPartiallySelected(iterator._first, this)) ||
                        (iterator._last && isNonTextPartiallySelected(iterator._last, this)));
                iterator.detach();
                return !boundariesInvalid;
            },

            detach: function() {
                detacher(this);
            },

            splitBoundaries: function() {
                assertRangeValid(this);


                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;
                var startEndSame = (sc === ec);

                if (dom.isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
                    dom.splitDataNode(ec, eo);

                }

                if (dom.isCharacterDataNode(sc) && so > 0 && so < sc.length) {

                    sc = dom.splitDataNode(sc, so);
                    if (startEndSame) {
                        eo -= so;
                        ec = sc;
                    } else if (ec == sc.parentNode && eo >= dom.getNodeIndex(sc)) {
                        eo++;
                    }
                    so = 0;

                }
                boundaryUpdater(this, sc, so, ec, eo);
            },

            normalizeBoundaries: function() {
                assertRangeValid(this);

                var sc = this.startContainer, so = this.startOffset, ec = this.endContainer, eo = this.endOffset;

                var mergeForward = function(node) {
                    var sibling = node.nextSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        ec = node;
                        eo = node.length;
                        node.appendData(sibling.data);
                        sibling.parentNode.removeChild(sibling);
                    }
                };

                var mergeBackward = function(node) {
                    var sibling = node.previousSibling;
                    if (sibling && sibling.nodeType == node.nodeType) {
                        sc = node;
                        var nodeLength = node.length;
                        so = sibling.length;
                        node.insertData(0, sibling.data);
                        sibling.parentNode.removeChild(sibling);
                        if (sc == ec) {
                            eo += so;
                            ec = sc;
                        } else if (ec == node.parentNode) {
                            var nodeIndex = dom.getNodeIndex(node);
                            if (eo == nodeIndex) {
                                ec = node;
                                eo = nodeLength;
                            } else if (eo > nodeIndex) {
                                eo--;
                            }
                        }
                    }
                };

                var normalizeStart = true;

                if (dom.isCharacterDataNode(ec)) {
                    if (ec.length == eo) {
                        mergeForward(ec);
                    }
                } else {
                    if (eo > 0) {
                        var endNode = ec.childNodes[eo - 1];
                        if (endNode && dom.isCharacterDataNode(endNode)) {
                            mergeForward(endNode);
                        }
                    }
                    normalizeStart = !this.collapsed;
                }

                if (normalizeStart) {
                    if (dom.isCharacterDataNode(sc)) {
                        if (so == 0) {
                            mergeBackward(sc);
                        }
                    } else {
                        if (so < sc.childNodes.length) {
                            var startNode = sc.childNodes[so];
                            if (startNode && dom.isCharacterDataNode(startNode)) {
                                mergeBackward(startNode);
                            }
                        }
                    }
                } else {
                    sc = ec;
                    so = eo;
                }

                boundaryUpdater(this, sc, so, ec, eo);
            },

            collapseToPoint: function(node, offset) {
                assertNotDetached(this);

                assertNoDocTypeNotationEntityAncestor(node, true);
                assertValidOffset(node, offset);

                setRangeStartAndEnd(this, node, offset);
            }
        });

        copyComparisonConstants(constructor);
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    // Updates commonAncestorContainer and collapsed after boundary change
    function updateCollapsedAndCommonAncestor(range) {
        range.collapsed = (range.startContainer === range.endContainer && range.startOffset === range.endOffset);
        range.commonAncestorContainer = range.collapsed ?
            range.startContainer : dom.getCommonAncestor(range.startContainer, range.endContainer);
    }

    function updateBoundaries(range, startContainer, startOffset, endContainer, endOffset) {
        var startMoved = (range.startContainer !== startContainer || range.startOffset !== startOffset);
        var endMoved = (range.endContainer !== endContainer || range.endOffset !== endOffset);

        range.startContainer = startContainer;
        range.startOffset = startOffset;
        range.endContainer = endContainer;
        range.endOffset = endOffset;

        updateCollapsedAndCommonAncestor(range);
        dispatchEvent(range, "boundarychange", {startMoved: startMoved, endMoved: endMoved});
    }

    function detach(range) {
        assertNotDetached(range);
        range.startContainer = range.startOffset = range.endContainer = range.endOffset = null;
        range.collapsed = range.commonAncestorContainer = null;
        dispatchEvent(range, "detach", null);
        range._listeners = null;
    }

    /**
     * @constructor
     */
    function Range(doc) {
        this.startContainer = doc;
        this.startOffset = 0;
        this.endContainer = doc;
        this.endOffset = 0;
        this._listeners = {
            boundarychange: [],
            detach: []
        };
        updateCollapsedAndCommonAncestor(this);
    }

    createPrototypeRange(Range, updateBoundaries, detach);

    api.rangePrototype = RangePrototype.prototype;

    Range.rangeProperties = rangeProperties;
    Range.RangeIterator = RangeIterator;
    Range.copyComparisonConstants = copyComparisonConstants;
    Range.createPrototypeRange = createPrototypeRange;
    Range.inspect = inspect;
    Range.getRangeDocument = getRangeDocument;
    Range.rangesEqual = function(r1, r2) {
        return r1.startContainer === r2.startContainer &&
               r1.startOffset === r2.startOffset &&
               r1.endContainer === r2.endContainer &&
               r1.endOffset === r2.endOffset;
    };

    api.DomRange = Range;
    api.RangeException = RangeException;
});rangy.createModule("WrappedRange", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange"] );

    /**
     * @constructor
     */
    var WrappedRange;
    var dom = api.dom;
    var DomPosition = dom.DomPosition;
    var DomRange = api.DomRange;



    /*----------------------------------------------------------------------------------------------------------------*/

    /*
    This is a workaround for a bug where IE returns the wrong container element from the TextRange's parentElement()
    method. For example, in the following (where pipes denote the selection boundaries):

    <ul id="ul"><li id="a">| a </li><li id="b"> b |</li></ul>

    var range = document.selection.createRange();
    alert(range.parentElement().id); // Should alert "ul" but alerts "b"

    This method returns the common ancestor node of the following:
    - the parentElement() of the textRange
    - the parentElement() of the textRange after calling collapse(true)
    - the parentElement() of the textRange after calling collapse(false)
     */
    function getTextRangeContainerElement(textRange) {
        var parentEl = textRange.parentElement();

        var range = textRange.duplicate();
        range.collapse(true);
        var startEl = range.parentElement();
        range = textRange.duplicate();
        range.collapse(false);
        var endEl = range.parentElement();
        var startEndContainer = (startEl == endEl) ? startEl : dom.getCommonAncestor(startEl, endEl);

        return startEndContainer == parentEl ? startEndContainer : dom.getCommonAncestor(parentEl, startEndContainer);
    }

    function textRangeIsCollapsed(textRange) {
        return textRange.compareEndPoints("StartToEnd", textRange) == 0;
    }

    // Gets the boundary of a TextRange expressed as a node and an offset within that node. This function started out as
    // an improved version of code found in Tim Cameron Ryan's IERange (http://code.google.com/p/ierange/) but has
    // grown, fixing problems with line breaks in preformatted text, adding workaround for IE TextRange bugs, handling
    // for inputs and images, plus optimizations.
    function getTextRangeBoundaryPosition(textRange, wholeRangeContainerElement, isStart, isCollapsed) {
        var workingRange = textRange.duplicate();

        workingRange.collapse(isStart);
        var containerElement = workingRange.parentElement();

        // Sometimes collapsing a TextRange that's at the start of a text node can move it into the previous node, so
        // check for that
        // TODO: Find out when. Workaround for wholeRangeContainerElement may break this
        if (!dom.isAncestorOf(wholeRangeContainerElement, containerElement, true)) {
            containerElement = wholeRangeContainerElement;

        }



        // Deal with nodes that cannot "contain rich HTML markup". In practice, this means form inputs, images and
        // similar. See http://msdn.microsoft.com/en-us/library/aa703950%28VS.85%29.aspx
        if (!containerElement.canHaveHTML) {
            return new DomPosition(containerElement.parentNode, dom.getNodeIndex(containerElement));
        }

        var workingNode = dom.getDocument(containerElement).createElement("span");
        var comparison, workingComparisonType = isStart ? "StartToStart" : "StartToEnd";
        var previousNode, nextNode, boundaryPosition, boundaryNode;

        // Move the working range through the container's children, starting at the end and working backwards, until the
        // working range reaches or goes past the boundary we're interested in
        do {
            containerElement.insertBefore(workingNode, workingNode.previousSibling);
            workingRange.moveToElementText(workingNode);
        } while ( (comparison = workingRange.compareEndPoints(workingComparisonType, textRange)) > 0 &&
                workingNode.previousSibling);

        // We've now reached or gone past the boundary of the text range we're interested in
        // so have identified the node we want
        boundaryNode = workingNode.nextSibling;

        if (comparison == -1 && boundaryNode && dom.isCharacterDataNode(boundaryNode)) {
            // This is a character data node (text, comment, cdata). The working range is collapsed at the start of the
            // node containing the text range's boundary, so we move the end of the working range to the boundary point
            // and measure the length of its text to get the boundary's offset within the node.
            workingRange.setEndPoint(isStart ? "EndToStart" : "EndToEnd", textRange);


            var offset;

            if (/[\r\n]/.test(boundaryNode.data)) {
                /*
                For the particular case of a boundary within a text node containing line breaks (within a <pre> element,
                for example), we need a slightly complicated approach to get the boundary's offset in IE. The facts:

                - Each line break is represented as \r in the text node's data/nodeValue properties
                - Each line break is represented as \r\n in the TextRange's 'text' property
                - The 'text' property of the TextRange does not contain trailing line breaks

                To get round the problem presented by the final fact above, we can use the fact that TextRange's
                moveStart() and moveEnd() methods return the actual number of characters moved, which is not necessarily
                the same as the number of characters it was instructed to move. The simplest approach is to use this to
                store the characters moved when moving both the start and end of the range to the start of the document
                body and subtracting the start offset from the end offset (the "move-negative-gazillion" method).
                However, this is extremely slow when the document is large and the range is near the end of it. Clearly
                doing the mirror image (i.e. moving the range boundaries to the end of the document) has the same
                problem.

                Another approach that works is to use moveStart() to move the start boundary of the range up to the end
                boundary one character at a time and incrementing a counter with the value returned by the moveStart()
                call. However, the check for whether the start boundary has reached the end boundary is expensive, so
                this method is slow (although unlike "move-negative-gazillion" is largely unaffected by the location of
                the range within the document).

                The method below is a hybrid of the two methods above. It uses the fact that a string containing the
                TextRange's 'text' property with each \r\n converted to a single \r character cannot be longer than the
                text of the TextRange, so the start of the range is moved that length initially and then a character at
                a time to make up for any trailing line breaks not contained in the 'text' property. This has good
                performance in most situations compared to the previous two methods.
                */
                var tempRange = workingRange.duplicate();
                var rangeLength = tempRange.text.replace(/\r\n/g, "\r").length;

                offset = tempRange.moveStart("character", rangeLength);
                while ( (comparison = tempRange.compareEndPoints("StartToEnd", tempRange)) == -1) {
                    offset++;
                    tempRange.moveStart("character", 1);
                }
            } else {
                offset = workingRange.text.length;
            }
            boundaryPosition = new DomPosition(boundaryNode, offset);
        } else {


            // If the boundary immediately follows a character data node and this is the end boundary, we should favour
            // a position within that, and likewise for a start boundary preceding a character data node
            previousNode = (isCollapsed || !isStart) && workingNode.previousSibling;
            nextNode = (isCollapsed || isStart) && workingNode.nextSibling;



            if (nextNode && dom.isCharacterDataNode(nextNode)) {
                boundaryPosition = new DomPosition(nextNode, 0);
            } else if (previousNode && dom.isCharacterDataNode(previousNode)) {
                boundaryPosition = new DomPosition(previousNode, previousNode.length);
            } else {
                boundaryPosition = new DomPosition(containerElement, dom.getNodeIndex(workingNode));
            }
        }

        // Clean up
        workingNode.parentNode.removeChild(workingNode);

        return boundaryPosition;
    }

    // Returns a TextRange representing the boundary of a TextRange expressed as a node and an offset within that node.
    // This function started out as an optimized version of code found in Tim Cameron Ryan's IERange
    // (http://code.google.com/p/ierange/)
    function createBoundaryTextRange(boundaryPosition, isStart) {
        var boundaryNode, boundaryParent, boundaryOffset = boundaryPosition.offset;
        var doc = dom.getDocument(boundaryPosition.node);
        var workingNode, childNodes, workingRange = doc.body.createTextRange();
        var nodeIsDataNode = dom.isCharacterDataNode(boundaryPosition.node);

        if (nodeIsDataNode) {
            boundaryNode = boundaryPosition.node;
            boundaryParent = boundaryNode.parentNode;
        } else {
            childNodes = boundaryPosition.node.childNodes;
            boundaryNode = (boundaryOffset < childNodes.length) ? childNodes[boundaryOffset] : null;
            boundaryParent = boundaryPosition.node;
        }

        // Position the range immediately before the node containing the boundary
        workingNode = doc.createElement("span");

        // Making the working element non-empty element persuades IE to consider the TextRange boundary to be within the
        // element rather than immediately before or after it, which is what we want
        workingNode.innerHTML = "&#feff;";

        // insertBefore is supposed to work like appendChild if the second parameter is null. However, a bug report
        // for IERange suggests that it can crash the browser: http://code.google.com/p/ierange/issues/detail?id=12
        if (boundaryNode) {
            boundaryParent.insertBefore(workingNode, boundaryNode);
        } else {
            boundaryParent.appendChild(workingNode);
        }

        workingRange.moveToElementText(workingNode);
        workingRange.collapse(!isStart);

        // Clean up
        boundaryParent.removeChild(workingNode);

        // Move the working range to the text offset, if required
        if (nodeIsDataNode) {
            workingRange[isStart ? "moveStart" : "moveEnd"]("character", boundaryOffset);
        }

        return workingRange;
    }

    /*----------------------------------------------------------------------------------------------------------------*/

    if (api.features.implementsDomRange && (!api.features.implementsTextRange || !api.config.preferTextRange)) {
        // This is a wrapper around the browser's native DOM Range. It has two aims:
        // - Provide workarounds for specific browser bugs
        // - provide convenient extensions, which are inherited from Rangy's DomRange

        (function() {
            var rangeProto;
            var rangeProperties = DomRange.rangeProperties;
            var canSetRangeStartAfterEnd;

            function updateRangeProperties(range) {
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = range.nativeRange[prop];
                }
            }

            function updateNativeRange(range, startContainer, startOffset, endContainer,endOffset) {
                var startMoved = (range.startContainer !== startContainer || range.startOffset != startOffset);
                var endMoved = (range.endContainer !== endContainer || range.endOffset != endOffset);

                // Always set both boundaries for the benefit of IE9 (see issue 35)
                if (startMoved || endMoved) {
                    range.setEnd(endContainer, endOffset);
                    range.setStart(startContainer, startOffset);
                }
            }

            function detach(range) {
                range.nativeRange.detach();
                range.detached = true;
                var i = rangeProperties.length, prop;
                while (i--) {
                    prop = rangeProperties[i];
                    range[prop] = null;
                }
            }

            var createBeforeAfterNodeSetter;

            WrappedRange = function(range) {
                if (!range) {
                    throw new Error("Range must be specified");
                }
                this.nativeRange = range;
                updateRangeProperties(this);
            };

            DomRange.createPrototypeRange(WrappedRange, updateNativeRange, detach);

            rangeProto = WrappedRange.prototype;

            rangeProto.selectNode = function(node) {
                this.nativeRange.selectNode(node);
                updateRangeProperties(this);
            };

            rangeProto.deleteContents = function() {
                this.nativeRange.deleteContents();
                updateRangeProperties(this);
            };

            rangeProto.extractContents = function() {
                var frag = this.nativeRange.extractContents();
                updateRangeProperties(this);
                return frag;
            };

            rangeProto.cloneContents = function() {
                return this.nativeRange.cloneContents();
            };

            // TODO: Until I can find a way to programmatically trigger the Firefox bug (apparently long-standing, still
            // present in 3.6.8) that throws "Index or size is negative or greater than the allowed amount" for
            // insertNode in some circumstances, all browsers will have to use the Rangy's own implementation of
            // insertNode, which works but is almost certainly slower than the native implementation.
/*
            rangeProto.insertNode = function(node) {
                this.nativeRange.insertNode(node);
                updateRangeProperties(this);
            };
*/

            rangeProto.surroundContents = function(node) {
                this.nativeRange.surroundContents(node);
                updateRangeProperties(this);
            };

            rangeProto.collapse = function(isStart) {
                this.nativeRange.collapse(isStart);
                updateRangeProperties(this);
            };

            rangeProto.cloneRange = function() {
                return new WrappedRange(this.nativeRange.cloneRange());
            };

            rangeProto.refresh = function() {
                updateRangeProperties(this);
            };

            rangeProto.toString = function() {
                return this.nativeRange.toString();
            };

            // Create test range and node for feature detection

            var testTextNode = document.createTextNode("test");
            dom.getBody(document).appendChild(testTextNode);
            var range = document.createRange();

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for Firefox 2 bug that prevents moving the start of a Range to a point after its current end and
            // correct for it

            range.setStart(testTextNode, 0);
            range.setEnd(testTextNode, 0);

            try {
                range.setStart(testTextNode, 1);
                canSetRangeStartAfterEnd = true;

                rangeProto.setStart = function(node, offset) {
                    this.nativeRange.setStart(node, offset);
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    this.nativeRange.setEnd(node, offset);
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name) {
                    return function(node) {
                        this.nativeRange[name](node);
                        updateRangeProperties(this);
                    };
                };

            } catch(ex) {


                canSetRangeStartAfterEnd = false;

                rangeProto.setStart = function(node, offset) {
                    try {
                        this.nativeRange.setStart(node, offset);
                    } catch (ex) {
                        this.nativeRange.setEnd(node, offset);
                        this.nativeRange.setStart(node, offset);
                    }
                    updateRangeProperties(this);
                };

                rangeProto.setEnd = function(node, offset) {
                    try {
                        this.nativeRange.setEnd(node, offset);
                    } catch (ex) {
                        this.nativeRange.setStart(node, offset);
                        this.nativeRange.setEnd(node, offset);
                    }
                    updateRangeProperties(this);
                };

                createBeforeAfterNodeSetter = function(name, oppositeName) {
                    return function(node) {
                        try {
                            this.nativeRange[name](node);
                        } catch (ex) {
                            this.nativeRange[oppositeName](node);
                            this.nativeRange[name](node);
                        }
                        updateRangeProperties(this);
                    };
                };
            }

            rangeProto.setStartBefore = createBeforeAfterNodeSetter("setStartBefore", "setEndBefore");
            rangeProto.setStartAfter = createBeforeAfterNodeSetter("setStartAfter", "setEndAfter");
            rangeProto.setEndBefore = createBeforeAfterNodeSetter("setEndBefore", "setStartBefore");
            rangeProto.setEndAfter = createBeforeAfterNodeSetter("setEndAfter", "setStartAfter");

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for and correct Firefox 2 behaviour with selectNodeContents on text nodes: it collapses the range to
            // the 0th character of the text node
            range.selectNodeContents(testTextNode);
            if (range.startContainer == testTextNode && range.endContainer == testTextNode &&
                    range.startOffset == 0 && range.endOffset == testTextNode.length) {
                rangeProto.selectNodeContents = function(node) {
                    this.nativeRange.selectNodeContents(node);
                    updateRangeProperties(this);
                };
            } else {
                rangeProto.selectNodeContents = function(node) {
                    this.setStart(node, 0);
                    this.setEnd(node, DomRange.getEndOffset(node));
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for WebKit bug that has the beahviour of compareBoundaryPoints round the wrong way for constants
            // START_TO_END and END_TO_START: https://bugs.webkit.org/show_bug.cgi?id=20738

            range.selectNodeContents(testTextNode);
            range.setEnd(testTextNode, 3);

            var range2 = document.createRange();
            range2.selectNodeContents(testTextNode);
            range2.setEnd(testTextNode, 4);
            range2.setStart(testTextNode, 2);

            if (range.compareBoundaryPoints(range.START_TO_END, range2) == -1 &
                    range.compareBoundaryPoints(range.END_TO_START, range2) == 1) {
                // This is the wrong way round, so correct for it


                rangeProto.compareBoundaryPoints = function(type, range) {
                    range = range.nativeRange || range;
                    if (type == range.START_TO_END) {
                        type = range.END_TO_START;
                    } else if (type == range.END_TO_START) {
                        type = range.START_TO_END;
                    }
                    return this.nativeRange.compareBoundaryPoints(type, range);
                };
            } else {
                rangeProto.compareBoundaryPoints = function(type, range) {
                    return this.nativeRange.compareBoundaryPoints(type, range.nativeRange || range);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Test for existence of createContextualFragment and delegate to it if it exists
            if (api.util.isHostMethod(range, "createContextualFragment")) {
                rangeProto.createContextualFragment = function(fragmentStr) {
                    return this.nativeRange.createContextualFragment(fragmentStr);
                };
            }

            /*--------------------------------------------------------------------------------------------------------*/

            // Clean up
            dom.getBody(document).removeChild(testTextNode);
            range.detach();
            range2.detach();
        })();

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.createRange();
        };
    } else if (api.features.implementsTextRange) {
        // This is a wrapper around a TextRange, providing full DOM Range functionality using rangy's DomRange as a
        // prototype

        WrappedRange = function(textRange) {
            this.textRange = textRange;
            this.refresh();
        };

        WrappedRange.prototype = new DomRange(document);

        WrappedRange.prototype.refresh = function() {
            var start, end;

            // TextRange's parentElement() method cannot be trusted. getTextRangeContainerElement() works around that.
            var rangeContainerElement = getTextRangeContainerElement(this.textRange);

            if (textRangeIsCollapsed(this.textRange)) {
                end = start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, true);
            } else {

                start = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, true, false);
                end = getTextRangeBoundaryPosition(this.textRange, rangeContainerElement, false, false);
            }

            this.setStart(start.node, start.offset);
            this.setEnd(end.node, end.offset);
        };

        DomRange.copyComparisonConstants(WrappedRange);

        // Add WrappedRange as the Range property of the global object to allow expression like Range.END_TO_END to work
        var globalObj = (function() { return this; })();
        if (typeof globalObj.Range == "undefined") {
            globalObj.Range = WrappedRange;
        }

        api.createNativeRange = function(doc) {
            doc = doc || document;
            return doc.body.createTextRange();
        };
    }

    if (api.features.implementsTextRange) {
        WrappedRange.rangeToTextRange = function(range) {
            if (range.collapsed) {
                var tr = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);



                return tr;

                //return createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
            } else {
                var startRange = createBoundaryTextRange(new DomPosition(range.startContainer, range.startOffset), true);
                var endRange = createBoundaryTextRange(new DomPosition(range.endContainer, range.endOffset), false);
                var textRange = dom.getDocument(range.startContainer).body.createTextRange();
                textRange.setEndPoint("StartToStart", startRange);
                textRange.setEndPoint("EndToEnd", endRange);
                return textRange;
            }
        };
    }

    WrappedRange.prototype.getName = function() {
        return "WrappedRange";
    };

    api.WrappedRange = WrappedRange;

    api.createRange = function(doc) {
        doc = doc || document;
        return new WrappedRange(api.createNativeRange(doc));
    };

    api.createRangyRange = function(doc) {
        doc = doc || document;
        return new DomRange(doc);
    };

    api.createIframeRange = function(iframeEl) {
        return api.createRange(dom.getIframeDocument(iframeEl));
    };

    api.createIframeRangyRange = function(iframeEl) {
        return api.createRangyRange(dom.getIframeDocument(iframeEl));
    };

    api.addCreateMissingNativeApiListener(function(win) {
        var doc = win.document;
        if (typeof doc.createRange == "undefined") {
            doc.createRange = function() {
                return api.createRange(this);
            };
        }
        doc = win = null;
    });
});rangy.createModule("WrappedSelection", function(api, module) {
    // This will create a selection object wrapper that follows the Selection object found in the WHATWG draft DOM Range
    // spec (http://html5.org/specs/dom-range.html)

    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    api.config.checkSelectionRanges = true;

    var BOOLEAN = "boolean",
        windowPropertyName = "_rangySelection",
        dom = api.dom,
        util = api.util,
        DomRange = api.DomRange,
        WrappedRange = api.WrappedRange,
        DOMException = api.DOMException,
        DomPosition = dom.DomPosition,
        getSelection,
        selectionIsCollapsed,
        CONTROL = "Control";



    function getWinSelection(winParam) {
        return (winParam || window).getSelection();
    }

    function getDocSelection(winParam) {
        return (winParam || window).document.selection;
    }

    // Test for the Range/TextRange and Selection features required
    // Test for ability to retrieve selection
    var implementsWinGetSelection = api.util.isHostMethod(window, "getSelection"),
        implementsDocSelection = api.util.isHostObject(document, "selection");

    var useDocumentSelection = implementsDocSelection && (!implementsWinGetSelection || api.config.preferTextRange);

    if (useDocumentSelection) {
        getSelection = getDocSelection;
        api.isSelectionValid = function(winParam) {
            var doc = (winParam || window).document, nativeSel = doc.selection;

            // Check whether the selection TextRange is actually contained within the correct document
            return (nativeSel.type != "None" || dom.getDocument(nativeSel.createRange().parentElement()) == doc);
        };
    } else if (implementsWinGetSelection) {
        getSelection = getWinSelection;
        api.isSelectionValid = function() {
            return true;
        };
    } else {
        module.fail("Neither document.selection or window.getSelection() detected.");
    }

    api.getNativeSelection = getSelection;

    var testSelection = getSelection();
    var testRange = api.createNativeRange(document);
    var body = dom.getBody(document);

    // Obtaining a range from a selection
    var selectionHasAnchorAndFocus = util.areHostObjects(testSelection, ["anchorNode", "focusNode"] &&
                                     util.areHostProperties(testSelection, ["anchorOffset", "focusOffset"]));
    api.features.selectionHasAnchorAndFocus = selectionHasAnchorAndFocus;

    // Test for existence of native selection extend() method
    var selectionHasExtend = util.isHostMethod(testSelection, "extend");
    api.features.selectionHasExtend = selectionHasExtend;

    // Test if rangeCount exists
    var selectionHasRangeCount = (typeof testSelection.rangeCount == "number");
    api.features.selectionHasRangeCount = selectionHasRangeCount;

    var selectionSupportsMultipleRanges = false;
    var collapsedNonEditableSelectionsSupported = true;

    if (util.areHostMethods(testSelection, ["addRange", "getRangeAt", "removeAllRanges"]) &&
            typeof testSelection.rangeCount == "number" && api.features.implementsDomRange) {

        (function() {
            var iframe = document.createElement("iframe");
            body.appendChild(iframe);

            var iframeDoc = dom.getIframeDocument(iframe);
            iframeDoc.open();
            iframeDoc.write("<html><head></head><body>12</body></html>");
            iframeDoc.close();

            var sel = dom.getIframeWindow(iframe).getSelection();
            var docEl = iframeDoc.documentElement;
            var iframeBody = docEl.lastChild, textNode = iframeBody.firstChild;

            // Test whether the native selection will allow a collapsed selection within a non-editable element
            var r1 = iframeDoc.createRange();
            r1.setStart(textNode, 1);
            r1.collapse(true);
            sel.addRange(r1);
            collapsedNonEditableSelectionsSupported = (sel.rangeCount == 1);
            sel.removeAllRanges();

            // Test whether the native selection is capable of supporting multiple ranges
            var r2 = r1.cloneRange();
            r1.setStart(textNode, 0);
            r2.setEnd(textNode, 2);
            sel.addRange(r1);
            sel.addRange(r2);

            selectionSupportsMultipleRanges = (sel.rangeCount == 2);

            // Clean up
            r1.detach();
            r2.detach();

            body.removeChild(iframe);
        })();
    }

    api.features.selectionSupportsMultipleRanges = selectionSupportsMultipleRanges;
    api.features.collapsedNonEditableSelectionsSupported = collapsedNonEditableSelectionsSupported;

    // ControlRanges
    var implementsControlRange = false, testControlRange;

    if (body && util.isHostMethod(body, "createControlRange")) {
        testControlRange = body.createControlRange();
        if (util.areHostProperties(testControlRange, ["item", "add"])) {
            implementsControlRange = true;
        }
    }
    api.features.implementsControlRange = implementsControlRange;

    // Selection collapsedness
    if (selectionHasAnchorAndFocus) {
        selectionIsCollapsed = function(sel) {
            return sel.anchorNode === sel.focusNode && sel.anchorOffset === sel.focusOffset;
        };
    } else {
        selectionIsCollapsed = function(sel) {
            return sel.rangeCount ? sel.getRangeAt(sel.rangeCount - 1).collapsed : false;
        };
    }

    function updateAnchorAndFocusFromRange(sel, range, backwards) {
        var anchorPrefix = backwards ? "end" : "start", focusPrefix = backwards ? "start" : "end";
        sel.anchorNode = range[anchorPrefix + "Container"];
        sel.anchorOffset = range[anchorPrefix + "Offset"];
        sel.focusNode = range[focusPrefix + "Container"];
        sel.focusOffset = range[focusPrefix + "Offset"];
    }

    function updateAnchorAndFocusFromNativeSelection(sel) {
        var nativeSel = sel.nativeSelection;
        sel.anchorNode = nativeSel.anchorNode;
        sel.anchorOffset = nativeSel.anchorOffset;
        sel.focusNode = nativeSel.focusNode;
        sel.focusOffset = nativeSel.focusOffset;
    }

    function updateEmptySelection(sel) {
        sel.anchorNode = sel.focusNode = null;
        sel.anchorOffset = sel.focusOffset = 0;
        sel.rangeCount = 0;
        sel.isCollapsed = true;
        sel._ranges.length = 0;
    }

    function getNativeRange(range) {
        var nativeRange;
        if (range instanceof DomRange) {
            nativeRange = range._selectionNativeRange;
            if (!nativeRange) {
                nativeRange = api.createNativeRange(dom.getDocument(range.startContainer));
                nativeRange.setEnd(range.endContainer, range.endOffset);
                nativeRange.setStart(range.startContainer, range.startOffset);
                range._selectionNativeRange = nativeRange;
                range.attachListener("detach", function() {

                    this._selectionNativeRange = null;
                });
            }
        } else if (range instanceof WrappedRange) {
            nativeRange = range.nativeRange;
        } else if (api.features.implementsDomRange && (range instanceof dom.getWindow(range.startContainer).Range)) {
            nativeRange = range;
        }
        return nativeRange;
    }

    function rangeContainsSingleElement(rangeNodes) {
        if (!rangeNodes.length || rangeNodes[0].nodeType != 1) {
            return false;
        }
        for (var i = 1, len = rangeNodes.length; i < len; ++i) {
            if (!dom.isAncestorOf(rangeNodes[0], rangeNodes[i])) {
                return false;
            }
        }
        return true;
    }

    function getSingleElementFromRange(range) {
        var nodes = range.getNodes();
        if (!rangeContainsSingleElement(nodes)) {
            throw new Error("getSingleElementFromRange: range " + range.inspect() + " did not consist of a single element");
        }
        return nodes[0];
    }

    function isTextRange(range) {
        return !!range && typeof range.text != "undefined";
    }

    function updateFromTextRange(sel, range) {
        // Create a Range from the selected TextRange
        var wrappedRange = new WrappedRange(range);
        sel._ranges = [wrappedRange];

        updateAnchorAndFocusFromRange(sel, wrappedRange, false);
        sel.rangeCount = 1;
        sel.isCollapsed = wrappedRange.collapsed;
    }

    function updateControlSelection(sel) {
        // Update the wrapped selection based on what's now in the native selection
        sel._ranges.length = 0;
        if (sel.docSelection.type == "None") {
            updateEmptySelection(sel);
        } else {
            var controlRange = sel.docSelection.createRange();
            if (isTextRange(controlRange)) {
                // This case (where the selection type is "Control" and calling createRange() on the selection returns
                // a TextRange) can happen in IE 9. It happens, for example, when all elements in the selected
                // ControlRange have been removed from the ControlRange and removed from the document.
                updateFromTextRange(sel, controlRange);
            } else {
                sel.rangeCount = controlRange.length;
                var range, doc = dom.getDocument(controlRange.item(0));
                for (var i = 0; i < sel.rangeCount; ++i) {
                    range = api.createRange(doc);
                    range.selectNode(controlRange.item(i));
                    sel._ranges.push(range);
                }
                sel.isCollapsed = sel.rangeCount == 1 && sel._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], false);
            }
        }
    }

    function addRangeToControlSelection(sel, range) {
        var controlRange = sel.docSelection.createRange();
        var rangeElement = getSingleElementFromRange(range);

        // Create a new ControlRange containing all the elements in the selected ControlRange plus the element
        // contained by the supplied range
        var doc = dom.getDocument(controlRange.item(0));
        var newControlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, len = controlRange.length; i < len; ++i) {
            newControlRange.add(controlRange.item(i));
        }
        try {
            newControlRange.add(rangeElement);
        } catch (ex) {
            throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)");
        }
        newControlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    var getSelectionRangeAt;

    if (util.isHostMethod(testSelection,  "getRangeAt")) {
        getSelectionRangeAt = function(sel, index) {
            try {
                return sel.getRangeAt(index);
            } catch(ex) {
                return null;
            }
        };
    } else if (selectionHasAnchorAndFocus) {
        getSelectionRangeAt = function(sel) {
            var doc = dom.getDocument(sel.anchorNode);
            var range = api.createRange(doc);
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the
            // document)
            if (range.collapsed !== this.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }

            return range;
        };
    }

    /**
     * @constructor
     */
    function WrappedSelection(selection, docSelection, win) {
        this.nativeSelection = selection;
        this.docSelection = docSelection;
        this._ranges = [];
        this.win = win;
        this.refresh();
    }

    api.getSelection = function(win) {
        win = win || window;
        var sel = win[windowPropertyName];
        var nativeSel = getSelection(win), docSel = implementsDocSelection ? getDocSelection(win) : null;
        if (sel) {
            sel.nativeSelection = nativeSel;
            sel.docSelection = docSel;
            sel.refresh(win);
        } else {
            sel = new WrappedSelection(nativeSel, docSel, win);
            win[windowPropertyName] = sel;
        }
        return sel;
    };

    api.getIframeSelection = function(iframeEl) {
        return api.getSelection(dom.getIframeWindow(iframeEl));
    };

    var selProto = WrappedSelection.prototype;

    function createControlSelection(sel, ranges) {
        // Ensure that the selection becomes of type "Control"
        var doc = dom.getDocument(ranges[0].startContainer);
        var controlRange = dom.getBody(doc).createControlRange();
        for (var i = 0, el; i < rangeCount; ++i) {
            el = getSingleElementFromRange(ranges[i]);
            try {
                controlRange.add(el);
            } catch (ex) {
                throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)");
            }
        }
        controlRange.select();

        // Update the wrapped selection based on what's now in the native selection
        updateControlSelection(sel);
    }

    // Selecting a range
    if (!useDocumentSelection && selectionHasAnchorAndFocus && util.areHostMethods(testSelection, ["removeAllRanges", "addRange"])) {
        selProto.removeAllRanges = function() {
            this.nativeSelection.removeAllRanges();
            updateEmptySelection(this);
        };

        var addRangeBackwards = function(sel, range) {
            var doc = DomRange.getRangeDocument(range);
            var endRange = api.createRange(doc);
            endRange.collapseToPoint(range.endContainer, range.endOffset);
            sel.nativeSelection.addRange(getNativeRange(endRange));
            sel.nativeSelection.extend(range.startContainer, range.startOffset);
            sel.refresh();
        };

        if (selectionHasRangeCount) {
            selProto.addRange = function(range, backwards) {
                if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
                    addRangeToControlSelection(this, range);
                } else {
                    if (backwards && selectionHasExtend) {
                        addRangeBackwards(this, range);
                    } else {
                        var previousRangeCount;
                        if (selectionSupportsMultipleRanges) {
                            previousRangeCount = this.rangeCount;
                        } else {
                            this.removeAllRanges();
                            previousRangeCount = 0;
                        }
                        this.nativeSelection.addRange(getNativeRange(range));

                        // Check whether adding the range was successful
                        this.rangeCount = this.nativeSelection.rangeCount;

                        if (this.rangeCount == previousRangeCount + 1) {
                            // The range was added successfully

                            // Check whether the range that we added to the selection is reflected in the last range extracted from
                            // the selection
                            if (api.config.checkSelectionRanges) {
                                var nativeRange = getSelectionRangeAt(this.nativeSelection, this.rangeCount - 1);
                                if (nativeRange && !DomRange.rangesEqual(nativeRange, range)) {
                                    // Happens in WebKit with, for example, a selection placed at the start of a text node
                                    range = new WrappedRange(nativeRange);
                                }
                            }
                            this._ranges[this.rangeCount - 1] = range;
                            updateAnchorAndFocusFromRange(this, range, selectionIsBackwards(this.nativeSelection));
                            this.isCollapsed = selectionIsCollapsed(this);
                        } else {
                            // The range was not added successfully. The simplest thing is to refresh
                            this.refresh();
                        }
                    }
                }
            };
        } else {
            selProto.addRange = function(range, backwards) {
                if (backwards && selectionHasExtend) {
                    addRangeBackwards(this, range);
                } else {
                    this.nativeSelection.addRange(getNativeRange(range));
                    this.refresh();
                }
            };
        }

        selProto.setRanges = function(ranges) {
            if (implementsControlRange && ranges.length > 1) {
                createControlSelection(this, ranges);
            } else {
                this.removeAllRanges();
                for (var i = 0, len = ranges.length; i < len; ++i) {
                    this.addRange(ranges[i]);
                }
            }
        };
    } else if (util.isHostMethod(testSelection, "empty") && util.isHostMethod(testRange, "select") &&
               implementsControlRange && useDocumentSelection) {

        selProto.removeAllRanges = function() {
            // Added try/catch as fix for issue #21
            try {
                this.docSelection.empty();

                // Check for empty() not working (issue #24)
                if (this.docSelection.type != "None") {
                    // Work around failure to empty a control selection by instead selecting a TextRange and then
                    // calling empty()
                    var doc;
                    if (this.anchorNode) {
                        doc = dom.getDocument(this.anchorNode);
                    } else if (this.docSelection.type == CONTROL) {
                        var controlRange = this.docSelection.createRange();
                        if (controlRange.length) {
                            doc = dom.getDocument(controlRange.item(0)).body.createTextRange();
                        }
                    }
                    if (doc) {
                        var textRange = doc.body.createTextRange();
                        textRange.select();
                        this.docSelection.empty();
                    }
                }
            } catch(ex) {}
            updateEmptySelection(this);
        };

        selProto.addRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                addRangeToControlSelection(this, range);
            } else {
                WrappedRange.rangeToTextRange(range).select();
                this._ranges[0] = range;
                this.rangeCount = 1;
                this.isCollapsed = this._ranges[0].collapsed;
                updateAnchorAndFocusFromRange(this, range, false);
            }
        };

        selProto.setRanges = function(ranges) {
            this.removeAllRanges();
            var rangeCount = ranges.length;
            if (rangeCount > 1) {
                createControlSelection(this, ranges);
            } else if (rangeCount) {
                this.addRange(ranges[0]);
            }
        };
    } else {
        module.fail("No means of selecting a Range or TextRange was found");
        return false;
    }

    selProto.getRangeAt = function(index) {
        if (index < 0 || index >= this.rangeCount) {
            throw new DOMException("INDEX_SIZE_ERR");
        } else {
            return this._ranges[index];
        }
    };

    var refreshSelection;

    if (useDocumentSelection) {
        refreshSelection = function(sel) {
            var range;
            if (api.isSelectionValid(sel.win)) {
                range = sel.docSelection.createRange();
            } else {
                range = dom.getBody(sel.win.document).createTextRange();
                range.collapse(true);
            }


            if (sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else if (isTextRange(range)) {
                updateFromTextRange(sel, range);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else if (util.isHostMethod(testSelection, "getRangeAt") && typeof testSelection.rangeCount == "number") {
        refreshSelection = function(sel) {
            if (implementsControlRange && implementsDocSelection && sel.docSelection.type == CONTROL) {
                updateControlSelection(sel);
            } else {
                sel._ranges.length = sel.rangeCount = sel.nativeSelection.rangeCount;
                if (sel.rangeCount) {
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        sel._ranges[i] = new api.WrappedRange(sel.nativeSelection.getRangeAt(i));
                    }
                    updateAnchorAndFocusFromRange(sel, sel._ranges[sel.rangeCount - 1], selectionIsBackwards(sel.nativeSelection));
                    sel.isCollapsed = selectionIsCollapsed(sel);
                } else {
                    updateEmptySelection(sel);
                }
            }
        };
    } else if (selectionHasAnchorAndFocus && typeof testSelection.isCollapsed == BOOLEAN && typeof testRange.collapsed == BOOLEAN && api.features.implementsDomRange) {
        refreshSelection = function(sel) {
            var range, nativeSel = sel.nativeSelection;
            if (nativeSel.anchorNode) {
                range = getSelectionRangeAt(nativeSel, 0);
                sel._ranges = [range];
                sel.rangeCount = 1;
                updateAnchorAndFocusFromNativeSelection(sel);
                sel.isCollapsed = selectionIsCollapsed(sel);
            } else {
                updateEmptySelection(sel);
            }
        };
    } else {
        module.fail("No means of obtaining a Range or TextRange from the user's selection was found");
        return false;
    }

    selProto.refresh = function(checkForChanges) {
        var oldRanges = checkForChanges ? this._ranges.slice(0) : null;
        refreshSelection(this);
        if (checkForChanges) {
            var i = oldRanges.length;
            if (i != this._ranges.length) {
                return false;
            }
            while (i--) {
                if (!DomRange.rangesEqual(oldRanges[i], this._ranges[i])) {
                    return false;
                }
            }
            return true;
        }
    };

    // Removal of a single range
    var removeRangeManually = function(sel, range) {
        var ranges = sel.getAllRanges(), removed = false;
        sel.removeAllRanges();
        for (var i = 0, len = ranges.length; i < len; ++i) {
            if (removed || range !== ranges[i]) {
                sel.addRange(ranges[i]);
            } else {
                // According to the draft WHATWG Range spec, the same range may be added to the selection multiple
                // times. removeRange should only remove the first instance, so the following ensures only the first
                // instance is removed
                removed = true;
            }
        }
        if (!sel.rangeCount) {
            updateEmptySelection(sel);
        }
    };

    if (implementsControlRange) {
        selProto.removeRange = function(range) {
            if (this.docSelection.type == CONTROL) {
                var controlRange = this.docSelection.createRange();
                var rangeElement = getSingleElementFromRange(range);

                // Create a new ControlRange containing all the elements in the selected ControlRange minus the
                // element contained by the supplied range
                var doc = dom.getDocument(controlRange.item(0));
                var newControlRange = dom.getBody(doc).createControlRange();
                var el, removed = false;
                for (var i = 0, len = controlRange.length; i < len; ++i) {
                    el = controlRange.item(i);
                    if (el !== rangeElement || removed) {
                        newControlRange.add(controlRange.item(i));
                    } else {
                        removed = true;
                    }
                }
                newControlRange.select();

                // Update the wrapped selection based on what's now in the native selection
                updateControlSelection(this);
            } else {
                removeRangeManually(this, range);
            }
        };
    } else {
        selProto.removeRange = function(range) {
            removeRangeManually(this, range);
        };
    }

    // Detecting if a selection is backwards
    var selectionIsBackwards;
    if (!useDocumentSelection && selectionHasAnchorAndFocus && api.features.implementsDomRange) {
        selectionIsBackwards = function(sel) {
            var backwards = false;
            if (sel.anchorNode) {
                backwards = (dom.comparePoints(sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset) == 1);
            }
            return backwards;
        };

        selProto.isBackwards = function() {
            return selectionIsBackwards(this);
        };
    } else {
        selectionIsBackwards = selProto.isBackwards = function() {
            return false;
        };
    }

    // Selection text
    // This is conformant to the new WHATWG DOM Range draft spec but differs from WebKit and Mozilla's implementation
    selProto.toString = function() {

        var rangeTexts = [];
        for (var i = 0, len = this.rangeCount; i < len; ++i) {
            rangeTexts[i] = "" + this._ranges[i];
        }
        return rangeTexts.join("");
    };

    function assertNodeInSameDocument(sel, node) {
        if (sel.anchorNode && (dom.getDocument(sel.anchorNode) !== dom.getDocument(node))) {
            throw new DOMException("WRONG_DOCUMENT_ERR");
        }
    }

    // No current browsers conform fully to the HTML 5 draft spec for this method, so Rangy's own method is always used
    selProto.collapse = function(node, offset) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.collapseToPoint(node, offset);
        this.removeAllRanges();
        this.addRange(range);
        this.isCollapsed = true;
    };

    selProto.collapseToStart = function() {
        if (this.rangeCount) {
            var range = this._ranges[0];
            this.collapse(range.startContainer, range.startOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    selProto.collapseToEnd = function() {
        if (this.rangeCount) {
            var range = this._ranges[this.rangeCount - 1];
            this.collapse(range.endContainer, range.endOffset);
        } else {
            throw new DOMException("INVALID_STATE_ERR");
        }
    };

    // The HTML 5 spec is very specific on how selectAllChildren should be implemented so the native implementation is
    // never used by Rangy.
    selProto.selectAllChildren = function(node) {
        assertNodeInSameDocument(this, node);
        var range = api.createRange(dom.getDocument(node));
        range.selectNodeContents(node);
        this.removeAllRanges();
        this.addRange(range);
    };

    selProto.deleteFromDocument = function() {
        // Sepcial behaviour required for Control selections
        if (implementsControlRange && implementsDocSelection && this.docSelection.type == CONTROL) {
            var controlRange = this.docSelection.createRange();
            var element;
            while (controlRange.length) {
                element = controlRange.item(0);
                controlRange.remove(element);
                element.parentNode.removeChild(element);
            }
            this.refresh();
        } else if (this.rangeCount) {
            var ranges = this.getAllRanges();
            this.removeAllRanges();
            for (var i = 0, len = ranges.length; i < len; ++i) {
                ranges[i].deleteContents();
            }
            // The HTML5 spec says nothing about what the selection should contain after calling deleteContents on each
            // range. Firefox moves the selection to where the final selected range was, so we emulate that
            this.addRange(ranges[len - 1]);
        }
    };

    // The following are non-standard extensions
    selProto.getAllRanges = function() {
        return this._ranges.slice(0);
    };

    selProto.setSingleRange = function(range) {
        this.setRanges( [range] );
    };

    selProto.containsNode = function(node, allowPartial) {
        for (var i = 0, len = this._ranges.length; i < len; ++i) {
            if (this._ranges[i].containsNode(node, allowPartial)) {
                return true;
            }
        }
        return false;
    };

    selProto.toHtml = function() {
        var html = "";
        if (this.rangeCount) {
            var container = DomRange.getRangeDocument(this._ranges[0]).createElement("div");
            for (var i = 0, len = this._ranges.length; i < len; ++i) {
                container.appendChild(this._ranges[i].cloneContents());
            }
            html = container.innerHTML;
        }
        return html;
    };

    function inspect(sel) {
        var rangeInspects = [];
        var anchor = new DomPosition(sel.anchorNode, sel.anchorOffset);
        var focus = new DomPosition(sel.focusNode, sel.focusOffset);
        var name = (typeof sel.getName == "function") ? sel.getName() : "Selection";

        if (typeof sel.rangeCount != "undefined") {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                rangeInspects[i] = DomRange.inspect(sel.getRangeAt(i));
            }
        }
        return "[" + name + "(Ranges: " + rangeInspects.join(", ") +
                ")(anchor: " + anchor.inspect() + ", focus: " + focus.inspect() + "]";

    }

    selProto.getName = function() {
        return "WrappedSelection";
    };

    selProto.inspect = function() {
        return inspect(this);
    };

    selProto.detach = function() {
        this.win[windowPropertyName] = null;
        this.win = this.anchorNode = this.focusNode = null;
    };

    WrappedSelection.inspect = inspect;

    api.Selection = WrappedSelection;

    api.selectionPrototype = selProto;

    api.addCreateMissingNativeApiListener(function(win) {
        if (typeof win.getSelection == "undefined") {
            win.getSelection = function() {
                return api.getSelection(this);
            };
        }
        win = null;
    });
});

/**
 * @license Selection save and restore module for Rangy.
 * Saves and restores user selections using marker invisible elements in the DOM.
 *
 * Part of Rangy, a cross-browser JavaScript range and selection library
 * http://code.google.com/p/rangy/
 *
 * Depends on Rangy core.
 *
 * Copyright 2011, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.2
 * Build date: 13 November 2011
 */
rangy.createModule("SaveRestore", function(api, module) {
    api.requireModules( ["DomUtil", "DomRange", "WrappedRange"] );

    var dom = api.dom;

    var markerTextChar = "\ufeff";

    function gEBI(id, doc) {
        return (doc || document).getElementById(id);
    }

    function insertRangeBoundaryMarker(range, atStart) {
        var markerId = "selectionBoundary_" + (+new Date()) + "_" + ("" + Math.random()).slice(2);
        var markerEl;
        var doc = dom.getDocument(range.startContainer);

        // Clone the Range and collapse to the appropriate boundary point
        var boundaryRange = range.cloneRange();
        boundaryRange.collapse(atStart);

        // Create the marker element containing a single invisible character using DOM methods and insert it
        markerEl = doc.createElement("span");
        markerEl.id = markerId;
        markerEl.style.lineHeight = "0";
        markerEl.style.display = "none";
        markerEl.className = "rangySelectionBoundary";
        markerEl.appendChild(doc.createTextNode(markerTextChar));

        boundaryRange.insertNode(markerEl);
        boundaryRange.detach();
        return markerEl;
    }

    function setRangeBoundary(doc, range, markerId, atStart) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            range[atStart ? "setStartBefore" : "setEndBefore"](markerEl);
            markerEl.parentNode.removeChild(markerEl);
        } else {
            module.warn("Marker element has been removed. Cannot restore selection.");
        }
    }

    function compareRanges(r1, r2) {
        return r2.compareBoundaryPoints(r1.START_TO_START, r1);
    }

    function saveSelection(win) {
        win = win || window;
        var doc = win.document;
        if (!api.isSelectionValid(win)) {
            module.warn("Cannot save selection. This usually happens when the selection is collapsed and the selection document has lost focus.");
            return;
        }
        var sel = api.getSelection(win);
        var ranges = sel.getAllRanges();
        var rangeInfos = [], startEl, endEl, range;

        // Order the ranges by position within the DOM, latest first
        ranges.sort(compareRanges);

        for (var i = 0, len = ranges.length; i < len; ++i) {
            range = ranges[i];
            if (range.collapsed) {
                endEl = insertRangeBoundaryMarker(range, false);
                rangeInfos.push({
                    markerId: endEl.id,
                    collapsed: true
                });
            } else {
                endEl = insertRangeBoundaryMarker(range, false);
                startEl = insertRangeBoundaryMarker(range, true);

                rangeInfos[i] = {
                    startMarkerId: startEl.id,
                    endMarkerId: endEl.id,
                    collapsed: false,
                    backwards: ranges.length == 1 && sel.isBackwards()
                };
            }
        }

        // Now that all the markers are in place and DOM manipulation over, adjust each range's boundaries to lie
        // between its markers
        for (i = len - 1; i >= 0; --i) {
            range = ranges[i];
            if (range.collapsed) {
                range.collapseBefore(gEBI(rangeInfos[i].markerId, doc));
            } else {
                range.setEndBefore(gEBI(rangeInfos[i].endMarkerId, doc));
                range.setStartAfter(gEBI(rangeInfos[i].startMarkerId, doc));
            }
        }

        // Ensure current selection is unaffected
        sel.setRanges(ranges);
        return {
            win: win,
            doc: doc,
            rangeInfos: rangeInfos,
            restored: false
        };
    }

    function restoreSelection(savedSelection, preserveDirection) {
        if (!savedSelection.restored) {
            var rangeInfos = savedSelection.rangeInfos;
            var sel = api.getSelection(savedSelection.win);
            var ranges = [];

            // Ranges are in reverse order of appearance in the DOM. We want to restore earliest first to avoid
            // normalization affecting previously restored ranges.
            for (var len = rangeInfos.length, i = len - 1, rangeInfo, range; i >= 0; --i) {
                rangeInfo = rangeInfos[i];
                range = api.createRange(savedSelection.doc);
                if (rangeInfo.collapsed) {
                    var markerEl = gEBI(rangeInfo.markerId, savedSelection.doc);
                    if (markerEl) {
                        markerEl.style.display = "inline";
                        var previousNode = markerEl.previousSibling;

                        // Workaround for issue 17
                        if (previousNode && previousNode.nodeType == 3) {
                            markerEl.parentNode.removeChild(markerEl);
                            range.collapseToPoint(previousNode, previousNode.length);
                        } else {
                            range.collapseBefore(markerEl);
                            markerEl.parentNode.removeChild(markerEl);
                        }
                    } else {
                        module.warn("Marker element has been removed. Cannot restore selection.");
                    }
                } else {
                    setRangeBoundary(savedSelection.doc, range, rangeInfo.startMarkerId, true);
                    setRangeBoundary(savedSelection.doc, range, rangeInfo.endMarkerId, false);
                }

                // Normalizing range boundaries is only viable if the selection contains only one range. For example,
                // if the selection contained two ranges that were both contained within the same single text node,
                // both would alter the same text node when restoring and break the other range.
                if (len == 1) {
                    range.normalizeBoundaries();
                }
                ranges[i] = range;
            }
            if (len == 1 && preserveDirection && api.features.selectionHasExtend && rangeInfos[0].backwards) {
                sel.removeAllRanges();
                sel.addRange(ranges[0], true);
            } else {
                sel.setRanges(ranges);
            }

            savedSelection.restored = true;
        }
    }

    function removeMarkerElement(doc, markerId) {
        var markerEl = gEBI(markerId, doc);
        if (markerEl) {
            markerEl.parentNode.removeChild(markerEl);
        }
    }

    function removeMarkers(savedSelection) {
        var rangeInfos = savedSelection.rangeInfos;
        for (var i = 0, len = rangeInfos.length, rangeInfo; i < len; ++i) {
            rangeInfo = rangeInfos[i];
            if (rangeInfo.collapsed) {
                removeMarkerElement(savedSelection.doc, rangeInfo.markerId);
            } else {
                removeMarkerElement(savedSelection.doc, rangeInfo.startMarkerId);
                removeMarkerElement(savedSelection.doc, rangeInfo.endMarkerId);
            }
        }
    }

    api.saveSelection = saveSelection;
    api.restoreSelection = restoreSelection;
    api.removeMarkerElement = removeMarkerElement;
    api.removeMarkers = removeMarkers;
});

/* globals -$ */
"use strict";

WYMeditor.SKINS.compact = {
    init: function(wym) {
        // Move the containers panel to the top area
        jQuery(wym._options.containersSelector + ', ' +
            wym._options.classesSelector, wym._box)
          .appendTo( jQuery("div.wym_area_top", wym._box) )
          .addClass("wym_dropdown")
          .css({"margin-right": "10px", "width": "120px", "float": "left"});

        // Render following sections as buttons
        jQuery(wym._options.toolsSelector, wym._box)
          .addClass("wym_buttons")
          .css({"margin-right": "10px", "float": "left"});

        // Make hover work under IE < 7
        jQuery(".wym_section", wym._box).hover(function(){
          jQuery(this).addClass("hover");
        },function(){
          jQuery(this).removeClass("hover");
        });

        var postInit = wym._options.postInit;
        wym._options.postInit = function(wym) {
            if (postInit) {
                postInit.call(wym, wym);
            }

            jQuery(wym._doc.body).css('background-color', '#f0f0f0');
        };
    }
};

"use strict";

WYMeditor.SKINS['default'] = {
    init: function (wym) {
        //render following sections as panels
        jQuery(wym._box).find(wym._options.classesSelector)
          .addClass("wym_panel");

        //render following sections as buttons
        jQuery(wym._box).find(wym._options.toolsSelector)
          .addClass("wym_buttons");

        //render following sections as dropdown menus
        jQuery(wym._box).find(wym._options.containersSelector)
          .addClass("wym_dropdown")
          .find(WYMeditor.H2)
          .append("<span> ></span>");

        // auto add some margin to the main area sides if left area
        // or right area are not empty (if they contain sections)
        jQuery(wym._box).find("div.wym_area_right ul")
          .parents("div.wym_area_right").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-right": "155px"});

        jQuery(wym._box).find("div.wym_area_left ul")
          .parents("div.wym_area_left").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-left": "155px"});

        //make hover work under IE < 7
        jQuery(wym._box).find(".wym_section").hover(
            function () {
                jQuery(this).addClass("hover");
            },
            function () {
                jQuery(this).removeClass("hover");
            }
        );
    }
};

"use strict";

WYMeditor.SKINS.legacy = {
    init: function (wym) {
        //render following sections as panels
        jQuery(wym._box).find(wym._options.classesSelector)
          .addClass("wym_panel");

        //render following sections as buttons
        jQuery(wym._box).find(wym._options.toolsSelector)
          .addClass("wym_buttons");

        //render following sections as dropdown menus
        jQuery(wym._box).find(wym._options.containersSelector)
          .addClass("wym_dropdown")
          .find(WYMeditor.H2)
          .append("<span> ></span>");

        // auto add some margin to the main area sides if left area
        // or right area are not empty (if they contain sections)
        jQuery(wym._box).find("div.wym_area_right ul")
          .parents("div.wym_area_right").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-right": "155px"});

        jQuery(wym._box).find("div.wym_area_left ul")
          .parents("div.wym_area_left").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-left": "155px"});

        //make hover work under IE < 7
        jQuery(wym._box).find(".wym_section").hover(
            function () {
                jQuery(this).addClass("hover");
            },
            function () {
                jQuery(this).removeClass("hover");
            }
        );
    }
};

jQuery.fn.selectify = function() {
    return this.each(function() {
        jQuery(this).hover(
            function() {
                jQuery("h2", this).css("background-position", "0px -18px");
                jQuery("ul", this).fadeIn("fast");
            },
		    function() {
		        jQuery("h2", this).css("background-position", "");
		        jQuery("ul", this).fadeOut("fast");
		    }
        );
    });
};

WYMeditor.SKINS.minimal = {
    //placeholder for the skin JS, if needed

    //init the skin
    //wym is the WYMeditor.editor instance
    init: function(wym) {

        //render following sections as dropdown menus
        jQuery(wym._box).find(wym._options.toolsSelector + ', ' + wym._options.containersSelector + ', ' + wym._options.classesSelector)
          .addClass("wym_dropdown")
          .selectify();


    }
};

/* globals -$ */
"use strict";

// Add classes to an element based on its current location relative to top and
// or bottom offsets.
// Useful for affixing an element on the page within a certain vertical range.
// Based largely off of the bootstrap affix plugin
// https://github.com/twbs/bootstrap/blob/master/js/affix.js
(function ($) {
    var Affix = function (element, options) {
        this.options = $.extend({}, $.fn.wymAffix.defaults, options);
        this.$window = $(window);

        this.$window.bind(
            'scroll.affix.data-api',
            $.proxy(this.checkPosition, this)
        );
        this.$window.bind(
            'click.affix.data-api',
            $.proxy(
                function () {
                    setTimeout(
                        $.proxy(this.checkPosition, this),
                        1
                    );
                },
                this
            )
        );
        this.$element = $(element);
        this.checkPosition();
    };

    Affix.prototype.checkPosition = function () {
        var scrollTop = this.$window.scrollTop()
          , offset = this.options.offset
          , offsetBottom = offset.bottom
          , offsetTop = offset.top
          , reset = 'affix affix-top affix-bottom'
          , desiredAffixType
          , isBelowTop = true
          , isAboveBottom = true;

        if (typeof offset !== 'object') {
            offsetBottom = offsetTop = offset;
        }
        if (typeof offsetTop === 'function') {
            offsetTop = offset.top();
        }
        if (typeof offsetBottom === 'function') {
            offsetBottom = offset.bottom();
        }

        if (offsetTop !== null) {
            isBelowTop = scrollTop > offsetTop;
        }
        if (offsetBottom !== null) {
            isAboveBottom = scrollTop + this.$element.height() < offsetBottom;
        }

        if (isBelowTop && isAboveBottom) {
            desiredAffixType = 'affix';
        } else if (isAboveBottom === false) {
            // We're below the bottom offset
            desiredAffixType = 'affix-bottom';
        } else {
            desiredAffixType = 'affix-top';
        }

        if (this.currentAffixType === desiredAffixType) {
            // We're already properly-affixed. No changes required.
            return;
        }

        this.$element.removeClass(reset).addClass(desiredAffixType);

        this.currentAffixType = desiredAffixType;
    };


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

    $.fn.wymAffix = function (option) {
        return this.each(function () {
            var $this = $(this)
                , data = $this.data('affix')
                , options = typeof option === 'object' && option;

            if (!data) {
                $this.data(
                    'affix',
                    (data = new Affix(this, options))
                );
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.wymAffix.Constructor = Affix;

    $.fn.wymAffix.defaults = {
        offset: 0
    };
}(jQuery));

WYMeditor.SKINS.seamless = {
    OPTS: {
        iframeHtml: [""
        , '<div class="wym_iframe wym_section">'
            , '<iframe src="' + WYMeditor.IFRAME_BASE_PATH + 'wymiframe.html" '
                , 'frameborder="0" '
                , 'border="0" '
                , 'scrolling="no" '
                , 'marginheight="0px" '
                , 'marginwidth="0px" '
                , '>'
            , '</iframe>'
        , '</div>'
        ].join(""),
        // After Iframe initialization, check if we're ready to perform the
        // first resize every this many ms
        initIframeCheckFrequency: 50,
        // After load or after images are inserted, check every this many ms to
        // see if they've properly set their height.
        imagesLoadedCheckFrequency: 300,
        // After this many ms, give up on images finishing loading. Some images
        // might never load due to network connectivity or bad links.
        imagesLoadedCheckTimeout: 5000
    },
    init: function (wym) {
        var This = WYMeditor.SKINS.seamless;

        // TODO: Find a unified strategy for dealing with loading polyfills
        // This is a polyfill for old IE
        if (!Date.now) {
            Date.now = function now() {
                return new Date().getTime();
            };
        }

        wym.seamlessSkinOpts = jQuery.extend(
            This.OPTS,
            {
                initialIframeResizeTimer: null,
                resizeAfterImagesLoadTimer: null,
                _imagesLoadedCheckStartedTime: 0,
                minimumHeight: jQuery(wym._element).height()
            }
        );
        This.initUIChrome(wym);

        // The Iframe isn't initialized at this point, so we'll need to wait
        // until it is before attempting to use it.
        jQuery(wym._element).bind(
            WYMeditor.EVENTS.postIframeInitialization,
            This.postIframeInit
        );
    },
    postIframeInit: function (e, wym) {
        var This = WYMeditor.SKINS.seamless;

        // Perform an initial resize, if necessary
        This.resizeIframeOnceBodyExists(wym);

        // Detect possible Block creation so that we can always keep the iframe
        // properly resized and the current container in view
        jQuery(wym._element).bind(
            WYMeditor.EVENTS.postBlockMaybeCreated,
            function () {
                This.resizeAndScrollIfNeeded(wym);
            }
        );
    },
    initUIChrome: function (wym) {
        // Initialize the toolbar and classes/containers selectors

        // The classes and containers sections are dropdowns to the right of
        // the toolbar at the top
        var This = WYMeditor.SKINS.seamless,
            $dropdowns = jQuery(
            [
                wym._options.containersSelector
                , wym._options.classesSelector
            ].join(', '),
            wym._box
        ),
            $toolbar,
            $areaTop;

        $areaTop = jQuery("div.wym_area_top", wym._box);

        $dropdowns.appendTo($areaTop);
        $dropdowns.addClass("wym_dropdown");
        // Make dropdowns also work on click, for mobile devices
        jQuery(".wym_dropdown", wym._box).click(
            function () {
                jQuery(this).toggleClass("hover");
            }
        );

        // The toolbar uses buttons
        $toolbar = jQuery(wym._options.toolsSelector, wym._box);
        $toolbar.addClass("wym_buttons");

        This.affixTopControls(wym);

    },
    affixTopControls: function (wym) {
        // Affix the top area, which contains the toolbar and containers, to
        // the top of the screen so that we can see it, even if we're scrolled
        // down.
        var $areaTop,
            $offsetWrapper,
            earlyScrollPixels = 5,
            usePlaceholderWidth,
            $placeholder;

        $areaTop = jQuery("div.wym_area_top", wym._box);

        // Use a wrapper so we can keep the toolbar styling consistent
        $offsetWrapper = jQuery(
            '<div class="wym_skin_seamless wym_area_top_wrapper">'
        );
        $areaTop.wrap($offsetWrapper);
        $offsetWrapper = $areaTop.parent();

        // Add another, non-affixed wrapper to stick around and hold vertical
        // space. This avoids the "jump" when the toolbar switches to being
        // affixed
        $offsetWrapper.wrap('<div class="wym_area_top_affix_placeholder">');
        $placeholder = $offsetWrapper.parent();
        $placeholder.height($areaTop.height());

        usePlaceholderWidth = function () {
            // Hard-code the offsetWrapper width so that when this floats to
            // the top, it doesn't expand to take up all of the room to the
            // right
            $offsetWrapper.width($placeholder.width());
        };
        usePlaceholderWidth();
        jQuery(window).resize(usePlaceholderWidth);

        $offsetWrapper.wymAffix({
            offset: {
                top: function () {
                    return $placeholder.offset().top - earlyScrollPixels;
                },
                bottom: function () {
                    return $placeholder.offset().top +
                        wym.seamlessSkinIframeHeight;
                }
            }
        });
    },
    resizeIframeOnceBodyExists: function (wym) {
        // In IE, the wym._doc DOMLoaded event doesn't mean the iframe will
        // actually have a body. We need to wait until the body actually exists
        // before trying to set the initial hight of the iframe, so we hack
        // this together with setTimeout.
        var This = WYMeditor.SKINS.seamless,
            scrollHeightCalcFix;

        if (wym.seamlessSkinOpts.initialIframeResizeTimer) {
            // We're handling a timer, clear it
            window.clearTimeout(
                wym.seamlessSkinOpts.initialIframeResizeTimer
            );
            wym.seamlessSkinOpts.initialIframeResizeTimer = null;
        }

        if (typeof wym._doc.body === "undefined" || wym._doc.body === null) {
            // Body isn't ready
            wym.seamlessSkinOpts.initialIframeResizeTimer = window.setTimeout(
                function () {
                    This.resizeIframeOnceBodyExists(wym);
                },
                wym.seamlessSkinOpts.initIframeCheckFrequency
            );
            return;
        }
        // The body is ready, so let's get to resizing
        // For some reason, at least IE7 requires at least one access to the
        // scrollHeight before it gives a real value. I was unable to find any
        // kind of feature detection that would work here and the fix of adding
        // an extra access here doesn't have any real negative impact on the
        // other browsers, but does fix IE7's behavior.
        scrollHeightCalcFix = wym._doc.body.scrollHeight;
        This.resizeIframe(wym);
        This.resizeIframeOnceImagesLoaded(wym);
    },
    resizeIframeOnceImagesLoaded: function (wym) {
        // Even though the body may be "loaded" from a DOM even standpoint,
        // that doesn't mean that images have yet been retrieved or that their
        // heights have been determined. If an image's height pops in after
        // we've calculated the iframe height, the iframe will be too short.
        var This = WYMeditor.SKINS.seamless,
            images,
            imagesLength,
            i = 0,
            allImagesLoaded = true,
            skinOpts = wym.seamlessSkinOpts,
            timeWaited;

        if (typeof skinOpts._imagesLoadedCheckStartedTime === "undefined" ||
                skinOpts._imagesLoadedCheckStartedTime === 0) {
            skinOpts._imagesLoadedCheckStartedTime = Date.now();
        }

        if (skinOpts.resizeAfterImagesLoadTimer !== null) {
            // We're handling a timer, clear it
            window.clearTimeout(
                skinOpts.resizeAfterImagesLoadTimer
            );
            skinOpts.resizeAfterImagesLoadTimer = null;
        }

        images = jQuery(wym._doc).find('img');
        imagesLength = images.length;

        if (imagesLength === 0) {
            // No images. No need to worry about resizing based on them.
            return;
        }

        for (i = 0; i < imagesLength; i += 1) {
            if (!This._imageIsLoaded(images[i])) {
                // If any image isn't loaded, we're not done
                allImagesLoaded = false;
                break;
            }
        }
        // Even if all of the images haven't loaded, we can still be more
        // correct by accounting for any that have.
        This.resizeAndScrollIfNeeded(wym);

        if (allImagesLoaded === true) {
            // Clean up the timeout timer for subsequent calls
            skinOpts._imagesLoadedCheckStartedTime = 0;
            return;
        }

        timeWaited = Date.now() - skinOpts._imagesLoadedCheckStartedTime;
        if (timeWaited > skinOpts.imagesLoadedCheckTimeout) {
            // Clean up the timeout timer for subsequent calls
            skinOpts._imagesLoadedCheckStartedTime = 0;
            // We've waited long enough. The images might never load.
            // Don't set another timer.
            return;
        }

        // Let's check again in after a delay
        skinOpts.resizeAfterImagesLoadTimer = window.setTimeout(
            function () {
                This.resizeIframeOnceImagesLoaded(wym);
            },
            skinOpts.imagesLoadedCheckFrequency
        );
    },
    _imageIsLoaded: function (img) {
        if (img.complete !== true) {
            return false;
        }

        if (typeof img.naturalWidth !== "undefined" &&
                img.naturalWidth === 0) {
            return false;
        }

        return true;
    },
    _getIframeHeightStrategy: function (wym) {
        // For some browsers (IE8+ and FF), the scrollHeight of the body
        // doesn't seem to include the top and bottom margins of the body
        // relative to the HTML. This leaves the editing "window" smaller
        // than required, which results in weird overlaps at the start/end.
        // For those browsers, the HTML element's scrollHeight is more
        // reliable.
        // Let's detect which kind of browser we're dealing with one time
        // so we can just do the right thing in the future.
        var bodyScrollHeight,
            $htmlElement,
            htmlElementHeight,
            htmlElementScrollHeight,
            heightStrategy;

        $htmlElement = jQuery(wym._doc).children().eq(0);

        bodyScrollHeight = wym._doc.body.scrollHeight;
        htmlElementHeight = $htmlElement.height();
        htmlElementScrollHeight = $htmlElement[0].scrollHeight;

        if (htmlElementHeight >= bodyScrollHeight) {
            // Well-behaving browsers like FF and Chrome let us rely on the
            // HTML element's jQuery height() in every case. Hooray!
            heightStrategy = function (wym) {
                var $htmlElement = jQuery(wym._doc).children().eq(0),
                    htmlElementHeight = $htmlElement.height();

                return htmlElementHeight;
            };

            return heightStrategy;
        } else if (bodyScrollHeight > htmlElementScrollHeight) {
            // This is probably IE7, where the only thing reliable is the
            // bodyScrollHeight
            heightStrategy = function (wym) {
                return wym._doc.body.scrollHeight;
            };

            return heightStrategy;
        } else {
            // This is probably IE8+, where the htmlElementScrollHeight is
            // fairly reliable, but doesn't shrink when content is removed.
            heightStrategy = function (wym) {
                var $htmlElement = jQuery(wym._doc).children().eq(0),
                    htmlElementScrollHeight = $htmlElement[0].scrollHeight;

                // Without the 10px reduction in height, every possible action
                // adds 10 pixels of height.
                // TODO: Figure out why this happens and if we can make the
                // 10px number not magic (actually derived from a
                // margin/padding etc).
                return htmlElementScrollHeight - 10;
            };

            return heightStrategy;
        }
    },
    resizeIframe: function (wym) {
        var This = WYMeditor.SKINS.seamless,
            desiredHeight,
            $iframe = jQuery(wym._iframe),
            currentHeight = $iframe.height();

        if (typeof WYMeditor.IFRAME_HEIGHT_GETTER === "undefined") {
            WYMeditor.IFRAME_HEIGHT_GETTER = This._getIframeHeightStrategy(
                wym
            );
        }

        desiredHeight = WYMeditor.IFRAME_HEIGHT_GETTER(wym);

        // Don't let the height drop below the WYMeditor textarea. This allows
        // folks to use their favorite height-setting method on the textarea,
        // without needing to pass options on to WYMeditor.
        if (desiredHeight < wym.seamlessSkinOpts.minimumHeight) {
            desiredHeight = wym.seamlessSkinOpts.minimumHeight;
        }

        if (currentHeight !== desiredHeight) {
            $iframe.height(desiredHeight);
            wym.seamlessSkinIframeHeight = desiredHeight;

            return true;
        }
        return false;
    },
    scrollIfNeeded: function (wym) {
        var iframeOffset = jQuery(wym._iframe).offset(),
            iframeOffsetTop = iframeOffset.top,
            $container = jQuery(wym.selectedContainer()),
            containerOffset = $container.offset(),
            viewportLowestY,
            containerLowestY,
            newScrollTop,
            extraScroll = 20,
            scrollDiff,
            $window = jQuery(window),
            $body = jQuery(document.body);

        if ($container.length === 0) {
            // With nothing selected, there's no need to scroll
            return;
        }
        containerLowestY = iframeOffsetTop + containerOffset.top;
        containerLowestY += $container.outerHeight();
        viewportLowestY = $window.scrollTop() + $window.height();
        scrollDiff = containerLowestY - viewportLowestY;
        if (scrollDiff > 0) {
            // Part of our selected container isn't
            // visible, so we need to scroll down.
            newScrollTop = $body.scrollTop() + scrollDiff + extraScroll;
            $body.scrollTop(newScrollTop);
        }
    },
    resizeAndScrollIfNeeded: function (wym) {
        // Scroll the page so that our current selection
        // within the iframe is actually in view.
        var This = WYMeditor.SKINS.seamless,
            resizeOccurred = This.resizeIframe(wym);
        if (resizeOccurred !== true) {
            return;
        }
        This.scrollIfNeeded(wym);
    }
};

/* This file is part of the Silver skin for WYMeditor by Scott Edwin Lewis */

jQuery.fn.selectify = function() {
    return this.each(function() {
        jQuery(this).hover(
            function() {
                jQuery("h2", this).css("background-position", "0px -18px");
                jQuery("ul", this).fadeIn("fast");
            },
		    function() {
		        jQuery("h2", this).css("background-position", "");
		        jQuery("ul", this).fadeOut("fast");
		    }
        );
    });
};

WYMeditor.SKINS.silver = {

    init: function(wym) {

        //add some elements to improve the rendering
        jQuery(wym._box)
          .append('<div class="clear"></div>')
          .wrapInner('<div class="wym_inner"></div>');

        //render following sections as panels
        jQuery(wym._box).find(wym._options.classesSelector)
          .addClass("wym_panel");

        //render following sections as buttons
        jQuery(wym._box).find(wym._options.toolsSelector)
          .addClass("wym_buttons");

        //render following sections as dropdown menus
        jQuery(wym._box).find(wym._options.containersSelector)
          .addClass("wym_dropdown")
          .selectify();

        // auto add some margin to the main area sides if left area
        // or right area are not empty (if they contain sections)
        jQuery(wym._box).find("div.wym_area_right ul")
          .parents("div.wym_area_right").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-right": "155px"});

        jQuery(wym._box).find("div.wym_area_left ul")
          .parents("div.wym_area_left").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-left": "155px"});

        //make hover work under IE < 7
        jQuery(wym._box).find(".wym_section").hover(function(){
          jQuery(this).addClass("hover");
        },function(){
          jQuery(this).removeClass("hover");
        });
    }
};

WYMeditor.SKINS.twopanels = {

    init: function(wym) {

        //move the containers panel to the left area
        jQuery(wym._box).find(wym._options.containersSelector)
          .appendTo("div.wym_area_left");

        //render following sections as panels
        jQuery(wym._box).find(wym._options.classesSelector + ', ' +
          wym._options.containersSelector)
          .addClass("wym_panel");

        //render following sections as buttons
        jQuery(wym._box).find(wym._options.toolsSelector)
          .addClass("wym_buttons");

        // auto add some margin to the main area sides if left area
        // or right area are not empty (if they contain sections)
        jQuery(wym._box).find("div.wym_area_right ul")
          .parents("div.wym_area_right").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-right": "155px"});

        jQuery(wym._box).find("div.wym_area_left ul")
          .parents("div.wym_area_left").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-left": "115px"});

        //make hover work under IE < 7
        jQuery(wym._box).find(".wym_section").hover(function(){
          jQuery(this).addClass("hover");
        },function(){
          jQuery(this).removeClass("hover");
        });
    }
};
