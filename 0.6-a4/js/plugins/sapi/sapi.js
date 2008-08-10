// jQuery Selection API (SAPI)

Array.prototype.has = function(needle) {
    return $.inArray(needle, this) != -1;
};

(function($) {

    var sapi = function(editor) {
        $.extend(editor, {
	        sapi: this.init(editor)
	    });
    };
    
    sapi.prototype = {
    
        parent: null,
    
        // We will need to detect the keyboard event 
        // so we can make decisions based on what the user did.
        // e.g., mouseclick, dblclick, delete key, etc.
    
        keyBoardEvent: null,
        
        // Should keyboard event detection be a separate plugin?
        // modifierKeys will be an array of the modifier keys (e.g., alt, control, shift) 
        // that were pressed at the time of the current keyboard event
        
        modifierKeys: [],
        
        // hasModifierKey is the interface to detect if a specific modifier key 
        // was down at the time of the current keyboard event
        
        hasModifierKey: function (whichModifier) {
            return this.modifierKeys.has(whichModifier);
        },
    
        blocks: [
            'DIV', 'P', 'LI', 'UL', 'OL', 
            'PRE', 'H1', 'H2', 'H3', 'H4', 
            'H5', 'H6', 'BLOCKQUOTE'
        ],
        
        // Cache for SAPI-sepecific data
        
        cache: {},
        
        // Triggers is an array of UI events to listen for
        
        triggers: ['mouseup', 'keyup'],
        
        // An array of the nodes in the current selection
        
        nodes: [],
        
        // properties
    
        // the original DOM Selection object
        // (http://developer.mozilla.org/en/docs/DOM:Selection)
        
        original: null,
    
        // the node the selection starts. "start" is the most left position of the
        // selection, not where the user started to select (the user couls also
        // select from right to left)
        
        startNode: null,
        
        // the node the selection ends
        
        endNode: null,
    
        // the offset the cursor/beginning of the selection has 
        // to it's parent nodenode
        
        startOffset: null,
    
        // the offset the cursor/end of the selection has to 
        // it's parent nodenode
        
        endOffset: null,
        
        // The outermost element containing all 
        // elements in the selection range
        
        commonAncestor: null,
    
        // whether the selection is collapsed ot not
        
        isCollapsed: null,
    
        // That one don't need to be implemented at the moment. It's diffcult as
        // one need to define what length is in this context. Is it the number of
        // selected characters? Or the number of nodes? I'd say it's the number of
        // selected characters of the normalized (no whitespaces at end or beginning,
        // multiple inner whitepsaces collapsed to a single one) selected text.
        
        length: null,
        
        target: null,
    
        // methods
        
        selection: function() {
            if (this.target.getSelection)
            {
                return this.target.getSelection();
            }
            else if (this.target.document.selection && 
                 this.target.document.selection.type == "Text")
            {
                return this.target.document.selection && 
                    this.target.document.selection.type == "Text"
            }
        },
    
        // Returns true if selection starts at the beginning of a (nested) tag
        // @param String jqexpr The container the check should be performed in
        // @example element = <p><b>|here</b></p>, element.isAtStart("p") would
        // return true
        
        isAtStart: function(jqexpr) {
        
        },
    
        // Returns true if selection ends at the end of a (nested) tag
        // @param String jqexpr The container the check should be performed in
        // @example element = <p><b>here|</b></p>, element.isAtEnd("p") would
        // return true
        
        isAtEnd: function(jqexpr) {
        
        },
    
        // set the cursor to the first character (it can be nested),
        // @param String jqexpr The cursor will be set to the first character
        //     of this element
        // @example elements = <p><b>test</b></p>, element.cursorToStart("p")
        //     will set the cursor in front of test: <p><b>|test</b></p>
        
        cursorToStart: function(jqexpr) {
            if (this.original.collapseToStart)
            {
                this.original.collapseToStart();
            }
        },
    
        // set the cursor to the last character (it can be nested),
        // @param String jqexpr The cursor will be set to the last character
        //     of this element
        // @example elements = <p><b>test</b></p>, element.cursorToEnd("p")
        //     will set the cursor behind test: <p><b>test|</b></p>
        
        cursorToEnd: function(jqexpr) {
            if (this.original.collapseToEnd)
            {
                this.original.collapseToEnd();
            }
        },
     
        // removes the current selection from document tree if the cursor isn't
        // collapsed.
        // NOTE Use the native function from DOM Selection API:
        // http://developer.mozilla.org/en/docs/DOM:Selection:deleteFromDocument
        // NOTE First I had also "deleteFromDocument()" in the Selection API, but
        // it isn't needed as a "sel.deleteIfExpanded()" would do exactly the same
        // as "sel.deleteFromDocument()" with the only difference that this one
        // has a return value
        // @returns true:  if selection was expanded and therefore deleted
        //          false: if selection was already collapsed
        // @example // do what delete key normally does
        //          if (!sel.isCollapsed)
        //          {
        //              sel.original.deleteFromDocument();
        //              return true;
        //          }
        //          will be now:
        //          if (sel.deleteIfExpanded())
        //              return true;
        
        deleteIfExpanded: function() {
            if (!this.isCollapsed)
            {
                // If the selection is not collapsed,
                // we must decide if the selection contains the full 
                // content of the commonAncestor block. If it does, 
                // we delete all elements in the commonAncestor. 
                // If not, we delete only the elements within 
                // the selection range.
            }
        }
    };
    
    sapi.prototype.init = function(parent) {
        this.parent = parent;
        this.target = parent.iframe.contentWindow;
        this.listen();
        return this;
    };
    
    sapi.prototype.update = function() {
        this.original       = this.selection();
        this.startNode      = this.anchorBlock();
        this.endNode        = this.focusBlock();
        this.startOffset    = this.getStartOffset();
        this.endOffset      = this.getEndOffset();
        this.isCollapsed    = this.getIsCollapsed();
        this.nodes          = this.getNodesInSelection();
        this.keyBoardEvent  = this.getKeyBoardEvent();
        this.commonAncestor = this.getCommonAncestor();
    };
    
    sapi.prototype.clear = function() {
        this.original       = null;
        this.startNode      = null;
        this.endNode        = null;
        this.startOffset    = null;
        this.endOffset      = null;
        this.isCollapsed    = null;
        this.nodes          = null;
        this.keyBoardEvent  = null;
        this.commonAncestor = null;
    };
    
    sapi.prototype.listen = function() {
        for (var i=0; i<this.triggers.length; i++)
        {
            var parent = this.parent;
            $(parent.iframe.contentWindow).bind(this.triggers[i], parent, function(e) {
                parent = e.data;
                parent.sapi.update();
            });
        }
    };
    
    /**
    * IMPORTANT: Because the selection/range object is part of the DOM, it is owned by 
    * the parent window of the document which contains it. Therefore, the selection 
    * within an editor must be cached within the scope of the parent window of the 
    * editor. This means that the selection object must be stored in the iframe's 
    * window.
    */
    
    sapi.prototype.cacheSelection = function() {
        $('#log').html('Caching selection<br />');
        var w = this.parent.docWindow;
        var d = this.parent.doc;
        if (w.getSelection) {
            var selection = w.getSelection();
            if (selection.rangeCount > 0) {
              var selectedRange = selection.getRangeAt(0);
              w._selection = selectedRange.cloneRange();
            }
            else {
              return null;
            }
          }
          else if (d.selection) {
            var selection = d.selection;
            if (selection.type.toLowerCase() == 'text') {
              w._selection = selection.createRange().getBookmark();
            }
            else {
              w._selection = null;
            }
          }
          else {
            w._selection = null;
        }
    };
    
    sapi.prototype.restoreSelection = function() {
        $('#log').html($('#log').html()+'Re-storing selection<br />');
        var w = this.parent.docWindow;
        var d = this.parent.doc;
        try {jQuery(d).focus();} catch(e) {}
        if (w._selection) {
            if (w.getSelection) {
              var selection = w.getSelection();
              selection.removeAllRanges();
              selection.addRange(w._selection);
              w._selection = null;
            }
            else if (d.selection && d.body.createTextRange) {
              var range = d.body.createTextRange();
              range.moveToBookmark(w._selection);
              range.select();
              w._selection = null;
            }
        }
    };
    
    sapi.replaceSelectionText = function(text) {
        var w = this.parent.docWindow;
        var d = this.parent.doc;
        try {jQuery(d).focus();} catch(e) {}
        if (!w.getSelection && 
            !d.selection && 
            !d.body.createTextRange) 
        {
            return false;
        }
        SBC.restoreSelection(index);
        if (w.getSelection) {
          var selection = w.getSelection();
          var range = selection.getRangeAt(0);
          range.deleteContents();
          var textNode = d.createTextNode(text);
          range.insertNode(textNode);
          if (textNode.normalize) textNode.normalize();
        }
        else if (d.selection && d.body.createTextRange) {
          var range = d.body.createTextRange();
          // range.moveToElementText(range.parentElement);
          // range..move("Character",range.startOffset);
          range.pasteHTML(text);
        }
    };
    
    sapi.prototype.getKeyBoardEvent = function () {
        return null;  
    };
    
    sapi.prototype.anchorBlock = function() {
        var n = 0;
        var max = 10;
        var anchorNode = this.original.anchorNode;
        if (!anchorNode) return false;
        while (!this.blocks.has(anchorNode.nodeName) && n<max)
        {
            anchorNode = anchorNode.parentNode;
        }
        return anchorNode;
    };
    
    sapi.prototype.focusBlock = function() {
        var n = 0;
        var max = 10;
        var focusNode = this.original.focusNode;
        while (!this.blocks.has(focusNode.nodeName) && n<max)
        {
            focusNode = focusNode.parentNode;
        }
        return focusNode;
    };
    
    sapi.prototype.getStartOffset = function() {
        if (typeof(this.original.anchorOffset) !== "undefined")
        {
            if (this.original.anchorOffset < this.original.focusOffset)
            {
                return this.original.anchorOffset;
            }
            return this.original.focusOffset;
        }
    };
    
    sapi.prototype.getEndOffset = function() {
        if (typeof(this.original.focusOffset) !== "undefined")
        {
            if (this.original.focusOffset > this.original.anchorOffset)
            {
                return this.original.focusOffset;
            }
            return this.original.anchorOffset;
        }
    };
    
    sapi.prototype.getIsCollapsed = function() {
        if (typeof(this.original.isCollapsed) != "undefined")
        {
            return this.original.isCollapsed;
        }
    };
    
    sapi.prototype.getNodesInSelection = function() {
        
        var nodes = [];
        var candidates = [];
        var children;
        var el; 
        var parent;
    
        var rng = this.getSelectionRange();
        if (rng) 
        {
            parent = this.getCommonAncestor(rng);
            if (parent) 
            {
                // adjust from text node to element, if needed
                
                while(parent.nodeType != 1) 
                {
                    parent = parent.parentNode;
                }
    
                // obtain all candidates down to all children
                
                var children = parent.all || parent.getElementsByTagName("*");
                for (var j=0; j<children.length; j++)
                {
                    candidates.push(children[j]);
                }
    
                // proceed - keep element when range touches it
                
                nodes.push(parent);
                
                for (var i=0, r2; i<candidates.length; i++) 
                {
                    r2 = this.createRangeFromElement(candidates[i]);
                    if (r2 && this.rangeContact(rng, r2))
                    {
                        nodes.push(candidates[i]);
                    }
                }
            }
        }
        return nodes;
    };
    
    sapi.prototype.getCommonAncestor = function(rng) {
        if (!rng) rng = this.getSelectionRange();
        return rng.parentElement ?
            rng.parentElement() : rng.commonAncestorContainer;
    };
    
    sapi.prototype.getSelectionRange = function() {
        var rng = null;
        if (window.getSelection) 
        {
            rng = window.getSelection();
            if (rng && rng.rangeCount && rng.getRangeAt) 
            {
                rng = rng.getRangeAt(0);
            }
        } 
        else if (document.selection && document.selection.type == "Text") 
        {
            rng = document.selection.createRange();
        }
        return rng;
    };
    
    sapi.prototype.rangeContact = function(r1, r2) {
        var p = {};
        if (r1.compareEndPoints) 
        {
            $.extend(p, {
                method:       "compareEndPoints",
                StartToStart: "StartToStart",
                StartToEnd:   "StartToEnd",
                EndToEnd:     "EndToEnd",
                EndToStart:   "EndToStart"
            });
        } 
        else if (r1.compareBoundaryPoints) 
        {
            $.extend(p, {
                method:       "compareBoundaryPoints",
                StartToStart: 0,
                StartToEnd:   1,
                EndToEnd:     2,
                EndToStart:   3
            });
        }
        return p && !(
           r2[p.method](p.StartToStart, r1) == 1 &&
           r2[p.method](p.EndToEnd, r1) == 1 &&
           r2[p.method](p.StartToEnd, r1) == 1 &&
           r2[p.method](p.EndToStart, r1) == 1
           ||
           r2[p.method](p.StartToStart, r1) == -1 &&
           r2[p.method](p.EndToEnd, r1) == -1 &&
           r2[p.method](p.StartToEnd, r1) == -1 &&
           r2[p.method](p.EndToStart, r1) == -1
        );
    };
    
    sapi.prototype.createRangeFromElement = function(el) {
        var rng = null;
        if (document.body.createTextRange) 
        {
            rng = document.body.createTextRange();
            rng.moveToElementText(el);
        } 
        else if (document.createRange) 
        {
            rng = document.createRange();
            rng.selectNodeContents(el);
        }
        return rng;
    };
    
    $(WYMeditor).bind('AfterInit', function(e, editor) {
        new sapi(editor);
    });

})(jQuery);
