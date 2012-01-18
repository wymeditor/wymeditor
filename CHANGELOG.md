# Change History

This document tracks the enhancements and bug fixes between releases of
WYMeditor.

## 1.0.0a6 (Alpha 6)

*release-date* TBD

### Changes Since 1.0.0a5

* It's now possible to consistently toggle lists between ordered and unordered
  in all supported browsers.
* Turning a top-level item into a list no longer wraps the list in a paragraph
  in chrome 16 and higher.
* Fixed indent/outdent when highlighting an inline node instead of the list
  (eg. a bolded section).
* Updated the turkish translation (thanks Gokce).
* Attempting to indent with a cursor outside of a list no longer throws a
  javascript error.
* Several bugs related to losing/moving your selection when indenting or
  outdenting lists are now fixed.
* Outdenting after using backspace to join an item inside a list no longer
  loses content in internet explorer.

## 1.0.0a5 (Alpha 5)

*release-date* January 6, 2012

### Changes Since 1.0.0a4

* Fixed several related list outdent bugs where content could be re-ordered or
  where outdent would fail to occur.

## 1.0.0a4 (Alpha 4)

*release-date* December 22, 2011

### Changes Since 1.0.0a3

* It's now possible to indent multiple list items at one time.
* It is once-again possible to adjust an images width and height in FF using
  the browser-supplied slide and drag handles. This was removed out of purity
  (there should be a solution that maintains image ratios, uses CSS instead,
  etc), but in absense of a better solution, it's better than having no ability
  to control the size of inserted images.
* Updated the bundled version of Rangy to version 1.2
* Fixed a list indent bug when indenting a list with a previous list item which
  had a sublist of a different list type. This used to create a second sublist
  of the original list type, which isn't what someone would expect.

## 1.0.0a3 (Alpha 3)

*release-date* December 17, 2011

### Changes Since 1.0.0a2

* Fixed a bug making it impossible to use *Paste From Word* inside tables or lists

## 1.0.0a2 (Alpha 2)

*release-date* November 1, 2011

### Changes Since 1.0.0a1

* Fixed bug preventing *Paste From Word* from properly splitting paragraphs in internet explorer
* Updated the unit tests so that everything is passing under Firefox 7
* Switched from jslint to jshint for source control static analysis

## 1.0.0a1 (Alpha 1)

*release-date* October 17, 2011

Finally! It took us a while, but this marks the first significant release since 0.5.0rc2. It comes with:

* *8* major bug fixes
* *6* major enhancements
* A huge internal code refactor to make maintaining and improving WYMeditor easier
* A passing unit test suite containing more than 350 tests across all supported browsers

### Upgrade Cycle

This release is an *Alpha Quality* release and we would appreciate any testing
or feedback. One of the core developers is using this build in production, but
plugin compatibility issues may exist. Further alpha and eventually beta builds
will follow as 
[milestone 1.x issues](https://github.com/wymeditor/wymeditor/issues?milestone=5&sort=created&direction=desc&state=open)
are completed. Once all blocker tickets are completed, this cycle will
culminate in a 1.0.0 stable release.  

Any feedback or discussion would be appreciated on the [WYMeditor Forums](http://community.wymeditor.org/).

### Enhancements

* The Embed plugin now supports embedding via an iframe.
* List indent/outdent has been rewritten to fix several outstanding bugs in
  various browsers. Indent and outdent are now always opposites of eachother
  (outdenting what you just indented returns you to your original state) and
  the behavior is consistent across all supported browsers.
* A list plugin is now available that enables tab for list indent and
  shift + tab for list outdent.

  It is available at `wymeditor/plugins/list/jquery.wymeditor.list.js`.
  To enable the plugin, create a ListPlugin object via the
  `wymeditor.postInit` option. eg::

    $('.wymeditor').wymeditor({
        postInit: function(wym) {
            var listPlugin = new ListPlugin({}, wym);
        }
    });

* A new Table editing plugin is now available

  The table editing plugin enables the following:

  * Users can now add and remove rows and columns from existing tables.
  * Users can merge table cells to create either `colspan` or `rowspan`.
  * Hitting the `tab` key while inside a table now moves the cursor to the
    next cell, improving usability when editing tables. This can be disabled
    by passing `enableCellTabbing: false` to the plugin initialization.

  The plugin is available at `wymeditor/plugins/table/jquery.wymeditor.table.js`.
  To enable the plugin, instantiate it during the `wymeditor.postInit` option.
  eg::

    $('.wymeditor').wymeditor({
        postInit: function(wym) {
            var tableEditor = wym.table();
        }
    });

* Rangy is now included as part of the distribution and used to create
  consistent cross-browser selection objects.

* A console warning message is now created if no wymPath option is provided and
  it can't be automatically determined. The editor also attempts to continue
  with the assumption that your wymPath is your current directory, instead of
  throwing an exception immediately.


### Bug Fixes

* A rare bug affecting ie8 users with certain combinations of CSS attributes
  has been fixed (with a work-around). This bug would manifest as all content
  in the editor temporarily and randomly dissappearing after a keypress, only
  to re-appear when the user moved their mouse.
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
* `colSpan` and `rowSpan` attributes are no longer stripped out in Internet
  Explorer.

