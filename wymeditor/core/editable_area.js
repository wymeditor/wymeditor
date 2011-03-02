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
        if (event.keyCode === 13) {
            if (event.shiftKey) {
                // Should force linebreak
                // event.preventDefault();
            } else {
                this.selection.selectNodeContents(this.appendBlock(null, element));
                event.preventDefault();
            }
        }
        return true;
    },
    
    appendBlock: function (type, element) {
        type = type || 'p';
        
        // Should find the nearest parrent that allows block elements
        element = this.element;
        
        // Elements needs content to be selectable in IE and Webkit, now we only
        // need to clean this up...
        return $('<'+type+' />')
            .append('<br />')
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