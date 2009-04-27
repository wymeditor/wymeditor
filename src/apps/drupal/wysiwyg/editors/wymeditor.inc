<?php
// $Id$

/**
 * @file
 * Editor integration functions for WYMeditor.
 */


/**
 * Plugin implementation of hook_editor().
 */
function wysiwyg_wymeditor_editor() {
  $editor = array();
  $editor['wymeditor'] = array(
    'title' => 'WYMeditor',
    'vendor url' => 'http://www.wymeditor.org/',
    'download url' => 'http://www.wymeditor.org/download/',
    'library path' => wysiwyg_get_path('wymeditor/wymeditor'),
    'libraries' => array(
      'pack' => array(
        'title' => 'Packed',
        'files' => array('jquery.wymeditor.pack.js'),
      ),
      'min' => array(
        'title' => 'Minified',
        'files' => array('jquery.wymeditor.min.js'),
      ),
      'src' => array(
        'title' => 'Source',
        'files' => array('jquery.wymeditor.js'),
      ),
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
  $library = $editor['library path'] . '/jquery.wymeditor.js';
  if (!file_exists($library)) {
    return;
  }
  $library = fopen($library, 'r');
  $max_lines = 200;
  while ($max_lines && $line = fgets($library)) {
    if (strpos($line, 'VERSION             :') !== FALSE) {
      if (preg_match('@VERSION\s*:\s*"([0-9\.]+)@', $line, $version)) {
        fclose($library);
        return $version[1];
      }
    }
    $max_lines--;
  }
  fclose($library);
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
    'updateSelector' => '.form-submit',
    'skin' => $theme,
  );

  if (isset($config['language'])) {
    $settings['lang'] = $config['language'];
  }

  // Block formats.
  if (isset($config['block_formats'])) {
    $block_formats = explode(',', $config['block_formats']);
    $containers = array(
      'p' => 'Paragraph',
      'h1' => 'Heading_1',
      'h2' => 'Heading_2',
      'h3' => 'Heading_3',
      'h4' => 'Heading_4',
      'h5' => 'Heading_5',
      'h6' => 'Heading_6',
      'pre' => 'Preformatted',
      'blockquote' => 'Blockquote',
      'th' => 'Table_Header',
    );

    foreach ($block_formats as $block_format) {
      if (isset($containers[$block_format])) {
        $container = array(
          'name' => strtoupper($block_format),
          'title' => $containers[$block_format],
          'css' => 'wym_containers_' . $block_format,
        );
        $containersItems[] = $container;
      }
    }
    $settings['containersItems'] = json_encode($containersItems);
  }

  // CSS classes.
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

/**
 * Determine available editor themes or check/reset a given one.
 *
 * @param $editor
 *   A processed hook_editor() array of editor properties.
 * @param $profile
 *   A wysiwyg editor profile.
 *
 * @return
 *   An array of theme names. The first returned name should be the default
 *   theme name.
 */
function wysiwyg_wymeditor_themes($editor, $profile) {
  return array('default', 'compact', 'minimal', 'silver', 'twopanels');
}

