function init(iframe,i)
{
	if(jQuery.browser.mozilla) {

		iframe.contentDocument.designMode="on";
		iframe.contentDocument.body.innerHTML=i;
		iframe.contentDocument.execCommand("styleWithCSS",'',false);

	}

	else if(jQuery.browser.msie || jQuery.browser.opera) iframe.contentWindow.document.body.innerHTML=i;
}

jQuery.fn.wymeditor = function() {

	return this.each(function(i) {
		
		html = "<iframe class='wym_iframe'"
		+ " contentEditable='true'"
		+ " onload='window.parent.init(this," + i + ")'"
		+ "></iframe>";

		$(this).hide().after(html);
	
	});
};
