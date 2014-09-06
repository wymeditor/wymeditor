###############
About WYMeditor
###############

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

*********
Resources
*********

* `WYMeditor website`_
* `WYMeditor GitHub repository`_
* `WYMeditor GitHub organization`_
* `WYMeditor documentation`_ |documentation badge|
* `WYMeditor questions in Stack Overflow`_
* `WYMeditor issue tracking`_
* `WYMeditor online examples`_
* `WYMeditor Travis-CI report`_ |Travis-CI badge|
* `Bower manifest`_ |Bower logo|

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

May also be of interest, is that WYMeditor fully supports Internet Explorer 7.

*************
Try WYMeditor
*************

Want to see what WYMeditor can do? Try `the examples`_ online, right now.

*********************
Browser Compatibility
*********************

+-------------------+----------------+------------------------------------+
| Internet Explorer | |IE logo|      | 7 – 11                             |
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

Included requirements
=====================

These requirements are included inside the distributed WYMeditor JavaScript
file.

* `jquery.browser`_; defines/overrides ``jQuery.browser``
* `Rangy`_; defines/overrides global ``Rangy``
* `rangy-selectionsaverestore`_; a Rangy module.

*********
Copyright
*********

Copyright (c) 2005 - 2013 Jean-Francois Hovinne,
Dual licensed under the MIT (``MIT-license.txt``)
and GPL (``GPL-license.txt``) licenses.

.. _`TinyMCE`: http://www.tinymce.com/
.. _`CKEditor`: http://ckeditor.com/

.. _`WYMeditor website`: https://wymeditor.github.io/wymeditor/

.. _`WYMeditor GitHub repository`: https://github.com/wymeditor/wymeditor

.. _`WYMeditor GitHub organization`: https://github.com/wymeditor

.. _`WYMeditor documentation`: https://wymeditor.readthedocs.org/
.. |documentation badge| image:: https://readthedocs.org/projects/pip/badge/
   :target: https://wymeditor.readthedocs.org/en/latest/

.. _`WYMeditor issue tracking`: https://github.com/wymeditor/wymeditor/issues

.. _`WYMeditor questions in Stack Overflow`: https://stackoverflow.com/questions/tagged/wymeditor

.. _`WYMeditor online examples`: https://wymeditor.github.io/wymeditor/dist/examples/

.. _`WYMeditor Travis-CI report`: https://travis-ci.org/wymeditor/wymeditor
.. |Travis-CI badge| image:: https://travis-ci.org/wymeditor/wymeditor.svg?branch=README_rst
   :target: https://travis-ci.org/wymeditor/wymeditor
   :alt: Travis CI badge

.. _`Bower manifest`: https://github.com/wymeditor/wymeditor/blob/master/bower.json
.. |Bower logo| image:: http://bower.io/img/bower-logo.svg
   :height: 21px
   :alt: Bower logo

.. _`the examples`: `WYMeditor online examples`_

.. |IE logo| image:: https://github.com/alrra/browser-logos/raw/master/internet-explorer/internet-explorer_24x24.png
   :alt: Internet Explorer logo
.. |Firefox logo| image:: https://github.com/alrra/browser-logos/raw/master/firefox/firefox_24x24.png
   :alt: Firefox logo
.. |Opera logo| image:: https://github.com/alrra/browser-logos/raw/master/opera/opera_24x24.png
   :alt: Opera logo
.. |Safari logo| image:: https://github.com/alrra/browser-logos/raw/master/safari_8/safari_8_24x24.png
   :alt: Safari logo
.. |Chrome logo| image:: https://github.com/alrra/browser-logos/raw/master/chrome/chrome_24x24.png
   :alt: Chrome logo

.. _`jquery.browser`: https://github.com/gabceb/jquery-browser-plugin
.. _`Rangy`: https://github.com/timdown/rangy/
.. _`rangy-selectionsaverestore`: `Rangy`_
