#!/bin/bash

# Docker Git Manager - Main entrypoint script
# This script manages all Git operations and repository organization within Docker containers

set -e

# Configuration
REPO_URL="${GIT_REPO_URL:-https://github.com/shamiursunny/shamiur.ai.git}"
BACKUP_INTERVAL="${BACKUP_INTERVAL:-3600}"
DOCKER_HUB_USER="${DOCKER_HUB_USER}"
DOCKER_HUB_TOKEN="${DOCKER_HUB_TOKEN}"

# Directories
REPO_DIR="/app/repos/$(basename "$REPO_URL" .git)"
BACKUP_DIR="/app/backups"
LOG_DIR="/app/logs"
SCRIPT_DIR="/app/scripts"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_DIR/git-manager.log"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Setup function
setup() {
    log "Setting up Git Manager..."

    # Create directories
    mkdir -p "$REPO_DIR" "$BACKUP_DIR" "$LOG_DIR"

    # Configure Git if not already configured
    if ! git config --global user.name > /dev/null 2>&1; then
        git config --global user.name "Docker Git Manager"
        git config --global user.email "docker@shamiur.ai"
        git config --global init.defaultBranch main
        log "Git configuration set"
    fi

    # Clone or update repository
    if [ ! -d "$REPO_DIR/.git" ]; then
        log "Cloning repository: $REPO_URL"
        git clone "$REPO_URL" "$REPO_DIR" || error_exit "Failed to clone repository"
    else
        log "Updating existing repository"
        cd "$REPO_DIR"
        git pull origin main || log "Warning: Failed to pull latest changes"
        cd - > /dev/null
    fi

    log "Git Manager setup complete"
}

# Git operations
git_commit() {
    local message="$1"
    local files="${2:-.}"

    cd "$REPO_DIR" || error_exit "Cannot access repository directory"

    # Add files
    git add "$files"

    # Check if there are changes to commit
    if git diff --staged --quiet; then
        log "No changes to commit"
        return 0
    fi

    # Commit
    git commit -m "$message" || error_exit "Failed to commit changes"
    log "Committed changes: $message"

    # Push
    git push origin main || error_exit "Failed to push changes"
    log "Pushed changes to remote repository"
}

git_backup() {
    local backup_name="backup-$(date +'%Y%m%d-%H%M%S')"
    local backup_path="$BACKUP_DIR/$backup_name"

    log "Creating repository backup: $backup_name"

    # Create backup directory
    mkdir -p "$backup_path"

    # Copy repository
    cp -r "$REPO_DIR" "$backup_path/repo"

    # Create backup metadata
    cat > "$backup_path/metadata.json" << EOF
{
    "backup_name": "$backup_name",
    "timestamp": "$(date +'%Y-%m-%d %H:%M:%S')",
    "repository": "$REPO_URL",
    "commit_hash": "$(cd "$REPO_DIR" && git rev-parse HEAD)",
    "branch": "$(cd "$REPO_DIR" && git branch --show-current)"
}
EOF

    # Compress backup
    cd "$BACKUP_DIR"
    tar -czf "${backup_name}.tar.gz" "$backup_name"
    rm -rf "$backup_name"

    log "Backup created: $backup_name.tar.gz"
}

# Environment management
manage_env() {
    local action="$1"
    local env_file="${2:-.env}"

    case "$action" in
        "backup")
            if [ -f "$env_file" ]; then
                local backup_file="$BACKUP_DIR/env-$(date +'%Y%m%d-%H%M%S').enc"
                # Encrypt environment file (basic obfuscation)
                openssl enc -aes-256-cbc -salt -in "$env_file" -out "$backup_file" -k "$DOCKER_HUB_TOKEN" 2>/dev/null || \
                cp "$env_file" "$backup_file" # Fallback if openssl fails
                log "Environment file backed up: $backup_file"
            fi
            ;;
        "restore")
            local latest_backup=$(ls -t "$BACKUP_DIR"/env-*.enc 2>/dev/null | head -1)
            if [ -n "$latest_backup" ]; then
                openssl enc -d -aes-256-cbc -in "$latest_backup" -out "$env_file" -k "$DOCKER_HUB_TOKEN" 2>/dev/null || \
                cp "$latest_backup" "$env_file" # Fallback
                log "Environment file restored from: $latest_backup"
            fi
            ;;
        *)
            log "Unknown environment action: $action"
            ;;
    esac
}

# Docker Hub operations
docker_hub_push() {
    if [ -n "$DOCKER_HUB_USER" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
        log "Pushing to Docker Hub..."

        # Source Docker Hub integration script
        if [ -f "/app/scripts/docker-hub-integration.sh" ]; then
            # Use the integration script for comprehensive Docker Hub operations
            /app/scripts/docker-hub-integration.sh push-all "$(date +'%Y%m%d-%H%M%S')"
        else
            # Fallback to basic Docker operations
            echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin
            docker build -t "$DOCKER_HUB_USER/shamiur-portfolio:latest" .
            docker push "$DOCKER_HUB_USER/shamiur-portfolio:latest"
            log "Docker image pushed to Docker Hub (basic mode)"
        fi

        log "Docker Hub operations completed"
    else
        log "Docker Hub credentials not configured"
    fi
}

# Repository organization
organize_repos() {
    log "Organizing repositories..."

    # Create organized structure
    mkdir -p /app/repos/projects /app/repos/configs /app/repos/scripts

    # Move repositories to appropriate directories
    if [ -d "$REPO_DIR" ]; then
        if [ -f "$REPO_DIR/package.json" ]; then
            mv "$REPO_DIR" /app/repos/projects/ 2>/dev/null || true
        elif [ -f "$REPO_DIR/docker-compose.yml" ]; then
            mv "$REPO_DIR" /app/repos/configs/ 2>/dev/null || true
        fi
    fi

    log "Repository organization complete"
}

# Main loop
main() {
    log "Starting Docker Git Manager"

    # Initial setup
    setup

    # Organize repositories
    organize_repos

    # Backup environment
    manage_env backup

    # Initial Docker Hub push
    docker_hub_push

    # Main monitoring loop
    while true; do
        log "Git Manager monitoring cycle started"

        # Check for changes and auto-commit
        if [ -d "$REPO_DIR/.git" ]; then
            cd "$REPO_DIR"
            if ! git diff --quiet || ! git diff --staged --quiet; then
                git_commit "Auto-commit: $(date)" || true
            fi
            cd - > /dev/null
        fi

        # Periodic backup
        git_backup

        # Docker Hub push
        docker_hub_push

        log "Git Manager cycle complete, sleeping for $BACKUP_INTERVAL seconds"
        sleep "$BACKUP_INTERVAL"
    done
}

# Handle command line arguments
case "${1:-}" in
    "commit")
        shift
        git_commit "$@" || exit 1
        ;;
    "backup")
        git_backup || exit 1
        ;;
    "push")
        docker_hub_push || exit 1
        ;;
    "env")
        shift
        manage_env "$@" || exit 1
        ;;
    "organize")
        organize_repos || exit 1
        ;;
    *)
        main
        ;;
esac