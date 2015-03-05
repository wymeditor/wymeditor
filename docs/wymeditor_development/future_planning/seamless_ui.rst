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

Layout Perfection
-----------------

Tweak the CSS in supported browsers,
so that the height is pixel-perfect.

* Resize the iframe after inserting:
  * Images
  * Tables

Also,
investigate using `scrolling.js <https://github.com/pazguille/scrolling>`_
to provide intelligent scroll debouncing.
It uses ``requestAnimationFrame`` where supported
and falls back to using a timeout
to only hit the callback
60 times per second.

Inspiration/Examples
====================

zenpen
------

`Zenpen <https://github.com/tholman/zenpen>`_

Different Goals
^^^^^^^^^^^^^^^

Minimalism is the goal,
so lists,
tables,
etc.
not a thing.

aloha-editor
------------

`Aloha Editor <http://www.aloha-editor.org/demos/960-fluid-demo/>`_

Different Goals
^^^^^^^^^^^^^^^

Accepts/produces all sorts of HTML by design,
but does care about good HTML.
Goal is general editing,
and doesn't want to be opinionated about structure.

Substance.io
------------

Specifically, the Composer for `Substance <http://substance.io/>`_

Different Goals
^^^^^^^^^^^^^^^

* Use internal JSON representation of blocks,
  which means not useful on starting HTML doc.
* Only aims at modern browsers (IE10+).
* Tied to the substance backend?

sir-trevor-js
-------------

`sir-trevor-js <https://github.com/madebymany/sir-trevor-js>`_
uses the "blocks" concept,
which is very similar to the way ``substance.io`` operates.
It also uses an inline context menu
that is a dead-ringer for the ``zenpen`` menu.

Different Goals
^^^^^^^^^^^^^^^

* Use internal JSON representation of blocks,
  which means not useful on starting HTML doc.
* Only aims at modern browsers (IE10+).

Useful Tools
============

Kill the scrollbar
------------------

`SO Again <http://stackoverflow.com/questions/67354/dreaded-iframe-horizontal-scroll-bar-cant-be-removed-in-ie>`_

Updating iframe height
----------------------

The `iframe-height-jquery-plugin <https://github.com/Sly777/Iframe-Height-Jquery-Plugin>`_.

Will have to be smart about performing updates,
since checking the height will trigger an expensive reflow.
Only do it after new things are created.

*********************
Context-Aware Toolbar
*********************

Details from the `Selection-Aware Toolbar wiki <https://github.com/wymeditor/wymeditor/wiki/Selection-aware-toolbar>`_.
These should be moved here.

Phases
======

Separate Block and Inline toolbars
----------------------------------

Make every toolbar item and class
decide whether it operates on an entire block element
or just on a selection of text.
Use a Zenpen-style tooltip menu
that appears whenever someone makes a selection
and only show the inline-elements there.
The block items/classes
can continue to live on the standard toolbar.

Implement that context-aware toolbar API
----------------------------------------

Implement the API described above
and use the API for all included plugins.

Consider making the structured headings plugin
included by default
so that there is only one ``heading`` container.

Responsive Editor Body
----------------------

Make the body width liquid,
shrinking down for mobile
without requiring a horizontal scrollbar.

Make the toolbar also responsive,
stacking icons in to multiple rows,
if required.

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

****************************
Addendum: Ideal Build Output
****************************

Phase 1
=======

* Include the built docs
* Vendorize the jquery stuff inside ``bower_components``
* Include ``package.json``
* Include the language files

Directory Structure
-------------------

Inside ``dist/``:

* ``README.md``
* ``CHANGELOG.md``
* ``AUTHORS``
* ``MIT-license.txt``
* ``GPL-license.txt``
* ``package.json``
* ``examples/``

  * ``bower_components/``

    * ``jquery/``
    * ``jquery-ui/``
    * etc

  * snip (all of the examples stuff)
* ``wymeditor/``

  * ``jquery.wymeditor.js`` (un-minified and includes ``lang``)
  * ``jquery.wymeditor.min.js`` (minified)
  * ``skins/``
  * ``iframe/``
  * ``plugins/``

* ``docs/``

  * The already-built HTML documentation

A ``.tar.gz`` distribution will be created
with the entire contents of ``dist``.

Phase 2
=======

* Compress and concat the skin/plugin javascript
* Sprite the skin/plugin images
* Support custom builds
  with only a selected subset of plugins
  and skins

Directory Structure
-------------------

Changes:

* ``dist/wymeditor/``

  * ``jquery.wymeditor.js`` (un-minified)
  * ``jquery.wymeditor.min.js`` (minified)
  * ``jquery.wymeditor.plugins.js`` (un-minified)
  * ``jquery.wymeditor.plugins.custom.js`` (un-minified)
  * ``jquery.wymeditor.skins.js`` (un-minified)
  * ``jquery.wymeditor.skins.custom.js`` (un-minified)
  * ``jquery.wymeditor.custom.min.js``
    (All of the custom options together)
  * ``icons.png``
  * ``icons.custom.png``
  * ``wymeditor.css``
  * ``wymeditor.custom.css``
  * ``iframe/``

Phase 3
=======

Optimize and inline the iframes:

* Sprite the images
* In-line the CSS and javascript
* Support storing the full HTML for the iframe
  in the ``jquery.wymeditor.custom.min.js`` file
  and directly injecting it into the iframe.
