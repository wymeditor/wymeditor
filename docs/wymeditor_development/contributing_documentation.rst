**************************
Contributing Documentation
**************************

Documentation is published at ``http://wymeditor.readthedocs.org/``.

WYMeditor's documentation is written for the `Sphinx`_ documentation generator.
In order to build the documentation, it must be installed.

Building and Opening the Documentation
======================================

Building the documentation is as easy as:

.. code-block:: shell-session

    $ grunt docsMake

Opening the documentation in the default browser:

.. code-block:: shell-session

    $ grunt docsOpen

Building and opening, in succession, in one command:

.. code-block:: shell-session

    $ grunt docs

Documentation Source Files
==========================

The source files of the documentation are at ``docs``.

The Sphinx configuration file, ``conf.py``,
and the ``Makefile`` are there, as well.

.. _Sphinx: http://sphinx-doc.org/
