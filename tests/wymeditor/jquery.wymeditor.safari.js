/*
* WYMeditor : what you see is What You Mean web-based editor
* Copyright (C) 2007 H.O.net - http://www.honet.be/
* Dual licensed under the MIT (MIT-license.txt)
* and GPL (GPL-license.txt) licenses.
*
* For further information visit:
* 		http://www.wymeditor.org/
*
* File Name:
*		jquery.wymeditor.Safari.js
*		Safari specific class and functions.
*		See the documentation for more info.
*
* File Authors:
* 		Scott E. Lewis (scott@wymeditor.org)
*/


/* ***********************************************************
   Begin: Same code as WymClassMozilla
*********************************************************** */

function WymClassSafari(wym) {
	this._wym = wym;
};

WymClassSafari.prototype.initIframe = function(iframe) {

	this._iframe = iframe;
	this._doc = iframe.contentDocument;
	this._doc.title = this._wym._index;
	this._doc.designMode = "on";
	this._doc.execCommand("styleWithCSS", '', false);
	this.html(this._wym._html);
};

WymClassSafari.prototype._exec = function(cmd,param) {
	if(param) this._doc.execCommand(cmd,'',param);
	else this._doc.execCommand(cmd,'',null);
};

/* @name selected
 * @description Returns the selected container
 */
WymClassSafari.prototype.selected = function() {
	var sel = this._iframe.contentWindow.getSelection();
	var node = sel.focusNode;
	if (node.nodeName == "#text") return (node.parentNode);
	else return(node);
};

/* @name xhtml
 * @description Cleans up the HTML
 */
WymClassSafari.prototype.xhtml = function() {

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

/* ***********************************************************
   End: Same code as WymClassMozilla
*********************************************************** */

/* ***********************************************************
   Begin: Safari-specific code
*********************************************************** */

WymClassSafari.prototype.CaptureSelection = function() {
  var oWin = this._iframe.contentWindow;
  var oDoc = this._iframe.contentDocument;
  var sel = oWin.getSelection();

  oDoc._previous_range = new Object();
  oDoc._previous_range.baseNode = sel.baseNode;
  oDoc._previous_range.baseOffset = sel.baseOffset;
  oDoc._previous_range.extentNode = sel.extentNode;
  oDoc._previous_range.extentOffset = sel.extentOffset;
  return oDoc._previous_range;
};

WymClassSafari.prototype.RestoreSelection = function(oLastSelection) {
  var oWin = this._iframe.contentWindow;
  var oDoc = this._iframe.contentDocument;
  var sel = oWin.getSelection();
  oDoc._previous_range = oLastSelection;
  sel.setBaseAndExtent(oDoc._previous_range.baseNode,
                       oDoc._previous_range.baseOffset,
                       oDoc._previous_range.extentNode,
                       oDoc._previous_range.extentOffset);
};


/* ***********************************************************
   End: Safari-specific code
*********************************************************** */

//////////////////////////////////////////////////////////////
// Un-supported execCommand commands
//
// As of 03-03-2007, the commands below are not supported
// by Safari. Supposedly they have been fixed in WebCore 
// (the Safari browser engine) so the next major release 
// of Safari *should* support them. For the time being,
// the commands will require custom code.
//
//////////////////////////////////////////////////////////////

/////////////////////////////////////////
// High priority commands
/////////////////////////////////////////

// CreateLink
// InsertImage
// InsertOrderedList
// InsertUnorderedList
// Unlink


/////////////////////////////////////////
// Low priority commands
/////////////////////////////////////////

// 2D-Position
// AbsolutePosition
// BlockDirLTR
// BlockDirRTL
// BrowseMode
// ClearAuthenticationCache
// CreateBookmark
// DirLTR
// DirRTL
// EditMode
// FormatBlock
// InlineDirLTR
// InlineDirRTL
// InsertButton
// InsertFieldSet
// InsertHorizontalRule
// InsertIFrame
// InsertInputButton
// InsertInputCheckbox
// InsertInputFileUpload
// InsertInputHidden
// InsertInputImage
// InsertInputPassword
// InsertInputRadio
// InsertInputReset
// InsertInputSubmit
// InsertInputText
// InsertMarquee
// InsertSelectDropDown
// InsertSelectListBox
// InsertTextArea
// LiveResize
// MultipleSelection
// Open
// Overwrite
// PlayImage
// Refresh
// RemoveFormat
// RemoveParaFormat
// SaveAs
// SizeToControl
// SizeToControlHeight
// SizeToControlWidth
// Stop
// StopImage
// Strikethrough
// Unbookmark

