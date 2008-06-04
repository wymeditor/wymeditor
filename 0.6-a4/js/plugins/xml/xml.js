(function($) {

    var xml = function(editor) {
        $.extend(editor, {
            xml: this
        });
    };
    
    xml.prototype = {
        code: '',
        matchTag: true
    };
    
    xml.prototype.tag = function(tag, attrs, cdata, matchTag) {
        
        if (typeof(matchTag) != "undefined")
        {
            this.matchTag = matchTag;
        }
    
        this.code = '<' + tag + ' ';
        for (attr in attrs)
        {
            this.code += attr + '="' + attrs[attr] + '" ';
        }
        
        if (this.matchTag)
        {
            this.code += '>' + cdata + '</' + tag + '>';
        }
        else
        {
            this.code += '/>' + cdata;
        }
        return this;
    };
    
    xml.prototype.getCode = function() {
        return this.code;
    };
    
    $(WYMeditor).bind('AfterInit', function(e, editor) {
        new xml(editor);
    });
    
})(jQuery);