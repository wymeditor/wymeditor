/*jslint evil: true */
/**
    WYMeditor.bidi
    ====================

    A plugin to control the `dir` attribute of elements.

    By Shahar Or (mightyiampresence a-t gmail dotcom)
    Mostly hacked from https://bitbucket.org/Patabugen/wymeditor-plugins/src/01595ab6ef37/plugins/alignment?at=master
*/

WYMeditor.editor.prototype.bidi = function () {
    var wym = this,
        $box = jQuery(this._box);

    options = {

    }

    //construct the buttons' html
    var button_ltr = String() +
        "<li class='wym_tools_direction_ltr'>" +
            "<a name='DirectionLtr' href='#' " +
                "style='background-image: url(" +
                    wym._options.basePath +
                    "plugins/bidi/icons.png)'>" +
                "{ltr}" +
            "</a>" +
        "</li>";
    var button_rtl = String() +
        "<li class='wym_tools_direction_rtl'>" +
            "<a name='DirectionRtl' href='#' " +
                "style='background-image: url(" +
                    wym._options.basePath +
                    "plugins/bidi/icons.png); background-position: 0px -24px'>" +
                "{rtl}" +
            "</a>" +
        "</li>";
    var button_rmdir = String() +
        "<li class='wym_tools_direction_remove'>" +
            "<a name='DirectionRemove' href='#' " +
                "style='background-image: url(" +
                    wym._options.basePath +
                    "plugins/bidi/icons.png); background-position: 0px -48px'>" +
                "{rmdir}" +
            "</a>" +
        "</li>";

    var html = button_ltr + button_rtl + button_rmdir;
    //add the button to the tools box
    $box.find(wym._options.toolsSelector + wym._options.toolsListSelector)
        .append(html);

    $box.find('li.wym_tools_direction_ltr a').click(function() {
        var container = wym.container();
        $(container).attr('dir', 'ltr');

        return false;
    });
    $box.find('li.wym_tools_direction_rtl a').click(function() {
        var container = wym.container();
        $(container).attr('dir', 'rtl');
        return false;
    });
    $box.find('li.wym_tools_direction_remove a').click(function() {
        var container = wym.container();
        $(container).removeAttr('dir');
        return false;
    });
};
