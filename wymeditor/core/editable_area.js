Wymeditor.core.EditableArea = function (element) {
    this.element = $(element);
    
    this.enable();
}
Wymeditor.core.EditableArea.prototype = Wymeditor.utils.extentPrototypeOf(Wymeditor.core.Observable, {
    commands: {
        
    },
    
    enable: function () {
        this.element.contentEditable = true;
        
    },
    disable: function () {
        this.element.contentEditable = false;
    },
    exec: function (command, options) {
        
    }
});