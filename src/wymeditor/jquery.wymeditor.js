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
		sBoxHtml:		"<div class='wym_box'></div>",
		sMenuHtml:		"<div class='wym_menu'></div>",
		sButtonsHtml:		"<div class='wym_buttons'>"
					+ "<ul>"
					+ "<li class='wym_buttons_strong'><a href='#' name='Bold'>{Strong}</a></li>"
					+ "<li class='wym_buttons_emphasis'><a href='#' name='Italic'>{Emphasis}</a></li>"
					+ "<li class='wym_buttons_superscript'><a href='#' name='Superscript'>{Superscript}</a></li>"
					+ "<li class='wym_buttons_subscript'><a href='#' name='Subscript'>{Subscript}</a></li>"
					+ "<li class='wym_buttons_ordered_list'><a href='#' name='InsertOrderedList'>{Ordered_List}</a></li>"
					+ "<li class='wym_buttons_unordered_list'><a href='#' name='InsertUnorderedList'>{Unordered_List}</a></li>"
					+ "<li class='wym_buttons_indent'><a href='#' name='Indent'>{Indent}</a></li>"
					+ "<li class='wym_buttons_outdent'><a href='#' name='Outdent'>{Outdent}</a></li>"
					+ "<li class='wym_buttons_undo'><a href='#' name='Undo'>{Undo}</a></li>"
					+ "<li class='wym_buttons_redo'><a href='#' name='Redo'>{Redo}</a></li>"
					+ "<li class='wym_buttons_link'><a href='#' name='CreateLink'>{Link}</a></li>"
					+ "<li class='wym_buttons_unlink'><a href='#' name='Unlink'>{Unlink}</a></li>"
					+ "<li class='wym_buttons_image'><a href='#' name='InsertImage'>{Image}</a></li>"
					+ "<li class='wym_buttons_table'><a href='#' name='InsertTable'>{Table}</a></li>"
					+ "<li class='wym_buttons_html'><a href='#' name='ToggleHtml'>{HTML}</a></li>"
					+ "</ul>"
					+ "</div>",
		sContainersHtml:	"<div class='wym_containers'>"
					+ "<ul>"
					+ "<li class='wym_containers_p'><a href='#' name='P'>Paragraph</a></li>"
					+ "<li class='wym_containers_h1'><a href='#' name='H1'>Heading 1</a></li>"
					+ "<li class='wym_containers_h2'><a href='#' name='H2'>Heading 2</a></li>"
					+ "<li class='wym_containers_h3'><a href='#' name='H3'>Heading 3</a></li>"
					+ "<li class='wym_containers_h4'><a href='#' name='H4'>Heading 4</a></li>"
					+ "<li class='wym_containers_h5'><a href='#' name='H5'>Heading 5</a></li>"
					+ "<li class='wym_containers_h6'><a href='#' name='H6'>Heading 6</a></li>"
					+ "<li class='wym_containers_pre'><a href='#' name='PRE'>Preformatted</a></li>"
					+ "<li class='wym_containers_blockquote'><a href='#' name='BLOCKQUOTE'>Blockquote</a></li>"
					+ "<li class='wym_containers_th'><a href='#' name='TH'>Table Header</a></li>"
					+ "</ul>"
					+ "</div>",
		sClassesHtml:		"<div class='wym_classes'>"
					+ "</div>",
		sStatusHtml:		"<div class='wym_status'>"
					+ "</div>",
		sHtmlValHtml:		"<div class='wym_html'>"
					+ "<textarea class='wym_html_val'></textarea>"
					+ "</div>",
		bButtons:		true,
		bContainers:		true,
		bClasses:		true,
		bStatus:		true,
		bHtmlVal:		true

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
	},
	wymstrings: function(sKey) {
		return (aWYM_STRINGS[sKey]);
	}
});

/* @name Wymeditor
 * @description WYMeditor class
 */
function Wymeditor(elem,index,options) {

	aWYM_INSTANCES[index] = this;

	this._element = elem;
	this._index = index;
	this._options = options;
	this._html = $j(elem).val();
	this._lng = {};
	
	if(this._options.sHtml) this._html = this._options.sHtml;
	
	this.init();
	
};

/* @name browser
 * @description Returns the browser object
 */
Wymeditor.prototype.browser = function() {

	return($j.browser);
};

/* @name init
 * @description Initializes a WYMeditor instance
 */
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
	$j(this._box).find(".wym_iframe").before(this._options.sMenuHtml);
	
	//this will become a parameter (see options)
	//perhaps sWymButtons, sWymContainers, sWymClasses, sWymDialogs, sWymStatus
	var sMenuHtml = "";
	
	if(this._options.bButtons)	sMenuHtml += this._options.sButtonsHtml;
	if(this._options.bContainers)	sMenuHtml += this._options.sContainersHtml;
	if(this._options.bClasses)	sMenuHtml += this._options.sClassesHtml;
	if(this._options.bStatus)	sMenuHtml += this._options.sStatusHtml;
	if(this._options.bValHtml)	sMenuHtml += this._options.sValHtml;

	sMenuHtml = this.replaceStrings(sMenuHtml);

	$j(this._box).find(".wym_menu").html(sMenuHtml);
	$j(this._box).find(".wym_html").hide();

	//handle click event on buttons
	$j(this._box).find(".wym_buttons a").click(function() {
		wym.exec($(this).attr("name"));
		return(false);
	});
	
	//handle click event on containers buttons
	$j(this._box).find(".wym_containers a").click(function() {
		wym.container($(this).attr("name"));
		return(false);
	});
	
	$j(this._box).find(".wym_html_val").keyup(function() {
		$j(wym._doc.body).html($j(this).val());
	});
};


/********** BASE METHODS **********/

/* @name html
 * @description Get/Set the html value
 */
Wymeditor.prototype.html = function(sHtml) {

	if(sHtml) $j(this._doc.body).html(sHtml);
	else return($j(this._doc.body).html());
};

/* @name exec
 * @description Executes a button command
 */
Wymeditor.prototype.exec = function(cmd) {
	
	//base function for execCommand
	//open a dialog or exec
	switch(cmd) {	
		case "CreateLink":
			var container = this.container();
			if(container) {
				this.status("Selection: " + container.tagName);
				this.dialog("link");
			}
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

/* @name container
 * @description Get/Set the selected container
 */
Wymeditor.prototype.container = function(sType) {

	if(sType) {
	
		var container = null;
		
		if(sType.toLowerCase() == "th") {
		
			container = this.container();
			
			//find the TD or TH container
			switch(container.tagName.toLowerCase()) {
			
				case "td": case "th":
					break;
				default:
					var aTypes = new Array("td","th");
					container = this.findUp(aTypes);
					break;
			}
			
			//if it exists, switch
			if(container!=null) {
			
				sType = (container.tagName.toLowerCase() == "td")? "th": "td";
				this.switchTo(container,sType);
				this.update();
			}
		} else {
	
			//set the container type
			var aTypes=new Array("p","h1","h2","h3","h4","h5","h6","pre","blockquote");
			container = this.findUp(aTypes);
			
			if(container) {
	
				var newNode = null;
	
				//blockquotes must contain a block level element
				if(sType.toLowerCase() == "blockquote") {
				
					var blockquote = this.findUp("blockquote");
					
					if(blockquote == null) {
					
						newNode = this._doc.createElement(sType);
						container.parentNode.insertBefore(newNode,container);
						newNode.appendChild(container);
						
					} else {
					
						var nodes = blockquote.childNodes;
						var lgt = nodes.length;
						for(var x=0; x<lgt; x++) {
							blockquote.parentNode.insertBefore(nodes.item(0),blockquote);
						}
						blockquote.parentNode.removeChild(blockquote);
					}
				}
				
				else this.switchTo(container,sType);
			
				this.update();
			}
		}
	}
	else return(this.selected());
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
Wymeditor.prototype.findUp = function(mFilter) {

	var container = this.container();
	var tagname = container.tagName.toLowerCase();
	
	if(typeof(mFilter) == "string") {

		while(tagname != mFilter && tagname != "body") {
		
			container = container.parentNode;
			tagname = container.tagName.toLowerCase();
		}
	
	} else {
	
		var bFound = false;
		
		while(!bFound && tagname != "body") {
			for(var i = 0; i<mFilter.length; i++) {
				if(tagname == mFilter[i]) {
					bFound = true;
					break;
				}
			}
			if(!bFound) {
				container = container.parentNode;
				tagname = container.tagName.toLowerCase();
			}
		}
	}
	
	if(tagname != "body") return(container);
	else return(null);
};

/* @name switchTo
 * @description Switch the node's type
 */
Wymeditor.prototype.switchTo = function(node,sType) {

	var newNode = this._doc.createElement(sType);
	var html = $j(node).html();
	node.parentNode.replaceChild(newNode,node);
	$j(newNode).html(html);
};

/********** UI RELATED **********/

Wymeditor.prototype.replaceStrings = function(sVal) {

	for (var key in aWYM_STRINGS) {
		sVal = sVal.replace("{" + key + "}", aWYM_STRINGS[key]);
	}
	return(sVal);
};

/* @name status
 * @description Prints a status message
 */
Wymeditor.prototype.status = function(sMessage) {

	//print status message
	$j(this._box).find(".wym_status").html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
Wymeditor.prototype.update = function() {

	var html = this.xhtml();
	$j(this._element).val(html);
	$j(this._box).find(".wym_html_val").val(html);
};

/* @name dialog
 * @description Opens a dialog box
 */
Wymeditor.prototype.dialog = function(sType) {

};

/* @name toggleHtml
 * @description Shows/Hides the HTML
 */
Wymeditor.prototype.toggleHtml = function() {

	$j(this._box).find(".wym_html").toggle();
};
