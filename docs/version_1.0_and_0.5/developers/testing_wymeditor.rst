Testing WYMeditor
=================

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. The test suite should pass in any of
our supported browsers and if it doesn't, please `file a bug
<https://github.com/wymeditor/wymeditor/issues/new>`_ so we can fix it!

Running the Tests Locally
-------------------------

Running the Tests in a Browser
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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

Running the Tests from the Command Line
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In addtion to the browser test suite, you can also run the unit tests
from the command line in a headless Phantom.js browser using Grunt by
following these instructions:

#. If you haven't already, get a copy of the source using git:

    .. code-block:: shell-session

        git clone git://github.com/wymeditor/wymeditor.git

#. Use `NPM <http://npmjs.org/>`_ to install the Grunt requirements by running
   this command in the root directory of the project:

    .. code-block:: shell-session

        $ npm install

    .. note::
        You might have to run this command as the the root user on your
        system.

#. Use NPM to install the Grunt CLI.

    .. code-block:: shell-session

        $ npm install -g grunt-cli

    .. note::
        You might have to run this command as the the root user on your
        system.

#. Finally, run the tests by running the ``test`` Grunt task in the root
   directory of the project:

    .. code-block:: shell-session

        $ grunt test

If the task runs with no errors or failures, you're good to go.

Testing Different jQuery Versions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The unit tests can be run with the different versions of jQuery hosted on
Google's CDN. To do this when running tests in a browser, append the URL
parameter ``?jquery=<version>`` to the test suite URL. To do this when running
tests from the command line with Grunt, include the parameter
``--jquery=<version>`` when running the ``test`` task.

For a browser example, to test with jQuery 1.8.0 against a local server on port
8000, use the URL: http://localhost:8000/test/unit/index.html?jquery=1.8.0.

For a command line example, to test with jQuery 1.8.0 using Grunt, use the
command:

.. code-block:: shell-session

    grunt test --jquery=1.8.0

Grunt Watch Task
^^^^^^^^^^^^^^^^

Besides just the task for running the tests, the Grunt for the project also
includes a ``watch`` task that can be used to have Grunt automatically run the
unit tests anytime a file in the project's source files is modified. This task
can be invoked by running this command in the project's root directoy:

.. code-block:: shell-session

    $ grunt watch

Just like with the normal ``test`` task, a specific version of jQuery can be
specified to be used for the tests in the ``watch`` task by including the
parameter ``--jquery=<version>`` when running the command to start the task.

Travis CI
---------

WYMeditor is set up on `Travis CI <https://travis-ci.org/>`_ so that the unit
tests are run automatically using the ``test`` Grunt task with several
different versions of jQuery whenever commits are submitted to the Git
repositiory for the project. Any submitted pull requests should pass these
tests.

