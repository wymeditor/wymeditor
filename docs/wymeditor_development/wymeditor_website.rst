*****************
WYMeditor Website
*****************

The website at ``http://wymeditor.github.io/wymeditor/``
is served via `GitHub Pages`_.

`Jekyll`_ is used for building it. GitHub has an integrated Jekyll feature.
That is not used. Jekyll is used in the development environment and the built
website is checked in to the repository.

In GitHub Pages, websites for projects are stored in a separate
``gh-pages`` branch.

WYMeditor's website is developed in the ``master`` branch
and is built and published to the ``gh-pages`` branch
as part of each :doc:`release <making_releases>`.

This promotes consistency.
It also allows us to serve the demos/examples
via GitHub Pages.

Website files
=============

The website's only page is the ``README.rst`` file, converted to HTML.
This occurs automatically in builds.

The theme is a ported version of a GitHub Pages layout.

The Jekyll layout is at ``src/jekyll/_layouts/home.html``.

Its media and styles are located in ``src/jekyll/website-media``.

Environment for development of the website
==========================================

There is no Jekyll configuration file, ``_config.yml``.
Instead, Grunt orchestrates building and serving.
Configuration is within the ``Gruntfile.js``.

The following will install Jekyll.
In this example, `RVM`_ is used.

.. code-block:: shell-session

    $ rvm install 2.2
    $ bundle install

`Docutils`_ is also required. Docutils is probably available in your Linux
distribution as ``python3-docutils`` or ``python-docutils``. In particular, it
is required that ``rst2html`` be globally available.

Previewing the website locally
==============================

The website is served in development by running:

.. code-block:: shell-session

    $ grunt server

It is then available at ``http://localhost:9000/website/``.

While this is running,
changes to any of the contents of the website's directory
result in automatic rebuilding of the website.
`LiveReload`_ is implemented.

Building the website
====================

The website is built as part of the entire project build:

.. code-block:: shell-session

    $ grunt build

Or, exclusively:

.. code-block:: shell-session

    $ grunt jekyllDist

It gets built to ``dist/website``, which should then be committed.

.. _publish-website:

Publishing the website
======================

Publishing the website is a matter of pushing to the ``gh-pages`` branch:

.. code-block:: shell-session

    $ git push origin master:gh-pages

This should be done during the process of making a release.
Doing it between releases will result in broken download links in the website.

.. _GitHub Pages: https://pages.github.com/
.. _Jekyll: http://jekyllrb.com/
.. _RVM: http://rvm.io/
.. _LiveReload: http://livereload.com/
.. _Docutils: http://docutils.sourceforge.net/
