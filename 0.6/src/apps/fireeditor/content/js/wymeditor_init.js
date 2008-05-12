jQuery(function() {

    jQuery('#wymeditor').wymeditor({
    
        iframeHtml:"<div class='wym_iframe wym_section'>"
              + "<iframe id='fireeditor_wym_iframe' "
              + "src='"
              + WYM_IFRAME_BASE_PATH
              + "wymiframe.html' "
              + "onload='window.WYM_INSTANCES["
              + WYM_INDEX + "].initIframe(this)' "
              + "></iframe>"
              + "</div>"
    
    });

});
