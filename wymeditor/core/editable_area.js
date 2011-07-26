Wymeditor.EditableArea = function EditableArea (element) {
    Wymeditor.Observable.call(this);
    this.element = $(element);
    
    this.dom = Wymeditor.dom;
    this.normalizer = this.dom.normalizer;
    this.serializer = this.dom.serializer;
    this.structureManager = this.dom.structureManager();
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
        this.element.bind('keyup.wym mouseup.wym DOMSubtreeModified.wym', this.utils.setScope(this, this.possibleChange));
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

    possibleChange: (function () {
        var lastLocation,
            timer;
        return function (element, event) {
            var self = this;
            // Should figure out if anything actually changed
            // Also, introduce a small delay not to be overly spammy
            function fire () { 
                Wymeditor.activeArea = self;
                self.fireEvent('change'); 
            };
            clearTimeout(timer);
            timer = setTimeout(fire, 100);
        };

    })(),
    
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
            nodes = range.getNodes([Wymeditor.ELEMENT_NODE], function (n) { 
                return $(n).is(filter); }),
            node,
            ranges = [],
            newRange,
            i;
        
        for (i = 0; node = nodes[i]; i++) {
            newRange = range.cloneRange();

            switch (range.compareNode(node)) {
                // node starts before the range
                case range.NODE_BEFORE:
                    newRange.setEnd(node, node.childNodes.length);
                    ranges.push(newRange);
                break; 
                // node ends after the range
                case range.NODE_AFTER:
                    newRange.setStart(node, 0);
                    ranges.push(newRange);
                break; 
                // node is completely contained within the range
                case range.NODE_INSIDE:
                    newRange.selectNodeContents(node);
                    ranges.push(newRange);
                break;
                default:
                    ranges.push(newRange);
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
        var ranges = this.splitRangesAtBlockBoundaries(
                this.selection.getRanges(this.element)
            ), i, range, wrapper;

        if (this.utils.is('String', element)) {
            // Assume we have a tag name
            element = $('<'+element+'/>');
        } else {
            // Let jQuery deal with it
            element = $(element).first();
        }

        for (i = 0; range = ranges[i]; i++) {
            wrapper = element.clone()[0];
            wrapper.appendChild(range.extractContents());
            range.insertNode(wrapper);
            range.selectNodeContents(wrapper);
        }

        this.selection.selectRanges(ranges);

        this.possibleChange();
    },
    
    unformatSelection: function (filter) {
        var ranges = this.splitRangesAtBlockBoundaries(
                this.selection.getRanges(this.element)
            ), 
            select = [],
            range, nodes, node, wrapper, parent, startNode, startOffset,
            firstChild, lastChild, i, j;
        
        for (i = 0; range = ranges[i]; i++) {
            // Manage ranges that start or end between nodes.
            if (range.startContainer.nodeType === Wymeditor.TEXT_NODE) {
                startNode = range.startContainer;
                startOffset = range.startOffset;
            // Split before starting node
            } else {
                startNode = range.startContainer.childNodes[
                    range.startOffset > 0 ? range.startOffset - 1 : 0
                ];
                startOffset = 0;
            }

            // Extract selection into a div since Sizzle/jQuery doesn't work
            // directly on document fragments, yet.
            // https://github.com/jquery/sizzle/pull/47
            wrapper = document.createElement('div');
            wrapper.appendChild(range.extractContents());

            $(wrapper).find(filter).children().unwrap();

            parent = this.findParentNode(range.startContainer, filter);
            firstChild = wrapper.childNodes[0];
            lastChild = wrapper.childNodes[wrapper.childNodes.length - 1];

            if (parent.length) {
                if (parent.is('*:empty') || parent.text() === '') {
                    parent.replaceWith(wrapper.childNodes);
                } else {
                    $(this.splitNodes(startNode, startOffset, parent.parent()))
                        .before(wrapper.childNodes);
                }
            } else {
                for (j = wrapper.childNodes.length -1; j >= 0; j--) {
                    node = wrapper.childNodes[j];
                    range.insertNode(wrapper.removeChild(node));
                }
            }
            range = rangy.createRange();
            range.setStart(firstChild, 0);
            if (lastChild.nodeType === Wymeditor.TEXT_NODE) {
                range.setEndAfter(lastChild);
            } else {
                range.setEnd(lastChild, lastChild.childNodes.length);
            }

            select.push(range);
        }
        this.selection.selectRanges(select);

        //this.selection.selectRanges(ranges);
        //this.normalizer.normalizeNodes(normalize);
    },
    
    toggleSelectionFormat: function (element) {
        var ranges = this.selection.getRanges(this.element);
        
        this.selection.detach(ranges);      
    },
    
    getNodeFormat: function (node, container) {
        var stack = [];
        node = $(node);
        container = container || this.element;
        
        if (container.length) {
            while (node.length && !node.is(container)) {
                if (node[0].nodeType === Wymeditor.ELEMENT_NODE) {
                    stack.push(node[0].nodeName.toLowerCase());
                }
                node = node.parent();
            }
            return stack;
        } else {
            throw new Error('Invalid container');
        }
    },

    getSelectionFormat: function (container) {
        var result = [], ranges, range, i;
        container = container || this.element;
        ranges = this.selection.getRanges(container)

        for (i = 0; range = ranges[i]; i++) {
            result.push(this.getNodeFormat(range.startContainer));
        }

        return result;
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

    html: function (html) {
        if (this.utils.is('String', html)) {
            this.element.html(html);
            return undefined;
        } else {
            html = this.serializer.toHtml(this.element[0]);
            // this.plugin.htmlFormatter.format(html)
            return html;
        }
    },
    
    isEmpty: function () {
        return this.element.html() === '';
    }
});