jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),options);
	});
};

function Wymeditor(elem,options) {

	$(".editable > p").click(function(){

		$(".wym_text").remove();

		var edited=$(this);
		$(edited).after("<textarea class='wym_text'></textarea>");

		var nodes = $(edited).get(0).childNodes;
		var node = null;
		var html = '';

		for(var x = 0; x<nodes.length; x++)
		{
			node=nodes.item(x);

			switch(node.nodeType)
			{
				case 1:
					html+="[" + $(node).text() + "]";
					break;

				case 3:
					html+=node.nodeValue;
					break;
			}
		}

		$(".wym_text").val(html);
		
	});
}
