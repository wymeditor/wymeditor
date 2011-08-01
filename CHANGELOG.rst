================
 Change history
================

.. contents::
    :local:

.. _version-1.0.0dev:

1.0.0dev
========
:release-date: TBA
:branch: master

.. _v1-0-0dev-enhancements:

Enhancements
---------------

* List indent/outdent has been rewritten to fix several outstanding bugs in
  various browsers. Indent and outdent are now always opposites of eachother
  (outdenting what you just indented returns you to your original state) and
  the behavior is consistent across all supported browsers.
* A list plugin is now available that enables tab for list indent and
  shift + tab for list outdent.

  It is available at ``wymeditor/plugins/list/jquery.wymeditor.list.js``.
  To enable the plugin, create a ListPlugin object via the
  ``wymeditor.postInit`` option. eg::

    $('.wymeditor').wymeditor({
        postInit: function(wym) {
            var listPlugin = new ListPlugin({}, wym);
        }
    });

* A new Table editing plugin is now available

  The table editing plugin enables the following:

  * Users can now add and remove rows and columns from existing tables.
  * Users can merge table cells to create either ``colspan`` or ``rowspan``.
  * Hitting the ``tab`` key while inside a table now moves the cursor to the
    next cell, improving usability when editing tables. This can be disabled
    by passing ``enableCellTabbing: false`` to the plugin initialization.

  The plugin is available at ``wymeditor/plugins/table/jquery.wymeditor.table.js``.
  To enable the plugin, instantiate it during the ``wymeditor.postInit`` option.
  eg::

    $('.wymeditor').wymeditor({
        postInit: function(wym) {
            var tableEditor = wym.table();
        }
    });


.. _v1-0-0dev-bugfixes:

Bug Fixes
---------

* The editor height no longer changes height by a few pixels the first time
  someone hovers over a tool.
* Several list indent/outdent bugs that could result in invalid HTML and broken
  lists are now fixed. Users can no-longer break their lists with specific
  combinations of double indents and outdents.
* The HTML parser/validator now corrects unclosed <li> tags in lists so that if
  a piece of HTML has previously been affected by the broken list bug, it will
  be automatically corrected.
* It is now always possible to insert tables, preformatted text and blockquotes
  at the start and end of documents, as well as in between eachother.
  Previously, depending on your browser and version, you couldn't do one or more
  of these things.
* It is now possible to paste content in to a table when using internet
  explorer.
* Fixed some problems with ordered and unordered list nesting in Internet
  Explorer caused by a regex failing to account for IE's insertion of
  whitespace in list HTML.
* ``colSpan`` and ``rowSpan`` attributes are no longer stripped out in Internet
  Explorer.


.. _version-0.5.1:

0.5.1
=====
:release-date: TBA
:branch: 0.5.X

.. _v0-5-1-enhancements:

Enhancements
---------------

* The Embed plugin now supports embedding via an iframe.
