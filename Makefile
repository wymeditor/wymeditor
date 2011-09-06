SRC_DIR = src
BUILD_DIR = build

JS_FILES = ${SRC_DIR}/wymeditor/core.js\
 ${SRC_DIR}/wymeditor/editor/base.js\
 ${SRC_DIR}/wymeditor/editor/ie.js\
 ${SRC_DIR}/wymeditor/editor/firefox.js\
 ${SRC_DIR}/wymeditor/editor/opera.js\
 ${SRC_DIR}/wymeditor/editor/webkit.js\
 ${SRC_DIR}/wymeditor/parser/xml-helper.js\
 ${SRC_DIR}/wymeditor/parser/xhtml-validator.js\
 ${SRC_DIR}/wymeditor/parser/parallel-regex.js\
 ${SRC_DIR}/wymeditor/parser/state-stack.js\
 ${SRC_DIR}/wymeditor/parser/lexer.js\
 ${SRC_DIR}/wymeditor/parser/xhtml-lexer.js\
 ${SRC_DIR}/wymeditor/parser/xhtml-parser.js\
 ${SRC_DIR}/wymeditor/parser/xhtml-sax-listener.js\
 ${SRC_DIR}/wymeditor/parser/css-lexer.js\
 ${SRC_DIR}/wymeditor/parser/css-parser.js

WE = ${BUILD_DIR}/build/jquery.wymeditor.js
WE_PACK = ${BUILD_DIR}/build/jquery.wymeditor.pack.js
WE_MIN = ${BUILD_DIR}/build/jquery.wymeditor.min.js
WE_ARCH = ${BUILD_DIR}/build/wymeditor.tar.gz

FE = ${BUILD_DIR}/build/fireeditor.xpi

WYM_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/$(WYM_VER)/"

MERGE = cat ${JS_FILES} | perl -pe 's/^\xEF\xBB\xBF//g' | ${VER} > ${WE}
WE_PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${WE} -o ${WE_PACK} -e62 -f
WE_MINIFIER = java -jar ${BUILD_DIR}/minifier/yuicompressor-2.4.2.jar ${WE} > ${WE_MIN}

all: archive

wymeditor:
	@@echo "Building" ${WE}

	@@echo " - Merging files"
	@@mkdir -p ${BUILD_DIR}/build
	@@${MERGE}

	@@echo ${WE} "Built"
	@@echo

pack: wymeditor
	@@echo "Building" ${WE_PACK}

	@@echo " - Compressing using Packer"
	@@${WE_PACKER}
	
	@@echo ${WE_PACK} "Built"
	@@echo

min: wymeditor
	@@echo "Building" ${WE_MIN}

	@@echo " - Compressing using Minifier"
	@@${WE_MINIFIER}
	
	@@echo ${WE_MIN} "Built"
	@@echo

archive: pack min
	@@echo "Building" ${WE_ARCH}

	@@echo " - Creating archive"
	@@mkdir ${BUILD_DIR}/build/wymeditor/
	@@cp -pR ${SRC_DIR}/wymeditor ${BUILD_DIR}/build/wymeditor/
	@@rm ${BUILD_DIR}/build/wymeditor/wymeditor/*.js
	@@rm -r ${BUILD_DIR}/build/wymeditor/wymeditor/editor/
	@@rm -r ${BUILD_DIR}/build/wymeditor/wymeditor/parser/
	@@cp ${WE} ${WE_PACK} ${WE_MIN} ${BUILD_DIR}/build/wymeditor/wymeditor/
	@@cp -pR ./README.md ${BUILD_DIR}/build/wymeditor/
	@@cp -pR ./CHANGELOG.rst ${BUILD_DIR}/build/wymeditor/
	@@cp -pR ${SRC_DIR}/examples ${BUILD_DIR}/build/wymeditor/
	@@cp -pR ${SRC_DIR}/jquery ${BUILD_DIR}/build/wymeditor/
	@@tar -C ${BUILD_DIR}/build -czf ${WE_ARCH} --exclude '.svn' wymeditor
	@@rm -rf ${BUILD_DIR}/build/wymeditor/
	@@rm -rf ${BUILD_DIR}/build/examples/
	@@rm -rf ${BUILD_DIR}/build/jquery/
	
	@@echo ${WE_ARCH} "Built"
	@@echo

fireeditor: archive
	@@echo "Building " ${FE}
	
	@@cp ${WE_ARCH} ${SRC_DIR}/apps/fireeditor/content/
	@@tar -C ${SRC_DIR}/apps/fireeditor/content -xzf ${SRC_DIR}/apps/fireeditor/content/wymeditor.tar.gz
	@@rm ${SRC_DIR}/apps/fireeditor/content/wymeditor.tar.gz
	@@cd ${SRC_DIR}/apps/fireeditor/; zip -r -q ../../../${FE} *
	@@rm -rf ${SRC_DIR}/apps/fireeditor/content/wymeditor/
	@@echo "Fire Editor built"
	@@echo
