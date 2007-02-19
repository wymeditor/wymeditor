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

	var sIframeHtml = "<iframe "
			+ "src='wymeditor/wymiframe.html' "
			+ "onload='window.parent.aWYM_INSTANCES[" + this.wym.index + "].initIframe(this)' "
			+ "></iframe>";

	this.box = $j(this.wym.element).hide().after(this.wym.options.sBoxHtml).next();
	$j(this.box).html(sIframeHtml);
};

WymClassExplorer.prototype.initIframe = function(iframe) {

	this.iframe = iframe;
	this.doc = iframe.contentWindow.document;

	this.doc.title = this.wym.index;
	this.doc.designMode="on";
	
	var doc = iframe.contentWindow.document;
	$j(doc.body).html(this.wym.html);
};
