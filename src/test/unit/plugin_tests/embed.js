/* jshint maxlen: 79 */
/* global
    QUnit,
    prepareUnitTestModule,
    test,
    deepEqual
*/
"use strict";

module("EmbedPlugin", {setup: prepareUnitTestModule});

var YOUTUBE_VIDEO_URL = [""
    , 'http://www.youtube.com/'
    , 'v/yJxbMUjLW1E?fs=1&amp;hl=en_US'
].join('');
test("Shouldn't remove object elements", function () {
    QUnit.expect(1);
    var objectEmbed = '' +
        '<object width="480" height="390">' +
            '<param name="movie" value="' + YOUTUBE_VIDEO_URL + '" />' +
            '</param>' +
            '<param name="allowFullScreen" value="true" /></param>' +
            '<param name="allowscriptaccess" value="always" /></param>' +
            '<embed ' +
                'src="' + YOUTUBE_VIDEO_URL + '" ' +
                'type="application/x-shockwave-flash" ' +
                'width="480" ' +
                'height="390" ' +
                'allowscriptaccess="always" ' +
                'allowfullscreen="true" /> ' +
            '</embed>' +
        '</object>',
        expected = '' +
        '<object width="480" height="390">' +
            '<param name="movie" value="' + YOUTUBE_VIDEO_URL + '" />' +
            '<param name="allowFullScreen" value="true" />' +
            '<param name="allowscriptaccess" value="always" />' +
            '<embed ' +
                'src="' + YOUTUBE_VIDEO_URL + '" ' +
                'type="application/x-shockwave-flash" ' +
                'width="480" ' +
                'height="390" ' +
                'allowscriptaccess="always" ' +
                'allowfullscreen="true" /> ' +
        '</object>';
    deepEqual(
        jQuery.trim(jQuery.wymeditors(0).parser.parse(objectEmbed)),
        jQuery.trim(expected));
});

test("Shouldn't remove iframe elements", function () {
    QUnit.expect(1);
    var iframeEmbed = '<iframe width="480" height="390" ' +
            'src="' + YOUTUBE_VIDEO_URL + '" frameborder="0" />' +
            '</iframe>',
        expected = '<iframe width="480" height="390" ' +
            'src="' + YOUTUBE_VIDEO_URL + '" frameborder="0"></iframe>';

    deepEqual(
        jQuery.trim(jQuery.wymeditors(0).parser.parse(iframeEmbed)),
        jQuery.trim(expected));
});
