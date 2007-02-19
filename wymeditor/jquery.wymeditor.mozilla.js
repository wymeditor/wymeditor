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
 *		jquery.wymeditor.mozilla.js
 *		Gecko specific class.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassMozilla(wym) {

	this.wym = wym;

	var sIframeHtml = "<iframe "
			+ "src='wymeditor/wymiframe.html' "
			+ "onload='window.parent.aWYM_INSTANCES[" + this.wym.index + "].initIframe(this)' "
			+ "></iframe>";

	this.box = $j(this.wym.element).hide().after(this.wym.options.sBoxHtml).next();
	$j(this.box).html(sIframeHtml);
};

WymClassMozilla.prototype.initIframe = function(iframe) {

	this.iframe = iframe;
	this.doc = iframe.contentDocument;

	this.doc.title = this.wym.index;
	this.doc.designMode="on";
	this.doc.execCommand("styleWithCSS",'',false);

	$j(this.doc.body).html(this.wym.html);
};
