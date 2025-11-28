const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: './telegram-config.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users for chat
const connectedUsers = new Map();
const chatHistory = [];

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log(`🔌 User connected to chat: ${socket.id}`);

    // User joins chat
    socket.on('join-chat', (userData) => {
        const user = {
            id: socket.id,
            name: userData.name || 'Anonymous',
            role: userData.role || 'user',
            timestamp: new Date().toISOString()
        };
        
        connectedUsers.set(socket.id, user);
        
        // Notify all users about new connection
        socket.broadcast.emit('user-joined', {
            user: user,
            onlineCount: connectedUsers.size
        });
        
        // Send current online users to new user
        socket.emit('online-users', Array.from(connectedUsers.values()));
        
        // Send chat history to new user
        socket.emit('chat-history', chatHistory.slice(-20));
        
        console.log(`👤 ${user.name} (${user.role}) joined service chat`);
    });

    // Handle chat messages
    socket.on('chat-message', (messageData) => {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        const message = {
            id: Date.now(),
            user: user.name,
            role: user.role,
            message: messageData.message,
            timestamp: new Date().toISOString(),
            type: messageData.type || 'text'
        };

        // Add to chat history
        chatHistory.push(message);
        
        // Keep only last 100 messages
        if (chatHistory.length > 100) {
            chatHistory.shift();
        }

        // Broadcast message to all users
        io.emit('new-message', message);
        
        console.log(`💬 Service Chat - ${user.name}: ${messageData.message}`);
    });

    // Handle typing indicators
    socket.on('typing', (isTyping) => {
        const user = connectedUsers.get(socket.id);
        if (!user) return;

        socket.broadcast.emit('user-typing', {
            user: user.name,
            isTyping: isTyping
        });
    });


    // Handle user disconnect
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            connectedUsers.delete(socket.id);
            
            // Notify all users about disconnection
            socket.broadcast.emit('user-left', {
                user: user,
                onlineCount: connectedUsers.size
            });
            
            console.log(`👋 ${user.name} left service chat`);
        }
    });
});

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Validasi konfigurasi
if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN tidak dikonfigurasi!');
    console.warn('📝 Edit file telegram-config.env dengan Token Bot yang benar');
}

if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
    console.warn('⚠️ TELEGRAM_CHAT_ID tidak dikonfigurasi!');
    console.warn('📝 Edit file telegram-config.env dengan Chat ID yang benar');
}

// Emergency Contacts (untuk logging)
const emergencyContacts = [
    { name: 'Petugas Utama', phone: '+628814554581' },
    { name: 'Petugas Backup 1', phone: '+6288362272732' },
    { name: 'Petugas Backup 2', phone: '+6288647356283' }
];

// Telegram API URL
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Routes
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Telegram Emergency Bot Server Running',
        contacts: emergencyContacts.length,
        botConfigured: TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE',
        chatUsers: connectedUsers.size,
        chatMessages: chatHistory.length
    });
});

app.get('/chat-history', (req, res) => {
    res.json({
        status: 'OK',
        messages: chatHistory.slice(-50), // Last 50 messages
        totalMessages: chatHistory.length,
        onlineUsers: connectedUsers.size
    });
});

app.get('/telegram-status', async (req, res) => {
    try {
        if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
            return res.status(400).json({
                success: false,
                error: 'TELEGRAM_BOT_TOKEN tidak dikonfigurasi',
                configured: false
            });
        }
        
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`;
        const response = await axios.get(telegramApiUrl);
        
        res.json({
            success: true,
            bot: response.data.result,
            chatId: TELEGRAM_CHAT_ID,
            configured: true
        });
    } catch (error) {
        console.error('❌ Telegram status error:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            error: error.response ? error.response.data.description : error.message,
            configured: false
        });
    }
});

app.post('/send-emergency-telegram', async (req, res) => {
    try {
        const currentTime = new Date().toLocaleString('id-ID', {
            dateStyle: 'full',
            timeStyle: 'long',
            timeZone: 'Asia/Jakarta'
        });
        
        const emergencyMessage = `
🚨 *EMERGENCY ALERT* 🚨

📍 *Lokasi:* SMK MARHAS Margahayu
🏢 *Alamat:* Jl. Raya Margahayu No.186, Margahayu, Kec. Margahayu, Kabupaten Bandung, Jawa Barat

⏰ *Waktu:* ${currentTime}

🗺️ *Koordinat GPS:*
• Latitude: -6.9759367
• Longitude: 107.5704834

🔗 *Google Maps:* https://maps.app.goo.gl/iUSHhmnRQdGKwj8x8

🚨 *SEGERA LAKUKAN TINDAKAN DARURAT!*

👥 *Petugas yang akan diberitahu:*
${emergencyContacts.map(c => `• ${c.name}: ${c.phone}`).join('\n')}

---
🤖 *Pesan otomatis dari Emergency Hotline System*
📱 *Kiosk SMK MARHAS Margahayu*
        `;
        
        // Kirim pesan ke grup Telegram
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const telegramResponse = await axios.post(telegramApiUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: emergencyMessage,
            parse_mode: 'Markdown',
            disable_notification: false // Pastikan notifikasi aktif
        });
        
        // Log hasil pengiriman
        console.log('📱 Telegram message sent:', telegramResponse.data.result.message_id);
        
        res.json({
            success: true,
            successCount: 1,
            totalContacts: emergencyContacts.length,
            messageId: telegramResponse.data.result.message_id,
            chatId: TELEGRAM_CHAT_ID,
            timestamp: currentTime,
            results: emergencyContacts.map(contact => ({
                success: true,
                contact: contact.name,
                phone: contact.phone,
                method: 'Telegram Group',
                messageId: telegramResponse.data.result.message_id
            }))
        });
        
    } catch (error) {
        console.error('❌ Telegram send error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data?.description || error.message,
            details: error.response?.data
        });
    }
});

app.post('/send-test-telegram', async (req, res) => {
    try {
        const currentTime = new Date().toLocaleString('id-ID');
        
        const testMessage = `
🧪 *TEST TELEGRAM BOT* 🧪

📍 *Lokasi:* SMK MARHAS Margahayu
⏰ *Waktu:* ${currentTime}

✅ *Ini adalah pesan TEST dari Emergency Hotline System*

👥 *Petugas yang akan diberitahu:*
${emergencyContacts.map(c => `• ${c.name}: ${c.phone}`).join('\n')}

---
🤖 *Pesan test otomatis dari Emergency Hotline System*
📱 *Kiosk SMK MARHAS Margahayu*
        `;
        
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const telegramResponse = await axios.post(telegramApiUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: testMessage,
            parse_mode: 'Markdown',
            disable_notification: false
        });
        
        res.json({
            success: true,
            messageId: telegramResponse.data.result.message_id,
            message: 'Test message sent successfully!',
            timestamp: currentTime
        });
        
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.response?.data?.description || error.message 
        });
    }
});

server.listen(PORT, () => {
    console.log('🚀 Telegram Emergency Bot Server started!');
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`🤖 Telegram Bot Token: ${TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE' ? 'Configured ✅' : 'NOT CONFIGURED ❌'}`);
    console.log(`💬 Telegram Chat ID: ${TELEGRAM_CHAT_ID && TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID_HERE' ? 'Configured ✅' : 'NOT CONFIGURED ❌'}`);
    console.log(`👥 Emergency Contacts: ${emergencyContacts.length}`);
    console.log(`💬 WebSocket Chat: Ready ✅`);
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   GET  /health - Health check');
    console.log('   GET  /telegram-status - Check bot status');
    console.log('   POST /send-emergency-telegram - Send emergency alert');
    console.log('   POST /send-test-telegram - Send test message');
    console.log('   GET  /chat-history - Get chat history');
    console.log('');
    console.log('🔌 WebSocket events:');
    console.log('   join-chat - Join service chat');
    console.log('   chat-message - Send message');
    console.log('   typing - Typing indicator');
    console.log('');
    
    if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
        console.log('⚠️  PERHATIAN: TELEGRAM_BOT_TOKEN belum dikonfigurasi!');
        console.log('📝 Edit file telegram-config.env dengan Token Bot yang benar');
    }
    
    if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        console.log('⚠️  PERHATIAN: TELEGRAM_CHAT_ID belum dikonfigurasi!');
        console.log('📝 Edit file telegram-config.env dengan Chat ID yang benar');
    }
    
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE' && 
        TELEGRAM_CHAT_ID && TELEGRAM_CHAT_ID !== 'YOUR_CHAT_ID_HERE') {
        console.log('✅ Server ready to handle Telegram emergency alerts!');
    } else {
        console.log('⚠️  Server running but Telegram Bot not fully configured');
    }
});
