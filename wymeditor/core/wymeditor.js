(function($, window, undefined){
    window.Wymeditor = {
        version: "2.0a1",
        
        ELEMENT_NODE: 1,
        TEXT_NODE: 3,
        COMMENT_NODE: 8,

        PARSER_ELEMENT_NODE: 'tag',
        PARSER_TEXT_NODE: 'text',
        PARSER_COMMENT_NODE: 'comment',
        
        ns: function(name, container) {
            var ns = name.split('.'),
                o = container || this,
                i, l;
            for(i = 0, l = ns.length; i < l; i++){
                o = o[ns[i]] = o[ns[i]] || {};
            }
            return o;
        }
    };
})(jQuery, window);