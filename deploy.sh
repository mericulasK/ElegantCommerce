#!/bin/bash

# ElegantCommerce Deployment Script
echo "🚀 Starting ElegantCommerce deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Start the production server
echo "🌟 Starting production server..."
npm run start

echo "✅ Deployment completed!"
echo "🌐 Site is now live at: http://localhost:3000"
echo "📚 API Documentation: http://localhost:3000/api"
echo "👨‍💼 Admin Panel: http://localhost:3000/admin"
