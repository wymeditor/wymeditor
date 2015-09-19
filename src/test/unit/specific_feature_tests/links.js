/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    makeTextSelection,
    test,
    IMG_SRC,
    inPhantomjs,
    SKIP_THIS_TEST
*/
"use strict";

module("links", {setup: prepareUnitTestModule});

test("Inserts link with attributes", function () {
    manipulationTestHelper({
        startHtml: "<p>Foobar</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.$body().children('p');
            // Select "bar".
            makeTextSelection(
                wymeditor,
                p,
                p,
                3,
                6
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.link({href: 'http://example.com/', title: 'Example'});
        },
        expectedResultHtml: "<p>Foo<a href=\"http://example.com/\" " +
            "title=\"Example\">bar</a></p>",
        testUndoRedo: true
    });
});
test("Modifies link attributes", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/foo\">Bar</a></p>",
        setCaretInSelector: 'a',
        manipulationFunc: function (wymeditor) {
            wymeditor.link({href: "http://example.com/baz", target: "_blank"});
        },
        expectedResultHtml: "<p><a href=\"http://example.com/baz\"" +
            " target=\"_blank\">Bar</a></p>",
        testUndoRedo: true
    });
});

test("Unlinks entirely linked selection", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
        prepareFunc: function (wymeditor) {
            var a = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: "<p>Foo</p>",
        testUndoRedo: true
    });
});

test("Non-IE browsers partially unlink according to selection", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
        prepareFunc: function (wymeditor) {
            var a = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                2,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: "<p><a href=\"http://example.com/\">Fo</a>o</p>",
        testUndoRedo: true,
        skipFunc: function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("IE entirely unlinks regardless of selection", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
        prepareFunc: function (wymeditor) {
            var a = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                2,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: "<p>Foo</p>",
        testUndoRedo: true,
        skipFunc: function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("Unlinks across root containers", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/\">Foo</a></p>" +
        "<p><a href=\"http://example.com/\">Bar</a></p>",
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                firstA = body.childNodes[0].childNodes[0],
                secondA = body.childNodes[1].childNodes[0];
            makeTextSelection(
                wymeditor,
                firstA,
                secondA,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: "<p>Foo</p><p>Bar</p>",
        testUndoRedo: true
    });
});

test("Non-IE browsers don't unlink when collapsed selection " +
     "inside link", function () {
    var noChangeHtml = "<p><a href=\"http://example.com/\">Foo</a></p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
        prepareFunc: function (wymeditor) {
            var a = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                1,
                1
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: noChangeHtml,
        testUndoRedo: true,
        skipFunc: function () {
            if (jQuery.browser.name === "msie") {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("IE unlinks when collapsed selection inside link", function () {
    manipulationTestHelper({
        startHtml: "<p><a href=\"http://example.com/\">Foo</a></p>",
        prepareFunc: function (wymeditor) {
            var a = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                a,
                a,
                1,
                1
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: "<p>Foo</p>",
        testUndoRedo: true,
        skipFunc: function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("Links selected unlinked image", function () {
    manipulationTestHelper({
        startHtml: "<p>A <img alt=\"pen\" src=\"" + IMG_SRC + "\" /></p>",
        prepareFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            wymeditor._selectSingleNode(img);
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.link({href: "http://example.com/"});
        },
        expectedResultHtml: [""
            , "<p>"
                , "A "
                , "<a href=\"http://example.com/\">"
                    , "<img alt=\"pen\" src=\"" + IMG_SRC + "\" />"
                , "</a>"
            , "</p>"
        ].join(""),
        skipFunc: function () {
            return inPhantomjs ? SKIP_THIS_TEST : null;
        }
    });
});

test("Modifies linked image", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<p>"
                , "<a href=\"http://example.com/\">"
                    , "A "
                    , "<img alt=\"pen\" src=\"" + IMG_SRC + "\" />"
                , "</a>"
            , "</p>"
        ].join(""),
        prepareFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            wymeditor._selectSingleNode(img);
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.link({href: "http://example.com/foo"});
        },
        expectedResultHtml: [""
            , "<p>"
                , "<a href=\"http://example.com/foo\">"
                , "A "
                    , "<img alt=\"pen\" src=\"" + IMG_SRC + "\" />"
                , "</a>"
            , "</p>"
        ].join(""),
        skipFunc: function () {
            return inPhantomjs ? SKIP_THIS_TEST : null;
        }
    });
});

test("Unlinks linked image", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<p>"
                , "A "
                , "<a href=\"http://example.com/\">"
                    , "<img alt=\"pen\" src=\"" + IMG_SRC + "\" />"
                , "</a>"
            , "</p>"
        ].join(""),
        prepareFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            wymeditor._selectSingleNode(img);
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.exec(WYMeditor.EXEC_COMMANDS.UNLINK);
        },
        expectedResultHtml: [""
            , "<p>"
                , "A "
                , "<img alt=\"pen\" src=\"" + IMG_SRC + "\" />"
            , "</p>"
        ].join(""),
        skipFunc: function () {
            return inPhantomjs ? SKIP_THIS_TEST : null;
        }
    });
});
