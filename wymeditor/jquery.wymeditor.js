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
 *		jquery.wymeditor.js
 *		Main JS file with core class and functions.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

var $j = jQuery;

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
 * @author Jean-Francois Hovinne
 */
$j.fn.wymeditor = function(options) {

	options = $j.extend({

		sHtml:			"",
		sBoxHtml:		"<div class='wym_box'></div>"

	}, options);

	return this.each(function(i) {

		new Wymeditor($j(this),i,options);
	});
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
$j.extend({
	wymeditors: function(i) {
		return (aWYM_INSTANCES[i]);
	}
});

function Wymeditor(elem,index,options) {

	aWYM_INSTANCES[index] = this;

	this._element = elem;
	this._index = index;
	this._options = options;
	this._html = $j(elem).val();
	
	if(this._options.sHtml) this._html = this._options.sHtml;

	this.init();
};

Wymeditor.prototype.browser = function() {

	return($j.browser);
};

Wymeditor.prototype.init = function() {

	var wym = this;

	//load subclass
	if ($j.browser.msie) {
		var WymClass = new WymClassExplorer(this);
	}
	else if ($j.browser.mozilla) {
		var WymClass = new WymClassMozilla(this);
	}
	else if ($j.browser.opera) {
		var WymClass = new WymClassOpera(this);
	}
	else if ($j.browser.safari) {
		var WymClass = new WymClassSafari(this);
	}
	else {
		//unsupported browser
		alert('Unsupported browser!');
	}

	for (prop in WymClass) {
		this[prop] = WymClass[prop];
	}

	//load the iframe
	var sIframeHtml = "<iframe "
			+ "src='wymeditor/wymiframe.html' "
			+ "class='wym_iframe' "
			+ "onload='window.parent.aWYM_INSTANCES[" + this._wym._index + "].initIframe(this)' "
			+ "></iframe>";

	this._box = $j(this._element).hide().after(this._options.sBoxHtml).next();
	$j(this._box).html(sIframeHtml);
	
	//load the menu
	$j(this._box).find(".wym_iframe").before("<div class='wym_menu'></div>");
	
	//this will become a parameter (see options)
	//perhaps sWymButtons, sWymContainers, sWymClasses, sWymDialogs, sWymStatus
	var sMenuHtml 	= "<div class='wym_buttons'>"
			+ "<ul>"
			+ "<li><a href='#' class='wym_button' name='Bold'>Strong</a></li>"
			+ "<li><a href='#' class='wym_button' name='Italic'>Emphasis</a></li>"
			+ "<li><a href='#' class='wym_button' name='Superscript'>Superscript</a></li>"
			+ "<li><a href='#' class='wym_button' name='Subscript'>Subscript</a></li>"
			+ "<li><a href='#' class='wym_button' name='InsertOrderedList'>Ordered List</a></li>"
			+ "<li><a href='#' class='wym_button' name='InsertUnorderedList'>Unordered List</a></li>"
			+ "<li><a href='#' class='wym_button' name='Indent'>Indent</a></li>"
			+ "<li><a href='#' class='wym_button' name='Outdent'>Outdent</a></li>"
			+ "<li><a href='#' class='wym_button' name='Undo'>Undo</a></li>"
			+ "<li><a href='#' class='wym_button' name='Redo'>Redo</a></li>"
			+ "<li><a href='#' class='wym_button' name='CreateLink'>Create Link</a></li>"
			+ "<li><a href='#' class='wym_button' name='Unlink'>Unlink</a></li>"
			+ "<li><a href='#' class='wym_button' name='InsertImage'>Image</a></li>"
			+ "<li><a href='#' class='wym_button' name='InsertTable'></a></li>"
			+ "<li><a href='#' class='wym_button' name='ToggleHtml'>Toggle HTML</a></li>"
			+ "</ul>"
			+ "</div><br />";
			
	sMenuHtml	+="<div class='wym_containers'>"
			+ "<ul>"
			+ "<li><a href='#' class='wym_container' name='P'>Paragraph</a></li>"
			+ "<li><a href='#' class='wym_container' name='H1'>Heading 1</a></li>"
			+ "<li><a href='#' class='wym_container' name='H2'>Heading 2</a></li>"
			+ "<li><a href='#' class='wym_container' name='H3'>Heading 3</a></li>"
			+ "<li><a href='#' class='wym_container' name='H4'>Heading 4</a></li>"
			+ "<li><a href='#' class='wym_container' name='H5'>Heading 5</a></li>"
			+ "<li><a href='#' class='wym_container' name='H6'>Heading 6</a></li>"
			+ "<li><a href='#' class='wym_container' name='PRE'>Preformatted</a></li>"
			+ "<li><a href='#' class='wym_container' name='BLOCKQUOTE'>Blockquote</a></li>"
			+ "<li><a href='#' class='wym_container' name='TH'>Table Header</a></li>"
			+ "</ul>"
			+ "</div><br />";
			
	sMenuHtml	+="<div class='wym_classes'>"
			+ "</div><br />";
			
	sMenuHtml	+="<div class='wym_status'>"
			+ "</div><br />";
			
	sMenuHtml	+="<div class='wym_html'>"
			+ "<textarea class='wym_html_val'></textarea>"
			+ "</div>";
	

	$j(this._box).find(".wym_menu").html(sMenuHtml);
	$j(this._box).find(".wym_html").hide();

	//handle click event on buttons
	$j(this._box).find(".wym_button").click(function() {
		wym.exec($(this).attr("name"));
		return(false);
	});
	
	//handle click event on containers buttons
	$j(this._box).find(".wym_container").click(function() {
		wym.container($(this).attr("name"));
		return(false);
	});
	
	$j(this._box).find(".wym_html_val").keyup(function() {
		$j(wym._doc.body).html($j(this).val());
	});
};

Wymeditor.prototype.html = function(sHtml) {

	if(sHtml) $j(this._doc.body).html(sHtml);
	else return($j(this._doc.body).html());
};

Wymeditor.prototype.exec = function(cmd) {
	
	//base function for execCommand
	//open a dialog or exec
	switch(cmd) {	
		case "CreateLink":
			var container = this.selected();
			this.status("Selection: " + container.tagName);
			this.dialog("link");
		break;
		
		case "InsertImage":
			this.dialog("image");
		break;
		
		case "InsertTable":
			this.dialog("table");
		break;
		
		case "ToggleHtml":
			this.update();
			this.toggleHtml();
		break;
		
		default:
			this._exec(cmd);
		break;
	}
};

Wymeditor.prototype.container = function(sType) {

	if(sType) {
		//set the container type
	}
	else return(this.selected());
};

Wymeditor.prototype.status = function(sMessage) {

	//print status message
	$j(this._box).find(".wym_status").html(sMessage);
};

Wymeditor.prototype.update = function() {

	var html = this.xhtml();
	$j(this._element).val(html);
	$j(this._box).find(".wym_html_val").val(html);

};

Wymeditor.prototype.dialog = function(sType) {

	//open dialog box
};

Wymeditor.prototype.toggleHtml = function() {

	$j(this._box).find(".wym_html").toggle();
};
