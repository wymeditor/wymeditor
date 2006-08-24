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
 *		action.php
 *		PHP integration example - content submitted.
 *		See the documentation for more info.
 *
 * File Authors:
 * 		Jean-François Hovinne (jf.hovinne@wymeditor.org)
-->

<?php
$html=stripslashes($_POST['txthtml']);
?>

<html>
<head>
<title>WYMeditor</title>
<link rel="stylesheet" type="text/css" href="skins/preview/screen.css" />
</head>

<body class="sample_1">
<div id="preview_container"><?php echo($html); ?></div>
</body>
</html>
