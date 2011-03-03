Wymeditor.core.EditableArea = function (element) {
    Wymeditor.core.Observable.call(this);
    this.element = $(element);
    
    this.selection = Wymeditor.core.selection;
    this.utils = Wymeditor.utils;
    
    this.init();
}
Wymeditor.core.EditableArea.prototype = Wymeditor.utils.extendPrototypeOf(Wymeditor.core.Observable, {
    commands: {
        wrap: function () {},
        unwrap: function () {}
    },
    
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
            
            range = rangy.getSelection().getRangeAt(0);
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
        
        container = container || this.element[0];
        
        if (node.parentNode !== container) {
            do {
                children.push(child);
                child = child.nextSibling;
            } while (child);
            
            for (i = 0; child = children[i]; i++) {
                newParent.appendChild(oldParent.removeChild(child));
            }
            
            oldParent.normalize();
            newParent.normalize();
            
            $([oldParent, newParent]).filter(':empty').append('<br _wym_placeholder="true" />');
            $(newParent).insertAfter(oldParent);
            
            if (newParent.parentNode !== container) {
                this.splitBlock(newParent, null, container);
            }            
            
            return newParent;
        }
        return container.children[container.children.length - 1];
    },
    
    appendBlock: function (type, element) {
        type = type || 'p';
        
        // Should find the nearest parrent that allows block elements
        element = this.element;
        
        // Elements needs content to be selectable in IE and Webkit, now we only
        // need to clean this up...
        return $('<'+type+' />')
            .append('<br _wym_placeholder="true" />')
            .appendTo(element)[0];
    },
    
    exec: function (command, options) {
        
    },
    
    html: function (html) {
        if (typeof html === 'string') {
            this.element.html(html);
            return undefined;
        } else {
            return this.element.html();
        }
    },
    
    isEmpty: function () {
        return this.element.html() === '';
    }
});