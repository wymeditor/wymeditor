Wymeditor.selection = (function ($) {
    var utils = Wymeditor.utils,
        savedSelection,
        self = {
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
        
        getCommonAncestors: function (container) {
            var ancestors = [],
                ranges = Wymeditor.selection.getRanges(container),
                range, 
                i;
            
            for (i = 0; range = ranges[i]; i++) {
                ancestors.push(range.commonAncestorContainer);
                range.detach();
            }
            return ancestors;
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
                        if (!node.length) {
                            range.detach();
                        }
                    }
                } while (node.length);
            }
            
            return ranges;
        },

        save: function () {
            self.clearSave();
            savedSelection = rangy.saveSelection();
        },
        
        restore: function () {
            rangy.restoreSelection(savedSelection, true);
        },
        
        clearSave: function () {
            rangy.removeMarkers(savedSelection);
        },

        detach: function (ranges) {
            for (var i = 0, range; range = ranges[i]; i++) { 
                range.detach();
            }
        }
    };
})(jQuery);
