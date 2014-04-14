###################
Parser Improvements
###################

***************
Correcting HTML
***************

Force the ``defaultRootContainer``
==================================

When a top-level container is encountered
that's not the `defaultRootContainer <https://github.com/wymeditor/wymeditor/blob/master/src/wymeditor/editor/document-structure-manager.js#L25>`_,
but is one of the other options,
automatically convert it.
This would help documents
that are a mix of ``div`` and ``p``
look cleaner.

Unwrap Nested paragraphs, headers, lists
========================================

If a document has eg. a ``div`` wrapping multiple ``p``, ``h2``, ``ul``, etc,
automatically delete that ``div``.
Care will need to be taken about direct child text nodes
that will need to be wrapped
in the ``defaultRootContainer``.

*******************
XML Fragment Schema
*******************

We currently enforce a specific subset of XHTML
in order to provide a consistent cross-browser experience,
but that format isn't documented anywhere.
We need to document it.

Defines Stuff In ``body``
========================

* Only things that live in a ``body`` element in the html5 spec
* No script/style

Example Differences From HTML5
==============================

It's mostly about removing ambiguity
in the cases where IE/Firefox/Chrome ``contentEditable``
or ``designMode``
do different things.

No Paragraphs In LIs
--------------------

``<p>`` tags should not live inside ``<li>`` tags.
Linebreaks should instead be created with ``<br />``.

Proper Nesting of ``h1-h6``
---------------------------

Heading levels must be properly nested.
If an ``h3`` doesn't have an ``h2`` as a previous sibling,
it should be changed to an ``h2``
(unless it also doesn't have an ``h1`` previous sibling,
meaning it's actually an ``h1``).

``div`` or ``p``, but Not Both
------------------------------

They're the same semantic element.
Choose one
and use it everywhere.

Only Semantic Attributes
------------------------

``class`` and ``data-*`` attributes
instead of almost all other optional attributes.
No ``font-*``.
No ``style``.

Spans Only Get ``id``, ``class``, ``data-*``
--------------------------------------------

WYMeditor should convert the MS word pasting cruft
to either semantic elements
or classes.

Limits To Nesting Complex Elements
----------------------------------

I'm not sure where these should be,
but documents with tables in tables in lists
aren't easy to reflow on a mobile phone.

* Tables
* Lists

Name
====

Formless Content Fragment

* http://book.pressbooks.com/chapter/book-design-in-the-digital-age-craig-mod
* http://en.flossmanuals.net/booktype/formless-content/

Spec and Parser
===============

* Maybe a spec that looks like the HTML5 WHATWG spec doc?
* Maybe something that wraps/modifies
  either `parse5 <https://github.com/inikulin/parse5>`_
  or `htmlparser2 <https://github.com/fb55/htmlparser2>`_.
* Lots of test cases.
* Maybe provides API for doing corrections
  when conditions hit where valid HTML5 encountered
  that isn't valid Formless Content Fragment.
  Or maybe the spec should define the correction completely?

*****************
Table of Contents
*****************

Plus `EPub Navigation Documents <http://www.idpf.org/epub/30/spec/epub30-contentdocs.html#sec-xhtml-nav>`_
for ToC.
