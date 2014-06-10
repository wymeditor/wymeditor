# WYMeditor [![Build Status](https://travis-ci.org/wymeditor/wymeditor.png?branch=master)](https://travis-ci.org/wymeditor/wymeditor)

WYMeditor is an open source web-based WYSIWYM editor with semantics and
standards in mind. The WYM-part stands for "What You Mean" compared to
the more common "What You See Is What You Get".

## Why WYMeditor?

WYMeditor is different from the [traditional](http://www.tinymce.com/)
[editors](http://ckeditor.com/) because we are 100% focused on providing a
simple experience for users that separates the content of their document from
the presentation of that document.  We focus on enforcing web standards and
separating a document's structure (HTML) from its presentation (CSS). Your
users won't know and shouldn't care about HTML, but when they need consistent,
standards-compliant, clean content, they'll thank you.

There are lots of choices when it comes to a browser-based editor and many of
them are stable, mature projects with thousands of users. If you need an editor
that gives total control and flexibility to the user (not you, the developer),
then WYMeditor is probably not for you. If you want an editor that you can
customize to provide the specific capabilities your users need, and you want
users focused on the structure of their content instead of tweaking fonts and
margins, you should give WYMeditor a try.

## Try It

Want to see what WYMeditor can do? Try the [WYMeditor
examples](http://wymeditor.github.io/wymeditor/dist/examples/) right now.

These examples run the bleeding edge code and give you a good idea of what
WYMeditor can do.

## Quick Start

1. WYMeditor requires a version of [jQuery](http://jquery.com/) between 1.3.0
   and 1.9.1. First ensure that your page includes jQuery.

    *Note*: If a version of jQuery at or above 1.8.0 is used, WYMeditor also
    requires [jQuery Migrate](https://github.com/jquery/jquery-migrate/).
    Ensure that your page also includes jQuery Migrate after jQuery is
    included.

2. Download the Version 1.0.0b6 archive from the [release
   page](https://github.com/wymeditor/wymeditor/releases/tag/v1.0.0b6)
   and extract the contents to a folder in your project.

3. Include the `wymeditor/jquery.wymeditor.min.js` file on your page using this
   script. This file will pull in anything else that's required.

    ```html
    <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>
    ```

4. Now use the `wymeditor()` function to select one of your `textarea` elements
   and turn it in to a WYMeditor instance. eg. if you have a `textarea` with
   the class `my-wymeditor`:

    ```javascript
    $('.my-wymeditor').wymeditor();
    ```
    *Note*: You'll probably want to do this initialization inside a
    `$(document).ready()` block.

5. If you'd like to receive the valid XHTML your editor produces on form
   submission, just add the class `wymupdate` to your submit button.

    ```html
    <input type="submit" class="wymupdate" />
    ```

6. ???

7. Profit!

More examples with different plugins and configuration options can be found in
your `examples` directory.

## Compatibility

WYMeditor is compatible with:

### Browsers

* IE: 7, 8, 9 and 10
* Firefox: LTS and latests two major versions
* Opera: Latest version
* Safari: Latest version
* Google Chrome: Latest two major versions

### jQuery

* Versions 1.3.X to 1.7.X
* Version 1.8.x to 1.9.X when you include
  [jquery-migrate](https://github.com/jquery/jquery-migrate/)

## Contributing to WYMeditor

### Documentation

Our documentation uses the [Sphinx](http://sphinx-doc.org/) documentation tool.
The source lives in the `docs/` folder and every pull requests that isn't just
fixing a bug *must* come with documentation.

You can see the current documentation at
[wymeditor.readthedocs.org](http://wymeditor.readthedocs.org).

### Testing WYMeditor

To maintain quality, WYMeditor includes both a [Qunit](http://qunitjs.com/)
unit test suite and a [Selenium2](http://seleniumhq.org/) test suite. You are
encouraged to run both of them, with all tests passing in all supported
browsers. If that's ever not the case, please [file a
bug](https://github.com/wymeditor/wymeditor/issues/new) so we can fix it!

All of the following instructions assume you've already retrieved a copy of the
source, using git like so:

```shell
git clone git://github.com/wymeditor/wymeditor.git
```

#### Unit Tests vs Selenium Tests

The unit test suite covers the vast majority of required tests and can be
quickly run by anyone with a copy of the source code either from the command
line or in a browser. For the majority of behavior, a unit test will suffice.
Unfortunately, there are cases where browser behavior can't be simulated in a
unit test (these primarily involve testing browser-specific input handling and
`execCommand` behavior). To test these issues, a Selenium test is required.

Currently, the Selenium test suite is written in python. In the future, we
would like to move to the node.js [wd](https://github.com/admc/wd) module. This
will once again allow a contributor to only require knowledge of javascript in
order to enhance WYMeditor.

#### Running Unit Tests

Read the documentation on [Testing WYMeditor](http://wymeditor.readthedocs.org/en/latest/wymeditor_development/testing_wymeditor.html).

#### Selenium Tests

Because WYMeditor is strongly affected by the way various browsers handle
certain native events (keystrokes, mouse navigation, switching windows), it's
not always possible to use JavaScript to actually test that behavior. For
specific cases where it's not possible to reproduce a behavior in JavaScript,
we rely on our [Selenium2](http://seleniumhq.org/) test suite to drive an
actual browser using the [Selenium 2 python
bindings](http://pypi.python.org/pypi/selenium).

If possible, it is strongly encouraged to write a JavaScript unit test using
Qunit instead of a Selenium test.

##### Running Selenium Tests

1. Install the Selenium 2 python bindings, roughly following these
   [installation
   instructions](http://selenium-python.readthedocs.org/en/latest/installation.html).
   The specific version of the python Selenium bindings and the nose testing
   framework we require are defined in a [pip](http://www.pip-installer.org/)
   requirements file located at `wym_selenium/requirements.txt`. To install
   these, we recommend that you first create an isolated python
   [virtualenv](http://www.virtualenv.org/):

    ```shell
	$ mkdir -p ~/.virtualenvs
	$ virtualenv ~/.virtualenvs/wym
    ```

2. Then use pip to install the requirements:

    ```shell
	(wym)$ cd /path/to/wymeditor
	(wym)$ pip install -r selenium_requirements.txt
    ```

3. To run the Selenium tests, you'll first need to serve the `src` directory
   with a web server. If you have python installed, then you can simply open a
   terminal and run:

    ```shell
	$ cd /path/to/wymeditor
	$ make testserver
    ```

   You'll need to keep this terminal open when running the tests.

4. Then you can use make once again (in another terminal) to actually run the
   tests:

    ```shell
	$ source ~/.virtualenvs/wym/bin/activate
	(wym)$ cd /path/to/wymeditor
	(wym)$ make selenium
    ```

### Building WYMeditor

Read about [Building WYMeditor](http://wymeditor.readthedocs.org/en/latest/wymeditor_development/building_wymeditor.html)

## Getting Help

 - **Documentation:** [wymeditor.readthedocs.org](http://wymeditor.readthedocs.org)
 - **Forum:** http://community.wymeditor.org
 - **Issue tracking:** https://github.com/wymeditor/wymeditor/issues
 - **Official branch:** https://github.com/wymeditor/wymeditor

[Read more on
contributing](http://wymeditor.readthedocs.org/en/latest/wymeditor_development/contributing.html)

## Copyright

Copyright (c) 2005 - 2013 Jean-Francois Hovinne,
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
