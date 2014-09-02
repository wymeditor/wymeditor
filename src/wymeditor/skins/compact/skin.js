/* globals -$ */
"use strict";

WYMeditor.SKINS.compact = {
    init: function(wym) {
        // Move the containers panel to the top area
        jQuery(wym._options.containersSelector + ', ' +
            wym._options.classesSelector, wym._box)
          .appendTo( jQuery("div.wym_area_top", wym._box) )
          .addClass("wym_dropdown")
          .css({"margin-right": "10px", "width": "120px", "float": "left"});

        // Render following sections as buttons
        jQuery(wym._options.toolsSelector, wym._box)
          .addClass("wym_buttons")
          .css({"margin-right": "10px", "float": "left"});

        // Make hover work under IE < 7
        jQuery(".wym_section", wym._box).hover(function(){
          jQuery(this).addClass("hover");
        },function(){
          jQuery(this).removeClass("hover");
        });

        var postInit = wym._options.postInit;
        wym._options.postInit = function(wym) {
            if (postInit) {
                postInit.call(wym, wym);
            }

            wym.$body().css('background-color', '#f0f0f0');
        };
    }
};
