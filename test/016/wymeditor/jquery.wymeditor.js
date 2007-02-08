/**
 * WYMeditor plugin for jQuery
 *
 * http://www.wymeditor.org/
 * 
 * Copyright (c) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt) 
 * and GPL (GPL-license.txt) licenses.
 *
 */

var $j = jQuery.noConflict();

var sMOZILLA  = 'Mozilla';
var sSAFARI   = 'Safari';
var sEXPLORER = 'Explorer';
var sOPERA    = 'Opera';

/**
 * Replace an HTML element by WYMeditor
 *
 * @example $(".wymeditor").wymeditor(
 *				{
 *
 *				}
 *			);
 * @desc Example description here
 * 
 * @name WYMeditor
 * @description WYMeditor is a web-based WYSIWYM XHTML editor
 * @param Hash hash A hash of parameters
 * @option Integer iExample Description here
 * @option String sExample Description here
 *
 * @type jQuery
 * @cat Plugins/WYMeditor
 * @author Jean-François Hovinne
 */
$j.fn.wymeditor = function(options) {

	options = $j.extend({


	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),i,options);
	});
};

function Wymeditor(elem,index,options) {
	this.init();
	$(elem).text(this.name);
};

Wymeditor.prototype.browser = function() {
	
	if ($j.browser.mozilla) {return sMOZILLA;}
	else if ($j.browser.safari) {return sSAFARI;}
	else if ($j.browser.opera) {return sOPERA;}
	else {return sEXPLORER;}
};

Wymeditor.prototype.init = function() {

	switch (this.browser()) {
		case sMOZILLA:
			var WymClass = new WymClassMozilla();
		break;
		case sSAFARI:
			var WymClass = new WymClassSafari();
		break;
		case sOPERA:
			var WymClass = new WymClassOpera();
		break;
		case sEXPLORER:
		default:
			var WymClass = new WymClassExplorer();
		break;
	}

	for (prop in WymClass) {
		this[prop] = WymClass[prop];
	}
};
