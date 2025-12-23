#!/usr/bin/env tsx

// Passive CLI Connections Setup Script
// Establishes persistent CLI connections to:
// - GitHub
// - Docker Hub
// - Supabase
// - Vercel
// - Netlify
// - Render
// - Appwrite

import { execSync, spawn } from 'child_process';
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const CONFIG_DIR = join(process.cwd(), '.cli-config');
const LOG_FILE = join(CONFIG_DIR, 'setup.log');

// Services configuration - Git Bash compatible
const SERVICES = {
  github: {
    cli: 'gh',
    install: process.platform === 'win32'
      ? 'winget install --id GitHub.cli || choco install gh'
      : 'curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && sudo apt update && sudo apt install gh',
    auth: 'gh auth login',
    test: 'gh auth status',
    config: {}
  },
  docker: {
    cli: 'docker',
    install: process.platform === 'win32'
      ? 'winget install --id Docker.DockerDesktop || choco install docker-desktop'
      : 'curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh',
    auth: 'docker login',
    test: 'docker info',
    config: {}
  },
  supabase: {
    cli: 'supabase',
    install: 'npm install -g supabase',
    auth: 'supabase login',
    test: 'supabase projects list',
    config: {}
  },
  vercel: {
    cli: 'vercel',
    install: 'npm install -g vercel',
    auth: 'vercel login',
    test: 'vercel whoami',
    config: {}
  },
  netlify: {
    cli: 'netlify',
    install: 'npm install -g netlify-cli',
    auth: 'netlify login',
    test: 'netlify status',
    config: {}
  },
  render: {
    cli: 'render',
    install: 'npm install -g render-cli',
    auth: 'render login',
    test: 'render services list',
    config: {}
  },
  appwrite: {
    cli: 'appwrite',
    install: 'npm install -g appwrite-cli',
    auth: 'appwrite login',
    test: 'appwrite projects list',
    config: {}
  }
};

// Logging function
function log(message: string, level: 'INFO' | 'ERROR' | 'SUCCESS' = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${level}: ${message}\n`;

  console.log(logMessage.trim());
  writeFileSync(LOG_FILE, logMessage, { flag: 'a' });
}

// Check if command exists
function commandExists(command: string): boolean {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Install CLI tool
async function installCLI(service: string, config: any): Promise<boolean> {
  try {
    log(`Installing ${service} CLI...`);

    if (process.platform === 'win32') {
      execSync(config.install, { stdio: 'inherit' });
    } else {
      // For other platforms, try npm global install as fallback
      execSync(`npm install -g ${config.cli}`, { stdio: 'inherit' });
    }

    log(`${service} CLI installed successfully`, 'SUCCESS');
    return true;
  } catch (error) {
    log(`Failed to install ${service} CLI: ${error}`, 'ERROR');
    return false;
  }
}

// Authenticate CLI tool
async function authenticateCLI(service: string, config: any): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      log(`Authenticating ${service} CLI...`);

      // For interactive auth, we'll need user input
      const child = spawn(config.auth.split(' ')[0], config.auth.split(' ').slice(1), {
        stdio: 'inherit',
        shell: true
      });

      child.on('close', (code) => {
        if (code === 0) {
          log(`${service} CLI authenticated successfully`, 'SUCCESS');
          resolve(true);
        } else {
          log(`${service} CLI authentication failed`, 'ERROR');
          resolve(false);
        }
      });

      // For non-interactive auth, we could use tokens from environment
      // This would require setting up tokens first

    } catch (error) {
      log(`Failed to authenticate ${service} CLI: ${error}`, 'ERROR');
      resolve(false);
    }
  });
}

// Test CLI connection
function testCLI(service: string, config: any): boolean {
  try {
    log(`Testing ${service} CLI connection...`);
    execSync(config.test, { stdio: 'pipe' });
    log(`${service} CLI connection verified`, 'SUCCESS');
    return true;
  } catch (error) {
    log(`${service} CLI test failed: ${error}`, 'ERROR');
    return false;
  }
}

// Save authentication data to database
async function saveAuthToDB(service: string, authData: any): Promise<boolean> {
  try {
    await prisma.setting.upsert({
      where: { key: `${service.toUpperCase()}_AUTH` },
      update: { value: JSON.stringify(authData) },
      create: { key: `${service.toUpperCase()}_AUTH`, value: JSON.stringify(authData) },
    });
    log(`${service} auth data saved to database`, 'SUCCESS');
    return true;
  } catch (error) {
    log(`Failed to save ${service} auth data: ${error}`, 'ERROR');
    return false;
  }
}

// Setup passive connection for a service
async function setupService(service: string): Promise<boolean> {
  const config = SERVICES[service as keyof typeof SERVICES];

  log(`\n=== Setting up ${service.toUpperCase()} ===`);

  // Check if CLI is already installed
  if (!commandExists(config.cli)) {
    log(`${service} CLI not found, installing...`);
    const installed = await installCLI(service, config);
    if (!installed) {
      log(`${service} CLI installation failed, skipping...`, 'ERROR');
      return false;
    }
  } else {
    log(`${service} CLI already installed`);
  }

  // Authenticate CLI
  const authenticated = await authenticateCLI(service, config);
  if (!authenticated) {
    log(`${service} CLI authentication failed, skipping...`, 'ERROR');
    return false;
  }

  // Test connection
  const tested = testCLI(service, config);
  if (!tested) {
    log(`${service} CLI test failed, but continuing...`, 'ERROR');
  }

  // Save auth data
  await saveAuthToDB(service, {
    cli: config.cli,
    authenticated: authenticated,
    tested: tested,
    timestamp: new Date().toISOString()
  });

  return authenticated;
}

// Main setup function
async function main() {
  try {
    // Create config directory
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }

    log('🚀 Starting Passive CLI Connections Setup');
    log('========================================');

    const results: Record<string, boolean> = {};

    // Setup each service
    for (const service of Object.keys(SERVICES)) {
      results[service] = await setupService(service);
    }

    // Summary
    log('\n=== SETUP SUMMARY ===');
    let successCount = 0;
    for (const [service, success] of Object.entries(results)) {
      const status = success ? '✅ SUCCESS' : '❌ FAILED';
      log(`${service.toUpperCase()}: ${status}`);
      if (success) successCount++;
    }

    log(`\n🎉 Setup Complete: ${successCount}/${Object.keys(SERVICES).length} services configured successfully`);

    if (successCount === Object.keys(SERVICES).length) {
      log('🎊 All passive CLI connections established successfully!');
    } else {
      log('⚠️  Some services may require manual configuration');
    }

  } catch (error) {
    log(`Setup failed: ${error}`, 'ERROR');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Interactive token setup for non-interactive auth
async function setupTokens() {
  log('🔑 Setting up authentication tokens...');

  const tokens = {
    github: process.env.GITHUB_TOKEN,
    docker: {
      user: process.env.DOCKER_HUB_USER,
      token: process.env.DOCKER_HUB_TOKEN
    },
    supabase: process.env.SUPABASE_ACCESS_TOKEN,
    vercel: process.env.VERCEL_TOKEN,
    netlify: process.env.NETLIFY_AUTH_TOKEN,
    render: process.env.RENDER_API_KEY,
    appwrite: process.env.APPWRITE_API_KEY
  };

  // Save tokens to database
  for (const [service, token] of Object.entries(tokens)) {
    if (token) {
      await saveAuthToDB(`${service}_token`, { token, timestamp: new Date().toISOString() });
      log(`${service} token saved`, 'SUCCESS');
    }
  }
}

// Run the setup
if (require.main === module) {
  // Check for token setup flag
  if (process.argv[2] === '--tokens') {
    setupTokens().catch(console.error);
  } else {
    main().catch(console.error);
  }
}

export { setupService, testCLI, authenticateCLI };