#!/bin/bash

# Docker Hub Integration Script
# Automates Docker Hub operations for the portfolio ecosystem

set -e

# Configuration
DOCKER_HUB_USER="${DOCKER_HUB_USER}"
DOCKER_HUB_TOKEN="${DOCKER_HUB_TOKEN}"
REPO_NAME="${DOCKER_HUB_REPO_PORTFOLIO:-shamiur-portfolio}"
BACKUP_REPO_NAME="${DOCKER_HUB_REPO_BACKUP:-shamiur-portfolio-backup}"
GIT_MANAGER_REPO_NAME="${DOCKER_HUB_REPO_GIT_MANAGER:-shamiur-git-manager}"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] DOCKER-HUB-INTEGRATION: $*" | tee -a "/app/logs/docker-hub-integration.log"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Authentication check
check_auth() {
    if [ -z "$DOCKER_HUB_USER" ] || [ -z "$DOCKER_HUB_TOKEN" ]; then
        error_exit "Docker Hub credentials not configured"
    fi
}

# Login to Docker Hub
docker_login() {
    log "Authenticating with Docker Hub..."
    echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin
    log "Docker Hub authentication successful"
}

# Build and push portfolio image
push_portfolio_image() {
    local tag="${1:-latest}"
    local image_name="$DOCKER_HUB_USER/$REPO_NAME:$tag"

    log "Building and pushing portfolio image: $image_name"

    # Build the image
    docker build -t "$image_name" .

    # Push to Docker Hub
    docker push "$image_name"

    log "Portfolio image pushed successfully: $image_name"
}

# Build and push Git manager image
push_git_manager_image() {
    local tag="${1:-latest}"
    local image_name="$DOCKER_HUB_USER/$GIT_MANAGER_REPO_NAME:$tag"

    log "Building and pushing Git manager image: $image_name"

    # Build the image
    docker build -f Dockerfile.git -t "$image_name" .

    # Push to Docker Hub
    docker push "$image_name"

    log "Git manager image pushed successfully: $image_name"
}

# Build and push backup service image
push_backup_service_image() {
    local tag="${1:-latest}"
    local image_name="$DOCKER_HUB_USER/$BACKUP_REPO_NAME:$tag"

    log "Building and pushing backup service image: $image_name"

    # Build the image
    docker build -f Dockerfile.backup -t "$image_name" .

    # Push to Docker Hub
    docker push "$image_name"

    log "Backup service image pushed successfully: $image_name"
}

# Push all images
push_all_images() {
    local tag="${1:-latest}"

    log "Pushing all images with tag: $tag"

    check_auth
    docker_login

    push_portfolio_image "$tag"
    push_git_manager_image "$tag"
    push_backup_service_image "$tag"

    log "All images pushed successfully"
}

# Create timestamped backup image
create_backup_image() {
    local backup_name="backup-$(date +'%Y%m%d-%H%M%S')"
    local image_name="$DOCKER_HUB_USER/$BACKUP_REPO_NAME:$backup_name"

    log "Creating backup image: $image_name"

    check_auth
    docker_login

    # Create a temporary Dockerfile for backup
    cat > /tmp/Dockerfile.backup << EOF
FROM alpine:latest
COPY backups/ /backup/
RUN echo "Backup created on $(date)" > /backup/README.txt
VOLUME /backup
CMD ["echo", "Backup image: $backup_name"]
EOF

    # Build and push backup image
    docker build -f /tmp/Dockerfile.backup -t "$image_name" .
    docker push "$image_name"

    # Cleanup
    rm -f /tmp/Dockerfile.backup

    log "Backup image created and pushed: $image_name"
}

# List repository images
list_images() {
    local repo="${1:-$REPO_NAME}"

    log "Listing images for repository: $repo"

    check_auth

    # Use Docker Hub API to list tags
    curl -s -H "Authorization: Bearer $DOCKER_HUB_TOKEN" \
         "https://hub.docker.com/v2/repositories/$DOCKER_HUB_USER/$repo/tags/" | \
    jq -r '.results[]?.name' 2>/dev/null || \
    log "Failed to list images (may not exist or API access limited)"
}

# Clean old images
cleanup_old_images() {
    local repo="${1:-$REPO_NAME}"
    local keep_count="${2:-10}"

    log "Cleaning up old images for $repo (keeping $keep_count)"

    check_auth

    # Get list of tags sorted by creation date
    local tags=$(curl -s -H "Authorization: Bearer $DOCKER_HUB_TOKEN" \
                  "https://hub.docker.com/v2/repositories/$DOCKER_HUB_USER/$repo/tags/?page_size=100" | \
                 jq -r '.results[]? | select(.name != "latest") | .name' 2>/dev/null | \
                 head -n -"$keep_count")

    if [ -n "$tags" ]; then
        log "Images to delete: $tags"

        # Note: Docker Hub API deletion requires specific permissions
        # This is a simplified version - actual deletion would need API calls
        for tag in $tags; do
            log "Would delete: $DOCKER_HUB_USER/$repo:$tag (API deletion not implemented)"
        done

        log "Note: Manual cleanup required via Docker Hub web interface"
    else
        log "No old images to clean up"
    fi
}

# Get repository statistics
get_repo_stats() {
    local repo="${1:-$REPO_NAME}"

    log "Getting statistics for repository: $repo"

    check_auth

    curl -s -H "Authorization: Bearer $DOCKER_HUB_TOKEN" \
         "https://hub.docker.com/v2/repositories/$DOCKER_HUB_USER/$repo/" | \
    jq '.name, .pull_count, .star_count, .last_updated' 2>/dev/null || \
    log "Failed to get repository statistics"
}

# Automated nightly push
nightly_push() {
    log "Starting nightly Docker Hub push"

    check_auth
    docker_login

    # Push with timestamp tag
    local timestamp=$(date +'%Y%m%d')
    push_all_images "$timestamp"

    # Also update latest
    push_all_images "latest"

    # Create backup image
    create_backup_image

    # Cleanup old images
    cleanup_old_images "$REPO_NAME"
    cleanup_old_images "$GIT_MANAGER_REPO_NAME"
    cleanup_old_images "$BACKUP_REPO_NAME"

    log "Nightly push completed"
}

# Setup automated pushes
setup_automation() {
    log "Setting up automated Docker Hub pushes"

    # Create cron job for nightly pushes
    local cron_job="0 2 * * * /app/scripts/docker-hub-integration.sh nightly-push"

    # Add to crontab (if cron is available)
    if command -v crontab &> /dev/null; then
        (crontab -l 2>/dev/null; echo "$cron_job") | crontab -
        log "Automated nightly pushes scheduled at 2 AM"
    else
        log "Cron not available, manual scheduling required"
    fi
}

# Main command handler
main() {
    case "${1:-}" in
        "login")
            check_auth && docker_login || exit 1
            ;;
        "push-portfolio")
            check_auth && docker_login && push_portfolio_image "$2" || exit 1
            ;;
        "push-git-manager")
            check_auth && docker_login && push_git_manager_image "$2" || exit 1
            ;;
        "push-backup")
            check_auth && docker_login && push_backup_service_image "$2" || exit 1
            ;;
        "push-all")
            push_all_images "$2" || exit 1
            ;;
        "backup")
            create_backup_image || exit 1
            ;;
        "list")
            list_images "$2" || exit 1
            ;;
        "cleanup")
            cleanup_old_images "$2" "$3" || exit 1
            ;;
        "stats")
            get_repo_stats "$2" || exit 1
            ;;
        "nightly-push")
            nightly_push || exit 1
            ;;
        "setup-automation")
            setup_automation || exit 1
            ;;
        *)
            echo "Docker Hub Integration Script"
            echo
            echo "Usage: $0 <command> [options]"
            echo
            echo "Commands:"
            echo "  login                           - Login to Docker Hub"
            echo "  push-portfolio [tag]            - Push portfolio image"
            echo "  push-git-manager [tag]          - Push Git manager image"
            echo "  push-backup [tag]               - Push backup service image"
            echo "  push-all [tag]                  - Push all images"
            echo "  backup                          - Create backup image"
            echo "  list [repo]                     - List repository images"
            echo "  cleanup [repo] [keep_count]     - Clean old images"
            echo "  stats [repo]                    - Get repository statistics"
            echo "  nightly-push                    - Automated nightly push"
            echo "  setup-automation                - Setup automated pushes"
            exit 1
            ;;
    esac
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi