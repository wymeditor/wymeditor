/*
 * Desktop plugin for WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2011  Calvin Schwenzfeier
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * File Authors:
 *      Calvin Schwenzfeier (calvin DOT schwenzfeier A~T gmail dotCOM)
 */

WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents = new Object();

/*
 *################################## WARNING ###################################
 *##                                                                          ##
 *##   File is generated by the .../scripts/create_tool_defaults.pl script!   ##
 *##                                                                          ##
 *##  To disable auto-generation of this file, place a multi-line comment in  ##
 *##  the space before the tool entry in the .availableTools() method in the  ##
 *##  jquery.wymeditor.desktop.js file.                                       ##
 *##                                                                          ##
 *##############################################################################
 */

/**
 * Set the parent object for this HelpContents object.
 * 
 * @param parentObj  A reference to the parent object of this HelpContents object.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.setParent = function(parentObj) {
    this.parent = parentObj;
};

/**
 * Default event handler for 'blur' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.blur = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'blur' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'change' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.change = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'change' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'click' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.click = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'click' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'dblclick' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.dblclick = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'dblclick' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'error' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.error = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected an 'error' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'focus' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.focus = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'focus' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'focusin' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.focusin = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'focusin' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'focusout' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.focusout = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'focusout' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'hover' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.hover = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'hover' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'keydown' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.keydown = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'keydown' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'keypress' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.keypress = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'keypress' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'keyup' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.keyup = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'keyup' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'load' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.load = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'load' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mousedown' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mousedown = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mousedown' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mouseenter' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mouseenter = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mouseenter' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mouseleave' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mouseleave = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mouseleave' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mousemove' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mousemove = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mousemove' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mouseout' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mouseout = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mouseout' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mouseover' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mouseover = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mouseover' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'mouseup' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.mouseup = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'mouseup' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'ready' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.ready = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'ready' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'resize' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.resize = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'resize' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'scroll' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.scroll = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'scroll' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'select' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.select = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'select' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'submit' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.submit = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected a 'submit' event.");
        console.log(eventObj);
    }
};

/**
 * Default event handler for 'toggle' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.toggle = [
    function(eventObj) {
        if( (this.selfObject.parent.DEBUG != undefined) &&
            (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
            this.selfObject.parent.DEBUG ) {
            console.log("The HelpContents tool detected a 'toggle' event (click one).");
            console.log(eventObj);
        }
    },
    function(eventObj) {
        if( (this.selfObject.parent.DEBUG != undefined) &&
            (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
            this.selfObject.parent.DEBUG ) {
            console.log("The HelpContents tool detected a 'toggle' event (click two).");
            console.log(eventObj);
        }
    }
];

/**
 * Default event handler for 'unload' events on the HelpContents tool.
 */
WYMeditor.editor.prototype.desktop.toolFunctions.HelpContents.unload = function(eventObj) {
    if( (this.selfObject.parent.DEBUG != undefined) &&
        (typeof(this.selfObject.parent.DEBUG) == "boolean") &&
        this.selfObject.parent.DEBUG ) {
        console.log("The HelpContents tool detected an 'unload' event.");
        console.log(eventObj);
    }
};

