Wymeditor.EditableArea = function EditableArea (element) {
    Wymeditor.Observable.call(this);
    this.element = $(element);
    
    this.dom = Wymeditor.dom;
    this.selection = Wymeditor.selection;
    this.utils = Wymeditor.utils;
    
    this.init();
}
Wymeditor.EditableArea.prototype = Wymeditor.utils.extendPrototypeOf(Wymeditor.Observable, {
    init: function () {
        this.fireEvent('init');
        this.enable();
        this.fireEvent('postInit');
    },
    
    enable: function () {
        this.element.attr('contentEditable', true)
                    .addClass('wym-editable');
        
        this.element.bind('keydown.wym', this.utils.setScope(this, this.onKeyDown));
        this.fireEvent('enable');
    },
    disable: function () {
        this.element.attr('contentEditable',false)
                    .removeClass('wym-editable');
        this.element.unbind('.wym');
        this.fireEvent('disable');
    },
    
    onKeyDown: function (element, event) {
        if (this.isEmpty()) {
            this.selection.selectNodeContents(this.appendBlock());
        }
        
        this.handleEnterKey(element, event);
    },
    
    handleEnterKey: function (element, event) {
        var ranges, 
            range;
        if (event.keyCode === 13) {
            event.preventDefault();
            
            ranges = this.selection.getRanges(this.element);

            if (ranges.length) {
                range = ranges[0];
                range.deleteContents();
                
                if (event.shiftKey) {
                    range.insertNode($('<br />')[0]);
                } else {
                    this.selection.selectNodeContents(this.splitBlock(range.startContainer, range.startOffset));
                }

                this.selection.detach(ranges);
            }
        }
        return true;
    },
    
    splitTextNode: function (textNode, offset) {
        if (offset < textNode.length) {
            textNode.splitText(offset);
            return textNode.nextSibling;
        } else {
            return $(document.createTextNode('')).insertAfter(textNode)[0];
        }
    },
    
    splitNodes: function (node, offset, container) {
        var child = node.nodeType === Wymeditor.TEXT_NODE ?
                this.splitTextNode(node, offset) : node,
            oldParent = child.parentNode,
            newParent = document.createElement(oldParent.tagName),
            parents = [],
            children = [],
            i;
        
        container = container || oldParent.parentNode;
        
        // We're splitting the parentNode
        if (child.parentNode !== container) {
            do {
                children.push(child);
                child = child.nextSibling;
            } while (child);
            
            for (i = 0; child = children[i]; i++) {
                newParent.appendChild(oldParent.removeChild(child));
            }
            
            oldParent.normalize();
            newParent.normalize();
            
            $(newParent).insertAfter(oldParent);
            this.populateEmptyElements([oldParent, newParent]);
            
            if (newParent.parentNode !== container) {
                this.splitNodes(newParent, null, container);
            }            
            
            return newParent;
        }
        return container.children[container.children.length - 1];
    },

    splitRangeAtBlockBoundaries: function (range) {
        var filter = this.dom.structureManager.getCollectionSelector('block'),
            nodes = range.getNodes([3], function (n) { 
                return $(n).is(filter); }),
            node,
            ranges = [],
            newRange,
            i;
        
        for (i = 0; node = nodes[i]; i++) {
            newRange = rangy.createRange();
            newRange.selectNodeContents(node);

            switch (range.compareNode(node)) {
                // node starts before the range
                case range.NODE_BEFORE:
                    newRange.setStart(node, range.startOffset);
                    ranges.push(range);
                break; 
                // node ends after the range
                case range.NODE_AFTER:
                    newRange.setEnd(node, range.endOffset);
                    ranges.push(range);
                break; 
                // node is completely contained within the range
                case range.NODE_INSIDE:
                    ranges.push(range);
                break;
                default:
                    newRange.detach();
                    newRange = null; 
                break;
            }
        }

        if (ranges.length) {
            return ranges;
        } else {
            return [range];
        }
    },

    splitRangesAtBlockBoundaries: function (ranges) {
        var newRanges = [], range, i;
        for (i = 0; range = ranges[i]; i++) {
            newRanges.concat(this.splitRangeAtBlockBoundaries(range));
        }
        return newRanges;
    },

    splitNodesAtRangeBoundaries: function (ranges) {
        var range, i;

        // Respect blok elements
        ranges = this.splitRangesAtBlockBoundaries(ranges);
        
        for (i = 0; range = ranges[i]; i++) {
            this.splitNodes(range.startContainer, range.startOffset, range.commonAncestorContainer);
            if (!range.collapsed) {
                this.splitNodes(range.endContainer, range.endOffset, range.commonAncestorContainer);
            }
        }
        return ranges;
    },

    splitBlock: function (node, offset) {
        this.splitNodes(node, offset, this.findParentBlockNode(node).parent()[0]);
    },
    
    appendBlock: function (type, element) {
        var newBlock;
        
        type = type || 'p';
        
        // Should find the nearest parent that allows block elements
        element = this.element;
        
        // Elements needs content to be selectable in IE and Webkit, now we only
        // need to clean this up...
        newBlock = $('<'+type+' />').appendTo(element);
        this.populateEmptyElements(newBlock);
        
        return newBlock[0];
    },
    
    formatBlock: function (target, tagName) {
        var node,
            block,
            newBlock;
        
        if (target && (target.nodeName || (target[0] && target[0].nodeName))) {
            node = $(target);
        } else if (this.utils.is('String', target)) {
            tagName = target;
            node = $(this.selection.getCommonAncestors(this.element)[0]);
        }
        
        if (node.length) {
            this.selection.save();

            block = this.findParentBlockNode(node);
            
            if (block.length) {
                newBlock = $('<'+tagName+'/>').append(block.clone().get(0).childNodes);
                block.replaceWith(newBlock);
            }

            this.selection.restore();
        }
    },
    
    formatSelection: function (element) {
        var ranges = this.selection.getRanges(this.element),
            range, i;
        
        for (i = 0; range = ranges[i]; i++) {
            if (this.utils.is('String', element)) {
                // Asume we have a tag name
                element = $('<'+element+'/>')[0];
            } else {
                // Make sure we get a DOM Node even if we have a jQuery object
                // and that we dont try to use the same element twice
                if (i !== 0) {
                    element = $(element).clone()[0];
                } else {
                    element = $(element)[0];
                }
            }
            
            if (range.canSurroundContents()) {
                range.surroundContents(element);
            }

            //range.detach();
        }
    },
    
    unformatSelection: function (filter) {
        var i, ranges, nodes, func;
        
        if (this.utils.is('Function', filter)) {
            func = filter;
        } else if (this.utils.is('String', filter)) {
            // Asume a selector/tagName
            func = function (node) {
                return $(node).is(filter);
            };
        } else if (filter) {
            // Asume some kind of element/jQuery object. Use first element.
            filter = $(filter)[0];
            func = function (node) {
                return node === filter;
            };
        } else {
            // return;
        }
        
        ranges = this.selection.getRanges(this.element);
        
        for (i = 0; range = ranges[i]; i++) {
            nodes = range.getNodes(null, func);
            $(nodes).children().unwrap();
            //range.detach();
        }
    },
    
    toggleSelectionFormat: function (element) {
        var ranges = this.selection.getRanges(this.element);
        
        this.selection.detach(ranges);      
    },
    
    findParentNode: function (node, filter, container) {
        node = $(node);
        container = container || this.element;
        
        while (!node.is(filter)) {
            node = node.parent();
        }
        if (node.is(container)) {
            return $();
        } else { 
            return node;
        }
    },
    
    findParentBlockNode: function (node, container) {
        return this.findParentNode(node,
            this.dom.structureManager.getCollectionSelector('block'), container);
    },
    
    populateEmptyElements: function (elements) {
        elements = elements || this.element;
        $(elements).each(function(){
            $(this).children().andSelf()
                .filter(':empty:not(br)').append('<br _wym_placeholder="true" />');
        });
    },
    
    html: function (html) {
        if (this.utils.is('String', html)) {
            this.element.html(html);
            return undefined;
        } else {
            html = this.dom.serialize(this.element[0]);
            // this.plugin.htmlFormatter.format(html)
            return html;
        }
    },
    
    isEmpty: function () {
        return this.element.html() === '';
    }
});