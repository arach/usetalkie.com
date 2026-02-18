#!/bin/bash
# Development configuration
# Single source of truth for ports and URLs

export MAIN_PORT=5173
export MARKETING_PORT=3100
export MAIN_URL="http://localhost:${MAIN_PORT}"
export MARKETING_URL="http://localhost:${MARKETING_PORT}"
export MARKETING_API_URL="${MARKETING_URL}/api"
