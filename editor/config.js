/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2006 Jean-François Hovinne - Daniel Reszka
 * Use of WYMeditor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 * 
 * File Name:
 *		config.js
 *		Custom configuration values.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
*/

//modify these values if you want to better integrate WYMeditor in your application
//just modify the value after the ":"
//i.e. "link.htm" becomes "link.php", so you can add server-side generated controls, values, ...
var dialogs=
{
	"base":		"dialogs/",		//base dialogs url
	"default": 	"dialog.htm",		//default dialog template
	"link": 	"link.htm",		//dialog used to add or modify a link
	"image": 	"image.htm",		//add or modify an image
	"table": 	"table.htm",		//add a table
	"template":	"template.htm"		//add structured content based on a template
};

//dialogs features - see javascript window.open()
var dialogs_features="menubar=no,titlebar=no,toolbar=no,resizable=no,width=560,height=300";

//preview dialog is specific
var preview_url="dialogs/preview.htm";
var preview_features="scrollbars,width=760,height=540";

//custom values
var custom_values=
{
	"wym_editor_description":	"<strong>WYMeditor</strong> is a web-based <acronym title=\"What You See Is What You Mean\">WYSIWYM</acronym> editor."
}
