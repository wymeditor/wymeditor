Proposed Build Stack
====================

100% Javascript
---------------

For WYMeditor 1.0, we're moving to an all-Javascript build stack from the
Node.js community. The rationale behind this is simple – use tools that make
sense to JS developers. Any person with ``node.js`` and ``npm`` installed
should be able to run a few ``npm`` commands and then do development or run a
build.

The goal will be to combine asset-management best practices like concatenation
and minification for CDNs with automatic file generation for easy development.
Editors like TinyMCE are often criticized for poor HTTP performance and there
are posts strewn across the interwebs from people attempting to hack together
solutions to this problem. We should solve it for everyone by default and even
make it easy for folks to make custom builds with just the plugins that they
require.

Components
----------

General build tool
^^^^^^^^^^^^^^^^^^

There are always miscellaneous tasks and helpers that developers need, from
building documentation to bumping version numbers and tagging a new release.
It's always nice for new users if there is a consistent way of performing these
actions.

`Jake <https://github.com/mde/jake>`_

A port of Rake. We should be able to lint, run tests, build documentation,
create a full build or create customized builds all from jake.

Asset Management
^^^^^^^^^^^^^^^^

We ultimately want the ability to produce a trio of one minified javascript
file, one minified CSS file and one image file with all requirements. This will
include the editor, its skin and any plugins the developer wants to enable
(including 3rd-party plugins) along with all of their assets.

Either `node-ams <https://github.com/kof/node-ams>`_ or
`local-cdn <https://github.com/larrymyers/local-cdn>`_. Both provide a
file-watching development server via node.js to allow easy development. Both
let you statically define and then generate files on demand for releases.

Documentation
^^^^^^^^^^^^^

What we really need is `Sphinx <http://sphinx.pocoo.org/>`_ ported to
Javascript, but until something like that emerges in the node community, the
standard solution is inline documentation plus stand-alone statically-generated
HTML documentation.

Inline Documentation
""""""""""""""""""""

`Docco <http://jashkenas.github.com/docco/>`_

Allows writing inline docs in pure Markdown. Not as restricting as most other
solutions since it isn't modeled after programming paradigms foreign to
JavaScript. Also good for consistency across different platforms (GitHub wiki,
issues and comments, the new forum, etc.)

Full Documentation
""""""""""""""""""

Inline documentation doesn't cover tutorials, API documentation and reference
docs. The `Django <https://docs.djangoproject.com/en/1.3/>`_ documentation is a
good example of what we're going for. For now, it seems most projects are
rolling their own combination of statically-generated HTML sites powered by
MarkDown. To start, rip off the documentation from a project like express and
get started.

Testing
^^^^^^^

* `QUnit <https://github.com/jquery/qunit>`_ for the test framework.
* `phantomJS <http://code.google.com/p/phantomjs/>`_ and `qunit-tap
  <https://github.com/twada/qunit-tap>`_ to run the tests from the command line
  for quick webkit tests.
* `Jenkins <http://jenkins.wymeditor.org/>`_ for CI to automatically package
  builds, run static analysis, run phantomJS tests and then use `Sauce On
  Demand <http://saucelabs.com/ondemand>`_ to spin up supported browsers for
  cross-browser testing.
* `TestSwarm <https://github.com/jquery/testswarm>`_ for coordinating
  cross-browser tests in all supported browsers.
* `node-jshint <https://github.com/jshint/node-jshint>`_ for static analysis
  and linting.
