#!/bin/bash

# ===================================
# ThermoSafe IoT - Quick Start VPS
# Run this on VPS after uploading files
# ===================================

echo "========================================="
echo "  ThermoSafe IoT - Quick Start"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}⚠️  Please do not run as root${NC}"
    exit 1
fi

# Check Node.js
echo -e "${YELLOW}🔍 Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION installed${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check PM2
echo -e "${YELLOW}🔍 Checking PM2...${NC}"
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    echo -e "${GREEN}✅ PM2 $PM2_VERSION installed${NC}"
else
    echo -e "${RED}❌ PM2 not found${NC}"
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Check .env file
echo -e "${YELLOW}🔍 Checking .env file...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Creating .env from example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file and add your API keys${NC}"
    echo "Run: nano .env"
    echo ""
fi

# Create logs directory
mkdir -p logs

# Stop existing server if running
echo -e "${YELLOW}🛑 Stopping existing server...${NC}"
pm2 stop thermosafe 2>/dev/null || true
pm2 delete thermosafe 2>/dev/null || true

# Start server
echo -e "${YELLOW}🚀 Starting server...${NC}"
pm2 start ecosystem.config.json

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start server${NC}"
    exit 1
fi

# Setup PM2 startup
echo -e "${YELLOW}⚙️  Setting up auto-restart...${NC}"
pm2 startup | grep -q "sudo" && \
    echo -e "${YELLOW}⚠️  Please run the following command manually:${NC}" && \
    pm2 startup | grep "sudo" || \
    pm2 startup

pm2 save

# Check firewall
echo -e "${YELLOW}🔥 Checking firewall...${NC}"
if command -v ufw &> /dev/null; then
    sudo ufw allow 3003/tcp
    echo -e "${GREEN}✅ Port 3003 opened in firewall${NC}"
fi

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

# Display status
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✅ Setup Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}📊 Server Status:${NC}"
pm2 status
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "   Local:    http://localhost:3003"
echo "   Network:  http://$SERVER_IP:3003"
echo "   External: http://157.66.54.66:3003"
echo ""
echo -e "${BLUE}📄 Important Pages:${NC}"
echo "   Dashboard:  http://157.66.54.66:3003/dashboard.html"
echo "   Scan:       http://157.66.54.66:3003/scan.html"
echo "   Admin:      http://157.66.54.66:3003/admin.html"
echo "   Emergency:  http://157.66.54.66:3003/emergency-dashboard.html"
echo ""
echo -e "${BLUE}📋 Useful Commands:${NC}"
echo "   View logs:     pm2 logs thermosafe"
echo "   Restart:       pm2 restart thermosafe"
echo "   Stop:          pm2 stop thermosafe"
echo "   Monitor:       pm2 monit"
echo "   Status:        pm2 status"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to configure .env file with your API keys!${NC}"
echo ""
