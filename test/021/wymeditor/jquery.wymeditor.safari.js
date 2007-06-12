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
 *        jquery.wymeditor.mozilla.js
 *        Gecko specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassSafari(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

WymClassSafari.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    this._doc.title = this._wym._index;
    
    //init html value
    this.html(this._wym._html);
    
    this._doc.designMode = "on";
    
    //pre-bind functions
    if($j.isFunction(this._options.preBind)) this._options.preBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //post-init functions
    if($j.isFunction(this._options.postInit)) this._options.postInit(this);
    
};

/* @name html
 * @description Get/Set the html value
 */
WymClassSafari.prototype.html = function(html) {
    
    if(html) $j(this._doc.body).html(html);
    else return($j(this._doc.body).html());
};

WymClassSafari.prototype._exec = function(cmd,param) {
    switch(cmd) {
    
    default:
        if(param) this._doc.execCommand(cmd,false,param);
        else this._doc.execCommand(cmd);
    break;
	}
};

/* @name selected
 * @description Returns the selected container
 */
WymClassSafari.prototype.selected = function() {

};

WymClassSafari.prototype.addCssRule = function(styles, oCss) {

};

/* @name xhtml
 * @description Cleans up the HTML
 */
WymClassSafari.prototype.xhtml = function() {
    return(this.html());
};

WymClassSafari.prototype.keydown = function(evt) {

};

WymClassSafari.prototype.keyup = function(evt) {

};

WymClassSafari.prototype.setFocusToNode = function(node) {
    
};
