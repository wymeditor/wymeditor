// With the new architecture, even the code that builds the toolbars is a plugin.
// The idea is to keep the WYMeditor core as lightweight and flexible as possible and to 
// add even the base functionality using the Plugin API. I would suggest that the CSS Parser, 
// SAPI and XHTML Parser be attached via the Plugin API as well. One of the major benefits of 
// this approach is that it will be possible to upgrade, even completely rewrite, a portion 
// of the code without needing to replace the entire package.
//
// Additionally, with this architecture, just about /any/ JavaScript code can easily be 
// converted to a WYMeditor plugin. I think this would greatly enhance its appeal.

(function($) {

    var toolbar = function(editor) {
        this.parent = editor;
        $.extend(editor, {
            toolbar: this.init(editor.elem, editor.options.toolbars)
        });
    };
    
    toolbar.prototype = {
        toolbarHtml : '<ul class="toolbar"></ul>',
        buttonHtml  : '<li><a href="#"><span class="text"></span></a></li>'
    };
    
    toolbar.prototype.init = function(anchor, toolbars) {
        for (var i=0; i<toolbars.length; i++)
        {
            var toolbar = $(this.toolbarHtml).insertBefore(anchor);
            var tbConfig  = toolbars[i];
            if (tbConfig.css) $(toolbar).addClass(tbConfig.css);
            for (var j=0; j<tbConfig.buttons.length; j++)
            {
                this.button(toolbar, tbConfig.buttons[j]);
            }
        }
    };
    
    toolbar.prototype.button = function(elem, btnConfig) {
        var button = $(this.buttonHtml).appendTo(elem);
        if (btnConfig.css) $(button).addClass(btnConfig.text);
        $("span", button).append(btnConfig.text);
        if (btnConfig.hidetext === false)
        {
            $("span", button).removeClass('hide');
        }
        this.behavior(button, btnConfig.behaviors);
    };
    
    toolbar.prototype.behavior = function (button, behaviors) {
        var _this = this;
        for (var event in behaviors)
        {
            $(button).bind(event, _this, behaviors[event]); 
        }
    }
    
    $(WYMeditor).bind('BeforeBuild', function(e, editor) {
        new toolbar(editor);
    });
    
})(jQuery);
