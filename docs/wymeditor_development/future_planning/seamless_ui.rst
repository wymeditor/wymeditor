####################
Seamless UI Planning
####################

Our user interface could use some serious modernization.

Current major UI pain points and proposed solutions:

*******************
Fixed-Height Iframe
*******************

The "Box within a box" paradigm
resulting from the fixed-height iframe
makes editing large documents painful.
Users have to manage two different scrollbars
and two different widths.

Additionally,
there are problems with IE7
and horizontal width.

Solution
========

Create a "Seamless" skin.

* The iframe should expand in height
  to contain all of the content
  with no scrollbar.
* Since the iframe might be more than one page high,
  the toolbar must be redesigned to float.
* The iframe should expand to the width of its containing element,
  enabling responsive design.
* The editor area should gracefully scale down in width.

Phases
======

* Get a yeoman build working
  using require.js
* Write a seamless skin
  with no scrollbar
  and expanding height.
* Make the toolbar float.
* Do the cluttered toolbar things.

Inspiration/Examples
====================

zenpen
------

`Zenpen <https://github.com/tholman/zenpen>`_

aloha-editor
------------

`Aloha Editor <http://www.aloha-editor.org/demos/960-fluid-demo/>`_

Substance.io
------------

Specifically, the Composer for `Substance <http://substance.io/>`_

Useful Tools
============

Removing the frame border
-------------------------

`SO Answer <http://stackoverflow.com/questions/4455541/how-to-remove-iframe-border-in-ie7>`_.
Use capital **B** in ``frameBorder``.

Kill the scrollbar
------------------

`SO Again <http://stackoverflow.com/questions/67354/dreaded-iframe-horizontal-scroll-bar-cant-be-removed-in-ie>`_

Updating iframe height
----------------------

The `iframe-height-jquery-plugin <https://github.com/Sly777/Iframe-Height-Jquery-Plugin>`_.

Will have to be smart about performing updates,
since checking the height will trigger an expensive reflow.
Only do it after new things are created.

**********************
Too Many HTTP Requests
**********************

Each of the following thing requires an extra HTTP request
and many of them could then cause the triggering
of further HTTP requests:

* Iframe (N inside the iframe)
* Skin (N to load the skin)
* Plugins (N plugins * N per plugin)
* Language file (1)
* Popup dialogs (N)
* Toolbar items (1 per for the icon)

Solution
========

At build time,
bundle everything together
so that you just load:

* jQuery + maybe jquery-migrate
* 1 javascript file
* 1 CSS file
* A max of 1 image file:

  * For the iframe
  * For the skin
  * For each plugin

Phases
======

Wrap and in-line iframes with skins
-----------------------------------

At build time,
for each iframe,
pull in:
* ``wymiframe.html``
* ``wymiframe.css``
* All of the images as a sprite

Namespace it based on the plugin name.

Instead of giving the iframe a ``src``,
inject the HTML and CSS into the iframe.

For each skin,
pull in:

* ``skin.js``
* ``skin.css``
* ``icons.png``

* Give the icons a skin-namedspaced name
  and update the references in the css.
* Include the CSS for all of the skins.
  It should be namespaced.
* Build the ``WYMeditor.SKINS`` attribute
  with all of the skins.
  Only init the chosen skin.
* Don't support using an HTTP request
  to load a skin.
* Don't support using an HTTP request
  to load the iframes

This will temporarily break dialogs.

******************
Popup dialogs suck
******************

Use either jquery-ui dialogs
or twitter bootstrap dialogs.
Try very hard
to be compatible with refineryCMS's fork
that supports those dialogs.

*****************
Cluttered Toolbar
*****************

The toolbar has a lot of items display all of the time,
which makes a floating version of it busy.

********
Solution
********

* Separate block actions from inline actions.
* Only show inline actions
  when the user makes a selection.
* Only display items relevant to your cursor.
  Described in `Issue 428 <https://github.com/wymeditor/wymeditor/issues/428>`_
  and the `Selection-Aware Toolbar
  <https://github.com/wymeditor/wymeditor/wiki/Selection-aware-toolbar>`_.


