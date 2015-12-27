/* global
    makeTextSelection,
    prepareUnitTestModule,
    manipulationTestHelper,
    vanishAllWyms,
    test
*/
"use strict";

module("setRootContainer-p, headings and pre", {
    setup: function () {
        prepareUnitTestModule({
            // because the structured headings plugin takes away
            // h1, h2, etc.
            loadDefaultPlugins: false
        });
    },
    // So that the next test module will not use this editor instance. it
    // will have a new one, with the plugins loaded.
    teardown: vanishAllWyms
});

// We test that each tag (as in element) can be changed to each tag.
// This creates an array of such pairs.
var pairs = [];
// what about the div?
['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre']
    .forEach(function (tag, i, tags) {
        tags.forEach(function (otherTag) {
            pairs.push([tag, otherTag]);
        });
    });

pairs.forEach(function (pair) {
    var former = pair[0],
        latter = pair[1];

    test(former + ' to ' + latter, function () {
        manipulationTestHelper({
            startHtml: '<' + former + '>Foo</' + former + '>',
            setCaretInSelector: former,
            manipulationFunc: function (wymeditor) {
                wymeditor.setRootContainer(latter);
            },
            manipulationClickSelector: '.wym_containers_' + latter + ' a',
            expectedResultHtml: '<' + latter + '>Foo</' + latter + '>'
        });
    });
});

module("setRootContainer-td/th toggling", {setup: prepareUnitTestModule});

test("td to th", function () {
    manipulationTestHelper({
        startHtml: ''.concat(
            '<table>',
                '<tbody>',
                    '<tr>',
                        '<td>Foo</td>',
                    '</tr>',
                '</tbody>',
            '</table>'
        ),
        setCaretInSelector: 'td',
        manipulationFunc: function (wymeditor) {
            wymeditor.setRootContainer('th');
        },
        manipulationClickSelector: '.wym_containers_th a',
        expectedResultHtml: ''.concat(
            '<table>',
                '<tbody>',
                    '<tr>',
                        '<th>Foo</th>',
                    '</tr>',
                '</tbody>',
            '</table>'
        )
    });
});

test("th to td", function () {
    manipulationTestHelper({
        startHtml: ''.concat(
            '<table>',
                '<tbody>',
                    '<tr>',
                        '<th>Foo</th>',
                    '</tr>',
                '</tbody>',
            '</table>'
        ),
        setCaretInSelector: 'th',
        manipulationFunc: function (wymeditor) {
            wymeditor.setRootContainer('th');
        },
        manipulationClickSelector: '.wym_containers_th a',
        expectedResultHtml: ''.concat(
            '<table>',
                '<tbody>',
                    '<tr>',
                        '<td>Foo</td>',
                    '</tr>',
                '</tbody>',
            '</table>'
        )
    });
});

module("setRootContainer-blockquote toggling", {setup: prepareUnitTestModule});

test("wrap in blockquote", function () {
    manipulationTestHelper({
        startHtml: '<p id="foo">Foo</p><p>Bar</p>',
        setCaretInSelector: '#foo',
        manipulationFunc: function (wymeditor) {
            wymeditor.setRootContainer('blockquote');
        },
        manipulationClickSelector: '.wym_containers_blockquote a',
        expectedResultHtml: ''.concat(
            '<blockquote>',
                '<p id="foo">Foo</p>',
            '</blockquote>',
            '<p>Bar</p>'
        )
    });
});

test("unwrap blockquote", function () {
    manipulationTestHelper({
        startHtml: '<blockquote><p>Foo</p><p id="bar">Bar</p></blockquote>',
        setCaretInSelector: '#bar',
        manipulationFunc: function (wymeditor) {
            wymeditor.setRootContainer('blockquote');
        },
        manipulationClickSelector: '.wym_containers_blockquote a',
        expectedResultHtml: '<p>Foo</p><p id="bar">Bar</p>'
    });
});

module("setRootContainer-noop", {setup: prepareUnitTestModule});

test("noop when selection across multiple root containers", function () {
    var pFooBarNoChangeHtml = '<p>foo</p><p>bar</p>';
    manipulationTestHelper({
        startHtml: pFooBarNoChangeHtml,
        prepareFunc: function (wymeditor) {
            var $body = wymeditor.$body();
            var pFoo = $body.find('p').first()[0];
            var pBar = $body.find('p').last()[0];
            makeTextSelection(
                wymeditor,
                pFoo,
                pBar,
                0,
                3
            );
        },
        manipulationFunc: function (wymeditor) {
            wymeditor.setRootContainer('h1');
        },
        expectedResultHtml: pFooBarNoChangeHtml
    });
});
