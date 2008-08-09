// This script just demonstrates the ability to define buttons and behaviors externally
// in the experimental WYMeditor architecture. With this method, each button can be 
// a stand-alone plugin.


(function($) {

    var test = function(editor) {
        this.init(editor);
    };
    
    test.prototype = {
        toolBarIndex: 1,
        EditorInstance: 0,
        button: {
            WYMindex: 0,
            text: 'Plugin', 
            behaviors: {
                mouseover: function(e) {
                    // $('#log').html('Plugin for<br /> WYMeditor Instance ' + e.data.parent._index);
                },
                mouseout: function(e) {
                    // $('#log').html('');
                },
                click: function(e) {
                    e.preventDefault();
                    e.data.parent.sapi.cacheSelection();
                    $.get("html/paste.html", function(data) {
                        $.modal(data, {
                            close: true,
                            overlay: 75,
                            onShow: function(dialog) {
                                $(".wym_dialog .wym_cancel").bind('click', e.data, function(e) {
                                    e.preventDefault();
                                    $.modal.close();
                                    e.data.parent.sapi.restoreSelection();
                                });
                                $(".wym_dialog .wym_submit").bind('click', e.data, function(e) {
                                    e.preventDefault();
                                    var editor = e.data.parent;
                                    editor.sapi.restoreSelection();
                                    var text = $("#paste_text").val();
                                    if ($.trim(text) != "")
                                    {
                                        var lines = text.split("\n");
										for (var i=0; i<lines.length; i++)
										{
											lines[i] = '<p>' + lines[i] + '</p>';
										}
										$(editor.doc.body).append(lines.join("\n"));
                                    }
                                    editor.updateTextarea();
                                    $.modal.close();
                                });
                            }
                        });
                    });
                }
            }
        }
    };
    
    test.prototype.init = function(editor) {
        if (editor._index == this.EditorInstance)
        {
            editor.options.toolbars[this.toolBarIndex].buttons.push(this.button);
        }
    };

    $(WYMeditor).bind('AfterLoadConfig', function(e, editor) {
        new test(editor);
    });
    
})(jQuery);