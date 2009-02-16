SRC_DIR = src
BUILD_DIR = build

JS_FILES = ${SRC_DIR}/wymeditor/jquery.wymeditor.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.explorer.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.mozilla.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.opera.js\
 ${SRC_DIR}/wymeditor/jquery.wymeditor.safari.js

WE = ${BUILD_DIR}/build/jquery.wymeditor.js
WE_PACK = ${BUILD_DIR}/build/jquery.wymeditor.pack.js
WE_MIN = ${BUILD_DIR}/build/jquery.wymeditor.min.js
WE_ARCH = ${BUILD_DIR}/build/wymeditor.tar.gz

FE = ${BUILD_DIR}/build/fireeditor.xpi

MERGE = cat ${JS_FILES} | perl -pe 's/^\xEF\xBB\xBF//g' > ${WE}
WE_PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${WE} -o ${WE_PACK} -e62 -f
WE_MINIFIER = java -jar ${BUILD_DIR}/minifier/yuicompressor-2.4.2.jar ${WE} > ${WE_MIN}

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
	@@cp ${WE} ${WE_PACK} ${WE_MIN} ${BUILD_DIR}/build/wymeditor/wymeditor/
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
