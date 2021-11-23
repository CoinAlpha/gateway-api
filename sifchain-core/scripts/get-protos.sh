#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

PROTO_DIR="./proto"
ZIP_FILE="$PROTO_DIR/tmp.zip"
REF="refs/heads/feature/ibc"
REF=${REF:-"master"}
SUFFIX=${REF////-}
SUFFIX=${SUFFIX//refs-heads-/sifnode-}
echo "Suffix: "
echo $SUFFIX, $REF

rm -rf -r $PROTO_DIR
mkdir -p $PROTO_DIR

[[ $SUFFIX =~ ^v[0-9]+\.[0-9]+\.[0-9]+(-.+)?$ ]] && SUFFIX=${SUFFIX#v}

# mkdir -p "$PROTO_DIR"

ls $PROTO_DIR

curl "https://codeload.github.com/Sifchain/sifnode/zip/$REF" -o $ZIP_FILE
unzip $ZIP_FILE "*.proto" -d "$PROTO_DIR"
proto_dirs=$(find $PROTO_DIR -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
mv  -v $PROTO_DIR/$SUFFIX/* $PROTO_DIR
rm -rf -r $PROTO_DIR/$SUFFIX 
rm $ZIP_FILE