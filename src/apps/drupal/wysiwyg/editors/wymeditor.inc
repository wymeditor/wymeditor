<?php
// $Id$


/**
 * Plugin implementation of hook_editor().
 */
function wysiwyg_wymeditor_editor() {
  $editor = array();
  $editor['wymeditor'] = array(
    'title' => 'WYMeditor',
    'vendor url' => 'http://www.wymeditor.org/',
    'download url' => 'http://www.wymeditor.org/download/',
    'library path' => wysiwyg_get_path('wymeditor'),
    'libraries' => array(
      '' => array(
        'title' => 'Minified',
        'files' => array('jquery.wymeditor.min.js'),
      ),
      'src' => array(
        'title' => 'Source',
        'files' => array('jquery.wymeditor.js'),
      ),
      'pack' => array(
        'title' => 'Packed',
        'files' => array('jquery.wymeditor.pack.js'),
      )
    ),
    'version callback' => 'wysiwyg_wymeditor_version',
    'settings callback' => 'wysiwyg_wymeditor_settings',
    'versions' => array(
      '0.5' => array(
        'js files' => array('wymeditor.js')
      ),
    ),
  );
  return $editor;
}

/**
 * Detect editor version.
 *
 * @param $editor
 *   An array containing editor properties as returned from hook_editor().
 *
 * @return
 *   The installed editor version.
 */
function wysiwyg_wymeditor_version($editor) {
  $script = wysiwyg_get_path('wymeditor') . '/jquery.wymeditor.js';
  $script = fopen($script, 'r');
  $max_lines = 200;
  while ($max_lines && $line = fgets($script)) {
    if (strpos($line, 'VERSION             :') !== FALSE) {
      if (preg_match('@VERSION\s*:\s*"([0-9\.]+)@', $line, $version)) {
        fclose($script);
        return $version[1];
      }
    }
    $max_lines--;
  }
  fclose($script);
}

/**
 * Return runtime editor settings for a given wysiwyg profile.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $config
 *   An array containing wysiwyg editor profile settings.
 * @param $theme
 *   The name of a theme/GUI/skin to use.
 *
 * @return
 *   A settings array to be populated in
 *   Drupal.settings.wysiwyg.configs.{editor}
 */
function wysiwyg_wymeditor_settings($editor, $config, $theme) {
  $settings = array(
    'updateSelector' => ".form-submit",
    'skin' => "compact"
  );
  
  // Set language if set in $config
  if (isset($config['language'])) {
    $settings['lang'] = $config['language'];
  }

  // Add editor content stylesheet.
  if (isset($config['css_setting'])) {
    if ($config['css_setting'] == 'theme') {
      $css = path_to_theme() .'/style.css';
      if (file_exists($css)) {
        $settings['stylesheet'] = base_path() . $css;
      }
    }
    else if ($config['css_setting'] == 'self' && isset($config['css_path'])) {
      $settings['stylesheet'] = strtr($config['css_path'], array('%b' => base_path(), '%t' => path_to_theme()));
    }
  }

  return $settings;
}

