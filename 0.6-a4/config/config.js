{   
'anchorHtml'  : '<div class="anchor"></div>',
'editorHtml'  : '<iframe class="editor"></iframe>',
'toolbarHtml' : '<ul class="toolbar"></ul>',
'buttonHtml'  : '<li><a href="#"><span class="hide></span></a></li>',
'plugins': [],
'toolbars': [{
    'text': 'toolbar-one',
    'css': 'toolbar-one',
    'id': 'toolbar-one',
    'buttons': [{
        'text': 'InsertLink', 
        'hidetext': true,
        'behaviors': {
            'mouseover': function(e) {
                jQuery('#log').html('InsertLink<br /> WYMeditor Instance ' + e.data.parent._index);
            },
            'mouseout': function(e) {
                jQuery('#log').html('');
            },
            'click': function(e) {
                jQuery(this).blur();
                alert('InsertLink WYMeditor Instance ' + e.data.parent._index);
                return false;
        }}
    }, {
        'text': 'ToggleHtml', 
        'hidetext': true,
        'behaviors': {
            'mouseover': function(e) {
                jQuery('#log').html('ToggleHtml<br /> WYMeditor Instance ' + e.data.parent._index);
            },
            'mouseout': function(e) {
                jQuery('#log').html('');
            },
            'click': function(e) {
                jQuery(this).blur();
                jQuery("#wymeditor-instance-" + e.data.parent).slideToggle("fast");
                jQuery("#instance-" + e.data.parent._index).slideToggle("fast");
                return false;
        }}
    }]
}, {
    'text': 'toolbar-two',
    'css': 'toolbar-two',
    'id': 'toolbar-two',
    'buttons': [{
        'text': 'Header 1', 
        'hidetext': false,
        'behaviors': {
            'mouseover': function(e) {
                jQuery('#log').html('Header 1<br /> WYMeditor Instance ' + e.data.parent._index);
            },
            'mouseout': function(e) {
                jQuery('#log').html('');
            },
            'click': function(e) {
                jQuery(this).blur();
                alert('Header 1 WYMeditor Instance ' + e.data.parent._index);
                return false;
        }}
    }]
}]
}