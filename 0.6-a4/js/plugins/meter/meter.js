// This script is a real-world example of a WYMeditor plugin that makes use of the Observer Pattern 
// used in the new WYMeditor architecture.

(function($) {
    $(WYMeditor).bind('Start', function(e, editor) {
        editor.startTime = new Date();
        editor.currentTime = editor.startTime;
        var id = "p" + editor._index;
        $("#performance").append(
            '<p><strong>WYMeditor Instance ' + 
            editor._index + '</strong></p>'
        );
        $("#performance").append('<ul id="' + id + '"></ul>');
        $("#"+id).append(
            '<li>Start : ' + 
            (new Date() - editor.currentTime) + ' ms</li>'
        );
    });
    
    $(WYMeditor).bind('BeforeLoadConfig', function(e, editor) {
        var id = "#p" + editor._index;
        $(id).append(
            '<li>BeforeLoadConfig : ' + 
            (new Date() - editor.currentTime) + ' ms</li>'
        );
        editor.currentTime = new Date();
    });

    $(WYMeditor).bind('AfterLoadConfig', function(e, editor) {
        var id = "#p" + editor._index;
        $(id).append(
            '<li>AfterLoadConfig : ' + 
            (new Date() - editor.currentTime) + ' ms</li>'
        );
        editor.currentTime = new Date();
    });

    $(WYMeditor).bind('BeforeBuild', function(e, editor) {
        var id = "#p" + editor._index;
        $(id).append(
            '<li>BeforeBuild : ' + 
            (new Date() - editor.currentTime) + ' ms</li>'
        );
        editor.currentTime = new Date();
    });

    $(WYMeditor).bind('BeforeInit', function(e, editor) {
        var id = "#p" + editor._index;
        $(id).append(
            '<li>BeforeInit : ' + 
            (new Date() - editor.currentTime) + ' ms</li>'
        );
        editor.currentTime = new Date();
    });

    $(WYMeditor).bind('AfterInit', function(e, editor) {
        editor.endTime = new Date();
        var id = "#p" + editor._index;
        $(id).append(
            '<li>Load Time Instance ' + editor._index + ': ' + 
            (editor.endTime - editor.startTime) + ' ms</li>'
        );
    });
})(jQuery);