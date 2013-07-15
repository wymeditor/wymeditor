# WYMeditor [![Build Status](https://travis-ci.org/wymeditor/wymeditor.png)](https://travis-ci.org/wymeditor/wymeditor)

WYMeditor is an open source web-based WYSIWYM editor with semantics and
standards in mind. The WYM-part stands for "What You Mean" compared to
the more common "What You See Is What You Get".

## Why WYMeditor?

WYMeditor is different from the [traditional](http://www.tinymce.com/)
[editors](http://ckeditor.com/) because we are 100% focused on providing
a simple experience for users that separates the content of their
document from the presentation of that document.  We focus on enforcing
web standards and separating a document's structure (HTML) from its
presentation (CSS). Your users won't know and shouldn't care about HTML,
but when they need consistent, standards-compliant, clean content,
they'll thank you.

There are lots of choices when it comes to a brower-based editor and
many of them are stable, mature projects with thousands of users. If you
need an editor that gives total control and flexibility to the user (not
you, the developer), then WYMeditor is probably not for you. If you want
an editor that you can customize to provide the specific capabilities
your users need, and you want users focused on the structure of their
content instead of tweaking fonts and margins, you should give WYMeditor
a try.

We also fully support Internet Explorer 6, for those poor souls who have
no choice.

## Try It

Want to see what WYMeditor can do? Try the [WYMeditor
examples](http://wymeditor.no.de/wymeditor/examples/) right now.

These examples run the bleeding edge code and give you a good idea of
what WYMeditor can do.

## Quick Start

1. WYMeditor requires a version of jQuery between 1.3.0 and 1.9.1. First
   ensure that your page includes jQuery.

    *Note*: If a version of jQuery at or above 1.8.0 is used, WYMeditor
    also requires jQuery Migrate. Ensure that your page also includes
    jQuery Migrate after jQuery is included.

2. Download the [Version
   1.0.0b4](https://github.com/downloads/wymeditor/wymeditor/wymeditor-1.0.0b4.tar.gz)
   archive and extract the contents to a folder in your project.

3. Include the `wymeditor/jquery.wymeditor.min.js` file on your page
   using this script. This file will pull in anything else that's
   required.

    ```html
    <script type="text/javascript" src="/wymeditor/jquery.wymeditor.min.js"></script>
    ```

4. Now use the `wymeditor()` function to select one of your `textarea`
   elements and turn it in to a WYMeditor instance. eg. if you have a
   `textarea` with the class `my-wymeditor`:

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

More examples with different plugins and configuration options can be
found in your `examples` directory.

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

Our documentation uses the [Sphinx](http://sphinx-doc.org/)
documentation tool.  The source lives in the `docs/` folder and every
pull requests that isn't just fixing a bug *must* come with
documentation.

You can see the current documentation at
[wymeditor.readthedocs.org](http://wymeditor.readthedocs.org).

### Testing WYMeditor

WYMeditor includes a full unit test suite to help us ensure that the editor
works great across a variety of browsers. The test suite should pass in any of
our supported browsers and if it doesn't, please [file a
bug](https://github.com/wymeditor/wymeditor/issues/new) so we can fix it!

#### Running the tests in a browser

1. Get a copy of the source using git:
    
    ```shell
    git clone git://github.com/wymeditor/wymeditor.git
    ```

2. Put your source behind some kind of web server (apache, nginx, etc). If you
don't have one installed or don't want to fuss with configuration, you can use
python's HTTP server:

    ```shell
    $ cd /path/to/my/wymeditor/src
    $ python -m SimpleHTTPServer
    ```

3. The unit test suite is located at `src/test/unit/index.html`, so if you used
the python instructions, open up your browser to
[http://localhost:8000/test/unit/index.html](http://localhost:8000/test/unit/index.html).

All green means you're good to go.

#### Running the tests from the command line

In addtion to the browser test suite, you can also run the unit tests
from the command line in a headless Phantom.js browser using Grunt by
following these instructions:

1. If you haven't already, get a copy of the source using git:
    
    ```shell
    git clone git://github.com/wymeditor/wymeditor.git
    ```
2. Use [NPM](http://npmjs.org/) to install the Grunt requirements by running
   this command in the root directory of the project:

    ```shell
    $ npm install
    ```
    *Note*: You might have to run this command as the the root user on your
    system.

3. Use NPM to install the Grunt CLI.

    ```shell
    $ npm install -g grunt-cli
    ```
    *Note*: You might have to run this command as the the root user on your
    system.

4. Finally, run the tests by running the `test` Grunt task in the root
   directory of the project:

    ```shell
    $ grunt test
    ```

If the task runs with no errors or failures, you're good to go.

#### Testing Different jQuery Versions

The unit tests can be run with the different versions of jQuery hosted on
Google's CDN. To do this when running tests in a browser, append the URL
parameter `?jquery=<version>` to the test suite URL. To do this when
running tests from the command line with Grunt, include the parameter
`--jquery=<version>` when running the `test` task. 

For a browser example, to test with jQuery 1.8.0 against a local server
on port 8000, use the URL:
[http://localhost:8000/test/unit/index.html?jquery=1.8.0](http://localhost:8000/test/unit/?jquery=1.8.0).

For a command line example, to test with jQuery 1.8.0 using Grunt, use
the command:

```shell
grunt test --jquery=1.8.0
```

### Building WYMeditor


1. Get a copy of the source using git:

    ```shell
    git clone git://github.com/wymeditor/wymeditor.git
    ```

2. Install `make`, Node.js and [UglifyJS](https://github.com/mishoo/UglifyJS/).
   To install UglifyJS using [NPM](http://npmjs.org/) run the following:

    ```shell
    npm install -g uglify-js
    ```

3. Run `make` from your git clone:

    ```shell
    $ cd wymeditor
    $ make
    ```

The resulting compressed distribution will appear in your `dist` directory.

#### Building with Google's Closure Compiler (Java)

The default WYMeditor distribution is built with
[UglifyJS](https://github.com/mishoo/UglifyJS), which requires the installation
of Node.js. If you prefer Java and/or Google's Closure Compiler, you can follow
these instructions instead.

1. Get a copy of the source using git:
    
    ```shell
    git clone git://github.com/wymeditor/wymeditor.git
    ```

2. Install `make` and Java.

3. Download [Closure Compiler
   application](https://developers.google.com/closure/compiler/), extracting
   `compiler.jar` into your `wymeditor` directory.

4. Run `make` from your git clone:

    ```shell
    $ cd wymeditor
    $ make min_closure archive
    ```

## Getting Help

 - **Documentation:** [wymeditor.readthedocs.org](http://wymeditor.readthedocs.org)
 - **Forum:** http://community.wymeditor.org
 - **Issue tracking:** https://github.com/wymeditor/wymeditor/issues
 - **Official branch:** https://github.com/wymeditor/wymeditor

[Read more on contributing](https://wymeditor.readthedocs.org/en/latest/version_2.0/contributing.html)

## Copyright

Copyright (c) 2005 - 2013 Jean-Francois Hovinne,
Dual licensed under the MIT (MIT-license.txt)
and GPL (GPL-license.txt) licenses.
