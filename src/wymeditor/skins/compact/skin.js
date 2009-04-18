WYMeditor.SKINS['compact'] = {

    init: function(wym) {
    
        //move the containers panel to the top area
        jQuery(wym._box).find(wym._options.containersSelector + ', '
          + wym._options.classesSelector)
          .appendTo("div.wym_area_top")
          .addClass("wym_dropdown")
          .css({"margin-right": "10px", "width": "120px", "float": "left"});

        //render following sections as buttons
        jQuery(wym._box).find(wym._options.toolsSelector)
          .addClass("wym_buttons")
          .css({"margin-right": "10px", "float": "left"});

        //make hover work under IE < 7
        jQuery(wym._box).find(".wym_section").hover(function(){
          jQuery(this).addClass("hover");
        },function(){
          jQuery(this).removeClass("hover");
        });

        var postInit = wym._options.postInit;
        wym._options.postInit = function(wym) {

            if(postInit) postInit.call(wym, wym);
            var rule = {
                name: 'body',
                css: 'background-color: #f0f0f0;'
            };
            wym.addCssRule( wym._doc.styleSheets[0], rule);
        };
    }
};
