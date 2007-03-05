/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 *
 * File Name:
 *		jquery.wymeditor.opera.js
 *		Opera specific class and functions.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassOpera(wym) {

	this._wym = wym;
};

WymClassOpera.prototype.initIframe = function(iframe) {

	this._iframe = iframe;
	this._doc = iframe.contentWindow.document;

	this._doc.title = this._wym._index;
	this._doc.designMode="on";

	this.html(this._wym._html);
};

WymClassOpera.prototype._exec = function(cmd,param) {

	if(param) this._doc.execCommand(cmd,false,param);
	else this._doc.execCommand(cmd);
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
