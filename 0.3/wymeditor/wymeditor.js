﻿/*
WYMeditor
http://www.wymeditor.org/
*/

var wymeditor_content=new Array();
var wymeditor_counter=-1;

/*
Script Name: Simple Javascript Browser/OS detection
Authors: Harald Hope, Tapio Markula, Websites: http://techpatterns.com/
http://www.nic.fi/~tapio1/Teaching/index1.php3
Script Source URI: http://techpatterns.com/downloads/javascript_browser_detection.php
Version 2.0.1
Copyright (C) 08 August 2004

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

Lesser GPL license text:
http://www.gnu.org/licenses/lgpl.txt

*/

var d, dom, ie, ie4, ie5x, moz, mac, win, lin, old, ie5mac, ie5xwin, op;

d = document;
n = navigator;
na = n.appVersion;
nua = n.userAgent;
win = ( na.indexOf( 'Win' ) != -1 );
mac = ( na.indexOf( 'Mac' ) != -1 );
lin = ( nua.indexOf( 'Linux' ) != -1 );

if ( !d.layers ){
	dom = ( d.getElementById );
	op = ( nua.indexOf( 'Opera' ) != -1 );
	konq = ( nua.indexOf( 'Konqueror' ) != -1 );
	saf = ( nua.indexOf( 'Safari' ) != -1 );
	moz = ( nua.indexOf( 'Gecko' ) != -1 && !saf && !konq);
	ie = ( d.all && !op );
	ie4 = ( ie && !dom );
	ie5x = ( d.all && dom );
	ie5mac = ( mac && ie5x );
	ie5xwin = ( win && ie5x );
}

function wymeditor_iframeGetContent()
{
	wymeditor_counter++;
	return(wymeditor_content[wymeditor_counter]);
}

function wymeditor_execCom(elem,cmd,opt)
{
	var div_editor=$(elem).ancestors("div.wymeditor");
	var iframe=$(div_editor).find("iframe.wymeditor_iframe").get(0);
	if(moz) iframe.contentDocument.execCommand(cmd,'',opt);
	else if(ie) iframe.contentWindow.document.execCommand(cmd);
}

function wymeditor_submit(elem)
{
	var div_editor=$(elem).ancestors("div.wymeditor");
	var iframe=$(div_editor).find("iframe.wymeditor_iframe").get(0);
	var wymeditor_area=$(div_editor).prev();
	
	if(moz) $(wymeditor_area).val(iframe.contentDocument.body.innerHTML);
	else if(ie) $(wymeditor_area).val(iframe.contentWindow.document.body.innerHTML);
	
	$(wymeditor_area).show();
}

$(document).ready(function() {

	//hide textareas
	var wymeditor_area=$("textarea.wymeditor");
	$(wymeditor_area).hide();
	
	//create wymeditor instance(s)
	$(wymeditor_area).each(function(i){
	
		$(this).after("<div class='wymeditor'></div>");
		wymeditor_content[i]=$(this).val();
		
		var div_editor=$(this).next();
		$(div_editor).load("wymeditor/wymeditor.html");
	
	});
});
