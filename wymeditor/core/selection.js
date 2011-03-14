Wymeditor.selection = (function () {
    var utils = WYMeditor.utils;
    
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
