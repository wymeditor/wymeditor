// $Id$

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.wymeditor = function(context, params, settings) {
  $('#' + params.field).wymeditor(settings);
};

/**
 * Detach a single or all editors.
 */
Drupal.wysiwyg.editor.detach.wymeditor = function(context, params) {
  if (typeof params != 'undefined') {
    var $field = $('#' + params.field);
    var instance = $field.next().data(WYMeditor.WYM_INDEX);
    if (typeof instance != 'undefined') {
      WYMeditor.INSTANCES[instance].update();
      $field.next().remove();
    }
    $field.show();
  }
  else {
    jQuery.each(WYMeditor.INSTANCES, function() {
      this.update();
      $(this._box).prev().show().end()
        .remove();
    });
  }
};

