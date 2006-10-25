/* WYMeditor - http://www.wymeditor.org/ */

var wymeditor_content=new Array();
var wymeditor_counter=-1;

function wymeditor_iframeGetContent()
{
	wymeditor_counter++;
	return(wymeditor_content[wymeditor_counter]);
}

function wymeditor_execCom(elem,cmd,opt)
{
	var div_editor=$(elem).ancestors("div.wymeditor");
	var iframe=$(div_editor).find("iframe.wymeditor_iframe").get(0);
	if(jQuery.browser.mozilla) iframe.contentDocument.execCommand(cmd,'',opt);
	else if(jQuery.browser.msie) iframe.contentWindow.document.execCommand(cmd);
}

function wymeditor_submit(elem)
{
	var div_editor=$(elem).ancestors("div.wymeditor");
	var iframe=$(div_editor).find("iframe.wymeditor_iframe").get(0);
	var wymeditor_area=$(div_editor).prev();
	
	if(jQuery.browser.mozilla) $(wymeditor_area).val(iframe.contentDocument.body.innerHTML);
	else if(jQuery.browser.msie) $(wymeditor_area).val(iframe.contentWindow.document.body.innerHTML);
	
	$(wymeditor_area).show();
}

$(document).ready(function() {

	//hide textareas
	var wymeditor_area=$("textarea.wymeditor");
	$(wymeditor_area).hide();
	
	//create wymeditor instance(s)
	$(wymeditor_area).each(function(i){
	
		$(this).after("<div class='wymeditor'></div>");
		wymeditor_content[i]=$(this).val();
		
		var div_editor=$(this).next();
		$(div_editor).load("wymeditor/wymeditor.html");
	
	});
});
