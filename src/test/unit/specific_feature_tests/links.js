/* jshint evil: true */
/* global
    manipulationTestHelper,
    prepareUnitTestModule,
    makeTextSelection,
    test,
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
            "title=\"Example\">bar</a></p>"
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
            " target=\"_blank\">Bar</a></p>"
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
        expectedResultHtml: "<p>Foo</p>"
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
        skipFunc: function () {
            if (jQuery.browser.name !== "msie") {
                return SKIP_THIS_TEST;
            }
        }
    });
});

test("Doesn't unlink across root containers", function () {
    var noChangeHtml = "<p><a href=\"http://example.com/\">Foo</a></p>" +
        "<p><a href=\"http://example.com/\">Bar</a></p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
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
        expectedResultHtml: noChangeHtml
    });
});
