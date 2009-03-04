Wymeditor.Templates = function () {
    /*
     * Modified version of John Resig's micro-templating script
     * See http://ejohn.org/blog/javascript-micro-templating/ for more
     * information and usage
     *
     * MIT Licensed
     */

    var cache = {};
    var that = {
        templates: {
            'toolbar': '<ul><% for(c in controls){ %><li><%=controls[c]%></li><% } %></ul>'
        },
        render: function renderTemplate(str, data) {
            var fn;
            // Load the template, and be sure to cache the result
            str = that.templates[str];
            fn = cache[str] = cache[str] ||

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}"
                + "return p.join('');");

            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        }
    };
    return that;
}()