/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
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
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Volker Mische (vmx a-t gmx dotde)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel a-t gmail dotcom)
 */

WYMeditor.WymClassMozilla = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

WYMeditor.WymClassMozilla.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    //add css rules from options
    
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);
    
    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);
    
    //init html value
    this.html(this._wym._html);
    
    //init designMode
    this.enableDesignMode();
    
    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", this.enableDesignMode);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

/* @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassMozilla.prototype.html = function(html) {

  if(typeof html === 'string') {
  
    //disable designMode
    try { this._doc.designMode = "off"; } catch(e) { };
    
    //replace em by i and strong by bold
    //(designMode issue)
    html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>")
      .replace(/<\/em>/gi, "</i>")
      .replace(/<strong(\b[^>]*)>/gi, "<b$1>")
      .replace(/<\/strong>/gi, "</b>");

    //update the html body
    jQuery(this._doc.body).html(html);
    
    //re-init designMode
    this.enableDesignMode();
  }
  else return(jQuery(this._doc.body).html());
};

WYMeditor.WymClassMozilla.prototype._exec = function(cmd,param) {

    if(!this.selected()) return(false);

    switch(cmd) {
    
    case WYMeditor.INDENT: case WYMeditor.OUTDENT:
    
        var focusNode = this.selected();    
        var sel = this._iframe.contentWindow.getSelection();
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
        
        focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
        anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);
        
        if(focusNode && focusNode == anchorNode
          && focusNode.tagName.toLowerCase() == WYMeditor.LI) {

            var ancestor = focusNode.parentNode.parentNode;

            if(focusNode.parentNode.childNodes.length>1
              || ancestor.tagName.toLowerCase() == WYMeditor.OL
              || ancestor.tagName.toLowerCase() == WYMeditor.UL)
                this._doc.execCommand(cmd,'',null);
        }

    break;
    
    default:

        if(param) this._doc.execCommand(cmd,'',param);
        else this._doc.execCommand(cmd,'',null);
    }
    
    //set to P if parent = BODY
    var container = this.selected();
    if(container.tagName.toLowerCase() == WYMeditor.BODY)
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    
    //add event handlers on doc elements

    this.listen();
};

/* @name selected
 * @description Returns the selected container
 */
WYMeditor.WymClassMozilla.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if(node) {
        if(node.nodeName == "#text") return(node.parentNode);
        else return(node);
    } else return(null);
};

WYMeditor.WymClassMozilla.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassMozilla.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  var container = null;  

  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      //CTRL+b => STRONG
      wym._exec(WYMeditor.BOLD);
      return false;
    }
    if(evt.keyCode == 73){
      //CTRL+i => EMPHASIS
      wym._exec(WYMeditor.ITALIC);
      return false;
    }
  }

  else if(evt.keyCode == 13) {
    if(!evt.shiftKey){
      //fix PRE bug #73
      container = wym.selected();
      if(container && container.tagName.toLowerCase() == WYMeditor.PRE) {
        evt.preventDefault();
        wym.insert('<p></p>');
      }
    }
  }
};

//keyup handler, mainly used for cleanups
WYMeditor.WymClassMozilla.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  wym._selected_image = null;
  var container = null;

  if(evt.keyCode == 13 && !evt.shiftKey) {
  
    //RETURN key
    //cleanup <br><br> between paragraphs
    jQuery(wym._doc.body).children(WYMeditor.BR).remove();
  }
  
  else if(evt.keyCode != 8
       && evt.keyCode != 17
       && evt.keyCode != 46
       && evt.keyCode != 224
       && !evt.metaKey
       && !evt.ctrlKey) {
      
    //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
    //text nodes replaced by P
    
    container = wym.selected();
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

    if(name == WYMeditor.BODY) wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
  }
};

WYMeditor.WymClassMozilla.prototype.enableDesignMode = function() {
    if(this.designMode == "off") {
      try {
        this.designMode = "on";
        this.execCommand("styleWithCSS", '', false);
      } catch(e) { }
    }
};

WYMeditor.WymClassMozilla.prototype.setFocusToNode = function(node) {
    var range = document.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();
};

WYMeditor.WymClassMozilla.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  // Handle Mozilla styled spans
  if(tag == 'span' && attributes.style){
    var new_tag = this.getTagForStyle(attributes.style);
    if(new_tag){
      this._tag_stack.pop();
      var tag = new_tag;
      this._tag_stack.push(new_tag);
      attributes.style = '';
    }else{
      return;
    }
  }
  
  this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassMozilla.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/sub/.test(style)) return 'super';
  return false;
};

