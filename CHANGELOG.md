# Change History

This document tracks the enhancements and bug fixes between releases of
WYMeditor.

## 1.0.0b5 (Beta 5)

*release-date* TBD

### Enhancements

* We now have all of the documentation in one place at
  [wymeditor.readthedocs.org](https://wymeditor.readthedocs.org)! No more
  switching back and forth between the old Trac site and the github Wiki.
  The new documentation uses [Sphinx](http://sphinx-doc.org/) and new pull
  requests will now be able to come with `docs/` already committed!
  Thanks to Nick McLaughlin for the herculean effort in combining the years
  of spread-out documentation.
* We now document how to run WYMeditor with jQuery 1.8.x and 1.9.x via
  [jquery-migrate](https://github.com/jquery/jquery-migrate/). The unit tests
  now also support those versions of jQuery.
* Some community members have created a
  [Django-CMS 3](https://github.com/wymeditor/djangocms_wymeditor_plugin)
  plugin for WYMeditor. If you're upgrading from Django-CMS 2 to 3, you'll
  want to check it out.

### Bug Fixes

* WYMeditor now works properly in Chrome when using jQuery 1.4 or higher.
  Thanks to several folks for outlining the fix and for Nick McLaughlin for the
  pull request.
* When using the bold tool in a header in Chrome, there was an issue
  where a span with a style attribute set to `font-weight: normal` would
  be wrapped around the header's content. This has been fixed so that
  this span will no longer occur after bolding.

## 1.0.0b4 (Beta 4)

*release-date* February 15, 2013

### Enhancements

* Added a Danish translation. Thanks Sebastian Kolind.
* The Makefile now supports building a WYMeditor distribution based on Google's
  Closure Compiler instead of UglifyJS. Thanks Michael Farrell.

### Bug Fixes

* The editor area is now properly displayed when using the Compact skin and
  styling with `white-space: nowrap'`. Thanks to Jorge Salinas for the fix.
* Fixed several bugs related to parsing void elements (br, hr, etc) which could
  be either self-closing or not. These usually manifested when used near other
  inline elements (eg. span). Thanks to Craig MacGregor for the fix.
* Fixed several XHTML-strict non-compliance problems. WYMeditor aims to always
  output fully-compliant XHTML. Thanks Philipp Cordes for the report and fix.
* The Makefile now fails more gracefully when you don't have UglifyJS installed
  and you attempt to build a distribution. Thanks to Michael Farrell for the fix.
* Fixed the Slovak translation language code. Thanks to Josef Šimánek for the
  fix.
* In 1.0.0b2, we added a bug fix to allow DIV tags to peacefully co-exist with
  P tags in document structure. It turned out that this fix was a bit
  half-baked and actually broke both P and DIV tags in subtle ways, especially
  in webkit browsers. We've reverted that change, so DIVs are now just as
  broken as they were previously, but P tags are back to being peachy. The full
  fix for mixing DIV and P tags for structure is being worked on as part of
  [Issue 360](https://github.com/wymeditor/wymeditor/pull/360) and will
  hopefully land in 1.0.0b5, which is now definitely going to be a thing.

### 1.0.0 Blocking Issues

In an attempt to ovary-up (or whatever your preferred genatalia) and actually
get a 1.0.0 out the door, we've moved the goalposts a bit. The applicable 1.0.x
issues have been narrowed down a bit to the major bugs in supported browsers. I
understand that `major` is in the eye of the beholder, but this is an attempt
to more-effectively allocated the project's limited resources. The remaining
issues are listed on the [1.0.0
milestone](https://github.com/wymeditor/wymeditor/issues?milestone=5) and
you'll notice there are no features that made the cut. It's all bug-fix mode.

Folks have been using WYMeditor in production longer than Chrome has existed as
a browser. Perhaps it's time to not pretend like a non-1.0 version number means
anything.

## 1.0.0b3 (Beta 3)

*release-date* June 26, 2012

This is a small hotfix release to fix `jQuery.noConflict()` compatibility,
which is necessary for Drupal integration.

## 1.0.0b2 (Beta 2)

*release-date* June 22, 2012

### Enhancements

* Added a Slovak translation. Thanks Miroslav Bendik.

### Bug Fixes

* A missing space in the tools HTML was triggering quirks mode in FF and other
  browsers. Thanks to corphi for the fix.
* Inserting `div` tags via the API or DOM no longer breaks document structure
  in chrome and safari. Thanks to Jakub Krčma for the fix.
* It is once again possible to use the Drupal 7 wysiwyg module to integrate
  WYMeditor. Thanks to Jean-Francois Hovinne for the patch.
* Newline characters are no longer incorrectly removed in IE, which could cause
  words in copy/pasted lists to join together. Thanks to Jakub Krčma for the
  fix.
* Tables and images are once again properly inserted at your cursor location
  in Internet Explorer. This was a regression bug in 1.0.0b1.

## 1.0.0b1 (Beta 1)

*release-date* February 27, 2012

We're almost there! Following up on the later October alpha release, we're
happy to announce the availability of a beta-quality WYMeditor release. This
release is not without bugs, but we think it is strictly better than 0.5.0rc2
with a variety of enhancements and bug fixes. Users currently on an earlier
alpha or on 0.5.0rc2 are encouraged to try out this release and report any
bugs, especially those that are new since 0.5.0rc2.

Bugs that are determined to be regressions from 0.5.0rc2 will receive the
highest priority fixes.

Any feedback or discussion would be appreciated on the
[WYMeditor Forums](http://community.wymeditor.org/).

Versus 0.5.0rc2 we have:

* *19* major bug fixes
* *8* major enhancements including a new theme.
* A huge internal code refactor to make maintaining and improving WYMeditor easier
* A passing unit test suite containing more than 600 tests across all supported browsers

### Upgrade Cycle

Once all
[milestone 1.0.0 issues](https://github.com/wymeditor/wymeditor/issues?milestone=10&sort=created&direction=desc&state=open)
are completed, this cycle will culminate in a 1.0.0 stable release.

### Enhancements

* The parser now works harder to correct any invalid list nesting that might
  occur due to browser-specific problems or HTML that was loaded to begin. On
  every list action (indent, outdent, order/unordered conversion), the parser
  crawls your list to make any necessary corrections. This ensures a much more
  consistent list-editing experience, especially in Internet Explorer.
* A new *pretty* theme option is now available for modern browsers (ie9+, FF,
  Chrome, Safari). This theme uses CSS instead of images to provide context
  clues for blocks, resulting in fewer HTTP requests and better network
  performance. Additionally, the context clues have been expanded to provide a
  better "plain english" explanation of the elements. Give this new theme a
  swing at [the example](http://wymeditor.no.de/wymeditor/examples/17-pretty-theme.html).

  You can enable it in your project by passing the
  `iframeBasePath: "wymeditor/iframe/pretty/"` option to your WYMeditor instance.

  Thanks to first-time contributor Gyuris Gellért for the theme.
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
* Fixed a bug making it impossible to use *Paste From Word* inside tables or lists
* Fixed a list indent bug when indenting a list with a previous list item which
  had a sublist of a different list type. This used to create a second sublist
  of the original list type, which isn't what someone would expect.
* Fixed several related list outdent bugs where content could be re-ordered or
  where outdent would fail to occur.
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
* `<col />` tags are now automatically self-closing and the parser no longer
  forces a closing `</col>` tag.

  Thanks to first-time contributor Steven Bufton for the fix.



