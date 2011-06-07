/*
 * Desktop skin for WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2011  Calvin Schwenzfeier
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * File Authors:
 *      Calvin Schwenzfeier (calvin DOT schwenzfeier A~T gmail dotCOM)
 */

WYMeditor.SKINS['desktop'] = {
    init: function(wym) {
        // render following sections as panels
        jQuery(wym._box).find(wym._options.classesSelector)
          .addClass("wym_panel");

        // render following sections as buttons
        jQuery(wym._box).find(wym._options.toolsSelector)
          .addClass("wym_buttons");

        // render following sections as dropdown menus
        jQuery(wym._box).find(wym._options.containersSelector)
          .addClass("wym_dropdown")
          .find(WYMeditor.H2)
          .append("<span> ></span>");

        // auto add some margin to the main area sides if left area
        // or right area are not empty (if they contain sections)
        jQuery(wym._box).find("div.wym_area_right ul")
          .parents("div.wym_area_right").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-right": "155px"});

        jQuery(wym._box).find("div.wym_area_left ul")
          .parents("div.wym_area_left").show()
          .parents(wym._options.boxSelector)
          .find("div.wym_area_main")
          .css({"margin-left": "155px"});

        // add Desktop logo after WYMeditor logo
        jQuery(wym._box).find("div.wym_area_bottom a")
          .first()
          .after( "<a class='wym_desktop_link' " +
                  "href='http://https://github.com/cschwenz/wymeditor'>" +
                  "Desktop</a>" );

        // make hover work under IE < 7
        jQuery(wym._box).find(".wym_section").hover(function(){
          jQuery(this).addClass("hover");
        },
        function(){
          jQuery(this).removeClass("hover");
        });
    }
};

