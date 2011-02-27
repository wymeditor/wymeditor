Wymeditor.core.selection = (function () {
    return {
        selectNodeContents: function (node, collapse, start) {
            var range = rangy.createRange(),
                selection = rangy.getSelection();
            collapse = typeof collapse === 'boolean' ? collapse : true;
            start = typeof start === 'boolean' ? start : true;
            
            range.selectNodeContents(node);
            selection.setSingleRange(range);
            
            if (collapse && start) {
                selection.collapseToStart();
            } else if (collapse) {
                selection.collapseToEnd();
            }
        },
        
        getCommonAncestor: function () {
            var selection = rangy.getSelection();
            return commonAncestorContainer;
        },
        
        insert: function () {},
        replace: function () {},
    
        wrap: function () {},
        unwrap: function () {}
    };
})();
