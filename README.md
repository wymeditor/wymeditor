WYMeditor
=========

WYMeditor is an open source web-based WYSIWYM editor with semantics and
standards in mind. The WYM-part stands for "What You Mean" compared to the more
common "What You See Is What You Get".

Why WYMeditor?
--------------

WYMeditor is different from the
[traditional](http://www.tinymce.com/) [editors](http://ckeditor.com/) 
because we are 100% focused on providing a simple experience for users that
separates the content of their document from the presentation of that document.
We focus on enforcing web standards and separating a document's structure
(HTML) from its presentation (CSS). Your users won't know and shouldn't care
about HTML, but when they need consistent, standards-compliant, clean content,
they'll thank you.

There are lots of choices when it comes to a brower-based editor and many of
them are stable, mature projects with thousands of users. If you need an editor
that gives total control and flexibility to the user (not you, the developer),
then WYMeditor is probably not for you. If you want an editor that you can
customize to provide the specific capabilities your users need, and you want
users focused on the structure of their content instead of tweaking fonts and
margins, you should give WYMeditor a try.

Try It
------

Want to see what WYMeditor can do? Try the [WYMeditor examples](http://wymeditor.no.de/wymeditor/examples/) right now.

These examples use the latest code from the master branch, but they should be stable.

Download
--------

You can download pre-built archives of both the latest stable release and a bleeding edge version with the code currently in master.

* Latest Release: [Version 1.0.0a2](https://github.com/downloads/wymeditor/wymeditor/wymeditor-1.0.0a2.tar.gz)
* Latest Stable: [CI Build](http://jenkins.wymeditor.org/job/wym_master/lastSuccessfulBuild/artifact/dist/wymeditor.tar.gz)

Compatibility
-------------

WYMeditor is compatible with:

* IE 6+
* Firefox 3.6, 6 and 7
* Opera 9.5+
* Safari 3.0+
* Google Chrome stable and beta releases

Quick Start
-----------

Download the latest release from
[WYMeditor.org](http://www.wymeditor.org/download/) or build it yourself using
`make`. Then include jQuery and the WYMeditor source:

    <script type="text/javascript" src="/jquery/jquery.js"></script>
    <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>

WYMeditor works with jQuery 1.2.6 and up, although more recent jQuery versions
provide better performance.

Now, prepare a textarea:

    <textarea class="wymeditor"><p>Hello, World!</p></textarea>
    <input type="submit" class="wymupdate" />

Make sure to include the `wymupdate` class on your submit buttons. 

Use jQuery `$(document).ready()` to turn your textarea into a WYMeditor editor:

    <script>
      $(document).ready(function() {
        $('.wymeditor').wymeditor();
      });
    </script>


More examples can be [found here](https://github.com/wymeditor/wymeditor/tree/master/src/examples) 
or in your local `examples` directory.

Building WYMeditor
------------------

To build WYMeditor you need to have `make` and the 
[UglifyJS module](https://github.com/mishoo/UglifyJS/) for Node.js installed.
To install UglifyJS using [NPM](http://npmjs.org/) run the following:

    npm install -g uglify-js

Running `make` in the terminal will build WYMeditor for distribution inside the
dist catalog, which will be created if if does not already exist. 

Running `make wymeditor` will only merge and minify the the WYMeditor source
without packaging it for distribution.

Testing WYMeditor
-----------------

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. The test suite should pass in any of
our supported browsers and if it doesn't, please 
[file a bug](https://github.com/wymeditor/wymeditor/issues/new) so we can fix it!

The unit test suite is located at `src/test/unit/index.html` and the easiest
way to run the tests is to drop your source checkout behind apache (if you have
it) or use a simple python web server and the command line. eg:

    $ cd /path/to/my/wymeditor/src
    $ python -m SimpleHTTPServer

That command starts up a python web server hosting your `src` directory on port
`8000`. Now open up a browser and go to
[http://localhost:8000/test/unit/index.html](http://localhost:8000/test/unit/index.html).
All green means you're good to go.

Contributing
-----------
 - **Official branch:** https://github.com/wymeditor/wymeditor
 - **Issue tracking:** https://github.com/wymeditor/wymeditor/issues
 - **Wiki/Docs:** https://github.com/wymeditor/wymeditor/wiki
 - **Forum:** http://community.wymeditor.org
 - **Continous Integration:** http://jenkins.wymeditor.org

[Read more on contributing](https://github.com/wymeditor/wymeditor/wiki/Contributing). 

Copyright
---------
Copyright (c) 2005 - 2011 Jean-Francois Hovinne, 
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
