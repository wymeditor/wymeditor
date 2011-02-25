/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.embed.js
 *        Experimental embed plugin
 *
 * File Authors:
 *        Jonatan Lundin (jonatan.lundin a-t gmail dotcom)
 *        Roger Hu (roger.hu a-t gmail dotcom) 
 */

(function() {
    function removeItem (item, arr) {
        for(var i = arr.length; i--;) {
            if(arr[i] === item) arr.splice(i,1);
        }
        return arr;
    };
    if (WYMeditor && WYMeditor.XhtmlValidator['_tags']['param']['attributes']) {
        
        WYMeditor.XhtmlValidator['_tags']["embed"] = {
            "attributes":[
                "allowscriptaccess",
                "allowfullscreen",
                "height",
                "src",
                "type",
                "width"
            ]
        };
        
        WYMeditor.XhtmlValidator['_tags']['param']['attributes'] = {
            '0':'name',
            '1':'type',
            'valuetype':/^(data|ref|object)$/,
            '2':'valuetype',
            '3':'value'
        };
        
        var XhtmlSaxListener = WYMeditor.XhtmlSaxListener;
        WYMeditor.XhtmlSaxListener = function () {
            var listener = XhtmlSaxListener.call(this);
            removeItem('param', listener.block_tags);
            listener.inline_tags.push('param');
            listener.inline_tags.push('embed');
            return listener;
        };
        WYMeditor.XhtmlSaxListener.prototype = XhtmlSaxListener.prototype;
    }
})();
