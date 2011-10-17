SRC_DIR = src
WYM_DIR = ${SRC_DIR}/wymeditor
BUILD_DIR = dist

JS_FILES = ${WYM_DIR}/core.js\
 ${WYM_DIR}/rangy/rangy-core.js\
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

WE = ${BUILD_DIR}/jquery.wymeditor.js
WE_MIN = ${BUILD_DIR}/jquery.wymeditor.min.js
WE_ARCH = wymeditor.tar.gz

WYM_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/$(WYM_VER)/"

MERGE = cat ${JS_FILES} | perl -pe 's/^\xEF\xBB\xBF//g' | ${VER} > ${WE}
WE_MINIFIER = uglifyjs ${WE} > ${WE_MIN}

all: archive

wymeditor:
	@@echo "Building" ${WE}
	@@mkdir -p ${BUILD_DIR}

	@@echo " - Merging files"
	@@${MERGE}

	@@echo ${WE} "Built"
	@@echo

min: wymeditor
	@@echo "Building" ${WE_MIN}

	@@echo " - Compressing using Uglifier"
	@@${WE_MINIFIER}
	
	@@echo ${WE_MIN} "Built"
	@@echo

archive: min
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
