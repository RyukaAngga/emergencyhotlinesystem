#!/bin/bash

# ===================================
# ThermoSafe IoT - VPS Deploy Script
# ===================================

echo "========================================="
echo "  ThermoSafe IoT - Deploy to VPS"
echo "========================================="
echo ""

# VPS Configuration
VPS_IP="157.66.54.66"
VPS_PORT="3022"
VPS_USER="ubuntu"
VPS_PATH="~/projeklomba"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Deploying to VPS...${NC}"
echo "IP: $VPS_IP"
echo "Port: $VPS_PORT"
echo "User: $VPS_USER"
echo ""

# Upload files
echo -e "${YELLOW}📤 Uploading files...${NC}"
scp -P $VPS_PORT -r \
    *.html \
    *.js \
    *.json \
    *.md \
    assets \
    alarm \
    weights \
    $VPS_USER@$VPS_IP:$VPS_PATH/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to upload files${NC}"
    exit 1
fi

# Restart server via SSH
echo -e "${YELLOW}🔄 Restarting server...${NC}"
ssh -p $VPS_PORT $VPS_USER@$VPS_IP "cd $VPS_PATH && pm2 restart thermosafe"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server restarted successfully${NC}"
else
    echo -e "${RED}❌ Failed to restart server${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  ✅ Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "🌐 Access your application at:"
echo "   http://$VPS_IP:3003/dashboard.html"
echo ""
echo "📊 Check logs with:"
echo "   ssh -p $VPS_PORT $VPS_USER@$VPS_IP 'pm2 logs thermosafe'"
echo ""
