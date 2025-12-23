#!/bin/bash

# Docker Backup Service - Handles automated backups to Docker Hub and local storage

set -e

# Configuration
DOCKER_HUB_USER="${DOCKER_HUB_USER}"
DOCKER_HUB_TOKEN="${DOCKER_HUB_TOKEN}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
BACKUP_DIR="/app/backups"
LOG_DIR="/app/logs"

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] BACKUP: $*" | tee -a "$LOG_DIR/backup-service.log"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Setup backup service
setup_backup() {
    log "Setting up Backup Service..."

    # Create directories
    mkdir -p "$BACKUP_DIR" "$LOG_DIR"

    # Login to Docker Hub if credentials provided
    if [ -n "$DOCKER_HUB_USER" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
        log "Logging into Docker Hub..."
        echo "$DOCKER_HUB_TOKEN" | docker login -u "$DOCKER_HUB_USER" --password-stdin
    fi

    log "Backup Service setup complete"
}

# Create database backup
backup_database() {
    if [ -d "/app/db" ]; then
        local backup_name="db-backup-$(date +'%Y%m%d-%H%M%S')"
        local backup_file="$BACKUP_DIR/$backup_name.tar.gz"

        log "Creating database backup: $backup_name"

        # Compress database directory
        cd /app/db
        tar -czf "$backup_file" . 2>/dev/null || log "Warning: Database backup may be incomplete"

        log "Database backup created: $backup_file"
    fi
}

# Create full system backup
backup_system() {
    local backup_name="system-backup-$(date +'%Y%m%d-%H%M%S')"
    local backup_file="$BACKUP_DIR/$backup_name.tar.gz"

    log "Creating system backup: $backup_name"

    # Create temporary directory for backup
    local temp_dir="$BACKUP_DIR/temp-$backup_name"
    mkdir -p "$temp_dir"

    # Copy important directories
    cp -r /app/repos "$temp_dir/" 2>/dev/null || true
    cp -r /app/db "$temp_dir/" 2>/dev/null || true

    # Create backup metadata
    cat > "$temp_dir/backup-info.json" << EOF
{
    "backup_type": "system",
    "backup_name": "$backup_name",
    "timestamp": "$(date +'%Y-%m-%d %H:%M:%S')",
    "docker_hub_user": "$DOCKER_HUB_USER",
    "retention_days": $BACKUP_RETENTION_DAYS
}
EOF

    # Compress backup
    cd "$BACKUP_DIR"
    tar -czf "$backup_file" "temp-$backup_name"
    rm -rf "temp-$backup_name"

    log "System backup created: $backup_file"
}

# Push backup to Docker Hub
push_to_docker_hub() {
    if [ -n "$DOCKER_HUB_USER" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
        local image_tag="$DOCKER_HUB_USER/shamiur-portfolio-backup:$(date +'%Y%m%d-%H%M%S')"

        log "Pushing backup to Docker Hub: $image_tag"

        # Create a minimal Dockerfile for backup image
        cat > "$BACKUP_DIR/Dockerfile.backup" << EOF
FROM alpine:latest
COPY . /backup
VOLUME /backup
CMD ["sh", "-c", "echo 'Backup image created on $(date)' && ls -la /backup"]
EOF

        # Build and push backup image
        cd "$BACKUP_DIR"
        docker build -f Dockerfile.backup -t "$image_tag" .
        docker push "$image_tag"

        # Clean up
        rm -f Dockerfile.backup

        log "Backup pushed to Docker Hub: $image_tag"
    else
        log "Docker Hub credentials not configured, skipping push"
    fi
}

# Clean old backups
cleanup_old_backups() {
    log "Cleaning up old backups (retention: $BACKUP_RETENTION_DAYS days)..."

    local cutoff_date=$(date -d "$BACKUP_RETENTION_DAYS days ago" +%Y%m%d 2>/dev/null || date -v-"$BACKUP_RETENTION_DAYS"d +%Y%m%d 2>/dev/null || echo "")

    if [ -n "$cutoff_date" ]; then
        # Remove old backup files
        find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f | while read -r file; do
            local file_date=$(basename "$file" | sed 's/backup-\([0-9]\{8\}\).*/\1/')
            if [ "$file_date" -lt "$cutoff_date" ] 2>/dev/null; then
                log "Removing old backup: $(basename "$file")"
                rm -f "$file"
            fi
        done

        # Remove old Docker images (if Docker Hub credentials available)
        if [ -n "$DOCKER_HUB_USER" ] && [ -n "$DOCKER_HUB_TOKEN" ]; then
            log "Cleaning up old Docker Hub images..."
            # This would require Docker Hub API calls - simplified for now
            docker system prune -f --filter "label=backup=true" 2>/dev/null || true
        fi
    fi

    log "Cleanup complete"
}

# List available backups
list_backups() {
    log "Available backups:"
    ls -la "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null || echo "No backups found"

    if [ -n "$DOCKER_HUB_USER" ]; then
        log "Docker Hub images:"
        docker images "$DOCKER_HUB_USER/shamiur-portfolio*" --format "table {{.Repository}}:{{.Tag}}\t{{.CreatedAt}}\t{{.Size}}" 2>/dev/null || echo "No local Docker images found"
    fi
}

# Restore from backup
restore_backup() {
    local backup_name="$1"

    if [ -z "$backup_name" ]; then
        log "ERROR: Please specify a backup name to restore"
        return 1
    fi

    local backup_file="$BACKUP_DIR/$backup_name.tar.gz"

    if [ ! -f "$backup_file" ]; then
        log "ERROR: Backup file not found: $backup_file"
        return 1
    fi

    log "Restoring from backup: $backup_name"

    # Create restore directory
    local restore_dir="$BACKUP_DIR/restore-$(date +'%Y%m%d-%H%M%S')"
    mkdir -p "$restore_dir"

    # Extract backup
    cd "$restore_dir"
    tar -xzf "$backup_file"

    log "Backup extracted to: $restore_dir"
    log "Please manually copy files to appropriate locations"
}

# Main backup loop
main() {
    log "Starting Docker Backup Service"

    # Initial setup
    setup_backup

    # Main backup loop
    while true; do
        log "Backup cycle started"

        # Create backups
        backup_database
        backup_system

        # Push to Docker Hub
        push_to_docker_hub

        # Cleanup old backups
        cleanup_old_backups

        log "Backup cycle complete, sleeping for 24 hours"
        sleep 86400  # 24 hours
    done
}

# Handle command line arguments
case "${1:-}" in
    "database")
        backup_database || exit 1
        ;;
    "system")
        backup_system || exit 1
        ;;
    "push")
        push_to_docker_hub || exit 1
        ;;
    "cleanup")
        cleanup_old_backups || exit 1
        ;;
    "list")
        list_backups || exit 1
        ;;
    "restore")
        restore_backup "$2" || exit 1
        ;;
    *)
        main
        ;;
esac