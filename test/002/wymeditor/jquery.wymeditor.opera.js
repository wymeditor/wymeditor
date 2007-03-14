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
 *        jquery.wymeditor.opera.js
 *        Opera specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassOpera(wym) {

    this._wym = wym;
};

WymClassOpera.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;

    this._doc.title = this._wym._index;
    this._doc.designMode="on";

    this.html(this._wym._html);
    if(this._callback) this._callback();

    // handle events within editor
    // NOTE v.mische this needs to be here and not in the generic file
    this.handleEvents();
};

WymClassOpera.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,false,param);
    else this._doc.execCommand(cmd);
};

WymClassOpera.prototype.selected = function() {

    var sel=this._iframe.contentWindow.getSelection();
    var node=sel.focusNode;
    if(node.nodeName=="#text")return(node.parentNode);
    else return(node);
};

WymClassOpera.prototype.xhtml = function() {

    var sHtml = this._wym.html();
    return sHtml;
};


/********** SELECTION API **********/

function WymSelOpera(wym) {

    this._wym = wym;
};

WymSelOpera.prototype = {
    getSelection: function()
    {
        var _sel = this._wym._iframe.contentWindow.getSelection();
        // NOTE v.mische can startNode/endNote be phantom nodes?
        this.startNode = _sel.getRangeAt(0).startContainer;
        this.endNode = _sel.getRangeAt(0).endContainer;
        this.startOffset = _sel.getRangeAt(0).startOffset;
        this.endOffset = _sel.getRangeAt(0).endOffset;
        this.isCollapsed = _sel.isCollapsed;
        this.original = _sel;
        this.container = $j(this.startNode).parentsOrSelf(
                aWYM_CONTAINERS.join(","));

        return this;
    },

    cursorToStart: function(jqexpr)
    {
        if (jqexpr.nodeType == aWYM_NODE.TEXT)
            jqexpr = jqexpr.parentNode;

        var firstTextNode = $(jqexpr)[0];

        while (firstTextNode.nodeType!=aWYM_NODE.TEXT)
        {
            if (!firstTextNode.hasChildNodes())
                break;
            firstTextNode = firstTextNode.firstChild;
        }

        if (isPhantomNode(firstTextNode))
            firstTextNode = firstTextNode.nextSibling;

        // e.g. an <img/>
        if (firstTextNode.nodeType == aWYM_NODE.ELEMENT)
            this.original.collapse(firstTextNode.parentNode, 0);
        else
            this.original.collapse(firstTextNode, 0);
    },

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
    },

    deleteIfExpanded: function()
    {
        if(!this.original.isCollapsed)
        {
            this.original.deleteFromDocument();
            return true;
        }
        return false;
    }
};

