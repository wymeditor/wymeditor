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

