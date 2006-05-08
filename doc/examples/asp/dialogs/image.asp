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
 *		image.asp
 *		Dialog which defines images values. ASP example.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
-->

<%
'Of course, you can populate the select boxes from a DB, a XML file, ...

Dim aImagesUrls,aImagesAlt,aImagesTitles

aImagesUrls=Array("","http://sourceforge.net/sflogo.php?group_id=148869&type=1")
aImagesAlts=Array("(choose)","SourceForge.net Logo")

For i=0 To UBound(aImagesUrls)
	sImages=sImages+"<option value="""+aImagesUrls(i)+""">"+aImagesAlts(i)+"</option>"+vbCrLf
Next

%>

<html>
<head>
<title>WYMeditor - Image</title>
<link rel="stylesheet" type="text/css" href="../skins/editor-skin.css" />
<script type="text/javascript" src="../util.js"></script>
<script type="text/javascript" src="../dialog.js"></script>
</head>

<body onload="init('image')" class="dialog" id="image">
<p>
 <label>Image</label>
 <select onchange="if(this.options[this.selectedIndex].value!=''){setValue('image_src',this.options[this.selectedIndex].value);setValue('image_alt',this.options[this.selectedIndex].innerHTML);image_preview()}">
 	<%=sImages%>
 </select>
</p>
<p>
 <label>URL</label><input type="text" id="image_src" value="" size="40" onchange="image_preview()" />
</p>
<p>
 <label>Alternative text</label><input type="text" id="image_alt" value="" size="40" />
</p>
<p>
 <label>Title</label><input type="text" id="image_title" value="" size="40" />
</p>
<p>
<input type="hidden" id="image_width" value="" />
<input type="hidden" id="image_height" value="" />
<input type="hidden" id="image_id" value="" />
</p>
<p>
<img id="image_preview" src="" alt="Preview" />
</p>
<p>
 <input id="bt_submit" type="button" value="Submit" onclick="image_sendValue();window.close()" />
 <input id="bt_cancel" type="button" value="Cancel" onclick="window.close()" />
</p>

</body>
</html>
