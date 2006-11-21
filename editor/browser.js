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

	/*
	ie5x tests only for functionality. ( dom||ie5x ) would be default settings. 
	Opera will register true in this test if set to identify as IE 5
	*/

	ie5x = ( d.all && dom );
	ie5mac = ( mac && ie5x );
	ie5xwin = ( win && ie5x );
}
