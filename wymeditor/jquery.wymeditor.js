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
			+ "onload='window.parent.aWYM_INSTANCES[" + this.wym.index + "].initIframe(this)' "
			+ "></iframe>";

	this.box = $j(this.element).hide().after(this.options.sBoxHtml).next();
	$j(this.box).html(sIframeHtml);
	
	//load the menu
	$j(this.box).find(".wym_iframe").before("<div class='wym_menu'></div>");
	
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
			+ "</div>";
			
	sMenuHtml	+="<div class='wym_classes'>"
			+ "</div>";
	
	sMenuHtml	+="<div class='wym_dialogs'>"
			+ "<div class='wym_dialog wym_dialog_link'>"
			+ "<h2>Link assistant</h2>"
			+ "<label>URL: </label>"
			+ "<input type='text' name='url' />"
			+ "</div>"
			+ "<div class='wym_dialog wym_dialog_image'>"
			+ "<h2>Image assistant</h2>"
			+ "<label>URL: </label>"
			+ "<input type='text' name='url' class='wym_dialog_link_url' />"
			+ "</div>"
			+ "<a href='#' class='wym_dialog_submit'>Submit</a>"
			+ "</div><br />";
			
	sMenuHtml	+="<div class='wym_status'>"
			+ "</div><br />";
	

	$j(this.box).find(".wym_menu").html(sMenuHtml);
	$j(this.box).find(".wym_dialogs").hide();

	//handle click event on buttons
	$j(this.box).find(".wym_button").click(function() {
		wym.exec($(this).attr("name"));
		return(false);
	});
	
	//handle click event on containers buttons
	$j(this.box).find(".wym_container").click(function() {
		wym.setContainer($(this).attr("name"));
		return(false);
	});
	
	//handle click event on dialog submit button
	$j(this.box).find(".wym_dialog_submit").click(function() {
		
	});
};

Wymeditor.prototype.exec = function(cmd) {
	
	//base function for execCommand
	//open a dialog or exec
	switch(cmd) {	
		case "CreateLink":
			var container = this.getContainer();
			this.status("Selection: " + container.tagName);
			this.openDialog("link");
		break;
		
		case "InsertImage":
			this.openDialog("image");
		break;
		
		case "InsertTable":
			this.openDialog("table");
		break;
		
		default:
			this._exec(cmd);
		break;
	}
};

Wymeditor.prototype.setContainer = function() {

	//set container
};

Wymeditor.prototype.openDialog = function(sType) {

	//show dialog box
	$j(this.box).find(".wym_dialogs").show();
	$j(this.box).find(".wym_dialog").hide();
	$j(this.box).find(".wym_dialog_" + sType).show();
};

Wymeditor.prototype.status = function(sMessage) {

	//print status message
	$j(this.box).find(".wym_status").html(sMessage);
};
