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
 *        multiple.php
 *        Multiple instances PHP test page for #150.
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
});

</script>

</head>

<body>
<h1>Multiple instances PHP test page</h1>
<p><a href="http://www.wymeditor.org/">WYMeditor</a> is a web-based XHTML WYSIWYM editor.</p>
<?php

if(isset($_POST['wymeditor_1'])) {

    $result_1 = $_POST['wymeditor_1'];
    if(get_magic_quotes_gpc()) $result_1 = stripslashes($result_1);

    echo("<h2>Result 1</h2>");
    echo("<div class=\"result\">$result_1</div>");
    
    $result_2 = $_POST['wymeditor_2'];
    if(get_magic_quotes_gpc()) $result_2 = stripslashes($result_2);

    echo("<h2>Result 2</h2>");
    echo("<div class=\"result\">$result_2</div>");
    
    $result_3 = $_POST['wymeditor_3'];
    if(get_magic_quotes_gpc()) $result_3 = stripslashes($result_3);

    echo("<h2>Result 3</h2>");
    echo("<div class=\"result\">$result_3</div>");
}
else print <<<EOF

<form method="post" action="">
<textarea name="wymeditor_1" class="wymeditor"></textarea>
<textarea name="wymeditor_2" class="wymeditor"></textarea>
<textarea name="wymeditor_3" class="wymeditor"></textarea>
<input type="submit" class="wymupdate" />
</form>

EOF;
?>

</body>

</html>
