#!/bin/bash

: ${BUILDCTL=buildctl}
: ${BUILDCTL_CONNECT_RETRIES_MAX=10}
: ${BUILDKITD=buildkitd}
: ${BUILDKITD_FLAGS=}
: ${ROOTLESSKIT=rootlesskit}

# $tmp holds the following files:
# * pid
# * addr
# * log
tmp=$(mktemp -d /tmp/buildctl-daemonless.XXXXXX)
trap "kill \$(cat $tmp/pid) || true; wait \$(cat $tmp/pid) || true; rm -rf $tmp" EXIT

startBuildkitd() {
    addr=
    helper=
    if [ $(id -u) = 0 ]; then
        addr=unix:///run/buildkit/buildkitd.sock
    else
        addr=unix://$XDG_RUNTIME_DIR/buildkit/buildkitd.sock
        helper=$ROOTLESSKIT
    fi
    $helper $BUILDKITD $BUILDKITD_FLAGS --addr=$addr >$tmp/log 2>&1 &
    pid=$!
    echo $pid >$tmp/pid
    echo $addr >$tmp/addr
}

# buildkitd supports NOTIFY_SOCKET but as far as we know, there is no easy way
# to wait for NOTIFY_SOCKET activation using busybox-builtin commands...
waitForBuildkitd() {
    addr=$(cat $tmp/addr)
    try=0
    max=$BUILDCTL_CONNECT_RETRIES_MAX
    until $BUILDCTL --addr=$addr debug workers >/dev/null 2>&1; do
        if [ $try -gt $max ]; then
            echo >&2 "could not connect to $addr after $max trials"
            echo >&2 "========== log =========="
            cat >&2 $tmp/log
            exit 1
        fi
        sleep $(awk "BEGIN{print (100 + $try * 20) * 0.001}")
        try=$(expr $try + 1)
    done
}

startBuildkitd
waitForBuildkitd


envs=("S3_ACCESS_KEY_ID" "S3_SECRET_ACCESS_KEY" "S3_ENDPOINT" "S3_BUCKET_NAME" "FILE_NAME" "IMAGE_NAME" "REGISTRY_HOST")

# Loop through each environment variable
for env in "${envs[@]}"
do
  # Check if the environment variable is set
  if [ -z "${!env}" ]
  then
    # If the environment variable is not set, print an error message and exit
    echo "ERROR: $env environment variable is not set"
    exit 1
  fi
done

# Create working directory
mkdir -p /tmp/builder
cd /tmp/builder

# Configure AWS CLI
aws configure set S3_access_key_id $S3_ACCESS_KEY_ID
aws configure set S3_secret_access_key $S3_SECRET_ACCESS_KEY
aws configure set default.region $S3_REGION

# Download tar file from S3 bucket without printing to stdout
echo "Downloading contents..."
aws s3api get-object --bucket $S3_BUCKET_NAME --key $FILE_NAME --endpoint-url $S3_ENDPOINT $FILE_NAME > /dev/null
echo "Downloaded contents."

# Extract tar file contents to working directory
tar -xvf $FILE_NAME -C . > /dev/null

# Get to the directory if ARCHIVE_DIRECTORY exists, otherwise stay in the working directory
if [ -z "$ARCHIVE_DIRECTORY" ]; then
  ARCHIVE_DIRECTORY="."
fi

# Authenticate to Docker registry
mkdir -p ~/.docker
touch ~/.docker/config.json
echo "{\"auths\": {\"$REGISTRY_HOST\": {\"auth\":\"$REGISTRY_TOKEN\"}}}" > ~/.docker/config.json

# Build and push Docker image
buildctl build --frontend dockerfile.v0 --local context=$ARCHIVE_DIRECTORY --local dockerfile=$ARCHIVE_DIRECTORY \
  --output type=image,name=$REGISTRY_HOST/$IMAGE_NAME:latest,push=true
