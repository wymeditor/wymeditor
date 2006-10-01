var wymeditor_content;

function wymeditor_execCom(elem,cmd,opt)
{
	var div_editor=$(elem).ancestors("div.wymeditor");
	var iframe=$(div_editor).find("iframe.wymeditor_iframe").get(0);
	iframe.contentDocument.execCommand(cmd,'',opt);
}

function wymeditor_submit(elem)
{
	var div_editor=$(elem).ancestors("div.wymeditor");
	var iframe=$(div_editor).find("iframe.wymeditor_iframe").get(0);
	var wymeditor_area=$(div_editor).prev();
	
	$(wymeditor_area).val(iframe.contentDocument.body.innerHTML);
	$(wymeditor_area).show();
}

$(document).ready(function() {

	//hide textareas
	var wymeditor_area=$("textarea.wymeditor");
	$(wymeditor_area).hide();
	
	//create wymeditor instance(s)
	$(wymeditor_area).each(function(){
	
		var div_editor=document.createElement("div");
		$(this).after(div_editor);
		div_editor.setAttribute("class","wymeditor");
		$("div.wymeditor").load("wymeditor/wymeditor.html");
	
		wymeditor_content=$(this).val();
	
	});
	

});
