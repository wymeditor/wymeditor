Pre-Release Checklist
=====================

In order to ensure that releases are high-quality and easy for users to pick up
and run with, it's important to ensure consistency. The basic idea is that we
need to make sure there are no reported regressions from previous releases
(don't go backwards), ensure all of the new code is quality (passing unit tests
in supported browsers), update the docs (README, version.txt etc),
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

Passing Tests
-------------

All releases should have 100% passing unit tests in 100% of supported browsers.
They should also pass all of the continuous integration criteria as defined by
the jobs on [http://jenkins.wymeditor.org](http://jenkins.wymeditor.org), which
means passing jslint and any other static analysis checks.

The person doing the release is responsible for running the unit tests in all
supported browsers before cutting a release tarball.

Update Documentation
--------------------

It's important that users can be confident that the documentation distributed
with WYMeditor is up to date so that it can be trusted. As of December 2011, we
have a long way to go in this area, but at the very least we need to keep the
documenation bundled with the source accurate.

Checklist:

* Bump the version number in `version.txt`.
* Ensure all changes since the last version are noted in section specifically
  for this release inside `CHANGELOG.md`. Users upgraded from a specific
  version should be able to easily see what changes might effect them.
* If this release makes a transition from alpha to beta or beta to stable,
  consolidate point alpha/beta `CHANGELOG.md` entries in to a unified section for
  this release. For a major release, also flesh out highlights and examples
  that are most important.
* Set a date for the release in `CHANGELOG.md`.
* In the *Download* section of `README.md`, update the *Latest Release* link to
  point to the appropriate version and the appropriate github download target.
  The tar.gz should be named in the format `wymeditor-<version>.tar.gz`.
* Review the `README.md` for any changes that might be necessary as a result of
  changes in this release.

Build and Distribute the Archive
================================

Any user should be able to follow the instructions in the readme to make their
own archive, but it's important to include an archive in a known place for ease
of use. 

* Follow the `README.md` instructions to create the `tar.gz` archive.
* Tag the current version in git using [Semantic Versioning](http://semver.org/) 
  and push the tag to github.
* Navigate to the [WYMeditor Downloads](https://github.com/wymeditor/wymeditor/downloads) 
  page on github and upload the archive using the `wymeditor-<version>.tar.gz`
  format for the *Short Description* field (which is used in the URL).  

Tell the World
==============

If a new release is cut in the forest when nobody is there, does it make a
sound? A new release isn't much good if nobody knows about it.

* Make a new sticky thread on the [WYMeditor Forums](http://community.wymeditor.org) 
  announcing the new release with the title `Version <version> released`.
  Highlight any major changes, link to the changelog and download and maybe
  comment on plans for the next release.
* Tweet out the good news to [@wymeditor](http://twitter.com/wymeditor).
* Call your mother.





