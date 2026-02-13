#!/bin/bash

# Deployment script for TssVPN
# This script pulls the latest code from GitHub and rebuilds the containers in production mode.

PROJECT_DIR="/root/clawd/tss"
echo "--- Starting Deployment ---"

# Change to project directory
cd "$PROJECT_DIR" || { echo "Error: Could not enter $PROJECT_DIR"; exit 1; }

# Pull latest code
echo "Updating code from GitHub..."
git pull origin main

# Build and restart containers using Docker Compose V2
echo "Rebuilding and restarting containers..."
docker compose up -d --build

# Clean up old images to save space
echo "Cleaning up old Docker images..."
docker image prune -f

echo "--- Deployment Complete ---"
echo "Check status with: docker compose ps"
