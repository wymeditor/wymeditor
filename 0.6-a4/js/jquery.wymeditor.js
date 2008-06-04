if (!WYMeditor) var WYMeditor = {};

(function($) {
    $.extend(WYMeditor, {
        INSTANCES:[],
        events: {
            start        : 'Start',
            beforeConfig : 'BeforeLoadConfig',
            afterConfig  : 'AfterLoadConfig',
            beforeBuild  : 'BeforeBuild',
            beforeInit   : 'BeforeInit',
            afterInit    : 'AfterInit',
            beforeUnload : 'BeforeUnload'
        },
        idPrefix      : 'wymeditor-instance-',
        cache: [],
        box: null,
        files: {
            defaultConfig : "config.default.js",
            iframe        : "iframe/default/wymiframe.html"
        },
        paths: {
            base    : "/",
            config  : "config/",
            css     : "css/",
            html    : "html/",
            iframe  : "iframe/",
            images  : "images/",
            js      : "js/",
            plugins : "plugins/"
        },
        
        // editor represents an instance of WYMeditor.
        
        editor: function(elem, configFile) {

            this._index      = WYMeditor.INSTANCES.push(this) - 1;

            // this.elem is the element being extended by this 
            // editor instance. (e.g., textarea)

            this.elem        = elem;

            // this.events are the custom events to which callbacks can 
            // be attached.

            this.events      = WYMeditor.events;

            // this.docWindow represents the window object of the iframe
            // for this editor instance.

            this.docWindow   = null;

            // this.doc represents the document object of the iframe 
            // for this editor instance.

            this.doc         = null;

            // this.docBody represents the body of the document of 
            // the iframe for this editor instance.

            this.docBody     = null;

            // this.idPrefix is the string prefix of the unique 
            // identifier for each editor instance.

            this.idPrefix    = WYMeditor.idPrefix;

            // this.mustConfirm is a flag that can be set from 
            // anywhere in the code to instruct the editor 
            // to confirm before the user navigates away from 
            // the page.

            this.mustConfirm = 0;
            
            // Store [this] in a variable so the compiler does 
            // not need to call the Array() constructor every 
            // time $(WYMeditor).trigger() is called.
            
            var _this = [this];
            
            $(WYMeditor).trigger(this.events.start, _this);

            this.configFile = configFile || WYMeditor.files.defaultConfig;
            
            $(WYMeditor).trigger(this.events.beforeConfig, _this);
            
            this.loadConfig();
            
            $(WYMeditor).trigger(this.events.afterConfig, _this);
            
            this.wrapper();
            
            $(WYMeditor).trigger(this.events.beforeBuild, _this);
            
            this.build();
            
            $(WYMeditor).trigger(this.events.beforeInit, _this);
            
            this.init();
            
            $(WYMeditor).trigger(this.events.afterInit, _this);
        }
    });
    
    /*
    * Create the jQuery.wymeditor() function.
    */
        
    $.fn.wymeditor = function(configFile) {
        return this.each(function() {
            new WYMeditor.editor($(this), configFile);
        });
    };
    
    /*
    * wrapper() makes each editor a self-contained block and 
    * so allows us to target the editor in CSS and JS code.
    */

    WYMeditor.editor.prototype.wrapper = function() {
        $(this.elem).wrap(this.options.anchorHtml);
    };
    
    /*
    * build() creates the editor instance but does not 
    * set up any behaviors or properties. That task 
    * has been delegated to the init function.
    */
    
    WYMeditor.editor.prototype.build = function() {
        this.box = $(this.elem).hide().after(this.options.editorHtml)
            .next()
            .attr({
                'id': this.idPrefix + this._index,
                'src': WYMeditor.files.iframe
            });
    };
    
    /*
    * init() performs any behavior and property tasks. This is 
    * kept separate from the task of building the editor 
    * elements to keep the specifics of structure and 
    * behavior separate.
    */
     
    WYMeditor.editor.prototype.init = function() {
        this.iframe = $("#" + this.idPrefix + this._index)[0];
        this.docWindow = this.iframe.contentWindow;
        this.bindEvents();
    };
    
    /* 
    * updateTextarea() synchs the value of the textarea with
    * the value of the iframe document
    */
    
    WYMeditor.editor.prototype.updateTextarea = function() {
        $(this.elem).val($(this.docBody).html());
        this.confirmDiscard();
    };
    
    /* 
    * updateIframe() synchs the value of the iframe with
    * the value of the textarea.
    */
    
    WYMeditor.editor.prototype.updateIframe = function() {
        $(this.docBody).html($(this.elem).val());
        this.confirmDiscard();
    };
    
    /*
    * bindEvents() attaches listeners to trigger updates and 
    * loading of various elements.
    */
    
    WYMeditor.editor.prototype.bindEvents = function() {
        var params = {
            'editor' : this
        };
        $(this.iframe).bind('load', params, function(e) {
            var editor = e.data.editor;
            editor.doc = editor.docWindow.document;
            editor.docBody = editor.doc.body;
            editor.doc.designMode = "on";
            $(editor.docBody).html($(editor.elem).val());
            
            // We have to bind the input event handlers inside 
            // the load handler to make sure the document has 
            // completely loaded first.
                        
            $(editor.iframe.contentWindow).bind('mouseup', params, function(e) {
                var editor = e.data.editor;
                editor.updateTextarea();
            });
            
            $(editor.iframe.contentWindow).bind('keyup', params, function(e) {
                var editor = e.data.editor;
                editor.updateTextarea();
            });
        });
        
        // Any time the textarea element for this instance of an 
        // editor is updated, we also update the content of the 
        // iframe associated with this editor.
        
        $(this.elem).bind('change', params, function(e) {
            var editor = e.data.editor;
            editor.updateIframe();
        });
        
        // The BeforeUnload event on the editor allows plugins 
        // to attach callbacks to be executed when teh window's 
        // beforeunload event is fired. Note that because of the 
        // way confirm dialogs are implemented in browsers, 
        // you should not use this event to confirm that 
        // the user wants to navigate away from the page and 
        // so discard their changes. That feature is handled 
        // by WYMeditor any time the editor is updated.
                
        /*
        $(window).bind('beforeunload', params, function(e) {
            var editor = e.data.editor;
            $(editor).trigger(editor.events.beforeUnload, editor);
        });
        */
        
        // If the user clicks a 'Submit' or 'Save' button as 
        // identified by the wym_submit class, we clear any calls 
        // to confirmDiscard().
        
        $(".wym_submit").bind('click', params, function(e) {
            var editor = e.data.editor;
            editor.clearConfirmDiscard();
            return true;
        });
    };
    
    /*
    * We want to make as few HTTP calls to the server as possible
    * so as each config file is loaded, its values are stored in 
    * the WYMeditor cache so if it is referenced again, we already 
    * have the values on hand and do not need to re-load them.
    */
    
    WYMeditor.addToCache = function(key, value) {
        if (typeof(WYMeditor.cache[key]) == "undefined" || 
            WYMeditor.cache[key] == "") 
        {
            WYMeditor.cache[key] = value;
        }
    };
    
    /*
    * confirmDiscard() provides an interface for plugins to confirm
    * a page unload if the editor content was changed.
    */
    
    WYMeditor.editor.prototype.confirmDiscard = function(clear) {
        window.onbeforeunload = function(e) {
            if (clear) window.onbeforeunload = null;
            return "Any changes you have made will be lost.";
        };
    };
    
    /*
    * clearConfirmDiscard() provides an interface to over-ride the 
    * window.onbeforeunload callback. This is useful, for instance, 
    * when the Submit/Save button is clicked.
    */
    
    WYMeditor.editor.prototype.clearConfirmDiscard = function(clear) {
        window.onbeforeunload = null;
    };
    
    /*
    * The configuration of toolbars and other elements are stored 
    * in a JSON format file which is loaded at runtime.
    */
        
    WYMeditor.editor.prototype.loadConfig = function () {
        if (WYMeditor.cache[this.configFile]) 
        {
            this.options = WYMeditor.cache[this.configFile];
            return;
        }
        this.options = eval('(' + $.ajax({
            url: WYMeditor.paths.config + this.configFile,
            async: false
        }).responseText + ')');
        WYMeditor.cache[this.configFile] = this.options;
    };
    
})(jQuery);