WYMeditor
=========

WYMeditor is an open source web-based WYSIWYM editor with semantics and standards in mind. The WYM-part stands for "What You Mean" compared to the more common "What You See Is What You Get".

Compatability
-------------

WYMeditor is compatible with:

* IE 6+
* Firefox 2+
* Opera 9.5+
* Safari 3.0+
* Google Chrome

Quick Start
-----------

Download the latest release from [WYMeditor.org](http://www.wymeditor.org/download/) or build it yourself using `make` (recommended). Then include jQuery and the WYMeditor source:

    <script type="text/javascript" src="/jquery/jquery.js"></script>
    <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>

WYMeditor should work with jQuery 1.2.x and up, although using a later jQuery version is preferred. 

Now, prepare yourself a textarea:

    <textarea class="wymeditor"><p>Hello, World!</p></textarea>
    <input type="submit" class="wymupdate" />

Make sure to include the `wymupdate` class on your submit buttons. 

On ready:

    <script>
      $(document).ready(function() {
        $('.wymeditor').wymeditor();
      });
    </script>


More examples can be [found here](https://github.com/wymeditor/wymeditor/tree/master/src/examples) or in your local examples directory.

Building WYMeditor
------------------

To build WYMeditor you need to have make and the [UglifyJS module](https://github.com/mishoo/UglifyJS/) for Node.js installed. To install UglifyJS using [NPM](http://npmjs.org/) runt the following:
```npm install -g uglify-js```

Running `make` in the terminal will build WYMeditor for distribution inside the dist catalog, which will be created if if does not already exist. 

Running `make wymeditor` will only merge and minify the the WYMeditor source without packaging it for distribution.

Contributing
-----------
 - **Official branch:** https://github.com/wymeditor/wymeditor
 - **Issue tracking:** https://github.com/wymeditor/wymeditor/issues
 - **Wiki/Docs:** https://github.com/wymeditor/wymeditor/wiki
 - **Forum:** http://community.wymeditor.org

[Read more on contributing](https://github.com/wymeditor/wymeditor/wiki/Contributing). 

Copyright
---------
Copyright (c) 2005 - 2011 Jean-Francois Hovinne, 
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
