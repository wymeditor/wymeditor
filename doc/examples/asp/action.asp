<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!--
 * WYM editor : what you see is What You Mean web-based editor
 * Copyright (c) 1997-2005, H.O.net - http://www.honet.be/
 * Use of WYM editor is granted by the terms of the MIT License (http://www.opensource.org/licenses/mit-license.php).
 *
 * For further information visit:
 * 		http://www.wym-editor.org/
 *
 * File Name:
 *		action.asp
 *		ASP integration example - content submitted.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-Francois Hovinne (jf.hovinne@wym-editor.org)
 *
 * File Revision:
 *		$Id: action.asp,v 1.1 2005/11/22 15:04:44 jf_hovinne Exp $
-->

<%
Dim html
html=Request.Form("txthtml")
%>

<html>
<head>
<title>WYM editor</title>
<link rel="stylesheet" type="text/css" href="skins/preview/screen.css" />
</head>

<body class="sample_1">
<div id="preview_container"><%=html%></div>
</body>
</html>