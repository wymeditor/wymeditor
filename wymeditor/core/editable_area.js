Wymeditor.EditableArea = function EditableArea (element) {
    Wymeditor.Observable.call(this);
    this.element = $(element);
    
    this.dom = Wymeditor.dom;
    this.structureManager = new Wymeditor.dom.StructureManager();
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
        if (offset > 0 && offset < textNode.length) {
            textNode.splitText(offset);
            return textNode.nextSibling;
        } else if (offset <= 0) {
            return $(document.createTextNode('')).insertBefore(textNode)[0];
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
        
        container = $(container || oldParent.parentNode)[0];
        
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
        var filter = this.structureManager.getCollectionSelector('block'),
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
            newRanges = newRanges.concat(this.splitRangeAtBlockBoundaries(range));
        }
        return newRanges;
    },

    splitNodesAtRangeBoundaries: function (ranges) {
        var range, container, i, startNode, startOffset, endNode, endOffset;


        // Respect block elements
        ranges = this.splitRangesAtBlockBoundaries(ranges);
        
        for (i = 0; range = ranges[i]; i++) {
            container = this.findParentBlockNode(range.startContainer);

            // Save all the positions, because Firefox goes crazy once you modify the DOM. 
            // Also, manage ranges that start or end between nodes.
            if (range.startContainer.nodeType === Wymeditor.TEXT_NODE) {
                startNode = range.startContainer;
                startOffset = range.startOffset;
            } else {
                // Split before starting node
                startNode = range.startContainer.childNodes[range.startOffset - 1];
                startOffset = 0;
            }
            if (range.endContainer.nodeType === Wymeditor.TEXT_NODE) {
                endNode = range.endContainer;
                endOffset = range.endOffset;
            } else {
                // Split after end node 
                endNode = range.endContainer.childNodes[range.endOffset];
                endOffset = 0;
            }

            this.splitNodes(startNode, startOffset, container);
            if (!range.collapsed) {
                this.splitNodes(endNode, endOffset, container);
            }
        }
        return ranges;
    },

    splitBlock: function (node, offset) {
        return this.splitNodes(node, offset, this.findParentBlockNode(node).parent()[0]);
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
                // Assume we have a tag name
                element = $('<'+element+'/>')[0];
            } else {
                // Make sure we get a DOM Node even if we have a jQuery object
                // and that we don't try to use the same element twice
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
        var i, ranges, range, nodes, func, normalize = [];

        this.selection.save();

        this.splitNodesAtRangeBoundaries(
            this.selection.getRanges(this.element));
        
        this.selection.restore();

        ranges = this.selection.getRanges(this.element);

        this.selection.save();

        for (i = 0; range = ranges[i]; i++) {
            // element is child
            nodes = range.getNodes([1], function (node) {
                return $(node).is(filter);
            });

            // element is container
            nodes = nodes.concat($(range.commonAncestorContainer).filter(filter).toArray());

            // element is parent
            nodes = nodes.concat(this.findParentNode(range.commonAncestorContainer, filter).toArray());

            // Remove any duplicates
            nodes = $.unique(nodes); 

            $(nodes).each(function() {
                $(this.childNodes).unwrap();
            });
            //range.detach();
            
            // Remember which nodes to normalize
            normalize.push(this.findParentBlockNode(range.commonAncestorContainer));
        }

        this.selection.restore();

        this.normalizeNodes(normalize);

    },
    
    toggleSelectionFormat: function (element) {
        var ranges = this.selection.getRanges(this.element);
        
        this.selection.detach(ranges);      
    },
    
    findParentNode: function (node, filter, container) {
        node = $(node);
        container = container || this.element;
        
        if (container.length) {
            while (node.length &&!node.is(filter) && !node.is(container)) {
                node = node.parent();
            }
            if (!node.is(container)) {
                return node;
            }
        }
        return $();
    },
    
    findParentBlockNode: function (node, container) {
        return this.findParentNode(node,
            this.structureManager.getCollectionSelector('block'), container);
    },
    
    populateEmptyElements: function (elements) {
        elements = elements || this.element;
        $(elements).each(function(){
            $(this).children().andSelf()
                .filter(':empty:not(br)').append('<br _wym_placeholder="true" />');
        });
    },

    normalizeNode: function normalize (node) {
        var attributes = {}, 
            equal,
            next,
            name, 
            value,
            i;
        node = $(node)[0] && $(node)[0].childNodes[0];

        while (node) {
            next = node.nextSibling;
            
            // Do we have two nodes of the same type?
            if (next && next.nodeName === node.nodeName) {
                
                // Merge text nodes
                if (node.nodeType === Wymeditor.TEXT_NODE) {
                    node.appendData(next.data);
                    next.parentNode.removeChild(next);

                    continue;

                } else if (node.nodeType === Wymeditor.ELEMENT_NODE) {
                                        
                    // Recursion: normalize children
                    normalize(node);

                    // Merge elements only if they share the same attributes
                    if (node.attributes.length === next.attributes.length) {
                        
                        // They have the same number of attributes, lets compare them
                        equal = true;
                        for (i=0; attribute = node.attributes[i]; i++) {
                            name = attribute.nodeName.toLowerCase();
                            value = attribute.nodeValue;
                            
                            if (name === 'style' && node.style.cssText) {
                                attributes[name] = node.style.cssText;
                            } else if (name !== 'contenteditable' && value !== '') {
                                attributes[name] = value;
                            }
                        }
                        for (i=0; attribute = next.attributes[i]; i++) {
                            name = attribute.nodeName.toLowerCase();
                            value = attribute.nodeValue;
                            if (
                                !(name in attributes) ||
                                (name !== 'contenteditable' && value !== '' && attributes[name] !== value) ||
                                (name === 'style' && next.style.cssText && attributes[name] !== node.style.cssText)
                            ) {
                                equal = false;
                                break;
                            }
                        }

                        if (equal) {
                            // Merge nodes
                            for (i = 0; child = next.childNodes[i]; i++) {
                                node.appendChild(next.removeChild(child));
                            }
                        } else {
                            node = next;
                        }
                    } else {
                        node = next;
                    }
                }

            // We have two different nodes
            } else {
                // Remove empty elements
                if (node.nodeType === Wymeditor.ELEMENT_NODE && !node.childNodes.length) {
                    node.parentNode.removeChild(node);
                }
                node = next;
            }
        }

    },

    normalizeNodes: function (nodes) {
        for (var i = 0, node; node = nodes[i]; i++) {
            this.normalizeNode(node);
        }
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