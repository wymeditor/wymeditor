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
 *		Gecko specific class and functions.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassMozilla(wym) {

	this.wym = wym;
};

WymClassMozilla.prototype.initIframe = function(iframe) {

	this.iframe = iframe;
	this.doc = iframe.contentDocument;

	this.doc.title = this.wym.index;
	this.doc.designMode="on";
	this.doc.execCommand("styleWithCSS",'',false);

	$j(this.doc.body).html(this.wym.html);
};

WymClassMozilla.prototype.exec = function(cmd) {

	switch(cmd) {
		
		case "CreateLink":
			this.openDialog("link");
		break;
		
		case "InsertImage":
			this.openDialog("image");
		break;
		
		case "InsertTable":
			this.openDialog("table");
		break;
		
		default:
			this.doc.execCommand(cmd,'',null);
		break;
	}
};
