#!/bin/bash

# Master Control Script for Docker Ecosystem
# Orchestrates all Docker operations for the portfolio ecosystem

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DOCKER_COMPOSE_CMD="${DOCKER_COMPOSE_CMD:-docker compose}"
PROJECT_NAME="${PROJECT_NAME:-shamiur-portfolio}"

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] MASTER: $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed"
        exit 1
    fi

    # Check Docker Compose
    if ! $DOCKER_COMPOSE_CMD version &> /dev/null; then
        error "Docker Compose is not available"
        exit 1
    fi

    # Check .env file
    if [ ! -f ".env" ]; then
        warn ".env file not found. Please create it with your configuration."
        read -p "Would you like to copy .env.example? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.example .env
            warn "Please edit .env with your actual configuration"
            exit 1
        else
            error "Environment file is required"
            exit 1
        fi
    fi

    success "Prerequisites check passed"
}

# Start the ecosystem
start_ecosystem() {
    log "Starting Docker ecosystem..."

    # Create necessary directories
    mkdir -p git-repos backups logs

    # Start services
    $DOCKER_COMPOSE_CMD up -d

    # Wait for services to start
    info "Waiting for services to initialize..."
    sleep 10

    # Check service status
    $DOCKER_COMPOSE_CMD ps

    success "Docker ecosystem started"
}

# Stop the ecosystem
stop_ecosystem() {
    log "Stopping Docker ecosystem..."

    $DOCKER_COMPOSE_CMD down

    success "Docker ecosystem stopped"
}

# Restart the ecosystem
restart_ecosystem() {
    log "Restarting Docker ecosystem..."

    stop_ecosystem
    sleep 2
    start_ecosystem

    success "Docker ecosystem restarted"
}

# Show status
show_status() {
    log "Docker Ecosystem Status"
    echo

    info "Service Status:"
    $DOCKER_COMPOSE_CMD ps
    echo

    info "Docker Images:"
    docker images | grep -E "(shamiur|$PROJECT_NAME)" || echo "No project images found"
    echo

    info "Recent Logs:"
    $DOCKER_COMPOSE_CMD logs --tail=10
    echo

    info "Backup Status:"
    ls -la backups/ 2>/dev/null | head -10 || echo "No backups found"
}

# Git operations
git_operations() {
    local action="$1"
    shift

    case "$action" in
        "commit")
            log "Manual Git commit: $*"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh commit "$*"
            ;;
        "push")
            log "Manual Git push"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh push
            ;;
        "backup")
            log "Creating Git backup"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh backup
            ;;
        "status")
            log "Git repository status"
            $DOCKER_COMPOSE_CMD exec git-manager bash -c "cd /app/repos/* && git status"
            ;;
        *)
            error "Unknown Git action: $action"
            echo "Available Git actions: commit, push, backup, status"
            exit 1
            ;;
    esac
}

# Docker Hub operations
docker_hub_operations() {
    local action="$1"
    shift

    case "$action" in
        "push")
            log "Pushing to Docker Hub: $*"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/docker-hub-integration.sh push-all "$*"
            ;;
        "backup")
            log "Creating Docker Hub backup"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/docker-hub-integration.sh backup
            ;;
        "list")
            log "Listing Docker Hub images"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/docker-hub-integration.sh list
            ;;
        "stats")
            log "Docker Hub repository statistics"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/docker-hub-integration.sh stats
            ;;
        *)
            error "Unknown Docker Hub action: $action"
            echo "Available Docker Hub actions: push, backup, list, stats"
            exit 1
            ;;
    esac
}

# Backup operations
backup_operations() {
    local action="$1"
    shift

    case "$action" in
        "create")
            log "Creating system backup"
            $DOCKER_COMPOSE_CMD exec backup-service /app/backup-service.sh system
            ;;
        "list")
            log "Listing backups"
            $DOCKER_COMPOSE_CMD exec backup-service /app/backup-service.sh list
            ;;
        "cleanup")
            log "Cleaning up old backups"
            $DOCKER_COMPOSE_CMD exec backup-service /app/backup-service.sh cleanup
            ;;
        *)
            error "Unknown backup action: $action"
            echo "Available backup actions: create, list, cleanup"
            exit 1
            ;;
    esac
}

# Environment operations
env_operations() {
    local action="$1"
    shift

    case "$action" in
        "backup")
            log "Backing up environment"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh env backup
            ;;
        "restore")
            log "Restoring environment"
            $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh env restore
            ;;
        *)
            error "Unknown environment action: $action"
            echo "Available environment actions: backup, restore"
            exit 1
            ;;
    esac
}

# Maintenance operations
maintenance_operations() {
    local action="$1"
    shift

    case "$action" in
        "logs")
            log "Showing service logs"
            if [ -n "$1" ]; then
                $DOCKER_COMPOSE_CMD logs -f "$1"
            else
                $DOCKER_COMPOSE_CMD logs -f
            fi
            ;;
        "shell")
            local service="${1:-git-manager}"
            log "Opening shell in $service"
            $DOCKER_COMPOSE_CMD exec "$service" bash
            ;;
        "clean")
            log "Cleaning up Docker resources"
            warn "This will remove unused containers, networks, and images"
            read -p "Are you sure? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                $DOCKER_COMPOSE_CMD down -v
                docker system prune -f
                success "Cleanup completed"
            fi
            ;;
        "rebuild")
            log "Rebuilding all services"
            $DOCKER_COMPOSE_CMD down
            $DOCKER_COMPOSE_CMD build --no-cache
            $DOCKER_COMPOSE_CMD up -d
            success "Rebuild completed"
            ;;
        *)
            error "Unknown maintenance action: $action"
            echo "Available maintenance actions: logs [service], shell [service], clean, rebuild"
            exit 1
            ;;
    esac
}

# Show help
show_help() {
    echo "Docker Ecosystem Master Control Script"
    echo
    echo "Usage: $0 <command> [subcommand] [options]"
    echo
    echo "Commands:"
    echo "  start              Start the Docker ecosystem"
    echo "  stop               Stop the Docker ecosystem"
    echo "  restart            Restart the Docker ecosystem"
    echo "  status             Show ecosystem status"
    echo
    echo "  git <action>       Git operations"
    echo "    commit <msg>     Manual commit with message"
    echo "    push             Push changes to remote"
    echo "    backup           Create repository backup"
    echo "    status           Show Git status"
    echo
    echo "  hub <action>       Docker Hub operations"
    echo "    push [tag]       Push images to Docker Hub"
    echo "    backup           Create backup image"
    echo "    list             List repository images"
    echo "    stats            Show repository statistics"
    echo
    echo "  backup <action>    Backup operations"
    echo "    create           Create system backup"
    echo "    list             List available backups"
    echo "    cleanup          Clean old backups"
    echo
    echo "  env <action>       Environment operations"
    echo "    backup           Backup environment file"
    echo "    restore          Restore environment file"
    echo
    echo "  maintenance <action>  Maintenance operations"
    echo "    logs [service]   Show logs (all or specific service)"
    echo "    shell [service]  Open shell in container"
    echo "    clean            Clean unused resources"
    echo "    rebuild          Rebuild all services"
    echo
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 git commit 'Updated configuration'"
    echo "  $0 hub push"
    echo "  $0 maintenance logs git-manager"
    echo "  $0 backup create"
}

# Main command handler
main() {
    case "${1:-}" in
        "start")
            check_prerequisites
            start_ecosystem
            ;;
        "stop")
            stop_ecosystem
            ;;
        "restart")
            restart_ecosystem
            ;;
        "status")
            show_status
            ;;
        "git")
            shift
            git_operations "$@"
            ;;
        "hub")
            shift
            docker_hub_operations "$@"
            ;;
        "backup")
            shift
            backup_operations "$@"
            ;;
        "env")
            shift
            env_operations "$@"
            ;;
        "maintenance")
            shift
            maintenance_operations "$@"
            ;;
        "--help"|"-h"|"help")
            show_help
            ;;
        *)
            error "Unknown command: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Run main if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi