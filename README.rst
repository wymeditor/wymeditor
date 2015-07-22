###############
About WYMeditor
###############

.. _description:

***********
Description
***********

WYMeditor is an open source web-based WYSIWYM editor with semantics and
standards in mind.

The "WYM" part stands for What You Mean (is what you get).
This is in contrast with the more common WYSIWYG—What You See Is What You Get.

Thus WYMeditor is different from the more common editors
(like `TinyMCE`_ and `CKEditor`_).

Its focus is on providing a simple experience for users as well as
the separation of the content of the document from the presentation of the
document.

It also adheres to web standards.

And its versioning adheres to `Semantic Versioning`_ 2.

.. _TinyMCE: http://www.tinymce.com/
.. _CKEditor: http://ckeditor.com/
.. _Semantic Versioning: http://semver.org/

.. _resources:

*********
Resources
*********

+-----------------+------------------------------------------+------------------------------------------+
| Documentation   | `WYMeditor documentation`_               | |documentation badge|                    |
+-----------------+------------------------------------------+------------------------------------------+
| Code repository | `WYMeditor GitHub repository`_           | |GitHub Mark|                            |
+-----------------+------------------------------------------+------------------------------------------+
| Website         | `WYMeditor website`_                     | ``http://wymeditor.github.io/wymeditor`` |
+-----------------+------------------------------------------+------------------------------------------+
| Chat            | `Gitter.im room`_                        | |gitter badge|                           |
+-----------------+------------------------------------------+------------------------------------------+
| Support         | `WYMeditor questions in Stack Overflow`_ | |Stack Overflow icon|                    |
+-----------------+------------------------------------------+------------------------------------------+
| Issues          | `WYMeditor issue tracker`_               |                                          |
+-----------------+------------------------------------------+------------------------------------------+
| Examples        | `WYMeditor online examples`_             |                                          |
+-----------------+------------------------------------------+------------------------------------------+
| CI testing      | `WYMeditor Travis-CI report`_            | |Travis-CI badge|                        |
+-----------------+------------------------------------------+------------------------------------------+
| Bower           | `Bower manifest`_                        | |Bower logo|                             |
+-----------------+------------------------------------------+------------------------------------------+
| Project mgmt    | `Waffle.io board`_                       | |waffle badge|                           |
+-----------------+------------------------------------------+------------------------------------------+

.. _WYMeditor website: https://wymeditor.github.io/wymeditor/
.. _WYMeditor GitHub repository: https://github.com/wymeditor/wymeditor
.. |GitHub Mark| image:: http://upload.wikimedia.org/wikipedia/commons/9/91/
   Octicons-mark-github.svg
   :height: 21px
   :width: 21px
   :alt: GitHub Mark
.. _WYMeditor GitHub organization: https://github.com/wymeditor
.. _WYMeditor documentation: https://wymeditor.readthedocs.org/
.. |documentation badge| image:: http://readthedocs.org/projects/pip/badge/
   :target: https://wymeditor.readthedocs.org/en/latest/
.. _WYMeditor issue tracker: https://github.com/wymeditor/wymeditor/issues
.. _WYMeditor questions in Stack Overflow: https://stackoverflow.com/
   questions/tagged/wymeditor
.. |Stack Overflow icon| image:: http://cdn.sstatic.net/stackoverflow/img/favicon.ico
   :alt: Stack Overflow icon
.. _WYMeditor online examples: https://wymeditor.github.io/wymeditor/dist/
   examples/
.. _WYMeditor Travis-CI report: https://travis-ci.org/wymeditor/wymeditor
.. |Travis-CI badge| image:: http://travis-ci.org/wymeditor/wymeditor.svg
   ?branch=README_rst
   :target: https://travis-ci.org/wymeditor/wymeditor
   :alt: Travis CI badge
.. _Bower manifest: https://github.com/wymeditor/wymeditor/blob/master/
   bower.json
.. |Bower logo| image:: http://bower.io/img/bower-logo.svg
   :height: 21px
   :width: 21px
   :alt: Bower logo
.. _Gitter.im room: https://gitter.im/wymeditor/wymeditor
.. |gitter badge| image:: https://badges.gitter.im/Join%20Chat.svg
   :alt: Join the chat at https://gitter.im/wymeditor/wymeditor
   :target: https://gitter.im/wymeditor/wymeditor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
.. _Waffle.io board: https://waffle.io/wymeditor/wymeditor
.. |waffle badge| image:: https://badge.waffle.io/wymeditor/wymeditor.png?label=ready&title=Ready 
   :target: https://waffle.io/wymeditor/wymeditor
   :alt: 'Project Management'
   
.. _why-wymeditor:

**************
Why WYMeditor?
**************

If your project requires that users produce consistent, standards-compliant and
clean content, they'll thank you for implementing WYMeditor.

There are lots of choices when it comes to a browser–based editor and many of
them are stable, mature projects with thousands of users.

If you require an editor that gives the end–user total control and flexibility
then WYMeditor is probably not for you. On the other hand, if you want an
editor that can be customized to provide the specific capabilities that are
required in your project, and you want to ensure that users are focused on the
structure of their content instead of tweaking fonts and margins, perhaps you
should give WYMeditor a try.

WYMeditor also fully supports Internet Explorer 8.

******
Try It
******

Want to see what WYMeditor can do? Try `the examples`_ online, right now.

.. _browser-compatibility:

*********************
Browser Compatibility
*********************

+-------------------+----------------+------------------------------------+
| Internet Explorer | |IE logo|      | 8 – 11                             |
+-------------------+----------------+------------------------------------+
| Mozilla Firefox   | |Firefox logo| | LTS and latests two major versions |
+-------------------+----------------+------------------------------------+
| Opera             | |Opera logo|   | Latest version                     |
+-------------------+----------------+------------------------------------+
| Safari            | |Safari logo|  | Latest version                     |
+-------------------+----------------+------------------------------------+
| Google Chrome     | |Chrome logo|  | Latest two major versions          |
+-------------------+----------------+------------------------------------+

************
Requirements
************

* jQuery: any version between 1.4.4 and 2.1.x.
  With jQuery 2.x and newer, there is no support for IE8 and older.
* For IE8, ES5 shims are required. Tested with `es5-shim`_ and shams.

Global Pollution
================

* ``window.jQuery.browser``: `jquery.browser`_ v``~0.0.6``
* ``window.rangy``: `Rangy`_ v``1.2.2``
  (includes the selection save and restore module)

*********
Copyright
*********

Copyright (c) 2005 - 2015 Jean-Francois Hovinne,
Dual licensed under the MIT (``MIT-license.txt``)
and GPL (``GPL-license.txt``) licenses.

.. _the examples: `WYMeditor online examples`_

.. |IE logo| image:: http://github.com/alrra/browser-logos/raw/master/
   internet-explorer/internet-explorer_24x24.png
   :alt: Internet Explorer logo
.. |Firefox logo| image:: http://github.com/alrra/browser-logos/raw/master/
   firefox/firefox_24x24.png
   :alt: Firefox logo
.. |Opera logo| image:: http://github.com/alrra/browser-logos/raw/master/
   opera/opera_24x24.png
   :alt: Opera logo
.. |Safari logo| image:: http://github.com/alrra/browser-logos/raw/master/
   safari_8/safari_8_24x24.png
   :alt: Safari logo
.. |Chrome logo| image:: http://github.com/alrra/browser-logos/raw/master/
   chrome/chrome_24x24.png
   :alt: Chrome logo

.. _jquery.browser: https://github.com/gabceb/jquery-browser-plugin
.. _Rangy: https://github.com/timdown/rangy/
.. _object-history: https://github.com/mightyiam/object-history
.. _es5-shim: https://github.com/es-shims/es5-shim
