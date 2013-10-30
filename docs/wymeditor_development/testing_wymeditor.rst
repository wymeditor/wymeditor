#################
Testing WYMeditor
#################

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. The test suite should pass in any of
our supported browsers and if it doesn't, please `file a bug
<https://github.com/wymeditor/wymeditor/issues/new>`_ so we can fix it!

.. note::

  All of the following assumes
  you've completed the process of
  :ref:`configuring-your-development-environment`

******************************
Running the Tests in a Browser
******************************

1. Use ``grunt`` to start a server
==================================

.. code-block:: shell-session

  $ grunt server

2. Load the test suite
======================

By default,
the server serves on port ``9000``.
Open up a browser to `http://localhost:9000/test/unit/ <http://localhost:9000/test/unit/>`_.

All green means you're good to go.

*******************************
Running the Tests via ``grunt``
*******************************

In addition to the browser test suite,
you can also run the unit tests
from the command line in a headless Phantom.js browser
using Grunt.
This is how the ``travis-ci`` test suite runs.

.. code-block:: shell-session

    $ grunt test

If the task runs with no errors or failures, you're good to go.

*********************************
Testing Different jQuery Versions
*********************************

The unit tests can be run with the different versions of jQuery
hosted on Google's CDN.

In the Browser
==============

To do this when running tests in a browser,
append the URL parameter ``?jquery=<version>``
to the test suite URL.

For example,
to use jquery version ``1.7.0``::

  http://localhost:9000/test/unit/jquery=1.7.0

Via grunt
=========

To do this when running tests
from the command line with Grunt,
include the parameter
``--jquery=<version>``
when running the ``test`` task.

To use jquery 1.6.0
.. code-block:: shell-session

  $ grunt test --jquery=1.8.0

*********
Travis CI
*********

WYMeditor is set up on `Travis CI <https://travis-ci.org/>`_ so that the unit
tests are run automatically using the ``test`` Grunt task with several
different versions of jQuery whenever commits are submitted to the Git
repositiory for the project. Any submitted pull requests should pass these
tests.

