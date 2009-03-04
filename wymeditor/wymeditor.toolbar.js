Wymeditor.Toolbar = function (options) {
    this._options = jQuery.extend(true, {
        renderTo: '',
        layout: 'default'
    }, options);

    this.fireEvent('init');

    this._render();
    this.fireEvent('render');

    this._registerEvents();
    this.fireEvent('registerEvents');

}
Wymeditor.Toolbar.prototype = Wymeditor.extend(new Wymeditor.Observable(), {
    controls: {
        blockType: {},
        'class': {},

        strong: {},
        emphasis: {},

        'sup': {},
        'sub': {},

        ol: {},
        ul: {},
        dl: {},

        indent: {},
        outdent: {},

        undo: {},
        redo: {},

        link: {},
        unlink: {},

        img: {},
        embed: {},

        table: {},

        paste: {},

        edit: {},
        source: {},
        preview: {},

        editormode: { type: 'buttonSet', style: 'toggle', single: true,
            buttons: ['edit','source','preview'] }
    },

    controlTypes: {
        button: {},
        buttonSet: {},
        droplist: {}
    },

    layouts: {
        default: [
            'blockType','class',['strong','em','sup','sub'],
            ['ol','ul','dl'],['indent','outdent'],['undo','redo'],
            ['link','unlink'],['img','embed'],'table','paste','editormode'
        ]
    },

    _render: function () {
        var layout = this.layouts[this._options.layout],
            type,
            controls = [];

        for (var e in layout) {
            type = typeof layout[e];

            if (e) {
                // Did we get a button-set?
                if (type === 'object') {
                    if (layout[e] instanceof Array) {
                        controls.push(this._renderControl({type: 'buttonSet', buttons: layout[e]}));
                    } else {
                        controls.push(this._renderControl(layout[e]));
                    }
                // Maybe we got a single control?
                } else if (type === 'string') {
                    controls.push(this._renderControl(this.controls[layout[e]]));
                }
            }
        };

        jQuery(this._options.renderTo).append(Wymeditor.Templates.render('toolbar', {controls:controls}));
    },

    _renderControl: function (control) {
        if (jQuery.isFunction(control.render)) {
            // Use control specific render method
        } else if (control.type &&
            jQuery.isFunction(this.controlTypes[control.type].render)) {
            // Use defaut reder method
        } else {
            // We got an error
        }
        return control
    },

    _renderControlSet: function (controlSet) {
        var output;

        if (controlSet && controlSet instanceof Array) {
            controls = controlSet;
        } else if (controlSet['controls']) {
            controls = controlSet['controls'];
        }

        return output;
    },

    _registerEvents: function () {

    },

    disable: function () {},
    enable: function () {}
});