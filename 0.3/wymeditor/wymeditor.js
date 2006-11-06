/* WYMeditor - http://www.wymeditor.org/ */

//Wymeditor object
function Wymeditor(elem,index,opt) {

	var options = {
  		htmlToInsert:		"<div class='wymeditor'></div>",
  		pageToLoad:		"wymeditor/wymeditor.html",
		iframeClass:		".wym_iframe",
		dialogClass:		".wym_dialog",
		buttonClass:		".wym_bt",
		inputClass:		".wym_in"
	}

	if(opt)options=opt;

	var _html=null;
	var _editor=null;
	var _iframe=null;
	var _wymeditor=this;

	this.version = "0.3-alpha-003";
	this.element = elem;
	this.index = index;

	this.init = function() {

		this.html(elem.val());
		elem.hide();
		elem.after(options.htmlToInsert);
		wym_instances[index]=this;
		
		var div_editor=elem.next();
		this.editor(div_editor);
		this.element=elem;

		$(div_editor).load(options.pageToLoad,null,function() {

			var iframe=$(div_editor).find(options.iframeClass).get(0);
			var elem=$(div_editor).prev();
			var wymeditor=_wymeditor;
			
			wymeditor.iframe(iframe);

			//hide dialogs
			$(div_editor).find(options.dialogClass).hide();

			//set buttons click events
			$(div_editor).find(options.buttonClass+"_exec").click(function() {

				wymeditor.execCommand($(this).name(),null);
			});

			//set dialog buttons click events (link, image, table, ...)
			$(div_editor).find(options.buttonClass+"_dialog").click(function() {

				var name=$(this).name().toLowerCase();
				var dialog=$(div_editor).find(options.dialogClass + "_" + name);

				switch(name) {
					case "link":

						var in_url=$(dialog).find(options.inputClass + "_url");
						var in_title=$(dialog).find(options.inputClass + "_title");
						var container=wymeditor.selectedContainer();
				
						$(in_url).val($(container).href());
						$(in_title).val($(container).title());
						
					break;
				}

				$(dialog).show();

			});

			//set cancel button click event
			$(div_editor).find(options.buttonClass + "_cancel").click(function() {

				$(div_editor).find(options.inputClass).val("");
				$(div_editor).find(options.dialogClass).hide();
				
			});

			//set link button click event
			$(div_editor).find(options.buttonClass + "_link").click(function() {

				var dialog=$(div_editor).find(options.dialogClass + "_link");
				var in_url=$(dialog).find(options.inputClass + "_url");
				var in_title=$(dialog).find(options.inputClass + "_title");

				wymeditor.execCommand("CreateLink",$(in_url).val());

				var container=wymeditor.selectedContainer();
				$(container).title(in_title.val());

				$(div_editor).find(options.inputClass).val("");
				$(div_editor).find(options.dialogClass).hide();
				
			});

			//set toggle html button click event
			$(div_editor).find(options.buttonClass+"_toggle").toggle(function() {

				var html=wymeditor.iframeHtml(iframe);
				wymeditor.html(html)
				$(elem).val(html);

				$(elem).toggle();

			},function() {

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
		else if(jQuery.browser.msie || jQuery.browser.opera) iframe.contentWindow.document.body.innerHTML=s;
	}
	else {
		var html="";
		if(jQuery.browser.mozilla) html=iframe.contentDocument.body.innerHTML;
		else if(jQuery.browser.msie || jQuery.browser.opera) html=iframe.contentWindow.document.body.innerHTML;
		return(html);
	}
}

//Exec command (bold,italic,...)
Wymeditor.prototype.execCommand = function(cmd,opt) {
	if(jQuery.browser.mozilla) this.iframe().contentDocument.execCommand(cmd,'',opt);
	else if(jQuery.browser.msie || jQuery.browser.opera) this.iframe().contentWindow.document.execCommand(cmd,false,opt);
}

//Set or Get editor property
Wymeditor.prototype.editor = function(o) {
	if(o)this._editor=o;
	else return(this._editor);
}

//Set or Get iframe property
Wymeditor.prototype.iframe = function(o) {
	if(o)this._iframe=o;
	else return(this._iframe);
}

Wymeditor.prototype.selectedContainer = function() {
	if(selectedElement==null)
	{
		if(jQuery.browser.msie || jQuery.browser.opera)
		{
			var caretPos=this.caretPos;
    			if(caretPos!=null)
    			{
    				if(caretPos.parentElement!=undefined)return(caretPos.parentElement());
    			}
    		}
    		else if(jQuery.browser.mozilla)
    		{
			var sel=this.iframe().contentWindow.getSelection();
			var node=sel.focusNode;
			if(node.nodeName=="#text")return(node.parentNode);
			else return(node);
    		}
    	}
	else return(selectedElement);
}


//Little hack to set iframe(s) content
var wym_instances=new Array();
var wym_counter=-1;
var selectedElement=null;

function wym_instance()
{
	wym_counter++;
	return(wym_instances[wym_counter]);
}
