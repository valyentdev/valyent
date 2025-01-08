#!/bin/bash

# ==============================================================================
# Build Script with Webhook Notifications
# 
# This script handles the container image build process using buildkit and sends
# build status notifications via webhook. It manages the entire pipeline from
# downloading source files from S3 to pushing the final image to a registry.
#
# Required Environment Variables:
# - ORGANIZATION: Organization name for file structure
# - S3_*: S3 credentials and configuration
# - IMAGE_NAME: Target image name
# - REGISTRY_*: Registry credentials and configuration
# - WEBHOOK_URL (optional): URL for build status notifications
#
# Exit Codes:
# - 0: Success
# - 1: Environment variables missing or build failure
# ==============================================================================

# ------------------------------------------------------------------------------
# Webhook Functions
# ------------------------------------------------------------------------------

# send_webhook: Sends build status and logs to a specified webhook endpoint
# Arguments:
#   $1 - success status (true/false)
#   $2 - build logs (string)
#   $3 - error message (string, optional)
# Returns:
#   0 if webhook was sent successfully or if WEBHOOK_URL is not set
#   Outputs error message to stderr on failure
send_webhook() {
    local success=$1
    local logs=$2
    local error_message=$3

    # Skip if webhook URL is not configured
    if [ -z "$WEBHOOK_URL" ]; then
        return 0
    fi

    # Construct JSON payload with build information
    payload=$(cat <<EOF
{
    "success": $success,
    "error_message": "$error_message"
}
EOF
)

    # Send webhook with 5s timeout, suppress usual output
    curl -s -S -X POST \
         -H "Content-Type: application/json" \
         -d "$payload" \
         --max-time 5 \
          -H "Authorization: Bearer ${API_TOKEN}" \
         "$WEBHOOK_URL" || echo "WARNING: Failed to send webhook" >&2
}

# ------------------------------------------------------------------------------
# Buildkit Setup and Configuration
# ------------------------------------------------------------------------------

# Default configuration for buildkit daemon and client
: ${BUILDCTL=buildctl}                    # buildkit client binary
: ${BUILDCTL_CONNECT_RETRIES_MAX=10}      # max connection attempts
: ${BUILDKITD=buildkitd}                  # buildkit daemon binary
: ${BUILDKITD_FLAGS=}                     # additional daemon flags
: ${ROOTLESSKIT=rootlesskit}             # rootless container toolkit

# Create temporary directory for buildkit daemon files
# Structure:
# - pid: daemon process ID
# - addr: daemon socket address
# - log: daemon logs
tmp=$(mktemp -d /tmp/buildctl-daemonless.XXXXXX)

# Cleanup handler for temporary files and processes
trap "kill \$(cat $tmp/pid) || true; wait \$(cat $tmp/pid) || true; rm -rf $tmp" EXIT

# startBuildkitd: Initializes buildkit daemon with appropriate permissions
# Globals:
#   Uses and modifies $tmp directory
# Returns:
#   None, writes daemon info to files in $tmp
startBuildkitd() {
    addr=
    helper=
    # Configure socket path based on user permissions
    if [ $(id -u) = 0 ]; then
        addr=unix:///run/buildkit/buildkitd.sock
    else
        addr=unix://$XDG_RUNTIME_DIR/buildkit/buildkitd.sock
        helper=$ROOTLESSKIT
    fi
    
    # Start daemon process
    $helper $BUILDKITD $BUILDKITD_FLAGS --addr=$addr >$tmp/log 2>&1 &
    pid=$!
    echo $pid >$tmp/pid
    echo $addr >$tmp/addr
}

# waitForBuildkitd: Ensures buildkit daemon is ready before proceeding
# Globals:
#   Uses $tmp/addr for daemon address
#   Uses BUILDCTL_CONNECT_RETRIES_MAX for retry limit
# Returns:
#   0 if daemon responds, exits script with 1 if daemon fails to respond
waitForBuildkitd() {
    addr=$(cat $tmp/addr)
    try=0
    max=$BUILDCTL_CONNECT_RETRIES_MAX
    
    # Retry connection with exponential backoff
    until $BUILDCTL --addr=$addr debug workers >/dev/null 2>&1; do
        if [ $try -gt $max ]; then
            echo >&2 "ERROR: Could not connect to buildkit daemon at $addr after $max attempts"
            echo >&2 "========== daemon logs =========="
            cat >&2 $tmp/log
            exit 1
        fi
        sleep $(awk "BEGIN{print (100 + $try * 20) * 0.001}")
        try=$(expr $try + 1)
    done
}

# ------------------------------------------------------------------------------
# Main Build Process
# ------------------------------------------------------------------------------

# Create temporary file for capturing build logs
log_file=$(mktemp)
trap "rm -f $log_file" EXIT

# Execute build process while capturing logs
{
    # Initialize buildkit daemon
    startBuildkitd
    waitForBuildkitd

    # Validate required environment variables
    envs=("API_TOKEN" "WEBHOOK_URL" "ORGANIZATION" "S3_ACCESS_KEY_ID" "S3_SECRET_ACCESS_KEY" "S3_ENDPOINT" "S3_BUCKET_NAME" "FILE_NAME" "IMAGE_NAME" "REGISTRY_HOST")
    for env in "${envs[@]}"
    do
        if [ -z "${!env}" ]; then
            echo "ERROR: Required environment variable $env is not set"
            exit 1
        fi
    done

    # Prepare build environment
    mkdir -p /tmp/builder
    cd /tmp/builder

    # Configure AWS credentials for S3 access
    export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID"
    export AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
    export AWS_DEFAULT_REGION="$S3_REGION"

    # Download and extract source files
    echo "Downloading source files..."
    mkdir $ORGANIZATION
    aws s3api get-object \
        --bucket $S3_BUCKET_NAME \
        --key $FILE_NAME \
        --endpoint-url $S3_ENDPOINT \
        $FILE_NAME > /dev/null
    echo "Source files downloaded successfully."

    tar -xvf $FILE_NAME -C . > /dev/null

    # Set build context directory
    if [ -z "$ARCHIVE_DIRECTORY" ]; then
        ARCHIVE_DIRECTORY="."
    fi

    # Configure Docker registry authentication
    mkdir -p ~/.docker
    touch ~/.docker/config.json
    echo "{\"auths\": {\"$REGISTRY_HOST\": {\"auth\":\"$REGISTRY_TOKEN\"}}}" > ~/.docker/config.json

    # Execute container image build and push
    buildctl build \
        --frontend dockerfile.v0 \
        --local context=$ARCHIVE_DIRECTORY \
        --local dockerfile=$ARCHIVE_DIRECTORY \
        --output type=image,name=$REGISTRY_HOST/$IMAGE_NAME:latest,push=true
    
} 2>&1 | tee $log_file

# Capture build exit status (first process in pipe)
exit_code=${PIPESTATUS[0]}

# Process build logs for webhook
# Escape quotes and convert newlines for JSON compatibility
logs=$(cat $log_file | sed 's/"/\\"/g' | tr '\n' ' ')

# Send build status notification
if [ $exit_code -eq 0 ]; then
    send_webhook true "$logs" ""
else
    send_webhook false "$logs" "Build failed with exit code $exit_code"
fi

# Preserve original exit code
exit $exit_code