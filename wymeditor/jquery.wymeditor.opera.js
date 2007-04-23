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
};

WymClassOpera.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.aEditorCss);

    for(var i = 0; i < aCss.length; i++) {
    var oCss = aCss[i];
    if(oCss.name && oCss.css)
      styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
    }

    this._doc.title = this._wym._index;
    
    //init designMode
    this._doc.designMode = "on";

    //init html value
    this.html(this._wym._html);
    
    //pre-bind functions
    if($j.isFunction(this._options.fPreBind)) this._options.fPreBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor events
    $j(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if($j.isFunction(this._options.fPostInit)) this._options.fPostInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WymClassOpera.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,false,param);
    else this._doc.execCommand(cmd);
    
    this.listen();
};

WymClassOpera.prototype.selected = function() {

    var sel=this._iframe.contentWindow.getSelection();
    var node=sel.focusNode;
    if(node.nodeName=="#text")return(node.parentNode);
    else return(node);
};

WymClassOpera.prototype.xhtml = function() {

    var sHtml = this._wym.html();
    return sHtml;
};

//keyup handler
WymClassOpera.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = aWYM_INSTANCES[this.title];
  wym._selected_image = null;
};
