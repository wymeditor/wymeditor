/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http:// www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http:// www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.safari.js
 *        Safari specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 *        Volker Mische (vmx@gmx.de)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel@gmail.com)
 *        Scott Lewis (lewiscot@gmail.com)
 */

var WYM_UNLINK               = "Unlink";
var WYM_INSERT_UNORDEREDLIST = "InsertUnorderedList";
var WYM_INSERT_ORDEREDLIST   = "InsertOrderedList";

function WymClassSafari(wym) {
    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
    wym._options.updateEvent = "mousedown";
};

/* @name initIframe
 * @description Initializes the iframe document for editing.
 * @param document iframe An iframe document to initialize.
 * @return void
 */
WymClassSafari.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    // this._doc.execCommand('useCSS', false);
    
    // add css rules from options
    
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);
    
    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;
    
    // init html value
    this.html(this._wym._html);
    
    // init designMode
    this.enableDesignMode();

    // detect when text is selected via double-click
    jQuery(this._doc).bind("dblclick", this.dblclick);
    
    // pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
    
    // bind external events
    this._wym.bindEvents();
    
    // bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    // bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    // bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", this.enableDesignMode);
    
    // post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    // add event listeners to doc elements, e.g. images
    this.listen();
    
    _test(function() {alert(1);});
};

WymClassSafari.prototype.dblclick = function(evt) {
   window.isDblClick = true;
};

/* @name html
 * @description Get/Set the html value
 * @param string html The string representation of the html being edited.
 * @return string The html being edited
 */
WymClassSafari.prototype.html = function(html) {

  if(html) {
  
    // disable designMode
    this._doc.designMode = "off";
    
    // replace em by i and strong by bold
    // (designMode issue)
    html = html.replace(/<em([^>]*)>/gi, "<i$1>")
      .replace(/<\/em>/gi, "</i>")
      .replace(/<strong([^>]*)>/gi, "<b$1>")
      .replace(/<\/strong>/gi, "</b>");
    
    // update the html body
    jQuery(this._doc.body).html(html);
    
    // re-init designMode
    this.enableDesignMode();
  }
  else return(jQuery(this._doc.body).html());
};

/* @name _exec
 * @description Wymeditor's custom execCommand interface. Since certain commands 
 * are either un-supported or incorrectly implemented, we can re-route the command 
 * through our own custom handlers.
 *
 * @param string cmd The command to be executed
 * @param string param The parameter needed for the command. What the param is depends 
 * on the command being executed. (We need a list of commands and parameters).
 */
WymClassSafari.prototype._exec = function(cmd, param) {

    var focusNode = this.selected();    
    var sel = this.selection.getSelection();

    if (sel.anchorNode)
    {
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
    }
    
    if (focusNode && focusNode.nodeName.toLowerCase() == WYM_BR)
    {
       var _newFocusNode = focusNode.parentNode;
       jQuery(focusNode).remove();
       focusNode = _newFocusNode;
    }

    switch(cmd) {
    
        case WYM_INDENT:
            this.Outdent(focusNode, param);
            break;
            
        case WYM_OUTDENT:
            this.Indent(focusNode, param);
        break;
        
        case WYM_OUTDENT:
            this.Indent(focusNode, param);
            break;
        
        case WYM_INDENT:
            this.Indent(focusNode, param);
            break;
        
        case WYM_CREATE_LINK:
            this.CreateLink(focusNode, param);
            break;
        
        case WYM_UNLINK:
            this.Unlink(focusNode, param);
            break;
        
        case WYM_INSERT_IMAGE:
            this.InsertImage(focusNode, param);
            break;

        case WYM_INSERT_UNORDEREDLIST:
            this.InsertUnorderedList(focusNode, param);
            break;
    
        default:
    
            if(param) this._doc.execCommand(cmd,'',param);
            else this._doc.execCommand(cmd,'',null);
    }
    
    // set to P if parent = BODY
    var container = this.selected();
    if(container && container.tagName.toLowerCase() == WYM_BODY)
        this._exec(WYM_FORMAT_BLOCK, WYM_P);
    
    // Update the textarea
    this.update();

    // add event handlers on doc elements
    this.listen();
};

/* @name selected
 * @description Returns the selected container
 * @return object The currently selected container
 */
WymClassSafari.prototype.selected = function() {
    
    var sel = this._iframe.contentWindow.getSelection();
    
    var node = false;
    if (sel.focusNode)
    {
        node = sel.focusNode;
    }
    if(node) {
        if(node.nodeName == "#text") return(node.parentNode);
        else return(node);
    } else return(null); // this._iframe.contentDocument.body);
};

WymClassSafari.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};

/* @name keydown
 * @description keydown handler, mainly used for keyboard shortcuts
 * @return bool Whether or not the calling event should be continued
 */
WymClassSafari.prototype.keydown = function(evt) {
  
  // 'this' is the doc
  var wym = WYM_INSTANCES[this.title];
  
  //  "start" Selection API
  var sel = wym.selection.getSelection();

/*
    //  some small tests for the Selection API
    var containers = WYM_MAIN_CONTAINERS.join(",");
    if (sel.isAtStart(containers))
        alert("isAtStart: "+sel.startNode.parentNode.nodeName);
    if (sel.isAtEnd(containers))
        alert("isAtEnd: "+sel.endNode.parentNode.nodeName);
    if (evt.keyCode==WYM_KEY.DELETE) {
        //  if deleteIfExpanded wouldn't work, no selected text would be
        //  deleted if you press del-key
        if (sel.deleteIfExpanded())
            return false;
    }
    if (evt.keyCode==WYM_KEY.HOME) {
        //  if cursorToStart won't work, the cursor won't be set to start
        //  if you press home-key
        sel.cursorToStart(sel.container);
        return false;
    }
    if (evt.keyCode==WYM_KEY.END)
    {
        //  if cursorToEnd won't work, the cursor won't be set to the end
        //  if you press end-key
        sel.cursorToEnd(sel.container);
        return false;
    }
*/

  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      // CTRL+b => STRONG
      wym._exec(WYM_BOLD);
      return false;
    }
    if(evt.keyCode == 73){
      // CTRL+i => EMPHASIS
      wym._exec(WYM_ITALIC);
      return false;
    }
  }
};

/* @name keyup
 * @description keyup handler, mainly used for cleanups
 */
WymClassSafari.prototype.keyup = function(evt) {

  // 'this' is the doc
  var wym = WYM_INSTANCES[this.title];
  
  wym._selected_image = null;

  if(evt.keyCode == 13 && !evt.shiftKey) {
  
    // RETURN key
    // cleanup <br><br> between paragraphs
    jQuery(wym._doc.body).children(WYM_BR).remove();
  }
  
  else if(evt.keyCode != 8
       && evt.keyCode != 17
       && evt.keyCode != 46
       && evt.keyCode != 224
       && !evt.metaKey
       && !evt.ctrlKey) {
      
    // NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
    // text nodes replaced by P
    
    var container = wym.selected();
    var name = container.tagName.toLowerCase();

    // fix forbidden main containers
    if(
      name == "strong" ||
      name == "b" ||
      name == "em" ||
      name == "i" ||
      name == "sub" ||
      name == "sup" ||
      name == "a"

   ) name = container.parentNode.tagName.toLowerCase();

    if(name == WYM_BODY) wym._exec(WYM_FORMAT_BLOCK, WYM_P);
  }
};

/* @name enableDesignMode
 * @description Enables live editing of the iframe document.
 */
WymClassSafari.prototype.enableDesignMode = function() {
    
    if(this._doc.designMode == "off") {
      try {
        this._doc.designMode = "on";
        this._doc.execCommand("styleWithCSS", false, false);
      } catch(e) { }
    }
};

/* @name setFocusToNode
 * @description Sets the focus to currently selected node.
 */
WymClassSafari.prototype.setFocusToNode = function(node) {
    var range = document.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();
};

/* @name openBlockTag
 * @description This function may not currently be in use. (Bermi?)
 */
WymClassSafari.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  //  Handle Safari styled spans
  if(tag == 'span' && attributes.style){
    var new_tag = this.getTagForStyle(attributes.style);
    if(new_tag){
      this._tag_stack.pop();
      var tag = new_tag;
      this._tag_stack.push(new_tag);
      attributes.style = '';
    }else{
      return;
    }
  }
  
  if(tag != 'li' && (tag == 'ul' || tag == 'ol') && this.last_tag && !this.last_tag_opened && this.last_tag == 'li'){
    this.output = this.output.replace(/<\/li>$/, '');
    this.insertContentAfterClosingTag(tag, '</li>');
  }
  
  this.output += this.helper.tag(tag, attributes, true);
};

/* @name closeBlockTag
 * @description This function may not currently be in use. (Bermi?)
 */
WymClassSafari.prototype.closeBlockTag = function(tag)
{
  this.output = this.output.replace(/<br \/>$/, '')+this._getClosingTagContent('before', tag)+"</"+tag+">"+this._getClosingTagContent('after', tag);
};

/* @name getTagForStyle
 * @description Converts styled tags to the correct (i.e., syntactically valid) xhtml tag.
 * @param string style The styled tag (?)
 * @return string|bool Returns the string tag name if matched. False if not matched.
 */
WymClassSafari.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/sub/.test(style)) return 'super';
  return false;
};

/********** SELECTION API **********/

/* @name WymSelSafari
 * @description Creates an instance of the SAPI
 * @param object The current wymeditor instance.
 * @return void
 */
function WymSelSafari(wym) {
    this._wym = wym;
};

/* @name WymSelSafari
 * @description The Selection Application Programming Interface (SAPI)
 */
WymSelSafari.prototype = {
    getSelection: function() {
        var _sel = this._wym._iframe.contentWindow.getSelection();
        var range = this._getRange();

        this.startNode   = this._startNode(_sel, range);
        this.endNode     = this._endNode(_sel, range);
        this.startOffset = range.startOffset;
        this.endOffset   = range.endOffset;
        this.length      = new String(_sel).length;
        
        this.isCollapsed = _sel.isCollapsed;
        this.original    = _sel;
        this.container   = jQuery(this.startNode).parentsOrSelf(WYM_MAIN_CONTAINERS.join(","))[0];
        
        return this;
    },
    
    newNode: function() {
        var _id = this._wym.uniqueStamp();
        jQuery(this._wym._iframe.contentDocument.body).append('<p id="' + _id + '"></p>');
        return this._wym._iframe.contentDocument.getElementById(_id);
    },
    
    _getRange: function()
    {
        return this._wym._iframe.contentDocument.createRange();
    },

    _startNode: function(_sel, range) {
        var node;
        if (_sel.baseNode && _sel.basNode == "#text")
        {
            node = _sel.baseNode.parentNode;
        }
        if (_sel.baseNode)
        {
            node = _sel.baseNode;
        }
        else
        {
            node = range.startNode;
        }
        return node;
    },
    
    _endNode: function(_sel, range) {
        var node;
        if (_sel.focusNode && _sel.focusNode == "#text")
        {
            node = _sel.focusNode.parentNode;
        }
        if (_sel.focusNode)
        {
            node = _sel.focusNode;
        }
        else
        {
            node = range.endNode;
        }
        return node;
    },
    
    cursorToStart: function(jqexpr) {
        if (jqexpr.nodeType == WYM_NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var firstTextNode = $(jqexpr)[0];

        while (firstTextNode.nodeType!=WYM_NODE.TEXT) {
            if (!firstTextNode.hasChildNodes())
                break;
            firstTextNode = firstTextNode.firstChild;
        }

        if (isPhantomNode(firstTextNode))
            firstTextNode = firstTextNode.nextSibling;

        //  e.g. an <img/>
        if (firstTextNode.nodeType == WYM_NODE.ELEMENT)
            this.original.collapse(firstTextNode.parentNode, 0);
        else
            this.original.collapse(firstTextNode, 0);
    },

    cursorToEnd: function(jqexpr) {
        if (jqexpr.nodeType == WYM_NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var lastTextNode = $(jqexpr)[0];

        while (lastTextNode.nodeType!=WYM_NODE.TEXT) {
            if (!lastTextNode.hasChildNodes())
                break;
            lastTextNode = lastTextNode.lastChild;
        }

        if (isPhantomNode(lastTextNode))
            lastTextNode = lastTextNode.previousSibling;

        //  e.g. an <img/>
        if (lastTextNode.nodeType == WYM_NODE.ELEMENT)
            this.original.collapse(lastTextNode.parentNode,
                lastTextNode.parentNode.childNodes.length);
        else
            this.original.collapse(lastTextNode, lastTextNode.length);
    },

    deleteIfExpanded: function() {
        if(!this.original.isCollapsed) {
            this.original.deleteFromDocument();
            return true;
        }
        return false;
    }
};

/* @name bindEvents
 * @description Binds Wymeditor events to window events.
 * @return void
 */
WymClassSafari.prototype.bindEvents = function() {

  // copy the instance
  var wym = this;
  
  // handle click event on tools buttons
  jQuery(this._box).find(this._options.toolSelector).mousedown(function() {
    wym.exec(jQuery(this).attr(WYM_NAME));
    return(false);
  });
  
  // handle click event on containers buttons
  jQuery(this._box).find(this._options.containerSelector).mousedown(function() {
    wym.container(jQuery(this).attr(WYM_NAME));
    return(false);
  });
  
  // handle keyup event on html value: set the editor value
  jQuery(this._box).find(this._options.htmlValSelector).keyup(function() {
    jQuery(wym._doc.body).html(jQuery(this).val());
    // jQuery(wym._doc.body).html(wym.addWymHacksForEditMode(jQuery(this).val()));
  });
  
  // handle click event on classes buttons
  jQuery(this._box).find(this._options.classSelector).mousedown(function() {
  
    var aClasses = eval(wym._options.classesItems);
    var sName = jQuery(this).attr(WYM_NAME);
    
    var oClass = aClasses.findByName(sName);
    
    if(oClass) {
      jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    return(false);
  });
  
  // handle event on update element
  jQuery(this._options.updateSelector)
    .bind(this._options.updateEvent, function() {
      wym.update();
  });
};

/* @name toggleHtml
 * @description Toggles the display of the HTML textarea
 * @return void
 */
Wymeditor.prototype.toggleHtml = function() {
  var html = this.xhtml();
  jQuery(this._element).val(html);
  jQuery(this._box).find(this._options.htmlSelector).toggle();
  jQuery(this._box).find(this._options.htmlValSelector).val(html);
};

/* @name _debug
 * @description Opens a new window and prints the property names and values.
 * @param object An object to debug.
 * @return void
 */
_debug = function(obj)
{
    win2 = window.open();
    win2.document.write("<pre>");
    for (key in obj)
    {
      win2.document.write(key + ": " + obj[key]);
    }
    win2.document.write("</pre>");
    win2.document.close();
};

/* @name _test
 * @description Dynamically adds a 'test' link to the document so that test events can be attached 
 * to the link.onClick event.
 * @param function callback The test function to attach.
 * @return void
 */
_test = function(callback) {
    jQuery(document.body).append(
        "<p><a href=\"#\" id=\"btn-test\">Test</a></p>"
    );
    jQuery("#btn-test").click(callback);
};

/* @name nativeExecCommands
 * @description An array of execCommands natively supported by the Apple Web-Core browser engine. 
 * This list is current as of Web-Core
 */
var nativeExecCommands = [
    'BackColor',
    'Bold',
    'Copy',
    'Cut',
    'Delete',
    'FontName',
    'FontSize',
    'FontSizeDelta',
    'ForeColor',
    'ForwardDelete',
    'InsertLineBreak',
    'InsertParagraph',
    'InsertText',
    'Italic',
    'JustifyCenter',
    'JustifyFull',
    'JustifyLeft',
    'JustifyNone',
    'JustifyRight',
    'Paste',
    'PasteAndMatchStyle',
    'Print',
    'Redo',
    'SelectAll',
    'Subscript',
    'Superscript',
    'Underline',
    'Undo',
    'Unselect'
];

/* @name isNative
 * @description isNative is a Safari-only hack that checks the 'nativeExecCommands' array 
 * for a command name. It determines if a command can be executed by the native 
 * web-core code or if a custom over-ride needs to be called.
 *
 * @param string cmd The command name
 * @return bool Whether or not the command being checked is natively supported.
 */
WymClassSafari.prototype.isNative = function(cmd)
{
    for (i=0; i<nativeExecCommands.length; i++)
    {
        if (cmd.toLowerCase() == nativeExecCommands[i].toLowerCase())
        {
            return true;
        }
    }
    return false;
};

// WymClassSafari Custom execCommand Handlers

/* @name CreateLink
 * @description Wymeditor's custom handler for CreateLink
 * @param object focusNode The currently selected node
 * @param string param ...
 * @return bool Whether or not the command execution was successful
 */
WymClassSafari.prototype.CreateLink = function(focusNode, param) {
  var sel = this._iframe.contentWindow.getSelection();
  var _doc = this._iframe.contentDocument;
  
  // If nothing is selected, just exit
  if (!sel.focusNode.nodeValue && sel.focusNode.nodeName.toLowerCase() != "img") return;
  
  // Handle linking of images
  if (sel.focusNode.nodeName.toLowerCase() == "img")
  {
	var a = _doc.createElement("A");
	a.appendChild(sel.focusNode.cloneNode(false));
	var fragment = _doc.createDocumentFragment();
	fragment.appendChild(a);
	sel.focusNode.parentNode.replaceChild(fragment, sel.focusNode);
  }
  // Handle updating of an existing link
  else if (sel.focusNode.parentNode && sel.focusNode.parentNode.nodeName.toLowerCase() == "a")
  {
	sel.focusNode.parentNode.href = param;
  }
  // Link the selected text
  else
  {
	this.wrap(sel, "a", {"href":param});
  }
};

/* @name Indent
 * @description Wymeditor's custom handler for Indent
 * @param object focusNode The currently selected node
 * @param string param ...
 * @return bool Whether or not the command execution was successful
 */
WymClassSafari.prototype.Indent = function(focusNode, param) {
    var focusNode = this.selected();    
    var sel = this._iframe.contentWindow.getSelection();
    
    if (sel.anchorNode)
    {
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
    }
    
    focusNode = this.findUp(focusNode, WYM_BLOCKS);
    anchorNode = this.findUp(anchorNode, WYM_BLOCKS);
    
    if(focusNode && focusNode == anchorNode
      && focusNode.tagName.toLowerCase() == WYM_LI) {

        var ancestor = focusNode.parentNode.parentNode;

        if(focusNode.parentNode.childNodes.length>1
          || ancestor.tagName.toLowerCase() == WYM_OL
          || ancestor.tagName.toLowerCase() == WYM_UL)
            this._doc.execCommand(cmd,'',null);
    }
};

/* @name InsertImage
 * @description Inserts an image element.
 * @param object focusNode The parentNode of the current selection
 * @param string param The 'src' of the image to insert.
 * @return bool Whether or not the command was successfully executed.
 */
WymClassSafari.prototype.InsertImage = function(focusNode, param) {
  try {
    if (!focusNode)
    {
      focusNode = this.selection.newNode();
    }
    if (focusNode.nodeName.toLowerCase() == WYM_IMG)
    {
        jQuery(focusNode).attr({"src": param});
    } else {
        var opts = {src: param};
        jQuery(focusNode).append(
          this.helper.tag('img', opts)
        );
    }
  } catch(e) {
    return false;
  }
  return true;
};

/* @name InsertUnorderedList
 * @description Wymeditor's custom handler for InsertUnorderedList
 * @param object focusNode The currently selected node
 * @param string param ...
 * @return bool Whether or not the command execution was successful
 */
WymClassSafari.prototype.InsertUnorderedList = function(param, type) {
  var selected = this.selected();
  var contents = selected.innerHTML;
  
  // Last list item
  if(selected.tagName == 'LI' && selected.parentNode && selected.nextSibling == undefined) {
    this.insertTagAfter(this.deleteSelectedNode(), 'p', contents);
  
    // First list item
    } else if(selected.tagName == 'LI' && selected.parentNode && selected.previousSibling == undefined){
      var parent = selected.parentNode;
    this.deleteNode(selected);
    this.insertTagBefore(parent, 'p', contents);
    
    // inline list item
    } else if(selected.tagName == 'LI' && selected.parentNode){
      var parent = selected.parentNode;
      var before = '';
      var after = false;
      for(var i = 0; i < parent.childNodes.length; i++) {
        if(after === false){
          if(parent.childNodes[i] == selected){
            after = '';
          }else{
            before += parent.childNodes[i].outerHTML;
          }
        } else{
          after += parent.childNodes[i].outerHTML;
        }
      }
            
      $(parent).before(this.helper.contentTag(parent.tagName, before));
      var p_details = this.generateContentTagWithId('p', contents);
      $(parent).before(p_details.content);
      var p = this.getById(p_details.id);
      $(parent).before(this.helper.contentTag(parent.tagName, after));
      $(parent).remove();
      this.focusNode(p,1,1);
      
  // On a paragraph
  } else if(selected.tagName == 'P'){
    this.replaceTagWith(selected, type+'+li', contents);
  }
};

/* @name Outdent
 * @description Wymeditor's custom handler for Outdent
 * @param object focusNode The currently selected node
 * @param string param ...
 * @return bool Whether or not the command execution was successful
 */
WymClassSafari.prototype.Outdent = function(focusNode, param) {
    var focusNode = this.selected();    
    var sel = this._iframe.contentWindow.getSelection();
    
    if (sel.anchorNode)
    {
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
    }
    focusNode = this.findUp(focusNode, WYM_BLOCKS);
    anchorNode = this.findUp(anchorNode, WYM_BLOCKS);
    
    if(focusNode && focusNode == anchorNode
      && focusNode.tagName.toLowerCase() == WYM_LI) {

        var ancestor = focusNode.parentNode.parentNode;

        if(focusNode.parentNode.childNodes.length>1
          || ancestor.tagName.toLowerCase() == WYM_OL
          || ancestor.tagName.toLowerCase() == WYM_UL)
            this._doc.execCommand(cmd,'',null);
    }
};

/* @name Unlink
 * @description Wymeditor's custom handler for Unlink
 * @param object focusNode The currently selected node
 * @param string param ...
 * @return bool Whether or not the command execution was successful
 */
WymClassSafari.prototype.Unlink = function(focusNode, param) {
    alert('Unlink');
};

// Bermi's Functions

// This is a workarround for select iframe safari bug

WymClassSafari.prototype.addWymHacksForEditMode = function(xhtml) {
    return 
    '<span id="wym_safari_select_all_hack" ' 
    + 'style="height:0.01em;position:absolute;margin-top:-50px;">safari-hack</span>'+xhtml;
};

WymClassSafari.prototype.removeWymAttributesFromXhtml = function(xhtml) {
  return xhtml.replace(/<span id="wym_safari_select_all_hack"[^>]*>safari-hack<\/span>/, '');
};

WymClassSafari.prototype.removeSafarihacks = function(raw_html){
  if(true || jQuery.browser.version < 10000){
    raw_html = raw_html.replace(this.hackChar,'');
  }
  return raw_html;
};

/* @name beforeParsing
 * @description Removes Safari's place-holder BR tags in empty paragraphs.
 * @param string raw The raw HTML
 * @return string The cleaned-up HTML without place-holders
 */
WymClassSafari.prototype.beforeParsing = function(raw)
{
  this.output = '';
  return this.removeSafarihacks(raw).
  // Remove safari place holders
  replace(/([^>]*)<(\w+)><BR class\="khtml-block-placeholder"><\/\2>([^<]*)/g, "<$2>$1$3</$2>");
};

WymClassSafari.prototype.selectAll = function(param) {
  this.currentSelection.setBaseAndExtent(this._doc.body, 0, w._doc.body, w._doc.body.length);
};

/* @name update
 * @description Updates the HTML textarea with the current version of the iframe document
 * @return void
 */
WymClassSafari.prototype.update = function() {
  var html = this.cleanup(this.removeWymAttributesFromXhtml(this.xhtml()));
  jQuery(this._element).val(html);
  jQuery(this._box).find(this._options.htmlValSelector).val(html);
};

/* @name cleanup
 * @description Removes Apple-style-span tags and attributes (currently a bit buggy)
 * @param string xhtml The xhtml including Apple-span-tag tags and attributes
 * @return string The clean xhtml
 */
WymClassSafari.prototype.cleanup = function(xhtml) {
  // remove Safari style spans
  return xhtml.replace(/<span class="Apple-style-span">(.*)<\/span>/gi, "$1")
    // remove any style-span classes from valid elements (e.g., strong, em, etc.)
    .replace(/ class="Apple-style-span"/gi, "");	
};

/* @name handleEnter
 * @description Custom case-handling for when the enter key is pressed.
 * @param event evt The current window event
 * @return bool Whether or not the current event should be continued
 */
WymClassSafari.prototype.handleEnter = function(evt){
  var selected = this.selected();
  if(true || jQuery.browser.version < 10000){    
    
    if(evt.shiftKey){
      if(!this.selectedHtml && this.selectedText == selected.innerHTML){
        selected.innerHTML = this.emptyChar()+'<br />'+this.emptyChar();
      }
      return false;
    }
    this.handleEnterOnListItem(selected);
   
  }
  return true;
};

/* @name handleBackspace
 * @description Custom case-handling for when the back-space key is pressed.
 * @return bool true (allows the current event to continue)
 */
WymClassSafari.prototype.handleBackspace = function(){
  var selected = this.selected();
  if(true || jQuery.browser.version < 10000){
    if(selected.tagName == 'P' && selected.innerHTML == ''){
      // Todo: move caret to the end of previous sibling
      var parent = selected.parentNode;
      parent.removeChild(selected);
    }
  }
  return true;
};

/* @name handleEnterOnListItem
 * @description Custom case-handling for when the back-space key is pressed inside a list item 
 * (not fully implemented)
 * @return void
 */
WymClassSafari.prototype.handleEnterOnListItem = function(selected)
{
  if(selected.tagName == 'LI' && selected.parentNode) {
    // If we access the text on the right of current carret a new list item will be added
    if((this.isCollapsed && selected.innerHTML && this.selectionCopy.d ? 
        selected.innerHTML.substring(this.selectionCopy.d) : '') == ''){
      // remove the last empty list item and insert a new paragraph
      if(selected.innerHTML.trim() == ''){
        this.insertTagAfter(this.deleteSelectedNode(), 'p', '');
      // New list item
      }else if (this.isCollapsed){
        this.insertTagAfter(selected, 'li', '');

      // we are selecting all the text in a list item
      }else if(this.selectedText == selected.innerHTML || selected.innerHTML == this.selectedHtml){

        if(selected.nextSibling == undefined){ // last item
          this.insertTagAfter(this.deleteSelectedNode(), 'p', '');
        }else{
          this.insertTagAfter(this.deleteContents(selected), 'li', '');
        }
      }else{
        // New list item
        var selectedText = this.selectedHtml || this.selectedText;
        // selecting text up to the end
        if(this.selectionCopy.b+selectedText.length == selected.innerHTML.length){
            this.removeSelection();
            // replace the HTML with the left of the selection
            selected.innerHTML = selected.innerHTML.substring(0,this.selectionCopy.b);
            this.insertTagAfter(selected, 'li', '');
        }

      }
    }
  }
};

/* @name wrap
 * @description Wrap a selection in a container tag
 * @param object sel The selection object
 * @param string tag The name of the tag to wrap the selection
 * @param object options The attributes to apply to the new tag
 * @return void
 *
 * A hearty thanks to Brian Donovan (http://dev.lophty.com) for this solution. 
 * I had the right idea and had it partially working but without his Ahoy code examples 
 * and thorough explanations, it would have taken me a lot longer to solve (if at all).
 */
WymClassSafari.prototype.wrap = function(sel, tag, options) {
  var _doc = this._iframe.contentDocument;
  var fragment  = _doc.createDocumentFragment();

  // Create range before selection
  // When text is selected via double-click, Safari jacks the offsets 
  // so we need to detect the double-click and adjust accordingly.
  var preSelectionRange = this.range(
    _doc, sel, sel.anchorNode, sel.anchorNode, 0, 
    window.isDblClick ? sel.anchorOffset - 2 : sel.anchorOffset);

  // Create the range for the selection
  var range = this.range(
	_doc, sel, sel.anchorNode, sel.focusNode, 
	sel.anchorOffset, sel.focusOffset);

  // Create range after selection
  // When text is selected via double-click, Safari jacks the offsets 
  // so we need to detect the double-click and adjust accordingly.
  var postSelectionRange = this.range(
	_doc, sel, sel.focusNode, sel.focusNode, 
	window.isDblClick ? sel.focusOffset + 2 : sel.focusOffset,
	sel.focusNode.nodeValue.length);

  // Create the new 'wrap' tag
  var wrapper = this._iframe.contentDocument.createElement(tag);
  for (prop in options)
  {
    wrapper[prop] = options[prop];	
  }
  wrapper.appendChild(_doc.createTextNode(sel));

  // Append the 3 nodes to the document fragment in
  // consecutive order
  fragment.appendChild(_doc.createTextNode(preSelectionRange.toString()));
  fragment.appendChild(wrapper);
  fragment.appendChild(_doc.createTextNode(postSelectionRange.toString()));

  // Replace the text node containing the selection with
  // the document fragment that we've prepared.
  sel.anchorNode.parentNode.replaceChild(fragment, sel.anchorNode.parentNode.childNodes[0]);
};

/* @name range
 * @description Creates a new range and sets the start and end
 * @param object doc A document object
 * @param object sel The selection object
 * @param object startNode The beginning node of the selection
 * @param object endNode The end node of the selection
 * @param int startOffset The beginning offset of the selection
 * @param int endOffset The end offset of the selection
 * @return object A range object
 */
WymClassSafari.prototype.range = function(doc, sel, startNode, endNode, startOffset, endOffset) {
  var range = doc.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  return range;	
};
