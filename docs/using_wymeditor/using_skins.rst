###############
WYMeditor Skins
###############

.. _using-skins-loading-a-skin:

**************
Loading a Skin
**************

The default WYMeditor distribution
now includes all skin javascript and CSS
as part of the bundle.
If you're using an existing distribution of WYMeditor,
and wish to use another one of the bundled skins,
you simply need to set the ``skin`` option.

If you're migrating from a version of WYMeditor before 1.0,
the differences are explained in the migration documentation
on :ref:`migration-to-1-skin-auto-loading`.

Third-party Skins and Skins in Development
==========================================

When doing WYMeditor development
or using a non-bundled skin,
your desired skin won't be included
in the single bundles of WYMeditor javascript
and CSS.
To use a skin then,
simply include the appropriate CSS and Javascript files
on the page before you initialize the editor.

Optimizations
=============

For enhanced optimization,
you can create your own WYMeditor bundle
only containing the skin that you will load,
but that will be a very low-impact optimization
for most users,
as the amount of CSS/Javascript
in a skin is very small
relative to the impact of WYMeditor itself.

**************
Included Skins
**************

Seamless
========

Known Issues
------------

Window doesn't shrink for IE8+
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We haven't found a reliable way
to detect that the editor window needs to shrink
after content has been removed
for IE8 and higher.

Usability problems with very-wide tables/images
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If there are wide tables/images,
things get a little goofy.
The user must use the arrow keys
to navigate within the table.

To fix this,
we need to set widths for headers/paragraphs/etc
and a min-width for the whole iframe,
but allow the width to increase if needed.
That will provide a whole-page horizontal scrollbar
in the case of wide tables,
which is probably better than current behavior.

Frame centering problems in IE
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

IE has some vertical centering issues:

* IE8: Too much space at the top and not enough at the bottom
* IE9: Too much space at the bottom and not enough at the top

IE8 has some horizontal centering issues:

With full-line content on initialization,
IE8 has too much space on the left
and not enough on the right.

View HTML box not affixed
~~~~~~~~~~~~~~~~~~~~~~~~~

When the box is open to view HTML,
it should float under the toolbar
instead of only being visible at the top.
Otherwise,
it's kind of annoying to edit HTML
for large documents.

Toolbar UI Tweaks Needed
~~~~~~~~~~~~~~~~~~~~~~~~~

* Give the toolbar a gray background
  so that it contrasts with the page
  and with the content blocks.
  That will require changing the background
  of the containers/classes dropdowns.
* Round the top corners of the toolbar.
* Round the corners
  for the container/classes dropdowns.
* Round the bottom corners
  of the iframe body to match the toolbar top.

Window doesn't grow for inserted images
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you insert an image,
the editor height doesn't automatically update.

*****************
Third-Party Skins
*****************

wymeditor-refine
================

`wymeditor-refine <https://github.com/joshmcarthur/wymeditor-refine>`_
is a skin for WYMEditor
extracted and tweaked from Refinery CMS


