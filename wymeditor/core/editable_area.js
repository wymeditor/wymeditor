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
        var range;
        if (event.keyCode === 13) {
            event.preventDefault();
            
            range = this.selection.getRanges(this.element)[0];
            range.deleteContents();
            
            if (event.shiftKey) {
                range.insertNode($('<br />')[0]);
            } else {
                this.selection.selectNodeContents(this.splitBlock(range.startContainer, range.startOffset));
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
    
    splitBlock: function (node, offset, container) {
        var firstChild = node.nodeType === Wymeditor.TEXT_NODE ?
                this.splitTextNode(node, offset) : node,
            oldParent = firstChild.parentNode,
            newParent = document.createElement(oldParent.tagName),
            parents = [],
            child = firstChild,
            children = [],
            i;
        
        container = container || this.findParentBlockNode(child).parent()[0];
        
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
                this.splitBlock(newParent, null, container);
            }            
            
            return newParent;
        }
        return container.children[container.children.length - 1];
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
            newNode;
        
        if (target && (target.nodeName || target[0].nodeName)) {
            node = $(target);
        } else if (this.utils.is('String', target)) {
            tagName = target;
            node = $(this.selection.getCommonAncestor());
        }
        
        node = this.findParentBlockNode(node);
        
        newNode = $('<'+tagName+'/>').append(node.clone().get(0).childNodes);
        node.replaceWith(newNode);
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
                element = $(element).clone()[0];
            }
            
            if (range.canSurroundContents()) {
                range.surroundContents(element);
            }
        }
    },
    
    unformatSelection: function (element) {
        var ranges = this.selection.getRanges(this.element);
    },
    
    toggleSelectionFormat: function (element) {
        var ranges = this.selection.getRanges(this.element);        
    },
    
    findParentNode: function (node, filter, container) {
        node = $(node);
        container = container || this.element;
        
        while (!node.is(filter)) {
            if (node.is(container)) {
                return $();
            }
            node = node.parent();
        }
        return node;
    },
    
    findParentBlockNode: function (node, container) {
        return this.findParentNode(node,
            this.dom.structureManager.getCollectionSelector('block'), container);
    },
    
    populateEmptyElements: function (elements) {
        elements = elements || this.element;
        $(elements).children().andSelf()
            .filter(':empty').append('<br _wym_placeholder="true" />');
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