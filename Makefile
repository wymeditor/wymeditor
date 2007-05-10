SRC_DIR = src
BUILD_DIR = build

JS_FILES = ${SRC_DIR}/wymeditor/lang/en.js\
 ${SRC_DIR}/wymeditor/lang/fr.js\
 ${SRC_DIR}/wymeditor/lang/es.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.explorer.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.mozilla.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.opera.js

WE = ${BUILD_DIR}/build/jquery.wymeditor.js
WE_PACK = ${BUILD_DIR}/build/jquery.wymeditor.pack.js
WE_ARCH = ${BUILD_DIR}/build/wymeditor.tar.gz

MERGE = cat ${JS_FILES} > ${WE}
PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${WE} -o ${WE_PACK} -e0

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
	@@${PACKER}

	@@echo ${WE_PACK} "Built"
	@@echo

archive: pack
	@@echo "Building" ${WE_ARCH}

	@@echo " - Creating archive"
	@@cp -a ${SRC_DIR}/wymeditor ${BUILD_DIR}/build/
	@@rm ${BUILD_DIR}/build/wymeditor/*.js
	@@cp ${BUILD_DIR}/build/jquery.wymeditor.js ${BUILD_DIR}/build/wymeditor/
	@@cp ${BUILD_DIR}/build/jquery.wymeditor.pack.js ${BUILD_DIR}/build/wymeditor/
	@@cp -a ${SRC_DIR}/*.txt ${SRC_DIR}/README ${BUILD_DIR}/build/wymeditor/
	@@tar -C ${BUILD_DIR}/build -czf ${WE_ARCH} --exclude '.svn' wymeditor
	@@rm -rf ${BUILD_DIR}/build/wymeditor/
