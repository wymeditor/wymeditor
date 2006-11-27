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

	html = "<iframe class='" + options.iframeClass + "'"
		+ " onload='window.parent.init(this," + index + ")'"
		+ "></iframe>";

	$(elem).hide().after(html);

	this.init = function() {

	}

}

function init(iframe,i)
{
	if(jQuery.browser.mozilla) {

		iframe.contentDocument.designMode="on";
		iframe.contentDocument.body.innerHTML=wym_instances[i].html;
		iframe.contentDocument.execCommand("styleWithCSS",'',false);

	}

	else if(jQuery.browser.msie || jQuery.browser.opera) {

		iframe.contentWindow.document.body.contentEditable=true;
		iframe.contentWindow.document.body.innerHTML=wym_instances[i].html;

	}
}

var wym_instances=new Array();
