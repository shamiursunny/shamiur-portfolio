# Docker Ecosystem for Git Management & Codebase Backup

A comprehensive Docker-based ecosystem that provides full control over Git operations, environment management, and automated codebase backups to Docker Hub.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Portfolio     │    │   Git Manager   │    │  Backup Service │
│   Container     │◄──►│   Container     │◄──►│   Container     │
│                 │    │                 │    │                 │
│ • Next.js App   │    │ • Git Operations│    │ • Docker Hub    │
│ • API Routes    │    │ • Auto-commit   │    │ • Backups       │
│ • Database      │    │ • Repo Mgmt     │    │ • Cleanup       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Docker Hub    │
                    │   Registry      │
                    │                 │
                    │ • Image Storage │
                    │ • Version Ctrl  │
                    │ • Backup Vault  │
                    └─────────────────┘
```

## 🎯 Key Features

### Git Management
- **Container-Controlled Git**: All Git operations run through Docker containers
- **Automated Commits**: Auto-commit changes with timestamps
- **Repository Organization**: Systematic organization of multiple repositories
- **SSH Key Support**: Secure access to private repositories

### Environment Management
- **Encrypted .env Files**: Environment variables encrypted within containers
- **Dynamic Configuration**: Runtime environment switching
- **Secure Secrets**: Isolated secret management

### Docker Hub Integration
- **Automated Backups**: Regular Docker image pushes to Docker Hub
- **Version Control**: Timestamped backup images
- **Repository Management**: Create and manage Docker Hub repositories
- **Cleanup Automation**: Automatic removal of old backup images

### Backup & Recovery
- **Full System Backups**: Complete codebase snapshots
- **Database Backups**: SQLite database persistence
- **Disaster Recovery**: Quick restore from Docker Hub
- **Retention Policies**: Configurable backup retention

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Bash shell

### 1. Initial Setup
```bash
# Clone your repository
git clone https://github.com/shamiursunny/shamiur.ai.git
cd shamiur-portfolio

# Run the setup script
chmod +x scripts/setup-docker-ecosystem.sh
./scripts/setup-docker-ecosystem.sh
```

### 2. Configure Environment
```bash
# Copy and edit environment template
cp .env.docker .env

# Edit with your Docker Hub credentials
nano .env
```

### 3. Start the Ecosystem
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f git-manager
```

## 📋 Configuration

### Environment Variables

#### Required
```env
DOCKER_HUB_USER=your_dockerhub_username
DOCKER_HUB_TOKEN=your_dockerhub_access_token
```

#### Optional
```env
GIT_REPO_URL=https://github.com/shamiursunny/shamiur.ai.git
BACKUP_INTERVAL=3600
BACKUP_RETENTION_DAYS=30
```

### Directory Structure
```
shamiur-portfolio/
├── docker-compose.yml          # Main orchestration
├── Dockerfile                  # Portfolio container
├── Dockerfile.git             # Git manager container
├── Dockerfile.backup          # Backup service container
├── .env                       # Environment configuration
├── scripts/
│   ├── git-manager.sh         # Git operations script
│   ├── backup-service.sh      # Backup management script
│   ├── docker-hub-utils.sh    # Docker Hub utilities
│   └── setup-docker-ecosystem.sh  # Setup script
├── git-repos/                 # Managed repositories
├── backups/                   # Local backups
└── logs/                      # Service logs
```

## 🛠️ Usage Guide

### Git Operations

#### Manual Git Commands
```bash
# Commit changes manually
docker-compose exec git-manager /app/scripts/git-manager.sh commit "Your commit message"

# Create repository backup
docker-compose exec git-manager /app/scripts/git-manager.sh backup

# Push to Docker Hub
docker-compose exec git-manager /app/scripts/git-manager.sh push

# Organize repositories
docker-compose exec git-manager /app/scripts/git-manager.sh organize
```

#### Automated Git Management
The Git manager runs continuously and:
- Monitors for changes every hour
- Auto-commits changes with timestamps
- Pushes to remote repository
- Creates periodic backups

### Backup Management

#### Manual Backups
```bash
# Create system backup
docker-compose exec backup-service /app/backup-service.sh system

# Create database backup
docker-compose exec backup-service /app/backup-service.sh database

# Push backup to Docker Hub
docker-compose exec backup-service /app/backup-service.sh push
```

#### Backup Operations
```bash
# List all backups
docker-compose exec backup-service /app/backup-service.sh list

# Restore from backup
docker-compose exec backup-service /app/backup-service.sh restore backup-20231223-143022.tar.gz

# Cleanup old backups
docker-compose exec backup-service /app/backup-service.sh cleanup
```

### Docker Hub Operations

#### Repository Management
```bash
# Login to Docker Hub
docker-compose exec git-manager /app/scripts/docker-hub-utils.sh login

# List your repositories
docker-compose exec git-manager /app/scripts/docker-hub-utils.sh list

# Create new repository
docker-compose exec git-manager /app/scripts/docker-hub-utils.sh create my-new-repo

# Get repository info
docker-compose exec git-manager /app/scripts/docker-hub-utils.sh info shamiur-portfolio
```

#### Image Management
```bash
# Build and push specific image
docker-compose exec git-manager /app/scripts/docker-hub-utils.sh build-push my-image ./path/to/dockerfile

# Cleanup old images (keep last 10)
docker-compose exec git-manager /app/scripts/docker-hub-utils.sh cleanup shamiur-portfolio 10
```

### Environment Management

#### Environment Operations
```bash
# Backup environment file
docker-compose exec git-manager /app/scripts/git-manager.sh env backup

# Restore environment file
docker-compose exec git-manager /app/scripts/git-manager.sh env restore
```

## 🔧 Service Management

### Starting Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d git-manager

# Start with rebuild
docker-compose up -d --build
```

### Monitoring Services
```bash
# Check service status
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f git-manager

# Check resource usage
docker stats
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop git-manager
```

## 📊 Monitoring & Troubleshooting

### Health Checks
```bash
# Check container health
docker-compose ps

# Check application health
curl http://localhost:3000/api/health

# Check Git manager status
docker-compose exec git-manager /app/scripts/git-manager.sh --status
```

### Log Analysis
```bash
# View Git manager logs
docker-compose logs git-manager | tail -50

# View backup service logs
docker-compose logs backup-service | grep ERROR

# Search logs for specific pattern
docker-compose logs | grep "backup"
```

### Common Issues

#### Git Authentication
```bash
# Mount SSH keys for private repositories
echo "GIT_SSH_KEY_PATH=/root/.ssh/id_rsa" >> .env

# Or configure SSH in container
docker-compose exec git-manager ssh-keygen -t rsa -b 4096
```

#### Docker Hub Rate Limits
```bash
# Check rate limit status
curl -H "Authorization: Bearer $DOCKER_HUB_TOKEN" https://hub.docker.com/v2/rate_limit/

# Increase backup interval
echo "BACKUP_INTERVAL=7200" >> .env
```

#### Storage Issues
```bash
# Check disk usage
docker system df

# Clean up unused resources
docker system prune -f

# Check backup directory size
du -sh backups/
```

## 🔒 Security Considerations

### Environment Variables
- Sensitive data is encrypted within containers
- .env files are not committed to Git
- Docker Hub tokens have minimal required permissions

### Network Security
- Services communicate through isolated Docker network
- No exposed ports except application port (3000)
- Internal services not accessible externally

### Access Control
- SSH keys for Git access (optional)
- Docker Hub tokens with scoped permissions
- Container user permissions limited

## 🔄 Backup Strategy

### Automated Backups
- **Git Repository**: Hourly commits and pushes
- **Docker Images**: Daily pushes to Docker Hub
- **Database**: Daily compressed backups
- **Environment**: Encrypted backups with each system backup

### Retention Policy
- **Local Backups**: 30 days retention
- **Docker Hub Images**: Rolling 30-day window
- **Git History**: Full history preserved in repository

### Recovery Process
1. Pull latest Docker image from Docker Hub
2. Restore database from backup
3. Restore environment file
4. Restart services

## 🚀 Advanced Configuration

### Custom Git Hooks
```bash
# Add custom Git hooks
docker-compose exec git-manager bash
cd /app/repos/shamiur.ai
echo "#!/bin/bash\necho 'Custom pre-commit hook'" > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Multiple Repositories
```bash
# Add additional repositories
docker-compose exec git-manager /app/scripts/git-manager.sh clone https://github.com/user/repo2.git

# Configure repository organization
echo "REPO_ORGANIZATION_ENABLED=true" >> .env
echo "REPO_PROJECTS_DIR=projects" >> .env
```

### Custom Docker Networks
```yaml
# In docker-compose.yml
networks:
  portfolio-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## 📈 Performance Optimization

### Container Resources
```yaml
# In docker-compose.yml
services:
  git-manager:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

### Build Optimization
```dockerfile
# Use multi-stage builds
FROM node:18-alpine AS builder
# ... build steps ...

FROM alpine:latest AS runner
# ... runtime configuration ...
```

### Backup Optimization
```bash
# Use incremental backups for large repositories
# Configure backup compression level
# Schedule backups during low-usage periods
```

## 🤝 Contributing

### Adding New Features
1. Create feature branch in container
2. Test in isolated environment
3. Push changes through Git manager
4. Create backup before deployment

### Custom Scripts
```bash
# Add custom management scripts
touch scripts/custom-feature.sh
chmod +x scripts/custom-feature.sh

# Update Dockerfiles to include new scripts
COPY scripts/custom-feature.sh /app/scripts/
```

## 📞 Support

### Troubleshooting Commands
```bash
# Full system diagnostic
docker-compose exec git-manager /app/scripts/git-manager.sh --diagnostics

# Check all service health
docker-compose ps --format table

# View detailed logs
docker-compose logs --tail=100
```

### Getting Help
1. Check service logs for error messages
2. Verify environment configuration
3. Test Docker Hub connectivity
4. Review backup integrity

---

## 🎉 Success Metrics

Your Docker ecosystem is working correctly when:
- ✅ Git operations happen automatically
- ✅ Docker Hub shows regular image updates
- ✅ Backup directory contains recent archives
- ✅ Services restart automatically after failures
- ✅ Logs show successful operations

**Welcome to your automated Git and backup ecosystem! 🚀**