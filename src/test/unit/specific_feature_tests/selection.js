/* global
    manipulationTestHelper,
    test,
    module,
    expectOneMore,
    expectMore,
    deepEqual,
    strictEqual,
    ok,
    prepareUnitTestModule,
    rangy,
    makeTextSelection
*/
"use strict";
module("selection-hasSelection", {setup: prepareUnitTestModule});

test("There is no selection (`editor.deselect()`).", function () {
    manipulationTestHelper({
        startHtml: "<p>foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.setCaretIn(wymeditor.body().childNodes[0]);
            wymeditor.deselect();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            ok(wymeditor.hasSelection() === false);
        }
    });
});

test("There is a selection.", function () {
    manipulationTestHelper({
        startHtml: "<p>foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.setCaretIn(wymeditor.body().childNodes[0]);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            ok(wymeditor.hasSelection() === true);
        }
    });
});

module("selection-collapsed", {setup: prepareUnitTestModule});

var selTest = {};

// HTML for the following test.
selTest.setCollapsedHtml = [""
    , '<p id="0">'
        , '0.0'
        , '<br id="0.1" />'
        , '0.2'
        , '<br id="0.3" />'
        , '<span id="0.4">'
        , '</span>'
    , '</p>'
    , '<p id="1">'
        , '1.0'
        , '<span id="1.1">'
            , '1.1.0'
            , '<br id="1.1.1" />'
            , '1.1.2'
        , '</span>'
        , '1.2'
    , '</p>'
    , '<ul id="2">'
        , '<li id="2.0">'
            , '2.0.0'
            , '<br id="2.0.1" />'
            , '2.0.3'
        , '</li>'
        , '<li id="2.1">'
            , '<br id="2.1.0" />'
            , '2.1.1'
        , '</li>'
        , '<li id="2.2">'
            , '<br id="2.2.0" />'
            , '<ul id="2.2.1">'
                , '<li id="2.2.1.0">'
                , '</li>'
            , '</ul>'
            , '<br id="2.2.2" />'
        , '</li>'
    , '</ul>'
    , '<p id="3">'
    , '</p>'
    , '<blockquote id="4">'
        , '<p id="4.0">'
            , '4.0.1'
        , '</p>'
    , '</blockquote>'
    , '<table id="5">'
        , '<caption id="5.0">'
            , '5.0.0'
        , '</caption>'
        , '<colgroup id="5.1">'
            , '<col id="5.1.0">'
            , '<col id="5.1.1">'
        , '</colgroup>'
        , '<thead id="5.2">'
            , '<tr id="5.2.0">'
                , '<th id="5.2.0.0">'
                    , '5.2.0.0.0'
                , '</th>'
                , '<th id="5.2.0.1">'
                    , '5.2.0.1.0'
                , '</th>'
            , '</tr>'
        , '</thead>'
        , '<tfoot id="5.3">'
            , '<tr id="5.3.0">'
                , '<th id="5.3.0.0">'
                    , '5.3.0.0.0'
                , '</th>'
                , '<th id="5.3.0.1">'
                    , '5.3.0.1.0'
                , '</th>'
            , '</tr>'
        , '</tfoot>'
        , '<tbody id="5.4">'
            , '<tr id="5.4.0">'
                , '<th id="5.4.0.0">'
                    , '5.4.0.0.0'
                , '</th>'
                , '<th id="5.4.0.1">'
                    , '5.4.0.1.0'
                , '</th>'
            , '</tr>'
        , '</tbody>'
    , '</table>'
    , '<p id="6">'
        , '6.0'
        , '<strong id="6.1">'
            , '6.1.0'
        , '</strong>'
        , '6.2'
    , '</p>'
    , '<p id="7">'
        , '7.0'
        , '<strong id="7.1">'
            , '7.1.0'
            , '<br id="7.1.1" />'
            , '7.1.2'
        , '</strong>'
        , '7.2'
        , '<i id="7.3">'
            , '7.3.0'
        , '</i>'
        , '7.4'
        , '<strong id="7.5">'
        , '</strong>'
        , '7.6'
        , '<i id="7.7">'
        , '</i>'
        , '7.8'
        , '<b id="7.9">'
        , '</b>'
        , '7.10'
        , '<b id="7.11">'
            , '7.11.0'
        , '</b>'
        , '7.12'
        , '<span id="7.13">'
            , '7.13.0'
        , '</span>'
        , '<span id="7.14">'
            , '7.14.0'
        , '</span>'
        , '<br id="7.15" />'
        , '<span id="7.16">'
            , '7.16.0'
        , '</span>'
        , '<span id="7.17">'
            , '7.17.0'
        , '</span>'
    , '</p>'
].join('');

// This is a data-driven test for setting and getting collapsed selections.
// Collapsed selections are practically the caret position.
// It sets caret in different possible positions in the DOM structure using
// `.setCaretIn` and gets the container using `.selectedContainer`.
test(
    "DDT for setting collapsed selection using `.setCaretIn` and getting " +
    "it using .selectedContainer", function () {
    var
        wymeditor = jQuery.wymeditors(0),
        $allNodes,
        i,
        curNode,
        assertStrCount,
        assertStrPre;

    wymeditor.rawHtml(selTest.setCollapsedHtml);

    // Save a jQuery of all of the nodes in the WYMeditor's body.
    $allNodes = wymeditor.$body().find('*')
        // excluding the WYMeditor utility elements.
        .not('.wym-editor-only');

    for (i = 0; i < $allNodes.length; i++) {
        curNode = $allNodes[i];

        // Set an assertion count string prefix.
        assertStrCount = 'node ' + (i + 1) + ' of ' +
            $allNodes.length + '; ';

        if (
            wymeditor.canSetCaretIn(curNode)
        ) {
            // Set an assertion string prefix.
            assertStrPre = "select inside element; ";

            wymeditor.setCaretIn(curNode);

            if (
                curNode.childNodes.length > 0 &&

                // Rangy issue #209
                !wymeditor.isInlineNode(curNode)
            ) {
                expectOneMore();

                strictEqual(
                    wymeditor.nodeAfterSel(),
                    curNode.childNodes[0],
                    assertStrCount + assertStrPre +
                        "first child is immediately after selection."
                );
            }
            expectOneMore();

            strictEqual(
                wymeditor.selectedContainer(),
                curNode,
                assertStrCount + assertStrPre + "node contains selection.");
        }

        if (
            wymeditor.canSetCaretBefore(curNode)
        ) {
            // Set an assertion string prefix.
            assertStrPre = "select before node; ";

            wymeditor.setCaretBefore(curNode);

            expectMore(2);

            // Assert: Node is immediately after selection
            strictEqual(
                wymeditor.nodeAfterSel(),
                curNode,
                assertStrCount + assertStrPre +
                    "node is immediately after selection."
            );

            // Assert: Node's parent contains selection.
            strictEqual(
                wymeditor.selectedContainer(),
                curNode.parentNode,
                assertStrCount + assertStrPre +
                    "node's parent contains selection."
            );
        }
    }
});

module("selection-noncollapsed", {setup: prepareUnitTestModule});

test("No selection returns false", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(
                wymeditor.selectedContainer(),
                false
            );
        }
    });
});

test("Within one element returns the element", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(
                wymeditor.selectedContainer().childNodes[0].data,
                "Foo"
            );
        }
    });
});

test("Within one element returns the element; partial selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                1,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(
                wymeditor.selectedContainer().childNodes[0].data,
                "Foo"
            );
        }
    });
});

test("Within a nested element returns the nested element", function () {
    manipulationTestHelper({
        startHtml: "<p><i>Foo</i> bar</p>",
        prepareFunc: function (wymeditor) {
            var i = wymeditor.body().childNodes[0].childNodes[0];
            makeTextSelection(
                wymeditor,
                i,
                i,
                0,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(
                wymeditor.selectedContainer().childNodes[0].data,
                "Foo"
            );
        }
    });
});

test(
    "Within a nested element returns the nested element; partial selection",
    function () {
        manipulationTestHelper({
            startHtml: "<p><i>Foo</i> bar</p>",
            prepareFunc: function (wymeditor) {
                var i = wymeditor.body().childNodes[0].childNodes[0];
                makeTextSelection(
                    wymeditor,
                    i,
                    i,
                    1,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().childNodes[0].data,
                    "Foo"
                );
            }
        });
    }
);

test(
    "Within an element, partially in its child element returns the element",
    function () {
        manipulationTestHelper({
            startHtml: "<ul><li><i>Foo</i> bar</li></ul>",
            prepareFunc: function (wymeditor) {
                var li = wymeditor.body().childNodes[0].childNodes[0],
                    i = li.childNodes[0];
                makeTextSelection(
                    wymeditor,
                    i,
                    li,
                    0,
                    2
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "li"
                );
            }
        });
    }
);

test(
    "Within an element, partially in its child element returns the element" +
        "; partial selection",
    function () {
        manipulationTestHelper({
            startHtml: "<p><i>Foo</i> bar</p>",
            prepareFunc: function (wymeditor) {
                var p = wymeditor.body().childNodes[0],
                    i = p.childNodes[0];
                makeTextSelection(
                    wymeditor,
                    i,
                    p,
                    1,
                    2
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "p"
                );
            }
        });
    }
);

test("From one root container to another returns false", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                firstP = body.childNodes[0],
                secondP = body.childNodes[1];
            makeTextSelection(
                wymeditor,
                firstP,
                secondP,
                0,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(wymeditor.selectedContainer(), false);
        }
    });
});

test("Across root containers returns false; partial selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                firstP = body.childNodes[0],
                secondP = body.childNodes[1];
            makeTextSelection(
                wymeditor,
                firstP,
                secondP,
                1,
                2
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            strictEqual(wymeditor.selectedContainer(), false);
        }
    });
});

test(
    "In a root container, from one inline element to another, across text " +
        "between them, returns false",
    function () {
        manipulationTestHelper({
            startHtml: "<p><i>Foo</i> and <i>Bar</i></p>",
            prepareFunc: function (wymeditor) {
                var p = wymeditor.body().childNodes[0],
                    firstI = p.childNodes[0],
                    secondI = p.childNodes[2];
                makeTextSelection(
                    wymeditor,
                    firstI,
                    secondI,
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(wymeditor.selectedContainer(), false);
            }
        });
    }
);

test(
    "In a root container, from one inline element to the next " +
        "returns false",
    function () {
        manipulationTestHelper({
            startHtml: "<p><i>Foo</i><sup>Bar</sup></p>",
            prepareFunc: function (wymeditor) {
                var p = wymeditor.body().childNodes[0],
                    i = p.childNodes[0],
                    superscript = p.childNodes[1];
                makeTextSelection(
                    wymeditor,
                    i,
                    superscript,
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(wymeditor.selectedContainer(), false);
            }
        });
    }
);

test(
    "Inside ``li`` returns that ``li``",
    function () {
        manipulationTestHelper({
            startHtml: "<ol><li>Foo</li></ol>",
            prepareFunc: function (wymeditor) {
                var li = wymeditor.body().childNodes[0].childNodes[0];
                makeTextSelection(
                    wymeditor,
                    li,
                    li,
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "li"
                );
            }
        });
    }
);

test(
    "From ``li`` to descendant table cell returns the ``li``",
    function () {
        manipulationTestHelper({
            startHtml: [""
                , "<ol><li>"
                    , "Foo and the following:"
                    , "<table><tbody><tr><td>Bar</td></tr></tbody></table>"
                , "</li></ol>"
            ].join(""),
            prepareFunc: function (wymeditor) {
                var $li = wymeditor.$body().find("li"),
                    $td = $li.find("td");
                makeTextSelection(
                    wymeditor,
                    $li[0],
                    $td[0],
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "li"
                );
            }
        });
    }
);

test(
    "From ``li`` to descendant ``li`` returns the ancestor ``li``",
    function () {
        manipulationTestHelper({
            startHtml: [""
                , "<ol><li>"
                    , "Foo and the following:"
                    , "<ol><li>Bar</li></ol>"
                , "</li></ol>"
            ].join(""),
            prepareFunc: function (wymeditor) {
                var li = wymeditor.body().childNodes[0].childNodes[0],
                    nestedLi = li.childNodes[1].childNodes[0];
                makeTextSelection(
                    wymeditor,
                    li,
                    nestedLi,
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectMore(2);
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "li"
                );
                strictEqual(
                    wymeditor.selectedContainer().childNodes[1].childNodes[0]
                        .tagName.toLowerCase(),
                    "li"
                );
            }
        });
    }
);

test(
    "Inside ``td`` that is within a list returns that ``td``",
    function () {
        manipulationTestHelper({
            startHtml: [""
                , "<ol><li>"
                    , "<table><tbody><tr><td>Bar</td></tr></tbody></table>"
                , "</li></ol>"
            ].join(""),
            prepareFunc: function (wymeditor) {
                var td = wymeditor.$body().find("td")[0];
                makeTextSelection(
                    wymeditor,
                    td,
                    td,
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "td"
                );
            }
        });
    }
);

test(
    "Inside ``td``returns that ``td``",
    function () {
        manipulationTestHelper({
            startHtml: "<table><tbody><tr><td>Bar</td></tr></tbody></table>",
            prepareFunc: function (wymeditor) {
                var td = wymeditor.$body().find("td")[0];
                makeTextSelection(
                    wymeditor,
                    td,
                    td,
                    0,
                    3
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "td"
                );
            }
        });
    }
);

test(
    "Within an element, partially in its child element; twice nested;" +
    "returns the element",
    function () {
        manipulationTestHelper({
            startHtml: "<p><i><sup>Foo</sup></i> bar</p>",
            prepareFunc: function (wymeditor) {
                var p = wymeditor.body().childNodes[0],
                    sup = p.childNodes[0].childNodes[0];
                makeTextSelection(
                    wymeditor,
                    sup,
                    p,
                    1,
                    2
                );
            },
            additionalAssertionsFunc: function (wymeditor) {
                expectOneMore();
                strictEqual(
                    wymeditor.selectedContainer().tagName.toLowerCase(),
                    "p"
                );
            }
        });
    }
);

module("selection-_getSelectedNodes", {setup: prepareUnitTestModule});
// `_getSelectedNodes` should be tested much more comprehensively than these 6
// texts.
// See https://github.com/wymeditor/wymeditor/issues/618.

test("No selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            ok(wymeditor._getSelectedNodes() === false);
        }
    });
});

test("Collapsed selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.setCaretIn(wymeditor.body().childNodes[0]);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            deepEqual(
                wymeditor._getSelectedNodes(),
                []
            );
        }
    });
});

test("Single text node", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var range = rangy.createRange(wymeditor._doc),
                foo = wymeditor.body().childNodes[0].childNodes[0];

            range.selectNode(foo);
            wymeditor.selection().setSingleRange(range);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            deepEqual(
                wymeditor.selection().getRangeAt(0).getNodes(),
                [wymeditor.body().childNodes[0].childNodes[0]]
            );
        }
    });
});

test("Partially selected text node", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var range = rangy.createRange(wymeditor._doc),
                foo = wymeditor.body().childNodes[0].childNodes[0];

            range.setStart(foo, 0);
            range.setEnd(foo, 1);
            wymeditor.selection().setSingleRange(range);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectOneMore();
            deepEqual(
                wymeditor.selection().getRangeAt(0).getNodes(),
                [wymeditor.body().childNodes[0].childNodes[0]]
            );
        }
    });
});

test("Two wholly selected text nodes", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                range = rangy.createRange(wymeditor._doc),
                foo = body.childNodes[0].childNodes[0],
                bar = body.childNodes[1].childNodes[0];

            range.setStart(foo, 0);
            range.setEnd(bar, 3);
            wymeditor.selection().setSingleRange(range);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectMore(5);
            var selectedNodes = wymeditor._getSelectedNodes();
            strictEqual(
                selectedNodes.length,
                4
            );
            strictEqual(
                selectedNodes[0].tagName.toLowerCase(),
                "p"
            );
            strictEqual(
                selectedNodes[1].data,
                "Foo"
            );
            strictEqual(
                selectedNodes[2].tagName.toLowerCase(),
                "p"
            );
            strictEqual(
                selectedNodes[3].data,
                "Bar"
            );
        }
    });
});

test("Two partially selected text nodes", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var body = wymeditor.body(),
                range = rangy.createRange(wymeditor._doc);

            range.setStart(body.childNodes[0].childNodes[0], 1);
            range.setEnd(body.childNodes[1].childNodes[0], 1);
            wymeditor.selection().setSingleRange(range);
        },
        additionalAssertionsFunc: function (wymeditor) {
            expectMore(5);
            var selectedNodes = wymeditor._getSelectedNodes();
            strictEqual(
                selectedNodes.length,
                4
            );
            strictEqual(
                selectedNodes[0].tagName.toLowerCase(),
                "p"
            );
            strictEqual(
                selectedNodes[1].data,
                "Foo"
            );
            strictEqual(
                selectedNodes[2].tagName.toLowerCase(),
                "p"
            );
            strictEqual(
                selectedNodes[3].data,
                "Bar"
            );
        }
    });
});

module(
    "selection-doesElementContainSelection",
    {setup: prepareUnitTestModule}
);

test("Returns false when no selection", function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            wymeditor.deselect();
        },
        additionalAssertionsFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(p),
                false
            );
        }
    });
});

test("Returns true when non-collapsed selection is wholly in element",
     function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        prepareFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            makeTextSelection(
                wymeditor,
                p,
                p,
                0,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(p),
                true
            );
        }
    });
});

test("Returns true when non-collapsed selection is wholly in element" +
     ", nested twice", function () {
    manipulationTestHelper({
        startHtml: "<ol><li><ul><li>Foo</li></ul></li></ol>",
        prepareFunc: function (wymeditor) {
            var nestedLi = wymeditor.$body().find("ul > li");
            makeTextSelection(
                wymeditor,
                nestedLi,
                nestedLi,
                1,
                2
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            var ol = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(ol),
                true
            );
        }
    });
});

test("Returns true when non-collapsed selection is partly in element",
     function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var firstP = wymeditor.body().childNodes[0],
                secondP = firstP.nextSibling;
            makeTextSelection(
                wymeditor,
                firstP,
                secondP,
                0,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            var firstP = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(firstP),
                true
            );
        }
    });
});

test("Returns false when non-collapsed selection is not in element",
     function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        prepareFunc: function (wymeditor) {
            var secondP = wymeditor.body().childNodes[1];
            makeTextSelection(
                wymeditor,
                secondP,
                secondP,
                0,
                3
            );
        },
        additionalAssertionsFunc: function (wymeditor) {
            var firstP = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(firstP),
                false
            );
        }
    });
});

test("Returns true when collapsed selection is in element",
     function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p>",
        setCaretInSelector: "p",
        additionalAssertionsFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(p),
                true
            );
        }
    });
});

test("Returns false when collapsed selection is not in element",
     function () {
    manipulationTestHelper({
        startHtml: "<p>Foo</p><p>Bar</p>",
        setCaretInSelector: "p:nth-child(2)",
        additionalAssertionsFunc: function (wymeditor) {
            var firstP = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(firstP),
                false
            );
        }
    });
});

test("Returns true when collapsed selection is nested in element",
     function () {
    manipulationTestHelper({
        startHtml: "<ul><li>Foo</li></ul>",
        setCaretInSelector: "li",
        additionalAssertionsFunc: function (wymeditor) {
            var p = wymeditor.body().childNodes[0];
            expectOneMore();
            strictEqual(
                wymeditor.doesElementContainSelection(p),
                true
            );
        }
    });
});
