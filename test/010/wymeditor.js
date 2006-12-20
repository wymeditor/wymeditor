jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({
	
		iframeUrl:	"wymiframe.html",
		boxClass:	"wym_box",
		menuClass:	"wym_menu",
		iframeClass:	"wym_iframe",
		execClass:	"wym_exec",
		strongText:	"Strong",
		emphasisText:	"Emphasis"

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

	var sHtml = "<div class='" + options.boxClass + "'></div>";
	var box = $(elem).hide().after(sHtml).next();
	
	this.box = box;

	sHtml =   "<div class='" + options.menuClass + "'>"
		+ "<ul>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Bold'>" + options.strongText + "</a></li>"
		+ "<li><a class='" + options.execClass + "' href='#' name='Italic'>" + options.emphasisText + "</a></li>"
		+ "</ul>"
		+ "</div>"
		+ "<div class='" + options.iframeClass + "'>"
		+ "<iframe class='" + options.iframeClass + "' "
		+ "src='" + options.iframeUrl + "'"
		+ "onload='window.parent.wym_instances[" + index + "].init(this)' "
		+ "></iframe></div>";

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

	$(doc.body).html(this.html);

	$(this.box).find(".wym_exec").click(function(){
		wymeditor.exec($(this).name());
		return false;
	});

}

Wymeditor.prototype.exec = function(cmd) {
	if(jQuery.browser.mozilla) this.doc.execCommand(cmd,'',null);
	else if(jQuery.browser.msie || jQuery.browser.opera) this.doc.execCommand(cmd);
}


var wym_instances = new Array();
