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

var sWYM_MOZILLA  = 'Mozilla';
var sWYM_SAFARI   = 'Safari';
var sWYM_EXPLORER = 'Explorer';
var sWYM_OPERA    = 'Opera';

var aWYM_INSTANCES = new Array();

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

		sBoxHtml:		"<div class='wym_box'></div>"

	}, options);

	return this.each(function(i) {

		new Wymeditor($j(this),i,options);
	});
};

function Wymeditor(elem,index,options) {

	aWYM_INSTANCES[index] = this;

	this.element = elem;
	this.index = index;
	this.options = options;
	this.html = $j(elem).val();

	this.init();
};

Wymeditor.prototype.browser = function() {
	
	if ($j.browser.mozilla) {return sWYM_MOZILLA;}
	else if ($j.browser.safari) {return sWYM_SAFARI;}
	else if ($j.browser.opera) {return sWYM_OPERA;}
	else {return sWYM_EXPLORER;}
};

Wymeditor.prototype.init = function() {

	switch (this.browser()) {
		case sWYM_MOZILLA:
			var WymClass = new WymClassMozilla(this);
		break;
		case sWYM_SAFARI:
			var WymClass = new WymClassSafari(this);
		break;
		case sWYM_OPERA:
			var WymClass = new WymClassOpera(this);
		break;
		case sWYM_EXPLORER:
		default:
			var WymClass = new WymClassExplorer(this);
		break;
	}

	for (prop in WymClass) {
		this[prop] = WymClass[prop];
	}
};
