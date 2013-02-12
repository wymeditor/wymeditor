SRC_DIR = src
WYM_DIR = ${SRC_DIR}/wymeditor
BUILD_DIR = dist

JS_FILES = ${WYM_DIR}/core.js\
 ${WYM_DIR}/rangy/rangy-core.js\
 ${WYM_DIR}/rangy/rangy-selectionsaverestore.js\
 ${WYM_DIR}/editor/base.js\
 ${WYM_DIR}/editor/ie.js\
 ${WYM_DIR}/editor/firefox.js\
 ${WYM_DIR}/editor/opera.js\
 ${WYM_DIR}/editor/webkit.js\
 ${WYM_DIR}/parser/xml-helper.js\
 ${WYM_DIR}/parser/xhtml-validator.js\
 ${WYM_DIR}/parser/parallel-regex.js\
 ${WYM_DIR}/parser/state-stack.js\
 ${WYM_DIR}/parser/lexer.js\
 ${WYM_DIR}/parser/xhtml-lexer.js\
 ${WYM_DIR}/parser/xhtml-parser.js\
 ${WYM_DIR}/parser/xhtml-sax-listener.js\
 ${WYM_DIR}/parser/css-lexer.js\
 ${WYM_DIR}/parser/css-parser.js

WYM_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/$(WYM_VER)/"

WE = ${BUILD_DIR}/jquery.wymeditor.js
WE_MIN = ${BUILD_DIR}/jquery.wymeditor.min.js
WE_ARCH = wymeditor-${WYM_VER}.tar.gz

MERGE = cat ${JS_FILES} | perl -pe 's/^\xEF\xBB\xBF//g' | ${VER} > ${WE}
WE_MINIFIER_UGLIFYJS = uglifyjs ${WE} -o ${WE_MIN}
WE_MINIFIER_CLOSURE = java -jar compiler.jar --js ${WE} --js_output_file ${WE_MIN}

all: min_uglifyjs archive

${WE}:
	@@echo "Building" ${WE}
	@@mkdir -p ${BUILD_DIR}

	@@echo " - Merging files"
	@@${MERGE}

	@@echo ${WE} "Built"
	@@echo

min_uglifyjs: ${WE}
	@@echo "Building" ${WE_MIN}

	@@echo " - Compressing using UglifyJS"
	@@${WE_MINIFIER_UGLIFYJS}
	
	@@echo ${WE_MIN} "Built"
	@@echo

min_closure: ${WE}
	@@echo "Building" ${WE_MIN}

	@@echo " - Compressing using Google's Closure Compiler"
	@@${WE_MINIFIER_CLOSURE}
	
	@@echo ${WE_MIN} "Built"
	@@echo

archive: ${WE_MIN}
	@@echo "Building" ${WE_ARCH}

	@@echo " - Creating archive"
	@@mkdir -p ${BUILD_DIR}/wymeditor/wymeditor

	@@cp README.md CHANGELOG.md AUTHORS *.txt ${BUILD_DIR}/wymeditor
	@@cp -pR ${SRC_DIR}/examples ${BUILD_DIR}/wymeditor
	@@cp -pR ${SRC_DIR}/jquery ${BUILD_DIR}/wymeditor

	@@cp ${WE} ${WE_MIN} ${BUILD_DIR}/wymeditor/wymeditor
	@@cp -pR ${WYM_DIR}/iframe ${BUILD_DIR}/wymeditor/wymeditor
	@@cp -pR ${WYM_DIR}/lang ${BUILD_DIR}/wymeditor/wymeditor
	@@cp -pR ${WYM_DIR}/plugins ${BUILD_DIR}/wymeditor/wymeditor
	@@cp -pR ${WYM_DIR}/skins ${BUILD_DIR}/wymeditor/wymeditor

	@@cd ${BUILD_DIR} && tar -czf ${WE_ARCH} wymeditor
	
	@@echo ${WE_ARCH} "Built"
	@@echo

clean:
	rm -r ${BUILD_DIR}

test: unittest selenium

testserver:
	@cd src; python -m SimpleHTTPServer &

selenium-firefox:
	@SELENIUM_BROWSER=firefox nosetests wym_selenium/

selenium-chrome:
	@SELENIUM_BROWSER=chrome nosetests wym_selenium/

selenium: selenium-chrome

unittest:
	@@build/phantomjs_test.sh localhost:8000/test/unit
