############
Contributing
############

*******************
We <3 Contributions
*******************

We love your contributions. Anything, whitespace cleanup, spelling corrections,
translations, jslint cleanup, etc is very welcome.

The general idea is that you fork WYMeditor, make your changes in a branch, add
appropriate unit tests, hack until you're done, make sure the tests still pass,
and then send a pull request. If you have questions on how to do any of this,
please stop by #wymeditor on freenode IRC and ask. We're happy to help!

.. _development-contribution-example-process:

****************************
Example Contribution Process
****************************

#. Fork `wymeditor <https://github.com/wymeditor/wymeditor>`_ to your personal
   GitHub account.

#. Clone it (``git clone <your personal repo url>``) and add the official repo
   as a remote so that you easily can keep up new changes (``git remote add
   upstream https://github.com/wymeditor/wymeditor.git``).

#. Create a new branch and check it out (``git checkout -b
   my-cool-new-feature``).

#. Make your changes, making sure to follow the
   :doc:`/wymeditor_development/coding_standard`.
   If possible,
   also include a unit test in
   ``src/test/unit/test.js``.

#. Add the changed files to your staging area
   (``$ git add <modified files>``)
   and commit your changes with a meaningful message
   (``$ git commit -m "Describe your changes"``).

#. Repeat steps 4-5 until you're done.

#. Add yourself to the AUTHORS file!

#. Make sure unit tests pass in as many browsers as you can. If you don't have
   access to some of the supported browsers, be sure and note that in your pull
   request message so we can test them.

#. Make sure your code is up to date (see below) and if everything is fine push
   your changes to GitHub (``git push origin <your branch>``) and send a *Pull
   Request*.

Staying up to Date
==================

If your fork or local branch falls behind the official upstream repository
please do a ``git fetch`` and then ``merge`` or ``rebase`` to make sure your
changes will apply cleanly – otherwise your pull request will not be accepted.

See the `GitHub help section <http://help.github.com/>`_ for further details.

.. _configuring-your-development-environment:

****************************************
Configuring Your Development Environment
****************************************

WYMeditor uses the standard modern javascript development toolchain:

* ``git`` and whatever tools you need to build from source.
  eg. ``sudo apt-get install build-essential``
* Node.JS and NPM.
* `grunt-cli`

Then you just need to

.. code-block:: shell-session

    $ npm install

Example Installation
====================

We think that `nvm <https://github.com/creationix/nvm>`_
is a really cool way
to manage multiple node.js versions (or even just one),
so we'll use that for our example install.
If you already know your way around node,
feel free to use whatever you'd like.

1. Install NVM
--------------

.. code-block:: shell-session

    $ curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
    $ source ~/.profile


2. Install node and npm using nvm
---------------------------------

.. code-block:: shell-session

    $ nvm install 0.10

3. Install WYMeditor's dependencies
-----------------------------------

.. code-block:: shell-session

    $ npm install

4. Install Grunt
----------------

.. code-block:: shell-session

    $ npm install -g grunt-cli

4. Ensure everything works
--------------------------

.. code-block:: shell-session

    $ grunt build
    $ grunt test

If ``grunt build`` succeeds,
you're in good shape.
If ``grunt test`` fails,
it's probably because of a busted PhantomJS install.
Refer to the :ref:`troubleshoot-phantoms` section
for tips.


Troubleshooting
===============

.. _troubleshoot-phantomjs:

PhantomJS Isn't Working
-----------------------

You probably need to install
the libraries required for building from source
on your OS.
In Debian/Ubuntu,
that means::

.. code-block:: shell-session

    $ sudo apt-get install build-essential libfontconfig1 fontconfig libfontconfig1-dev libfreetype6-dev
    $ npm install

If you're not using Ubuntu,
you should google around for a tutorial
or check the `PhantomJS Build Page <http://phantomjs.org/build.html>`_.

Front-end dependencies with Bower
=================================

Our front-end dependencies are pulled in by Bower.

Grunt orchestrates this automatically so you don't have to think about it.

If you changed ``bower.json`` and want those changes to take affect, just
restart the server or run ``grunt bower``.

Enabling Automatic Livereload for Development
=============================================

The ``grant``, ``server``, and ``server:dist`` tasks
both support "Live Reload" functionality.
That means that if you have a proper browser extension installed,
changing a file will automatically trigger a reload event
in your browser.

If this sounds nifty,
simply `install the proper extension <http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions->`_.
