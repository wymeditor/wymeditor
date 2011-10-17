# Change History

This document tracks the enhancements and bug fixes between releases of
WYMeditor.

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

