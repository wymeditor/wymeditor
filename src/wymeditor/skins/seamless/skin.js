WYMeditor.SKINS.seamless = {
    init: function (wym) {
        // The classes and containers sections are dropdowns to the right of
        // the toolbar at the top
        jQuery(
            wym._options.containersSelector + ', ' +
            wym._options.classesSelector,
            wym._box
        ).appendTo(
            jQuery("div.wym_area_top", wym._box)
        ).addClass("wym_dropdown")
          .css(
            {
                "margin-right": "10px",
                "width": "120px",
                "float": "left"
            }
          );

        // The toolbar uses buttons
        jQuery(wym._options.toolsSelector, wym._box)
          .addClass("wym_buttons")
          .css({"margin-right": "10px", "float": "left"});
    }
};
