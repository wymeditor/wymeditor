/*
 * WYM editor : what you see is What You Mean web-based editor
 * Copyright (c) 1997-2006, H.O.net - http://www.honet.be/
 * Use of WYM editor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wym-editor.org/
 * 
 * File Name:
 *		gecko-wym.js
 *		Main javascript functions for Gecko browsers.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wym-editor.org)
 *
 * File Revision:
 *		$Id: gecko-wym.js,v 1.1 2006/02/28 12:01:49 jf_hovinne Exp $
*/

//global vars

//called at body.onload
function init()
{
	iframe().contentDocument.designMode="on";
	execCom("useCSS");
	txthtml().value=editor().innerHTML;
}

//these functions return base objects
function iframe()
{
	return(document.getElementById('editor'));
}
function editor()
{
	return(iframe().contentDocument.body);
}
function txthtml()
{
	return(document.getElementById('txthtml'));
}

//put editor value in txthtml
function getHTML()
{
	txthtml().value="";
	txthtml().value=editor().innerHTML;
}

//put cleaned editor value in txthtml
function getCleanHTML()
{
	txthtml().value="";
	txthtml().value=cleanupHTML(editor().innerHTML);
}

//put txthtml value in editor
function setHTML()
{
  editor().innerHTML=txthtml().value;
}

function execCom(cmd,opt)
{
	iframe().contentDocument.execCommand(cmd,'',opt);
}


//set txthtml (in)visible
function htmlVisible()
{
  if(txthtml().style.display!="none")txthtml().style.display="none";
  else txthtml().style.display="inline";
}