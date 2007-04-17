/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *      http://www.wymeditor.org/
 *
 * File Name:
 *      default.css
 *      main javascript skin component for the default WYMeditor skin
 *      See the documentation for more info.
 *
 * File Authors:
 *      Daniel Reszka (d.reszka@wymeditor.org)
*/

$j(function() {

    //render folllowing sections as panels
        $j("div.wym_classes").addClass("wym_panel");

    //render folllowing sections as buttons
        $j("div.wym_tools").addClass("wym_buttons");

    //render folllowing sections as dropdown menus
        $j("div.wym_containers").addClass("wym_dropdown")
            .find("h2").append("<span>&nbsp;&gt;</span>");

    // auto add some margin to the main area sides if left area
    // or right area are not empty (if they contain sections)
        $j("div.wym_area_right ul")
            .parents("div.wym_area_right").show()
            .parents("div.wym_box")
            .find("div.wym_area_main")
            .css({"margin-right": "155px"});

        $j("div.wym_area_left ul")
            .parents("div.wym_area_left").show()
            .parents("div.wym_box")
            .find("div.wym_area_main")
            .css({"margin-left": "155px"});

    //make hover work under IE < 7
        $j(".wym_section").hover(function(){ 
            $j(this).addClass("hover"); 
        },function(){ 
            $j(this).removeClass("hover"); 
        });
});
