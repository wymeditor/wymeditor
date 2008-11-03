<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2008 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        basic.php
 *        Basic editor PHP integration example.
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
<h1>WYMeditor basic integration example</h1>
<p><a href="http://www.wymeditor.org/">WYMeditor</a> is a web-based XHTML WYSIWYM editor.</p>
<?php

function charset_decode_utf_8 ($string) {
      /* Only do the slow convert if there are 8-bit characters */
    /* avoid using 0xA0 (\240) in ereg ranges. RH73 does not like that */
    if (! ereg("[\200-\237]", $string) and ! ereg("[\241-\377]", $string))
        return $string;

    // decode three byte unicode characters
    $string = preg_replace("/([\340-\357])([\200-\277])([\200-\277])/e",       
    "'&#'.((ord('\\1')-224)*4096 + (ord('\\2')-128)*64 + (ord('\\3')-128)).';'",   
    $string);

    // decode two byte unicode characters
    $string = preg_replace("/([\300-\337])([\200-\277])/e",
    "'&#'.((ord('\\1')-192)*64+(ord('\\2')-128)).';'",
    $string);

    return $string;
} 

$dbhost = 'localhost';
$dbuser = 'user1';
$dbpass = 'user1';

$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error connecting to mysql');

$dbname = 'testdb';
mysql_select_db($dbname);

if(isset($_POST['wymeditor'])) {

    $result = $_POST['wymeditor'];
    if(get_magic_quotes_gpc()) $result = stripslashes($result);

    echo("<h2>Result</h2>");
    echo("<div class=\"result\">$result</div>");

    $query = sprintf("INSERT INTO table1 (field1) VALUES ('%s')",
            mysql_real_escape_string($result));
    mysql_query($query) or die('Error, insert query failed');

}
else {



    $result = mysql_query("SELECT field1 FROM table1 LIMIT 1");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    $row = mysql_fetch_row($result);
    echo charset_decode_utf_8($row[0]);

print <<<EOF

<form method="post" action="">
<textarea name="wymeditor" class="wymeditor"></textarea>
<input type="submit" class="wymupdate" />
</form>

EOF;
}
?>
<p>
<a href="http://sourceforge.net/projects/wym-editor">
<img src="http://sflogo.sourceforge.net/sflogo.php?group_id=148869&amp;type=1" border="0" alt="SourceForge logo" title="SourceForge" />
</a>
</p>

</body>

</html>
