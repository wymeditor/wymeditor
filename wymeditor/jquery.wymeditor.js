/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2008 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File: jquery.wymeditor.js
 *
 *        Main JS file with core classes and functions.
 *        See the documentation for more info.
 *
 * About: authors
 *
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Volker Mische (vmx a-t gmx dotde)
 *        Scott Lewis (lewiscot a-t gmail dotcom)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Daniel Reszka (d.reszka a-t wymeditor dotorg)
 */

/*
   Namespace: WYMeditor
   Global WYMeditor namespace.
*/
if(!WYMeditor) var WYMeditor = {};

jQuery.extend(WYMeditor, {

/*
    Constants: Global WYMeditor constants.

    VERSION             - Defines WYMeditor version.
    INSTANCES           - An array of loaded WYMeditor.editor instances.
    STRINGS             - An array of loaded WYMeditor language pairs/values.
    SKINS               - An array of loaded WYMeditor skins.
    NAME                - The "name" attribute.
    INDEX               - A string replaced by the instance index.
    BASE_PATH           - A string replaced by WYMeditor's base path.
    SKIN_PATH           - A string replaced by WYMeditor's skin path.
    WYM_PATH            - A string replaced by WYMeditor's main JS file path.
    SKINS_DEFAULT_PATH  - The skins default base path.
    SKINS_DEFAULT_CSS   - The skins default CSS file.
    LANG_DEFAULT_PATH   - The language files default path.
    IFRAME_BASE_PATH    - A string replaced by the designmode iframe's base path.
    IFRAME_DEFAULT      - The iframe's default base path.
    JQUERY_PATH         - A string replaced by the computed jQuery path.
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
    BODY,P,
    H1,H2,H3,H4,H5,H6,
    PRE,BLOCKQUOTE,
    A,BR,IMG,
    TABLE,TD,TH,
    UL,OL,LI            - HTML elements string representation.
    CLASS,HREF,SRC,
    TITLE,ALT           - HTML attributes string representation.
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

    VERSION             : "0.5-a1",
    INSTANCES           : [],
    STRINGS             : [],
    SKINS               : [],
    NAME                : "name",
    INDEX               : "{Wym_Index}",
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
    TD                  : "td",
    TH                  : "th",
    UL                  : "ul",
    OL                  : "ol",
    LI                  : "li",
    CLASS               : "class",
    HREF                : "href",
    SRC                 : "src",
    TITLE               : "title",
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
    PASTE               : "Paste",
    INDENT              : "Indent",
    OUTDENT             : "Outdent",
    TOGGLE_HTML         : "ToggleHtml",
    FORMAT_BLOCK        : "FormatBlock",
    PREVIEW             : "Preview",
	
	UNLINK			     : "Unlink",
	INSERT_UNORDEREDLIST : "InsertUnorderedList",
	INSERT_ORDEREDLIST	 : "InsertOrderedList",

    MAIN_CONTAINERS : new Array("p","h1","h2","h3","h4","h5","h6","pre","blockquote"),

    BLOCKS : new Array("address", "blockquote", "div", "dl",
	   "fieldset", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
	   "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
	   "li", "tbody", "td", "tfoot", "th", "thead", "tr"),

    KEY : {
      BACKSPACE: 8,
      ENTER: 13,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      CURSOR: new Array(37, 38, 39, 40),
      DELETE: 46
    },

    NODE : {
      ELEMENT: 1,
      ATTRIBUTE: 2,
      TEXT: 3
    },
	
    /*
        Class: WYMeditor.editor
        WYMeditor editor main class, instanciated for each editor occurrence.
    */

	editor : function(elem, options) {

        /*
            Constructor: WYMeditor.editor

            Initializes main values (index, elements, paths, ...)
            and call WYMeditor.editor.init which initializes the editor.

            Parameters:

                elem - The HTML element to be replaced by the editor.
                options - The hash of options.

            Returns:

                Nothing.

            See Also:

                <WYMeditor.editor.init>
        */

        //store the instance in the INSTANCES array and store the index
        this._index = WYMeditor.INSTANCES.push(this) - 1;
        //store the element replaced by the editor
        this._element = elem;
        //store the options
        this._options = options;
        //store the element's inner value
        this._html = jQuery(elem).val();

        //store the HTML option, if any
        if(this._options.html) this._html = this._options.html;
        //get or compute the base path (where the main JS file is located)
        this._options.basePath = this._options.basePath
        || this.computeBasePath();
        //get or set the skin path (where the skin files are located)
        this._options.skinPath = this._options.skinPath
        || this._options.basePath + WYMeditor.SKINS_DEFAULT_PATH
           + this._options.skin + '/';
        //get or compute the main JS file location
        this._options.wymPath = this._options.wymPath
        || this.computeWymPath();
        //get or set the language files path
        this._options.langPath = this._options.langPath
        || this._options.basePath + WYMeditor.LANG_DEFAULT_PATH;
        //get or set the designmode iframe's base path
        this._options.iframeBasePath = this._options.iframeBasePath
        || this._options.basePath + WYMeditor.IFRAME_DEFAULT;
        //get or compute the jQuery JS file location
        this._options.jQueryPath = this._options.jQueryPath
        || this.computeJqueryPath();

        //instanciate a WYMeditor Selection API class
        this.selection = new WYMeditor.WymSelection();

        //initialize the editor instance
        this.init();
	
	}

});


/********** JQUERY **********/

/**
 * Replace an HTML element by WYMeditor
 *
 * @example jQuery(".wymeditor").wymeditor(
 *        {
 *
 *        }
 *      );
 * @desc Example description here
 * 
 * @name WYMeditor
 * @description WYMeditor is a web-based WYSIWYM XHTML editor
 * @param Hash hash A hash of parameters
 * @option Integer iExample Description here
 * @option String sExample Description here
 *
 * @type jQuery
 * @cat Plugins/WYMeditor
 * @author Jean-Francois Hovinne
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

    boxHtml:   "<div class='wym_box'>"
              + "<div class='wym_area_top'>" 
              + WYMeditor.TOOLS
              + "</div>"
              + "<div class='wym_area_left'></div>"
              + "<div class='wym_area_right'>"
              + WYMeditor.CONTAINERS
              + WYMeditor.CLASSES
              + "</div>"
              + "<div class='wym_area_main'>"
              + WYMeditor.HTML
              + WYMeditor.IFRAME
              + WYMeditor.STATUS
              + "</div>"
              + "<div class='wym_area_bottom'>"
              + "<a class='wym_wymeditor_link' "
              + "href='http://www.wymeditor.org/'>WYMeditor</a>"
              + "</div>"
              + "</div>",

    iframeHtml:"<div class='wym_iframe wym_section'>"
              + "<iframe "
              + "src='"
              + WYMeditor.IFRAME_BASE_PATH
              + "wymiframe.html' "
              + "onload='this.contentWindow.parent.WYMeditor.INSTANCES["
              + WYMeditor.INDEX + "].initIframe(this)'"
              + "></iframe>"
              + "</div>",
              
    editorStyles: [],

    toolsHtml: "<div class='wym_tools wym_section'>"
              + "<h2>{Tools}</h2>"
              + "<ul>"
              + WYMeditor.TOOLS_ITEMS
              + "</ul>"
              + "</div>",
              
    toolsItemHtml:   "<li class='"
                        + WYMeditor.TOOL_CLASS
                        + "'><a href='#' name='"
                        + WYMeditor.TOOL_NAME
                        + "' title='"
                        + WYMeditor.TOOL_TITLE
                        + "'>"
                        + WYMeditor.TOOL_TITLE
                        + "</a></li>",

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

    containersHtml:    "<div class='wym_containers wym_section'>"
                        + "<h2>{Containers}</h2>"
                        + "<ul>"
                        + WYMeditor.CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
                        
    containersItemHtml:"<li class='"
                        + WYMeditor.CONTAINER_CLASS
                        + "'>"
                        + "<a href='#' name='"
                        + WYMeditor.CONTAINER_NAME
                        + "'>"
                        + WYMeditor.CONTAINER_TITLE
                        + "</a></li>",
                        
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

    classesHtml:       "<div class='wym_classes wym_section'>"
                        + "<h2>{Classes}</h2><ul>"
                        + WYMeditor.CLASSES_ITEMS
                        + "</ul></div>",

    classesItemHtml:   "<li><a href='#' name='"
                        + WYMeditor.CLASS_NAME
                        + "'>"
                        + WYMeditor.CLASS_TITLE
                        + "</a></li>",

    classesItems:      [],

    statusHtml:        "<div class='wym_status wym_section'>"
                        + "<h2>{Status}</h2>"
                        + "</div>",

    htmlHtml:          "<div class='wym_html wym_section'>"
                        + "<h2>{Source_Code}</h2>"
                        + "<textarea class='wym_html_val'></textarea>"
                        + "</div>",

    boxSelector:       ".wym_box",
    toolsSelector:     ".wym_tools",
    toolsListSelector: " ul",
    containersSelector:".wym_containers",
    classesSelector:   ".wym_classes",
    htmlSelector:      ".wym_html",
    iframeSelector:    ".wym_iframe iframe",
    statusSelector:    ".wym_status",
    toolSelector:      ".wym_tools a",
    containerSelector: ".wym_containers a",
    classSelector:     ".wym_classes a",
    htmlValSelector:   ".wym_html_val",
    
    hrefSelector:      ".wym_href",
    srcSelector:       ".wym_src",
    titleSelector:     ".wym_title",
    altSelector:       ".wym_alt",
    textSelector:      ".wym_text",
    
    rowsSelector:      ".wym_rows",
    colsSelector:      ".wym_cols",
    captionSelector:   ".wym_caption",
    
    submitSelector:    ".wym_submit",
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
    
    dialogFeatures:    "menubar=no,titlebar=no,toolbar=no,resizable=no"
                      + ",width=560,height=300,top=0,left=0",

    dialogHtml:      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'"
                      + " 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
                      + "<html><head>"
                      + "<link rel='stylesheet' type='text/css' media='screen'"
                      + " href='"
                      + WYMeditor.CSS_PATH
                      + "' />"
                      + "<title>"
                      + WYMeditor.DIALOG_TITLE
                      + "</title>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYMeditor.JQUERY_PATH
                      + "'></script>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYMeditor.WYM_PATH
                      + "'></script>"
                      + "</head>"
                      + WYMeditor.DIALOG_BODY
                      + "</html>",
                      
    dialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_LINK
               + "' />"
               + "<legend>{Link}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label>"
               + "<input type='text' class='wym_href' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label>"
               + "<input type='text' class='wym_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",
    
    dialogImageHtml:  "<body class='wym_dialog wym_dialog_image'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_IMAGE
               + "' />"
               + "<legend>{Image}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label>"
               + "<input type='text' class='wym_src' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Alternative_Text}</label>"
               + "<input type='text' class='wym_alt' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label>"
               + "<input type='text' class='wym_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",
    
    dialogTableHtml:  "<body class='wym_dialog wym_dialog_table'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_TABLE
               + "' />"
               + "<legend>{Table}</legend>"
               + "<div class='row'>"
               + "<label>{Caption}</label>"
               + "<input type='text' class='wym_caption' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Rows}</label>"
               + "<input type='text' class='wym_rows' value='3' size='3' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Cols}</label>"
               + "<input type='text' class='wym_cols' value='2' size='3' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogPasteHtml:  "<body class='wym_dialog wym_dialog_paste'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_PASTE
               + "' />"
               + "<fieldset>"
               + "<legend>{Paste_From_Word}</legend>"
               + "<div class='row'>"
               + "<textarea class='wym_text' rows='10' cols='50'></textarea>"
               + "</div>"
               + "<div class='row'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogPreviewHtml: "<body class='wym_dialog wym_dialog_preview'"
                      + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
                      + "></body>",
                      
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

    new WYMeditor.editor(jQuery(this),options);
  });
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
jQuery.extend({
  wymeditors: function(i) {
    return (WYMeditor.INSTANCES[i]);
  },
  wymstrings: function(sKey) {
    return (WYMeditor.STRINGS[sKey]);
  }
});


/********** WYMeditor **********/

/* @name Wymeditor
 * @description WYMeditor class
 */

/* @name init
 * @description Initializes a WYMeditor instance
 */
WYMeditor.editor.prototype.init = function() {

  //load subclass - browser specific
  //unsupported browsers: do nothing
  if (jQuery.browser.msie) {
    var WymClass = new WYMeditor.WymClassExplorer(this);
    var WymSel   = new WYMeditor.WymSelExplorer(this);
  }
  else if (jQuery.browser.mozilla) {
    var WymClass = new WYMeditor.WymClassMozilla(this);
    var WymSel   = new WYMeditor.WymSelMozilla(this);
  }
  else if (jQuery.browser.opera) {
    var WymClass = new WYMeditor.WymClassOpera(this);
    var WymSel   = new WYMeditor.WymSelOpera(this);
  }
  else if (jQuery.browser.safari) {
    var WymClass = new WYMeditor.WymClassSafari(this);
    var WymSel   = new WYMeditor.WymSelSafari(this);
  }
  
  if(WymClass) {
  
      if(jQuery.isFunction(this._options.preInit)) this._options.preInit(this);

      var SaxListener = new WYMeditor.XhtmlSaxListener();
      jQuery.extend(SaxListener, WymClass);
      this.parser = new WYMeditor.XhtmlParser(SaxListener);
      
      if(this._options.styles || this._options.stylesheet){
        this.configureEditorUsingRawCss();
      }
      
      this.helper = new WYMeditor.XmlHelper();
      
      //extend the Wymeditor object
      //don't use jQuery.extend since 1.1.4
      //jQuery.extend(this, WymClass);
      for (var prop in WymClass) { this[prop] = WymClass[prop]; }

      //load wymbox
      this._box = jQuery(this._element).hide().after(this._options.boxHtml).next();
      
      //construct the iframe
      var iframeHtml = this._options.iframeHtml;
      iframeHtml = iframeHtml
        .replaceAll(WYMeditor.INDEX,this._index)
        .replaceAll(WYMeditor.IFRAME_BASE_PATH, this._options.iframeBasePath);
      
      //construct wymbox
      var boxHtml = jQuery(this._box).html();
      
      boxHtml = boxHtml.replaceAll(WYMeditor.TOOLS, this._options.toolsHtml);
      boxHtml = boxHtml.replaceAll(WYMeditor.CONTAINERS,this._options.containersHtml);
      boxHtml = boxHtml.replaceAll(WYMeditor.CLASSES, this._options.classesHtml);
      boxHtml = boxHtml.replaceAll(WYMeditor.HTML, this._options.htmlHtml);
      boxHtml = boxHtml.replaceAll(WYMeditor.IFRAME, iframeHtml);
      boxHtml = boxHtml.replaceAll(WYMeditor.STATUS, this._options.statusHtml);
      
      //construct tools list
      var aTools = eval(this._options.toolsItems);
      var sTools = "";

      for(var i = 0; i < aTools.length; i++) {
        var oTool = aTools[i];
        if(oTool.name && oTool.title)
          sTools += this._options.toolsItemHtml
          .replaceAll(WYMeditor.TOOL_NAME, oTool.name)
          .replaceAll(WYMeditor.TOOL_TITLE,
              this._options.stringDelimiterLeft
            + oTool.title
            + this._options.stringDelimiterRight)
          .replaceAll(WYMeditor.TOOL_CLASS, oTool.css);
      }

      boxHtml = boxHtml.replaceAll(WYMeditor.TOOLS_ITEMS, sTools);

      //construct classes list
      var aClasses = eval(this._options.classesItems);
      var sClasses = "";

      for(var i = 0; i < aClasses.length; i++) {
        var oClass = aClasses[i];
        if(oClass.name && oClass.title)
          sClasses += this._options.classesItemHtml
          .replaceAll(WYMeditor.CLASS_NAME, oClass.name)
          .replaceAll(WYMeditor.CLASS_TITLE, oClass.title);
      }

      boxHtml = boxHtml.replaceAll(WYMeditor.CLASSES_ITEMS, sClasses);
      
      //construct containers list
      var aContainers = eval(this._options.containersItems);
      var sContainers = "";

      for(var i = 0; i < aContainers.length; i++) {
        var oContainer = aContainers[i];
        if(oContainer.name && oContainer.title)
          sContainers += this._options.containersItemHtml
          .replaceAll(WYMeditor.CONTAINER_NAME, oContainer.name)
          .replaceAll(WYMeditor.CONTAINER_TITLE,
              this._options.stringDelimiterLeft
            + oContainer.title
            + this._options.stringDelimiterRight)
          .replaceAll(WYMeditor.CONTAINER_CLASS, oContainer.css);
      }

      boxHtml = boxHtml.replaceAll(WYMeditor.CONTAINERS_ITEMS, sContainers);

      //l10n
      boxHtml = this.replaceStrings(boxHtml);
      
      //load html in wymbox
      jQuery(this._box).html(boxHtml);
      
      //hide the html value
      jQuery(this._box).find(this._options.htmlSelector).hide();
      
      //enable the skin
      this.loadSkin();
      
    }
    
    if(WymSel) {
    
      //extend the selection object
      //don't use jQuery.extend since 1.1.4
      //jQuery.extend(this.selection, WymSel);
      for (prop in WymSel) { this.selection[prop] = WymSel[prop]; }
    }
};

WYMeditor.editor.prototype.bindEvents = function() {

  //copy the instance
  var wym = this;
  
  //handle click event on tools buttons
  jQuery(this._box).find(this._options.toolSelector).click(function() {
    wym.exec(jQuery(this).attr(WYMeditor.NAME));
    return(false);
  });
  
  //handle click event on containers buttons
  jQuery(this._box).find(this._options.containerSelector).click(function() {
    wym.container(jQuery(this).attr(WYMeditor.NAME));
    return(false);
  });
  
  //handle keyup event on html value: set the editor value
  jQuery(this._box).find(this._options.htmlValSelector).keyup(function() {
    jQuery(wym._doc.body).html(jQuery(this).val());
  });
  
  //handle click event on classes buttons
  jQuery(this._box).find(this._options.classSelector).click(function() {
  
    var aClasses = eval(wym._options.classesItems);
    var sName = jQuery(this).attr(WYMeditor.NAME);
    
    var oClass = aClasses.findByName(sName);
    
    if(oClass) {
      var jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    return(false);
  });
  
  //handle event on update element
  jQuery(this._options.updateSelector)
    .bind(this._options.updateEvent, function() {
      wym.update();
  });
};

WYMeditor.editor.prototype.ready = function() {
  return(this._doc != null);
};


/********** METHODS **********/

/* @name box
 * @description Returns the WYMeditor container
 */
WYMeditor.editor.prototype.box = function() {
  return(this._box);
};

/* @name html
 * @description Get/Set the html value
 */
WYMeditor.editor.prototype.html = function(html) {

  if(html) jQuery(this._doc.body).html(html);
  else return(jQuery(this._doc.body).html());
};

/* @name xhtml
 * @description Cleans up the HTML
 */
WYMeditor.editor.prototype.xhtml = function() {
    return this.parser.parse(this.html());
};

/* @name exec
 * @description Executes a button command
 */
WYMeditor.editor.prototype.exec = function(cmd) {
  
  //base function for execCommand
  //open a dialog or exec
  switch(cmd) {
    case WYMeditor.CREATE_LINK:
      var container = this.container();
      if(container || this._selected_image) this.dialog(WYMeditor.DIALOG_LINK);
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
      this.dialog(WYMeditor.PREVIEW);
    break;
    
    default:
      this._exec(cmd);
    break;
  }
};

/* @name container
 * @description Get/Set the selected container
 */
WYMeditor.editor.prototype.container = function(sType) {

  if(sType) {
  
    var container = null;
    
    if(sType.toLowerCase() == WYMeditor.TH) {
    
      container = this.container();
      
      //find the TD or TH container
      switch(container.tagName.toLowerCase()) {
      
        case WYMeditor.TD: case WYMeditor.TH:
          break;
        default:
          var aTypes = new Array(WYMeditor.TD,WYMeditor.TH);
          container = this.findUp(this.container(), aTypes);
          break;
      }
      
      //if it exists, switch
      if(container!=null) {
      
        sType = (container.tagName.toLowerCase() == WYMeditor.TD)? WYMeditor.TH: WYMeditor.TD;
        this.switchTo(container,sType);
        this.update();
      }
    } else {
  
      //set the container type
      var aTypes=new Array(WYMeditor.P,WYMeditor.H1,WYMeditor.H2,WYMeditor.H3,WYMeditor.H4,WYMeditor.H5,
      WYMeditor.H6,WYMeditor.PRE,WYMeditor.BLOCKQUOTE);
      container = this.findUp(this.container(), aTypes);
      
      if(container) {
  
        var newNode = null;
  
        //blockquotes must contain a block level element
        if(sType.toLowerCase() == WYMeditor.BLOCKQUOTE) {
        
          var blockquote = this.findUp(this.container(), WYMeditor.BLOCKQUOTE);
          
          if(blockquote == null) {
          
            newNode = this._doc.createElement(sType);
            container.parentNode.insertBefore(newNode,container);
            newNode.appendChild(container);
            this.setFocusToNode(newNode.firstChild);
            
          } else {
          
            var nodes = blockquote.childNodes;
            var lgt = nodes.length;
            var firstNode = null;
            
            if(lgt > 0) firstNode = nodes.item(0);
            for(var x=0; x<lgt; x++) {
              blockquote.parentNode.insertBefore(nodes.item(0),blockquote);
            }
            blockquote.parentNode.removeChild(blockquote);
            if(firstNode) this.setFocusToNode(firstNode);
          }
        }
        
        else this.switchTo(container,sType);
      
        this.update();
      }
    }
  }
  else return(this.selected());
};

/* @name toggleClass
 * @description Toggles class on selected element, or one of its parents
 */
WYMeditor.editor.prototype.toggleClass = function(sClass, jqexpr) {

  var container = (this._selected_image
                    ? this._selected_image
                    : jQuery(this.selected()));
  container = jQuery(container).parentsOrSelf(jqexpr);
  jQuery(container).toggleClass(sClass);

  if(!jQuery(container).attr(WYMeditor.CLASS)) jQuery(container).removeAttr(this._class);

};

/* @name findUp
 * @description Returns the first parent or self container, based on its type
 */
WYMeditor.editor.prototype.findUp = function(node, filter) {

  //filter is a string or an array of strings

  if(node) {

      var tagname = node.tagName.toLowerCase();
      
      if(typeof(filter) == WYMeditor.STRING) {
    
        while(tagname != filter && tagname != WYMeditor.BODY) {
        
          node = node.parentNode;
          tagname = node.tagName.toLowerCase();
        }
      
      } else {
      
        var bFound = false;
        
        while(!bFound && tagname != WYMeditor.BODY) {
          for(var i = 0; i < filter.length; i++) {
            if(tagname == filter[i]) {
              bFound = true;
              break;
            }
          }
          if(!bFound) {
            node = node.parentNode;
            tagname = node.tagName.toLowerCase();
          }
        }
      }
      
      if(tagname != WYMeditor.BODY) return(node);
      else return(null);
      
  } else return(null);
};

/* @name switchTo
 * @description Switch the node's type
 */
WYMeditor.editor.prototype.switchTo = function(node,sType) {

  var newNode = this._doc.createElement(sType);
  var html = jQuery(node).html();
  node.parentNode.replaceChild(newNode,node);
  jQuery(newNode).html(html);
  this.setFocusToNode(newNode);
};

WYMeditor.editor.prototype.replaceStrings = function(sVal) {
  //check if the language file has already been loaded
  //if not, get it via a synchronous ajax call
  if(!WYMeditor.STRINGS[this._options.lang])
    eval(jQuery.ajax({url:this._options.langPath
      + this._options.lang + '.js', async:false}).responseText);

  //replace all the strings in sVal and return it
  for (var key in WYMeditor.STRINGS[this._options.lang]) {
    sVal = sVal.replaceAll(this._options.stringDelimiterLeft + key 
    + this._options.stringDelimiterRight,
    WYMeditor.STRINGS[this._options.lang][key]);
  };
  return(sVal);
};

WYMeditor.editor.prototype.encloseString = function(sVal) {

  return(this._options.stringDelimiterLeft
    + sVal
    + this._options.stringDelimiterRight);
};

/* @name status
 * @description Prints a status message
 */
WYMeditor.editor.prototype.status = function(sMessage) {

  //print status message
  jQuery(this._box).find(this._options.statusSelector).html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
WYMeditor.editor.prototype.update = function() {

  var html = this.xhtml();
  jQuery(this._element).val(html);
  jQuery(this._box).find(this._options.htmlValSelector).val(html);
};

/* @name dialog
 * @description Opens a dialog box
 */
WYMeditor.editor.prototype.dialog = function(sType) {
  
  var wDialog = window.open(
    '',
    'dialog',
    this._wym._options.dialogFeatures);

  if(wDialog) {

    var sBodyHtml = "";
    
    switch(sType) {

      case(WYMeditor.DIALOG_LINK):
        sBodyHtml = this._options.dialogLinkHtml;
      break;
      case(WYMeditor.DIALOG_IMAGE):
        sBodyHtml = this._options.dialogImageHtml;
      break;
      case(WYMeditor.DIALOG_TABLE):
        sBodyHtml = this._options.dialogTableHtml;
      break;
      case(WYMeditor.DIALOG_PASTE):
        sBodyHtml = this._options.dialogPasteHtml;
      break;
      case(WYMeditor.PREVIEW):
        sBodyHtml = this._options.dialogPreviewHtml;
      break;
    }
    
    //construct the dialog
    var dialogHtml = this._options.dialogHtml;
    dialogHtml = dialogHtml
      .replaceAll(WYMeditor.BASE_PATH, this._options.basePath)
      .replaceAll(WYMeditor.CSS_PATH, this._options.skinPath
        + WYMeditor.SKINS_DEFAULT_CSS)
      .replaceAll(WYMeditor.WYM_PATH, this._options.wymPath)
      .replaceAll(WYMeditor.JQUERY_PATH, this._options.jQueryPath)
      .replaceAll(WYMeditor.DIALOG_TITLE, this.encloseString(sType))
      .replaceAll(WYMeditor.DIALOG_BODY, sBodyHtml)
      .replaceAll(WYMeditor.INDEX, this._index);
      
    dialogHtml = this.replaceStrings(dialogHtml);
    
    var doc = wDialog.document;
    doc.write(dialogHtml);
    doc.close();
  }
};

/* @name toggleHtml
 * @description Shows/Hides the HTML
 */
WYMeditor.editor.prototype.toggleHtml = function() {
  jQuery(this._box).find(this._options.htmlSelector).toggle();
};

WYMeditor.editor.prototype.uniqueStamp = function() {
	var now = new Date();
	return("wym-" + now.getTime());
};

WYMeditor.editor.prototype.paste = function(sData) {

  var sTmp;
  var container = this.selected();
	
  //split the data, using double newlines as the separator
  var aP = sData.split(this._newLine + this._newLine);
  var rExp = new RegExp(this._newLine, "g");

  //add a P for each item
  if(container && container.tagName.toLowerCase() != WYMeditor.BODY) {
    for(x = aP.length - 1; x >= 0; x--) {
        sTmp = aP[x];
        //simple newlines are replaced by a break
        sTmp = sTmp.replace(rExp, "<br />");
        jQuery(container).after("<p>" + sTmp + "</p>");
    }
  } else {
    for(x = 0; x < aP.length; x++) {
        sTmp = aP[x];
        //simple newlines are replaced by a break
        sTmp = sTmp.replace(rExp, "<br />");
        jQuery(this._doc.body).append("<p>" + sTmp + "</p>");
    }
  
  }
};

WYMeditor.editor.prototype.addCssRules = function(doc, aCss) {
  var styles = doc.styleSheets[0];
  if(styles) {
    for(var i = 0; i < aCss.length; i++) {
      var oCss = aCss[i];
      if(oCss.name && oCss.css) this.addCssRule(styles, oCss);
    }
  }
};

/********** CONFIGURATION **********/

WYMeditor.editor.prototype.computeBasePath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor(\.pack){0,1}\.js(\?.*)?$/ ))
  })).attr('src').replace(/jquery\.wymeditor(\.pack){0,1}\.js(\?.*)?$/, '');
};

WYMeditor.editor.prototype.computeWymPath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor(\.pack){0,1}\.js(\?.*)?$/ ))
  })).attr('src');
};

WYMeditor.editor.prototype.computeJqueryPath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery(-(.*)){0,1}(\.pack){0,1}\.js(\?.*)?$/ ))
  })).attr('src');
};

WYMeditor.editor.prototype.computeCssPath = function() {
  return jQuery(jQuery.grep(jQuery('link'), function(s){
   return (s.href && s.href.match(/wymeditor\/skins\/(.*)screen\.css(\?.*)?$/ ))
  })).attr('href');
};

WYMeditor.editor.prototype.configureEditorUsingRawCss = function() {

  var CssParser = new WYMeditor.WymCssParser();
  if(this._options.stylesheet){
    CssParser.parse(jQuery.ajax({url: this._options.stylesheet,async:false}).responseText);
  }else{
    CssParser.parse(this._options.styles, false);
  }

  if(this._options.classesItems.length == 0) {
    this._options.classesItems = CssParser.css_settings.classesItems;
  }
  if(this._options.editorStyles.length == 0) {
    this._options.editorStyles = CssParser.css_settings.editorStyles;
  }
  if(this._options.dialogStyles.length == 0) {
    this._options.dialogStyles = CssParser.css_settings.dialogStyles;
  }
};

/********** EVENTS **********/

WYMeditor.editor.prototype.listen = function() {

  //don't use jQuery.find() on the iframe body
  //because of MSIE + jQuery + expando issue (#JQ1143)
  //jQuery(this._doc.body).find("*").bind("mouseup", this.mouseup);
  
  jQuery(this._doc.body).bind("mouseup", this.mouseup);
  var images = this._doc.body.getElementsByTagName("img");
  for(var i=0; i < images.length; i++) {
    jQuery(images[i]).bind("mouseup", this.mouseup);
  }
};

//mouseup handler
WYMeditor.editor.prototype.mouseup = function(evt) {
  
  var wym = WYMeditor.INSTANCES[this.ownerDocument.title];
  if(this.tagName.toLowerCase() == WYMeditor.IMG) wym._selected_image = this;
  else wym._selected_image = null;
  evt.stopPropagation();
};

/********** SKINS **********/

/*
 * Function: WYMeditor.loadCss
 *      Loads a stylesheet in the document.
 *
 * Parameters:
 *      href - The CSS path.
 */
WYMeditor.loadCss = function(href) {
    
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    var head = jQuery('head').get(0);
    head.appendChild(link);
};

/*
 *  Function: WYMeditor.editor.loadSkin
 *      Loads the skin CSS and initialization script (if needed).
 */
WYMeditor.editor.prototype.loadSkin = function() {

    //does the user want to automatically load the CSS (default: yes)?
    //we also test if it hasn't been already loaded by another instance
    //see below for a better (second) test
    if(this._options.loadSkin && !WYMeditor.SKINS[this._options.skin]) {

        //check if it hasn't been already loaded
        //so we don't load it more than once
        //(we check the existing <link> elements)

        var found = false;
        var rExp = new RegExp(this._options.skin
             + '\/' + WYMeditor.SKINS_DEFAULT_CSS + '$');

        jQuery('link').each( function() {
            if(this.href.match(rExp)) found = true;
        });

        //load it, using the skin path
        if(!found) WYMeditor.loadCss( this._options.skinPath
            + WYMeditor.SKINS_DEFAULT_CSS );
    }

    //put the classname (ex. wym_skin_default) on wym_box
    jQuery(this._box).addClass( "wym_skin_" + this._options.skin );

    //does the user want to use some JS to initialize the skin (default: yes)?
    //also check if it hasn't already been loaded by another instance
    if(this._options.initSkin && !WYMeditor.SKINS[this._options.skin]) {

        eval(jQuery.ajax({url:this._options.skinPath
            + WYMeditor.SKINS_DEFAULT_JS, async:false}).responseText);
    }

    //init the skin, if needed
    if(WYMeditor.SKINS[this._options.skin]
    && WYMeditor.SKINS[this._options.skin].init)
       WYMeditor.SKINS[this._options.skin].init(this);

};


/********** DIALOGS **********/

WYMeditor.INIT_DIALOG = function(index) {

  var wym = window.opener.WYMeditor.INSTANCES[index];
  var doc = window.document;
  var selected = wym.selected();
  var dialogType = jQuery(wym._options.dialogTypeSelector).val();
  var sStamp = wym.uniqueStamp();

  switch(dialogType) {

  case WYMeditor.DIALOG_LINK:
    //ensure that we select the link to populate the fields
    if(selected && selected.tagName && selected.tagName.toLowerCase != WYMeditor.A)
      selected = jQuery(selected).parentsOrSelf(WYMeditor.A);

    //fix MSIE selection if link image has been clicked
    if(!selected && wym._selected_image)
      selected = jQuery(wym._selected_image).parentsOrSelf(WYMeditor.A);
  break;

  }

  //pre-init functions
  if(jQuery.isFunction(wym._options.preInitDialog))
    wym._options.preInitDialog(wym,window);

  //add css rules from options
  var styles = doc.styleSheets[0];
  var aCss = eval(wym._options.dialogStyles);

  wym.addCssRules(doc, aCss);

  //auto populate fields if selected container (e.g. A)
  if(selected) {
    jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMeditor.HREF));
    jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMeditor.SRC));
    jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMeditor.TITLE));
    jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMeditor.ALT));
  }

  //auto populate image fields if selected image
  if(wym._selected_image) {
    jQuery(wym._options.dialogImageSelector + " " + wym._options.srcSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.SRC));
    jQuery(wym._options.dialogImageSelector + " " + wym._options.titleSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.TITLE));
    jQuery(wym._options.dialogImageSelector + " " + wym._options.altSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.ALT));
  }

  jQuery(wym._options.dialogLinkSelector + " "
    + wym._options.submitSelector).click(function() {

      var sUrl = jQuery(wym._options.hrefSelector).val();
      if(sUrl.length > 0) {
        wym._exec(WYMeditor.CREATE_LINK, sStamp);
        //don't use jQuery.find() see #JQ1143
        //var link = jQuery(wym._doc.body).find("a[@href=" + sStamp + "]");
        var link = null;
        var nodes = wym._doc.body.getElementsByTagName(WYMeditor.A);
        for(var i=0; i < nodes.length; i++) {
            if(jQuery(nodes[i]).attr(WYMeditor.HREF) == sStamp) {
                link = jQuery(nodes[i]);
                break;
            }
        }
        if(link) {
            link.attr(WYMeditor.HREF, sUrl);
            link.attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());
        }
      }
      window.close();
  });

  jQuery(wym._options.dialogImageSelector + " "
    + wym._options.submitSelector).click(function() {

      var sUrl = jQuery(wym._options.srcSelector).val();
      if(sUrl.length > 0) {
        wym._exec(WYMeditor.INSERT_IMAGE, sStamp);
        //don't use jQuery.find() see #JQ1143
        //var image = jQuery(wym._doc.body).find("img[@src=" + sStamp + "]");
        var image = null;
        var nodes = wym._doc.body.getElementsByTagName(WYMeditor.IMG);
        for(var i=0; i < nodes.length; i++) {
            if(jQuery(nodes[i]).attr(WYMeditor.SRC) == sStamp) {
                image = jQuery(nodes[i]);
                break;
            }
        }
        if(image) {
            image.attr(WYMeditor.SRC, sUrl);
            image.attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());
            image.attr(WYMeditor.ALT, jQuery(wym._options.altSelector).val());
        }
      }
      window.close();
  });

  jQuery(wym._options.dialogTableSelector + " "
    + wym._options.submitSelector).click(function() {

      var iRows = jQuery(wym._options.rowsSelector).val();
      var iCols = jQuery(wym._options.colsSelector).val();

      if(iRows > 0 && iCols > 0) {

        var table = wym._doc.createElement(WYMeditor.TABLE);
        var newRow = null;
    		var newCol = null;

    		var sCaption = jQuery(wym._options.captionSelector).val();

    		//we create the caption
    		var newCaption = table.createCaption();
    		newCaption.innerHTML = sCaption;

    		//we create the rows and cells
    		for(x=0; x<iRows; x++) {
    			newRow = table.insertRow(x);
    			for(y=0; y<iCols; y++) {newRow.insertCell(y);}
    		}

        //append the table after the selected container
        var node = jQuery(wym.findUp(wym.container(),
          WYMeditor.MAIN_CONTAINERS)).get(0);
        if(!node || !node.parentNode) jQuery(wym._doc.body).append(table);
        else jQuery(node).after(table);
      }
      window.close();
  });

  jQuery(wym._options.dialogPasteSelector + " "
    + wym._options.submitSelector).click(function() {

      var sText = jQuery(wym._options.textSelector).val();
      wym.paste(sText);
      window.close();
  });

  jQuery(wym._options.dialogPreviewSelector + " "
    + wym._options.previewSelector)
    .html(wym.xhtml());

  //cancel button
  jQuery(wym._options.cancelSelector).mousedown(function() {
    window.close();
  });

  //pre-init functions
  if(jQuery.isFunction(wym._options.postInitDialog))
    wym._options.postInitDialog(wym,window);

};



/********** SELECTION API **********/

WYMeditor.WymSelection = function() {
    this.test = "test from WymSelection";
};


WYMeditor.WymSelection.prototype = {
    /* The following properties are set in the browser specific file (in
     * getSelection()):
     * this.original
     * this.startNode
     * this.endNode
     * this.startOffset
     * this.endOffset
     * this.iscollapsed
     * this.container
     */

    /* The following methods are implemented in browser specific file:
     *  - deleteIfExpanded()
     *  - cursorToStart()
     *  - cursorToEnd()
     */


    isAtStart: function(jqexpr) {
        var parent = jQuery(this.startNode).parentsOrSelf(jqexpr);

        // jqexpr isn't a parent of the current cursor position
        if (parent.length==0)
            return false;

        var startNode = this.startNode;
        if (startNode.nodeType == WYMeditor.NODE.TEXT) {
            // 1. startNode ist first child
            // 2. offset needs to be 0 to be at the start (or the previous
            //    characters are whitespaces)
            if ((startNode.previousSibling
                    && !WYMeditor.isPhantomNode(startNode.previousSibling))
                        || (this.startOffset != 0 && !WYMeditor.isPhantomString(
                            startNode.data.substring(0, this.startOffset))))
                return false;
            else
                startNode = startNode.parentNode;
        }
        // cursor can be at the start of a text node and have a startOffset > 0
        // (if the node contains trailign whitespaces)
        else if (this.startOffset != 0)
            return false;


        for (var n=jQuery(startNode); n[0]!=parent[0]; n=n.parent()) {
            var firstChild = n.parent().children(':first');

            // node isn't first child => cursor can't be at the beginning
            if (firstChild[0] != n[0]
                    || (firstChild[0].previousSibling
                        && !WYMeditor.isPhantomNode(firstChild[0].previousSibling)))
                return false;
        }

        return true;
    },

    isAtEnd: function(jqexpr) {
        var parent = jQuery(this.endNode).parentsOrSelf(jqexpr);

        // jqexpr isn't a parent of the current cursor position
        if (parent.length==0)
            return false;
        else
            parent = parent[0];


        // This is the case if, e.g ("|" = cursor): <p>textnode|<br/></p>,
        // there the offset of endNode (endOffset) is 1 (behind the first node
        // of <p>)
        if (this.endNode == parent) {
            // NOTE I don't know if it is a good idea to delete the <br>
            // here, as "atEnd()" probably shouldn't change the dom tree,
            // but only searching it
            if (this.endNode.lastChild.nodeName == "BR")
                this.endNode.removeChild(endNode.lastChild);

            // if cursor is really at the end
            if (this.endOffset == 0)
                return false;
            else {
                for (var nNext=this.endNode.childNodes[this.endOffset-1].nextSibling;
                        nNext==null || nNext.nodeName == "BR";
                        nNext=nNext.nextSibling)

                if (nNext==null)
                    return true;
            }

        }
        else {
            var endNode = this.endNode;
            if (endNode.nodeType == WYMeditor.NODE.TEXT) {
                if ((endNode.nextSibling
                        && !WYMeditor.isPhantomNode(endNode.nextSibling))
                            || (this.endOffset != endNode.data.length))
                    return false;
                else
                    endNode = endNode.parentNode;
            }

            for (var n=endNode; n!=parent; n=n.parentNode) {
                var lastChild = n.parentNode.lastChild;
                // node isn't last child => cursor can't be at the end
                // (is this true?) in gecko there the last child could be a
                //     phantom node

                // sometimes also whitespacenodes which aren't phatom nodes
                // get stripped, but this is ok, as this is a wysiwym editor
                if ((lastChild != n) ||
                        (WYMeditor.isPhantomNode(lastChild)
                        && lastChild.previousSibling != n)) {
                    return false;
                }
            }
        }

        if (this.endOffset == this.endNode.length)
            return true;
        else
            return false;
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

      if(parseInt(key) == key && typeof value == 'object'){
        key = value.shift();
        value = value.pop();
      }
      if(key != '' && value != ''){
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
    if(escape_quotes != false) result = result.replace('"', '&quot;');
    if(escape_quotes == true)  result = result.replace('"', '&#039;');
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
      if(typeof v != 'function' && v.length != 0){
        var re = new RegExp('(\\w+)\\s*'+v);
        if(match = tag_attributes.match(re) ){
          var value = v.replace(/^[\s=]+/, "");
          var delimiter = value.charAt(0);
          delimiter = delimiter == '"' ? '"' : (delimiter=="'"?"'":'');
          if(delimiter != ''){
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
      "tabindex"
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
        "rel":/^(alternate|designates|stylesheet|start|next|prev|contents|index|glossary|copyright|chapter|section|subsection|appendix|help|bookmark| |shortcut|icon)+$/,
        "rev":/^(alternate|designates|stylesheet|start|next|prev|contents|index|glossary|copyright|chapter|section|subsection|appendix|help|bookmark| |shortcut|icon)+$/,
        "shape":/^(rect|rectangle|circ|circle|poly|polygon)$/,
        "5":"type"
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
      if(!this.skiped_attributes.contains(attribute) && !this.skiped_attribute_values.contains(value)){
        if (typeof value != 'function' && possible_attributes.contains(attribute)) {
          if (this.doesAttributeNeedsValidation(tag, attribute)) {
            if(this.validateAttribute(tag, attribute, value)){
              valid_attributes[attribute] = value;
            }
          }else{
            valid_attributes[attribute] = value;
          }
        }
      }
    }
    return valid_attributes;
  },
  getUniqueAttributesAndEventsForTag : function(tag)
  {
    var result = [];

    if (this._tags[tag] && this._tags[tag]['attributes']) {
      for (k in this._tags[tag]['attributes']) {
        result.push(parseInt(k) == k ? this._tags[tag]['attributes'][k] : k);
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
    for (var key in this._attributes){
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

          if ((defaults['except'] && defaults['except'].contains(tag)) || (defaults['only'] && !defaults['only'].contains(tag))) {
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
    return this._tags[tag] && ((this._tags[tag]['attributes'] && this._tags[tag]['attributes'][attribute]) || (this._tags[tag]['required'] && this._tags[tag]['required'].contains(attribute)));
  },
  validateAttribute : function(tag, attribute, value)
  {
    if ( this._tags[tag] &&
      (this._tags[tag]['attributes'] && this._tags[tag]['attributes'][attribute] && value.length > 0 && !value.match(this._tags[tag]['attributes'][attribute])) || // invalid format
      (this._tags[tag] && this._tags[tag]['required'] && this._tags[tag]['required'].contains(attribute) && value.length == 0) // required attribute
    ) {
      return false;
    }
    return this._tags[tag] != undefined;
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
  if (this._patterns.length == 0) {
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
  if (this._regex == null) {
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
  var mode = mode || "accept";
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern);
  if (this._mode_handlers[mode] == undefined) {
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
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, new_mode);
  if (this._mode_handlers[new_mode] == undefined) {
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
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, "__exit");
  if (this._mode_handlers[mode] == undefined) {
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
  if (this._regexes[mode] == undefined) {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, '_'+special);
  if (this._mode_handlers[special] == undefined) {
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
WYMeditor.Lexer.prototype.parse = function(raw)
{
  if (this._parser == undefined) {
    return false;
  }

  var length = raw.length;
  var parsed;
  while (typeof (parsed = this._reduce(raw)) == 'object') {
    var raw = parsed[0];
    var unmatched = parsed[1];
    var matched = parsed[2];
    var mode = parsed[3];

    if (! this._dispatchTokens(unmatched, matched, mode)) {
      return false;
    }

    if (raw == '') {
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
WYMeditor.Lexer.prototype._dispatchTokens = function(unmatched, matched, mode)
{
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
WYMeditor.Lexer.prototype._isModeEnd = function(mode)
{
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
WYMeditor.Lexer.prototype._isSpecialMode = function(mode)
{
  return (mode.substring(0,1) == "_");
};

/**
*    Strips the magic underscore marking single token
*    modes.
*    @param string mode    Mode to decode.
*    @return string         Underlying mode name.
*    @access private
*/
WYMeditor.Lexer.prototype._decodeSpecial = function(mode)
{
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
WYMeditor.Lexer.prototype._invokeParser = function(content, is_match)
{

  if (!/ +/.test(content) && ((content === '') || (content == false))) {
    return true;
  }
  var current = this._mode.getCurrent();
  var handler = this._mode_handlers[current];
  var result;
  eval('result = this._parser.' + handler + '(content, is_match);');
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
WYMeditor.Lexer.prototype._reduce = function(raw)
{
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
* This are the rules for breaking the XHTML code into events
* handled by the provided parser.
*
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlLexer = function(parser)
{
  jQuery.extend(this, new WYMeditor.Lexer(parser, 'Text'));

  this.mapHandler('Text', 'Text');

  this.addTokens();

  this.init();

  return this;
};


WYMeditor.XhtmlLexer.prototype.init = function()
{
};

WYMeditor.XhtmlLexer.prototype.addTokens = function()
{
  this.addCommentTokens('Text');
  this.addScriptTokens('Text');
  this.addCssTokens('Text');
  this.addTagTokens('Text');
};

WYMeditor.XhtmlLexer.prototype.addCommentTokens = function(scope)
{
  this.addEntryPattern("<!--", scope, 'Comment');
  this.addExitPattern("-->", 'Comment');
};

WYMeditor.XhtmlLexer.prototype.addScriptTokens = function(scope)
{
  this.addEntryPattern("<script", scope, 'Script');
  this.addExitPattern("</script>", 'Script');
};

WYMeditor.XhtmlLexer.prototype.addCssTokens = function(scope)
{
  this.addEntryPattern("<style", scope, 'Css');
  this.addExitPattern("</style>", 'Css');
};

WYMeditor.XhtmlLexer.prototype.addTagTokens = function(scope)
{
  this.addSpecialPattern("<\\s*[a-z0-9:\-]+\\s*>", scope, 'OpeningTag');
  this.addEntryPattern("<[a-z0-9:\-]+"+'[\\\/ \\\>]+', scope, 'OpeningTag');
  this.addInTagDeclarationTokens('OpeningTag');

  this.addSpecialPattern("</\\s*[a-z0-9:\-]+\\s*>", scope, 'ClosingTag');

};

WYMeditor.XhtmlLexer.prototype.addInTagDeclarationTokens = function(scope)
{
  this.addSpecialPattern('\\s+', scope, 'Ignore');

  this.addAttributeTokens(scope);

  this.addExitPattern('/>', scope);
  this.addExitPattern('>', scope);

};

WYMeditor.XhtmlLexer.prototype.addAttributeTokens = function(scope)
{
  this.addSpecialPattern("\\s*[a-z-_0-9]+\\s*(?=\=)\\s*", scope, 'TagAttributes');

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
WYMeditor.XhtmlParser = function(Listener, mode)
{
  var mode = mode || 'Text';
  this._Lexer = new WYMeditor.XhtmlLexer(this);
  this._Listener = Listener;
  this._mode = mode;
  this._matches = [];
  this._last_match = '';
  this._current_match = '';

  return this;
};

WYMeditor.XhtmlParser.prototype.parse = function(raw)
{
  this._Lexer.parse(this.beforeParsing(raw));
  return this.afterParsing(this._Listener.getResult());
};

WYMeditor.XhtmlParser.prototype.beforeParsing = function(raw)
{
  if(raw.match(/class="MsoNormal"/) || raw.match(/ns = "urn:schemas-microsoft-com/)){
    // Usefull for cleaning up content pasted from other sources (MSWord)
    this._Listener.avoidStylingTagsAndAttributes();
  }
  return this._Listener.beforeParsing(raw);
};

WYMeditor.XhtmlParser.prototype.afterParsing = function(parsed)
{
  if(this._Listener._avoiding_tags_implicitly){
    this._Listener.allowStylingTagsAndAttributes();
  }
  return this._Listener.afterParsing(parsed);
};


WYMeditor.XhtmlParser.prototype.Ignore = function(match, state)
{
  return true;
};

WYMeditor.XhtmlParser.prototype.Text = function(text)
{
  this._Listener.addContent(text);
  return true;
};

WYMeditor.XhtmlParser.prototype.Comment = function(match, status)
{
  return this._addNonTagBlock(match, status, 'addComment');
};

WYMeditor.XhtmlParser.prototype.Script = function(match, status)
{
  return this._addNonTagBlock(match, status, 'addScript');
};

WYMeditor.XhtmlParser.prototype.Css = function(match, status)
{
  return this._addNonTagBlock(match, status, 'addCss');
};

WYMeditor.XhtmlParser.prototype._addNonTagBlock = function(match, state, type)
{
  switch (state){
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
    }
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.OpeningTag = function(match, state)
{
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
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.ClosingTag = function(match, state)
{
  this._callCloseTagListener(this.normalizeTag(match));
  return true;
};

WYMeditor.XhtmlParser.prototype._callOpenTagListener = function(tag, attributes)
{
  var  attributes = attributes || {};
  this.autoCloseUnclosedBeforeNewOpening(tag);

  if(this._Listener.isBlockTag(tag)){
    this._Listener._tag_stack.push(tag);
    this._Listener.fixNestingBeforeOpeningBlockTag(tag, attributes);
    this._Listener.openBlockTag(tag, attributes);
    this._increaseOpenTagCounter(tag);
  }else if(this._Listener.isInlineTag(tag)){
    this._Listener.inlineTag(tag, attributes);
  }else{
    this._Listener.openUnknownTag(tag, attributes);
    this._increaseOpenTagCounter(tag);
  }
  this._Listener.last_tag = tag;
  this._Listener.last_tag_opened = true;
  this._Listener.last_tag_attributes = attributes;
};

WYMeditor.XhtmlParser.prototype._callCloseTagListener = function(tag)
{
  if(this._decreaseOpenTagCounter(tag)){
    this.autoCloseUnclosedBeforeTagClosing(tag);

    if(this._Listener.isBlockTag(tag)){
      var expected_tag = this._Listener._tag_stack.pop();
      if(expected_tag == false){
        return;
      }else if(expected_tag != tag){
        tag = expected_tag;
      }
      this._Listener.closeBlockTag(tag);
    }else{
      this._Listener.closeUnknownTag(tag);
    }
  }else{
    this._Listener.closeUnopenedTag(tag);
  }
  this._Listener.last_tag = tag;
  this._Listener.last_tag_opened = false;
};

WYMeditor.XhtmlParser.prototype._increaseOpenTagCounter = function(tag)
{
  this._Listener._open_tags[tag] = this._Listener._open_tags[tag] || 0;
  this._Listener._open_tags[tag]++;
};

WYMeditor.XhtmlParser.prototype._decreaseOpenTagCounter = function(tag)
{
  if(this._Listener._open_tags[tag]){
    this._Listener._open_tags[tag]--;
    if(this._Listener._open_tags[tag] == 0){
      this._Listener._open_tags[tag] = undefined;
    }
    return true;
  }
  return false;
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeNewOpening = function(new_tag)
{
  this._autoCloseUnclosed(new_tag, false);
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeTagClosing = function(tag)
{
  this._autoCloseUnclosed(tag, true);
};

WYMeditor.XhtmlParser.prototype._autoCloseUnclosed = function(new_tag, closing)
{
  var closing = closing || false;
  if(this._Listener._open_tags){
    for (var tag in this._Listener._open_tags) {
      var counter = this._Listener._open_tags[tag];
      if(counter > 0 && this._Listener.shouldCloseTagAutomatically(tag, new_tag, closing)){
        this._callCloseTagListener(tag, true);
      }
    }
  }
};

WYMeditor.XhtmlParser.prototype.getTagReplacements = function()
{
  return this._Listener.getTagReplacements();
};

WYMeditor.XhtmlParser.prototype.normalizeTag = function(tag)
{
  tag = tag.replace(/^([\s<\/>]*)|([\s<\/>]*)$/gm,'').toLowerCase();
  var tags = this._Listener.getTagReplacements();
  if(tags[tag]){
    return tags[tag];
  }
  return tag;
};

WYMeditor.XhtmlParser.prototype.TagAttributes = function(match, state)
{
  if(WYMeditor.LEXER_SPECIAL == state){
    this._current_attribute = match;
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.DoubleQuotedAttribute = function(match, state)
{
  if(WYMeditor.LEXER_UNMATCHED == state){
    this._tag_attributes[this._current_attribute] = match;
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.SingleQuotedAttribute = function(match, state)
{
  if(WYMeditor.LEXER_UNMATCHED == state){
    this._tag_attributes[this._current_attribute] = match;
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.UnquotedAttribute = function(match, state)
{
  this._tag_attributes[this._current_attribute] = match.replace(/^=/,'');
  return true;
};



/**
* XHTML Sax parser.
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlSaxListener = function()
{
  this.output = '';
  this.helper = new WYMeditor.XmlHelper();
  this._open_tags = {};
  this.validator = WYMeditor.XhtmlValidator;
  this._tag_stack = [];
  this.avoided_tags = [];

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

    this.block_tags = ["a", "abbr", "acronym", "address", "area", "b",
    "base", "bdo", "big", "blockquote", "body", "button",
    "caption", "cite", "code", "col", "colgroup", "dd", "del", "div",
    "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2",
    "h3", "h4", "h5", "h6", "html", "i", "ins",
    "kbd", "label", "legend", "li", "map", "noscript",
    "object", "ol", "optgroup", "option", "p", "param", "pre", "q",
    "samp", "script", "select", "small", "span", "strong", "style",
    "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
    "thead", "title", "tr", "tt", "ul", "var", "extends"];


    this.inline_tags = ["br", "hr", "img", "input"];

    return this;
};

WYMeditor.XhtmlSaxListener.prototype.shouldCloseTagAutomatically = function(tag, now_on_tag, closing)
{
  var closing = closing || false;
  if(tag == 'td'){
    if((closing && now_on_tag == 'tr') || (!closing && now_on_tag == 'td')){
      return true;
    }
  }
  if(tag == 'option'){
    if((closing && now_on_tag == 'select') || (!closing && now_on_tag == 'option')){
      return true;
    }
  }
  return false;
};

WYMeditor.XhtmlSaxListener.prototype.beforeParsing = function(raw)
{
  this.output = '';
  return raw;
};

WYMeditor.XhtmlSaxListener.prototype.afterParsing = function(xhtml)
{
  xhtml = this.replaceNamedEntities(xhtml);
  xhtml = this.joinRepeatedEntities(xhtml);
  xhtml = this.removeEmptyTags(xhtml);
  return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.replaceNamedEntities = function(xhtml)
{
  for (var entity in this.entities) {
    xhtml = xhtml.replace(entity, this.entities[entity]);
  }
  return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.joinRepeatedEntities = function(xhtml)
{
  var tags = 'em|strong|sub|sup|acronym|pre|del|blockquote|address';
  return xhtml.replace(new RegExp('<\/('+tags+')><\\1>' ,''),'').
  replace(new RegExp('(\s*<('+tags+')>\s*){2}(.*)(\s*<\/\\2>\s*){2}' ,''),'<\$2>\$3<\$2>');
};

WYMeditor.XhtmlSaxListener.prototype.removeEmptyTags = function(xhtml)
{
  return xhtml.replace(new RegExp('<('+this.block_tags.join("|")+')>(<br \/>|&#160;|&nbsp;|\s)*<\/\\1>' ,'g'),'');
};

WYMeditor.XhtmlSaxListener.prototype.getResult = function()
{
  return this.output;
};

WYMeditor.XhtmlSaxListener.prototype.getTagReplacements = function()
{
  return {'b':'strong', 'i':'em'};
};

WYMeditor.XhtmlSaxListener.prototype.addContent = function(text)
{
  this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addComment = function(text)
{
  if(this.remove_comments){
    this.output += text;
  }
};

WYMeditor.XhtmlSaxListener.prototype.addScript = function(text)
{
  if(!this.remove_scripts){
    this.output += text;
  }
};

WYMeditor.XhtmlSaxListener.prototype.addCss = function(text)
{
  if(!this.remove_embeded_styles){
    this.output += text;
  }
};

WYMeditor.XhtmlSaxListener.prototype.openBlockTag = function(tag, attributes)
{
  this.output += this.helper.tag(tag, this.validator.getValidTagAttributes(tag, attributes), true);
};

WYMeditor.XhtmlSaxListener.prototype.inlineTag = function(tag, attributes)
{
  this.output += this.helper.tag(tag, this.validator.getValidTagAttributes(tag, attributes));
};

WYMeditor.XhtmlSaxListener.prototype.openUnknownTag = function(tag, attributes)
{
  //this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.XhtmlSaxListener.prototype.closeBlockTag = function(tag)
{
  this.output = this.output.replace(/<br \/>$/, '')+this._getClosingTagContent('before', tag)+"</"+tag+">"+this._getClosingTagContent('after', tag);
};

WYMeditor.XhtmlSaxListener.prototype.closeUnknownTag = function(tag)
{
  //this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.closeUnopenedTag = function(tag)
{
  this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.avoidStylingTagsAndAttributes = function()
{
  this.avoided_tags = ['div','span'];
  this.validator.skiped_attributes = ['style'];
  this.validator.skiped_attribute_values = ['MsoNormal','main1']; // MS Word attributes for class
  this._avoiding_tags_implicitly = true;
};

WYMeditor.XhtmlSaxListener.prototype.allowStylingTagsAndAttributes = function()
{
  this.avoided_tags = [];
  this.validator.skiped_attributes = [];
  this.validator.skiped_attribute_values = [];
  this._avoiding_tags_implicitly = false;
};

WYMeditor.XhtmlSaxListener.prototype.isBlockTag = function(tag)
{
  return !this.avoided_tags.contains(tag) && this.block_tags.contains(tag);
};

WYMeditor.XhtmlSaxListener.prototype.isInlineTag = function(tag)
{
  return !this.avoided_tags.contains(tag) && this.inline_tags.contains(tag);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentAfterClosingTag = function(tag, content)
{
  this._insertContentWhenClosingTag('after', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentBeforeClosingTag = function(tag, content)
{
  this._insertContentWhenClosingTag('before', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.fixNestingBeforeOpeningBlockTag = function(tag, attributes)
{
    if(tag != 'li' && (tag == 'ul' || tag == 'ol') && this.last_tag && !this.last_tag_opened && this.last_tag == 'li'){
      this.output = this.output.replace(/<\/li>$/, '');
      this.insertContentAfterClosingTag(tag, '</li>');
    }
};

WYMeditor.XhtmlSaxListener.prototype._insertContentWhenClosingTag = function(position, tag, content)
{
  if(!this['_insert_'+position+'_closing']){
    this['_insert_'+position+'_closing'] = [];
  }
  if(!this['_insert_'+position+'_closing'][tag]){
    this['_insert_'+position+'_closing'][tag] = [];
  }
  this['_insert_'+position+'_closing'][tag].push(content);
};

WYMeditor.XhtmlSaxListener.prototype._getClosingTagContent = function(position, tag)
{
  if( this['_insert_'+position+'_closing'] &&
      this['_insert_'+position+'_closing'][tag] &&
      this['_insert_'+position+'_closing'][tag].length > 0){
        return this['_insert_'+position+'_closing'][tag].pop();
  }
  return '';
};


/********** CSS PARSER **********/


WYMeditor.WymCssLexer = function(parser, only_wym_blocks)
{
  var only_wym_blocks = (only_wym_blocks == undefined ? true : only_wym_blocks);

  jQuery.extend(this, new WYMeditor.Lexer(parser, (only_wym_blocks?'Ignore':'WymCss')));

  this.mapHandler('WymCss', 'Ignore');

  if(only_wym_blocks == true){
    this.addEntryPattern("/\\\x2a[<\\s]*WYMeditor[>\\s]*\\\x2a/", 'Ignore', 'WymCss');
    this.addExitPattern("/\\\x2a[<\/\\s]*WYMeditor[>\\s]*\\\x2a/", 'WymCss');
  }

  this.addSpecialPattern("\\\x2e[a-z-_0-9]+[\\sa-z]*", 'WymCss', 'WymCssStyleDeclaration');

  this.addEntryPattern("/\\\x2a", 'WymCss', 'WymCssComment');
  this.addExitPattern("\\\x2a/", 'WymCssComment');

  this.addEntryPattern("\x7b", 'WymCss', 'WymCssStyle');
  this.addExitPattern("\x7d", 'WymCssStyle');

  this.addEntryPattern("/\\\x2a", 'WymCssStyle', 'WymCssFeddbackStyle');
  this.addExitPattern("\\\x2a/", 'WymCssFeddbackStyle');

  return this;
};

WYMeditor.WymCssParser = function()
{
  this._in_style = false;
  this._has_title = false;
  this.only_wym_blocks = true;
  this.css_settings = {'classesItems':[], 'editorStyles':[], 'dialogStyles':[]};
  return this;
};

WYMeditor.WymCssParser.prototype.parse = function(raw, only_wym_blocks)
{
  var only_wym_blocks = (only_wym_blocks == undefined ? this.only_wym_blocks : only_wym_blocks);
  this._Lexer = new WYMeditor.WymCssLexer(this, only_wym_blocks);
  this._Lexer.parse(raw);
};

WYMeditor.WymCssParser.prototype.Ignore = function(match, state)
{
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssComment = function(text, status)
{
  if(text.match(/end[a-z0-9\s]*wym[a-z0-9\s]*/mi)){
    return false;
  }
  if(status == WYMeditor.LEXER_UNMATCHED){
    if(!this._in_style){
      this._has_title = true;
      this._current_item = {'title':text.trim()};
    }else{
      if(this._current_item[this._current_element]){
        if(!this._current_item[this._current_element].expressions){
          this._current_item[this._current_element].expressions = [text];
        }else{
          this._current_item[this._current_element].expressions.push(text);
        }
      }
    }
    this._in_style = true;
  }
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssStyle = function(match, status)
{
  if(status == WYMeditor.LEXER_UNMATCHED){
    match = match.trim();
    if(match != ''){
      this._current_item[this._current_element].style = match;
    }
  }else if (status == WYMeditor.LEXER_EXIT){
    this._in_style = false;
    this._has_title = false;
    this.addStyleSetting(this._current_item);
  }
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssFeddbackStyle = function(match, status)
{
  if(status == WYMeditor.LEXER_UNMATCHED){
    this._current_item[this._current_element].feedback_style = match.replace(/^([\s\/\*]*)|([\s\/\*]*)$/gm,'');
  }
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssStyleDeclaration = function(match)
{
  match = match.replace(/^([\s\.]*)|([\s\.*]*)$/gm, '');

  var tag = '';
  if(match.indexOf(' ') > 0){
    var parts = match.split(' ');
    this._current_element = parts[0];
    var tag = parts[1];
  }else{
    this._current_element = match;
  }

  if(!this._has_title){
    this._current_item = {'title':(!tag?'':tag.toUpperCase()+': ')+this._current_element};
    this._has_title = true;
  }

  if(!this._current_item[this._current_element]){
    this._current_item[this._current_element] = {'name':this._current_element};
  }
  if(tag){
    if(!this._current_item[this._current_element].tags){
      this._current_item[this._current_element].tags = [tag];
    }else{
      this._current_item[this._current_element].tags.push(tag);
    }
  }
  return true;
};

WYMeditor.WymCssParser.prototype.addStyleSetting = function(style_details)
{
  for (var name in style_details){
    var details = style_details[name];
    if(typeof details == 'object' && name != 'title'){

      this.css_settings.classesItems.push({
        'name': details.name.trim(),
        'title': style_details.title,
        'expr' : (details.expressions||details.tags).join(', ').trim()
      });
      if(details.feedback_style){
        this.css_settings.editorStyles.push({
          'name': '.'+details.name.trim(),
          'css': details.feedback_style
        });
      }
      if(details.style){
        this.css_settings.dialogStyles.push({
          'name': '.'+details.name.trim(),
          'css': details.style
        });
      }
    }
  }
};

/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
jQuery.fn.isPhantomNode = function() {
  if (this[0].nodeType == 3)
    return !(/[^\t\n\r ]/.test(this[0].data));

  return false;
};

WYMeditor.isPhantomNode = function(n) {
  if (n.nodeType == 3)
    return !(/[^\t\n\r ]/.test(n.data));

  return false;
};

WYMeditor.isPhantomString = function(str) {
    return !(/[^\t\n\r ]/.test(str));
};

// Returns the Parents or the node itself
// jqexpr = a jQuery expression
jQuery.fn.parentsOrSelf = function(jqexpr) {
  var n = this;

  if (n[0].nodeType == 3)
    n = n.parents().slice(0,1);

//  if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
  if (n.filter(jqexpr).size() == 1)
    return n;
  else
    return n.parents(jqexpr).slice(0,1);
};

// String helpers
if(!String.prototype.insertAt) {
    String.prototype.insertAt = function(inserted, pos) {
        return(this.substr(0,pos) + inserted + this.substring(pos));
    };
};

if(!String.prototype.replaceAll) {
    String.prototype.replaceAll = function(old, rep) {
        var rExp = new RegExp(old, "g");
        return(this.replace(rExp, rep));
    };
};

if(!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^(\s*)|(\s*)$/gm,'');
    };
};

// Array helpers

// from http://forum.de.selfhtml.org/archiv/2004/3/t76079/#m438193 (2007-02-06)
if(!Array.prototype.contains) {
    Array.prototype.contains = function (elem) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === elem) return true;
        }
        return false;
    };
};

if(!Array.prototype.indexof) {
    Array.prototype.indexOf = function (item) {
	    var ret=-1;
        for(var i = 0; i < this.length; i++) {
            if (this[i] == item) {
                ret=i;
                break;
            }
        }
	    return(ret);
    };
};

if(!Array.prototype.findByName) {
    Array.prototype.findByName = function (name) {
        for(var i = 0; i < this.length; i++) {
            var item = this[i];
            if(item.name == name) return(item);
        }
        return(null);
    };
};
