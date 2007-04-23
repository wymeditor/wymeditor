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
 *        Volker Mische (vmx@gmx.de)
 */

function WymClassMozilla(wym) {

    this._wym = wym;
    this._class = "class";
};

WymClassMozilla.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.aEditorCss);

    for(var i = 0; i < aCss.length; i++) {
    var oCss = aCss[i];
    if(oCss.name && oCss.css)
      styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
    }

    this._doc.title = this._wym._index;
    
    //init designMode
    this._doc.designMode = "on";
    this._doc.execCommand("styleWithCSS", '', false);

    //init html value
    this.html(this._wym._html);
    
    //pre-bind functions
    if($j.isFunction(this._options.fPreBind)) this._options.fPreBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor events
    $j(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if($j.isFunction(this._options.fPostInit)) this._options.fPostInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WymClassMozilla.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,'',param);
    else this._doc.execCommand(cmd,'',null);
    
    this.listen();
};

/* @name selected
 * @description Returns the selected container
 */
WymClassMozilla.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if(node.nodeName == "#text") return(node.parentNode);
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
                        tag="br /";
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


WymClassMozilla.prototype.listen = function() {

    //mouseup handler
    var wym = this;
    $j(this._doc.body).find("*").each(function() {
      $j(this).get(0).addEventListener('mouseup',wym.mouseup,false);
    });
};

//keyup handler, mainly used for cleanups
WymClassMozilla.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = aWYM_INSTANCES[this.title];
  
  wym._selected_image = null;

	if(evt.keyCode == 13 && !evt.shiftKey) {
	
	  //RETURN key
		//cleanup <br><br> between paragraphs
		$j(wym._doc.body).children("br").remove();
	}
	
	else if(evt.keyCode != 8 && evt.keyCode != 46
	    && evt.keyCode!=17 && !evt.ctrlKey)	{
	    
	  //NOT BACKSPACE, NOT DELETE, NOT CTRL
		//text nodes replaced by P
		
		var container = wym.selected();
		var name = container.tagName.toLowerCase();

		//fix forbidden main containers
		if(
			name == "strong" ||
			name == "b" ||
			name == "em" ||
			name == "i" ||
			name == "sub" ||
			name == "sup" ||
			name == "a"

		) name = container.parentNode.tagName.toLowerCase();

		if(name == "body") wym._exec("formatblock", "P");
	}
};

//mouseup handler
WymClassMozilla.prototype.mouseup = function(evt) {
  var wym = aWYM_INSTANCES[this.ownerDocument.title];
  if(this.tagName.toLowerCase() == "img") wym._selected_image = this;
  else wym._selected_image = null;
  evt.stopPropagation();
};
