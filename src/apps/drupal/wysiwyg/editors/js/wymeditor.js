// $Id$

/**
 * Drupal WYMeditor integration using Wysiwyg API
 * http://drupal.org/project/wysiwyg
 */

/**
 * Attach this editor to a target element.
 */
Drupal.wysiwyg.editor.attach.wymeditor = function(context, params, settings) {
  // Attach editor.
  $('#' + params.field).wymeditor(settings);
};

/**
 * Detach a single or all editors.
 */
Drupal.wysiwyg.editor.detach.wymeditor = function(context, params) {
  var $field = $('#' + params.field);
  var editor = $field.next().data(WYMeditor.WYM_INDEX);
  if (typeof editor != 'undefined') {
    WYMeditor.INSTANCES[editor].update();
    $field.next().remove();
  }
  $field.show();
};

