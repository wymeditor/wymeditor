<?php
// PHP code from http://keystonewebsites.com/articles/mime_type.php
$charset = "UTF-8";
$mime = "text/html";
function fix_code($buffer) {
return (preg_replace("!\s*/>!", ">", $buffer));
}
if(stristr($_SERVER["HTTP_ACCEPT"],"application/xhtml+xml")) {
        if(preg_match("/application\/xhtml\+xml;q=([01]|0\.\d{1,3}|1\.0)/i",$_SERVER["HTTP_ACCEPT"],$matches)) {
        	$xhtml_q = $matches[1];
                if(preg_match("/text\/html;q=q=([01]|0\.\d{1,3}|1\.0)/i",$_SERVER["HTTP_ACCEPT"],$matches)) {
                	$html_q = $matches[1];
                        if((float)$xhtml_q >= (float)$html_q) {
                        $mime = "application/xhtml+xml";
			}
                }
        } else {
           	$mime = "application/xhtml+xml";
                }
}
if($mime == "application/xhtml+xml") {
	$prolog_type = "<?xml version=\"1.0\" encoding=\"$charset\" ?>\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\" lang=\"en\">\n";
} else {
	ob_start("fix_code");
        $prolog_type = "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\" \"http://www.w3.org/TR/html4/loose.dtd\">\n<html lang=\"en\">\n";
}
header("Content-Type: $mime;charset=$charset");
header("Vary: Accept");
print $prolog_type;
?>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WYMeditor</title>
<script type="text/javascript" src="../jquery/jquery.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.explorer.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.mozilla.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.opera.js"></script>
<script type="text/javascript" src="../wymeditor/jquery.wymeditor.safari.js"></script>

<script type="text/javascript">
;(function($) {
    $(function() {
        $('.wymeditor').wymeditor({
            stylesheet: 'wym_stylesheet.css'
        });
    });
})(jQuery);
</script>

</head>

<body>
<h1>WYMeditor basic integration example</h1>
<p><a href="http://www.wymeditor.org/">WYMeditor</a> is a web-based XHTML WYSIWYM editor.</p>
<form method="post" action="">
<textarea class="wymeditor"></textarea>
<input type="submit" class="wymupdate" />
<input type="button" class="wymclear" name="Clear" value="Clear" />
</form>

<p>
<a href="http://sourceforge.net/projects/wym-editor">
<img src="http://sflogo.sourceforge.net/sflogo.php?group_id=148869&amp;type=1" border="0" alt="SourceForge logo" title="SourceForge" />
</a>
</p>

</body>

</html>
