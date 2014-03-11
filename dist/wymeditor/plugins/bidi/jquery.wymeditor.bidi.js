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

    //construct the buttons' html
    buttonLtr = [""
        , "<li class='wym_tools_direction_ltr'>"
        ,     "<a name='ltr' title='Left to Right' href='#'"
        ,     " style='background-image: url("
        ,     wym._options.basePath
        ,     "plugins/bidi/icons.png);'>"
        ,         "{ltr}"
        ,     "</a>"
        , "</li>"
    ].join('');
    buttonRtl = [""
        , "<li class='wym_tools_direction_rtl'>"
        ,     "<a name='rtl' title='Right to Left' href='#'"
        ,         " style='background-image: url("
        ,         wym._options.basePath
        ,         "plugins/bidi/icons.png);"
        ,         " background-position: 0px -24px;'>"
        ,         "{ltr}"
        ,     "</a>"
        , "</li>"
    ].join('');
    buttonRmDir = [""
        , "<li class='wym_tools_direction_remove'>"
        ,     "<a name='rmdir' title='Default Direction' href='#'"
        ,         " style='background-image: url("
        ,         wym._options.basePath
        ,         "plugins/bidi/icons.png);"
        ,         " background-position: 0px -48px;'>"
        ,         "{ltr}"
        ,     "</a>"
        , "</li>"
    ].join('');

    html = buttonLtr + buttonRtl + buttonRmDir;

    //add the button to the tools box
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
