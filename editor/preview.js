/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2006 Jean-François Hovinne - Daniel Reszka
 * Use of WYMeditor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 * 
 * File Name:
 *		preview.js
 *		Preview functions.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
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