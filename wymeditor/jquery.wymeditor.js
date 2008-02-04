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
 *        Daniel Reszka (d.reszka@wymeditor.org)
 */


/********** CONSTANTS **********/

var WYMEDITOR = {
    
    VERSION          : "0.4.1.",
    INSTANCES        : new Array(),
	STRINGS			 : new Array(),
    NAME             : "name",
    INDEX            : "{Wym_Index}",
    BASE_PATH        : "{Wym_Base_Path}",
    CSS_PATH         : "{Wym_Css_Path}",
    WYM_PATH         : "{Wym_Wym_Path}",
	LANG_DEFAULT_PATH: "lang/",
    IFRAME_BASE_PATH : "{Wym_Iframe_Base_Path}",
    IFRAME_DEFAULT   : "iframe/default/",
    JQUERY_PATH      : "{Wym_Jquery_Path}",
    TOOLS            : "{Wym_Tools}",
    TOOLS_ITEMS      : "{Wym_Tools_Items}",
    TOOL_NAME        : "{Wym_Tool_Name}",
    TOOL_TITLE       : "{Wym_Tool_Title}",
    TOOL_CLASS       : "{Wym_Tool_Class}",
    CLASSES          : "{Wym_Classes}",
    CLASSES_ITEMS    : "{Wym_Classes_Items}",
    CLASS_NAME       : "{Wym_Class_Name}",
    CLASS_TITLE      : "{Wym_Class_Title}",
    CONTAINERS       : "{Wym_Containers}",
    CONTAINERS_ITEMS : "{Wym_Containers_Items}",
    CONTAINER_NAME   : "{Wym_Container_Name}",
    CONTAINER_TITLE  : "{Wym_Containers_Title}",
    CONTAINER_CLASS  : "{Wym_Container_Class}",
    HTML             : "{Wym_Html}",
    IFRAME           : "{Wym_Iframe}",
    STATUS           : "{Wym_Status}",
    DIALOG_TITLE     : "{Wym_Dialog_Title}",
    DIALOG_BODY      : "{Wym_Dialog_Body}",
    BODY             : "body",
    STRING           : "string",
    P                : "p",
    H1               : "h1",
    H2               : "h2",
    H3               : "h3",
    H4               : "h4",
    H5               : "h5",
    H6               : "h6",
    PRE              : "pre",
    BLOCKQUOTE       : "blockquote",
    TD               : "td",
    TH               : "th",
    A                : "a",
    BR               : "br",
    IMG              : "img",
    TABLE            : "table",
    UL               : "ul",
    OL               : "ol",
    LI               : "li",
    CLASS            : "class",
    HREF             : "href",
    SRC              : "src",
    TITLE            : "title",
    ALT              : "alt",
    DIALOG_LINK      : "Link",
    DIALOG_IMAGE     : "Image",
    DIALOG_TABLE     : "Table",
    DIALOG_PASTE     : "Paste_From_Word",
    BOLD             : "Bold",
    ITALIC           : "Italic",
    CREATE_LINK      : "CreateLink",
    INSERT_IMAGE     : "InsertImage",
    INSERT_TABLE     : "InsertTable",
    PASTE            : "Paste",
    INDENT           : "Indent",
    OUTDENT          : "Outdent",
    TOGGLE_HTML      : "ToggleHtml",
    FORMAT_BLOCK     : "FormatBlock",
    PREVIEW          : "Preview",
    
    DEFAULT_SKIN     : "default",
	
	UNLINK			     : "Unlink",
	INSERT_UNORDEREDLIST : "InsertUnorderedList",
	INSERT_ORDEREDLIST	 : "InsertOrderedList",

    MAIN_CONTAINERS : new Array(this.P,this.H1,this.H2,this.H3,this.H4,
        this.H5,this.H6,this.PRE,this.BLOCKQUOTE),

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
	
	/********** DIALOGS **********/

	INIT_DIALOG : function(index) {

    var wym = window.opener.WYMEDITOR.INSTANCES[index];
    var doc = window.document;
    var selected = wym.selected();
    var dialogType = jQuery(wym._options.dialogTypeSelector).val();
    var sStamp = wym.uniqueStamp();
    
    switch(dialogType) {
    
    case WYMEDITOR.DIALOG_LINK:
      //ensure that we select the link to populate the fields
      if(selected && selected.tagName && selected.tagName.toLowerCase != WYMEDITOR.A)
        selected = jQuery(selected).parentsOrSelf(WYMEDITOR.A);
    
      //fix MSIE selection if link image has been clicked
      if(!selected && wym._selected_image)
        selected = jQuery(wym._selected_image).parentsOrSelf(WYMEDITOR.A);
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
      jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMEDITOR.HREF));
      jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMEDITOR.SRC));
      jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMEDITOR.TITLE));
      jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMEDITOR.ALT));
    }
    
    //auto populate image fields if selected image
    if(wym._selected_image) {
      jQuery(wym._options.dialogImageSelector + " " + wym._options.srcSelector)
        .val(jQuery(wym._selected_image).attr(WYMEDITOR.SRC));
      jQuery(wym._options.dialogImageSelector + " " + wym._options.titleSelector)
        .val(jQuery(wym._selected_image).attr(WYMEDITOR.TITLE));
      jQuery(wym._options.dialogImageSelector + " " + wym._options.altSelector)
        .val(jQuery(wym._selected_image).attr(WYMEDITOR.ALT));
    }

    jQuery(wym._options.dialogLinkSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var sUrl = jQuery(wym._options.hrefSelector).val();
        if(sUrl.length > 0) {
            wym._exec(WYMEDITOR.CREATE_LINK, sStamp);
            //don't use jQuery.find() see #JQ1143
            //var link = jQuery(wym._doc.body).find("a[@href=" + sStamp + "]");
            var link = null;
            var nodes = wym._doc.body.getElementsByTagName(WYMEDITOR.A);
            for(var i=0; i < nodes.length; i++) {
                if(jQuery(nodes[i]).attr(WYMEDITOR.HREF) == sStamp) {
                    link = jQuery(nodes[i]);
                    break;
                }
            }
            if(link) {
                link.attr(WYMEDITOR.HREF, sUrl);
                link.attr(WYMEDITOR.TITLE, jQuery(wym._options.titleSelector).val());
            }
        }
        window.close();
    });
    
    jQuery(wym._options.dialogImageSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var sUrl = jQuery(wym._options.srcSelector).val();
        if(sUrl.length > 0) {
            wym._exec(WYMEDITOR.INSERT_IMAGE, sStamp);
            //don't use jQuery.find() see #JQ1143
            //var image = jQuery(wym._doc.body).find("img[@src=" + sStamp + "]");
            var image = null;
            var nodes = wym._doc.body.getElementsByTagName(WYMEDITOR.IMG);
            for(var i=0; i < nodes.length; i++) {
                if(jQuery(nodes[i]).attr(WYMEDITOR.SRC) == sStamp) {
                    image = jQuery(nodes[i]);
                    break;
                }
            }
            if(image) {
                image.attr(WYMEDITOR.SRC, sUrl);
                image.attr(WYMEDITOR.TITLE, jQuery(wym._options.titleSelector).val());
                image.attr(WYMEDITOR.ALT, jQuery(wym._options.altSelector).val());
            }
        }
        window.close();
    });
    
    jQuery(wym._options.dialogTableSelector + " "
        + wym._options.submitSelector).click(function() {
        
        var iRows = jQuery(wym._options.rowsSelector).val();
        var iCols = jQuery(wym._options.colsSelector).val();
        
        if(iRows > 0 && iCols > 0) {
        
            var table = wym._doc.createElement(WYMEDITOR.TABLE);
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
          var node = jQuery(wym.findUp(wym.container(),WYMEDITOR.MAIN_CONTAINERS)).get(0);
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
	
	}

}


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
    
    cssPath:    false,
    
    wymPath:    false,
    
    iframeBasePath: false,
    
    jQueryPath: false,
    
    xhtmlParser: 'xhtml_parser.pack.js',
    
    cssParser: 'wym_css_parser.pack.js',
    
    styles: false,
    
    stylesheet: false,
    
    lang:       "en",

    boxHtml:   "<div class='wym_box'>"
              + "<div class='wym_area_top'>" 
              + WYMEDITOR.TOOLS
              + "</div>"
              + "<div class='wym_area_left'></div>"
              + "<div class='wym_area_right'>"
              + WYMEDITOR.CONTAINERS
              + WYMEDITOR.CLASSES
              + "</div>"
              + "<div class='wym_area_main'>"
              + WYMEDITOR.HTML
              + WYMEDITOR.IFRAME
              + WYMEDITOR.STATUS
              + "</div>"
              + "<div class='wym_area_bottom'>"
              + "<a class='wym_wymeditor_link' "
              + "href='http://www.wymeditor.org/'>WYMeditor</a>"
              + "</div>"
              + "</div>",

    iframeHtml:"<div class='wym_iframe wym_section'>"
              + "<iframe "
              + "src='"
              + WYMEDITOR.IFRAME_BASE_PATH
              + "wymiframe.html' "
              + "onload='this.contentWindow.parent.WYMEDITOR.INSTANCES["
              + WYMEDITOR.INDEX + "].initIframe(this)' "
              + "></iframe>"
              + "</div>",
              
    editorStyles: [],

    toolsHtml: "<div class='wym_tools wym_section'>"
              + "<h2>{Tools}</h2>"
              + "<ul>"
              + WYMEDITOR.TOOLS_ITEMS
              + "</ul>"
              + "</div>",
              
    toolsItemHtml:   "<li class='"
                        + WYMEDITOR.TOOL_CLASS
                        + "'><a href='#' name='"
                        + WYMEDITOR.TOOL_NAME
                        + "' title='"
                        + WYMEDITOR.TOOL_TITLE
                        + "'>"
                        + WYMEDITOR.TOOL_TITLE
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
                        + WYMEDITOR.CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
                        
    containersItemHtml:"<li class='"
                        + WYMEDITOR.CONTAINER_CLASS
                        + "'>"
                        + "<a href='#' name='"
                        + WYMEDITOR.CONTAINER_NAME
                        + "'>"
                        + WYMEDITOR.CONTAINER_TITLE
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
                        + WYMEDITOR.CLASSES_ITEMS
                        + "</ul></div>",

    classesItemHtml:   "<li><a href='#' name='"
                        + WYMEDITOR.CLASS_NAME
                        + "'>"
                        + WYMEDITOR.CLASS_TITLE
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
                      + WYMEDITOR.CSS_PATH
                      + "' />"
                      + "<title>"
                      + WYMEDITOR.DIALOG_TITLE
                      + "</title>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYMEDITOR.JQUERY_PATH
                      + "'></script>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYMEDITOR.WYM_PATH
                      + "'></script>"
                      + "</head>"
                      + WYMEDITOR.DIALOG_BODY
                      + "</html>",
                      
    dialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
               + " onload='WYMEDITOR.INIT_DIALOG(" + WYMEDITOR.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMEDITOR.DIALOG_LINK
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
               + " onload='WYMEDITOR.INIT_DIALOG(" + WYMEDITOR.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMEDITOR.DIALOG_IMAGE
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
               + " onload='WYMEDITOR.INIT_DIALOG(" + WYMEDITOR.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMEDITOR.DIALOG_TABLE
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
               + " onload='WYMEDITOR.INIT_DIALOG(" + WYMEDITOR.INDEX + ")'"
               + ">"
               + "<form>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMEDITOR.DIALOG_PASTE
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
                      + " onload='WYMEDITOR.INIT_DIALOG(" + WYMEDITOR.INDEX + ")'"
                      + "></body>",
                      
    dialogStyles: [],
                      
    skin:            WYMEDITOR.DEFAULT_SKIN,

    stringDelimiterLeft: "{",
    stringDelimiterRight:"}",
    
    preInit: null,
    preBind: null,
    postInit: null,
    
    preInitDialog: null,
    postInitDialog: null

  }, options);

  return this.each(function() {

    new Wymeditor(jQuery(this),options);
  });
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
jQuery.extend({
  wymeditors: function(i) {
    return (WYMEDITOR.INSTANCES[i]);
  },
  wymstrings: function(lang, sKey) {
    return (WYMEDITOR.STRINGS[lang][sKey]);
  }
});


/********** WYMEDITOR **********/

/* @name Wymeditor
 * @description WYMeditor class
 */
function Wymeditor(elem,options) {

  this._index = WYMEDITOR.INSTANCES.push(this) - 1;
  this._element = elem;
  this._options = options;
  this._html = jQuery(elem).val();
  
  if(this._options.html) this._html = this._options.html;
  this._options.basePath = this._options.basePath
    || this.computeBasePath();
  this._options.cssPath = this._options.cssPath
    || this.computeCssPath();
  this._options.wymPath = this._options.wymPath
    || this.computeWymPath();
  this._options.langPath = this._options.langPath
    || this._options.basePath + WYMEDITOR.LANG_DEFAULT_PATH;
  this._options.iframeBasePath = this._options.iframeBasePath
    || this._options.basePath + WYMEDITOR.IFRAME_DEFAULT;
  this._options.jQueryPath = this._options.jQueryPath
    || this.computeJqueryPath();
    
  this.selection = new WymSelection();
  
  this.init();
  
};

/* @name init
 * @description Initializes a WYMeditor instance
 */
Wymeditor.prototype.init = function() {

  //load subclass - browser specific
  //unsupported browsers: do nothing
  if (jQuery.browser.msie) {
    var WymClass = new WymClassExplorer(this);
    var WymSel = new WymSelExplorer(this);
  }
  else if (jQuery.browser.mozilla) {
    var WymClass = new WymClassMozilla(this);
    var WymSel = new WymSelMozilla(this);
  }
  else if (jQuery.browser.opera) {
    var WymClass = new WymClassOpera(this);
    var WymSel = new WymSelOpera(this);
  }
  else if (jQuery.browser.safari) {
    //commented until supported
    var WymClass = new WymClassSafari(this);
    var WymSel = new WymSelSafari(this);
  }
  
  if(WymClass) {
  
      if(jQuery.isFunction(this._options.preInit)) this._options.preInit(this);
  
      this.loadXhtmlParser(WymClass);
      
      if(this._options.styles || this._options.stylesheet){
        this.configureEditorUsingRawCss();
      }
      
      this.helper = new XmlHelper();
      
      //extend the Wymeditor object
      //don't use jQuery.extend since 1.1.4
      //jQuery.extend(this, WymClass);
      for (prop in WymClass) { this[prop] = WymClass[prop]; }

      //load wymbox
      this._box = jQuery(this._element).hide().after(this._options.boxHtml).next();
      
      //construct the iframe
      var iframeHtml = this._options.iframeHtml;
      iframeHtml = iframeHtml
        .replaceAll(WYMEDITOR.INDEX,this._index)
        .replaceAll(WYMEDITOR.IFRAME_BASE_PATH, this._options.iframeBasePath);
      
      //construct wymbox
      var boxHtml = jQuery(this._box).html();
      
      boxHtml = boxHtml.replaceAll(WYMEDITOR.TOOLS, this._options.toolsHtml);
      boxHtml = boxHtml.replaceAll(WYMEDITOR.CONTAINERS,this._options.containersHtml);
      boxHtml = boxHtml.replaceAll(WYMEDITOR.CLASSES, this._options.classesHtml);
      boxHtml = boxHtml.replaceAll(WYMEDITOR.HTML, this._options.htmlHtml);
      boxHtml = boxHtml.replaceAll(WYMEDITOR.IFRAME, iframeHtml);
      boxHtml = boxHtml.replaceAll(WYMEDITOR.STATUS, this._options.statusHtml);
      
      //construct tools list
      var aTools = eval(this._options.toolsItems);
      var sTools = "";

      for(var i = 0; i < aTools.length; i++) {
        var oTool = aTools[i];
        if(oTool.name && oTool.title)
          sTools += this._options.toolsItemHtml
          .replaceAll(WYMEDITOR.TOOL_NAME, oTool.name)
          .replaceAll(WYMEDITOR.TOOL_TITLE,
              this._options.stringDelimiterLeft
            + oTool.title
            + this._options.stringDelimiterRight)
          .replaceAll(WYMEDITOR.TOOL_CLASS, oTool.css);
      }

      boxHtml = boxHtml.replaceAll(WYMEDITOR.TOOLS_ITEMS, sTools);

      //construct classes list
      var aClasses = eval(this._options.classesItems);
      var sClasses = "";

      for(var i = 0; i < aClasses.length; i++) {
        var oClass = aClasses[i];
        if(oClass.name && oClass.title)
          sClasses += this._options.classesItemHtml
          .replaceAll(WYMEDITOR.CLASS_NAME, oClass.name)
          .replaceAll(WYMEDITOR.CLASS_TITLE, oClass.title);
      }

      boxHtml = boxHtml.replaceAll(WYMEDITOR.CLASSES_ITEMS, sClasses);
      
      //construct containers list
      var aContainers = eval(this._options.containersItems);
      var sContainers = "";

      for(var i = 0; i < aContainers.length; i++) {
        var oContainer = aContainers[i];
        if(oContainer.name && oContainer.title)
          sContainers += this._options.containersItemHtml
          .replaceAll(WYMEDITOR.CONTAINER_NAME, oContainer.name)
          .replaceAll(WYMEDITOR.CONTAINER_TITLE,
              this._options.stringDelimiterLeft
            + oContainer.title
            + this._options.stringDelimiterRight)
          .replaceAll(WYMEDITOR.CONTAINER_CLASS, oContainer.css);
      }

      boxHtml = boxHtml.replaceAll(WYMEDITOR.CONTAINERS_ITEMS, sContainers);

      //l10n
      boxHtml = this.replaceStrings(boxHtml);
      
      //load html in wymbox
      jQuery(this._box).html(boxHtml);
      
      //hide the html value
      jQuery(this._box).find(this._options.htmlSelector).hide();
      
      //enable the skin
      this.skin();
      
    }
    
    if(WymSel) {
    
      //extend the selection object
      //don't use jQuery.extend since 1.1.4
      //jQuery.extend(this.selection, WymSel);
      for (prop in WymSel) { this.selection[prop] = WymSel[prop]; }
    }
};

Wymeditor.prototype.bindEvents = function() {

  //copy the instance
  var wym = this;
  
  //handle click event on tools buttons
  jQuery(this._box).find(this._options.toolSelector).click(function() {
    wym.exec(jQuery(this).attr(WYMEDITOR.NAME));
    return(false);
  });
  
  //handle click event on containers buttons
  jQuery(this._box).find(this._options.containerSelector).click(function() {
    wym.container(jQuery(this).attr(WYMEDITOR.NAME));
    return(false);
  });
  
  //handle keyup event on html value: set the editor value
  jQuery(this._box).find(this._options.htmlValSelector).keyup(function() {
    jQuery(wym._doc.body).html(jQuery(this).val());
  });
  
  //handle click event on classes buttons
  jQuery(this._box).find(this._options.classSelector).click(function() {
  
    var aClasses = eval(wym._options.classesItems);
    var sName = jQuery(this).attr(WYMEDITOR.NAME);
    
    var oClass = aClasses.findByName(sName);
    
    if(oClass) {
      jqexpr = oClass.expr;
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

  if(html) jQuery(this._doc.body).html(html);
  else return(jQuery(this._doc.body).html());
};

/* @name xhtml
 * @description Cleans up the HTML
 */
Wymeditor.prototype.xhtml = function() {
    return this.parser.parse(this.html());
};

/* @name exec
 * @description Executes a button command
 */
Wymeditor.prototype.exec = function(cmd) {
  
  //base function for execCommand
  //open a dialog or exec
  switch(cmd) {
    case WYMEDITOR.CREATE_LINK:
      var container = this.container();
      if(container || this._selected_image) this.dialog(WYMEDITOR.DIALOG_LINK);
    break;
    
    case WYMEDITOR.INSERT_IMAGE:
      this.dialog(WYMEDITOR.DIALOG_IMAGE);
    break;
    
    case WYMEDITOR.INSERT_TABLE:
      this.dialog(WYMEDITOR.DIALOG_TABLE);
    break;
    
    case WYMEDITOR.PASTE:
      this.dialog(WYMEDITOR.DIALOG_PASTE);
    break;
    
    case WYMEDITOR.TOGGLE_HTML:
      this.update();
      this.toggleHtml();
    break;
    
    case WYMEDITOR.PREVIEW:
      this.dialog(WYMEDITOR.PREVIEW);
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
    
    if(sType.toLowerCase() == WYMEDITOR.TH) {
    
      container = this.container();
      
      //find the TD or TH container
      switch(container.tagName.toLowerCase()) {
      
        case WYMEDITOR.TD: case WYMEDITOR.TH:
          break;
        default:
          var aTypes = new Array(WYMEDITOR.TD,WYMEDITOR.TH);
          container = this.findUp(this.container(), aTypes);
          break;
      }
      
      //if it exists, switch
      if(container!=null) {
      
        sType = (container.tagName.toLowerCase() == WYMEDITOR.TD)? WYMEDITOR.TH: WYMEDITOR.TD;
        this.switchTo(container,sType);
        this.update();
      }
    } else {
  
      //set the container type
      var aTypes=new Array(WYMEDITOR.P,WYMEDITOR.H1,WYMEDITOR.H2,WYMEDITOR.H3,WYMEDITOR.H4,WYMEDITOR.H5,
      WYMEDITOR.H6,WYMEDITOR.PRE,WYMEDITOR.BLOCKQUOTE);
      container = this.findUp(this.container(), aTypes);
      
      if(container) {
  
        var newNode = null;
  
        //blockquotes must contain a block level element
        if(sType.toLowerCase() == WYMEDITOR.BLOCKQUOTE) {
        
          var blockquote = this.findUp(this.container(), WYMEDITOR.BLOCKQUOTE);
          
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
                    : jQuery(this.selected()));
  container = jQuery(container).parentsOrSelf(jqexpr);
  jQuery(container).toggleClass(sClass);

  if(!jQuery(container).attr(WYMEDITOR.CLASS)) jQuery(container).removeAttr(this._class);

};

/* @name findUp
 * @description Returns the first parent or self container, based on its type
 */
Wymeditor.prototype.findUp = function(node, filter) {

  //filter is a string or an array of strings

  if(node) {

      var tagname = node.tagName.toLowerCase();
      
      if(typeof(filter) == WYMEDITOR.STRING) {
    
        while(tagname != filter && tagname != WYMEDITOR.BODY) {
        
          node = node.parentNode;
          tagname = node.tagName.toLowerCase();
        }
      
      } else {
      
        var bFound = false;
        
        while(!bFound && tagname != WYMEDITOR.BODY) {
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
      
      if(tagname != WYMEDITOR.BODY) return(node);
      else return(null);
      
  } else return(null);
};

/* @name switchTo
 * @description Switch the node's type
 */
Wymeditor.prototype.switchTo = function(node,sType) {

  var newNode = this._doc.createElement(sType);
  var html = jQuery(node).html();
  node.parentNode.replaceChild(newNode,node);
  jQuery(newNode).html(html);
  this.setFocusToNode(newNode);
};

Wymeditor.prototype.replaceStrings = function(sVal) {
  if(WYMEDITOR.STRINGS.length==0)
    eval(jQuery.ajax({url:this._options.langPath
      + this._options.lang + '.js', async:false}).responseText);

  for (var key in WYMEDITOR.STRINGS) {
    sVal = sVal.replaceAll(this._options.stringDelimiterLeft + key 
    + this._options.stringDelimiterRight, WYMEDITOR.STRINGS[key]);
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
  jQuery(this._box).find(this._options.statusSelector).html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
Wymeditor.prototype.update = function() {

  var html = this.xhtml();
  jQuery(this._element).val(html);
  jQuery(this._box).find(this._options.htmlValSelector).val(html);
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

      case(WYMEDITOR.DIALOG_LINK):
        sBodyHtml = this._options.dialogLinkHtml;
      break;
      case(WYMEDITOR.DIALOG_IMAGE):
        sBodyHtml = this._options.dialogImageHtml;
      break;
      case(WYMEDITOR.DIALOG_TABLE):
        sBodyHtml = this._options.dialogTableHtml;
      break;
      case(WYMEDITOR.DIALOG_PASTE):
        sBodyHtml = this._options.dialogPasteHtml;
      break;
      case(WYMEDITOR.PREVIEW):
        sBodyHtml = this._options.dialogPreviewHtml;
      break;
    }
    
    //construct the dialog
    var dialogHtml = this._options.dialogHtml;
    dialogHtml = dialogHtml
      .replaceAll(WYMEDITOR.BASE_PATH, this._options.basePath)
      .replaceAll(WYMEDITOR.CSS_PATH, this._options.cssPath)
      .replaceAll(WYMEDITOR.WYM_PATH, this._options.wymPath)
      .replaceAll(WYMEDITOR.JQUERY_PATH, this._options.jQueryPath)
      .replaceAll(WYMEDITOR.DIALOG_TITLE, this.encloseString(sType))
      .replaceAll(WYMEDITOR.DIALOG_BODY, sBodyHtml)
      .replaceAll(WYMEDITOR.INDEX, this._index);
      
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
  jQuery(this._box).find(this._options.htmlSelector).toggle();
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
  if(container && container.tagName.toLowerCase() != WYMEDITOR.BODY) {
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
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor(\.pack){0,1}\.js(\?.*)?$/ ))
  })).attr('src').replace(/jquery\.wymeditor(\.pack){0,1}\.js(\?.*)?$/, '');
};

Wymeditor.prototype.computeWymPath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor(\.pack){0,1}\.js(\?.*)?$/ ))
  })).attr('src');
};

Wymeditor.prototype.computeJqueryPath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery(-(.*)){0,1}(\.pack){0,1}\.js(\?.*)?$/ ))
  })).attr('src');
};

Wymeditor.prototype.computeCssPath = function() {
  return jQuery(jQuery.grep(jQuery('link'), function(s){
   return (s.href && s.href.match(/wymeditor\/skins\/(.*)screen\.css(\?.*)?$/ ))
  })).attr('href');
};

Wymeditor.prototype.loadXhtmlParser = function(WymClass) {
  if(typeof XhtmlSaxListener != 'function'){
    // This is the only way to get loaded functions in the global scope until jQuery.globalEval works in safari
   eval(jQuery.ajax({url:this._options.basePath
    + this._options.xhtmlParser, async:false}).responseText);
    window.XmlHelper = XmlHelper;
    window.XhtmlValidator = XhtmlValidator;
    window.ParallelRegex = ParallelRegex;
    window.StateStack = StateStack;
    window.Lexer = Lexer;
    window.XhtmlLexer = XhtmlLexer;
    window.XhtmlParser = XhtmlParser;
    window.XhtmlSaxListener = XhtmlSaxListener;
   
  }
  var SaxListener = new XhtmlSaxListener();
  jQuery.extend(SaxListener, WymClass);
  this.parser = new XhtmlParser(SaxListener);
};

Wymeditor.prototype.configureEditorUsingRawCss = function() {
  if(typeof WymCssParser != 'function'){
    eval(jQuery.ajax({url:this._options.basePath
     + this._options.cssParser, async:false}).responseText);
    window.WymCssLexer = WymCssLexer;
    window.WymCssParser = WymCssParser;
  }
  var CssParser = new WymCssParser();
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

Wymeditor.prototype.listen = function() {

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
Wymeditor.prototype.mouseup = function(evt) {
  
  var wym = WYMEDITOR.INSTANCES[this.ownerDocument.title];
  if(this.tagName.toLowerCase() == WYMEDITOR.IMG) wym._selected_image = this;
  else wym._selected_image = null;
  evt.stopPropagation();
};

/********** SKINS **********/

Wymeditor.prototype.skin = function() {

  switch(this._options.skin) {
  
    case WYMEDITOR.DEFAULT_SKIN:
    
      jQuery(this._box).addClass("wym_skin_default");
      
      //render following sections as panels
      jQuery(this._box).find(this._options.classesSelector)
        .addClass("wym_panel");

      //render following sections as buttons
      jQuery(this._box).find(this._options.toolsSelector)
        .addClass("wym_buttons");

      //render following sections as dropdown menus
      jQuery(this._box).find(this._options.containersSelector)
        .addClass("wym_dropdown")
        .find(WYMEDITOR.H2)
        .append("<span>&nbsp;&gt;</span>");

      // auto add some margin to the main area sides if left area
      // or right area are not empty (if they contain sections)
      jQuery(this._box).find("div.wym_area_right ul")
        .parents("div.wym_area_right").show()
        .parents(this._options.boxSelector)
        .find("div.wym_area_main")
        .css({"margin-right": "155px"});

      jQuery(this._box).find("div.wym_area_left ul")
        .parents("div.wym_area_left").show()
        .parents(this._options.boxSelector)
        .find("div.wym_area_main")
        .css({"margin-left": "155px"});

      //make hover work under IE < 7
      jQuery(this._box).find(".wym_section").hover(function(){ 
        jQuery(this).addClass("hover"); 
      },function(){ 
        jQuery(this).removeClass("hover");
      });
    
    break;
  
  }

};

/********** SELECTION API **********/

function WymSelection() {
    this.test = "test from WymSelection";
};


WymSelection.prototype = {
    /* The following properties where set in the browser specific file (in
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
        if (startNode.nodeType == WYMEDITOR.NODE.TEXT) {
            // 1. startNode ist first child
            // 2. offset needs to be 0 to be at the start (or the previous
            //    characters are whitespaces)
            if ((startNode.previousSibling
                    && !isPhantomNode(startNode.previousSibling))
                        || (this.startOffset != 0 && !isPhantomString(
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
                        && !isPhantomNode(firstChild[0].previousSibling)))
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
            if (endNode.nodeType == WYMEDITOR.NODE.TEXT) {
                if ((endNode.nextSibling
                        && !isPhantomNode(endNode.nextSibling))
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
                        (isPhantomNode(lastChild)
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

/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
jQuery.fn.isPhantomNode = function() {
  if (this[0].nodeType == 3)
    return !(/[^\t\n\r ]/.test(this[0].data));

  return false;
};

function isPhantomNode(n) {
  if (n.nodeType == 3)
    return !(/[^\t\n\r ]/.test(n.data));

  return false;
};

function isPhantomString(str) {
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

String.prototype.insertAt = function(inserted, pos) {
  return(this.substr(0,pos) + inserted + this.substring(pos));
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

String.prototype.trim = function() {
  return this.replace(/^(\s*)|(\s*)$/gm,'');
};

Array.prototype.findByName = function (name) {
  for(var i = 0; i < this.length; i++) {
    var Item = this[i];
    if(Item.name == name) {
      return(Item);
    }
  }
  return(null);
};
