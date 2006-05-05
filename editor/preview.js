/*
 * WYM editor : what you see is What You Mean web-based editor
 * Copyright (c) 1997-2006, H.O.net - http://www.honet.be/
 * Use of WYM editor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wym-editor.org/
 * 
 * File Name:
 *		preview.js
 *		Preview functions.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wym-editor.org)
 *
 * File Revision:
 *		$Id: preview.js,v 1.3 2006/01/31 08:45:45 jf_hovinne Exp $
*/

var iClass=1;

function init()
{
	window.document.getElementById("preview_container").innerHTML=window.opener.editor().innerHTML;
}

function switchSkin()
{
	if(iClass==3)iClass=1;
	else iClass+=1;
	window.document.body.className="sample_"+iClass;
	window.document.getElementById("m_skin_name").innerText=window.document.body.className;
}