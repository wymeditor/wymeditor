﻿/*
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
 *        Daniel Reszka (d.reszka@wymeditor.org)
 */


/********** CONSTANTS **********/

    var $j = jQuery.noConflict();
    
    var WYM_INSTANCES        = new Array();
    var WYM_NAME             = "name";
    var WYM_INDEX            = "{Wym_Index}";
    var WYM_BASE_PATH        = "{Wym_Base_Path}";
    var WYM_CSS_PATH         = "{Wym_Css_Path}";
    var WYM_IFRAME_BASE_PATH = "{Wym_Iframe_Base_Path}";
    var WYM_IFRAME_DEFAULT   = "iframe/default/";
    var WYM_JQUERY_PATH      = "{Wym_Jquery_Path}";
    var WYM_TOOLS            = "{Wym_Tools}";
    var WYM_TOOLS_ITEMS      = "{Wym_Tools_Items}";
    var WYM_TOOL_NAME        = "{Wym_Tool_Name}";
    var WYM_TOOL_TITLE       = "{Wym_Tool_Title}";
    var WYM_TOOL_CLASS       = "{Wym_Tool_Class}";
    var WYM_CLASSES          = "{Wym_Classes}";
    var WYM_CLASSES_ITEMS    = "{Wym_Classes_Items}";
    var WYM_CLASS_NAME       = "{Wym_Class_Name}";
    var WYM_CLASS_TITLE      = "{Wym_Class_Title}";
    var WYM_CONTAINERS       = "{Wym_Containers}";
    var WYM_CONTAINERS_ITEMS = "{Wym_Containers_Items}";
    var WYM_CONTAINER_NAME   = "{Wym_Container_Name}";
    var WYM_CONTAINER_TITLE  = "{Wym_Containers_Title}";
    var WYM_CONTAINER_CLASS  = "{Wym_Container_Class}";
    var WYM_HTML             = "{Wym_Html}";
    var WYM_IFRAME           = "{Wym_Iframe}";
    var WYM_STATUS           = "{Wym_Status}";
    var WYM_DIALOG_TITLE     = "{Wym_Dialog_Title}";
    var WYM_DIALOG_BODY      = "{Wym_Dialog_Body}";
    var WYM_BODY             = "body";
    var WYM_STRING           = "string";
    var WYM_P                = "p";
    var WYM_H1               = "h1";
    var WYM_H2               = "h2";
    var WYM_H3               = "h3";
    var WYM_H4               = "h4";
    var WYM_H5               = "h5";
    var WYM_H6               = "h6";
    var WYM_PRE              = "pre";
    var WYM_BLOCKQUOTE       = "blockquote";
    var WYM_TD               = "td";
    var WYM_TH               = "th";
    var WYM_A                = "a";
    var WYM_BR               = "br";
    var WYM_IMG              = "img";
    var WYM_TABLE            = "table";
    var WYM_UL               = "ul";
    var WYM_OL               = "ol";
    var WYM_LI               = "li";
    var WYM_CLASS            = "class";
    var WYM_HREF             = "href";
    var WYM_SRC              = "src";
    var WYM_TITLE            = "title";
    var WYM_ALT              = "alt";
    var WYM_DIALOG_LINK      = "Link";
    var WYM_DIALOG_IMAGE     = "Image";
    var WYM_DIALOG_TABLE     = "Table";
    var WYM_DIALOG_PASTE     = "Paste_From_Word";
    var WYM_BOLD             = "Bold";
    var WYM_ITALIC           = "Italic";
    var WYM_CREATE_LINK      = "CreateLink";
    var WYM_INSERT_IMAGE     = "InsertImage";
    var WYM_INSERT_TABLE     = "InsertTable";
    var WYM_PASTE            = "Paste";
    var WYM_INDENT           = "Indent";
    var WYM_OUTDENT          = "Outdent";
    var WYM_TOGGLE_HTML      = "ToggleHtml";
    var WYM_FORMAT_BLOCK     = "FormatBlock";
    var WYM_PREVIEW          = "Preview";
    
    var WYM_DEFAULT_SKIN     = "default";

    var WYM_MAIN_CONTAINERS = new Array(WYM_P,WYM_H1,WYM_H2,WYM_H3,WYM_H4,
        WYM_H5,WYM_H6,WYM_PRE,WYM_BLOCKQUOTE);

    var WYM_BLOCKS = new Array("address", "blockquote", "div", "dl",
	   "fieldset", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
	   "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
	   "li", "tbody", "td", "tfoot", "th", "thead", "tr");

    var WYM_KEY = {
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

    var WYM_NODE = {
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

    html:       "",
    
    basePath:   false,
    
    cssPath:    false,
    
    iframeBasePath: false,
    
    jQueryPath: false,
    
    lang:       "en",

    boxHtml:   "<div class='wym_box'>"
              + "<div class='wym_area_top'>"
              + WYM_TOOLS
              + "</div>"
              + "<div class='wym_area_left'></div>"
              + "<div class='wym_area_right'>"
              + WYM_CONTAINERS
              + WYM_CLASSES
              + "</div>"
              + "<div class='wym_area_main'>"
              + WYM_HTML
              + WYM_IFRAME
              + WYM_STATUS
              + "</div>"
              + "<div class='wym_area_bottom'>"
              + "</div>"
              + "</div>",

    iframeHtml:"<div class='wym_iframe wym_section'>"
              + "<iframe "
              + "src='"
              + WYM_IFRAME_BASE_PATH
              + "wymiframe.html' "
              + "onload='window.parent.WYM_INSTANCES["
              + WYM_INDEX + "].initIframe(this)' "
              + "></iframe>"
              + "</div>",
              
    editorStyles: [],

    toolsHtml: "<div class='wym_tools wym_section'>"
              + "<h2>{Tools}</h2>"
              + "<ul>"
              + WYM_TOOLS_ITEMS
              + "</ul>"
              + "</div>",
              
    toolsItemHtml:   "<li class='"
                        + WYM_TOOL_CLASS
                        + "'><a href='#' name='"
                        + WYM_TOOL_NAME
                        + "' title='"
                        + WYM_TOOL_TITLE
                        + "'>"
                        + WYM_TOOL_TITLE
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
                        + WYM_CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
                        
    containersItemHtml:"<li class='"
                        + WYM_CONTAINER_CLASS
                        + "'>"
                        + "<a href='#' name='"
                        + WYM_CONTAINER_NAME
                        + "'>"
                        + WYM_CONTAINER_TITLE
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
                        + WYM_CLASSES_ITEMS
                        + "</ul></div>",

    classesItemHtml:   "<li><a href='#' name='"
                        + WYM_CLASS_NAME
                        + "'>"
                        + WYM_CLASS_TITLE
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
                      + WYM_CSS_PATH
                      + "' />"
                      + "<title>"
                      + WYM_DIALOG_TITLE
                      + "</title>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYM_JQUERY_PATH
                      + "'></script>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYM_BASE_PATH
                      + "jquery.wymeditor.js'></script>"
                      + "</head>"
                      + WYM_DIALOG_BODY
                      + "</html>",
                      
    dialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
               + " onload='WYM_INIT_DIALOG(" + WYM_INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
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
               + " onload='WYM_INIT_DIALOG(" + WYM_INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
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
               + " onload='WYM_INIT_DIALOG(" + WYM_INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
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
               + " onload='WYM_INIT_DIALOG(" + WYM_INDEX + ")'"
               + ">"
               + "<form>"
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
                      + " onload='WYM_INIT_DIALOG(" + WYM_INDEX + ")'"
                      + "></body>",
                      
    dialogStyles: [],
                      
    skin:            WYM_DEFAULT_SKIN,

    stringDelimiterLeft: "{",
    stringDelimiterRight:"}",
    
    preInit: null,
    preBind: null,
    postInit: null,
    
    preInitDialog: null,
    postInitDialog: null

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
    return (WYM_INSTANCES[i]);
  },
  wymstrings: function(lang, sKey) {
    return (WYM_STRINGS[lang][sKey]);
  }
});


/********** WYMEDITOR **********/

/* @name Wymeditor
 * @description WYMeditor class
 */
function Wymeditor(elem,index,options) {

  WYM_INSTANCES[index] = this;

  this._element = elem;
  this._index = index;
  this._options = options;
  this._html = $j(elem).val();
  
  if(this._options.html) this._html = this._options.html;
  this._options.basePath = this._options.basePath
    || this.computeBasePath();
  this._options.cssPath = this._options.cssPath
    || this.computeCssPath();
  this._options.iframeBasePath = this._options.iframeBasePath
    || this._options.basePath + WYM_IFRAME_DEFAULT;
  this._options.jQueryPath = this._options.jQueryPath
    || this.computeJqueryPath();
  
  if($j.isFunction(this._options.preInit)) this._options.preInit(this);
  
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
  this._box = $j(this._element).hide().after(this._options.boxHtml).next();
  
  //construct the iframe
  var iframeHtml = this._options.iframeHtml;
  iframeHtml = iframeHtml
    .replaceAll(WYM_INDEX,this._index)
    .replaceAll(WYM_IFRAME_BASE_PATH, this._options.iframeBasePath);
  
  //construct wymbox
  var boxHtml = $j(this._box).html();
  
  boxHtml = boxHtml.replaceAll(WYM_TOOLS, this._options.toolsHtml);
  boxHtml = boxHtml.replaceAll(WYM_CONTAINERS, this._options.containersHtml);
  boxHtml = boxHtml.replaceAll(WYM_CLASSES, this._options.classesHtml);
  boxHtml = boxHtml.replaceAll(WYM_HTML, this._options.htmlHtml);
  boxHtml = boxHtml.replaceAll(WYM_IFRAME, iframeHtml);
  boxHtml = boxHtml.replaceAll(WYM_STATUS, this._options.statusHtml);
  
  //construct tools list
  var aTools = eval(this._options.toolsItems);
  var sTools = "";

  for(var i = 0; i < aTools.length; i++) {
    var oTool = aTools[i];
    if(oTool.name && oTool.title)
      sTools += this._options.toolsItemHtml
      .replaceAll(WYM_TOOL_NAME, oTool.name)
      .replaceAll(WYM_TOOL_TITLE,
          this._options.stringDelimiterLeft
        + oTool.title
        + this._options.stringDelimiterRight)
      .replaceAll(WYM_TOOL_CLASS, oTool.css);
  }

  boxHtml = boxHtml.replaceAll(WYM_TOOLS_ITEMS, sTools);

  //construct classes list
  var aClasses = eval(this._options.classesItems);
  var sClasses = "";

  for(var i = 0; i < aClasses.length; i++) {
    var oClass = aClasses[i];
    if(oClass.name && oClass.title)
      sClasses += this._options.classesItemHtml
      .replaceAll(WYM_CLASS_NAME, oClass.name)
      .replaceAll(WYM_CLASS_TITLE, oClass.title);
  }

  boxHtml = boxHtml.replaceAll(WYM_CLASSES_ITEMS, sClasses);
  
  //construct containers list
  var aContainers = eval(this._options.containersItems);
  var sContainers = "";

  for(var i = 0; i < aContainers.length; i++) {
    var oContainer = aContainers[i];
    if(oContainer.name && oContainer.title)
      sContainers += this._options.containersItemHtml
      .replaceAll(WYM_CONTAINER_NAME, oContainer.name)
      .replaceAll(WYM_CONTAINER_TITLE,
          this._options.stringDelimiterLeft
        + oContainer.title
        + this._options.stringDelimiterRight)
      .replaceAll(WYM_CONTAINER_CLASS, oContainer.css);
  }

  boxHtml = boxHtml.replaceAll(WYM_CONTAINERS_ITEMS, sContainers);

  //l10n
  boxHtml = this.replaceStrings(boxHtml);
  
  //load html in wymbox
  $j(this._box).html(boxHtml);
  
  //hide the html value
  $j(this._box).find(this._options.htmlSelector).hide();
  
  //enable the skin
  this.skin();

};

Wymeditor.prototype.bindEvents = function() {

  //copy the instance
  var wym = this;
  
  //handle click event on tools buttons
  $j(this._box).find(this._options.toolSelector).click(function() {
    wym.exec($j(this).attr(WYM_NAME));
    return(false);
  });
  
  //handle click event on containers buttons
  $j(this._box).find(this._options.containerSelector).click(function() {
    wym.container($j(this).attr(WYM_NAME));
    return(false);
  });
  
  //handle keyup event on html value: set the editor value
  $j(this._box).find(this._options.htmlValSelector).keyup(function() {
    $j(wym._doc.body).html($j(this).val());
  });
  
  //handle click event on classes buttons
  $j(this._box).find(this._options.classSelector).click(function() {
  
    var aClasses = eval(wym._options.classesItems);
    var sName = $j(this).attr(WYM_NAME);
    
    var oClass = aClasses.findByName(sName);
    
    if(oClass) {
      jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    return(false);
  });
  
  //handle event on update element
  $j(this._options.updateSelector)
    .bind(this._options.updateEvent, function() {
      wym.update();
  });
};

Wymeditor.prototype.ready = function() {
  return(this._doc != null);
};


/********** METHODS **********/

/* @name box
 * @description Returns the WYMeditor container
 */
Wymeditor.prototype.box = function() {
  return(this._box);
};

/* @name html
 * @description Get/Set the html value
 */
Wymeditor.prototype.html = function(html) {

  if(html) $j(this._doc.body).html(html);
  else return($j(this._doc.body).html());
};

/* @name exec
 * @description Executes a button command
 */
Wymeditor.prototype.exec = function(cmd) {
  
  //base function for execCommand
  //open a dialog or exec
  switch(cmd) {
    case WYM_CREATE_LINK:
      var container = this.container();
      if(container || this._selected_image) this.dialog(WYM_DIALOG_LINK);
    break;
    
    case WYM_INSERT_IMAGE:
      this.dialog(WYM_DIALOG_IMAGE);
    break;
    
    case WYM_INSERT_TABLE:
      this.dialog(WYM_DIALOG_TABLE);
    break;
    
    case WYM_PASTE:
      this.dialog(WYM_DIALOG_PASTE);
    break;
    
    case WYM_TOGGLE_HTML:
      this.update();
      this.toggleHtml();
    break;
    
    case WYM_PREVIEW:
      this.dialog(WYM_PREVIEW);
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
    
    if(sType.toLowerCase() == WYM_TH) {
    
      container = this.container();
      
      //find the TD or TH container
      switch(container.tagName.toLowerCase()) {
      
        case WYM_TD: case WYM_TH:
          break;
        default:
          var aTypes = new Array(WYM_TD,WYM_TH);
          container = this.findUp(this.container(), aTypes);
          break;
      }
      
      //if it exists, switch
      if(container!=null) {
      
        sType = (container.tagName.toLowerCase() == WYM_TD)? WYM_TH: WYM_TD;
        this.switchTo(container,sType);
        this.update();
      }
    } else {
  
      //set the container type
      var aTypes=new Array(WYM_P,WYM_H1,WYM_H2,WYM_H3,WYM_H4,WYM_H5,
      WYM_H6,WYM_PRE,WYM_BLOCKQUOTE);
      container = this.findUp(this.container(), aTypes);
      
      if(container) {
  
        var newNode = null;
  
        //blockquotes must contain a block level element
        if(sType.toLowerCase() == WYM_BLOCKQUOTE) {
        
          var blockquote = this.findUp(this.container(), WYM_BLOCKQUOTE);
          
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

  if(!$j(container).attr(WYM_CLASS)) $j(container).removeAttr(this._class);

};

/* @name findUp
 * @description Returns the first parent or self container, based on its type
 */
Wymeditor.prototype.findUp = function(node, filter) {

  //filter is a string or an array of strings

  if(node) {

      var tagname = node.tagName.toLowerCase();
      
      if(typeof(filter) == WYM_STRING) {
    
        while(tagname != filter && tagname != WYM_BODY) {
        
          node = node.parentNode;
          tagname = node.tagName.toLowerCase();
        }
      
      } else {
      
        var bFound = false;
        
        while(!bFound && tagname != WYM_BODY) {
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
      
      if(tagname != WYM_BODY) return(node);
      else return(null);
      
  } else return(null);
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

  for (var key in WYM_STRINGS[this._options.lang]) {
    sVal = sVal.replaceAll(this._options.stringDelimiterLeft + key 
    + this._options.stringDelimiterRight, WYM_STRINGS[this._options.lang][key]);
  }
  return(sVal);
};

Wymeditor.prototype.encloseString = function(sVal) {

  return(this._options.stringDelimiterLeft
    + sVal
    + this._options.stringDelimiterRight);
};

/* @name status
 * @description Prints a status message
 */
Wymeditor.prototype.status = function(sMessage) {

  //print status message
  $j(this._box).find(this._options.statusSelector).html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
Wymeditor.prototype.update = function() {

  var html = this.xhtml();
  $j(this._element).val(html);
  $j(this._box).find(this._options.htmlValSelector).val(html);
};

/* @name dialog
 * @description Opens a dialog box
 */
Wymeditor.prototype.dialog = function(sType) {
  
  var wDialog = window.open(
    '',
    'dialog',
    this._wym._options.dialogFeatures);

  if(wDialog) {

    var sBodyHtml = "";
    
    switch(sType) {

      case(WYM_DIALOG_LINK):
        sBodyHtml = this._options.dialogLinkHtml;
      break;
      case(WYM_DIALOG_IMAGE):
        sBodyHtml = this._options.dialogImageHtml;
      break;
      case(WYM_DIALOG_TABLE):
        sBodyHtml = this._options.dialogTableHtml;
      break;
      case(WYM_DIALOG_PASTE):
        sBodyHtml = this._options.dialogPasteHtml;
      break;
      case(WYM_PREVIEW):
        sBodyHtml = this._options.dialogPreviewHtml;
      break;
    }
    
    //construct the dialog
    var dialogHtml = this._options.dialogHtml;
    dialogHtml = dialogHtml
      .replaceAll(WYM_BASE_PATH, this._options.basePath)
      .replaceAll(WYM_CSS_PATH, this._options.cssPath)
      .replaceAll(WYM_JQUERY_PATH, this._options.jQueryPath)
      .replaceAll(WYM_DIALOG_TITLE, this.encloseString(sType))
      .replaceAll(WYM_DIALOG_BODY, sBodyHtml)
      .replaceAll(WYM_INDEX, this._index);
      
    dialogHtml = this.replaceStrings(dialogHtml);
    
    var doc = wDialog.document;
    doc.write(dialogHtml);
    doc.close();
  }
};

/* @name toggleHtml
 * @description Shows/Hides the HTML
 */
Wymeditor.prototype.toggleHtml = function() {

  $j(this._box).find(this._options.htmlSelector).toggle();
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
  if(container && container.tagName.toLowerCase() != WYM_BODY) {
    for(x = aP.length - 1; x >= 0; x--) {
        sTmp = aP[x];
        //simple newlines are replaced by a break
        sTmp = sTmp.replace(rExp, "<br />");
        $j(container).after("<p>" + sTmp + "</p>");
    }
  } else {
    for(x = 0; x < aP.length; x++) {
        sTmp = aP[x];
        //simple newlines are replaced by a break
        sTmp = sTmp.replace(rExp, "<br />");
        $j(this._doc.body).append("<p>" + sTmp + "</p>");
    }
  
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

  //don't use jQuery.find() on the iframe body
  //because of MSIE + jQuery + expando issue (#JQ1143)
  //$j(this._doc.body).find("*").bind("mouseup", this.mouseup);
  
  $j(this._doc.body).bind("mouseup", this.mouseup);
  var images = this._doc.body.getElementsByTagName("img");
  for(var i=0; i < images.length; i++) {
    $j(images[i]).bind("mouseup", this.mouseup);
  }
};

//mouseup handler
Wymeditor.prototype.mouseup = function(evt) {
  
  var wym = WYM_INSTANCES[this.ownerDocument.title];
  if(this.tagName.toLowerCase() == WYM_IMG) wym._selected_image = this;
  else wym._selected_image = null;
  evt.stopPropagation();
};

/********** SKINS **********/

Wymeditor.prototype.skin = function() {

  switch(this._options.skin) {
  
    case WYM_DEFAULT_SKIN:
    
      $j(this._box).addClass("wym_skin_default");
      
      //render following sections as panels
      $j(this._box).find(this._options.classesSelector)
        .addClass("wym_panel");

      //render following sections as buttons
      $j(this._box).find(this._options.toolsSelector)
        .addClass("wym_buttons");

      //render following sections as dropdown menus
      $j(this._box).find(this._options.containersSelector)
        .addClass("wym_dropdown")
        .find(WYM_H2)
        .append("<span>&nbsp;&gt;</span>");

      // auto add some margin to the main area sides if left area
      // or right area are not empty (if they contain sections)
      $j(this._box).find("div.wym_area_right ul")
        .parents("div.wym_area_right").show()
        .parents(this._options.boxSelector)
        .find("div.wym_area_main")
        .css({"margin-right": "155px"});

      $j(this._box).find("div.wym_area_left ul")
        .parents("div.wym_area_left").show()
        .parents(this._options.boxSelector)
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

function WYM_INIT_DIALOG(index) {

    var wym = window.opener.WYM_INSTANCES[index];
    var doc = window.document;
    var selected = wym.selected();
    var sStamp = wym.uniqueStamp();
    
    //fix MSIE selection if link image has been clicked
    if(!selected && wym._selected_image) {
      selected = $j(wym._selected_image).parentsOrSelf(WYM_A);
    }
    
    //pre-init functions
    if($j.isFunction(wym._options.preInitDialog))
      wym._options.preInitDialog(wym,window);
    
    //add css rules from options
    var styles = doc.styleSheets[0];
    var aCss = eval(wym._options.dialogStyles);

    wym.addCssRules(doc, aCss);
    
    //auto populate fields if selected container (e.g. A)
    if(selected) {
      $j(wym._options.hrefSelector).val($j(selected).attr(WYM_HREF));
      $j(wym._options.srcSelector).val($j(selected).attr(WYM_SRC));
      $j(wym._options.titleSelector).val($j(selected).attr(WYM_TITLE));
      $j(wym._options.altSelector).val($j(selected).attr(WYM_ALT));
    }
    
    //auto populate image fields if selected image
    if(wym._selected_image) {
      $j(wym._options.dialogImageSelector + " " + wym._options.srcSelector)
        .val($j(wym._selected_image).attr(WYM_SRC));
      $j(wym._options.dialogImageSelector + " " + wym._options.titleSelector)
        .val($j(wym._selected_image).attr(WYM_TITLE));
      $j(wym._options.dialogImageSelector + " " + wym._options.altSelector)
        .val($j(wym._selected_image).attr(WYM_ALT));
    }

    $j(wym._options.dialogLinkSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var sUrl = $j(wym._options.hrefSelector).val();
        if(sUrl.length > 0) {
            wym._exec(WYM_CREATE_LINK, sStamp);
            //don't use jQuery.find() see #JQ1143
            //var link = $j(wym._doc.body).find("a[@href=" + sStamp + "]");
            var link = null;
            var nodes = wym._doc.body.getElementsByTagName(WYM_A);
            for(var i=0; i < nodes.length; i++) {
                if($j(nodes[i]).attr(WYM_HREF) == sStamp) {
                    link = $j(nodes[i]);
                    break;
                }
            }
            if(link) {
                link.attr(WYM_HREF, sUrl);
                link.attr(WYM_TITLE, $j(wym._options.titleSelector).val());
            }
        }
        window.close();
    });
    
    $j(wym._options.dialogImageSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var sUrl = $j(wym._options.srcSelector).val();
        if(sUrl.length > 0) {
            wym._exec(WYM_INSERT_IMAGE, sStamp);
            //don't use jQuery.find() see #JQ1143
            //var image = $j(wym._doc.body).find("img[@src=" + sStamp + "]");
            var image = null;
            var nodes = wym._doc.body.getElementsByTagName(WYM_IMG);
            for(var i=0; i < nodes.length; i++) {
                if($j(nodes[i]).attr(WYM_SRC) == sStamp) {
                    image = $j(nodes[i]);
                    break;
                }
            }
            if(image) {
                image.attr(WYM_SRC, sUrl);
                image.attr(WYM_TITLE, $j(wym._options.titleSelector).val());
                image.attr(WYM_ALT, $j(wym._options.altSelector).val());
            }
        }
        window.close();
    });
    
    $j(wym._options.dialogTableSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var iRows = $j(wym._options.rowsSelector).val();
        var iCols = $j(wym._options.colsSelector).val();
        
        if(iRows > 0 && iCols > 0) {
        
            var table = wym._doc.createElement(WYM_TABLE);
            var newRow = null;
        		var newCol = null;
        		
        		var sCaption = $j(wym._options.captionSelector).val();
        		
        		//we create the caption
        		var newCaption = table.createCaption();
        		newCaption.innerHTML = sCaption;
        		
        		//we create the rows and cells
        		for(x=0; x<iRows; x++) {
        			newRow = table.insertRow(x);
        			for(y=0; y<iCols; y++) {newRow.insertCell(y);}
        		}
        		
          //append the table after the selected container
          $j(wym.findUp(wym.container(), WYM_MAIN_CONTAINERS)).after(table);
        }
        window.close();
    });
    
    $j(wym._options.dialogPasteSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var sText = $j(wym._options.textSelector).val();
        wym.paste(sText);
        window.close();
    });
    
    $j(wym._options.dialogPreviewSelector + " "
        + wym._options.previewSelector)
        .html(wym.xhtml());
    
    //cancel button
    $j(wym._options.cancelSelector).mousedown(function() {
        window.close();
    });
    
    //pre-init functions
    if($j.isFunction(wym._options.postInitDialog))
      wym._options.postInitDialog(wym,window);
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

String.prototype.replaceAll = function(old, rep) {
  var rExp = new RegExp(old, "g");
  return(this.replace(rExp, rep));
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
