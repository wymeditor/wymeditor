/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.js
 *        Main JS file with core class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

var $j = jQuery;

var aWYM_INSTANCES     = new Array();
var sWYM_NAME          = "name";
var sWYM_INDEX         = "{Wym_Index}";
var sWYM_TOOLS         = "{wym_tools}";
var sWYM_CLASSES       = "{Wym_Classes}";
var sWYM_CONTAINERS    = "{Wym_Containers}";
var sWYM_HTML          = "{Wym_Html}";
var sWYM_IFRAME        = "{Wym_Iframe}";
var sWYM_STATUS        = "{Wym_Status}";
var sWYM_BODY          = "body";
var sWYM_STRING        = "string";
var sWYM_P             = "p";
var sWYM_H1            = "h1";
var sWYM_H2            = "h2";
var sWYM_H3            = "h3";
var sWYM_H4            = "h4";
var sWYM_H5            = "h5";
var sWYM_H6            = "h6";
var sWYM_PRE           = "pre";
var sWYM_BLOCKQUOTE    = "blockquote";
var sWYM_TD            = "td";
var sWYM_TH            = "th";
var sWYM_LINK          = "link";
var sWYM_IMAGE         = "image";
var sWYM_TABLE         = "table";
var sWYM_CREATE_LINK   = "CreateLink";
var sWYM_INSERT_IMAGE  = "InsertImage";
var sWYM_INSERT_TABLE  = "InsertTable";
var sWYM_TOGGLE_HTML   = "ToggleHtml";


var aWYM_CONTAINERS = new Array(sWYM_P,sWYM_H1,sWYM_H2,sWYM_H3,sWYM_H4,
        sWYM_H5,sWYM_H6,sWYM_PRE,sWYM_BLOCKQUOTE);

var aWYM_KEY = {
    BACKSPACE: 8,
    ENTER: 13,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    CURSOR: new Array(37, 38, 39, 40),
    DELETE: 46
};

var aWYM_NODE = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3
};



/**
 * Replace an HTML element by WYMeditor
 *
 * @example $(".wymeditor").wymeditor(
 *                {
 *
 *                }
 *            );
 * @desc Example description here
 * 
 * @name WYMeditor
 * @description WYMeditor is a web-based WYSIWYM XHTML editor
 * @param Hash hash A hash of parameters
 * @option Integer iExample Description here
 * @option String sExample Description here
 *
 * @type jQuery
 * @cat Plugins/WYMeditor
 * @author Jean-Francois Hovinne
 */
$j.fn.wymeditor = function(options, callback) {

    options = $j.extend({

        sHtml:              "",

        sBoxHtml:           "<div class='wym_box'>"
                            + "<div class='wym_area_top'>" + sWYM_TOOLS + "</div>"
                            + "<div class='wym_area_left'></div>"
                            + "<div class='wym_area_right'>" + sWYM_CONTAINERS + sWYM_CLASSES + "</div>"
                            + "<div class='wym_area_main'>" + sWYM_HTML + sWYM_IFRAME + sWYM_STATUS + "</div>"
                            + "<div class='wym_area_bottom'>" + "</div>"
                            + "</div>",

        sIframeHtml:        "<div class='wym_iframe wym_section'>"
                            + "<iframe "
                            + "src='wymeditor/wymiframe.html' "
                            + "onload='window.parent.aWYM_INSTANCES[" + sWYM_INDEX + "].initIframe(this)' "
                            + "></iframe>"
                            + "</div>",

        sToolsHtml:         "<div class='wym_tools wym_section'>"
                            + "<h2>Tools</h2>"
                            + "<ul>"
                            + "<li class='wym_tools_strong'><a href='#' name='Bold'>{Strong}</a></li>"
                            + "<li class='wym_tools_emphasis'><a href='#' name='Italic'>{Emphasis}</a></li>"
                            + "<li class='wym_tools_superscript'><a href='#' name='Superscript'>{Superscript}</a></li>"
                            + "<li class='wym_tools_subscript'><a href='#' name='Subscript'>{Subscript}</a></li>"
                            + "<li class='wym_tools_ordered_list'><a href='#' name='InsertOrderedList'>{Ordered_List}</a></li>"
                            + "<li class='wym_tools_unordered_list'><a href='#' name='InsertUnorderedList'>{Unordered_List}</a></li>"
                            + "<li class='wym_tools_indent'><a href='#' name='Indent'>{Indent}</a></li>"
                            + "<li class='wym_tools_outdent'><a href='#' name='Outdent'>{Outdent}</a></li>"
                            + "<li class='wym_tools_undo'><a href='#' name='Undo'>{Undo}</a></li>"
                            + "<li class='wym_tools_redo'><a href='#' name='Redo'>{Redo}</a></li>"
                            + "<li class='wym_tools_link'><a href='#' name='CreateLink'>{Link}</a></li>"
                            + "<li class='wym_tools_unlink'><a href='#' name='Unlink'>{Unlink}</a></li>"
                            + "<li class='wym_tools_image'><a href='#' name='InsertImage'>{Image}</a></li>"
                            + "<li class='wym_tools_table'><a href='#' name='InsertTable'>{Table}</a></li>"
                            + "<li class='wym_tools_html'><a href='#' name='ToggleHtml'>{HTML}</a></li>"
                            + "</ul>"
                            + "</div>",

        sContainersHtml:    "<div class='wym_containers wym_section'>"
                            + "<h2>Containers</h2>"
                            + "<ul>"
                            + "<li class='wym_containers_p'><a href='#' name='P'>Paragraph</a></li>"
                            + "<li class='wym_containers_h1'><a href='#' name='H1'>Heading 1</a></li>"
                            + "<li class='wym_containers_h2'><a href='#' name='H2'>Heading 2</a></li>"
                            + "<li class='wym_containers_h3'><a href='#' name='H3'>Heading 3</a></li>"
                            + "<li class='wym_containers_h4'><a href='#' name='H4'>Heading 4</a></li>"
                            + "<li class='wym_containers_h5'><a href='#' name='H5'>Heading 5</a></li>"
                            + "<li class='wym_containers_h6'><a href='#' name='H6'>Heading 6</a></li>"
                            + "<li class='wym_containers_pre'><a href='#' name='PRE'>Preformatted</a></li>"
                            + "<li class='wym_containers_blockquote'><a href='#' name='BLOCKQUOTE'>Blockquote</a></li>"
                            + "<li class='wym_containers_th'><a href='#' name='TH'>Table Header</a></li>"
                            + "</ul>"
                            + "</div>",

        sClassesHtml:       "<div class='wym_classes wym_section'>"
                            + "<h2>Classes</h2>"
                            + "</div>",

        sStatusHtml:        "<div class='wym_status wym_section'>"
                            + "<h2>Status</h2>"
                            + "</div>",

        sHtmlHtml:          "<div class='wym_html wym_section'>"
                            + "<h2>Source code</h2>"
                            + "<textarea class='wym_html_val'></textarea>"
                            + "</div>",

        sBoxSelector:       ".wym_box",
        sToolsSelector:     ".wym_tools",
        sClassesSelector:   ".wym_classes",
        sContainersSelector:".wym_containers",
        sHtmlSelector:      ".wym_html",
        sIframeSelector:    ".wym_iframe iframe",
        sStatusSelector:    ".wym_status",
        sToolsSelector:     ".wym_tools a",
        sContainerSelector: ".wym_containers a",
        sHtmlValSelector:   ".wym_html_val",
        
        sStringDelimiterLeft: "{",
        sStringDelimiterRight:"}"

    }, options);

    return this.each(function(i) {

        new Wymeditor($j(this),i,options,callback);
    });
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
$j.extend({
    wymeditors: function(i) {
        return (aWYM_INSTANCES[i]);
    },
    wymstrings: function(sKey) {
        return (aWYM_STRINGS[sKey]);
    }
});

/* @name Wymeditor
 * @description WYMeditor class
 */
function Wymeditor(elem,index,options,callback) {

    aWYM_INSTANCES[index] = this;

    this._element = elem;
    this._index = index;
    this._options = options;
    this._html = $j(elem).val();
    this._callback = callback;
    
    if(this._options.sHtml) this._html = this._options.sHtml;
    
    this.selection = new WymSelection();
    
    this.init();
    
};

/* @name init
 * @description Initializes a WYMeditor instance
 */
Wymeditor.prototype.init = function() {

    //copy the instance
    var wym = this;

    //load subclass - browser specific
    if ($j.browser.msie) {
        var WymClass = new WymClassExplorer(this);
        var WymSel = new WymSelExplorer(this);
    }
    else if ($j.browser.mozilla) {
        var WymClass = new WymClassMozilla(this);
        var WymSel = new WymSelMozilla(this);
    }
    else if ($j.browser.opera) {
        var WymClass = new WymClassOpera(this);
        var WymSel = new WymSelOpera(this);
    }
    else if ($j.browser.safari) {
        var WymClass = new WymClassSafari(this);
    }
    else {
        //TODO: handle unsupported browsers
    }

    //copy the subclass methods
/*
    for (prop in WymClass) {
        this[prop] = WymClass[prop];
    }
    
    for (prop in WymSel) {
        this.selection[prop] = WymSel[prop];
    }
*/
    $j.extend(this, WymClass);
    $j.extend(this.selection, WymSel);


    //load wymbox
    this._box = $j(this._element).hide().after(this._options.sBoxHtml).next();
    
    //construct the iframe
    var sIframeHtml = this._options.sIframeHtml;
    sIframeHtml = sIframeHtml.replace(sWYM_INDEX,this._index);
    
    //construct wymbox
    var sBoxHtml = $j(this._box).html();
    
    sBoxHtml = sBoxHtml.replace(sWYM_TOOLS, this._options.sToolsHtml);
    sBoxHtml = sBoxHtml.replace(sWYM_CONTAINERS, this._options.sContainersHtml);
    sBoxHtml = sBoxHtml.replace(sWYM_CLASSES, this._options.sClassesHtml);
    sBoxHtml = sBoxHtml.replace(sWYM_HTML, this._options.sHtmlHtml);
    sBoxHtml = sBoxHtml.replace(sWYM_IFRAME, sIframeHtml);
    sBoxHtml = sBoxHtml.replace(sWYM_STATUS, this._options.sStatusHtml);
    
    //l10n
    sBoxHtml = this.replaceStrings(sBoxHtml);
    
    //load html in wymbox
    $j(this._box).html(sBoxHtml);
    
    //hide the html value
    $j(this._box).find(this._options.sHtmlSelector).hide();

    //handle click event on tools buttons
    $j(this._box).find(this._options.sToolsSelector).click(function() {
        wym.exec($(this).attr(sWYM_NAME));
        return(false);
    });
    
    //handle click event on containers buttons
    $j(this._box).find(this._options.sContainerSelector).click(function() {
        wym.container($(this).attr(sWYM_NAME));
        return(false);
    });
    
    //handle keyup event on html value: set the editor value
    $j(this._box).find(this._options.sHtmlValSelector).keyup(function() {
        $j(wym._doc.body).html($j(this).val());
    });
};

Wymeditor.prototype.ready = function() {
    return(this._doc != null);
};


/********** BASE METHODS **********/
Wymeditor.prototype.handleEvents = function() {
//    var _wym = this;
    $j(this._doc).bind('keydown', {wym: this._wym}, this.handleKeydown);
    $j(this._doc).bind('keypress', {wym: this._wym}, this.handleKeypress);
    $j(this._doc).bind('keyup', {wym: this._wym}, this.handleKeyup);
    // NOTE v.mische If you've multiple instances of WYMeditor, mousedown will
    // be triggered in the instance you were and not in the one you will be
    $j(this._doc).bind('mousedown', {wym: this._wym}, this.handleMousedown);
    $j(this._doc).bind('mouseup', {wym: this._wym}, this.handleMouseup);
};



Wymeditor.prototype.handleKeydown = function(evt) {
//    alert("keydown:"+evt.data._iframe.contentWindow);//._iframe.contentWindow
//    var sBlockElements = sWYM_P+","+sWYM_H1+","+sWYM_H2+","+sWYM_H3+","+sWYM_H4
//            +","+sWYM_H5+","+sWYM_H6+","+sWYM_PRE+","+sWYM_BLOCKQUOTE;

    var sContainers = aWYM_CONTAINERS.join(",");

    var _wym = evt.data.wym;
    var _sel = _wym.selection.getSelection();

/*
    // some small tests
    if (_sel.isAtStart(sContainers))
        alert("isAtStart: "+_sel.startNode.parentNode.nodeName);
    if (_sel.isAtEnd(sContainers))
        alert("isAtEnd: "+_sel.endNode.parentNode.nodeName);
    if (evt.keyCode==aWYM_KEY.DELETE)
        if(_sel.deleteIfExpanded())
            return false;
    if (evt.keyCode==aWYM_KEY.HOME)
    {
        //_sel.cursorToStart(_sel.startNode);
        _sel.cursorToStart(_sel.container);
        return false;
    }
    if (evt.keyCode==aWYM_KEY.END)
    {
        //_sel.cursorToEnd(_sel.endNode);
        _sel.cursorToEnd(_sel.container);
        return false;
    }
*/
};
Wymeditor.prototype.handleKeypress = function(evt) {
};
Wymeditor.prototype.handleKeyup = function(evt) {
};
Wymeditor.prototype.handleMousedown = function(evt) {
//alert("mouseDown:"+evt.data.wym._index);
};
Wymeditor.prototype.handleMouseup = function(evt) {
//alert("mouseUp:"+evt.data.wym._index);
};


/* @name doc
 * @description Get the edited document
 */
Wymeditor.prototype.doc = function() {
    return(this._doc);
}

/* @name box
 * @description Get the edited document
 */
Wymeditor.prototype.box = function() {
    return(this._box);
}

/* @name html
 * @description Get/Set the html value
 */
Wymeditor.prototype.html = function(sHtml) {

    if(sHtml) $j(this.doc().body).html(sHtml);
    else return($j(this.doc().body).html());
};

/* @name exec
 * @description Executes a button command
 */
Wymeditor.prototype.exec = function(cmd) {
    
    //base function for execCommand
    //open a dialog or exec
    switch(cmd) {    
        case sWYM_CREATE_LINK:
            var container = this.container();
            if(container) this.dialog(sWYM_LINK);
        break;
        
        case sWYM_INSERT_IMAGE:
            this.dialog(sWYM_IMAGE);
        break;
        
        case sWYM_INSERT_TABLE:
            this.dialog(sWYM_TABLE);
        break;
        
        case sWYM_TOGGLE_HTML:
            this.update();
            this.toggleHtml();
        break;
        
        default:
            this._exec(cmd);
        break;
    }
};

/* @name container
 * @description Get/Set the selected container
 */
Wymeditor.prototype.container = function(sType) {

    if(sType) {
    
        var container = null;
        
        if(sType.toLowerCase() == sWYM_TH) {
        
            container = this.container();
            
            //find the TD or TH container
            switch(container.tagName.toLowerCase()) {
            
                case sWYM_TD: case sWYM_TH:
                    break;
                default:
                    var aTypes = new Array(sWYM_TD,sWYM_TH);
                    container = this.findUp(aTypes);
                    break;
            }
            
            //if it exists, switch
            if(container!=null) {
            
                sType = (container.tagName.toLowerCase() == sWYM_TD)? sWYM_TH: sWYM_TD;
                this.switchTo(container,sType);
                this.update();
            }
        } else {
    
            //set the container type
            var aTypes=new Array(sWYM_P,sWYM_H1,sWYM_H2,sWYM_H3,sWYM_H4,sWYM_H5,sWYM_H6,sWYM_PRE,sWYM_BLOCKQUOTE);
            container = this.findUp(aTypes);
            
            if(container) {
    
                var newNode = null;
    
                //blockquotes must contain a block level element
                if(sType.toLowerCase() == sWYM_BLOCKQUOTE) {
                
                    var blockquote = this.findUp(sWYM_BLOCKQUOTE);
                    
                    if(blockquote == null) {
                    
                        newNode = this._doc.createElement(sType);
                        container.parentNode.insertBefore(newNode,container);
                        newNode.appendChild(container);
                        
                    } else {
                    
                        var nodes = blockquote.childNodes;
                        var lgt = nodes.length;
                        for(var x=0; x<lgt; x++) {
                            blockquote.parentNode.insertBefore(nodes.item(0),blockquote);
                        }
                        blockquote.parentNode.removeChild(blockquote);
                    }
                }
                
                else this.switchTo(container,sType);
            
                this.update();
            }
        }
    }
    else return(this.selected());
};

/* @name finUp
 * @description Returns the first parent or self container, based on its type
 */
Wymeditor.prototype.findUp = function(mFilter) {

    //mFilter is a string or an array of strings

    var container = this.container();
    var tagname = container.tagName.toLowerCase();
    
    if(typeof(mFilter) == sWYM_STRING) {

        while(tagname != mFilter && tagname != sWYM_BODY) {
        
            container = container.parentNode;
            tagname = container.tagName.toLowerCase();
        }
    
    } else {
    
        var bFound = false;
        
        while(!bFound && tagname != sWYM_BODY) {
            for(var i = 0; i<mFilter.length; i++) {
                if(tagname == mFilter[i]) {
                    bFound = true;
                    break;
                }
            }
            if(!bFound) {
                container = container.parentNode;
                tagname = container.tagName.toLowerCase();
            }
        }
    }
    
    if(tagname != sWYM_BODY) return(container);
    else return(null);
};

/* @name switchTo
 * @description Switch the node's type
 */
Wymeditor.prototype.switchTo = function(node,sType) {

    var newNode = this._doc.createElement(sType);
    var html = $j(node).html();
    node.parentNode.replaceChild(newNode,node);
    $j(newNode).html(html);
};

/********** UI RELATED **********/

Wymeditor.prototype.replaceStrings = function(sVal) {

    for (var key in aWYM_STRINGS) {
        sVal = sVal.replace(this._options.sStringDelimiterLeft + key + this._options.sStringDelimiterRight, aWYM_STRINGS[key]);
    }
    return(sVal);
};

/* @name status
 * @description Prints a status message
 */
Wymeditor.prototype.status = function(sMessage) {

    //print status message
    $j(this._box).find(this._options.sStatusSelector).html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
Wymeditor.prototype.update = function() {

    var html = this.xhtml();
    $j(this._element).val(html);
    $j(this._box).find(this._options.sHtmlValSelector).val(html);
};

/* @name dialog
 * @description Opens a dialog box
 */
Wymeditor.prototype.dialog = function(sType) {

    console.info(this.selection);
    console.info(this.selection.test);
    console.info(this.selection.isAtStart());
    console.info(this.selection.myTest());
};

/* @name toggleHtml
 * @description Shows/Hides the HTML
 */
Wymeditor.prototype.toggleHtml = function() {

    $j(this._box).find(this._options.sHtmlSelector).toggle();
};

/********** SELECTION API **********/

function WymSelection() {
    this.test = "test from WymSelection";
};


WymSelection.prototype = {
    /* The following properties where set in the browser specific file (in
     * getSelection()):
     * this.original
     * this.startNode
     * this.endNode
     * this.startOffset
     * this.endOffset
     * this.collapsed
     * this.container
     */

    isAtStart: function(jqexpr)
    {
        var parent = $j(this.startNode).parentsOrSelf(jqexpr);

        // jqexpr isn't a parent of the current cursor position
        if (parent.length==0)
            return false;
        else
            parent = parent[0];


        for (var n=this.startNode; n!=parent; n=n.parentNode)
        {
            //if (n.nodeType == nodeType.TEXT)
            if (n.nodeType == aWYM_NODE.TEXT)
            {
                if (this.startOffset != 0)
                    return false;
            }
            var firstChild = n.parentNode.firstChild;
            // node isn't first child => cursor can't be at the beginning
            // in gecko there the first child could be a phantom node

            // sometimes also whitespacenodes which aren't phatom nodes
            // get stripped, but this is ok, as this is a wysiwym editor
            if ((firstChild != n
                    || ($(firstChild).isPhantomNode()
                        && firstChild.nextSibling != n)))
            {
                return false;
            }
        }

        if (this.startOffset == 0)
            return true;
        else
            return false;
    },

    isAtEnd: function(jqexpr)
    {
        var parent = $(this.endNode).parentsOrSelf(jqexpr);

        // jqexpr isn't a parent of the current cursor position
        if (parent.length==0)
            return false;
        else
            parent = parent[0];


        // This is the case if, e.g ("|" = cursor): <p>textnode|<br/></p>,
        // there the offset of endNode (endOffset) is 1 (behind the first node
        // of <p>)
        if (this.endNode == parent)
        {
            // NOTE I don't know if it is a good idea to delete the <br>
            // here, as "atEnd()" probably shouldn't change the dom tree,
            // but only searching it
            if (this.endNode.lastChild.nodeName == "BR")
                this.endNode.removeChild(endNode.lastChild);

            // if cursor is really at the end
            if (this.endOffset > 0 &&
                    this.endNode.childNodes[this.endOffset-1].nextSibling==null)
            {
                return true;
            }
        }
        else
        {
            for (var n=this.endNode; n!=parent; n=n.parentNode)
            {
                if (n.nodeType == aWYM_NODE.TEXT)
                {
                    if (this.endOffset != this.endNode.data.length)
                        return false;
                }
                else
                {
                    var lastChild = n.parentNode.lastChild;
                    // node isn't last child => cursor can't be at the end
                    // (is this true?) in gecko there the last child could be a
                    //     phantom node

                    // sometimes also whitespacenodes which aren't phatom nodes
                    // get stripped, but this is ok, as this is a wysiwym editor
                    if ((lastChild != n) ||
                            ($(lastChild).isPhantomNode()
                            && lastChild.previousSibling != n))
                    {
                        return false;
                    }
                }
            }
        }

        if (this.endOffset == this.endNode.length)
            return true;
        else
            return false;
    },

    collapse: function(start)
    {

    }

    cursorToStart: function(jqexpr)

    cursorToEnd: function(jqexpr)
    {
        if (jqexpr.nodeType == aWYM_NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var lastTextNode = $(jqexpr)[0];

        while (lastTextNode.nodeType!=aWYM_NODE.TEXT)
        {
            if (!lastTextNode.hasChildNodes())
                break;
            lastTextNode = lastTextNode.lastChild;
        }

        if (isPhantomNode(lastTextNode))
            lastTextNode = lastTextNode.previousSibling;

        // e.g. an <img/>
        if (lastTextNode.nodeType == aWYM_NODE.ELEMENT)
            this.original.collapse(lastTextNode.parentNode,
                lastTextNode.parentNode.childNodes.length);
        else
            this.original.collapse(lastTextNode, lastTextNode.length);
    }
    /* Implmented in browser specific file:
     *  - deleteIfExpanded()
     *  - cursorToStart()
     *  - cursorToEnd()
     */
};

WymSelection.prototype.myTest = function() {

    return("myTest from WymSelection");
};


/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
$.fn.isPhantomNode = function()
{
    if (this[0].nodeType == 3)
        return !(/[^\t\n\r ]/.test(this[0].data));

    return false;
}
function isPhantomNode(n)
{
    if (n.nodeType == 3)
        return !(/[^\t\n\r ]/.test(n.data));

    return false;
}



// Returns the Parents or the node itself
// jqexpr = a jQuery expression
$.fn.parentsOrSelf = function(jqexpr)
{
    var n = this;

    if (n[0].nodeType == 3)
        n = n.parents().lt(1);

//    if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
    if (n.filter(jqexpr).size() == 1)
        return n;
    else
        return n.parents(jqexpr).lt(1);
}


// from http://forum.de.selfhtml.org/archiv/2004/3/t76079/#m438193 (2007-02-06)
Array.prototype.contains = function (elem) {
//  var i;
  for (var i = 0; i < this.length; i++) {
    if (this[i] === elem) {
      return true;
    }
  }
  return false;
};

