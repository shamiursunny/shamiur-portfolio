#!/bin/bash

# Docker Ecosystem Setup Script
# This script sets up the complete Docker ecosystem for Git management and backups

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        error "Docker daemon is not running. Please start Docker."
        exit 1
    fi

    log "Docker is installed and running"
}

# Check if Docker Compose is available
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version &> /dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        error "Docker Compose is not available. Please install Docker Compose."
        exit 1
    fi

    log "Docker Compose is available: $DOCKER_COMPOSE_CMD"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."

    mkdir -p git-repos
    mkdir -p backups
    mkdir -p logs
    mkdir -p scripts

    # Set proper permissions
    chmod 755 scripts/*.sh 2>/dev/null || true

    log "Directories created"
}

# Setup environment file
setup_environment() {
    log "Setting up environment configuration..."

    if [ ! -f ".env" ]; then
        warn ".env file not found. Please copy .env.example to .env and configure it."
        read -p "Do you want to copy .env.example to .env? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp .env.example .env
            warn "Please edit .env file with your configuration before proceeding."
            exit 1
        else
            error "Environment file is required. Exiting."
            exit 1
        fi
    fi

    # Check for Docker Hub configuration
    if ! grep -q "DOCKER_HUB_USER=" .env 2>/dev/null || grep -q "DOCKER_HUB_USER=your_dockerhub_username" .env 2>/dev/null; then
        warn "Docker Hub credentials not configured in .env"
        info "Please add the following to your .env file:"
        echo "DOCKER_HUB_USER=your_dockerhub_username"
        echo "DOCKER_HUB_TOKEN=your_dockerhub_access_token"
        echo
        read -p "Do you want to configure Docker Hub now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter Docker Hub username: " docker_user
            read -s -p "Enter Docker Hub access token: " docker_token
            echo
            echo "DOCKER_HUB_USER=$docker_user" >> .env
            echo "DOCKER_HUB_TOKEN=$docker_token" >> .env
            log "Docker Hub credentials added to .env"
        else
            warn "Docker Hub integration will be limited without credentials"
        fi
    fi

    log "Environment setup complete"
}

# Build Docker images
build_images() {
    log "Building Docker images..."

    # Build main portfolio image
    info "Building portfolio application image..."
    docker build -t shamiur-portfolio:latest .

    # Build Git manager image
    info "Building Git manager image..."
    docker build -f Dockerfile.git -t shamiur-git-manager:latest .

    # Build backup service image
    info "Building backup service image..."
    docker build -f Dockerfile.backup -t shamiur-backup-service:latest .

    log "All images built successfully"
}

# Test the setup
test_setup() {
    log "Testing Docker ecosystem setup..."

    # Test Docker Compose configuration
    info "Validating docker-compose.yml..."
    $DOCKER_COMPOSE_CMD config --quiet

    # Test basic Docker functionality
    info "Testing Docker connectivity..."
    docker run --rm hello-world > /dev/null

    log "Setup tests passed"
}

# Initialize the ecosystem
initialize_ecosystem() {
    log "Initializing Docker ecosystem..."

    # Start the services
    info "Starting Docker services..."
    $DOCKER_COMPOSE_CMD up -d

    # Wait for services to be healthy
    info "Waiting for services to start..."
    sleep 10

    # Check service health
    info "Checking service health..."
    $DOCKER_COMPOSE_CMD ps

    log "Docker ecosystem initialized"
}

# Show usage information
show_usage() {
    log "Docker Ecosystem Setup Complete!"
    echo
    info "Available commands:"
    echo "  Start ecosystem:  $DOCKER_COMPOSE_CMD up -d"
    echo "  Stop ecosystem:   $DOCKER_COMPOSE_CMD down"
    echo "  View logs:        $DOCKER_COMPOSE_CMD logs -f"
    echo "  Check status:     $DOCKER_COMPOSE_CMD ps"
    echo
    info "Git management commands:"
    echo "  Manual commit:    $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh commit \"message\""
    echo "  Manual backup:    $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh backup"
    echo "  Push to Docker Hub: $DOCKER_COMPOSE_CMD exec git-manager /app/scripts/git-manager.sh push"
    echo
    info "Backup commands:"
    echo "  List backups:     $DOCKER_COMPOSE_CMD exec backup-service /app/backup-service.sh list"
    echo "  Manual backup:    $DOCKER_COMPOSE_CMD exec backup-service /app/backup-service.sh system"
    echo
    info "Next steps:"
    echo "1. Monitor logs: $DOCKER_COMPOSE_CMD logs -f git-manager"
    echo "2. Check backups: $DOCKER_COMPOSE_CMD exec backup-service /app/backup-service.sh list"
    echo "3. Configure additional repositories in the git-manager container"
}

# Main setup function
main() {
    log "Starting Docker Ecosystem Setup for Shamiur Portfolio"
    echo

    # Pre-flight checks
    check_docker
    check_docker_compose

    # Setup components
    create_directories
    setup_environment
    build_images
    test_setup
    initialize_ecosystem

    # Show completion info
    echo
    show_usage

    echo
    log "Setup completed successfully! 🎉"
    log "Your Docker ecosystem is now managing Git operations and backups."
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        echo "Docker Ecosystem Setup Script"
        echo
        echo "Usage: $0 [options]"
        echo
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --skip-build        Skip building Docker images"
        echo "  --no-init           Don't start services after setup"
        echo
        exit 0
        ;;
    "--skip-build")
        SKIP_BUILD=true
        ;;
    "--no-init")
        NO_INIT=true
        ;;
esac

# Determine Docker Compose command
check_docker_compose

# Run main setup
if [[ "${SKIP_BUILD:-false}" == "true" ]]; then
    warn "Skipping Docker image builds as requested"
    create_directories
    setup_environment
    test_setup
    if [[ "${NO_INIT:-false}" != "true" ]]; then
        initialize_ecosystem
    fi
    show_usage
else
    main
fi