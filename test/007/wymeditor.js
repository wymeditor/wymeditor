jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),options);
	});
};

function Wymeditor(elem,options) {

	$("p").click(function(){

		var edited=$(this);

		$(elem).html("<textarea class='wym_text'></textarea>");
		$(".wym_text").val($(this).html());

		$(".wym_text").keyup(function(e){
			$(edited).html($(this).val());
		});
	});
}
