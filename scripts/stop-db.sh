#!/bin/bash

# Database Stop Script
# This script helps you stop the PostgreSQL database

echo "🛑 Stopping PostgreSQL Database..."
echo ""

# Stop database
docker-compose down

echo "✅ Database stopped"
echo ""
echo "💡 Note: Data is preserved in Docker volume"
echo "💡 To remove all data, run: docker-compose down -v"

