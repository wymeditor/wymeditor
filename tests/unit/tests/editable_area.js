module('Editable Area');
test('init', 3, function() {
    var element = $('.editable'),
        editableArea = new Wymeditor.core.EditableArea(element);
    ok(editableArea instanceof Wymeditor.core.EditableArea, 'Create instace');
    
    ok(editableArea.addListener('disable', function () {
        ok(true, 'Received disable event');
    }), 'Add event listener');
    editableArea.disable();
});