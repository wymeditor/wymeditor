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
[Version 1.0.0b4](https://github.com/downloads/wymeditor/wymeditor/wymeditor-1.0.0b4.tar.gz)
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
haven't ported over the relevant documentation. Porting that, filing
documentation tickets or even just asking questions on IRC at #wymeditor on
freenode would be very helpful.

### Testing WYMeditor

To maintain quality, WYMeditor includes both a unit test suite and a
[Selenium2](http://seleniumhq.org/) test suite. You are encouraged to run both
of them, with all tests passing in all supported browsers. If that's ever not
the case, please
[file a bug](https://github.com/wymeditor/wymeditor/issues/new) so we can fix it!

All of the following instructions assume you've already retrieved a copy of the
source, using git like so:

    git clone git://github.com/wymeditor/wymeditor.git

#### Unit tests vs Selenium tests

The unit test suite covers that vast majority of required tests and can be
quickly run by anyone with a copy of the source code and a web browser. For the
majority of behavior, a unit test will suffice. Unfortunately, there are cases
where browser behavior can't be simulated in a unit tests (these primarily
involve testing browser-specific input handling and `execCommand` behavior). To
test these issues, a Selenium test is required.

Currently, the Selenium test suite is written in python. In the future, we
would like to move to the node.js [wd](https://github.com/admc/wd) module. This
will once again allow a contributor to only require knowledge of javascript in
order to enhance WYMeditor.

#### Running unit tests

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. You simply need to serve the
WYMeditor source using some type of web server and then load the URL for the
unit tests in your browser.

To run the tests:

1. Put your source behind some kind of web server (apache, nginx, etc). If you
don't have one installed or don't want to fuss with configuration, you can use
python's HTTP server:

    $ cd /path/to/my/wymeditor/src
    $ python -m SimpleHTTPServer

3. The unit test suite is located at `src/test/unit/index.html`, so if you used
the python instructions, open up your browser to
[http://localhost:8000/test/unit/index.html](http://localhost:8000/test/unit/index.html).

All green means you're good to go.

##### PhantomJS unit tests

Want to run the tests from the command line? You can do that to!

1. Install [PhantomJS](http://www.phantomjs.org/)
2. Call the `build/phantomjs_test.sh` script with the URL of your unit tests.
For example, if you used the python method of hosting files from above:

    $ build/phantomjs_test.sh localhost:8000/test/unit

##### Unit testing different jQuery versions

The unit tests can be run with the different versions of jQuery hosted on
Google's CDN by appending the URL parameter `?jquery=<version>`. For example,
to test with jQuery 1.8.0 against a local server on port 8000:

[http://localhost:8000/test/unit/?jquery=1.8.0](http://localhost:8000/test/unit/?jquery=1.8.0).

#### Selenium Tests

Because WYMeditor is strongly affected by the way various browsers handle
certain native events (keystrokes, mouse navigation, switching windows), it's
not always possible to use javascript to actually test that behavior. For
specific cases where it's not possible to reproduce behavior in javascript, we
rely on our [http://seleniumhq.org/](Selenium2) test suite to drive an actual
browser using the [http://pypi.python.org/pypi/selenium](Selenium 2 python
bindings).

If possible, it is strongly encouraged to write a javascript unit test instead
of a Selenium test.

##### Running Selenium Tests

1 Install the Selenium 2 python bindings, roughly following these
[http://selenium-python.readthedocs.org/en/latest/installation.html](installation
instructions). The specific version of the python Selenium bindings and the
nose testing framework we require are defined in a
[pip](http://www.pip-installer.org/) requirements file located at
`wym_selenium/requirements.txt`. To install these, we recommend that you first
create an isolated python [virtualenv](http://www.virtualenv.org/):

	$ mkdir -p ~/.virtualenvs
	$ virtualenv ~/.virtualenvs/wym

2. Then actually use pip to install the requirements:

	(wym)$ cd /path/to/wymeditor
	(wym)$ pip install -r selenium_requirements.txt

3. To run the Selenium tests, you'll first need to serve the `src` directory
with a web server. If you have python installed, then you can simply open a
terminal and run:

	$ cd /path/to/wymeditor
	$ make testserver

You'll need to keep this terminal open when running the tests.

4. Then you can use make once again (in another terminal) to actually run the
tests:

	$ source ~/.virtualenvs/wym/bin/activate
	(wym)$ cd /path/to/wymeditor
	(wym)$ make selenium

### Building WYMeditor

1. Use [NPM](http://npmjs.org/) to install [Grunt](http://gruntjs.com/), the
  javascript build tool.

    $ npm install -g grunt

2. Install the build requirements (defined in our `package.json`).

    $ cd /path/to/wymeditor
    $ npm install

4. Run the grunt build script.

    $ grunt

The resulting build will end up in your `dist/wymeditor` directory
and as a `.tar.gz` archive with the current version number inside `dist`.
Eg. `dist/wymeditor-1.0.0.tar.gz`

#### Building with Google's Closure Compiler (Java)

The default WYMeditor distribution is built with
[UglifyJS](https://github.com/mishoo/UglifyJS), which requires the
installation of Node.js. If you prefer Java and/or Google's Closure Compiler,
you can follow these instructions instead.

1. Install `make` and Java.

2. Download
[Closure Compiler application](https://developers.google.com/closure/compiler/),
extracting `compiler.jar` into your `wymeditor` directory.

4. Run `make` from your git clone:

    $ cd /path/to/wymeditor
    $ make min_closure archive

### A note on build scripts

The project is currently in the process of moving entirely from `make` to Grunt
as a build tool. Any help porting the remaining `make` tasks to Grunt would be
wonderful, as it's a bit confusing right now.

Getting Help
------------

 - **Wiki/Docs:** https://github.com/wymeditor/wymeditor/wiki
 - **Forum:** http://community.wymeditor.org
 - **Issue tracking:** https://github.com/wymeditor/wymeditor/issues
 - **Official branch:** https://github.com/wymeditor/wymeditor

[Read more on contributing](https://github.com/wymeditor/wymeditor/wiki/Contributing).

Copyright
---------
Copyright (c) 2005 - 2011 Jean-Francois Hovinne,
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
