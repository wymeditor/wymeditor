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

We also fully support internet explorer 6, for those poor souls who have no
choice.

Try It
------

Want to see what WYMeditor can do? Try the [WYMeditor examples](http://wymeditor.no.de/wymeditor/examples/) right now.

These examples run the bleeding edge code and give you a good idea of what
WYMeditor can do.

Quick Start
-----------

1. WYMeditor requies jQuery 1.2.6 or higher. First ensure that your page
includes jQuery.

2. Download the
[Version 1.0.0b3](https://github.com/downloads/wymeditor/wymeditor/wymeditor-1.0.0b3.tar.gz)
archive and extract the contents to a folder in your project.

3. Include the `wymeditor/jquery.wymeditor.min.js` file on your page. This file
will pull in anything else that's required.

    <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>

4. Now use the `wymeditor()` function to select one of your `textarea` elements
and turn it in to a WYMeditor instance. eg. if you have a `textarea` with the
class `my-wymeditor`:

    $('.my-wymeditor').wymeditor();

*Note*: You'll probably want to do this initialization inside a
`$(document).ready()` block.

5. If you'd like to receive the valid HTML your editor produce on form
submission, just add the class `wymupdate` to your submit button.

    <input type="submit" class="wymupdate" />

6. ???

7. Profit!

More examples with different plugins and configuration options can be found in
your `examples` directory.

Compatibility
-------------

WYMeditor is compatible with:

* IE 6, 7, 8 and 9
* Firefox 3.6.x, 9.x and 10.x
* Opera 9.5+
* Safari 3.0+
* Google Chrome Stable and Beta

Contributing to WYMeditor
-------------------------

### Documentation

We need a lot of help in the documentation department. We moved from the old
[trac repository](http://trac.wymeditor.org/trac) earlier this year and still
haven't ported over the relevant documentation. Porting that, fileing
documentation tickets or even just asking questions on IRC at #wymeditor on
freenode would be very helpful.

### Testing WYMeditor

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. The test suite should pass in any of
our supported browsers and if it doesn't, please
[file a bug](https://github.com/wymeditor/wymeditor/issues/new) so we can fix it!

To run the test suite.

1. Get a copy of the source using git:

    git clone git://github.com/wymeditor/wymeditor.git

2. Put your source behind some kind of web server (apache, nginx, etc). If you
don't have one installed or don't want to fuss with configuration, you can use
python's HTTP server:

    $ cd /path/to/my/wymeditor/src
    $ python -m SimpleHTTPServer

3. The unit test suite is located at `src/test/unit/index.html`, so if you used
the python instructions, open up your browser to
[http://localhost:8000/test/unit/index.html](http://localhost:8000/test/unit/index.html).

All green means you're good to go.

4. Want to run the tests from the command line? You can do that to! Just install
[PhantomJS](http://www.phantomjs.org/) and then (if you used the http server
from step 2) call:

    $ build/phantomjs_test.sh localhost:8000/test/unit

### Building WYMeditor

1. Get a copy of the source using git:

    git clone git://github.com/wymeditor/wymeditor.git

2. Install `make`, Node.js and [UglifyJS](https://github.com/mishoo/UglifyJS/).
To install UglifyJS using [NPM](http://npmjs.org/) run the following:

    npm install -g uglify-js

3. Run `make` from your git clone:

    $ cd wymeditor
    $ make

The results will appear in your `dist` directory.

Getting Help
------------

 - **Wiki/Docs:** https://github.com/wymeditor/wymeditor/wiki
 - **Forum:** http://community.wymeditor.org
 - **Issue tracking:** https://github.com/wymeditor/wymeditor/issues
 - **Official branch:** https://github.com/wymeditor/wymeditor
 - **Continous Integration:** http://jenkins.wymeditor.org

[Read more on contributing](https://github.com/wymeditor/wymeditor/wiki/Contributing).

Copyright
---------
Copyright (c) 2005 - 2011 Jean-Francois Hovinne,
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
