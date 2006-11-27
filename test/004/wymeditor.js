jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({
	
		iframeClass:	".wym_iframe"

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),i,options);
	});
};

function Wymeditor(elem,index,options) {

	wym_instances[index]=this;

	this.html=$(elem).val();

	sHtml = "<iframe class='" + options.iframeClass + "'"
		+ " onload='window.parent.wym_instances[" + index + "].init(this)'"
		+ " ></iframe>";

	$(elem).hide().after(sHtml);

}

Wymeditor.prototype.init = function(iframe) {

	if(jQuery.browser.mozilla) {

		iframe.contentDocument.designMode="on";
		iframe.contentDocument.body.innerHTML=this.html;
		iframe.contentDocument.execCommand("styleWithCSS",'',false);

	}

	else if(jQuery.browser.msie || jQuery.browser.opera) {

		iframe.contentWindow.document.body.contentEditable=true;
		iframe.contentWindow.document.body.innerHTML=this.html;

	}

}

var wym_instances=new Array();
