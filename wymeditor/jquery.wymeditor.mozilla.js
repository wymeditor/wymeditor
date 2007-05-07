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
    
    //init html value
    this.html(this._wym._html);
    
    //init designMode
    this._doc.designMode = "on";
    this._doc.execCommand("styleWithCSS", '', false);
    
    //pre-bind functions
    if($j.isFunction(this._options.fPreBind)) this._options.fPreBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    // bidn key down events for enabling keyboar shortcuts
    $j(this._doc).bind("keydown", this.keydown);
    
    //bind editor events
    $j(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if($j.isFunction(this._options.fPostInit)) this._options.fPostInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

/* @name html
 * @description Get/Set the html value
 */
WymClassMozilla.prototype.html = function(sHtml) {

  if(sHtml) {
  
    //disable designMode
    this._doc.designMode = "off";
    
    //replace em by i and strong by bold
    //(designMode issue)
    sHtml = sHtml.replace(/<em([^>]*)>/gi, "<i$1>")
      .replace(/<\/em>/gi, "</i>")
      .replace(/<strong([^>]*)>/gi, "<b$1>")
      .replace(/<\/strong>/gi, "</b>");
    
    //update the html body
    $j(this._doc.body).html(sHtml);
    
    //re-init designMode
    this._doc.designMode = "on";
    this._doc.execCommand("styleWithCSS", '', false);
  }
  else return($j(this._doc.body).html());
};

WymClassMozilla.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,'',param);
    else this._doc.execCommand(cmd,'',null);
    
    //set to P if parent = BODY
    var container = this.selected();
    if(container.tagName.toLowerCase() == sWYM_BODY)
      this._exec(sWYM_FORMAT_BLOCK, sWYM_P);
    
    //add event handlers on doc elements
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

//keyup handler, mainly used for cleanups
WymClassMozilla.prototype.keyup = function(evt) {
  
  //'this' is the doc
  var wym = aWYM_INSTANCES[this.title];
  
  wym._selected_image = null;
  
	if(evt.keyCode == 13 && !evt.shiftKey) {
	
	  //RETURN key
		//cleanup <br><br> between paragraphs
		$j(wym._doc.body).children(sWYM_BR).remove();
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

		if(name == sWYM_BODY) wym._exec(sWYM_FORMAT_BLOCK, sWYM_P);
	}
};

//keydown handler,used for keyboard shortcuts
WymClassMozilla.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = aWYM_INSTANCES[this.title];
  
  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      wym._exec('Bold');
      return false;
    }
    if(evt.keyCode == 73){
      wym._exec('Italic');
      return false;
    }
  }
}

WymClassMozilla.prototype.setFocusToNode = function(node) {
    var range = document.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();
};
