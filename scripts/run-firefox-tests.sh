#!/bin/bash

echo "Running Firefox tests with optimized settings..."

# Set environment variables for stability (removed problematic PLAYWRIGHT_BROWSERS_PATH)
export PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW=1

# Check if specific project is provided
if [ $# -eq 0 ]; then
    echo "Running all Firefox projects..."
    npx playwright test --project=firefox-1920x1080 --project=firefox-1366x768 --workers=1 --reporter=line
elif [ "$1" = "1920" ]; then
    echo "Running Firefox 1920x1080 tests..."
    npx playwright test --project=firefox-1920x1080 --workers=1 --reporter=line
elif [ "$1" = "1366" ]; then
    echo "Running Firefox 1366x768 tests..."
    npx playwright test --project=firefox-1366x768 --workers=1 --reporter=line
else
    echo "Running tests for project: $1"
    npx playwright test --project="$1" --workers=1 --reporter=line
fi

echo "Firefox tests completed." 