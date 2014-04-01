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

WYMeditor uses the standard modern javascript development toolchain,
centered on ``Grunt`` as our build tool
and ``node.js`` via ``NPM`` for installing requirements.
If you don't have your machine configured for node.js development,
we've provided a ``Vagrantfile``
for easy setup using `Vagrant <http://www.vagrantup.com/>`_.

If you want a custom,
non-Vagrant environment,
the basic requirements are:

* A working NPM and nodejs installation
* ``git`` and whatever tools you need to build from source.
  eg. ``sudo apt-get install build-essential``
* A working `PhantomJS <http://phantomjs.org/>`_ installation
  or at least the libraries necessary to build it.
* `grunt` and `bower` installed via ``NPM``.

Then you just need to

.. code-block:: shell-session

    $ npm install
    $ node_modules/bower/bin/bower install

.. note::

    For the example setup of an Ubuntu Precise machine,
    check out our
    `vagrant_provision.sh <https://github.com/wymeditor/wymeditor/blob/master/vagrant_provision.sh>`_
    script,
    which we use for configuring the Vagrant machine.

.. _vagrant-environment-setup:

Environment Setup with Vagrant
==============================

1. Install Virtualbox
---------------------

First,
you need a working installation of
`VirtualBox <https://www.virtualbox.org/>`_.

On Ubuntu,
that's as easy as:

.. code-block:: shell-session

    $ sudo apt-get install virtualbox

2. Install Vagrant
------------------

Vagrant builds and provisions our Virtualbox.
See their documentation for
`Vagrant Installation Instructions <http://docs.vagrantup.com/v2/installation/>`.


3. Install Vagrant Plugins
---------------------------

We use a couple of Vagrant plugins
to make managing things easier.

.. code-block:: shell-session

    $ vagrant plugin install vagrant-omnibus
    $ vagrant plugin install vagrant-librarian-chef

4. Build Your Box
-----------------

.. code-block:: shell-session

    $ vagrant up

Vagrant Troubleshooting
-----------------------

Encrypted Home Directory: Problems with the NFS mount
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you use an FUSE-based encrypted home directory,
as is the default for Ubuntu,
you might see an error like:

::

    mount.nfs: access denied by server while mounting 10.10.10.1:/home/you/your-wym-repo

Unfortunately,
NFS can't share encrypted directories,
which is how Virtualbox and Vagrant
keep your files synchronized.
To work around this
we recommend putting your git clone
in a directory like ``/opt``.

.. code-block:: shell-session

    $ mkdir -p /opt/wym
    $ cd /opt/wym
    $ git clone https://github.com/wymeditor/wymeditor.git
    $ cd wymeditor
    $ vagrant up

Enabling Automatic Livereload for Development
=============================================

The ``grant``, ``server``, and ``server:dist`` tasks
both support "Live Reload" functionality.
That means that if you have a proper browser extension installed,
changing a file will automatically trigger a reload event
in your browser.

If this sounds nifty,
simply `install the proper extension <http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions->`_.

.. note::

    If you're using the Vagrant development route,
    the performance hit from using the NFS share
    means that live reload won't be instantaneous.
