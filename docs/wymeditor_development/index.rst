#####################
WYMeditor Development
#####################

.. toctree::
    :maxdepth: 2

    contributing
    building_wymeditor
    testing_wymeditor
    coding_standard
    wymeditor_architecture
    cursor_behavior
    future_planning/index

***************
Troubleshooting
***************

Error Running ``$ grunt server``
================================

On some linux systems,
(eg. Ubuntu 10.04),
you see something like:

.. code-block:: shell-session

    $ grunt server
    Running "express:all" (express) task

    Running "open:all" (open) task
    Web server started on port:9000, hostname: 0.0.0.0 [pid: 29903]

    Running "watch" task
    Waiting...Fatal error: watch ENOSPC

That ``ENOSPC`` thing is related to your ``inotify`` watchers.
Basically,
you're trying to watch more files than are allowed.

Just Fix It
-----------

To just up the number of ``inotify`` watchers allowed,
run:

.. code-block:: shell-session

    $ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    $ sudo sysctl -p

More Details
------------

For a more detailed explanation,
see the `guard/listen wiki <https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers>`_.

*****************
WYMeditor Website
*****************

The website at http://wymeditor.github.io/wymeditor/
is served via Github pages
and uses `Jekyll <http://jekyllrb.com/>`_.
Instead of dealing with different content
between a ``gh-pages`` and master branch,
``master`` also contains the jekyll content.
This also allows us to server the demos/examples
via github pages,
while also adding custom content.

Website vs README vs Docs
=========================

Currently,
there's a lot of overlap between the docs,
the website
and the README.

The focus of these should be:

* Website = Marketing/Examples/Getting-started
* README = Funnels to Website but contains project-wide info
* docs = detailed user and development documentation

Website Files
=============

Currently,
we have a single-page website
controlled by an ``index.html`` file,
which uses a layout defined in ``_layouts/home.html``.
This file uses several custom variables
defined inside ``_config.yml``.

Website Theme
-------------

Our theme is a ported version of a github pages layout.
Its media and styles are located in ``website-media/``.

Configuring Jekyll
==================

.. code-block:: shell-session

    $ rvm use 1.9.3
    $ bundle install

Previewing the Website Locally
==============================

.. code-block:: shell-session

    $ jekyll build
    $ jekyll serve
    $ google-chrome "http://localhost:4000"

Updating the Hosted Version
===========================

.. code-block:: shell-session

    $ git checkout gh-pages
    $ git merge origin/master
    $ git push origin gh-pages

