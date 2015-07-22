/* global
    prepareUnitTestModule,
    test,
    manipulationTestHelper,
    inPhantomjs,
    SKIP_THIS_TEST,
    IMG_SRC
*/
"use strict";

/*
 * This file has tests for class toggling. `editor.toggleClass`.
 */

var toggleClassModuleClassesItems = [
    {
        name: "foo",
        title: "Foo",
        expr: "*"
    },
    {
        name: "bar",
        title: "Bar",
        expr: "ul"
    },
    {
        name: "fancy",
        title: "Fancy image",
        expr: "img"
    }
];

function toggleClassModuleSetup() {
    prepareUnitTestModule({
        options: {
            classesItems: toggleClassModuleClassesItems
        }
    });
}

module("toggleClass", {setup: toggleClassModuleSetup});

test("No change when no selection", function () {
    var noChangeHtml = "<p>Foo</p>";
    manipulationTestHelper({
        startHtml: noChangeHtml,
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: noChangeHtml
    });
});

test("Adds className", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p class=\"foo\">Foo</p>"
    });
});

test("Removes className", function () {
    manipulationTestHelper({
        startHtml: "<p class=\"foo\">Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p>Foo</p>"
    });
});

test("Adds className, keeping existing ones", function () {
    manipulationTestHelper({
        startHtml: "<p class=\"bar\">Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p class=\"bar foo\">Foo</p>"
    });
});

test("Removes className, keeping all others", function () {
    manipulationTestHelper({
        startHtml: "<p class=\"bar foo baz\">Foo</p>",
        setCaretInSelector: "p",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("foo", "p");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_foo a",
        expectedResultHtml: "<p class=\"bar baz\">Foo</p>"
    });
});

test("Adds className, selector determines element", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<ul>"
                , "<li>"
                    , "A " // space due to IE8 bug
                    , "<ul>"
                        , "<li id=\"bar\">"
                            , "Bar " // space due to IE8 bug
                            , "<ul>"
                                , "<li>"
                                    , "Foo"
                                , "</li>"
                            , "</ul>"
                        , "</li>"
                    , "</ul>"
                , "</li>"
            , "</ul>"
        ].join(""),
        setCaretInSelector: "#bar",
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("bar", "ul");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_bar a",
        expectedResultHtml: [""
            , "<ul>"
                , "<li>"
                    , "A " // space due to IE8 bug
                    , "<ul class=\"bar\">"
                        , "<li id=\"bar\">"
                            , "Bar " // space due to IE8 bug
                            , "<ul>"
                                , "<li>"
                                    , "Foo"
                                , "</li>"
                            , "</ul>"
                        , "</li>"
                    , "</ul>"
                , "</li>"
            , "</ul>"
        ].join("")
    });
});

test("Adds className to image", function () {
    manipulationTestHelper({
        startHtml: [""
            , "<p>"
                , "Foo"
                , "<img alt=\"foo\" src=\"" + IMG_SRC + "\" />"
            , "</p>"
        ].join(""),
        prepareFunc: function (wymeditor) {
            var img = wymeditor.$body().find("img")[0];
            wymeditor._selectSingleNode(img);
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.toggleClass("fancy", "img");
        },
        testUndoRedo: true,
        manipulationClickSelector: ".wym_classes_fancy a",
        expectedResultHtml: [""
            , "<p>"
                , "Foo"
                , "<img alt=\"foo\" class=\"fancy\" src=\"" + IMG_SRC + "\" />"
            , "</p>"
        ].join(""),
        skipFunc: function () {
            return inPhantomjs ? SKIP_THIS_TEST : null;
        }
    });
});
