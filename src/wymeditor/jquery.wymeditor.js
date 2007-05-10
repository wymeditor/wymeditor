/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.js
 *        Main JS file with core class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 *        Volker Mische (vmx@gmx.de)
 *        Scott Lewis (scott@bright-crayon.com)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 */


/********** CONSTANTS **********/

    var $j = jQuery.noConflict();
    
    var aWYM_INSTANCES        = new Array();
    var sWYM_NAME             = "name";
    var sWYM_INDEX            = "{Wym_Index}";
    var sWYM_BASE_PATH        = "{Wym_Base_Path}";
    var sWYM_CSS_PATH         = "{Wym_Css_Path}";
    var sWYM_IFRAME_BASE_PATH = "{Wym_Iframe_Base_Path}";
    var sWYM_IFRAME_DEFAULT   = "iframe/default/";
    var sWYM_JQUERY_PATH      = "{Wym_Jquery_Path}";
    var sWYM_TOOLS            = "{Wym_Tools}";
    var sWYM_TOOLS_ITEMS      = "{Wym_Tools_Items}";
    var sWYM_TOOL_NAME        = "{Wym_Tools_Name}";
    var sWYM_TOOL_TITLE       = "{Wym_Tools_Title}";
    var sWYM_TOOL_CLASS       = "{Wym_Tools_Class}";
    var sWYM_CLASSES          = "{Wym_Classes}";
    var sWYM_CLASSES_ITEMS    = "{Wym_Classes_Items}";
    var sWYM_CLASS_NAME       = "{Wym_Class_Name}";
    var sWYM_CLASS_TITLE      = "{Wym_Class_Title}";
    var sWYM_CONTAINERS       = "{Wym_Containers}";
    var sWYM_CONTAINERS_ITEMS = "{Wym_Containers_Items}";
    var sWYM_CONTAINER_NAME   = "{Wym_Container_Name}";
    var sWYM_CONTAINER_TITLE  = "{Wym_Containers_Title}";
    var sWYM_CONTAINER_CLASS  = "{Wym_Container_Class}";
    var sWYM_HTML             = "{Wym_Html}";
    var sWYM_IFRAME           = "{Wym_Iframe}";
    var sWYM_STATUS           = "{Wym_Status}";
    var sWYM_DIALOG_TITLE     = "{Wym_Dialog_Title}";
    var sWYM_DIALOG_BODY      = "{Wym_Dialog_Body}";
    var sWYM_BODY             = "body";
    var sWYM_STRING           = "string";
    var sWYM_P                = "p";
    var sWYM_H1               = "h1";
    var sWYM_H2               = "h2";
    var sWYM_H3               = "h3";
    var sWYM_H4               = "h4";
    var sWYM_H5               = "h5";
    var sWYM_H6               = "h6";
    var sWYM_PRE              = "pre";
    var sWYM_BLOCKQUOTE       = "blockquote";
    var sWYM_TD               = "td";
    var sWYM_TH               = "th";
    var sWYM_A                = "a";
    var sWYM_BR               = "br";
    var sWYM_IMG              = "img";
    var sWYM_TABLE            = "table";
    var sWYM_CLASS            = "class";
    var sWYM_HREF             = "href";
    var sWYM_SRC              = "src";
    var sWYM_TITLE            = "title";
    var sWYM_ALT              = "alt";
    var sWYM_DIALOG_LINK      = "Link";
    var sWYM_DIALOG_IMAGE     = "Image";
    var sWYM_DIALOG_TABLE     = "Table";
    var sWYM_DIALOG_PASTE     = "Paste_From_Word";
    var sWYM_BOLD             = "Bold";
    var sWYM_ITALIC           = "Italic";
    var sWYM_CREATE_LINK      = "CreateLink";
    var sWYM_INSERT_IMAGE     = "InsertImage";
    var sWYM_INSERT_TABLE     = "InsertTable";
    var sWYM_PASTE            = "Paste";
    var sWYM_TOGGLE_HTML      = "ToggleHtml";
    var sWYM_FORMAT_BLOCK     = "FormatBlock";
    var sWYM_PREVIEW          = "Preview";
    
    var sWYM_DEFAULT_SKIN     = "default";

    var aWYM_CONTAINERS = new Array(sWYM_P,sWYM_H1,sWYM_H2,sWYM_H3,sWYM_H4,
        sWYM_H5,sWYM_H6,sWYM_PRE,sWYM_BLOCKQUOTE);

    var aWYM_KEY = {
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
    };

    var aWYM_NODE = {
      ELEMENT: 1,
      ATTRIBUTE: 2,
      TEXT: 3
    };


/********** JQUERY **********/

/**
 * Replace an HTML element by WYMeditor
 *
 * @example $j(".wymeditor").wymeditor(
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
$j.fn.wymeditor = function(options) {

  options = $j.extend({

    sHtml:       "",
    
    sBasePath:   false,
    
    sCssPath:    false,
    
    sIframeBasePath: false,
    
    sJqueryPath: false,
    
    sLang:       "en",

    sBoxHtml:   "<div class='wym_box'>"
              + "<div class='wym_area_top'>"
              + sWYM_TOOLS
              + "</div>"
              + "<div class='wym_area_left'></div>"
              + "<div class='wym_area_right'>"
              + sWYM_CONTAINERS
              + sWYM_CLASSES
              + "</div>"
              + "<div class='wym_area_main'>"
              + sWYM_HTML
              + sWYM_IFRAME
              + sWYM_STATUS
              + "</div>"
              + "<div class='wym_area_bottom'>"
              + "</div>"
              + "</div>",

    sIframeHtml:"<div class='wym_iframe wym_section'>"
              + "<iframe "
              + "src='"
              + sWYM_IFRAME_BASE_PATH
              + "wymiframe.html' "
              + "onload='window.parent.aWYM_INSTANCES["
              + sWYM_INDEX + "].initIframe(this)' "
              + "></iframe>"
              + "</div>",
              
    aEditorCss: [],

    sToolsHtml: "<div class='wym_tools wym_section'>"
              + "<h2>Tools</h2>"
              + "<ul>"
              + sWYM_TOOLS_ITEMS
              + "</ul>"
              + "</div>",
              
    sToolsItemHtml:   "<li class='"
                        + sWYM_TOOL_CLASS
                        + "'><a href='#' name='"
                        + sWYM_TOOL_NAME
                        + "'>"
                        + sWYM_TOOL_TITLE
                        + "</a></li>",

    aToolsItems: [
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

    sContainersHtml:    "<div class='wym_containers wym_section'>"
                        + "<h2>Containers</h2>"
                        + "<ul>"
                        + sWYM_CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
                        
    sContainersItemHtml:"<li class='"
                        + sWYM_CONTAINER_CLASS
                        + "'>"
                        + "<a href='#' name='"
                        + sWYM_CONTAINER_NAME
                        + "'>"
                        + sWYM_CONTAINER_TITLE
                        + "</a></li>",
                        
    aContainersItems: [
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

    sClassesHtml:       "<div class='wym_classes wym_section'>"
                        + "<h2>Classes</h2><ul>"
                        + sWYM_CLASSES_ITEMS
                        + "</ul></div>",

    sClassesItemHtml:   "<li><a href='#' name='"
                        + sWYM_CLASS_NAME
                        + "'>"
                        + sWYM_CLASS_TITLE
                        + "</a></li>",

    aClassesItems:      [],

    sStatusHtml:        "<div class='wym_status wym_section'>"
                        + "<h2>Status</h2>"
                        + "</div>",

    sHtmlHtml:          "<div class='wym_html wym_section'>"
                        + "<h2>Source code</h2>"
                        + "<textarea class='wym_html_val'></textarea>"
                        + "</div>",

    sBoxSelector:       ".wym_box",
    sToolsSelector:     ".wym_tools",
    sToolsListSelector: " ul",
    sContainersSelector:".wym_containers",
    sClassesSelector:   ".wym_classes",
    sHtmlSelector:      ".wym_html",
    sIframeSelector:    ".wym_iframe iframe",
    sStatusSelector:    ".wym_status",
    sToolSelector:      ".wym_tools a",
    sContainerSelector: ".wym_containers a",
    sClassSelector:     ".wym_classes a",
    sHtmlValSelector:   ".wym_html_val",
    
    sHrefSelector:      ".wym_href",
    sSrcSelector:       ".wym_src",
    sTitleSelector:     ".wym_title",
    sAltSelector:       ".wym_alt",
    sTextSelector:      ".wym_text",
    
    sRowsSelector:      ".wym_rows",
    sColsSelector:      ".wym_cols",
    sCaptionSelector:   ".wym_caption",
    
    sSubmitSelector:    ".wym_submit",
    sCancelSelector:    ".wym_cancel",
    sPreviewSelector:   "",
    
    sDialogLinkSelector:    ".wym_dialog_link",
    sDialogImageSelector:   ".wym_dialog_image",
    sDialogTableSelector:   ".wym_dialog_table",
    sDialogPasteSelector:   ".wym_dialog_paste",
    sDialogPreviewSelector: ".wym_dialog_preview",
    
    sUpdateSelector:    ".wymupdate",
    sUpdateEvent:       "click",
    
    sDialogFeatures:    "menubar=no,titlebar=no,toolbar=no,resizable=no"
                      + ",width=560,height=300,top=0,left=0",

    sDialogHtml:      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'"
                      + " 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
                      + "<html><head>"
                      + "<link rel='stylesheet' type='text/css' media='screen'"
                      + " href='"
                      + sWYM_CSS_PATH
                      + "' />"
                      + "<title>"
                      + sWYM_DIALOG_TITLE
                      + "</title>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + sWYM_JQUERY_PATH
                      + "'></script>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + sWYM_BASE_PATH
                      + "jquery.wymeditor.js'></script>"
                      + "</head>"
                      + sWYM_DIALOG_BODY
                      + "</html>",
                      
    sDialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
                      + " onload='fWYM_INIT_DIALOG(" + sWYM_INDEX + ")'"
                      + ">"
                      + "<p>"
                      + "<label>{URL}</label>"
                      + "<input type='text' class='wym_href' value='' />"
                      + "</p><p>"
                      + "<label>{Title}</label>"
                      + "<input type='text' class='wym_title' value='' />"
                      + "</p><p>"
                      + "<input class='wym_submit' type='button'"
                      + " value='{Submit}' />"
                      + "<input class='wym_cancel' type='button'"
                      + "value='{Cancel}' />"
                      + "</p></body>",
    
    sDialogImageHtml:  "<body class='wym_dialog wym_dialog_image'"
                      + " onload='fWYM_INIT_DIALOG(" + sWYM_INDEX + ")'"
                      + ">"
                      + "<p>"
                      + "<label>{URL}</label>"
                      + "<input type='text' class='wym_src' value='' />"
                      + "</p><p>"
                      + "<label>{Alternative_Text}</label>"
                      + "<input type='text' class='wym_alt' value='' />"
                      + "</p><p>"
                      + "<label>{Title}</label>"
                      + "<input type='text' class='wym_title' value='' />"
                      + "</p><p>"
                      + "<input class='wym_submit' type='button'"
                      + " value='{Submit}' />"
                      + "<input class='wym_cancel' type='button'"
                      + "value='{Cancel}' />"
                      + "</p></body>",
    
    sDialogTableHtml:  "<body class='wym_dialog wym_dialog_table'"
                      + " onload='fWYM_INIT_DIALOG(" + sWYM_INDEX + ")'"
                      + ">"
                      + "<p>"
                      + "<label>{Caption}</label>"
                      + "<input type='text' class='wym_caption' value='' />"
                      + "</p><p>"
                      + "<label>{Number_Of_Rows}</label>"
                      + "<input type='text' class='wym_rows' value='3' />"
                      + "</p><p>"
                      + "<label>{Number_Of_Cols}</label>"
                      + "<input type='text' class='wym_cols' value='2' />"
                      + "</p><p>"
                      + "<input class='wym_submit' type='button'"
                      + " value='{Submit}' />"
                      + "<input class='wym_cancel' type='button'"
                      + "value='{Cancel}' />"
                      + "</p></body>",

    sDialogPasteHtml:  "<body class='wym_dialog wym_dialog_paste'"
                      + " onload='fWYM_INIT_DIALOG(" + sWYM_INDEX + ")'"
                      + ">"
                      + "<p>"
                      + "<label>{Paste_From_Word}</label>"
                      + "<textarea class='wym_text'></textarea>"
                      + "</p><p>"
                      + "<input class='wym_submit' type='button'"
                      + " value='{Submit}' />"
                      + "<input class='wym_cancel' type='button'"
                      + "value='{Cancel}' />"
                      + "</p></body>",

    sDialogPreviewHtml: "<body class='wym_dialog wym_dialog_preview'"
                      + " onload='fWYM_INIT_DIALOG(" + sWYM_INDEX + ")'"
                      + "></body>",
                      
    aDialogCss: [],
                      
    sSkin:            sWYM_DEFAULT_SKIN,

    sStringDelimiterLeft: "{",
    sStringDelimiterRight:"}",
    
    fPreInit: null,
    fPreBind: null,
    fPostInit: null,
    
    fPreInitDialog: null,
    fPostInitDialog: null

  }, options);

  return this.each(function(i) {

    new Wymeditor($j(this),i,options);
  });
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
$j.extend({
  wymeditors: function(i) {
    return (aWYM_INSTANCES[i]);
  },
  wymstrings: function(sLang, sKey) {
    return (aWYM_STRINGS[sLang][sKey]);
  }
});


/********** WYMEDITOR **********/

/* @name Wymeditor
 * @description WYMeditor class
 */
function Wymeditor(elem,index,options) {

  aWYM_INSTANCES[index] = this;

  this._element = elem;
  this._index = index;
  this._options = options;
  this._html = $j(elem).val();
  
  if(this._options.sHtml) this._html = this._options.sHtml;
  this._options.sBasePath = this._options.sBasePath
    || this.computeBasePath();
  this._options.sCssPath = this._options.sCssPath
    || this.computeCssPath();
  this._options.sIframeBasePath = this._options.sIframeBasePath
    || this._options.sBasePath + sWYM_IFRAME_DEFAULT;
  this._options.sJqueryPath = this._options.sJqueryPath
    || this.computeJqueryPath();
  
  if($j.isFunction(this._options.fPreInit)) this._options.fPreInit(this);
  
  this.init();
  
};

/* @name init
 * @description Initializes a WYMeditor instance
 */
Wymeditor.prototype.init = function() {

  //load subclass - browser specific
  if ($j.browser.msie) {
    var WymClass = new WymClassExplorer(this);
  }
  else if ($j.browser.mozilla) {
    var WymClass = new WymClassMozilla(this);
  }
  else if ($j.browser.opera) {
    var WymClass = new WymClassOpera(this);
  }
  else if ($j.browser.safari) {
    var WymClass = new WymClassSafari(this);
  }
  else {
    //TODO: handle unsupported browsers
  }

  //extend the Wymeditor object
  $j.extend(this, WymClass);

  //load wymbox
  this._box = $j(this._element).hide().after(this._options.sBoxHtml).next();
  
  //construct the iframe
  var sIframeHtml = this._options.sIframeHtml;
  sIframeHtml = sIframeHtml
    .replace(sWYM_INDEX,this._index)
    .replace(sWYM_IFRAME_BASE_PATH, this._options.sIframeBasePath);
  
  //construct wymbox
  var sBoxHtml = $j(this._box).html();
  
  sBoxHtml = sBoxHtml.replace(sWYM_TOOLS, this._options.sToolsHtml);
  sBoxHtml = sBoxHtml.replace(sWYM_CONTAINERS, this._options.sContainersHtml);
  sBoxHtml = sBoxHtml.replace(sWYM_CLASSES, this._options.sClassesHtml);
  sBoxHtml = sBoxHtml.replace(sWYM_HTML, this._options.sHtmlHtml);
  sBoxHtml = sBoxHtml.replace(sWYM_IFRAME, sIframeHtml);
  sBoxHtml = sBoxHtml.replace(sWYM_STATUS, this._options.sStatusHtml);
  
  //construct tools list
  var aTools = eval(this._options.aToolsItems);
  var sTools = "";

  for(var i = 0; i < aTools.length; i++) {
    var oTool = aTools[i];
    if(oTool.name && oTool.title)
      sTools += this._options.sToolsItemHtml
      .replace(sWYM_TOOL_NAME, oTool.name)
      .replace(sWYM_TOOL_TITLE, 
          this._options.sStringDelimiterLeft
        + oTool.title
        + this._options.sStringDelimiterRight)
      .replace(sWYM_TOOL_CLASS, oTool.css);
  }

  sBoxHtml = sBoxHtml.replace(sWYM_TOOLS_ITEMS, sTools);

  //construct classes list
  var aClasses = eval(this._options.aClassesItems);
  var sClasses = "";

  for(var i = 0; i < aClasses.length; i++) {
    var oClass = aClasses[i];
    if(oClass.name && oClass.title)
      sClasses += this._options.sClassesItemHtml
      .replace(sWYM_CLASS_NAME, oClass.name)
      .replace(sWYM_CLASS_TITLE, oClass.title);
  }

  sBoxHtml = sBoxHtml.replace(sWYM_CLASSES_ITEMS, sClasses);
  
  //construct containers list
  var aContainers = eval(this._options.aContainersItems);
  var sContainers = "";

  for(var i = 0; i < aContainers.length; i++) {
    var oContainer = aContainers[i];
    if(oContainer.name && oContainer.title)
      sContainers += this._options.sContainersItemHtml
      .replace(sWYM_CONTAINER_NAME, oContainer.name)
      .replace(sWYM_CONTAINER_TITLE,
          this._options.sStringDelimiterLeft
        + oContainer.title
        + this._options.sStringDelimiterRight)
      .replace(sWYM_CONTAINER_CLASS, oContainer.css);
  }

  sBoxHtml = sBoxHtml.replace(sWYM_CONTAINERS_ITEMS, sContainers);

  //l10n
  sBoxHtml = this.replaceStrings(sBoxHtml);
  
  //load html in wymbox
  $j(this._box).html(sBoxHtml);
  
  //hide the html value
  $j(this._box).find(this._options.sHtmlSelector).hide();
  
  //enable the skin
  this.skin();

};

Wymeditor.prototype.bindEvents = function() {

  //copy the instance
  var wym = this;
  
  //handle click event on tools buttons
  $j(this._box).find(this._options.sToolSelector).click(function() {
    wym.exec($j(this).attr(sWYM_NAME));
    return(false);
  });
  
  //handle click event on containers buttons
  $j(this._box).find(this._options.sContainerSelector).click(function() {
    wym.container($j(this).attr(sWYM_NAME));
    return(false);
  });
  
  //handle keyup event on html value: set the editor value
  $j(this._box).find(this._options.sHtmlValSelector).keyup(function() {
    $j(wym._doc.body).html($j(this).val());
  });
  
  //handle click event on classes buttons
  $j(this._box).find(this._options.sClassSelector).click(function() {
  
    var aClasses = eval(wym._options.aClassesItems);
    var sName = $j(this).attr(sWYM_NAME);
    
    var oClass = aClasses.findByName(sName);
    
    if(oClass) {
      jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    return(false);
  });
  
  //handle event on update element
  $j(this._options.sUpdateSelector)
    .bind(this._options.sUpdateEvent, function() {
      wym.update();
  });
};

Wymeditor.prototype.ready = function() {
  return(this._doc != null);
};


/********** METHODS **********/

/* @name box
 * @description Get the edited document
 */
Wymeditor.prototype.box = function() {
  return(this._box);
};

/* @name html
 * @description Get/Set the html value
 */
Wymeditor.prototype.html = function(sHtml) {

  if(sHtml) $j(this._doc.body).html(sHtml);
  else return($j(this._doc.body).html());
};

/* @name exec
 * @description Executes a button command
 */
Wymeditor.prototype.exec = function(cmd) {
  
  //base function for execCommand
  //open a dialog or exec
  switch(cmd) {
    case sWYM_CREATE_LINK:
      var container = this.container();
      if(container) this.dialog(sWYM_DIALOG_LINK);
    break;
    
    case sWYM_INSERT_IMAGE:
      this.dialog(sWYM_DIALOG_IMAGE);
    break;
    
    case sWYM_INSERT_TABLE:
      this.dialog(sWYM_DIALOG_TABLE);
    break;
    
    case sWYM_PASTE:
      this.dialog(sWYM_DIALOG_PASTE);
    break;
    
    case sWYM_TOGGLE_HTML:
      this.update();
      this.toggleHtml();
    break;
    
    case sWYM_PREVIEW:
      this.dialog(sWYM_PREVIEW);
    break;
    
    default:
      this._exec(cmd);
    break;
  }
};

/* @name container
 * @description Get/Set the selected container
 */
Wymeditor.prototype.container = function(sType) {

  if(sType) {
  
    var container = null;
    
    if(sType.toLowerCase() == sWYM_TH) {
    
      container = this.container();
      
      //find the TD or TH container
      switch(container.tagName.toLowerCase()) {
      
        case sWYM_TD: case sWYM_TH:
          break;
        default:
          var aTypes = new Array(sWYM_TD,sWYM_TH);
          container = this.findUp(aTypes);
          break;
      }
      
      //if it exists, switch
      if(container!=null) {
      
        sType = (container.tagName.toLowerCase() == sWYM_TD)? sWYM_TH: sWYM_TD;
        this.switchTo(container,sType);
        this.update();
      }
    } else {
  
      //set the container type
      var aTypes=new Array(sWYM_P,sWYM_H1,sWYM_H2,sWYM_H3,sWYM_H4,sWYM_H5,
      sWYM_H6,sWYM_PRE,sWYM_BLOCKQUOTE);
      container = this.findUp(aTypes);
      
      if(container) {
  
        var newNode = null;
  
        //blockquotes must contain a block level element
        if(sType.toLowerCase() == sWYM_BLOCKQUOTE) {
        
          var blockquote = this.findUp(sWYM_BLOCKQUOTE);
          
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
Wymeditor.prototype.toggleClass = function(sClass, jqexpr) {

  var container = (this._selected_image
                    ? this._selected_image
                    : $j(this.selected()));
  container = $j(container).parentsOrSelf(jqexpr);
  $j(container).toggleClass(sClass);

  if(!$j(container).attr(sWYM_CLASS)) $j(container).removeAttr(this._class);

};

/* @name findUp
 * @description Returns the first parent or self container, based on its type
 */
Wymeditor.prototype.findUp = function(mFilter) {

  //mFilter is a string or an array of strings

  var container = this.container();
  var tagname = container.tagName.toLowerCase();
  
  if(typeof(mFilter) == sWYM_STRING) {

    while(tagname != mFilter && tagname != sWYM_BODY) {
    
      container = container.parentNode;
      tagname = container.tagName.toLowerCase();
    }
  
  } else {
  
    var bFound = false;
    
    while(!bFound && tagname != sWYM_BODY) {
      for(var i = 0; i<mFilter.length; i++) {
        if(tagname == mFilter[i]) {
          bFound = true;
          break;
        }
      }
      if(!bFound) {
        container = container.parentNode;
        tagname = container.tagName.toLowerCase();
      }
    }
  }
  
  if(tagname != sWYM_BODY) return(container);
  else return(null);
};

/* @name switchTo
 * @description Switch the node's type
 */
Wymeditor.prototype.switchTo = function(node,sType) {

  var newNode = this._doc.createElement(sType);
  var html = $j(node).html();
  node.parentNode.replaceChild(newNode,node);
  $j(newNode).html(html);
  this.setFocusToNode(newNode);
};

Wymeditor.prototype.replaceStrings = function(sVal) {

  for (var key in aWYM_STRINGS[this._options.sLang]) {
    var rExp = new RegExp(this._options.sStringDelimiterLeft + key 
    + this._options.sStringDelimiterRight, "g");
    sVal = sVal.replace(rExp, aWYM_STRINGS[this._options.sLang][key]);
  }
  return(sVal);
};

Wymeditor.prototype.encloseString = function(sVal) {

  return(this._options.sStringDelimiterLeft
    + sVal
    + this._options.sStringDelimiterRight);
};

/* @name status
 * @description Prints a status message
 */
Wymeditor.prototype.status = function(sMessage) {

  //print status message
  $j(this._box).find(this._options.sStatusSelector).html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
Wymeditor.prototype.update = function() {

  var html = this.xhtml();
  $j(this._element).val(html);
  $j(this._box).find(this._options.sHtmlValSelector).val(html);
};

/* @name dialog
 * @description Opens a dialog box
 */
Wymeditor.prototype.dialog = function(sType) {
  
  var wDialog = window.open(
    '',
    'dialog',
    this._wym._options.sDialogFeatures);

  if(wDialog) {

    var sBodyHtml = "";
    
    switch(sType) {

      case(sWYM_DIALOG_LINK):
        sBodyHtml = this._options.sDialogLinkHtml;
      break;
      case(sWYM_DIALOG_IMAGE):
        sBodyHtml = this._options.sDialogImageHtml;
      break;
      case(sWYM_DIALOG_TABLE):
        sBodyHtml = this._options.sDialogTableHtml;
      break;
      case(sWYM_DIALOG_PASTE):
        sBodyHtml = this._options.sDialogPasteHtml;
      break;
      case(sWYM_PREVIEW):
        sBodyHtml = this._options.sDialogPreviewHtml;
      break;
    }
    
    //construct the dialog
    var sDialogHtml = this._options.sDialogHtml;
    sDialogHtml = sDialogHtml
      .replace(sWYM_BASE_PATH, this._options.sBasePath)
      .replace(sWYM_CSS_PATH, this._options.sCssPath)
      .replace(sWYM_JQUERY_PATH, this._options.sJqueryPath)
      .replace(sWYM_DIALOG_TITLE, this.encloseString(sType))
      .replace(sWYM_DIALOG_BODY, sBodyHtml)
      .replace(sWYM_INDEX, this._index);
      
    sDialogHtml = this.replaceStrings(sDialogHtml);
    
    var doc = wDialog.document;
    doc.write(sDialogHtml);
    doc.close();
  }
};

/* @name toggleHtml
 * @description Shows/Hides the HTML
 */
Wymeditor.prototype.toggleHtml = function() {

  $j(this._box).find(this._options.sHtmlSelector).toggle();
};

Wymeditor.prototype.uniqueStamp = function() {
	var now=new Date();
	return("wym-" + now.getTime());
};

Wymeditor.prototype.paste = function(sData) {

  var sTmp;
  var container = this.selected();
	
  //split the data, using double newlines as the separator
  var aP = sData.split(this._newLine + this._newLine);
  var rExp = new RegExp(this._newLine, "g");

  //add a P for each item
  for(x = aP.length - 1; x >= 0; x--) {
    sTmp = aP[x];
    //simple newlines are replaced by a break
    sTmp = sTmp.replace(rExp, "<br />");
    $j(container).after("<p>" + sTmp + "</p>");
  }
};

Wymeditor.prototype.addCssRules = function(doc, aCss) {
  var styles = doc.styleSheets[0];
  if(styles) {
    for(var i = 0; i < aCss.length; i++) {
      var oCss = aCss[i];
      if(oCss.name && oCss.css) this.addCssRule(styles, oCss);
    }
  }
};

/********** CONFIGURATION **********/

Wymeditor.prototype.computeBasePath = function() {
  return $j($j.grep($j('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor\.js(\?.*)?$/ ))
  })).attr('src').replace(/jquery\.wymeditor\.js(\?.*)?$/, '');
};

Wymeditor.prototype.computeJqueryPath = function() {
  return $j($j.grep($j('script'), function(s){
    return (s.src && s.src.match(/jquery\.js(\?.*)?$/ ))
  })).attr('src');
};

Wymeditor.prototype.computeCssPath = function() {
  return $j($j.grep($j('link'), function(s){
   return (s.href && s.href.match(/wymeditor\/skins\/(.*)screen\.css(\?.*)?$/ ))
  })).attr('href');
};

/********** EVENTS **********/

Wymeditor.prototype.listen = function() {

  $j(this._doc.body).find("*").bind("mouseup", this.mouseup);
};

//mouseup handler
Wymeditor.prototype.mouseup = function(evt) {
  
  var wym = aWYM_INSTANCES[this.ownerDocument.title];
  if(this.tagName.toLowerCase() == sWYM_IMG) wym._selected_image = this;
  else wym._selected_image = null;
  evt.stopPropagation();
};

/********** SKINS **********/

Wymeditor.prototype.skin = function() {

  switch(this._options.sSkin) {
  
    case sWYM_DEFAULT_SKIN:
    
      $j(this._box).addClass("wym_skin_default");
      
      //render following sections as panels
      $j(this._box).find(this._options.sClassesSelector)
        .addClass("wym_panel");

      //render following sections as buttons
      $j(this._box).find(this._options.sToolsSelector)
        .addClass("wym_buttons");

      //render following sections as dropdown menus
      $j(this._box).find(this._options.sContainersSelector)
        .addClass("wym_dropdown")
        .find(sWYM_H2)
        .append("<span>&nbsp;&gt;</span>");

      // auto add some margin to the main area sides if left area
      // or right area are not empty (if they contain sections)
      $j(this._box).find("div.wym_area_right ul")
        .parents("div.wym_area_right").show()
        .parents(this._options.sBoxSelector)
        .find("div.wym_area_main")
        .css({"margin-right": "155px"});

      $j(this._box).find("div.wym_area_left ul")
        .parents("div.wym_area_left").show()
        .parents(this._options.sBoxSelector)
        .find("div.wym_area_main")
        .css({"margin-left": "155px"});

      //make hover work under IE < 7
      $j(this._box).find(".wym_section").hover(function(){ 
        $j(this).addClass("hover"); 
      },function(){ 
        $j(this).removeClass("hover"); 
      });
    
    break;
  
  }

};

/********** DIALOGS **********/

function fWYM_INIT_DIALOG(index) {

    var wym = window.opener.aWYM_INSTANCES[index];
    var doc = window.document;
    var oSel = wym.selected();
    var sStamp = wym.uniqueStamp();
    
    //pre-init functions
    if($j.isFunction(wym._options.fPreInitDialog))
      wym._options.fPreInitDialog(wym,window);
    
    //add css rules from options
    var styles = doc.styleSheets[0];
    var aCss = eval(wym._options.aDialogCss);

    wym.addCssRules(doc, aCss);
    
    if(oSel) {
            $j(wym._options.sHrefSelector).val($j(oSel).attr(sWYM_HREF));
            $j(wym._options.sSrcSelector).val($j(oSel).attr(sWYM_SRC));
            $j(wym._options.sTitleSelector).val($j(oSel).attr(sWYM_TITLE));
            $j(wym._options.sAltSelector).val($j(oSel).attr(sWYM_ALT));
    }

    $j(wym._options.sDialogLinkSelector + " "
        + wym._options.sSubmitSelector).click(function() {
        
        var sUrl = $j(wym._options.sHrefSelector).val();
        if(sUrl.length > 0) {
            wym._exec(sWYM_CREATE_LINK, sStamp);
            var link = $j(wym._doc.body).find("a[@href=" + sStamp + "]");
            link.attr(sWYM_HREF, sUrl);
            link.attr(sWYM_TITLE, $j(wym._options.sTitleSelector).val());
        }
        window.close();
    });
    
    $j(wym._options.sDialogImageSelector + " "
        + wym._options.sSubmitSelector).click(function() {
        
        var sUrl = $j(wym._options.sSrcSelector).val();
        if(sUrl.length > 0) {
            wym._exec(sWYM_INSERT_IMAGE, sStamp);
            var image = $j(wym._doc.body).find("img[@src=" + sStamp + "]");
            image.attr(sWYM_SRC, sUrl);
            image.attr(sWYM_TITLE, $j(wym._options.sTitleSelector).val());
            image.attr(sWYM_ALT, $j(wym._options.sAltSelector).val());
        }
        window.close();
    });
    
    $j(wym._options.sDialogTableSelector + " "
        + wym._options.sSubmitSelector).click(function() {
        
        var iRows = $j(wym._options.sRowsSelector).val();
        var iCols = $j(wym._options.sColsSelector).val();
        
        if(iRows > 0 && iCols > 0) {
        
            var table = wym._doc.createElement(sWYM_TABLE);
            var newRow = null;
        		var newCol = null;
        		
        		var sCaption = $j(wym._options.sCaptionSelector).val();
        		
        		//we create the caption
        		var newCaption = table.createCaption();
        		newCaption.innerHTML = sCaption;
        		
        		//we create the rows and cells
        		for(x=0; x<iRows; x++) {
        			newRow = table.insertRow(x);
        			for(y=0; y<iCols; y++) {newRow.insertCell(y);}
        		}
            
            if(oSel) $j(oSel).after(table);
        }
        window.close();
    });
    
    $j(wym._options.sDialogPasteSelector + " "
        + wym._options.sSubmitSelector).click(function() {
        
        var sText = $j(wym._options.sTextSelector).val();
        wym.paste(sText);
        window.close();
    });
    
    $j(wym._options.sDialogPreviewSelector + " "
        + wym._options.sPreviewSelector)
        .html(wym.xhtml());
    
    //cancel button
    $j(wym._options.sCancelSelector).mousedown(function() {
        window.close();
    });
    
    //pre-init functions
    if($j.isFunction(wym._options.fPostInitDialog))
      wym._options.fPostInitDialog(wym,window);
};


/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
$j.fn.isPhantomNode = function() {
  if (this[0].nodeType == 3)
    return !(/[^\t\n\r ]/.test(this[0].data));

  return false;
};

function isPhantomNode(n) {
  if (n.nodeType == 3)
    return !(/[^\t\n\r ]/.test(n.data));

  return false;
};

// Returns the Parents or the node itself
// jqexpr = a jQuery expression
$j.fn.parentsOrSelf = function(jqexpr) {
  var n = this;

  if (n[0].nodeType == 3)
    n = n.parents().lt(1);

//  if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
  if (n.filter(jqexpr).size() == 1)
    return n;
  else
    return n.parents(jqexpr).lt(1);
};

String.prototype.insertAt = function(sInserted, iPos) {
  return(this.substr(0,iPos) + sInserted + this.substring(iPos));
};

// from http://forum.de.selfhtml.org/archiv/2004/3/t76079/#m438193 (2007-02-06)
Array.prototype.contains = function (elem) {
//  var i;
  for (var i = 0; i < this.length; i++) {
  if (this[i] === elem) {
    return true;
  }
  }
  return false;
};

Array.prototype.indexOf = function (item) {
	var ret=-1;
	for(var i = 0; i < this.length; i++) {
    if (this[i] == item) {
      ret=i; break;
    }
  }
	return(ret);
};

Array.prototype.findByName = function (name) {
  for(var i = 0; i < this.length; i++) {
    var oItem = this[i];
    if(oItem.name == name) {
      return(oItem);
    }
  }
  return(null);
};

