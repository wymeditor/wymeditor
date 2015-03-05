*****************
Testing WYMeditor
*****************

Unit tests vs. Selenium tests
=============================

For testing, two different systems are used; `Selenium`_ and `QUnit`_.

The vast majority of code is covered by the QUnit unit test suite.

Some functionality can't be tested by QUnit, and thus is tested using Selenium.

|QUnit is preferred over Selenium|

All tests should pass in all
:ref:`supported browsers <browser-compatibility>`.

If ever any tests fail, please :ref:`file a bug <resources>`.

All of the following assumes
you've completed the process of
:ref:`configuring-your-development-environment`

QUnit test suite
================

Running in real browsers
------------------------

Start a server using

.. code-block:: shell-session

  $ grunt server

After the server is running, by default,
it serves on port ``9000``
so point a browser at
`http://localhost:9000/test/unit/index.html <QUnit test suite URI_>`_.

.. note::

  If testing in a virtual machine, for better performance, disabling virtual
  memory may help.

Running in a headless browser
-----------------------------

In addition to running the QUnit test suite in real browsers,
running it from the command line in a headless `PhantomJS`_ browser
is also possible.

This is how the ``travis-ci`` test suite runs.

.. code-block:: shell-session

    $ grunt test

If tests fail, an error will be output.

Running with various versions of jQuery
---------------------------------------

The QUnit test suite can be run with various versions of jQuery.

Instructions for doing that are provided in the following sections.

The default version of jQuery that is used is the lowest supported version.

Testing with jQuery versions other than the default involves the automatic
fetching of the desired jQuery version from Google's CDN.

In real browsers
^^^^^^^^^^^^^^^^

To do this when running tests in a browser,
append the URL parameter ``?jquery=<version>``
to the test suite URL.

For example,
for jQuery version ``1.7.0`` use
``http://localhost:9000/test/unit/?jquery=1.7.0``.

In a headless browser
^^^^^^^^^^^^^^^^^^^^^

To do this when running tests
from the command line,
include the parameter
``--jquery=<version>``
when running the ``test`` task.

For example,
for jQuery ``1.6.0`` use

.. code-block:: shell-session

  $ grunt test --jquery=1.6.0

Travis CI
---------

WYMeditor is set up on `Travis CI`_.

The QUnit test suite is run automatically using the ``test`` Grunt task with
several different versions of jQuery whenever commits are submitted to the Git
repository for the project.

Any submitted pull requests should pass these tests.

Selenium tests
==============

QUnit operates within the confines of JavaScript.
Some functionality can't be tested with JavaScript, exclusively.
This includes browsers' reaction to entered input like keyboard, mouse and
touch.
It also includes focus–related activity like window switching.
It also includes the ``execCommand`` funcionality.

For testing these areas, we rely on `Selenium`_.
It controls real browsers in ways that JavaScript can't.

|QUnit is preferred over Selenium|

WYMeditor's Selenium test suite is written in Python,
using `Python bindings for Selenium`_.

Running Selenium tests
----------------------

#. Install the `Selenium 2 Python bindings <Selenium with Python_>`_,
   roughly following these instructions.

   The specific version of the python Selenium bindings and the nose testing
   framework we require are defined in a `pip`_ requirements file located at
   `wym_selenium/requirements.txt`.
   To install these, we recommend that you first create an isolated python
   `virtualenv`_.

    .. code-block:: shell-session

       $ mkdir -p ~/.virtualenvs
       $ virtualenv ~/.virtualenvs/wym

#. Then use pip to install the requirements:

    .. code-block:: shell-session

       (wym)$ cd /path/to/wymeditor
       (wym)$ pip install -r selenium_requirements.txt

#. To run the Selenium tests, you'll first need to serve the ``src`` directory
   with a web server. If you have Python installed, then you can simply open a
   terminal and run:

    .. code-block:: shell-session

       $ cd /path/to/wymeditor
       $ make testserver

   You'll need to keep this terminal open when running the tests.

#. Then you can use make once again (in another terminal) to actually run the
   tests:

    .. code-block:: shell-session

       $ source ~/.virtualenvs/wym/bin/activate
       (wym)$ cd /path/to/wymeditor
       (wym)$ make selenium

.. _QUnit: http://qunitjs.com/
.. _Selenium: http://seleniumhq.org/
.. _QUnit test suite URI: http://localhost:9000/test/unit/index.html
.. _PhantomJS: http://phantomjs.org/
.. _Python bindings for Selenium: https://pypi.python.org/pypi/selenium
.. _Travis CI: https://travis-ci.org/

.. |QUnit is preferred over Selenium| replace:: Since QUnit is faster
   than Selenium, it is the preferred test platform.
   In absence of compelling reason otherwise,
   new tests should be written in QUnit.

.. _Selenium with Python: https://selenium-python.readthedocs.org/
.. _pip: https://pip.pypa.io/en/latest/
.. _virtualenv: https://virtualenv.pypa.io/
