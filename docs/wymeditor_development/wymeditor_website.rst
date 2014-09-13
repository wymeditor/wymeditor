*****************
WYMeditor Website
*****************

The website at ``http://wymeditor.github.io/wymeditor/``
is served via `GitHub Pages`_.

`Jekyll`_ is used for building it.

By convention, in GitHub Pages, websites for projects are stored in a separate,
``gh-pages`` branch.
Unlike so,
WYMeditor's website is stored in the ``master`` branch.

This promotes consistency.
It also allows us to serve the demos/examples
via GitHub Pages.

Website files
=============

The website's only page is the ``README.rst`` file, converted to HTML.
This occurs automatically in builds.

The theme is a ported version of a GitHub Pages layout.

The Jekyll layout is at ``src/jekyll/_layouts/home.html``.

Its media and styles are located in ``src/jekyll/media``.

Environment for development of the website
==========================================

There is no Jekyll configuration file, ``_config.yml``.
Instead, Grunt orchestrates building and serving.
Configuration is within the ``Gruntfile.js``.

The following will install Jekyll.
In this example, `RVM`_ is used.

.. code-block:: shell-session

    $ rvm use 1.9.3
    $ bundle install

Docutils is also required.

Previewing the website locally
==============================

The website is served as part of the whole development serve.

.. code-block:: shell-session

    $ grunt server

It is then available at ``http://localhost:9000/website/``.

While this is running,
changes to any of the contents of the website's directory
result in automatic rebuilding of the website.
`LiveReload`_ is implemented.

Publishing of the Website
=========================

The website is built as part of the entire project build:

.. code-block:: shell-session

    $ grunt build

Or, exclusively:

.. code-block:: shell-session

    $ grunt jekyllDist


.. _GitHub Pages: https://pages.github.com/
.. _Jekyll: http://jekyllrb.com/
.. _RVM: http://rvm.io/
.. _LiveReload: http://livereload.com/
