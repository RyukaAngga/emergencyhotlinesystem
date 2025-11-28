# 🏗️ ARSITEKTUR SISTEM VPS

## Diagram Deployment

```
┌──────────────────────────────────────────────────────────────────┐
│                         INTERNET                                  │
│                  (Accessible from anywhere)                       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ HTTP Port 3003
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                     VPS SERVER                                    │
│                   157.66.54.66                                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              PM2 Process Manager                         │    │
│  │                                                          │    │
│  │  ┌────────────────────────────────────────────────┐    │    │
│  │  │         ThermoSafe Server (Node.js)            │    │    │
│  │  │              server.js                         │    │    │
│  │  │                                                │    │    │
│  │  │  • Express HTTP Server (port 3003)            │    │    │
│  │  │  • Socket.IO (Real-time Chat)                 │    │    │
│  │  │  • WebSocket (OpenAI Realtime)                │    │    │
│  │  │  • REST API Endpoints                         │    │    │
│  │  │  • Static File Serving                        │    │    │
│  │  │                                                │    │    │
│  │  │  Binding: 0.0.0.0:3003 (all interfaces)       │    │    │
│  │  └────────────────────────────────────────────────┘    │    │
│  │                                                          │    │
│  │  Auto-restart: ✅  Monitoring: ✅  Logs: ✅             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 UFW Firewall                             │    │
│  │                                                          │    │
│  │  Port 3003 (TCP): ✅ OPEN                               │    │
│  │  Port 3022 (SSH): ✅ OPEN                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS/SSL (External APIs)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │   Telegram   │  │    OpenAI    │
│   Database   │  │     Bot      │  │   Realtime   │
│              │  │  Messaging   │  │      API     │
│  PostgreSQL  │  │              │  │              │
│   Storage    │  │  Notifikasi  │  │  AI Voice    │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🔌 Port Configuration

| Port | Protocol | Service | Access |
|------|----------|---------|--------|
| **3003** | HTTP | ThermoSafe Web Server | Public (0.0.0.0) |
| **3022** | SSH | VPS Remote Access | SSH Only |
| 3004 | HTTP | Chat Server (Optional) | If enabled |

---

## 📦 Components Stack

```
┌───────────────────────────────────────┐
│         Frontend (HTML/JS)            │
│                                       │
│  • dashboard.html                    │
│  • scan.html                         │
│  • admin.html                        │
│  • emergency-dashboard.html          │
│  • chat.html                         │
│  • analytics.html                    │
└──────────────┬────────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼────────────────────────┐
│         Backend (Node.js)             │
│                                       │
│  • Express.js (REST API)             │
│  • Socket.IO (Real-time)             │
│  • WebSocket (AI Voice)              │
│  • File Serving                      │
└──────────────┬────────────────────────┘
               │ API Calls
┌──────────────▼────────────────────────┐
│       External Services               │
│                                       │
│  • Supabase (Database)               │
│  • Telegram (Notifications)          │
│  • OpenAI (AI Assistant)             │
│  • OpenRouter (Chat AI)              │
└───────────────────────────────────────┘
```

---

## 🌐 Network Flow

### User Request Flow:
```
User Browser
    │
    │ HTTP Request
    │ http://157.66.54.66:3003/dashboard.html
    │
    ▼
Internet
    │
    ▼
VPS Public IP (157.66.54.66)
    │
    ▼
UFW Firewall (Port 3003 ✅)
    │
    ▼
Node.js Server (0.0.0.0:3003)
    │
    ├──► Static HTML Files
    ├──► REST API Endpoints
    ├──► Socket.IO Events
    └──► WebSocket Proxy
    │
    ▼
Response to User
```

### Emergency Alert Flow:
```
User clicks Emergency Button
    │
    ▼
JavaScript POST to /send-emergency
    │
    ▼
Server.js receives request
    │
    ├──► Save to Supabase Database
    ├──► Send to Telegram Bot
    └──► Broadcast via Socket.IO
    │
    ▼
All connected clients receive real-time update
```

---

## 📁 Directory Structure (VPS)

```
~/projeklomba/
│
├── server.js                    # Main server file
├── telegram-server.js           # Telegram-specific server
├── package.json                 # Dependencies
├── ecosystem.config.json        # PM2 configuration
├── .env                         # Environment variables (CREATED)
├── .env.example                 # Environment template
│
├── Frontend Files/
│   ├── dashboard.html
│   ├── scan.html
│   ├── admin.html
│   ├── emergency-dashboard.html
│   ├── chat.html
│   └── analytics.html
│
├── Assets/
│   ├── assets/
│   │   ├── fonts/
│   │   ├── icons/
│   │   ├── images/
│   │   └── models/
│   ├── alarm/
│   └── weights/
│
├── Documentation/
│   ├── VPS_DEPLOYMENT_GUIDE.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── QUICK_COMMANDS.md
│   ├── TROUBLESHOOTING.md
│   └── VPS_SETUP_SUMMARY.md
│
└── logs/                        # PM2 logs (auto-created)
    ├── out.log
    └── err.log
```

---

## 🔄 Process Management

```
System Boot
    │
    ▼
systemd starts PM2
    │
    ▼
PM2 reads saved process list
    │
    ▼
PM2 starts thermosafe from ecosystem.config.json
    │
    ▼
Node.js executes server.js
    │
    ├──► Load environment (.env)
    ├──► Initialize Express
    ├──► Setup Socket.IO
    ├──► Connect to Supabase
    ├──► Load initial data
    └──► Start listening on 0.0.0.0:3003
    │
    ▼
Server Ready ✅

If crash/error occurs:
    │
    ▼
PM2 auto-restarts
    │
    ▼
Max 10 restarts with 10s min uptime
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────┐
│   1. VPS Provider Firewall          │  ← Cloud level
├─────────────────────────────────────┤
│   2. Ubuntu UFW Firewall            │  ← OS level
├─────────────────────────────────────┤
│   3. Application Auth (Supabase)    │  ← App level
├─────────────────────────────────────┤
│   4. API Keys (.env)                │  ← Config level
└─────────────────────────────────────┘
```

---

## 📊 Data Flow

### Face Scan Process:
```
Camera Capture
    │
    ▼
Face Detection (face-api.js)
    │
    ▼
Send to Backend (/api endpoint)
    │
    ▼
Server Process
    │
    ├──► Save to Supabase
    ├──► Telegram Alert (if emergency)
    └──► Socket.IO broadcast
    │
    ▼
Update Dashboard (real-time)
```

### Chat System:
```
User types message
    │
    ▼
Socket.IO emit 'send-message'
    │
    ▼
Server receives via Socket.IO
    │
    ├──► Store in memory (chatHistory)
    └──► Broadcast to all clients
    │
    ▼
All users see message instantly
```

---

## 🎯 Deployment Architecture Benefits

### ✅ Current Setup:
- **Simple**: Pure HTTP, no SSL complexity
- **Accessible**: 0.0.0.0 binding = accessible from anywhere
- **Reliable**: PM2 auto-restart on crash
- **Persistent**: PM2 startup = auto-start on VPS reboot
- **Monitored**: PM2 logs + monitoring
- **Scalable**: Easy to add more instances with PM2 cluster mode

### 🚀 Future Enhancements (Optional):
- Add Nginx reverse proxy
- Add SSL/TLS with Let's Encrypt
- Add CDN for static assets
- Add Redis for caching
- Add load balancer for multiple instances
- Add monitoring with Grafana

---

## 📈 Resource Usage (Estimated)

```
CPU:     ~ 2-5% (idle)
         ~ 10-20% (active use)

Memory:  ~ 50-100 MB (base)
         ~ 100-200 MB (with users)

Disk:    ~ 200-500 MB (app + dependencies)

Network: ~ 1-5 Mbps (typical)
         ~ 10-50 Mbps (peak)
```

---

**Architecture Version**: 1.0  
**Last Updated**: November 2025  
**Status**: Production Ready ✅
