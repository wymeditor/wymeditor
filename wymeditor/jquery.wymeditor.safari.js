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
*        jquery.wymeditor.safari.js
*        Safari specific class and functions.
*        See the documentation for more info.
*
* File Authors:
*        Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
*        Bermi Ferrer (wymeditor a-t bermi dotorg)
*/

function WymClassSafari(wym) {

  this._wym = wym;

  // this should be moved into a unified selection API
  this.currentSelection = '';
  this.currentRange;
  this.selectionCopy;
  this.selectedText = '';
  this.selectedHtml = '';
  this.isCollapsed = true; 
  this.hackChar = '~|~~|~';

  this._class = "WymClassSafari";
};


WymClassSafari.prototype.initIframe = function(iframe) {

  this._iframe = iframe;
  this._iframe._wym = this; // Backreference for selection methods
  this._doc = iframe.contentWindow.document;

  //add css rules from options
  var styles = this._doc.styleSheets[0];
  var aCss = eval(this._options.aEditorCss);

  for(var i = 0; i < aCss.length; i++) {
    var oCss = aCss[i];
    if(oCss.name && oCss.css)
    styles.addRule(oCss.name, oCss.css);
  }

  this._doc.title = this._wym._index;

  //init html value
  $j(this._doc.body).html(this._wym._html);

  //handle events
  var wym = this;

  this._doc.onkeyup = function() {
    wym.keyup();
  };


  if(!this._initialized) {

    this._doc.title = this._wym._index;
    this._doc.designMode = "on";
    this.html(this._wym._html);
    if($j.isFunction(this._options.fPreBind)) this._options.fPreBind(this);

    $j(this._box).find(this._options.sToolSelector+','+this._options.sContainerSelector+','+this._options.sClassSelector).mousedown(function(e) {
      e.returnValue = false;
    });


    // Keeps current selection details updated
    $j(this._iframe).bind('keydown', this.updateSelection);
    $j(this._iframe).bind('keyup', this.updateSelection);
    $j(this._iframe).bind('mousedown', this.updateSelection);
    $j(this._iframe).bind('mouseup', this.updateSelection);
    $j(this._iframe).bind('mousemove', this.updateSelection);

    this.bindEvents();

    $j(this._box).click(function() { wym.update(); });

    $j(this._doc).bind('click', this.avoidFollowingLinks);

    $j(this._doc).bind('keydown', this.keydown);
    $j(this._doc).bind('keydup', this.keyup);

    //post-init functions
    if($j.isFunction(this._options.fPostInit)) this._options.fPostInit(this);

    //add event listeners to doc elements, e.g. images
    this.listen();
    this._initialized = true;
  }

};

WymClassSafari.prototype._exec = function(cmd,param) {
  param = param || null;
  if(true || $j.browser.version >= 10000 || typeof this[cmd] == 'undefined'){
    this._doc.execCommand(cmd,false,param);
  }else{
    this[cmd](param);
  }
};


// TODO: Implement
WymClassSafari.prototype.setFocusToNode = function(node) {

};


WymClassSafari.prototype.beforeParsing = function(raw)
{
  this.output = '';
  return this.removeSafarihacks(raw).
  // Remove safari place holders
  replace(/([^>]*)<(\w+)><BR class\="khtml-block-placeholder"><\/\2>([^<]*)/g, "<$2>$1$3</$2>");
}


WymClassSafari.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  // Handle apple style spans
  if(attributes['class'] && attributes['class'] == 'Apple-style-span'){
    this._tag_stack.pop();
    attributes['class'] = '';
    if(attributes.style){
      var tag = this.getTagForStyle(attributes.style);
      this._tag_stack.push(tag);
      attributes.style = '';
    }else{
      return;
    }
  }

  this.output += this.helper.tag(tag, attributes, true);    
}


// Returns the tag name for a span Apple-style-span style.
WymClassSafari.prototype.getTagForStyle = function(sStyle) {

  if(/bold/.test(sStyle)) return 'strong';
  if(/italic/.test(sStyle)) return 'em';
  if(/sub/.test(sStyle)) return 'sub';
  if(/sub/.test(sStyle)) return 'super';
  return 'span';
}

// This is a workarround for select iframe safari bug
WymClassSafari.prototype.addWymHacksForEditMode = function(xhtml) {
  return '<span id="wym_safari_select_all_hack" style="height:0.01em;position:absolute;margin-top:-50px;">safari-hack</span>'+xhtml;
}

WymClassSafari.prototype.removeWymAttributesFromXhtml = function(xhtml) {
  return xhtml.replace(/<span id="wym_safari_select_all_hack"[^>]*>safari-hack<\/span>/, '');
}

WymClassSafari.prototype.update = function() {
  var html = this.xhtml();
  $j(this._element).val(this.removeWymAttributesFromXhtml(html));
  $j(this._box).find(this._options.sHtmlValSelector).val(this.removeWymAttributesFromXhtml(html));
};


WymClassSafari.prototype.bindEvents = function() {

  //copy the instance
  var wym = this;

  //handle click event on tools buttons
  $j(this._box).find(this._options.sToolSelector).click(function() {
    wym.exec($j(this).attr(sWYM_NAME));
    return(false);
  });

  //handle click event on containers buttons
  $j(this._box).find(this._options.sContainerSelector).click(function() {
    wym.container($j(this).attr(sWYM_NAME));
    return(false);
  });

  //handle keyup event on html value: set the editor value
  $j(this._box).find(this._options.sHtmlValSelector).keyup(function() {
    $j(wym._doc.body).html(wym.addWymHacksForEditMode($j(this).val()));
  });

  //handle click event on classes buttons
  $j(this._box).find(this._options.sClassSelector).click(function() {

    var aClasses = eval(wym._options.aClassesItems);
    var sName = $j(this).attr(sWYM_NAME);

    var oClass = aClasses.findByName(sName);

    if(oClass) {
      jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    return(false);
  });

  //handle event on update element
  $j(this._options.sUpdateSelector)
  .bind(this._options.sUpdateEvent, function() {
    wym.update();
  });
};

WymClassSafari.prototype.removeSafarihacks = function(raw_html){
  if(true || $j.browser.version < 10000){
    raw_html = raw_html.replace(this.hackChar,'');
  }
  return raw_html;
}

WymClassSafari.prototype.selectAll = function(param) {
  this.currentSelection.setBaseAndExtent(this._doc.body, 0, w._doc.body, w._doc.body.length);
}

WymClassSafari.prototype.InsertOrderedList = function(param) {
  this._InsertList(param, 'ol');
}

WymClassSafari.prototype.InsertUnorderedList = function(param) {
  this._InsertList(param, 'ul');
}

WymClassSafari.prototype._InsertList = function(param, type) {
  var selected = this.selected();
  var contents = selected.innerHTML;
  
  // Last list item
  if(selected.tagName == 'LI' && selected.parentNode && selected.nextSibling == undefined) {
    this.insertTagAfter(this.deleteSelectedNode(), 'p', contents);
  
    // First list item
    } else if(selected.tagName == 'LI' && selected.parentNode && selected.previousSibling == undefined){
      var parent = selected.parentNode;
    this.deleteNode(selected);
    this.insertTagBefore(parent, 'p', contents);
    
    // inline list item
    } else if(selected.tagName == 'LI' && selected.parentNode){
      var parent = selected.parentNode;
      var before = '';
      var after = false;
      for(var i = 0; i < parent.childNodes.length; i++) {
        if(after === false){
          if(parent.childNodes[i] == selected){
            after = '';
          }else{
            before += parent.childNodes[i].outerHTML;
          }
        } else{
          after += parent.childNodes[i].outerHTML;
        }
      }
            
      $(parent).before(this.helper.contentTag(parent.tagName, before));
      var p_details = this.generateContentTagWithId('p', contents);
      $(parent).before(p_details.content);
      var p = this.getById(p_details.id);
      $(parent).before(this.helper.contentTag(parent.tagName, after));
      $(parent).remove();
      this.focusNode(p,1,1);
      
  // On a paragraph
  } else if(selected.tagName == 'P'){
    this.replaceTagWith(selected, type+'+li', contents);
  }
}


WymClassSafari.prototype.Indent = function(param) {
  
}

WymClassSafari.prototype.Outdent = function(param) {

}

WymClassSafari.prototype.Unlink = function(param) {

}

WymClassSafari.prototype.CreateLink = function(param) {

}

WymClassSafari.prototype.InsertImage = function(param) {

}

WymClassSafari.prototype.handleEnter = function(evt){
  var selected = this.selected();
  if(true || $j.browser.version < 10000){    
    
    if(evt.shiftKey){
      if(!this.selectedHtml && this.selectedText == selected.innerHTML){
        selected.innerHTML = this.emptyChar()+'<br />'+this.emptyChar();
      }
      return false;
    }
    this.handleEnterOnListItem(selected);
   
  }
  return true;
}



WymClassSafari.prototype.handleBackspace = function(){
  var selected = this.selected();
  if(true || $j.browser.version < 10000){
    if(selected.tagName == 'P' && selected.innerHTML == ''){
      // Todo: move caret to the end of previous sibling
      var parent = selected.parentNode;
      parent.removeChild(selected);
    }
  }
  return true;
}

WymClassSafari.prototype.handleEnterOnListItem = function(selected)
{
  if(selected.tagName == 'LI' && selected.parentNode){
    // If we access the text on the right of current carret a new list item will be added
    if((this.isCollapsed && selected.innerHTML && this.selectionCopy.d ? 
        selected.innerHTML.substring(this.selectionCopy.d) : '') == ''){
      // remove the last empty list item and insert a new paragraph
      if(selected.innerHTML.trim() == ''){
        this.insertTagAfter(this.deleteSelectedNode(), 'p', '');
      // New list item
      }else if (this.isCollapsed){
        this.insertTagAfter(selected, 'li', '');

      // we are selecting all the text in a list item
      }else if(this.selectedText == selected.innerHTML || selected.innerHTML == this.selectedHtml){

        if(selected.nextSibling == undefined){ // last item
          this.insertTagAfter(this.deleteSelectedNode(), 'p', '');
        }else{
          this.insertTagAfter(this.deleteContents(selected), 'li', '');
        }
      }else{
        // New list item
        var selectedText = this.selectedHtml || this.selectedText;
        // selecting text up to the end
        if(this.selectionCopy.b+selectedText.length == selected.innerHTML.length){
            this.removeSelection();
            // replace the HTML with the left of the selection
            selected.innerHTML = selected.innerHTML.substring(0,this.selectionCopy.b);
            this.insertTagAfter(selected, 'li', '');
        }

      }
    }
  }
}

WymClassSafari.prototype.insertTagAfter = function(parentNode, tag, content, options){
  var insertBefore = parentNode.outerHTML;
  return this.replaceTagWith(parentNode, tag, content, options, insertBefore);
}

WymClassSafari.prototype.insertTagBefore = function(parentNode, tag, content, options){
  var insertAfter = parentNode.outerHTML;
  return this.replaceTagWith(parentNode, tag, content, options, '', insertAfter);
}

WymClassSafari.prototype.replaceTagWith = function(targetNode, tag, content, options, insertBefore, insertAfter){
  var insertBefore = insertBefore || '';
  var insertAfter = insertAfter || '';
  this.removeSelection(targetNode);
  
  if(tag.indexOf('+')>0){
    var parentTag = tag.split('+')[0];
    var tag = tag.split('+')[1];
    var newTagDetails = this.generateContentTagWithId(tag, content, options);
    $(targetNode).after(insertBefore+this.helper.contentTag(parentTag,newTagDetails.content)+insertAfter);
  }else{
    var newTagDetails = this.generateContentTagWithId(tag, content, options);
    $(targetNode).after(insertBefore+newTagDetails.content+insertAfter);
  }
  
  $(targetNode).remove();
  var newNode = this.getById(newTagDetails.id);
  // If we inserted content the caret will be at the end otherwise at the begining
  var caretPos = (content.length>0 ? 1 : 0);
  this.focusNode(newNode, caretPos, caretPos);
  return newNode;
}

/*
*/
WymClassSafari.prototype.generateContentTagWithId = function(tag, content, options){
  
  var options = options || {};
  options.id = options.id || this.tmpId();
  
  if(tag.indexOf('+')>0){
    var parentTag = tag.split('+')[0];
    var tag = tag.split('+')[1];
    var result = this.helper.contentTag(parentTag,this.helper.contentTag(tag, content, options));
  }else{
    var result = this.helper.contentTag(tag, content, options);
  }
  
  var wym = this;
  setTimeout(function(){
        var newNode = wym.getById(options.id);
        if(newNode && newNode.id && newNode.id.match(/_wym_tmp_id_/)){
          newNode.removeAttribute('id');
        }
      }, 900);

  return {content:result,id:options.id};
}


WymClassSafari.prototype.focusNode = function(node, start, end){
  var start = start || 0;
  var end = end || 0;
  var wym = this;
    // Need to delay so safari doesn't duplicate tags
    setTimeout(function(){wym.currentSelection.setBaseAndExtent(node, start, node, end);}, 200);
    return node;
}


WymClassSafari.prototype.removeSelection = function(node){
  if(!this.isCollapsed){
    this.currentSelection.setBaseAndExtent(node, 0, node, 0);
  }
  return node;
}


WymClassSafari.prototype.deleteContents = function(node){
  this.removeSelection(node).innerHTML = '';
  this.currentSelection.setBaseAndExtent(node, 0, node, 0);
  return node;
}

/* returns parent node
*/
WymClassSafari.prototype.deleteSelectedNode = function(){
  return this.deleteNode(this.selected());
}

/* returns parent node
*/
WymClassSafari.prototype.deleteNode = function(node){
  var parent = node.parentNode || node.baseOffset;
  parent.removeChild(this.removeSelection(node));
  return parent;
}



WymClassSafari.prototype.tmpId = function(){
  if(!this.__tmpIdCounter){
    this.__tmpIdCounter = 0;
  }
  this.__tmpIdCounter++;
  return '_wym_tmp_id_'+this.__tmpIdCounter;
}

WymClassSafari.prototype.emptyChar = function()
{
  return String.fromCharCode(160);
}

WymClassSafari.prototype.getById = function(id)
{
  return this._doc.getElementById(id);
}

WymClassSafari.prototype.updateSelection = function() {

  var s = this.safariGetSelection();
  this._wym.currentSelection = s;
  
  this._wym.selectedText = this._wym.currentSelection+'';
  var range = this.safariCreateRange();

  // Selecting from bottom/right to top/left
  if(s.anchorOffset < s.focusOffset){
    range.setStart(s.anchorNode, s.anchorOffset);
    range.setEnd(s.focusNode, s.focusOffset);  
    this._wym.selectionCopy = {a:s.anchorNode,b:s.anchorOffset,c:s.focusNode,d:s.focusOffset};
    // Selecting from top/left to bottom/right
  }else {
    try{
      range.setStart(s.focusNode, s.focusOffset);
      range.setEnd(s.anchorNode, s.anchorOffset);  
      this._wym.selectionCopy = {a:s.focusNode,b:s.focusOffset,c:s.anchorNode,d:s.anchorOffset};
    }catch(e){}
  }

  var selectedRange = range.cloneContents();
  this._wym.selectedHtml = false;
  if(selectedRange){
    var div = document.createElement("div");
    div.appendChild(selectedRange);
    this._wym.selectedHtml = div.innerHTML == '' ? false : div.innerHTML;
  }
  
  this._wym.isCollapsed = this._wym.selectedHtml == false && this._wym.selectedText == '';
  this._wym.currentRange = range;  
};

WymClassSafari.prototype.selected = function() {
  var node = this._wym.currentSelection.focusNode;
  return node.nodeName == "#text" ? node.parentNode : node;
};

WymClassSafari.prototype.avoidFollowingLinks = function(evt) {
  var node = evt.target;
  if(node.nodeName == 'A' || node.nodeName == 'AREA'){    return false;
  }
  // TODO handle button value editing
  if(node.nodeName == "INPUT" && (node.type.toUpperCase == 'SUBMIT' || node.type.toUpperCase == 'BUTTON')){
    return false;
  }
};

WymClassSafari.prototype.keydown = function(evt) 
{
  var wym = aWYM_INSTANCES[this.title];

  if(evt.keyCode == 13){ // enter
      return wym.handleEnter(evt);
    }else if(evt.keyCode == 8){ // backspace
      return wym.handleBackspace(evt);
    }

  };
  WymClassSafari.prototype.keyup = function(evt) 
  {
    var wym = aWYM_INSTANCES[this.title];
  };

