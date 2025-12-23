# AI Models Integration Test Script
# Compatible with PowerShell 5.1 and later

Write-Host "🤖 Starting AI Models Integration Test..." -ForegroundColor Green
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 Testing AI Models Integration..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Run the TypeScript test script
Write-Host "Running comprehensive AI models test..." -ForegroundColor Yellow
try {
    npx tsx scripts/test-ai-models-integration.ts
    Write-Host ""
    Write-Host "✅ Test completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Test failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
