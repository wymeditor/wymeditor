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
 *		template.asp
 *		Insert custom structured content in the editor, based on a template. ASP example.
 *		See the documentation for more info.
 * 
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
-->

<%
Dim sName
sName=Request.Form("template_name")
%>

<html>
<head>
<title>WYMeditor - Template</title>
<link rel="stylesheet" type="text/css" href="../skins/editor-skin.css" />
<script type="text/javascript" src="../util.js"></script>
<script type="text/javascript" src="../dialog.js"></script>
</head>

<body onload="init('template')" class="dialog" id="template">

<%
If Len(sName)=0 Then
%>

<form method="post">
<p>
 <label>Choose template</label>
 <select name="template_name">
	<option value="3colstable">Table with 3 columns and caption</option>
	<option value="newsitem">News item</option>
 </select>
</p>
<input type="submit" style="width: 100px" />
</form>
<%
Else

	Select Case sName
		Case "3colstable"
%>

<p>
 <label>Table caption</label><input type="text" id="template_content_1" value="" />
</p>

<p>
 <label>Column 1 heading</label><input type="text" id="template_content_2" value="" />
</p>

<p>
 <label>Column 2 heading</label><input type="text" id="template_content_3" value="" />
</p>

<p>
 <label>Column 3 heading</label><input type="text" id="template_content_4" value="" />
</p>

<%
		Case "newsitem"
%>

<p>
 <label>Date</label><input type="text" id="template_content_1" value="" />
</p>

<p>
 <label>Text</label><textarea id="template_content_2" cols="40" rows="10"></textarea>
</p>

<%
	End Select
%>

<div id="template_template" style="display: none;">
<%
	Select Case sName
		Case "3colstable"
%>
	<table>
	<caption>#1#</caption>
	<thead>
	<tr><td>#2#</td><td>#3#</td><td>#4#</td></tr>
	</thead>
	<tbody>
	<tr><td></td><td></td><td></td></tr>
	</tbody>
	</table>

<%
		Case "newsitem"
%>
	<p class="date">#1#</p>
	<p class="news">#2#</p>
<%
	End Select
%>
</div>

<p>
 <input id="bt_submit" type="button" value="Submit" onclick="template_sendValue();window.close()" />
 <input id="bt_cancel" type="button" value="Cancel" onclick="window.close()" />
</p>

<%End If%>

</body>
</html>