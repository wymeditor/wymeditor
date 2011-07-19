/**
    WYMeditor.rangy
    ===============

    Rangy cross-browser selection manipulation support for WYMeditor.
*/

(function($) {
    if (!WYMeditor || !rangy) {
        // If we don't have WYMeditor or rangy, we don't have much of a plugin
        return;
    }
    /**
        WYMeditor.editor.selection
        ==========================

        Override the default selection function to use rangy.
    */
    WYMeditor.editor.prototype.selection = function() {
        if (window.rangy && !rangy.initialized) {
            rangy.init();
        }

        var iframe = this._iframe;
        var sel = rangy.getIframeSelection(iframe);

        return sel;
    };

    /**
        WYMeditor.editor.selection
        ==========================

        Return the selected node.
    */
    WYMeditor.editor.prototype.selected = function() {
        var sel = this.selection();
        var node = sel.focusNode;

        if (node) {
            if (node.nodeName == "#text") {
                return node.parentNode;
            } else {
                return node;
            }
        } else {
            return null;
        }
    };

    /**
        WYMeditor.editor.selection_collapsed
        ====================================

        Return true if all selections are collapsed, false otherwise.
    */
    WYMeditor.editor.prototype.selection_collapsed = function() {
        var sel = this.selection();
        var collapsed = false;

        $.each(sel.getAllRanges(), function() {
            if (this.collapsed) {
                collapsed = true;
                //break
                return false;
            }
        });

        return collapsed;
    };

    /**
        WYMeditor.editor.selected_contains
        ==================================

        Return an array of nodes that match a jQuery selector
        within the current selection.
    */
    WYMeditor.editor.prototype.selected_contains = function(selector) {
        var sel = this.selection();
        var matches = [];

        $.each(sel.getAllRanges(), function() {
            $.each(this.getNodes(), function() {
                if ($(this).is(selector)) {
                    matches.push(this);
                }
            });
        });

        return matches;
    };

    /**
        WYMeditor.editor.selected_parents_contains
        ==================================

        Return an array of nodes that match the selector within
        the selection's parents.
    */
    WYMeditor.editor.prototype.selected_parents_contains = function(selector) {
        var $matches = $([]);
        var $selected = $(this.selected());
        if ($selected.is(selector)) {
            $matches = $matches.add($selected);
        }
        $matches = $matches.add($selected.parents(selector));
        return $matches;
    };
})(jQuery);
