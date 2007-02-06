jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),options);
	});
};

function Wymeditor(elem,options) {

	$(".editable").click(function(){

		$(".wym_text").remove();

		var edited=$(this);
		$(edited).after("<textarea class='wym_text'></textarea>");

		var node = $(edited).get(0).childNodes;
		
		var html = GetMarkup($(edited).get(0));

		$(".wym_text").val(html);
		
	});
}

function GetMarkup(elem)
{
	id++;

	var nodes = elem.childNodes;
	var node = null;
	var markup = '';

	for(var x = 0; x<nodes.length; x++)
	{
		node=nodes.item(x);

		switch(node.nodeType)
		{
			case 1:
				markup += "[" + GetMarkup(node) + "]";
				break;

			case 3:
				markup += node.nodeValue;
				break;
		}
	}

	return(markup);
}

var id=-1;
