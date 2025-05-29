#!/bin/bash

echo "🔥 Running Firefox tests with CI-optimized settings..."

# Set environment variables for CI stability
export PLAYWRIGHT_CHROMIUM_USE_HEADLESS_NEW=1
export PWTEST_SKIP_TEST_OUTPUT=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Function to run tests with retry logic
run_firefox_tests() {
    local project=$1
    local max_attempts=3
    local attempt=1
    
    echo "🚀 Starting $project tests (attempt $attempt/$max_attempts)..."
    
    while [ $attempt -le $max_attempts ]; do
        echo "📋 Attempt $attempt for $project..."
        
        if npx playwright test --project="$project" --workers=1 --reporter=line --timeout=150000; then
            echo "✅ $project tests completed successfully!"
            return 0
        else
            echo "❌ $project tests failed on attempt $attempt"
            
            if [ $attempt -eq $max_attempts ]; then
                echo "💥 $project tests failed after $max_attempts attempts"
                return 1
            else
                echo "⏳ Waiting 10 seconds before retry..."
                sleep 10
                attempt=$((attempt + 1))
            fi
        fi
    done
}

# Check if specific project is provided
if [ $# -eq 0 ]; then
    echo "🎯 Running all Firefox projects with retry logic..."
    
    # Run projects sequentially with retries
    if run_firefox_tests "firefox-1920x1080"; then
        echo "✅ Firefox 1920x1080 completed successfully"
    else
        echo "❌ Firefox 1920x1080 failed after all retries"
        exit 1
    fi
    
    echo "⏳ Waiting 5 seconds between projects..."
    sleep 5
    
    if run_firefox_tests "firefox-1366x768"; then
        echo "✅ Firefox 1366x768 completed successfully"
    else
        echo "❌ Firefox 1366x768 failed after all retries"
        exit 1
    fi
    
elif [ "$1" = "1920" ]; then
    echo "🎯 Running Firefox 1920x1080 tests with retry logic..."
    run_firefox_tests "firefox-1920x1080"
elif [ "$1" = "1366" ]; then
    echo "🎯 Running Firefox 1366x768 tests with retry logic..."
    run_firefox_tests "firefox-1366x768"
else
    echo "🎯 Running tests for project: $1 with retry logic..."
    run_firefox_tests "$1"
fi

echo "🏁 Firefox test execution completed." 