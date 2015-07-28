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

The only exception is
the readme file, ``README.rst``,
which is at the root of the repository.
It is included in the build
and serves as :doc:`about_wymeditor`.

The Sphinx configuration file, ``conf.py``,
and the ``Makefile`` are there, as well.

.. _Sphinx: http://sphinx-doc.org/

Version Agnostic Documentation
==============================

Version agnostic documentation
are pages which do not correspond
with any specific release.

For example, API documentation are
version *specific*.
:ref:`Upgrading to v1`
is version agnostic.

Version agnostic documentation
is most useful at its latest version.
Therefore, such documentation pages
should at least announce that fact.

Include the following at the top of
version agnostic documentation pages:

.. code-block:: rst

   .. include:: /attention_version_agnostic.txt
