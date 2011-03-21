module('Editable Area');
jQuery(function($){
    var element = $('.editable'),
        editableArea = new Wymeditor.EditableArea(element);
    
    test('init', 6, function() {
        ok(editableArea instanceof Wymeditor.EditableArea, 'Create instace');
        
        ok(editableArea.addListener('disable', function () {
            ok(true, 'Received disable event');
        }), 'Add event listener');
        
        editableArea.disable();
        
        editableArea.addListener('enable', function () {
            ok(true, 'Received enable event');
        });
        
        editableArea.enable();
        
        var testHtml = '<p>Test</p>';
        
        editableArea.html(testHtml);
        strictEqual(editableArea.html(), testHtml, 'Setting and getting HTML');
        
        editableArea.html('');
        ok(editableArea.isEmpty(), 'Emptying the editor');
    });
    
    test('splitBlock', 6, function() {
        function setup (container) {
            var text = document.createTextNode('Text to break'),
                node = document.createElement('p');
            container = container || editableArea.element;
            
            node.appendChild(text);
            container.html('').append(node);
            return text;
        }
        
        editableArea.splitBlock(setup(), 0);
        strictEqual(editableArea.html(), '<p><br _wym_placeholder="true" /></p><p>Text to break</p>', 'Splitting block elements (index 0)');
        
        editableArea.splitBlock(setup(), 2);
        strictEqual(editableArea.html(), '<p>Te</p><p>xt to break</p>', 'Splitting block elements (index 2)');
        
        var textNode = setup();
        
        editableArea.splitBlock(textNode, textNode.length);
        strictEqual(editableArea.html(), '<p>Text to break</p><p><br _wym_placeholder="true" /></p>', 'Splitting block elements (at end)');
        
        editableArea.html('');
        
        var nestedElement = $('<strong>').appendTo($('<p>Nested </p>').appendTo(editableArea.element));
        textNode = document.createTextNode('test');
        nestedElement.append(textNode);
        
        editableArea.splitBlock(textNode, 2);
        strictEqual(editableArea.html(), '<p>Nested <strong>te</strong></p><p><strong>st</strong></p>', 'Splitting nested elements (index 2)');
        
        editableArea.html('');
        
        editableArea.splitBlock(setup($('<div />').appendTo(editableArea.element)), 2);
        strictEqual(editableArea.html(), '<div><p>Te</p><p>xt to break</p></div>', 'Splitting nested block elements (index 2)');
        
        editableArea.html('');
        
        nestedElement = $('<strong>').appendTo($('<p>Nested </p>').appendTo($('<div />').appendTo(editableArea.element)));
        textNode = document.createTextNode('test');
        nestedElement.append(textNode);
        
        editableArea.splitBlock(textNode, 2);
        strictEqual(editableArea.html(), '<div><p>Nested <strong>te</strong></p><p><strong>st</strong></p></div>', 'Splitting nested block and inline elements (index 2)');
        
        editableArea.html('');
        
    });
    
    test('formatBlock', function() {
        function setup (html) {
            var node = $(html || '<p>Some text</p>');
            editableArea.html('');
            editableArea.element.append(node);
            return node;
        }
        
        editableArea.formatBlock(setup(), 'h1');
        strictEqual(editableArea.html(), '<h1>Some text</h1>', 'Block formatting (on element)');
        
        editableArea.selection.selectNodeContents(setup()[0]);
        editableArea.formatBlock('h1');
        strictEqual(editableArea.html(), '<h1>Some text</h1>', 'Block formatting (on selection)');
        
        editableArea.formatBlock($('<em>Inline</em>').appendTo(setup()), 'h1');
        strictEqual(editableArea.html(), '<h1>Some text<em>Inline</em></h1>', 'Block formatting (inline element)');
        
        editableArea.formatBlock(setup('<div><p>Nested</p></div>').children().get(0), 'h1');
        strictEqual(editableArea.html(), '<div><h1>Nested</h1></div>', 'Block formatting (nested block elements)');
        
        editableArea.html('');
    });

    test('formatSelection', function() {
        function setup () {
            var text = document.createTextNode('Text to format'),
                node = document.createElement('p'),
                range = rangy.createRange(),
                selection = rangy.getSelection();
                
            node.appendChild(text);
            editableArea.html('');
            editableArea.element.append(node);
            
            range.setStart(text, 8);
            range.setEnd(text, 14);
            
            selection.setSingleRange(range);
            
            return range;
        }
        
        setup();
        editableArea.formatSelection('strong');
        strictEqual(editableArea.html(), '<p>Text to <strong>format</strong></p>', 'Selection formatting (tag name)');
        
        setup();
        editableArea.formatSelection($('<a href="#" title="A link" />'));
        strictEqual(editableArea.html(), '<p>Text to <a href="#" title="A link">format</a></p>', 'Selection formatting (dom node)');
        
        editableArea.html('');
    });
});