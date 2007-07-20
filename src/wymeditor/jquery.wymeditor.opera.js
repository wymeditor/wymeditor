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
 *        jquery.wymeditor.opera.js
 *        Opera specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassOpera(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\r\n";
};

WymClassOpera.prototype.initIframe = function(iframe) {

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
      + '[@name=' + WYM_INDENT +']').hide();
    jQuery(this._box).find(this._options.toolSelector 
      + '[@name=' + WYM_OUTDENT +']').hide();
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WymClassOpera.prototype._exec = function(cmd,param) {

    switch(cmd) {
    
    case WYM_INDENT: case WYM_OUTDENT:
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

WymClassOpera.prototype.selected = function() {

    var sel=this._iframe.contentWindow.getSelection();
    var node=sel.focusNode;
    if(node) {
        if(node.nodeName=="#text")return(node.parentNode);
        else return(node);
    } else return(null);
};

WymClassOpera.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};

//keyup handler
WymClassOpera.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYM_INSTANCES[this.title];
  wym._selected_image = null;
};

// TODO: implement me
WymClassOpera.prototype.setFocusToNode = function(node) {

};
