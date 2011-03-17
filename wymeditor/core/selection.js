Wymeditor.selection = (function () {
    var utils = Wymeditor.utils;
    
    return {
        selectNodeContents: function (node, collapse, start) {
            var range = rangy.createRange(),
                selection = rangy.getSelection();
            collapse = utils.is('Boolean', collapse) ? collapse : true;
            start = utils.is('Boolean', start) ? start : true;
            
            range.selectNodeContents(node);
            selection.setSingleRange(range);
            
            if (collapse && start) {
                selection.collapseToStart();
            } else if (collapse) {
                selection.collapseToEnd();
            }
            range.detach();
        },
        
        getCommonAncestor: function () {
            var selection = rangy.getSelection(),
                range = selection.getRangeAt(0),
                commonAncestorContainer = range.commonAncestorContainer;
            range.detach();
            return commonAncestorContainer;
        },
        
        insert: function () {},
        replace: function () {},
    
        wrap: function () {},
        unwrap: function () {}
    };
})();
