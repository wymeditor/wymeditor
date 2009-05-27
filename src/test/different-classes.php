<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        different-classes.php
 *        Multiple editors PHP test page.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
-->
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WYMeditor</title>
<style type="text/css">
    div.result {
      width: 50%;
      margin: 10px;
      padding: 10px;
      border: 2px solid #ccc;
    }
</style>
<script type="text/javascript" src="../jquery/jquery.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.explorer.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.mozilla.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.opera.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.safari.js"></script>

<script type="text/javascript">

jQuery(function() {
    jQuery('.wymeditor').wymeditor();
    
    jQuery('.wymeditor2').wymeditor({
        html:        '<p>Hello, World!<\/p>'
    });
});

</script>

</head>

<body>
<h1>Multiple editors and classes - PHP test page</h1>
<p><a href="http://www.wymeditor.org/">WYMeditor</a> is a web-based XHTML WYSIWYM editor.</p>
<?php

if(isset($_POST['wymeditor']) || isset($_POST['wymeditor2'])) {

    $result = isset($_POST['wymeditor']) ? $_POST['wymeditor'] : $_POST['wymeditor2'];
    if(get_magic_quotes_gpc()) $result = stripslashes($result);

    echo("<h2>Result</h2>");
    echo("<div class=\"result\">$result</div>");
}
else print <<<EOF

<form method="post" action="">
<textarea name="wymeditor" class="wymeditor"></textarea>
<input type="submit" class="wymupdate" />
</form>

<form method="post" action="">
<textarea name="wymeditor2" class="wymeditor2"></textarea>
<input type="submit" class="wymupdate" />
</form>

EOF;
?>
<p>
<a href="http://sourceforge.net/projects/wym-editor">
<img src="http://sflogo.sourceforge.net/sflogo.php?group_id=148869&amp;type=1" border="0" alt="SourceForge logo" title="SourceForge" />
</a>
</p>

</body>

</html>
