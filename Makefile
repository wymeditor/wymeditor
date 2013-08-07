testserver:
	@cd src; python -m SimpleHTTPServer &

selenium-firefox:
	@SELENIUM_BROWSER=firefox nosetests wym_selenium/

selenium-chrome:
	@SELENIUM_BROWSER=chrome nosetests wym_selenium/

selenium: selenium-chrome

