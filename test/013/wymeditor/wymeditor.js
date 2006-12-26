jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({
	
		iframeUrl:		"wymeditor/wymiframe.html",
		boxHtml:		"<div class='wym_box'></div>",
		menuHtml:		"<div class='wym_menu'></div>"

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
	this.index = index;

	var box = $(elem).hide().after(options.boxHtml).next();
	
	this.box = box;

	var sHtml =   "<div class='" + options.iframeClass + "'>"
		+ "<iframe class='" + options.iframeClass + "' "
		+ "src='" + options.iframeUrl + "'"
		+ "onload='window.parent.wym_instances[" + index + "].init(this)' ";
	
	if(jQuery.browser.msie || jQuery.browser.opera) {
		sHtml +=  "onclick='window.parent.wym_instances[" + index + "].saveCaret()'"
			+ "onbeforedeactivate='window.parent.wym_instances[" + index + "].saveCaret()'";
	}
	
	sHtml += "></iframe></div>";
	sHtml += "<div class='wym_menu'><a class='wym_exec' href='#' name='Bold'>Bold</a></div>";

	$(box).html(sHtml);

}

Wymeditor.prototype.init = function(iframe) {

	var doc = null;
	var wymeditor = this;

	if(jQuery.browser.mozilla) {
		doc = iframe.contentDocument;
		doc.title = wymeditor.index;
		doc.designMode="on";
		doc.execCommand("styleWithCSS",'',false);
		doc.addEventListener('contextmenu',this.contextmenuHandler,false);
	}
	else if(jQuery.browser.msie || jQuery.browser.opera) {

		doc = iframe.contentWindow.document;
		doc.body.contentEditable=true;
	}

	this.doc = doc;
	this.iframe=iframe;

	$(doc.body).html(this.html);

	$(this.box).find(".wym_menu").hide();

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

//EVENTS

Wymeditor.prototype.contextmenuHandler = function(evt) {
	evt.stopPropagation();
	var index = this.title;
	var box = wym_instances[index].box;
	
	$(box).find("div.wym_menu").show();
}


//MSIE RELATED

Wymeditor.prototype.saveCaret = function() {
	this.iframe.caretPos=document.selection.createRange();
}

//GLOBAL
var wym_instances = new Array();
