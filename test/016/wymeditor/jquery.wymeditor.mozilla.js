function WymClassMozilla(wym) {

	this.wym = wym;

	var sIframeHtml = "<iframe "
			+ "src='wymeditor/wymiframe.html' "
			+ "onload='window.parent.aWYM_INSTANCES[" + this.wym.index + "].initIframe(this)' "
			+ "></iframe>";

	this.box = $j(this.wym.element).hide().after(this.wym.options.sBoxHtml).next();
	$j(this.box).html(sIframeHtml);
};

WymClassMozilla.prototype.initIframe = function(iframe) {

	this.iframe = iframe;
	this.doc = iframe.contentDocument;

	this.doc.title = this.wym.index;
	this.doc.designMode="on";
	this.doc.execCommand("styleWithCSS",'',false);

	$(this.doc.body).html(this.wym.html);
};
