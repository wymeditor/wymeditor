jQuery.fn.selectify = function() {
    var $elements = this;
    return $elements.each(function() {
        var element = this;
        jQuery(element).hover(
            function() {
                var element = this;
                jQuery("h2", element).css("background-position", "0px -18px");
                jQuery("ul", element).fadeIn("fast");
            },
            function() {
                var element = this;
                jQuery("h2", element).css("background-position", "");
                jQuery("ul", element).fadeOut("fast");
            }
        );
    });
};

WYMeditor.SKINS.minimal = {
    //placeholder for the skin JS, if needed

    //init the skin
    //wym is the WYMeditor.editor instance
    init: function(wym) {

        //render following sections as dropdown menus
        jQuery(wym._box).find(wym._options.toolsSelector + ', ' + wym._options.containersSelector + ', ' + wym._options.classesSelector)
          .addClass("wym_dropdown")
          .selectify();


    }
};
