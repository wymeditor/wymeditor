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
 *        jquery.wymeditor.opera.js
 *        Opera specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 */

WYMeditor.WymClassOpera = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\r\n";
};

WYMeditor.WymClassOpera.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
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
    
    //hide indent and outdent until supported
    jQuery(this._box).find(this._options.toolSelector 
      + '[@name=' + WYMeditor.INDENT +']').hide();
    jQuery(this._box).find(this._options.toolSelector 
      + '[@name=' + WYMeditor.OUTDENT +']').hide();
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    //bind editor events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WYMeditor.WymClassOpera.prototype._exec = function(cmd,param) {

    switch(cmd) {
    
    case WYMeditor.INDENT: case WYMeditor.OUTDENT:
        //TODO: support nested lists
        //Opera creates blockquotes
        this.status("Unsupported feature.");
    break;
    default:
        if(param) this._doc.execCommand(cmd,false,param);
        else this._doc.execCommand(cmd);
    break;
	}
    
    this.listen();
};

WYMeditor.WymClassOpera.prototype.selected = function() {

    var sel=this._iframe.contentWindow.getSelection();
    var node=sel.focusNode;
    if(node) {
        if(node.nodeName=="#text")return(node.parentNode);
        else return(node);
    } else return(null);
};

WYMeditor.WymClassOpera.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};

//keydown handler
WYMeditor.WymClassOpera.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  // "start" Selection API
  var sel = wym.selection.getSelection();

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


  //Get a P instead of no container
  if(!sel.container
      && evt.keyCode != WYMeditor.KEY.ENTER
      && evt.keyCode != WYMeditor.KEY.LEFT
      && evt.keyCode != WYMeditor.KEY.UP
      && evt.keyCode != WYMeditor.KEY.RIGHT
      && evt.keyCode != WYMeditor.KEY.DOWN
      && evt.keyCode != WYMeditor.KEY.BACKSPACE
      && evt.keyCode != WYMeditor.KEY.DELETE)
      wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);

};

//keyup handler
WYMeditor.WymClassOpera.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  wym._selected_image = null;
};

// TODO: implement me
WYMeditor.WymClassOpera.prototype.setFocusToNode = function(node) {

};

/********** SELECTION API **********/

WYMeditor.WymSelOpera = function(wym) {
    this._wym = wym;
};

WYMeditor.WymSelOpera.prototype = {
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


