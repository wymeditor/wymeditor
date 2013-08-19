WYMeditor Architecture
======================

At a high level, WYMeditor is a jQuery plugin that replaces a textarea with a
designMode iframe surrounded by an editor skin and editor controls/buttons.
When you call ``$('.myEditorClass').wymeditor()``, several things happen:

#. WYMeditor uses your configuration/settings to build out HTML templates for
   all of the various components.
#. Your textarea is hidden and WYMeditor uses the generated HTML to insert the
   editor buttons and interface in the same spot.
#. An iframe with ``designMode=true`` is created and inserted as the area you
   actually type in.
#. WYMeditor detects your browser and uses a form of prototype inheritance to
   instantiate the browser-specific version of the editor. The editor is the
   collection of event listeners, browser-specific DOM manipulations and
   interface hacks needed to provide the same behavior across IE, Firefox,
   Chrome, Safari and Opera.

Code Structure
--------------

WYMeditor's source is organized in to several modules corresponding to large
pieces of functionality and all of the actual code lives in ``src/wymeditor/``.
The ``build/`` directory contains build tools and is the default location where
bundled/packed/minified/archived versions of the project can be built (to
``build/build/``) using the ``Makefile``.

Inside ``src/`` you also have:

* ``jquery/`` – Includes the bundled version of jQuery and jQuery UI.
* ``test/`` – Includes both manual and unit tests. The manual tests in the
  .html files have various editor configurations and combinations of plugins
  and options.

  * ``unit/`` – Here lives the automated test suite which makes it possible to
    make a change without breaking 90 other things. The unit test suite is
    based on QUnit.

core.js
^^^^^^^

This is the core of the project including the definition of the WYMeditor
namespace, project constants, some generic helpers and the definition of the
jQuery plugin function.

The most important object in core is ``WYMeditor.editor()`` which is the
object/function that ``jquery.fn.wymeditor()`` farms out to for all of the work
of actually building the editor. ``WYMeditor.editor()`` does the basic job of
building the ``options`` object (which for most cases is 99% the defaults),
locating your JavaScript files and calling ``init()`` (which is defined in
``editor/base.js`` for the heavy lifting.)

parser.js
^^^^^^^^^

Here be dragons. ``parser.js`` is fundamentally responsible for taking in
whatever HTML and CSS the browser or user throws at it, parsing it, and then
spitting out 100% compliant, semantic xHTML and CSS. This also includes some
work to correct invalid HTML and guess what the user/browser probably actually
meant (unclosed li tags, improperly nested lists, etc.) It uses several
components to do its job.

#. A lexer powered by parallel regular expression object
#. A base parser and an xHTML-specific parser
#. An XhtmlValidator to drop nonsense tags and attributes
#. A SAX-style listener to clean up the xHTML as it’s parsed (this does most of
   the magic for guessing how to fix broken HTML)
#. A CSS-specific lexer and parser. This is mostly just used to take in CSS
   configuration options.

editor/
^^^^^^^

This folder is where most of the magic happens. It includes ``base.js`` for doing
most of the heavy lifting and anything that can be done in a cross-browser
manner. It takes the options you passed to the jQuery plugin (defined in
``core.js``) and actually creates all of the UI and event listeners that drive
the editor.

In the ``init()`` it also performs browser detection and loads the appropriate browser-specific editor extensions that handle all of the fun browser-specific quirks. The extensions are also located in this folder.

iframe/
^^^^^^^

This folder contains the HTML and CSS that's used to create the actual editor
iframe (which is created by the ``init()`` method in the ``WYMeditor.editor``
object defined primarily in ``editor/base.js``.) By switching the iframe source
configuration, you choose which iframe to use (default is of course,
``default``.)

Of special interest is the ``wymiframe.css`` file inside your chosen iframe
(eg. `src/wymeditor/iframe/default/wymiframe.css`. ) This file defines the
signature blue background with white boxes around block-level elements and with
the little "P, H2, CODE" images in the upper left.

skins/
^^^^^^

The ``skins/`` folder is structured like the ``iframe/`` folder, with folders
corresponding to different available skins and a default of ``default``. An
editor skin allows customization of the editor controls and UI, separate from
the editable area that where a user actually types. The skin generally contains
CSS, JS and icons and hooks in to the bare HTML that's produced by
``WYMeditor.editor`` using defined class names that correspond to different
controls. The best way to understand and create/edit a skin is to look at the
HTML constants defined in ``WYMeditor`` (inside ``core.js``) and compare them
to the CSS/JS defined in an existing skin (e.g.
``src/wymeditor/skins/default``).

lang/
^^^^^

This is where translations to other languages live. Each file defines a
specific ``WYMeditor.STRINGS.<language code>`` object with mappings from the
English constant to the translated word.

plugins/
^^^^^^^^

This is where all plugins bundled with WYMeditor live. There's currently quite
a lot of variance between the ways plugins are created an organized, but
they're at least organized with a top-level folder in the plugins directory
with the plugin's name. In general, the name of the main plugin file has the
format ``jquery.wymeditor.<plugin_name>.js``.

A set of plugin system hooks is on the roadmap,
but for now most plugins modify things in different ways
and are relying on APIs that are not guaranteed.
A future release will provide those guaranteed APIs.
See :doc:`/wymeditor_development/future_planning/plugin_architecture`.
