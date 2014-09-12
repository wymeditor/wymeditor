/* jshint evil: true */
/* exported
    fixScale
*/
"use strict";

var sectionHeight = function () {
    var total    = $(window).height(),
        margin,
        $section = $('section').css('height', 'auto');

    if ($section.outerHeight(true) < total) {
        margin = $section.outerHeight(true) - $section.height();
        $section.height(total - margin - 20);
    } else {
        $section.css('height', 'auto');
    }
};

$(window).resize(sectionHeight);

$(document).ready(function () {
    $("section h1, section h2").each(function () {
        $("nav ul").append("<li class='tag-" + this.nodeName.toLowerCase() +
            "'><a href='#" + $(this).text().toLowerCase().replace(/ /g, '-')
            .replace(/[^\w-]+/g, '') + "'>" + $(this).text() + "</a></li>");
        $(this).attr("id", $(this).text().toLowerCase().replace(/ /g, '-')
            .replace(/[^\w-]+/g, ''));
        $("nav ul li:first-child a").parent().addClass("active");
    });

    $("nav ul li a").on('click', function (event) {
        var a = this,
            href = $(a).attr('href'),
            position = $(href).offset().top - 190;

        $("html, body").animate(
            {scrollTop: position},
            {
                duration: 400
                // The following may hide content on the page because of CSS
                // layout.
                //,
                //complete: function () {
                    //window.location = href;
                //}
            }
        );
        $("nav ul li a").parent().removeClass("active");
        $(this).parent().addClass("active");
        event.preventDefault();
    });

    sectionHeight();

    $('img').load(sectionHeight);
});

var fixScale = function (doc) {
    var addEvent = 'addEventListener',
        type = 'gesturestart',
        qsa = 'querySelectorAll',
        scales = [1, 1],
        meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

    function fix() {
        meta.content = 'width=device-width,minimum-scale=' + scales[0] +
            ',maximum-scale=' + scales[1];
        doc.removeEventListener(type, fix, true);
    }

    if ((meta = meta[meta.length - 1]) && addEvent in doc) {
        fix();
        scales = [0.25, 1.6];
        doc[addEvent](type, fix, true);
    }
};
