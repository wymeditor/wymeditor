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
    var index = $field.data(WYMeditor.WYM_INDEX);
    if (typeof index != 'undefined') {
      var editor = WYMeditor.INSTANCES[index];
      editor.update();
      $(editor._box).remove();
      delete editor;
    }
    $field.show();
  }
  else {
    jQuery.each(WYMeditor.INSTANCES, function() {
      this.update();
      $(this._box).remove();
      $(this._element).show();
      delete this;
    });
  }
};

