#!/bin/bash

# Passive CLI Connections Setup Script for Git Bash
# Compatible with GitHub Cloud Code Editor environment
# Sets up persistent CLI connections for development services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $*" >&2
}

log_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $*" >&2
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $*" >&2
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $*" >&2
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     echo "linux";;
        Darwin*)    echo "macos";;
        CYGWIN*|MINGW*|MSYS*) echo "windows";;
        *)          echo "unknown";;
    esac
}

OS=$(detect_os)

# Install CLI tools based on OS
install_cli() {
    local service=$1
    local cli_command=$2

    log_info "Installing $service CLI..."

    case $service in
        "github")
            if [ "$OS" = "windows" ]; then
                winget install --id GitHub.cli 2>/dev/null || choco install gh -y 2>/dev/null || log_warning "Please install GitHub CLI manually: https://cli.github.com/"
            elif [ "$OS" = "linux" ]; then
                curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
                sudo apt update && sudo apt install gh -y
            elif [ "$OS" = "macos" ]; then
                brew install gh
            fi
            ;;

        "docker")
            if [ "$OS" = "windows" ]; then
                winget install --id Docker.DockerDesktop 2>/dev/null || choco install docker-desktop -y 2>/dev/null || log_warning "Please install Docker Desktop manually"
            elif [ "$OS" = "linux" ]; then
                curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
            elif [ "$OS" = "macos" ]; then
                brew install --cask docker
            fi
            ;;

        "supabase"|"vercel"|"netlify"|"render"|"appwrite")
            npm install -g "$cli_command"
            ;;
    esac
}

# Authenticate CLI tools
authenticate_cli() {
    local service=$1

    log_info "Authenticating $service CLI..."

    case $service in
        "github")
            if command_exists gh; then
                echo "GitHub CLI will prompt for authentication..."
                gh auth login
            fi
            ;;

        "docker")
            if command_exists docker; then
                echo "Docker Hub credentials required..."
                docker login
            fi
            ;;

        "supabase")
            if command_exists supabase; then
                supabase login
            fi
            ;;

        "vercel")
            if command_exists vercel; then
                vercel login
            fi
            ;;

        "netlify")
            if command_exists netlify; then
                netlify login
            fi
            ;;

        "render")
            if command_exists render; then
                render login
            fi
            ;;

        "appwrite")
            if command_exists appwrite; then
                appwrite login
            fi
            ;;
    esac
}

# Test CLI connections
test_cli() {
    local service=$1

    log_info "Testing $service CLI connection..."

    case $service in
        "github")
            if command_exists gh && gh auth status >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;

        "docker")
            if command_exists docker && docker info >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;

        "supabase")
            if command_exists supabase && supabase projects list >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;

        "vercel")
            if command_exists vercel && vercel whoami >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;

        "netlify")
            if command_exists netlify && netlify status >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;

        "render")
            if command_exists render && render services list >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;

        "appwrite")
            if command_exists appwrite && appwrite projects list >/dev/null 2>&1; then
                log_success "$service CLI connected"
                return 0
            fi
            ;;
    esac

    log_error "$service CLI test failed"
    return 1
}

# Setup environment variables
setup_env_vars() {
    local env_file=".env.local"

    if [ ! -f "$env_file" ]; then
        cp .env.example "$env_file" 2>/dev/null || log_warning "Please copy .env.example to .env.local and fill in your tokens"
    fi

    log_info "Environment file ready: $env_file"
}

# Main setup function
main() {
    echo "=================================================="
    echo "🚀 Passive CLI Connections Setup for Git Bash"
    echo "=================================================="
    echo "Setting up CLI connections for:"
    echo "• GitHub CLI (gh)"
    echo "• Docker Hub"
    echo "• Supabase CLI"
    echo "• Vercel CLI"
    echo "• Netlify CLI"
    echo "• Render CLI"
    echo "• Appwrite CLI"
    echo "=================================================="

    # Setup environment variables
    setup_env_vars

    # Define services and their CLI commands
    declare -A services=(
        ["github"]="gh"
        ["docker"]="docker"
        ["supabase"]="supabase"
        ["vercel"]="vercel"
        ["netlify"]="netlify"
        ["render"]="render"
        ["appwrite"]="appwrite"
    )

    local success_count=0
    local total_services=${#services[@]}

    # Setup each service
    for service in "${!services[@]}"; do
        cli_command=${services[$service]}

        echo ""
        echo "=== Setting up $service ==="

        # Check if CLI is installed
        if ! command_exists "$cli_command"; then
            log_warning "$service CLI not found, installing..."
            install_cli "$service" "$cli_command"
        else
            log_info "$service CLI already installed"
        fi

        # Authenticate
        authenticate_cli "$service"

        # Test connection
        if test_cli "$service"; then
            ((success_count++))
        fi
    done

    # Summary
    echo ""
    echo "=================================================="
    echo "🎉 Setup Complete!"
    echo "=================================================="
    echo "Services configured: $success_count/$total_services"

    if [ $success_count -eq $total_services ]; then
        log_success "All passive CLI connections established successfully!"
        echo ""
        echo "✅ Your SUPER AI REG TEAM can now use all services seamlessly"
        echo "✅ Ready for GitHub Cloud Code Editor integration"
    else
        log_warning "Some services may require manual configuration"
        echo ""
        echo "Run this script again or configure remaining services manually"
    fi

    echo ""
    echo "Next steps:"
    echo "1. Fill in your tokens in .env.local"
    echo "2. Run: npm run setup-cli-tokens"
    echo "3. Test connections: npm run test-cli-connections"
}

# Run main function
main "$@"