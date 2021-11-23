#!/bin/bash

# Official cosmos guide on generating ts-proto's: https://github.com/cosmos/cosmjs/blob/79396bfaa49831127ccbbbfdbb1185df14230c63/packages/stargate/CUSTOM_PROTOBUF_CODECS.md
# Sifnode script used to generate golang protos: https://github.com/Sifchain/sifnode/blob/feature/ibc/scripts/protocgen.sh

# Path to proto parent directory
SIFNODE_PROTO_PARENT_DIR="sifnode"
proto_dirs=$(find $SIFNODE_PROTO_PARENT_DIR/proto -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
for dir in $proto_dirs; do
  sudo protoc \
    -I=$SIFNODE_PROTO_PARENT_DIR/proto \
    -I=$SIFNODE_PROTO_PARENT_DIR/third_party/proto gogoproto/gogo.proto \
    --proto_path="$SIFNODE_PROTO_PARENT_DIR" \
    --plugin=../node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out="../src/generated/proto" \
    --ts_proto_opt="esModuleInterop=true,forceLong=long,useOptionals=true" \
  $(find "${dir}" -maxdepth 1 -name '*.proto')
done

echo "Done."
