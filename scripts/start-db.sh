#!/bin/bash

# Database Startup Script
# This script helps you start the PostgreSQL database using Docker

echo "🚀 Starting PostgreSQL Database..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "💡 Please start Docker Desktop first"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start database
echo "📦 Starting database container..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if database is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Database is running!"
    echo ""
    echo "📊 Database Details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: medical_db"
    echo "   Username: postgres"
    echo "   Password: postgres"
    echo ""
    echo "🔗 Connection String:"
    echo "   postgresql://postgres:postgres@localhost:5432/medical_db?sslmode=disable"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Update .env file with the connection string above"
    echo "   2. Run: npm run prisma:migrate"
    echo "   3. Run: npm run test:db"
    echo "   4. Run: npm run dev"
else
    echo "❌ Database failed to start"
    echo "💡 Check logs: docker-compose logs postgres"
    exit 1
fi

