/**
* Credit for this plugin belongs to many people. First and foremost to the folks at iBegin.com, 
* on whose iBox script the original idea and code SkyBox is based. The fact that I have 
* re-written their code should in now way be interpreted as an indication that I believe the 
* code to be inadequate. SkyBox was written largely for self-amusement and to adapt the 
* iBox code as a WYMeditor plugin.
*
* Second, credit goes to Cody Lindley, the creator of ThickBox from whom I borrowed the 
* Mac background image technique. Additional credit should be given to Peter Paul Koch, 
* from whom, so many of us have learned a great deal about JavaScript. I am sure there are 
* many others whose work helped solve some problem or other.
*/

(function($) {

    var skybox = function(editor) {
        $.extend(editor, {
            skybox: this.init(editor)
        });
    };
    
    skybox.prototype = {
        parent: null,
        html: null,
        file:        'box.html',
        cacheName:   'skyboxHtml',
        error:       'There was an error loading the content.',
        fixedheight: '300px',
        overflow:    'auto',
        altOverlay:  '<iframe id="skybox_overlay"></iframe>',
        plugins: [],
        extensions: [],
        css: [],
        images: [
            'bg.skybox.top.gif',
            'bg.skybox.bottom.gif',
            'macFFBgHack.png',
            'skybox.close.gif'
        ],
        selectors: {
          'skybox'  : "#skybox",
          'wrapper' : "#skybox_wrapper",
          'overlay' : "#skybox_overlay",
          'header'  : "#skybox_header",
          'content' : "#skybox_content",
          'loading' : "#skybox_loading",
          'close'   : ".skybox_close",
          'image'   : ".ibox_image",
          'submit'  : ".wym_submit",
          'cancel'  : ".wym_cancel"
        },
        path: (function() {
            var scr  = document.getElementsByTagName("script");
            var path = scr[scr.length-1].getAttribute("src");
            var bits = path.split("/");
            return path.replace(bits[bits.length-1], "");
        })()
    };
    
    skybox.prototype.init = function(editor) {
        this.parent = editor;
        if (!window.skyboxCache) window.skyboxCache = [];
        if (!window.skyboxCache[this.cacheName]) 
        {
            window.skyboxCache[this.cacheName] = this.load(this.path + this.file);
        }
        this.html = window.skyboxCache[this.cacheName];
        this.preload();
        this.plugin(SkyBoxPlugin_Image);
        this.plugin(SkyBoxPlugin_Object);
        this.plugin(SkyBoxPlugin_Document);
        this.plugin(SkyBoxPlugin_iFrame);
        this.plugin(SkyBoxPlugin_HTML);
        return this;
    };
    
    skybox.prototype.preload = function() {
        var images = [];
        for (var i=0; i<this.images.length; i++)
        {
            images[i] = new Image();
            images[i].src    = this.path + this.images[i];
            images[i].width  = this.images[i].width;
            images[i].height = this.images[i].height;
        }
    };
    
    skybox.prototype.plugin = function (plugin) {
        if (!this.plugins[plugin]) this.plugins.push(plugin);
    };
    
    skybox.prototype.extension = function (extension) {
        if (!this.extensions[extension]) this.extensions.push(extension);
    };
    
    skybox.prototype.load = function(file) {
        return $.ajax({
            url: file,
            async: false
        }).responseText;
    };
    
    skybox.prototype.position = function(e) {
        var _this = this;
        if (typeof(e) != "undefined") _this = e.data;
        _this.css[_this.selectors.skybox] = {
            'height': '100%'
        };
        _this.css[_this.selectors.overlay] = {
            'height': '100%'
        };
        _this.style();
        _this.center(_this.selectors.wrapper);
    };
    
    skybox.prototype.style = function() {
        if (this.css)
        {
            for (selector in this.css)
            {
                $(selector).css(this.css[selector]);
            }
        }
    };
    
    skybox.prototype.content = function(content) {
        for (i=0; i<this.plugins.length; i++)
        {
            var plugin = new this.plugins[i](this);
            if (plugin.match(content))
            {
                return plugin.render(content);
            }
        }
        return this.error;
    };
    
    skybox.prototype.show = function(content) {
        if ($(this.selectors.skybox)) this.hide();
        
        var parent = [this.parent];
        
        $(this).trigger('beforeBuild', parent);
        
        this.build(content);
        
        $(this).trigger('beforeOverlay', parent);
        
        $(this.selectors.skybox).show();
        
        $(this).trigger('beforePosition', parent);
        
        this.position();
        
        $(this).trigger('beforeBind', parent);
        
        this.bindEvents();
        
        $(this).trigger('beforeShow', parent);
        
        $(this.selectors.wrapper).show();
        
        $(this.selectors.loading).hide();
        
        $(this).trigger('Loaded', parent);
    };
    
    skybox.prototype.build = function(content) {
        var _this = this;
        $(document.body).append(this.html);
        if ($.browser.msie && $.browser.version == 6)
        {
            $(this.selectors.overlay).remove();
            $(this.selectors.loading).before(this.altOverlay).next()
                .css({
                    'width': $(document.body).width() + 'px',
                    'height': $(document.body).height() + 'px'
                });
        }
        $(this.selectors.content).append(this.content(content));
    };
    
    skybox.prototype.bindEvents = function() {
        var _this = this;
        $(window).bind('resize', _this, _this.position);
        $(this.selectors.close).bind('click', _this, _this.hide);
    };
    
    skybox.prototype.hide = function(e) {
        var _this = this;
        if (typeof(e) != "undefined") _this = e.data;
        $(_this.selectors.skybox).remove();
    };
    
    skybox.prototype.center = function(selector) {
        $(selector).css({
            'left': Math.round(
                ($(window).width() - $(selector).width()) / 2
            ) + 'px',
            'top':  Math.round(
                ($(window).height() - $(selector).height()) / 2
            ) + 'px'
        });
    };

    // Plugins to handle individual media types
    
    var SkyBoxPlugin_HTML = function(skybox)
    {
        return {
            match: function() {
                return true;
            },
            render: function(html) {  
                return html;
            }
        }
    };
    
    var SkyBoxPlugin_Document = function(skybox) {
        return {
            match: function(url) {
                return url.indexOf('ajax:') == 0;
            },
            render: function(url, params) {
                url = url.replace('ajax:', '');
                skybox.css[skybox.selectors.content] = {
                    'height': skybox.fixedheight, 
                    'overflow': skybox.overflow
                };
                return skybox.load(url);
            }
        };
    };
    
    var SkyBoxPlugin_iFrame = function(skybox) {
        return {
            match: function(url) {
                return url.indexOf('iframe:') == 0;
            },
            render: function(url, params) {
                url = url.replace('iframe:', '');
                return '<iframe src="' + url + '"></iframe>';
            }
        };
    };
    
    var SkyBoxPlugin_Image = function(skybox)
    {
        return {
            match: function(url) {
                return url.match(/(\.jpg|\.jpeg|\.png|\.gif)$/gi);
            },
            render: function(url, params) {  
                var img = document.createElement('img');
                img.className = skybox.selectors.image
                img.src = url;
                img.onerror = function() {
                    return skybox.error;
                }
                return img;
            }
        }
    };
    
    var SkyBoxPlugin_Object = function(skybox)
    {
        return {
            match: function(url) {
                return url.indexOf('object:') == 0;
            },
            render: function(url) {
                url = url.replace('object:', '');
                skybox.css["#sybox_object"] = {
                    'width'  : '425px',
                    'height' : '355px',
                    'border' : 'none',
                    'margin-left': '14px'
                };
                return '<iframe src="' + url + '" id="sybox_object"></iframe>';
                
                /*
                '<div style="background: #000;">' + 
                    '<object width="425" height="355">' + 
                    '<param name="movie" value="' + url + '"/>' + 
                    '<param name="wmode" value="transparent"/>' + 
                    '<embed src="' + url + '" ' + 
                    'type="application/x-shockwave-flash" wmode="transparent" ' + 
                    'width="425" height="355"></embed></object></div>';
                */
            }
        }
    };
    
    $(WYMeditor).bind('Start', function(e, editor) {
        new skybox(editor);
    });
    
})(jQuery);