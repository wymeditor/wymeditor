#####################
Using WYMeditor Skins
#####################

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

* IE7: too much space at the top and not enough at the bottom
* IE8: too much space at the top and not enough at the bottom
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

*****************
Third-Party Skins
*****************

wymeditor-refine
================

`wymeditor-refine <https://github.com/joshmcarthur/wymeditor-refine>`_
is a skin for WYMEditor
extracted and tweaked from Refinery CMS


