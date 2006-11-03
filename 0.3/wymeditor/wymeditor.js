/* WYMeditor - http://www.wymeditor.org/ */

//Wymeditor object
function Wymeditor(elem,index,options) {

	var _html=null;
	var _editor=null;
	var _wymeditor=this;

	this.version = "0.3-alpha-002";
	this.element = elem;

	this.init = function() {

		this.html(elem.val());
		elem.hide();
		elem.after(options.htmlToInsert);
		wym_instances[index]=this;
		
		var div_editor=elem.next();
		this.editor(div_editor);
		this.element=elem;

		$(div_editor).load(options.pageToLoad,null,function(){

			var iframe=$(div_editor).find(options.iframeClass).get(0);
			var elem=$(div_editor).prev();
			var wymeditor=_wymeditor;

			$(div_editor).find(options.execClass).click(function(){

				wymeditor.execCommand(iframe,$(this).name());
			});

			$(div_editor).find(options.toggleClass).toggle(function(){

				var html=wymeditor.iframeHtml(iframe);
				wymeditor.html(html)
				$(elem).val(html);

				$(elem).toggle();

				},function(){

				var html=$(elem).val();
				wymeditor.html(html);
				wymeditor.iframeHtml(iframe,html);

				$(elem).toggle();
			});
		});
	}

	this.init();
}

//Set or Get html property
Wymeditor.prototype.html = function(s) {
	if(s)this._html=s;
	else return(this._html);
}

//Set or Get iframe innerHTML
Wymeditor.prototype.iframeHtml = function(iframe,s) {
	if(s) {
		if(jQuery.browser.mozilla) iframe.contentDocument.body.innerHTML=s;
		else if(jQuery.browser.msie) iframe.contentWindow.document.body.innerHTML=s;
	}
	else {
		var html="";
		if(jQuery.browser.mozilla) html=iframe.contentDocument.body.innerHTML;
		else if(jQuery.browser.msie) html=iframe.contentWindow.document.body.innerHTML;
		return(html);
	}
}

//Exec command (bold,italic,...)
Wymeditor.prototype.execCommand = function(iframe,cmd) {
	if(jQuery.browser.mozilla) iframe.contentDocument.execCommand(cmd,'',null);
	else if(jQuery.browser.msie) iframe.contentWindow.document.execCommand(cmd);
}

//Set or Get editor property
Wymeditor.prototype.editor = function(o) {
	if(o)this._editor=o;
	else return(this._editor);
}

//Little hack to set iframe(s) content
var wym_instances=new Array();
var wym_counter=-1;

function wym_instance()
{
	wym_counter++;
	return(wym_instances[wym_counter]);
}
