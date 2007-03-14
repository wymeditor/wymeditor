﻿/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2007 H.O.net - http://www.honet.be/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.mozilla.js
 *        Gecko specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassMozilla(wym) {

    this._wym = wym;
};

WymClassMozilla.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;

    this._doc.title = this._wym._index;
    this._doc.designMode="on";
    this._doc.execCommand("styleWithCSS",'',false);

    this.html(this._wym._html);
    if(this._callback) this._callback();

    // handle events within editor
    // NOTE v.mische this needs to be here and not in the generic fi
    this.handleEvents();
};

WymClassMozilla.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,'',param);
    else this._doc.execCommand(cmd,'',null);
};

/* @name selected
 * @description Returns the selected container
 */
WymClassMozilla.prototype.selected = function() {

    var sel=this._iframe.contentWindow.getSelection();
    var node=sel.focusNode;
    if(node.nodeName=="#text")return(node.parentNode);
    else return(node);
};


/* @name xhtml
 * @description Cleans up the HTML
 */
WymClassMozilla.prototype.xhtml = function() {

    var sHtml = this._wym.html();
    
    var flagTag=false,begTag=false;
    var tag="",ret="",attr="";
    var level=0;
    
    for(var x=0;x<sHtml.length;x++)
    {
        c=sHtml.charAt(x);
        
        if(begTag)
        {
            if(c==" " || c==">")
            {
                switch(tag)
                {
                    case "b":
                        tag="strong";
                        break;
                    case "/b":
                        tag="/strong";
                        break;
                    case "i":
                        tag="em";
                        break;
                    case "/i":
                        tag="/em";
                        break;
                    case "br":
                        tag="br /"
                        break;
                    case "ol": case "ul":
                        level++;
                        if(level>1 && ret.substr(ret.length-5)=="</li>")
                            ret=ret.substr(0,ret.length-5);
                        break;
                    default:
                        break;
                }
                begTag=false;
            }
            else tag+=c;
        }
        
        if(c=="<"){begTag=true;flagTag=true;}
        
        if(flagTag)
        {
            if(c==">")
            {
                flagTag=false;
                switch(tag)
                {
                    case "img":
                    case "hr":
                    case "input":
                    case "link":
                    case "base":
                    case "basefont":
                    case "col":
                    case "frame":
                    case "isindex":
                    case "meta":
                    case "param":
                        ret+="<"+tag+attr+"/>";
                        break;
                    case "/ol": case "/ul":
                        if(level>1)ret+="<"+tag+attr+"></li>";
                        else ret+="<"+tag+attr+">";
                        level--;
                        break;
                    default:
                        ret+="<"+tag+attr+">";
                        break;
                }
                
                tag="";
                attr="";
            }
            else if(!begTag)
            {
                attr+=c;
            }
        }
        else ret+=c;    
    }
    return(ret);    
};

/********** SELECTION API **********/

function WymSelMozilla(wym) {

    this._wym = wym;
};

WymSelMozilla.prototype = {
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


