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
    WYM_INDEX           - A string used to get/set the instance index.
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
    KEY                 - Standard key codes.
    NODE                - Node types.

*/

    A                   : "a",
    ALT                 : "alt",
    BLOCKQUOTE          : "blockquote",
    BODY                : "body",
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
    DIRECTION           : "{Wym_Direction}",
    DIV                 : "div",
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
    INSERT_HTML         : "InsertHTML",
    INSTANCES           : [],
    JQUERY_PATH         : "{Wym_Jquery_Path}",
    LI                  : "li",
    LOGO                : "{Wym_Logo}",
    NAME                : "name",
    NBSP                : '\xA0',
    NEWLINE             : "\n",
    OL                  : "ol",
    P                   : "p",
    PRE                 : "pre",
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
    TOOLS               : "{Wym_Tools}",
    TOOLS_ITEMS         : "{Wym_Tools_Items}",
    TOOL_CLASS          : "{Wym_Tool_Class}",
    TOOL_NAME           : "{Wym_Tool_Name}",
    TOOL_TITLE          : "{Wym_Tool_Title}",
    TR                  : "tr",
    UL                  : "ul",
    VERSION             : "@@VERSION",
    WYM_INDEX           : "wym_index",
    WYM_PATH            : "{Wym_Wym_Path}",

    // Commands for the `editor.exec` method
    EXEC_COMMANDS: {
        // Inline wrapping element toggles
        BOLD                : "Bold",
        ITALIC              : "Italic",
        SUPERSCRIPT         : "Superscript",
        SUBSCRIPT           : "Subscript",
        // Other manipulations
        CREATE_LINK         : "CreateLink",
        UNLINK              : "Unlink",
        FORMAT_BLOCK        : "FormatBlock",
        INSERT_IMAGE        : "InsertImage",
        UNDO                : "Undo",
        REDO                : "Redo",
        INSERT_LINEBREAK    : "InsertLineBreak",
        // Lists
        INSERT_ORDEREDLIST  : "InsertOrderedList",
        INSERT_UNORDEREDLIST: "InsertUnorderedList",
        INDENT              : "Indent",
        OUTDENT             : "Outdent",
        // UI
        TOGGLE_HTML         : "ToggleHtml"
    },

    // Containers that we allow at the root of the document (as a direct child
    // of the body tag)
    ROOT_CONTAINERS : [
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
    // These containers must be wrapped in a valid root container.
    FORBIDDEN_ROOT_CONTAINERS : [
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

    // The subset of the `ROOT_CONTAINERS` that prevent the user from using
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

    // The remaining `ROOT_CONTAINERS` that are not considered
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
    // this array isn't in the ROOT_CONTAINERS array, then its contents will be
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

    // Class for resize handles
    RESIZE_HANDLE_CLASS: "wym-resize-handle",

    // Classes that will be removed from all tags' class attribute by the
    // parser.
    CLASSES_REMOVED_BY_PARSER: [
        "apple-style-span"
    ],

    // Keyboard mappings so that we don't have to remember that 38 means up
    // when reading keyboard handlers
    KEY_CODE : {
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
        'postIframeInitialization': 'wym-postIframeInitialization',
        'postModification': 'wym-postModification',
        'postUndo': 'wym-postUndo',
        'postRedo': 'wym-postRedo'
    },

    // domNode.nodeType constants
    NODE_TYPE : {
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
        if (jQuery.getWymeditorByTextarea(elem[0])) {
            throw "It seems that this textarea already belongs to a " +
                "WYMeditor instance.";
        }
        var wym = this;
        // Store the instance in the INSTANCES array and store the index
        wym._index = WYMeditor.INSTANCES.push(wym) - 1;
        // The element replaced by the editor
        wym.element = elem;
        wym._options = options;
        // Path to the WYMeditor core
        wym._options.wymPath = wym._options.wymPath ||
            WYMeditor._computeWymPath();
        // Path to the main JS files
        wym._options.basePath = wym._options.basePath ||
            WYMeditor._computeBasePath(wym._options.wymPath);
        // The designmode iframe's base path
        wym._options.iframeBasePath = wym._options.iframeBasePath ||
            wym._options.basePath + WYMeditor.IFRAME_DEFAULT;

        // Initialize the editor instance
        wym._init();
    },

    EXTERNAL_MODULES : {}
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
    var $textareas = this;

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
            {
                'name': 'Bold',
                'title': 'Strong',
                'css': 'wym_tools_strong'
            },
            {
                'name': 'Italic',
                'title': 'Emphasis',
                'css': 'wym_tools_emphasis'
            },
            {
                'name': 'Superscript',
                'title': 'Superscript',
                'css': 'wym_tools_superscript'
            },
            {
                'name': 'Subscript',
                'title': 'Subscript',
                'css': 'wym_tools_subscript'
            },
            {
                'name': 'InsertOrderedList',
                'title': 'Ordered_List',
                'css': 'wym_tools_ordered_list'
            },
            {
                'name': 'InsertUnorderedList',
                'title': 'Unordered_List',
                'css': 'wym_tools_unordered_list'
            },
            {
                'name': 'Indent',
                'title': 'Indent',
                'css': 'wym_tools_indent'
            },
            {
                'name': 'Outdent',
                'title': 'Outdent',
                'css': 'wym_tools_outdent'
            },
            {
                'name': 'Undo',
                'title': 'Undo',
                'css': 'wym_tools_undo'
            },
            {
                'name': 'Redo',
                'title': 'Redo',
                'css': 'wym_tools_redo'
            },
            {
                'name': 'CreateLink',
                'title': 'Link',
                'css': 'wym_tools_link wym_opens_dialog'
            },
            {
                'name': 'Unlink',
                'title': 'Unlink',
                'css': 'wym_tools_unlink'
            },
            {
                'name': 'InsertImage',
                'title': 'Image',
                'css': 'wym_tools_image wym_opens_dialog'
            },
            {
                'name': 'InsertTable',
                'title': 'Table',
                'css': 'wym_tools_table wym_opens_dialog'
            },
            {
                'name': 'Paste',
                'title': 'Paste_From_Word',
                'css': 'wym_tools_paste wym_opens_dialog'
            },
            {
                'name': 'ToggleHtml',
                'title': 'HTML',
                'css': 'wym_tools_html'
            },
            {
                'name': 'Preview',
                'title': 'Preview',
                'css': 'wym_tools_preview wym_opens_dialog'
            }
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

        updateSelector:    ".wymupdate",
        updateEvent:       "click",

        stringDelimiterLeft:  "{",
        stringDelimiterRight: "}",

        preInit: null,
        preBind: null,
        postInit: null

    }, options);

    options = jQuery.extend(WYMeditor.DEFAULT_DIALOG_OPTIONS, options);

    return $textareas.each(function () {
        var textarea = this;
        // Assigning to _wym because the return value from new isn't
        // actually used, but we need to use new to properly change the
        // prototype
        textarea._wym = new WYMeditor.editor(jQuery(textarea), options);
    });
};

// Enable accessing of wymeditor instances via jQuery.wymeditors
jQuery.extend({
    wymeditors: function (i) {
        return WYMeditor.INSTANCES[i];
    }
});

jQuery.extend({
    getWymeditorByTextarea: function (textarea) {
        var i;
        if (
            !(
                textarea &&
                textarea.tagName &&
                textarea.tagName.toLowerCase() === 'textarea'
            )
        ) {
            throw "jQuery.getWymeditorByTextarea requires a textarea element.";
        }
        for (i = 0; i < WYMeditor.INSTANCES.length; i++) {
            if (textarea === WYMeditor.INSTANCES[i].element[0]) {
                return WYMeditor.INSTANCES[i];
            }
        }
        return false;
    }
});

/**
    jQuery.copyPropsFromObjectToObject
    =====================================

    General helper function that copies specified list of properties from a
    specified origin object to a specified target object.

    @param origin The origin object.
    @param target The target object.
    @param propNames An array of strings, representing the properties to copy.
*/
jQuery.extend({
    copyPropsFromObjectToObject: function (origin, target, propNames) {
        var i,
            propName,
            prop,
            props = {};

        for (i = 0; i < propNames.length; i++) {
            propName = propNames[i];
            prop = origin[propName];
            props[propName] = prop;
        }

        jQuery.extend(target, props);
    }
});

/**
    WYMeditor.isInternetExplorerPre11
    =================================

    Returns true if the current browser is an Internet Explorer version
    previous to 11. Otherwise, returns false.
*/
WYMeditor.isInternetExplorerPre11 = function () {
    if (
        jQuery.browser.msie &&
        jQuery.browser.versionNumber < 11
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor.isInternetExplorer11OrNewer
    =====================================

    Returns true if the current browser is an Internet Explorer version 11 or
    newer. Otherwise, returns false.
*/
WYMeditor.isInternetExplorer11OrNewer = function () {
    if (
        jQuery.browser.msie &&
        jQuery.browser.versionNumber >= 11
    ) {
        return true;
    }
    return false;
};

/**
    WYMeditor._computeWymPath
    =========================

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
WYMeditor._computeWymPath = function () {
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
    // We couldn't locate the base path. This will break language loading
    // and other features.
    WYMeditor.console.warn(
        "Error determining wymPath. No base WYMeditor file located."
    );
    WYMeditor.console.warn("Assuming wymPath to be the current URL");
    WYMeditor.console.warn("Please pass a correct wymPath option");

    // Guess that the wymPath is the current directory
    return '';
};

/**
    WYMeditor._computeBasePath
    ==========================

    Get the relative path to the WYMeditor directory root based on the path to
    the wymeditor base file. This path is used as the basis for loading:
    * Language files
    * Skins
    * The popup document https://github.com/wymeditor/wymeditor/issues/731
*/
WYMeditor._computeBasePath = function (wymPath) {
    // Strip everything after the last slash to get the base path
    var lastSlashIndex = wymPath.lastIndexOf('/');
    return wymPath.substr(0, lastSlashIndex + 1);
};

/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
jQuery.fn.isPhantomNode = function () {
    var $nodes = this;
    if ($nodes[0].nodeType === WYMeditor.NODE_TYPE.TEXT) {
        return !(/[^\t\n\r ]/.test($nodes[0].data));
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
    var $nodes = this,
        matched = [],
        $matched,
        cur = $nodes.get(0);

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
    var $nodes = this;
    return jQuery($nodes).nextContentsUntil('', '');
};

/**
    jQuery.fn.prevContentsUntil
    ===========================

    Acts like jQuery.prevUntil() but includes text nodes and comments and only
    works on the first element in the given jQuery collection..
*/
jQuery.fn.prevContentsUntil = function (selector, filter) {
    var $nodes = this,
        matched = [],
        $matched,
        cur = $nodes.get(0);

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
    var $nodes = this;
    return jQuery($nodes).prevContentsUntil('', '');
};

WYMeditor.isPhantomNode = function (n) {
    if (n.nodeType === WYMeditor.NODE_TYPE.TEXT) {
        return !(/[^\t\n\r ]/.test(n.data));
    }

    return false;
};

WYMeditor.isPhantomString = function (str) {
    return !(/[^\t\n\r ]/.test(str));
};

jQuery.fn.addBack = jQuery.fn.addBack ? jQuery.fn.addBack : jQuery.fn.andSelf;

// Returns the Parents or the node itself
// `selector` = a jQuery selector
jQuery.fn.parentsOrSelf = function (selector) {
    var $n = this;

    if (selector) {
        return $n.parents().addBack().filter(selector);
    } else {
        return $n.parents().addBack();
    }
};

// Various helpers

WYMeditor.Helper = {

    //replace all instances of 'old' by 'rep' in 'str' string
    replaceAllInStr: function (str, old, rep) {
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

    //Returns true if `array`` contains `thing`. Uses `===` for comparison of
    //provided `thing` with contents of provided `array`.
    arrayContains: function (arr, elem) {
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
    _getFromArrayByName: function (arr, name) {
        var i, item;
        for (i = 0; i < arr.length; i += 1) {
            item = arr[i];
            if (item.name === name) {
                return item;
            }
        }
        return null;
    },

    // naively returns all event types
    // of the provided an element
    // according the its property keys that
    // begin with 'on'
    getAllEventTypes: function (elem) {
        var result = [];
        for (var key in elem) {
            if (key.indexOf('on') === 0 && key !== 'onmousemove') {
                result.push(key.slice(2));
            }
        }
        return result.join(' ');
    }
};

/**
    WYMeditor._getWymClassForBrowser
    ================================

    Returns the constructor for the browser-specific wymeditor instance.

    If does not detect a supported browser, returns false;
*/
WYMeditor._getWymClassForBrowser = function () {

    // Using https://github.com/gabceb/jquery-browser-plugin
    switch (jQuery.browser.name) {
        case "msie":
            if (WYMeditor.isInternetExplorerPre11()) {
                return WYMeditor.WymClassTridentPre7;
            } else if (WYMeditor.isInternetExplorer11OrNewer()) {
                return WYMeditor.WymClassTrident7;
            } else {
                return false;
            }
            break;
        case "mozilla":
            return WYMeditor.WymClassGecko;
        case "chrome":
            return WYMeditor.WymClassBlink;
        case "safari":
            return WYMeditor.WymClassSafari;
    }

    if (jQuery.browser.webkit) {
        return WYMeditor.WymClassWebKit;
    }

    WYMeditor.console.warn("WYMeditor could not instantiate: this browser " +
        "is not supported");
    return false;
};
