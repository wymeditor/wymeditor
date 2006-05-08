<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!--
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (C) 2006 Jean-François Hovinne - Daniel Reszka
 * Use of WYMeditor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wymeditor.org/
 * 
 * File Name:
 *		link.asp
 *		Dialog which defines links values. ASP example.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
-->

<%
'Of course, you can populate the select boxes from a DB, a XML file, ...

Dim aInternalUrls,aInternalTitles,sInternal
aInternalUrls=Array("","/en/index.htm","/en/products.htm","/en/contact.htm")
aInternalTitles=Array("(choose)","Home Page","Products","Contact")

Dim aFavoritesUrls,aFavoritesTitles,sFavorites
aFavoritesUrls=Array("","http://www.wymeditor.org/","http://sourceforge.net/")
aFavoritesTitles=Array("(choose)","WYMeditor","SourceForge")

For i=0 To UBound(aInternalUrls)
	sInternal=sInternal+"<option value="""+aInternalUrls(i)+""">"+aInternalTitles(i)+"</option>"+vbCrLf
Next

For i=0 To UBound(aFavoritesUrls)
	sFavorites=sFavorites+"<option value="""+aFavoritesUrls(i)+""">"+aFavoritesTitles(i)+"</option>"+vbCrLf
Next
%>

<html>
<head>
<title>WYMeditor - Link</title>
<link rel="stylesheet" type="text/css" href="../skins/editor-skin.css" />
<script type="text/javascript" src="../util.js"></script>
<script type="text/javascript" src="../dialog.js"></script>
</head>

<body onload="init('link')" class="dialog" id="link">
<p>
 <label>Internal page</label>
 <select onchange="if(this.options[this.selectedIndex].value!=''){setValue('link_href',this.options[this.selectedIndex].value);setValue('link_title',this.options[this.selectedIndex].innerHTML)}">
 	<%=sInternal%>
 </select>
</p>
<p>
 <label>Favorites</label>
 <select onchange="if(this.options[this.selectedIndex].value!=''){setValue('link_href',this.options[this.selectedIndex].value);setValue('link_title',this.options[this.selectedIndex].innerHTML)}">
 	<%=sFavorites%>
 </select>
</p>
<p>
 <label>URL</label><input type="text" id="link_href" value="" />
</p>
<p>
 <label>Title</label><input type="text" id="link_title" value="" />
</p>
<p>
 <input id="bt_submit" type="button" value="Submit" onclick="link_sendValue();window.close()" />
 <input id="bt_cancel" type="button" value="Cancel" onclick="window.close()" />
</p>
</body>
</html>
