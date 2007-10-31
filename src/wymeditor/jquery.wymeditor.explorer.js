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
 *        jquery.wymeditor.explorer.js
 *        MSIE specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel@gmail.com)
 */

function WymClassExplorer(wym) {
    
    this._wym = wym;
    this._class = "className";
    this._newLine = "\r\n";
};

WymClassExplorer.prototype.initIframe = function(iframe) {

    //This function is executed twice, though it is called once!
    //But MSIE needs that, otherwise designMode won't work.
    //Weird.
    
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];
    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;
    
    //init html value
    jQuery(this._doc.body).html(this._wym._html);
    
    //handle events
    var wym = this;
    
    this._doc.body.onfocus = function()
      {wym._doc.designMode = "on"; wym._doc = iframe.contentWindow.document;};
    this._doc.onbeforedeactivate = function() {wym.saveCaret();};
    this._doc.onkeyup = function() {
      wym.saveCaret();
      wym.keyup();
    };
    this._doc.onclick = function() {wym.saveCaret();};
    
    this._doc.body.onbeforepaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
    };
    
    this._doc.body.onpaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
      wym.paste(window.clipboardData.getData("Text"));
    };
    
    //callback can't be executed twice, so we check
    if(this._initialized) {
      
      //pre-bind functions
      if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
      
      //bind external events
      this._wym.bindEvents();
      
      //post-init functions
      if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
      
      //add event listeners to doc elements, e.g. images
      this.listen();
    }
    
    this._initialized = true;
    
    //init designMode
    this._doc.designMode="on";
    try{
        // (bermi's note) noticed when running unit tests on IE6
        // Is this really needed, it trigger an unexisting property on IE6
        this._doc = iframe.contentWindow.document; 
    }catch(e){}
};

WymClassExplorer.prototype._exec = function(cmd,param) {

    switch(cmd) {
    
    case WYM_INDENT: case WYM_OUTDENT:
    
        var container = this.findUp(this.container(), WYM_LI);
        if(container)
            this._doc.execCommand(cmd);
    break;
    default:
        if(param) this._doc.execCommand(cmd,false,param);
        else this._doc.execCommand(cmd);
    break;
	}
    
    this.listen();
};

WymClassExplorer.prototype.selected = function() {

    var caretPos = this._iframe.contentWindow.document.caretPos;
        if(caretPos!=null) {
            if(caretPos.parentElement!=undefined)
              return(caretPos.parentElement());
        }
};

WymClassExplorer.prototype.saveCaret = function() {

    this._doc.caretPos = this._doc.selection.createRange();
};

WymClassExplorer.prototype.addCssRule = function(styles, oCss) {

    styles.addRule(oCss.name, oCss.css);
};

//keyup handler
WymClassExplorer.prototype.keyup = function() {
  this._selected_image = null;
};


WymClassExplorer.prototype.setFocusToNode = function(node) {
    var range = this._doc.selection.createRange();
    range.moveToElementText(node);
    range.collapse(false);
    range.move('character',-1);
    range.select();
    node.focus();
};

