WYMeditor
=========

WYMeditor is a web-based text editor with standards in mind. WYM means What you see is What You Mean web-based editor
WYMeditor is dependent on jQuery. 

<a href="http://www.wymeditor.org/">Homepage</a>

Demos
-----

* <a href="http://files.wymeditor.org/wymeditor/trunk/src/examples/01-basic.html">View Basic Demo</a>
* <a href="http://files.wymeditor.org/wymeditor/trunk/src/examples/07-custom-button.html">Custom Button Demo</a>

Compatability
-------------

WYMeditor is compatible with:

* IE 6 +
* Firefox 1.5+
* Opera 9.5+
* Safari 3.0+
* Google Chrome

QuickStart
----------

Include the scripts.

    <script type="text/javascript" src="/jquery/jquery.js"></script>
    <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>

WYMeditor only works with jQuery 1.1.3.x or greater. 

Get you a textarea prepared.

    <textarea class="wymeditor"><p>Hello, World!</p></textarea>
    <input type="submit" class="wymupdate" />
    
Make sure to include the <em>wymupdate</em> class on your submit buttons. 

On ready.
    
    <script>
      $(function() {
        $('.wymeditor').wymeditor();
      });
    </script>
    

More examples can be found <a href="https://github.com/wymeditor/wymeditor/tree/master/src/examples">here</a>.

Contributing
============

WYMeditor has moved to GitHub! Official branch is at <a href="https://github.com/wymeditor/wymeditor">wymeditor/wymeditor</a>. 
<a href="https://github.com/ablemike/wymeditor/wiki/Contributing">Read More on contributing</a>.
TRAC Issues have been imported into Github <a href="https://github.com/wymeditor/wymeditor/issues">Here</a>. 

For more information, please read the documentation, available <a href="https://github.com/wymeditor/wymeditor/wiki">here</a>.

Copyright
---------
Copyright (c) 2005 - 2009 Jean-Francois Hovinne, 
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
