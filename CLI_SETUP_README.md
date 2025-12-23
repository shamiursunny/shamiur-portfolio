# 🚀 Passive CLI Connections Setup Guide

## Git Bash Compatible Setup for GitHub Cloud Code Editor

This guide will help you set up passive CLI connections for all development services, optimized for Git Bash and GitHub Cloud Code Editor compatibility.

---

## 🎯 Quick Start

### Option 1: Git Bash Shell Script (Recommended)
```bash
# Open Git Bash and navigate to your project
cd shamiur-portfolio

# Make the script executable (if not already)
chmod +x setup-cli-connections.sh

# Run the setup script
./setup-cli-connections.sh
```

### Option 2: npm Scripts
```bash
# For token-based setup (non-interactive)
npm run setup-cli-tokens

# For interactive setup
npm run setup-cli-connections

# Test all connections
npm run test-cli-connections
```

---

## 🔧 Prerequisites

### For Windows/Git Bash:
1. **Install Git Bash** (comes with Git for Windows)
2. **Install Windows Package Managers** (optional but recommended):
   ```bash
   # Install winget (Windows Package Manager)
   # Install Chocolatey
   # choco install chocolatey
   ```

### For Linux/macOS:
- Standard Unix tools are used (curl, apt/brew)

---

## 📋 Services Setup

The setup configures CLI connections for:

| Service | CLI Command | Purpose |
|---------|-------------|---------|
| **GitHub** | `gh` | Repository management, issues, PRs |
| **Docker Hub** | `docker` | Container registry operations |
| **Supabase** | `supabase` | Database and backend management |
| **Vercel** | `vercel` | Deployment and project management |
| **Netlify** | `netlify` | Static site deployment |
| **Render** | `render` | Cloud service management |
| **Appwrite** | `appwrite` | Backend-as-a-Service operations |

---

## 🔑 Authentication Setup

### 1. Environment Variables
Copy the example file and fill in your tokens:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual tokens:

```bash
# GitHub Personal Access Token (with repo permissions)
GITHUB_TOKEN=your_github_token_here

# Docker Hub Credentials
DOCKER_HUB_USER=your_dockerhub_username
DOCKER_HUB_TOKEN=your_dockerhub_token

# Supabase Access Token
SUPABASE_ACCESS_TOKEN=your_supabase_token

# Vercel Token
VERCEL_TOKEN=your_vercel_token

# Netlify Auth Token
NETLIFY_AUTH_TOKEN=your_netlify_token

# Render API Key
RENDER_API_KEY=your_render_key

# Appwrite API Key
APPWRITE_API_KEY=your_appwrite_key
```

### 2. Interactive Authentication
The setup script will prompt you to authenticate each service:

- **GitHub**: Browser-based OAuth or personal access token
- **Docker**: Username/password login
- **Supabase**: Access token authentication
- **Vercel**: Browser-based login
- **Netlify**: Browser-based login
- **Render**: API key authentication
- **Appwrite**: API key authentication

---

## 🧪 Testing Connections

### Test All Connections
```bash
npm run test-cli-connections
```

### Test Individual Services
```bash
# GitHub
gh auth status

# Docker
docker info

# Supabase
supabase projects list

# Vercel
vercel whoami

# Netlify
netlify status

# Render
render services list

# Appwrite
appwrite projects list
```

---

## 🔄 Usage Examples

### With SUPER AI REG TEAM

```bash
# Deploy to Vercel
vercel --prod

# Push to GitHub
git push origin main

# Deploy Docker image
docker build -t myapp . && docker push myapp

# Manage Supabase database
supabase db push

# Deploy to Netlify
netlify deploy --prod

# Check Render services
render services list
```

### Automated Workflows

```bash
# Combined deployment script
#!/bin/bash
echo "🚀 Starting automated deployment..."

# Build and push Docker image
docker build -t myapp:latest .
docker push myapp:latest

# Deploy to Vercel
vercel --prod

# Update GitHub release
gh release create v1.0.0 --generate-notes

echo "✅ Deployment complete!"
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Permission Denied (chmod)**
```bash
# In Git Bash
chmod +x setup-cli-connections.sh
```

**2. Command Not Found**
```bash
# Install missing CLI
npm install -g <cli-name>
# Or use the setup script which handles installation
```

**3. Authentication Failed**
```bash
# Re-run authentication
gh auth login
docker login
# etc.
```

**4. Environment Variables Not Loaded**
```bash
# Ensure .env.local exists and is in project root
ls -la .env.local
```

### Logs and Debugging

- Check setup logs: `.cli-config/setup.log`
- View environment: `printenv | grep -E "(TOKEN|KEY)"`
- Test individual CLIs: Use the test commands above

---

## 🔒 Security Best Practices

1. **Never commit tokens** to version control
2. **Use environment variables** for sensitive data
3. **Rotate tokens regularly** in production
4. **Use least-privilege tokens** (minimal required permissions)
5. **Monitor token usage** through service dashboards

---

## 📚 GitHub Cloud Code Editor Integration

When using GitHub's cloud code editor:

1. **Open in GitHub** → **Code** → **Cloud Editor**
2. **Terminal access** is available with Git Bash-like environment
3. **All CLI tools** will work as configured
4. **Environment persists** across sessions

### Cloud Editor Commands
```bash
# The same commands work in cloud editor
./setup-cli-connections.sh
npm run setup-cli-tokens
npm run test-cli-connections
```

---

## 🎉 Success Indicators

✅ **All CLI commands work without manual authentication**
✅ **Environment variables loaded correctly**
✅ **Database stores authentication data**
✅ **SUPER AI REG TEAM can use all services seamlessly**
✅ **Ready for automated development workflows**

---

## 📞 Support

If you encounter issues:

1. Check the logs: `.cli-config/setup.log`
2. Verify environment variables: `cat .env.local`
3. Test individual services manually
4. Re-run the setup script
5. Check service documentation for token generation

---

**🎯 Ready for GitHub Cloud Code Editor and automated development!**

---

*© 2025 Shamiur Rashid Sunny. All Rights Reserved.*