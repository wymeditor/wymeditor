jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({
	
		iframeClass:	"wymiframe"

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),i,options);
	});
};

function Wymeditor(elem,index,options) {

	wym_instances[index]=this;

	this.html=$(elem).val();

	sHtml = "<iframe class='" + options.iframeClass + "'"
		+ " src='wymiframe.html'"
		+ " onload='window.parent.wym_instances[" + index + "].init(this)'"
		+ " ></iframe>";

	$(elem).hide().after(sHtml);


}

Wymeditor.prototype.init = function(iframe) {

	var doc=null;

	if(jQuery.browser.mozilla) {

		doc=iframe.contentDocument;
		doc.designMode="on";
		doc.execCommand("styleWithCSS",'',false);
	}
	else if(jQuery.browser.msie || jQuery.browser.opera) {

		doc=iframe.contentWindow.document;
		doc.body.contentEditable=true;
	}

	$(doc.body).html(this.html);
}

var wym_instances=new Array();
