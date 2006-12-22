jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({
	
		iframeUrl:		"wymeditor/wymiframe.html",
		boxClass:		"wym_box",
		menuClass:		"wym_menu",
		iframeClass:		"wym_iframe",
		execClass:		"wym_exec",
		dialogClass:		"wym_dialog",
		strongText:		"Strong",
		emphasisText:		"Emphasis",
		superscriptText:	"Superscript",
		subscriptText:		"Subscript",
		orderedlistText:	"Ordered list",
		unorderedlistText:	"Unordered list",
		undoText:		"Undo",
		redoText:		"Redo",
		linkText:		"Link"

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),i,options);
	});
};

function Wymeditor(elem,index,options) {

	wym_instances[index] = this;

	this.element = elem;
	this.html = $(elem).val();
	this.doc = null;
	this.iframe = null;

	var sHtml = "<div class='" + options.boxClass + "'></div>";
	var box = $(elem).hide().after(sHtml).next();
	
	this.box = box;

	sHtml =   "<div class='" + options.menuClass + "'>"
		+ "<ul>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Bold'>" + options.strongText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Italic'>" + options.emphasisText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Superscript'>" + options.superscriptText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Subscript'>" + options.subscriptText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='InsertOrderedList'>" + options.orderedlistText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='InsertUnorderedList'>" + options.unorderedlistText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Undo'>" + options.undoText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Redo'>" + options.redoText + "</a></li>"
		+ "<li><a class='" + options.dialogClass + "' href='#' name='Link'>" + options.linkText + "</a></li>"
		+ "</ul>"
		+ "</div>"
		+ "<div class='" + options.iframeClass + "'>"
		+ "<iframe class='" + options.iframeClass + "' "
		+ "src='" + options.iframeUrl + "'"
		+ "onload='window.parent.wym_instances[" + index + "].init(this)' ";
	
	if(jQuery.browser.msie || jQuery.browser.opera) {
		sHtml +=  "onclick='window.parent.wym_instances[" + index + "].saveCaret()'"
			+ "onbeforedeactivate='window.parent.wym_instances[" + index + "].saveCaret()'";
	}
	
	sHtml+= "></iframe></div>";

	$(box).html(sHtml);

}

Wymeditor.prototype.init = function(iframe) {

	var doc = null;
	var wymeditor = this;

	if(jQuery.browser.mozilla) {

		doc = iframe.contentDocument;
		doc.designMode="on";
		doc.execCommand("styleWithCSS",'',false);
	}
	else if(jQuery.browser.msie || jQuery.browser.opera) {

		doc = iframe.contentWindow.document;
		doc.body.contentEditable=true;
	}

	this.doc = doc;
	this.iframe=iframe;

	$(doc.body).html(this.html);

	$(this.box).find("a.wym_exec").click(function(){
		wymeditor.exec($(this).name());
		return false;
	});
	
	$(this.box).find("a.wym_dialog").click(function(){
		alert(wymeditor.selectedContainer());
		return false;
	});

}

Wymeditor.prototype.exec = function(cmd) {
	if(jQuery.browser.mozilla) this.doc.execCommand(cmd,'',null);
	else if(jQuery.browser.msie || jQuery.browser.opera) this.doc.execCommand(cmd);
}

Wymeditor.prototype.selectedContainer = function() {
	if(jQuery.browser.mozilla || jQuery.browser.opera) {
		var sel=this.iframe.contentWindow.getSelection();
		var node=sel.focusNode;
		if(node.nodeName=="#text")return(node.parentNode);
		else return(node);
	}
	else if(jQuery.browser.msie) {
		var caretPos=this.iframe.caretPos;
    		if(caretPos!=null) {
			if(caretPos.parentElement!=undefined)return(caretPos.parentElement());
		}
	}
}


//MSIE RELATED

Wymeditor.prototype.saveCaret = function() {
	this.iframe.caretPos=document.selection.createRange();
}

var wym_instances = new Array();
