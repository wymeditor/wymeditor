/* jshint strict: false, maxlen: 90, evil: true */
/* global -$, WYMeditor: true, console */

/*@version @@VERSION */
/**
    WYMeditor
    =========

    version @@VERSION

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
    VERSION             : "@@VERSION",
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


