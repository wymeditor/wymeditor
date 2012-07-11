"""
Tests exercising the behavior of the root containers.
"""
import os

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

BASE_TEST_URL = 'http://localhost:8000/test'
SPECIAL_KEYS = {
    'backspace': u'\uE003',
    'tab': u'\uE004',
    'enter': u'\n',
    'shift': u'\uE008',
    'left': u'\uE012',
    'up': u'\uE013',
    'right': u'\uE014',
    'down': u'\uE015',
    'delete': u'\uE017',
}

def _get_driver():
    browser = os.environ.get('SELENIUM_BROWSER', 'firefox').lower()

    if browser == 'chrome':
        return webdriver.Chrome()
    else:
        return webdriver.Firefox()

def _switch_to_editor_content(d):
    d.switch_to_frame(0)

def _switch_to_editor_controls(d):
    d.switch_to_default_content()

def _get_editor_body(d):
    return d.find_element_by_xpath('//body')

def _get_xhtml(d):
    _switch_to_editor_controls(d)
    html_button = d.find_element_by_class_name('wym_tools_html')
    html_button.find_element_by_tag_name('a').click()

    html_area = d.find_element_by_class_name('wym_html_val')
    return html_area.get_attribute('value')

def test_p_after_p():
    # Ensure that hitting "Enter" after a p successfully creates a following p
    # tag
    d = _get_driver()

    # Open the basic example page
    d.get('%s/basic.html' % BASE_TEST_URL)
    assert d.title == 'WYMeditor'

    # Move the selection to the end of the first paragraph
    _switch_to_editor_content(d)
    body = _get_editor_body(d)
    body.click()  # Put the cursor focus in the body
    chain = ActionChains(d)
    chain.send_keys(Keys.RIGHT * 20)
    chain.perform()

    # Hit return to create a new paragraph
    chain.send_keys(Keys.RETURN)
    chain.send_keys('2')
    chain.perform()

    html = _get_xhtml(d)
    assert html == '<p>This is some text with which to test.</p><p>2</p>'

    d.close()

def test_p_after_h1():
    # Ensure that hitting "Enter" after a h1 successfully creates a following p
    # tag
    d = _get_driver()

    # Open the basic example page
    d.get('%s/basic.html' % BASE_TEST_URL)
    assert d.title == 'WYMeditor'

    # Move the selection to the end of the first paragraph
    _switch_to_editor_content(d)
    body = _get_editor_body(d)
    body.click()  # Put the cursor focus in the body
    chain = ActionChains(d)
    chain.send_keys(Keys.RIGHT * 20)
    chain.perform()

    # Turn the paragraph in to an h1
    _switch_to_editor_controls(d)
    chain = ActionChains(d)
    containers_dropdown = d.find_element_by_class_name('wym_containers')
    chain.move_to_element(containers_dropdown)
    chain.perform()
    containers_dropdown = d.find_element_by_class_name('wym_containers')
    h1_container = containers_dropdown.find_element_by_class_name('wym_containers_h1')
    chain.click(h1_container)
    chain.perform()

    # Hit return to create a new paragraph
    _switch_to_editor_content(d)
    chain = ActionChains(d)
    chain.send_keys(Keys.RETURN)
    chain.send_keys('2')
    chain.perform()

    html = _get_xhtml(d)
    assert html == '<h1>This is some text with which to test.</h1><p>2</p>'

    d.close()

