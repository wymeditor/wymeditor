SRC_DIR = src
BUILD_DIR = build

BASE_FILES = ${SRC_DIR}/wymeditor/lang/en.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.explorer.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.mozilla.js\
	${SRC_DIR}/wymeditor/jquery.wymeditor.opera.js

WE = ${BUILD_DIR}/build/jquery.wymeditor.js
WE_PACK = ${BUILD_DIR}/build/jquery.wymeditor.pack.js

MERGE = cat ${BASE_FILES} > ${WE}

PACKER = perl -I${BUILD_DIR}/packer ${BUILD_DIR}/packer/jsPacker.pl -i ${WE} -o ${WE_PACK} -e0

all: pack

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
