#!/bin/bash

# Docker Hub Utilities - Helper functions for Docker Hub operations

set -e

# Configuration
DOCKER_HUB_USER="${DOCKER_HUB_USER}"
DOCKER_HUB_TOKEN="${DOCKER_HUB_TOKEN}"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] DOCKER-HUB: $*" | tee -a "/app/logs/docker-hub.log"
}

# Login to Docker Hub
docker_login() {
    if [ -n "$DOCKER_HUB_USER" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
        log "Logging into Docker Hub as $DOCKER_HUB_USER"
        echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin
        log "Docker Hub login successful"
    else
        log "ERROR: Docker Hub credentials not configured"
        return 1
    fi
}

# Build and push image
build_and_push() {
    local image_name="$1"
    local dockerfile_path="${2:-.}"
    local tag="${3:-latest}"

    if [ -z "$image_name" ]; then
        log "ERROR: Image name is required"
        return 1
    fi

    local full_image_name="$DOCKER_HUB_USER/$image_name:$tag"

    log "Building and pushing image: $full_image_name"

    # Login first
    docker_login || return 1

    # Build image
    log "Building Docker image..."
    docker build -t "$full_image_name" "$dockerfile_path"

    # Push image
    log "Pushing image to Docker Hub..."
    docker push "$full_image_name"

    log "Image pushed successfully: $full_image_name"
}

# List user's repositories
list_repositories() {
    if [ -n "$DOCKER_HUB_USER" ]; then
        log "Listing repositories for user: $DOCKER_HUB_USER"

        # Use Docker Hub API to list repositories
        curl -s -H "Authorization: Bearer $DOCKER_HUB_TOKEN" \
             "https://hub.docker.com/v2/repositories/$DOCKER_HUB_USER/" | \
        jq -r '.results[]?.name' 2>/dev/null || \
        log "Failed to list repositories (API access may be limited)"
    else
        log "ERROR: Docker Hub user not configured"
        return 1
    fi
}

# Delete old images
cleanup_images() {
    local repository="$1"
    local keep_count="${2:-10}"

    if [ -z "$repository" ]; then
        log "ERROR: Repository name is required"
        return 1
    fi

    log "Cleaning up old images for repository: $repository (keeping $keep_count)"

    # This is a simplified version - in practice, you'd use Docker Hub API
    # to list and delete old tags
    log "Note: Full cleanup requires Docker Hub API integration"

    # Basic local cleanup
    docker images "$DOCKER_HUB_USER/$repository" --format "table {{.Repository}}:{{.Tag}}\t{{.ID}}" | \
    tail -n +2 | head -n -"$keep_count" | while read -r line; do
        local image_id=$(echo "$line" | awk '{print $2}')
        if [ -n "$image_id" ]; then
            log "Removing local image: $image_id"
            docker rmi "$image_id" 2>/dev/null || true
        fi
    done
}

# Create repository on Docker Hub (requires API token with appropriate permissions)
create_repository() {
    local repo_name="$1"
    local description="${2:-Docker repository created by Git Manager}"
    local is_private="${3:-false}"

    if [ -z "$repo_name" ]; then
        log "ERROR: Repository name is required"
        return 1
    fi

    log "Creating repository: $repo_name"

    # Use Docker Hub API to create repository
    curl -X POST \
         -H "Authorization: Bearer $DOCKER_HUB_TOKEN" \
         -H "Content-Type: application/json" \
         -d "{\"name\":\"$repo_name\",\"description\":\"$description\",\"is_private\":$is_private}" \
         "https://hub.docker.com/v2/repositories/$DOCKER_HUB_USER/" 2>/dev/null || \
    log "Failed to create repository (may already exist or insufficient permissions)"
}

# Get repository info
get_repo_info() {
    local repo_name="$1"

    if [ -z "$repo_name" ]; then
        log "ERROR: Repository name is required"
        return 1
    fi

    log "Getting info for repository: $repo_name"

    curl -s -H "Authorization: Bearer $DOCKER_HUB_TOKEN" \
         "https://hub.docker.com/v2/repositories/$DOCKER_HUB_USER/$repo_name/" | \
    jq '.' 2>/dev/null || \
    log "Failed to get repository info"
}

# Backup current state to Docker Hub
backup_to_hub() {
    local backup_name="backup-$(date +'%Y%m%d-%H%M%S')"

    log "Creating Docker Hub backup: $backup_name"

    # Create backup directory with current state
    local temp_dir="/tmp/docker-backup-$backup_name"
    mkdir -p "$temp_dir"

    # Copy current repository state
    cp -r /app/repos/* "$temp_dir/" 2>/dev/null || true

    # Create backup info
    cat > "$temp_dir/backup-info.json" << EOF
{
    "backup_type": "docker-hub",
    "backup_name": "$backup_name",
    "timestamp": "$(date +'%Y-%m-%d %H:%M:%S')",
    "source": "git-manager-container"
}
EOF

    # Create Dockerfile for backup image
    cat > "$temp_dir/Dockerfile" << EOF
FROM alpine:latest
COPY . /backup-data
RUN echo "Backup created on $(date)" > /backup-data/README.txt
VOLUME /backup-data
CMD ["sh", "-c", "ls -la /backup-data"]
EOF

    # Build and push backup
    cd "$temp_dir"
    build_and_push "shamiur-backup" "." "$backup_name"

    # Cleanup
    cd /
    rm -rf "$temp_dir"

    log "Backup completed: $DOCKER_HUB_USER/shamiur-backup:$backup_name"
}

# Main function with command handling
main() {
    case "${1:-}" in
        "login")
            docker_login || exit 1
            ;;
        "build-push")
            build_and_push "$2" "$3" "$4" || exit 1
            ;;
        "list")
            list_repositories || exit 1
            ;;
        "cleanup")
            cleanup_images "$2" "$3" || exit 1
            ;;
        "create")
            create_repository "$2" "$3" "$4" || exit 1
            ;;
        "info")
            get_repo_info "$2" || exit 1
            ;;
        "backup")
            backup_to_hub || exit 1
            ;;
        *)
            echo "Usage: $0 {login|build-push|list|cleanup|create|info|backup}"
            echo "  login                           - Login to Docker Hub"
            echo "  build-push <name> [path] [tag]  - Build and push image"
            echo "  list                            - List user repositories"
            echo "  cleanup <repo> [keep_count]     - Clean up old images"
            echo "  create <name> [desc] [private]   - Create repository"
            echo "  info <name>                     - Get repository info"
            echo "  backup                          - Backup current state"
            exit 1
            ;;
    esac
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi