# Change History

This document tracks the enhancements and bug fixes between releases of
WYMeditor.

## 1.0.0b6 (Beta 6)

*release-date* June 10, 2014

### Bring your own CSS: Backwards-Incompatible Changes

All of these changes are documented in detail in the
[Upgrading to Version 1 docs](http://wymeditor.readthedocs.org/en/latest/customizing_wymeditor/index.html#upgrading-to-version-1).

* Skin CSS is no longer being included automatically. That means, that if
  you're using the default skin, you'll need to add a line like the
  following:
  `<link rel="stylesheet" type="text/css"
    href="wymeditor/skins/default/skin.css" />`
* We're no longer automatically doing an AJAX HTTP request to load various
  resources, including skin CSS/JS and language files. If you're using the
  default WYMeditor bundle, all you'll notice is that WYMeditor loads more
  quickly. If you're using a custom bundle, you'll need to be sure and include
  the translations and skin that you need before editor initialization.
* The default iframe has been modified with several usability improvements.
  To continue to support users who need/prefer the previous iframe, that
  option is now available as the `legacy` iframe.
* Configuring editor styles via WYMeditor options is no longer supported.
  The best language for using CSS is... CSS.

### Enhancements

* The unit test suite has been fixed to now fully pass using jQuery 1.4.4, and
  since 1.4.x is the oldest fully supported minor version of jQuery, the
  default version of jQuery packaged with the project and used for the unit
  test suite has been updated from 1.4.1 to 1.4.4.
* The XHTML parser will now unwrap the contents of `p` and `div` elements when
  those containers are inside list items. In addition, the parser will insert
  line breaks in place of the removed `p` and `div` containers if necessary to
  retain the spacing of the content within the list item. This enhancement was
  made because it was very easy to break a list while working with it in the
  editor if the list contained `p` or `div` elements, so unwrapping the content
  of those containers and preserving the content spacing with line breaks is a
  much more stable way to have editable content within lists.
* We now include a translation file for traditional Chinese (`zh_tw`). Thanks
  to Arthur CHAN for his first contribution.
* [#500](https://github.com/wymeditor/wymeditor/issues/500) For developers the
  HTML comparisons in failed unit tests are now also displayed as beautified
  HTML!
* [#496](https://github.com/wymeditor/wymeditor/pull/496) For developers,
  skipping the parser in unit tests has been standardized.
* A new selection getting and setting API.
  [#513](https://github.com/wymeditor/wymeditor/pull/513),
  [#523](https://github.com/wymeditor/wymeditor/pull/523)

### Bug Fixes

* When selecting list items in multiple separate lists at once with content in
  between them, there was an issue where the indent and outdent tools would
  still be applied to all of the list items in each of the selected lists. This
  behavior has been adjusted so that the indent and outdent tools will not
  apply to lists unless the selection is entirely contained within one list.
  [#418](https://github.com/wymeditor/wymeditor/issues/418)
* 1.0.0b5 introduced a regression bug which allowed `br` tags to exist at the
  document root, even after parsing. This is no longer the case.
  [#431](https://github.com/wymeditor/wymeditor/issues/431)
* IE8 has a bug in `designMode`, where it breaks lists under certain
  circumstance. [#446](https://github.com/wymeditor/wymeditor/issues/446). This
  is now properly handled.
* [#517](https://github.com/wymeditor/wymeditor/pull/517) Fixed a bug regarding
  self-closing tags in our editor Iframes.
* After an enter press in an empty, nested, `li`, browsers produced various
  undesired results. This is now fixed. Caveat: there is still some
  inconsistency amongst browsers, as in some a new `li` is produced and in
  others a new `br`.
  [#430](https://github.com/wymeditor/wymeditor/issues/430)
* When batch-initializing editors without an explicit initial HTML, the value
  of the first editor’s textarea that was non-empty was used as the initial
  value for all of the following editors. This is now fixed; each editor is
  initialized with its own textarea’s value.
  [#437](https://github.com/wymeditor/wymeditor/pull/437)
* Fixed a layout bug in the seamless skin.
  [#445](https://github.com/wymeditor/wymeditor/pull/445)

### Infrastructure Improvements

* Both the examples and the website are now hosted on github pages,
  which means no more broken links.
* We're now distributing an already-built version of WYMeditor
  located in the ``dist/`` folder
  as part of the repository.
  This lowers the barrier to entry for trying out WYMeditor.
  It will also allow us
  to add [component](https://github.com/component/component) support.
  Hooray better Javascript component packaging!
* To take advantage of Livereload support in development,
  you must now install a [browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-).
  Automatic livereload injection was causing problems
  in older Internet Explorer.
* Bower components are now installed automatically
  when using the Vagrant setup.

### Skins

#### Seamless

Introducing the Seamless skin! This skin uses a resizing iframe
and floating toolbar to make the WYMeditor UI less obtrusive.
Your users will no longer see the second vertical scrollbar,
removing one more thing separating them from their content.

### Build Process Improvements

* The project can now be fully built using Grunt instead of `make`. Simply use
  the Grunt `build` task to build the project from the source code.
* The failing tests on IE9 and IE10 have been fixed so that the unit test suite
  passes fully in those browsers with all supported versions of jQuery. With
  these fixes, the unit test suite should now pass fully in all supported
  browsers (Chrome, Firefox, Phantom.js, and IE7-10) with all supported
  versions of jQuery (1.4-1.9).
* The build now fully passes a `$ grunt jshint` run
  and this is now automatically run as part of continuous integration
  on Travis-CI. No more nasty code!

## 1.0.0b5 (Beta 5)

*release-date* July 31, 2013

### Enhancements

* We now have all of the documentation in one place at
  [wymeditor.readthedocs.org](https://wymeditor.readthedocs.org)! No more
  switching back and forth between the old Trac site and the github Wiki. The
  new documentation uses [Sphinx](http://sphinx-doc.org/) and new pull
  requests will now be able to come with `docs/` already committed!  Thanks to
  Nick McLaughlin for the herculean effort in combining the years of spread-out
  documentation.
* We now document how to run WYMeditor with jQuery 1.8.x and 1.9.x via
  [jquery-migrate](https://github.com/jquery/jquery-migrate/). The unit tests
  now also support those versions of jQuery.
* Some community members have created a
  [Django-CMS 3](https://github.com/wymeditor/djangocms_wymeditor_plugin)
  plugin for WYMeditor. If you're upgrading from Django-CMS 2 to 3, you'll want
  to check it out.
* Tables can now be inserted and used in lists. Previously, the editor would
  not let the user insert a table anywhere in a list, but now, the user can
  insert a table at any point in a list or sublist and can even insert multiple
  tables in the same list item. In addition, the tables should properly indent,
  outdent, and space themselves within a list.
* Elements in the editor can now easily be flagged to be removed from the
  editor output by the XHTML parser. This allows elements to be "editor-only"
  in the sense that they will be visible in the editor but not included in the
  outputted XHTML from the editor. Simply add the class
  `WYMeditor.EDITOR_ONLY_CLASS` to an element to specify it to be removed by
  the XHTML parser in this manner.
* Classes can now be specified to be removed from tags' `class` attribute by
  the XHTML parser. Simply add a string for each of the class names to remove
  to the `WYMeditor.CLASSES_REMOVED_BY_PARSER` array, and the XHTML parser will
  remove all of those classes from all the tags in the editor's output.
* `div` elements are now visible and labeled in the editor so that they can
  easily be worked with. In addition, `div` containers can now be switched to
  other container types using the containers panel. This change was made to
  allow for the addition of the selectable default root container feature
  described in the following point.
* The default root container used by the editor can now be specified as
  an option to be either `p` or `div`. The specified container for this option
  will be used by default when an unspecified new container is created in the
  root of the editor, and it will also be used as the default container for
  wrapping any text or inline elements inserted directly into the editor body.
  In addition, the editor will enforce that the unchosen option for the
  default root container is not allowed in the root of the document by
  converting the unchosen default root container to the chosen default root
  container when possible (e.g. if `div` is specified as the default root
  container, the editor will convert `p` elements in the root of the document
  to `div` elements when the user modifies those containers). The default root
  container option can be specified as an option of the new `structureRules`
  option in the editor's initialization. For example:

    ```javascript
    jQuery('.wymeditor').wymeditor({
        structureRules: {
            defaultRootContainer: 'div'
        }
    });
    ```

### Bug Fixes

* WYMeditor now works properly in Chrome when using jQuery 1.4 or higher.
  Thanks to several folks for outlining the fix and for Nick McLaughlin for the
  pull request.
* When using the bold tool in a heading in Chrome, there was an issue where a
  span with a style attribute set to `font-weight: normal` would be wrapped
  around the header's content. This has been fixed so that this span will no
  longer occur after bolding.
* When attempting to insert an image outside of a container in Chrome such as
  in the case of inserting an image into a blank document, there was an issue
  where the image was being moved outside of the wymeditor body causing none of
  the user-entered values for the attributes of the image to be applied to the
  image. This has been fixed so that inserting an image properly places it
  within the wymeditor body and properly applies the user-entered values for
  its attributes.
* When switching between a normal table cell and a table header using the
  "Table Header" option in the containers panel in the editor, any `colspan` or
  other attributes were being lost in the container conversion. This has been
  fixed so that all attributes such as `colspan` are retained when switching
  between a normal table cell and a table header.
* In various situations when working in the editor, hitting enter to
  create a new container in the root of the document would erroneously
  create a `div` container instead of a `p` container. This `div`
  container would not be labeled in the editor, and it could not be
  converted to another type of container. As part of the feature
  addition of a selectable default root container, this issue has been
  fixed so that the selected default root container is always inserted
  when hitting enter to create a new container in the root of the
  document. In addition, `div` containers are now clearly labeled in the
  editor and can now be converted to other types of containers using the
  containers panel.
* A couple bugs in IE dealing with content not allowed to be in the root of the
  editor body not being properly wrapped in containers have been fixed. The
  first bug fixed was that text directly typed into the body of the editor was
  not being wrapped in a container, but this is now fixed and the text will be
  properly wrapped in the default root container. The second bug fixed was that
  inline elements not allowable to be directly inserted into the body of the
  editor (e.g. `strong`, `em`, `a`, etc.) were not being wrapped in a
  container, but this is also now fixed and those elements will be properly
  wrapped in the default root container when modified in the body.

### Build Process Improvements

* [Grunt](http://gruntjs.com/) has been set up for the WYMeditor project so
  that the unit test suite can now easily be run from the command line in a
  headless [Phantom.js](http://phantomjs.org/) browser using the Grunt `test`
  task. See the testing section in the README or the docs for more information.
* The WYMeditor project is now set up on [Travis CI](https://travis-ci.org/)
  for continuous integration using the unit test suite run with a variety of
  jQuery versions using the Grunt `test` task.
* [Selenium2](http://seleniumhq.org/) tests have been set up for the WYMeditor
  project to allow for testing coverage of some behaviors that can't be
  replicated well with JavaScript. See the README for information on running
  the Selenium tests.

### Deprecation

* The `WYMeditor.editor.html()` function has been deprecated and replaced with
  the `WYMeditor.editor._html()` function that has the same functionality. This
  change was made to discourage users from using the `html()` function (which
  is intended only for internal use) as a means to get the HTML output from the
  editor because that function bypasses all parsing and cross-browser cleanup
  for the HTML.  In most cases, users should be using the
  `WYMeditor.editor.xhtml()` function to get the HTML output from the editor
  because it does parse and apply cross-browser cleanup to the HTML. Now, using
  the `html()` function will still work but just give a console warning of its
  deprecation, but the function will be fully removed in the release of version
  1.0.0.

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
  swing at [the example](http://wymeditor.github.io/wymeditor/dist/examples/17-pretty-theme.html).

  You can enable it in your project by passing the
  `iframeBasePath: "wymeditor/iframe/pretty/"` option to your WYMeditor instance.

  Thanks to first-time contributor Gyuris Gellért for the theme.
* The Embed plugin now supports embedding via an iframe.
* List indent/outdent has been rewritten to fix several outstanding bugs in
  various browsers. Indent and outdent are now always opposites of each other
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
  in the editor temporarily and randomly disappearing after a keypress, only
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
  at the start and end of documents, as well as in between each other.
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



