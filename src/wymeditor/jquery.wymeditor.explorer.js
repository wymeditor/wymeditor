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
 *		jquery.wymeditor.explorer.js
 *		MSIE specific class and functions.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wymeditor.org)
 */

function WymClassExplorer(wym) {
	
	this._wym = wym;
};

WymClassExplorer.prototype.initIframe = function(iframe) {

	this._iframe = iframe;
	this._doc = iframe.contentWindow.document;

	this._doc.title = this._wym._index;
	this._doc.designMode="on";
	
	var doc = iframe.contentWindow.document;
	$j(doc.body).html(this._wym._html);
	
	//handle events
	var wymexp = this;
	doc.onbeforedeactivate = function() {wymexp.saveCaret();};
	doc.onkeyup = function() {wymexp.saveCaret();};
	doc.onclick = function() {wymexp.saveCaret();};
	
	if(this._callback) this._callback();
};

WymClassExplorer.prototype.doc = function() {
	//MSIE needs this weird function, or sometimes you get "Permission denied" if you call this._doc
	var doc = this._iframe.contentWindow.document;
	return(doc);
};

WymClassExplorer.prototype._exec = function(cmd,param) {

	if(param) this._doc.execCommand(cmd,false,param);
	else this._doc.execCommand(cmd);
};

WymClassExplorer.prototype.selected = function() {

	var caretPos = this._iframe.contentWindow.document.caretPos;
    	if(caretPos!=null) {
    		if(caretPos.parentElement!=undefined) return(caretPos.parentElement());
    	}
};

WymClassExplorer.prototype.saveCaret = function () {

	var doc = this._iframe.contentWindow.document;
	doc.caretPos = doc.selection.createRange();
};

WymClassExplorer.prototype.xhtml = function() {

	var sHtml = this._wym.html();

	var iEnt=-1;
	var flagTag=false,begTag=false,flagAttr=false,begAttr=false,flagEntity=false,begEntity=false,flagLi=false,dropTag=false;
	var empty=false,unclosed=false,unquoted=false,unopened=false,unclosedList=false;
	var tag="",lastTag="",ret="",entity="",attr="";
	
	for(var x=0;x<sHtml.length;x++)
	{
		c=sHtml.charAt(x);
		
		if(begEntity)
		{
			if(c==";")
			{
				begEntity=false;
				iEnt=indexOfArray(entities,entity);
				if(iEnt>-1)flagEntity=true;
			}
			else if(c==" " || c=="#"){begEntity=false;flagEntity=false;entity="";}
			else entity+=c;
		}
		
		if(c=="&")begEntity=true;
		if(begTag)
		{
			if(c==" " || c==">")
			{
				switch(tag.toLowerCase())
				{
					case "br":
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
						empty=true;
						break;
					case "li":
						if(flagLi && lastTag!="ul" && lastTag!="ol" && lastTag!="/li")unclosed=true;
						flagLi=true;
						empty=false;
						break;
					case "ol":
					case "ul":
						if(lastTag=="/li" || lastTag=="ol" || lastTag=="ul")unopened=true;
						empty=false;
						break;
					case "/ol":
					case "/ul":
						if(lastTag=="/ol" || lastTag=="/ul")unclosedList=true;
						empty=false;
						break;
					case "font":case "/font":
					case "b":case "/b":
					case "i":case "/i":
					case "u":case "/u":
					case "center":case "/center":
					case "marquee":case "/marquee":
					case "blink":case "/blink":
					case "big":case "/big":
					case "small":case "/small":
					
						dropTag=true;
						empty=false;
						break;
					default:
						empty=false;
						break;	
				}
				lastTag=tag.toLowerCase();
				tag="";
				begTag=false;
			}
			else tag+=c;
		}
		
		if(c=="<"){begTag=true;flagTag=true;}
		if(c==">" && empty){c=" />";}
		
		if(begTag)ret+=c.toLowerCase();
		
		else if(flagTag)
		{
			if(flagAttr)
			{
				if(begAttr)
				{
					if(c!="\""){ret+="\""+c;unquoted=true;begAttr=false;}
					else{ret+=c;unquoted=false;begAttr=false;}
				} 
				else if(c==" " || c==">" || c==" />")
				{
					if(unquoted)
					{
						if(sHtml.charAt(x-1)!="\""){ret+="\""+c;flagAttr=false;}
						else ret+=c;
					}
					else ret+=c;
				}
				else if(c=="\""){ret+=c;flagAttr=false;}
				else ret+=c;
				
				if(!flagAttr)
				{
					switch(attr.toLowerCase())
					{
						case "align":
						case "background":
						case "bgcolor":
						case "style":
							ret=ret.substr(0,ret.lastIndexOf(attr+"=\""));
							if(c==">" || c==" />")ret+=c;
							break;
						default:
							break;
					}	
				}
			}
			else if(c=="=")
			{
				begAttr=true;flagAttr=true;ret+=c;
				attr=ret.substr(ret.lastIndexOf(" ")+1,ret.length-(ret.lastIndexOf(" ")+2));
			}
			else ret+=c.toLowerCase();
			
			if(c==">" || c==" />")
			{
				flagTag=false;
				flagAttr=false;
				if(unclosed){ret=insertAt(ret,"</"+lastTag+">",ret.lastIndexOf("<"));unclosed=false;}
				if(unopened){ret=ret.substr(0,ret.lastIndexOf("</li>")) + "<"+lastTag+">";unopened=false;}
				if(unclosedList){ret=insertAt(ret,"</li>",ret.lastIndexOf("<"));unclosedList=false;}
				if(dropTag){ret=ret.substr(0,ret.lastIndexOf("<"));dropTag=false;}
			}
		}	
		else ret+=c;
		
		if(flagEntity)
		{
			ret=ret.substr(0,ret.lastIndexOf("&"))+"&#"+numEntities[iEnt]+ret.substr(ret.lastIndexOf(";"));
			entity="";
			flagEntity=false;
		}
	}
	
	//various cleanups
	
	//replacing '> <' by '><'
	var rExp=/> </gi;
	ret=ret.replace(rExp,"><");
	
	return(ret);
};
