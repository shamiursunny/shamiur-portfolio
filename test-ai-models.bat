@echo off
echo 🤖 Starting AI Models Integration Test...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo 📋 Testing AI Models Integration...
echo ================================
echo.

REM Run the TypeScript test script
echo Running comprehensive AI models test...
npx tsx scripts/test-ai-models-integration.ts

echo.
echo ✅ Test completed!
echo.
pause
