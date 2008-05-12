/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2008 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.safari.js
 *        Safari specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Scott Lewis (lewiscot a-t gmail dotcom)
 */

WYMeditor.WymClassSafari = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

WYMeditor.WymClassSafari.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    //add css rules from options
    
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);
    
    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //init designMode
    this._doc.designMode = "on";
    
    //init html value
    this.html(this._wym._html);
    
    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WYMeditor.WymClassSafari.prototype._exec = function(cmd,param) {

    if(!this.selected()) return(false);

    switch(cmd) {
    
    case WYMeditor.INDENT: case WYMeditor.OUTDENT:
    
        var focusNode = this.selected();    
        var sel = this._iframe.contentWindow.getSelection();
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
        
        focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
        anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);
        
        if(focusNode && focusNode == anchorNode
          && focusNode.tagName.toLowerCase() == WYMeditor.LI) {

            var ancestor = focusNode.parentNode.parentNode;

            if(focusNode.parentNode.childNodes.length>1
              || ancestor.tagName.toLowerCase() == WYMeditor.OL
              || ancestor.tagName.toLowerCase() == WYMeditor.UL)
                this._doc.execCommand(cmd,'',null);
        }

    break;

    case WYMeditor.INSERT_ORDEREDLIST: case WYMeditor.INSERT_UNORDEREDLIST:

        this._doc.execCommand(cmd,'',null);

        //Safari creates lists in e.g. paragraphs.
        //Find the container, and remove it.
        var focusNode = this.selected();
        var container = this.findUp(focusNode, WYMeditor.MAIN_CONTAINERS);
        if(container) jQuery(container).replaceWith(jQuery(container).html());

    break;
    
    default:

        if(param) this._doc.execCommand(cmd,'',param);
        else this._doc.execCommand(cmd,'',null);
    }
    
    //set to P if parent = BODY
    var container = this.selected();
    if(container && container.tagName.toLowerCase() == WYMeditor.BODY)
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);

    //add event handlers on doc elements
    this.listen();
};

/* @name selected
 * @description Returns the selected container
 */
WYMeditor.WymClassSafari.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if(node) {
        if(node.nodeName == "#text") return(node.parentNode);
        else return(node);
    } else return(null);
};

WYMeditor.WymClassSafari.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassSafari.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  // "start" Selection API
  //var sel = wym.selection.getSelection();

/*
    // some small tests for the Selection API
    var containers = WYMeditor.MAIN_CONTAINERS.join(",");
    if (sel.isAtStart(containers))
        alert("isAtStart: "+sel.startNode.parentNode.nodeName);
    if (sel.isAtEnd(containers))
        alert("isAtEnd: "+sel.endNode.parentNode.nodeName);
    if (evt.keyCode==WYMeditor.KEY.DELETE) {
        // if deleteIfExpanded wouldn't work, no selected text would be
        // deleted if you press del-key
        if (sel.deleteIfExpanded())
            return false;
    }
    if (evt.keyCode==WYMeditor.KEY.HOME) {
        // if cursorToStart won't work, the cursor won't be set to start
        // if you press home-key
        sel.cursorToStart(sel.container);
        return false;
    }
    if (evt.keyCode==WYMeditor.KEY.END)
    {
        // if cursorToEnd won't work, the cursor won't be set to the end
        // if you press end-key
        sel.cursorToEnd(sel.container);
        return false;
    }
*/
  
  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      //CTRL+b => STRONG
      wym._exec(WYMeditor.BOLD);
      return false;
    }
    if(evt.keyCode == 73){
      //CTRL+i => EMPHASIS
      wym._exec(WYMeditor.ITALIC);
      return false;
    }
  }
};

//keyup handler, mainly used for cleanups
WYMeditor.WymClassSafari.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  wym._selected_image = null;
  var container = null;

  if(evt.keyCode == 13 && !evt.shiftKey) {
  
    //RETURN key
    //cleanup <br><br> between paragraphs
    jQuery(wym._doc.body).children(WYMeditor.BR).remove();
    
    //fix PRE bug #73
    container = wym.selected();
    if(container && container.tagName.toLowerCase() == WYMeditor.PRE)
        wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P); //create P after PRE
  }
  
  else if(evt.keyCode != 8
       && evt.keyCode != 17
       && evt.keyCode != 46
       && evt.keyCode != 224
       && !evt.metaKey
       && !evt.ctrlKey) {
      
    //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
    //text nodes replaced by P
    
    container = wym.selected();
    var name = container.tagName.toLowerCase();

    //fix forbidden main containers
    if(
      name == "strong" ||
      name == "b" ||
      name == "em" ||
      name == "i" ||
      name == "sub" ||
      name == "sup" ||
      name == "a"

    ) name = container.parentNode.tagName.toLowerCase();

    if(name == WYMeditor.BODY) wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
  }
};

//TODO
WYMeditor.WymClassSafari.prototype.setFocusToNode = function(node) {
    /*var range = document.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();*/
};

WYMeditor.WymClassSafari.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  // Handle Safari styled spans
  if(tag == 'span' && attributes.style) {
    var new_tag = this.getTagForStyle(attributes.style);
    if(new_tag){
      this._tag_stack.pop();
      var tag = new_tag;
      this._tag_stack.push(new_tag);
      attributes.style = '';
    } else {
      return;
    }
  }
  
  this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassSafari.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/super/.test(style)) return 'sup';
  return false;
};

/* @name xhtml
 * @description Cleans up the HTML
 */
WYMeditor.editor.prototype.xhtml = function() {
    jQuery('.Apple-style-span', this._doc.body).removeClass('Apple-style-span');
    return this.parser.parse(this.html());
};

/********** SELECTION API **********/

WYMeditor.WymSelSafari = function(wym) {
    this._wym = wym;
};

WYMeditor.WymSelSafari.prototype = {
    getSelection: function() {
        var _sel = this._wym._iframe.contentWindow.getSelection();
        // NOTE v.mische can startNode/endNote be phantom nodes?
        this.startNode = _sel.getRangeAt(0).startContainer;
        this.endNode = _sel.getRangeAt(0).endContainer;
        this.startOffset = _sel.getRangeAt(0).startOffset;
        this.endOffset = _sel.getRangeAt(0).endOffset;
        this.isCollapsed = _sel.isCollapsed;
        this.original = _sel;
        this.container = jQuery(this.startNode).parentsOrSelf(
                WYMeditor.MAIN_CONTAINERS.join(","))[0];

        return this;
    },

    cursorToStart: function(jqexpr) {
        if (jqexpr.nodeType == WYMeditor.NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var firstTextNode = jQuery(jqexpr)[0];

        while (firstTextNode.nodeType!=WYMeditor.NODE.TEXT) {
            if (!firstTextNode.hasChildNodes())
                break;
            firstTextNode = firstTextNode.firstChild;
        }

        if (WYMeditor.isPhantomNode(firstTextNode))
            firstTextNode = firstTextNode.nextSibling;

        // e.g. an <img/>
        if (firstTextNode.nodeType == WYMeditor.NODE.ELEMENT)
            this.original.collapse(firstTextNode.parentNode, 0);
        else
            this.original.collapse(firstTextNode, 0);
    },

    cursorToEnd: function(jqexpr) {
        if (jqexpr.nodeType == WYMeditor.NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var lastTextNode = jQuery(jqexpr)[0];

        while (lastTextNode.nodeType!=WYMeditor.NODE.TEXT) {
            if (!lastTextNode.hasChildNodes())
                break;
            lastTextNode = lastTextNode.lastChild;
        }

        if (WYMeditor.isPhantomNode(lastTextNode))
            lastTextNode = lastTextNode.previousSibling;

        // e.g. an <img/>
        if (lastTextNode.nodeType == WYMeditor.NODE.ELEMENT)
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


