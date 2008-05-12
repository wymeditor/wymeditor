SRC_DIR = src
BUILD_DIR = build

JS_FILES = ${SRC_DIR}/wymeditor/jquery.wymeditor.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.explorer.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.mozilla.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.opera.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.safari.js
 
CSS_PARSER = ${SRC_DIR}/wymeditor/wym_css_parser.js
XHTML_PARSER = ${SRC_DIR}/wymeditor/xhtml_parser.js

WE = ${BUILD_DIR}/build/jquery.wymeditor.js
WE_PACK = ${BUILD_DIR}/build/jquery.wymeditor.pack.js
WE_ARCH = ${BUILD_DIR}/build/wymeditor.tar.gz

CP_PACK = ${BUILD_DIR}/build/wym_css_parser.pack.js
XP_PACK = ${BUILD_DIR}/build/xhtml_parser.pack.js

FE = ${BUILD_DIR}/build/fireeditor.xpi

MERGE = cat ${JS_FILES} | perl -pe 's/^\xEF\xBB\xBF//g' > ${WE}
WE_PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${WE} -o ${WE_PACK} -e62 -f
CP_PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${CSS_PARSER} -o ${CP_PACK} -e62 -f
XP_PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${XHTML_PARSER} -o ${XP_PACK} -e62 -f

all: archive

wymeditor:
	@@echo "Building" ${WE}

	@@echo " - Merging files"
	@@${MERGE}

	@@echo ${WE} "Built"
	@@echo

pack: wymeditor
	@@echo "Building" ${WE_PACK}

	@@echo " - Compressing using Packer"
	@@${WE_PACKER}
	
	@@echo ${WE_PACK} "Built"
	@@echo
	
	@@echo "Building" ${CP_PACK}

	@@echo " - Compressing using Packer"
	@@${CP_PACKER}
	
	@@echo ${CP_PACK} "Built"
	@@echo
	
	@@echo "Building" ${XP_PACK}

	@@echo " - Compressing using Packer"
	@@${XP_PACKER}

	@@echo ${XP_PACK} "Built"
	@@echo

archive: pack
	@@echo "Building" ${WE_ARCH}

	@@echo " - Creating archive"
	@@mkdir ${BUILD_DIR}/build/wymeditor/
	@@cp -pR ${SRC_DIR}/wymeditor ${BUILD_DIR}/build/wymeditor/
	@@rm ${BUILD_DIR}/build/wymeditor/wymeditor/*.js
	@@cp ${WE} ${WE_PACK} ${BUILD_DIR}/build/wymeditor/wymeditor/
	@@cp -pR ${SRC_DIR}/*.txt ${SRC_DIR}/README ${BUILD_DIR}/build/wymeditor/
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
