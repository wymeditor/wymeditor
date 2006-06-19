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

/*************************************************************
Light version, use for basic browser detection only. Use our
http://techpatterns.com/downloads/javascript_browser_detection.txt script for more
complex javascript browser detection.

Remember, always use method or object testing as your first choice, for example, if ( dom ) { statement; };

Let me know if you find an error or a failure to properly detect, or if there
is a relevant browser that has special needs for detection at our tech forum:
http://techpatterns.com/forums/forum-11.html
The main script is separated from the initial netscape 4 detection due to certain bugs in
netscape 4 when it comes to unknown things like d.getElementById. The variable declarations
of course are made first to make sure that all the variables are global through the page, 
otherwise a javascript error will occur because you are trying to use an undeclared variable.

We test for basic browser type (ie, op, or moz/netscape > 6)..

For more in depth discussion of css and browser issues go to:
http://www.nic.fi/~tapio1/Teaching/DynamicMenusb.php#detections
http://www.nic.fi/~tapio1/Teaching/FAQ.php3

***************************************************************/

/**************************************************************
Lite version, tests only for main types and browsers out there, 
this will cover you in almost all normal situations out there.
***************************************************************/

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

	/*
	ie5x tests only for functionality. ( dom||ie5x ) would be default settings. 
	Opera will register true in this test if set to identify as IE 5
	*/

	ie5x = ( d.all && dom );
	ie5mac = ( mac && ie5x );
	ie5xwin = ( win && ie5x );
}

/********************************************************
here is a sample use of the browser detector, it would load a browser specific stylesheet
for certain unsupported or improperly supported mac ie 5 css styles. The depth variable
is used so that the javascript library file can be used from anywhere in the website, you simply
insert the depth of the file like this, 
...
 <head>
 <title>Browser information Page</title>

 <meta http-equiv = "Content-Type" content = "text/html; charset = iso-8859-1" />
 <link rel = "stylesheet" type = "text/css" href = "/css/main.css" />
 <script type = "text/javascript" src = "/js/browser_detection.js"> </script>
 <script type = "text/javascript>browser_css( '/'); </script>
 </head>

in the head of the web page after the js file is loaded.
Or if you are always referring your site to the root, you wouldn't need that
 and could delete the depth variable and just use the absolute path to the root.

function browser_css( ) {
	d = document;// shorthand so we don't have to write out document each time..
	if ( ie5mac ) {
		d.write('<link rel = "stylesheet" type = "text\/css" href = "/css/ie5mac.css" />');
	}
	else if ( d.layers ){
		d.write('<link rel = "stylesheet" type = "text\/css" href = "/css/ns4x.css" />');
	}
	else if ( ie4 ){
		d.write('<link rel = "stylesheet" type = "text\/css" href = "/css/ie4.css" />');
	}
	else if ( moz ){
		d.write('<link rel = "stylesheet" type = "text\/css" href = "/css/moz.css" />');
	}
	else {
		d.write('< link rel = "stylesheet" type = "text\/css" href = "/css/moz5.css" />');
	}
}
********************************************************/