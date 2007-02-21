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
 *		jquery.wymeditor.explorer.js
 *		MSIE specific class and functions.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassExplorer(wym) {
	
	this.wym = wym;
};

WymClassExplorer.prototype.initIframe = function(iframe) {

	this.iframe = iframe;
	this.doc = iframe.contentWindow.document;

	this.doc.title = this.wym.index;
	this.doc.designMode="on";
	
	var doc = iframe.contentWindow.document;
	$j(doc.body).html(this.wym.html);
	
	//handle events
	var wymexp = this;
	doc.onbeforedeactivate = function() {wymexp.saveCaret();};
	doc.onkeyup = function() {wymexp.saveCaret();};
	doc.onclick = function() {wymexp.saveCaret();};	
};

WymClassExplorer.prototype._exec = function(cmd) {

	this.doc.execCommand(cmd);
};

WymClassExplorer.prototype.getContainer = function() {

	var caretPos = this.iframe.contentWindow.document.caretPos;
    	if(caretPos!=null) {
    		if(caretPos.parentElement!=undefined) return(caretPos.parentElement());
    	}
};

WymClassExplorer.prototype.saveCaret = function () {

	var doc = this.iframe.contentWindow.document;
	doc.caretPos = doc.selection.createRange();
};
