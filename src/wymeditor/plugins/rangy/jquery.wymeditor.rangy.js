/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2010 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.rangy.js
 *        Add rangy support.
 *
 * File Authors:
 *        Samuel Cole <sam@samuelcole.name>
 */

(function($) {
    if (WYMeditor && rangy) {
      /* @name selection
       * @description Returns a rangy selection node
       */
      WYMeditor.editor.prototype.selection = function() {
        if(window.rangy && !rangy.initialized) rangy.init();

        var iframe = this._iframe;
        var win = (iframe.contentDocument && iframe.contentDocument.defaultView) ?
          iframe.contentDocument.defaultView : iframe.contentWindow;
        var sel = rangy.getSelection(win);

        return(sel);
      };

      /* @name selected
       * @description Returns the selected node
       */
      WYMeditor.editor.prototype.selected = function() {
        var sel = this.selection();
        var node = sel.focusNode;

        if(node) {
            if(node.nodeName == "#text") return(node.parentNode);
            else return(node);
        } else return(null);
      };

      /* @name selection_collapsed
       * @description Returns true/false if all selections are collapsed
       */
      WYMeditor.editor.prototype.selection_collapsed = function() {
        var sel = this.selection();
        var collapsed = false;
        
        $.each(sel.getAllRanges(), function() {
          if(this.collapsed) {
            collapsed = true;
            //break
            return false;
          }
        });

        return(collapsed);
      };
      
      /* @name selected_contains
       * @description Returns an array of nodes that match a jQuery selector
       * within the current selection.
       */
      WYMeditor.editor.prototype.selected_contains = function(selector) {
        var sel = this.selection();
        var matches = [];
        
        $.each(sel.getAllRanges(), function() {
          $.each(this.getNodes(), function() {
            if($(this).is(selector)) {
              matches.push(this);
            }
          });
        });

        return(matches);
      };

      /* @name selected_parents_contains
       * @description Returns an array of nodes that match the selector within
       * the selection's parents.
       */
      WYMeditor.editor.prototype.selected_parents_contains = function(selector) {
        var $matches = $([]);
        var $selected = $(this.selected());
        if($selected.is(selector)) $matches = $matches.add($selected);
        $matches = $matches.add($selected.parents(selector));
        return($matches);
      };

    }
})(jQuery);
