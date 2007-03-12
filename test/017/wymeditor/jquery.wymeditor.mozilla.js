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

WymSelMozilla.prototype.isAtStart = function() {

    return("isAtStart from WymSelMozilla");
    
};
