Wymeditor.selection = (function ($) {
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
        
        getRanges: function (container) {
            var selection = rangy.getSelection(),
                allRanges = selection.getAllRanges(),
                ranges = [],
                range,
                node,
                i;
            
            container = $(container);
            
            if (!container.length) {
                return [];
            }
            
            // Add all ranges inside container
            for (i = 0; range = allRanges[i]; i++) {
                node = $(range.commonAncestorContainer);
                
                do {
                    if (node[0] === container[0]) {
                        ranges.push(range);
                        break;
                    } else {
                        node = node.parent();
                    }
                } while (node.length);
            }
            
            return ranges;
        }
    };
})(jQuery);
