Pre-Release Checklist
=====================

In order to ensure that releases are high-quality and easy for users to pick up
and run with, it's important to ensure consistency. The basic idea is that we
need to make sure there are no reported regressions from previous releases
(don't go backwards), ensure all of the new code is quality (passing unit tests
in supported browsers), update the docs (README, `package.json` etc),
build/distribute the tarball and then make the appropriate announcements
(forums, IRC, etc).

These are the things that need to happen so that they don't live in someone's
very-fallible head (*cough* Wes).

No Regression Bugs
------------------

We shouldn't break things that used to work between releases. That undermines
user confidence and makes it hard to build momentum of positive improvement
since it becomes an equation with both positive and negatives which will be
weighted differently for different people. That doesn't mean we can't make
backwards-incompatible changes, but it does mean that anything that might be
backwards incompatible needs to be very explicitly planned for.

This can generally be verified by running through the issue tracker and making
sure no new bugs have been reported that didn't exist in prior versions. If
there has been, that issue needs to be addressed before a new release should be
cut. Bugs that are a result of running WYM in a new browser (new Chrome or
Firefox release, for example) don't count as regression bugs for this purpose,
but should be given high priority otherwise.

[This report](https://github.com/wymeditor/wymeditor/issues?labels=regression&page=1&state=open)
should be empty.

Passing Tests
-------------

All releases should have 100% passing unit tests in 100% of supported
browsers for all of the supported versions of jQuery.

The person doing the release is responsible for running the unit tests in all
supported browsers before cutting a release tarball.

Update Documentation
--------------------

It's important that users can be confident that the documentation distributed
with WYMeditor is up to date so that it can be trusted.
As of June 2014,
we've made some progress in this area,
but at the very least we need to keep the
documentation bundled with the source accurate.

Checklist:

* Ensure that the version number is correct (no `dev` extension)
  in these places:
    * `package.json`
    * `docs/conf.py`
    * The Custom vars in `_config.yml` for website generation
* Ensure all changes since the last version are noted in section specifically
  for this release inside `CHANGELOG.md`. Users upgrading from a specific
  version should be able to easily see what changes might effect them.
* If this release makes a transition from alpha to beta or beta to stable,
  consolidate point alpha/beta `CHANGELOG.md` entries in to a unified section
  for this release. For a major release, also flesh out highlights and examples
  that are most important.
* Set a date for the release in `CHANGELOG.md`.
* In the *Quick Start* section of `README.md`,
  update the step for downloading the release archive
  to point to the appropriate release page
  for the current version.
  Grepping for the old version makes this easy.
* Review the `README.md` for any changes that might be necessary as a result of
  changes in this release.
  All changes made here will likely
  also need to be made in ``index.html`` for the website.
* Update the [website](http://wymeditor.readthedocs.org/en/latest/wymeditor_development/index.html#wymeditor-website) content,
  making any necessary changes to `index.html`.

Build and Distribute the Archive
================================

Any user should be able to follow the instructions in the README to make their
own archive, but it's important to include an archive in a known place for ease
of use.

1. Ensure that the checked-in version located in `dist/`
   is up to date with the current source
   by [Building WYMeditor](http://wymeditor.readthedocs.org/en/latest/wymeditor_development/building_wymeditor.html).
2.* Build the [website](http://wymeditor.readthedocs.org/en/latest/wymeditor_development/index.html#wymeditor-website)
   using jekyll
   and then push it to the `gh-pages` branch.
   to create the `tar.gz` archive.
3. Tag the current version in git using [Semantic
   Versioning](http://semver.org/) and push the tag to github.
4. Navigate to the [WYMeditor Releases](https://github.com/wymeditor/wymeditor/releases)
   page on github and
   draft a new release for the tag of the current version.

   1. Add the information from the CHANGELOG for the current version
   to the release description.
   2. Using the **Attach binaries** feature,
   upload the built `tar.gz` archive
   named according to the `wymeditor-<version>.tar.gz` format.

Tell the World
==============

If a new release is cut in the forest when nobody is there, does it make a
sound? A new release isn't much good if nobody knows about it.

* Tweet out the good news to [@wymeditor](http://twitter.com/wymeditor).
* Call your mother.

Prepare For the Next Release
============================

* Create a new version entry in `CHANGELOG.md`
* Bump the version string in `package.json`
* Bump the version string for the Sphinx documentation at `docs/conf.py`

