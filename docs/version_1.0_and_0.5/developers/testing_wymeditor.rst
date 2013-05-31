Testing WYMeditor
=================

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. The test suite should pass in any of
our supported browsers and if it doesn't, please `file a bug
<https://github.com/wymeditor/wymeditor/issues/new>`_ so we can fix it!

To run the test suite.

#. Get a copy of the source using git:

    .. code-block:: shell-session

        $ git clone git://github.com/wymeditor/wymeditor.git

#. Put your source behind some kind of web server (apache, nginx, etc). If you
   don't have one installed or don't want to fuss with configuration, you can
   use python's HTTP server:

    .. code-block:: shell-session

        $ cd /path/to/my/wymeditor/src
        $ python -m SimpleHTTPServer

#. The unit test suite is located at ``src/test/unit/index.html``, so if you
   used the python instructions, open up your browser to
   http://localhost:8000/test/unit/index.html.

   All green means you're good to go.

#. Want to run the tests from the command line? You can do that to! Just
   install `PhantomJS <http://www.phantomjs.org/>`_ and then (if you used the
   http server from step 2) call:

    .. code-block:: shell-session

        $ build/phantomjs_test.sh localhost:8000/test/unit

Testing Different jQuery Versions
---------------------------------

The unit tests can be run with the different versions of jQuery hosted on
Google's CDN by appending the URL parameter ``?jquery=<version>``. For example,
to test with jQuery 1.8.0 against a local server on port 8000:

http://localhost:8000/test/unit/?jquery=1.8.0.
