jQuery.fn.wymeditor = function(options) {

	options = jQuery.extend({

	}, options);

	return this.each(function(i) {

		new Wymeditor($(this),options);
	});
};

function Wymeditor(elem,options) {

	var wymeditor=this;
	this.html=$(elem).html();

	$(elem).click(function(){

		$(".wym_box").remove();

		var shtml="<div class='wym_box'>"
			+"<textarea class='wym_text'>"
			+ wymeditor.html
			+ "</textarea>"
			+ "<p class='wym_message'>Press 'return' to close the box.</p>"
			+ "<textarea class='wym_html'></textarea>"
			+ "</div>";
		$(elem).after(shtml);

		$(".wym_text").get(0).focus();

		$(".wym_text").keyup(function(e){
			if(e.keyCode==13 && !e.shiftKey){
				$(elem).after("<p></p>");
				$(".wym_box").remove();
			}
			else {
				$(elem).html($(this).val());
				wymeditor.html=$(elem).html();
				$(".wym_html").val($("body").html());
			}
		});
	});
}
