/*jslint evil: true */
/**
    WYMeditor.bidi
    ====================

    A plugin to control the `dir` attribute of elements.

    By Shahar Or (mightyiampresence a-t gmail dotcom)
    Mostly hacked from Patabugen's wymeditor-plugins alignment.
*/

WYMeditor.editor.prototype.bidi = function () {
    "use strict";

    var wym, box, buttonLtr, buttonRtl, buttonRmDir, html;

    wym = this;
    box = jQuery(this._box);

    //Construct the buttons' html
    buttonLtr = [""
        , "<li class='wym_tools_direction_ltr'>"
        ,     "<a name='ltr' title='{Left_to_Right}' href='#'>"
        ,         "{ltr}"
        ,     "</a>"
        , "</li>"
    ].join('');
    buttonRtl = [""
        , "<li class='wym_tools_direction_rtl'>"
        ,     "<a name='rtl' title='{Right_to_Left}' href='#'>"
        ,         "{ltr}"
        ,     "</a>"
        , "</li>"
    ].join('');
    buttonRmDir = [""
        , "<li class='wym_tools_direction_remove'>"
        ,     "<a name='rmdir' title='{Default_Direction}' href='#'>"
        ,         "{ltr}"
        ,     "</a>"
        , "</li>"
    ].join('');

    html = buttonLtr + buttonRtl + buttonRmDir;

    //Translate
    html = wym.replaceStrings(html);

    //Add the buttons to the tools box
    box.find(wym._options.toolsSelector + wym._options.toolsListSelector)
        .append(html);

    box.find('li.wym_tools_direction_ltr a').click(function () {
        var container = wym.container();
        $(container).attr('dir', 'ltr');

        return false;
    });
    box.find('li.wym_tools_direction_rtl a').click(function () {
        var container = wym.container();
        $(container).attr('dir', 'rtl');
        return false;
    });
    box.find('li.wym_tools_direction_remove a').click(function () {
        var container = wym.container();
        $(container).removeAttr('dir');
        return false;
    });

};
