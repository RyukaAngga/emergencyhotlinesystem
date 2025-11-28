/**
 * ========================================
 * EMERGENCY HOTLINE INTEGRATED SERVER
 * SMK MARHAS Margahayu
 * ========================================
 * 
 * Server utama yang mengintegrasikan:
 * - Telegram Bot Notification System
 * - Real-time Chat System
 * - Emergency Alert System
 * - Face Recognition Integration
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const WebSocket = require('ws');
require('dotenv').config({ path: './.env' });

// ========================================
// SUPABASE SETUP
// ========================================
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

console.log('✅ Supabase initialized:', process.env.SUPABASE_URL);

// ========================================
// SERVER SETUP
// ========================================
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3003;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-sonnet-4.5';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Log environment info
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🚂 Railway Domain:', process.env.RAILWAY_PUBLIC_DOMAIN || 'N/A');

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ========================================
// ROOT ROUTE - Homepage
// ========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// ========================================
// DATA STORAGE
// ========================================
const connectedUsers = new Map();
const chatHistory = [];
const emergencyAlerts = [];

// ========================================
// TELEGRAM FUNCTIONS
// ========================================

/**
 * Kirim pesan ke Telegram
 */
async function sendTelegramMessage(message) {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Telegram message sent successfully');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Error sending Telegram message:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Kirim foto ke Telegram
 */
async function sendTelegramPhoto(photoUrl, caption) {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/sendPhoto`, {
            chat_id: TELEGRAM_CHAT_ID,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Telegram photo sent successfully');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Error sending Telegram photo:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Kirim lokasi ke Telegram
 */
async function sendTelegramLocation(latitude, longitude) {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/sendLocation`, {
            chat_id: TELEGRAM_CHAT_ID,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        });
        
        console.log('✅ Telegram location sent successfully');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Error sending Telegram location:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Kirim audio file ke Telegram (Emergency Alarm)
 */
async function sendTelegramAudio(audioPath, caption) {
    try {
        const FormData = require('form-data');
        const fs = require('fs');
        
        const form = new FormData();
        form.append('chat_id', TELEGRAM_CHAT_ID);
        form.append('audio', fs.createReadStream(audioPath));
        form.append('caption', caption);
        form.append('title', '🚨 Emergency Alarm');
        form.append('performer', 'Emergency Alert System');
        
        const response = await axios.post(`${TELEGRAM_API_URL}/sendAudio`, form, {
            headers: form.getHeaders()
        });
        
        console.log('🔊 Telegram audio sent successfully');
        return { success: true, data: response.data };
    } catch (error) {
        console.error('❌ Error sending Telegram audio:', error.message);
        return { success: false, error: error.message };
    }
}

// ========================================
// REST API ROUTES
// ========================================

/**
 * Health Check
 */
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        server: 'Emergency Hotline Integrated Server',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        railwayDomain: process.env.RAILWAY_PUBLIC_DOMAIN || null,
        timestamp: new Date().toISOString(),
        stats: {
            connectedUsers: connectedUsers.size,
            totalMessages: chatHistory.length,
            totalAlerts: emergencyAlerts.length
        }
    });
});

/**
 * OpenAI Realtime API - Session Token Generation
 * Generate ephemeral token for client-side WebSocket connection
 */
app.post('/api/openai-session', async (req, res) => {
    try {
        if (!OPENAI_API_KEY) {
            return res.status(500).json({ 
                success: false, 
                error: 'OpenAI API key not configured' 
            });
        }

        console.log('🎙️ Generating OpenAI Realtime session token...');

        // Generate ephemeral session token
        const response = await axios.post('https://api.openai.com/v1/realtime/sessions', {
            model: 'gpt-4o-realtime-preview-2024-12-17',
            voice: 'alloy',
            instructions: `Kamu adalah asisten AI pertolongan pertama untuk SMK MARHAS Margahayu. 
Tugasmu adalah memberikan panduan pertolongan pertama yang akurat, jelas, dan mudah dipahami dalam bahasa Indonesia.

PENTING:
- Jawab HANYA dalam bahasa Indonesia
- Berikan langkah-langkah yang praktis dan mudah diikuti
- Selalu ingatkan untuk menghubungi layanan darurat (112/119) untuk kasus serius
- Jika pertanyaan di luar topik pertolongan pertama, arahkan kembali dengan sopan
- Jawaban harus singkat (maksimal 200 kata), jelas, dan to the point
- Gunakan format numbered list untuk langkah-langkah
- Jangan gunakan istilah medis yang terlalu teknis

Topik yang kamu kuasai:
- Pertolongan pertama dasar (DRS ABC)
- Penanganan luka, perdarahan, luka bakar
- CPR dan resusitasi
- Penanganan patah tulang, pingsan, tersedak
- Keracunan
- Nomor darurat Indonesia`
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const sessionData = response.data;
        
        console.log('✅ OpenAI session token generated');

        res.json({
            success: true,
            client_secret: sessionData.client_secret.value,
            expires_at: sessionData.client_secret.expires_at
        });

    } catch (error) {
        console.error('❌ Error generating OpenAI session token:', error.response?.data || error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null
        });
    }
});

/**
 * AI Assistant Endpoint - OpenRouter Proxy
 * RESTORED - Using OpenRouter
 */
app.post('/api/ai-assistant', async (req, res) => {
    try {
        const { question, conversationHistory } = req.body;

        if (!question) {
            return res.status(400).json({ 
                success: false, 
                error: 'Question is required' 
            });
        }

        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({ 
                success: false, 
                error: 'OpenRouter API key not configured' 
            });
        }

        console.log('🤖 AI Assistant request:', question);

        // System prompt untuk AI
        const systemPrompt = {
            role: 'system',
            content: `Kamu adalah asisten AI pertolongan pertama untuk SMK MARHAS Margahayu. 
Tugasmu adalah memberikan panduan pertolongan pertama yang akurat, jelas, dan mudah dipahami dalam bahasa Indonesia.

PENTING:
- Jawab HANYA dalam bahasa Indonesia
- Berikan langkah-langkah yang praktis dan mudah diikuti
- Selalu ingatkan untuk menghubungi layanan darurat (112/119) untuk kasus serius
- Jika pertanyaan di luar topik pertolongan pertama, arahkan kembali dengan sopan
- Jawaban harus singkat (maksimal 200 kata), jelas, dan to the point
- Gunakan format numbered list untuk langkah-langkah
- Jangan gunakan istilah medis yang terlalu teknis

Topik yang kamu kuasai:
- Pertolongan pertama dasar (DRS ABC)
- Penanganan luka, perdarahan, luka bakar
- CPR dan resusitasi
- Penanganan patah tulang, pingsan, tersedak
- Keracunan
- Nomor darurat Indonesia
- Isi kotak P3K`
        };

        // Build messages array
        const messages = [systemPrompt];
        
        // Add conversation history if provided
        if (conversationHistory && Array.isArray(conversationHistory)) {
            messages.push(...conversationHistory);
        }

        // Add current question
        messages.push({
            role: 'user',
            content: question
        });

        // Call OpenRouter API
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: OPENROUTER_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': `${req.protocol}://${req.get('host')}`,
                'X-Title': 'Emergency Hotline System - SMK MARHAS',
                'Content-Type': 'application/json'
            }
        });

        const aiAnswer = response.data.choices[0].message.content;
        
        console.log('✅ AI Response:', aiAnswer.substring(0, 100) + '...');

        res.json({
            success: true,
            answer: aiAnswer,
            model: OPENROUTER_MODEL
        });

    } catch (error) {
        console.error('❌ Error calling OpenRouter AI:', error.message);
        
        res.status(500).json({
            success: false,
            error: error.message,
            details: error.response?.data || null
        });
    }
});

/**
 * Get Chat History
 */
app.get('/chat-history', (req, res) => {
    res.json({
        status: 'OK',
        messages: chatHistory.slice(-50)
    });
});

/**
 * Get Emergency Alerts
 */
app.get('/emergency-alerts', (req, res) => {
    res.json({
        status: 'OK',
        alerts: emergencyAlerts.slice(-20)
    });
});

/**
 * Send Emergency Alert
 */
app.post('/send-emergency', async (req, res) => {
    try {
        const { 
            type, 
            message, 
            location, 
            userName, 
            userPhoto, 
            emergencyButtonPressed,
            accidentType,
            scanId,
            scanPhoto,
            bodyTemperature
        } = req.body;
        
        console.log('📥 Received emergency request:');
        console.log('   - Type:', type);
        console.log('   - AccidentType:', accidentType);
        console.log('   - EmergencyButton:', emergencyButtonPressed);
        console.log('   - UserName:', userName);
        console.log('   - ScanId:', scanId);
        console.log('   - BodyTemperature:', bodyTemperature);
        
        console.log('📸 Server received photo data:', { 
            userPhoto: userPhoto ? userPhoto.substring(0, 50) + '...' : null, 
            scanPhoto: scanPhoto ? scanPhoto.substring(0, 50) + '...' : null,
            scanId 
        });
        
        if (!type || !message) {
            return res.status(400).json({
                success: false,
                error: 'Type and message are required'
            });
        }

        // Determine accident type icon for Telegram
        const typeIcons = {
            medical: '🏥',
            fire: '🔥',
            crime: '🚨',
            accident: '🚗',
            other: '⚠️'
        };
        
        const typeNames = {
            medical: 'MEDIS',
            fire: 'KEBAKARAN',
            crime: 'KRIMINAL',
            accident: 'KECELAKAAN',
            other: 'LAINNYA'
        };
        
        const icon = typeIcons[accidentType] || '🚨';
        const typeName = typeNames[accidentType] || 'LAINNYA';
        
        console.log('🎯 Processing emergency - Raw type:', accidentType, '| Display:', typeName);

        // Format pesan untuk Telegram dengan mention
        const emergencyMessage = `
🚨🚨🚨 <b>EMERGENCY ALERT</b> 🚨🚨🚨

${emergencyButtonPressed ? '🔴 <b>EMERGENCY BUTTON ACTIVATED!</b>\n' : ''}
🔊 <b>SEGERA TANGANI DARURAT!</b>

━━━━━━━━━━━━━━━━━━
${icon} <b>Tipe Emergency:</b> ${typeName}
💬 <b>Pesan:</b> ${message}
👤 <b>Pengirim:</b> ${userName || 'Anonymous'}
${scanId ? `🆔 <b>Scan ID:</b> ${scanId}` : ''}
🕐 <b>Waktu:</b> ${new Date().toLocaleString('id-ID')}
📍 <b>Lokasi:</b> ${process.env.LOCATION_NAME || 'SMK MARHAS Margahayu'}

━━━━━━━━━━━━━━━━━━
�️ <b>Alamat:</b>
${process.env.LOCATION_ADDRESS || 'Jl. Raya Margahayu No.186, Bandung'}

${location ? `� <b>Koordinat:</b> ${location.latitude}, ${location.longitude}` : ''}

━━━━━━━━━━━━━━━━━━
⚠️ <b>PERHATIAN!</b>
Segera buka Emergency Dashboard untuk melihat detail dan menangani kasus ini!

🔴 Status: <b>ACTIVE - BUTUH PENANGANAN SEGERA</b>
        `.trim();

        // Kirim pesan ke Telegram
        const telegramResult = await sendTelegramMessage(emergencyMessage);

        // Kirim lokasi jika ada
        if (location && location.latitude && location.longitude) {
            await sendTelegramLocation(location.latitude, location.longitude);
        }

        // Simpan alert dengan flag emergency button
        const alert = {
            id: Date.now(),
            type,
            message,
            userName: userName || 'Anonymous',
            userPhoto,
            location,
            timestamp: new Date().toISOString(),
            telegramSent: telegramResult.success,
            emergencyButtonPressed: emergencyButtonPressed === true,
            accidentType: accidentType || 'other',
            scanId: scanId || null,
            scanPhoto: scanPhoto || userPhoto || null,
            bodyTemperature: bodyTemperature || null,
            status: 'active',
            responseTime: null,
            respondedBy: null,
            handledAt: null,
            notes: ''
        };
        
        // Save to Supabase database
        try {
            const { data: dbData, error: dbError } = await supabase
                .from('emergency_alerts')
                .insert([{
                    alert_id: alert.id.toString(),
                    type: alert.type,
                    message: alert.message,
                    user_name: alert.userName,
                    user_photo: alert.userPhoto,
                    location: alert.location,
                    timestamp: alert.timestamp,
                    telegram_sent: alert.telegramSent,
                    emergency_button_pressed: alert.emergencyButtonPressed,
                    accident_type: alert.accidentType,
                    scan_id: alert.scanId,
                    scan_photo: alert.scanPhoto,
                    body_temperature: alert.bodyTemperature,
                    status: alert.status,
                    response_time: alert.responseTime,
                    responded_by: alert.respondedBy,
                    handled_at: alert.handledAt,
                    notes: alert.notes
                }])
                .select();
            
            if (dbError) {
                console.error('⚠️ Error saving to database:', dbError);
            } else {
                console.log('✅ Emergency alert saved to database:', dbData);
            }
            
            // UPDATE face_scans table jika ada scanId
            if (scanId) {
                console.log(`🔄 Updating face_scans for scanId: ${scanId} to emergency status`);
                
                // Cari record berdasarkan scanid
                const { data: scanData, error: scanError } = await supabase
                    .from('face_scans')
                    .update({
                        isemergency: true,
                        usernote: `Emergency: ${typeName} (Button pressed at ${new Date().toLocaleString('id-ID')})`
                    })
                    .eq('scanid', scanId)
                    .select();
                
                if (scanError) {
                    console.error('⚠️ Error updating face_scans:', scanError);
                } else if (scanData && scanData.length > 0) {
                    console.log('✅ face_scans updated successfully:', scanData);
                } else {
                    console.warn('⚠️ No face_scans record found with scanId:', scanId);
                }
            } else {
                console.log('ℹ️ No scanId provided - emergency alert created without face scan reference');
            }
        } catch (dbErr) {
            console.error('⚠️ Database error:', dbErr);
        }
        
        emergencyAlerts.push(alert);

        // Broadcast ke semua client
        console.log('📡 Broadcasting emergency-alert to all clients:', {
            id: alert.id,
            accidentType: alert.accidentType,
            userName: alert.userName,
            timestamp: alert.timestamp
        });
        io.emit('emergency-alert', alert);

        res.json({
            success: true,
            message: 'Emergency alert sent successfully',
            alert: alert,
            telegram: telegramResult
        });

    } catch (error) {
        console.error('Error sending emergency:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Send Telegram Message (Generic)
 */
app.post('/send-telegram', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        const result = await sendTelegramMessage(message);
        
        res.json(result);
    } catch (error) {
        console.error('Error in /send-telegram:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Test Telegram Connection
 */
app.get('/test-telegram', async (req, res) => {
    try {
        const testMessage = `
🔔 <b>Test Notification</b>

Sistem Emergency Hotline berhasil terhubung!
Waktu: ${new Date().toLocaleString('id-ID')}
Lokasi: ${process.env.LOCATION_NAME || 'SMK MARHAS Margahayu'}

✅ Server berjalan dengan baik!
        `.trim();

        const result = await sendTelegramMessage(testMessage);
        
        res.json({
            success: result.success,
            message: result.success ? 'Test message sent to Telegram' : 'Failed to send test message',
            details: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get Telegram Status
 */
app.get('/telegram-status', async (req, res) => {
    try {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            return res.json({
                success: false,
                configured: false,
                error: 'Telegram Bot Token atau Chat ID belum dikonfigurasi'
            });
        }

        // Test connection to Telegram
        const response = await axios.get(`${TELEGRAM_API_URL}/getMe`);
        
        res.json({
            success: true,
            configured: true,
            bot: response.data.result,
            chatId: TELEGRAM_CHAT_ID
        });
    } catch (error) {
        res.json({
            success: false,
            configured: true,
            error: error.message
        });
    }
});

/**
 * Send Emergency Telegram (Dashboard)
 */
app.post('/send-emergency-telegram', async (req, res) => {
    try {
        const { scan_id, scan_timestamp, image_path } = req.body;
        
        // Format pesan emergency
        const emergencyMessage = `
🚨 <b>EMERGENCY ALERT</b> 🚨

<b>Scan ID:</b> ${scan_id || 'N/A'}
<b>Waktu:</b> ${scan_timestamp || new Date().toLocaleString('id-ID')}
<b>Lokasi:</b> ${process.env.LOCATION_NAME || 'SMK MARHAS Margahayu'}
<b>Alamat:</b> ${process.env.LOCATION_ADDRESS || 'Jl. Raya Margahayu No.186, Bandung'}

⚠️ <b>SEGERA TANGANI SITUASI DARURAT!</b>

━━━━━━━━━━━━━━━━━━
Dikirim dari Emergency Hotline System
        `.trim();

        // Kirim pesan ke Telegram
        const result = await sendTelegramMessage(emergencyMessage);

        // Kirim lokasi jika tersedia
        if (process.env.LOCATION_LATITUDE && process.env.LOCATION_LONGITUDE) {
            await sendTelegramLocation(
                process.env.LOCATION_LATITUDE,
                process.env.LOCATION_LONGITUDE
            );
        }

        // Simpan alert
        const alert = {
            id: Date.now(),
            type: 'Dashboard Emergency',
            scan_id,
            scan_timestamp,
            image_path,
            timestamp: new Date().toISOString(),
            telegramSent: result.success
        };
        
        emergencyAlerts.push(alert);

        // Broadcast ke semua client
        io.emit('emergency-alert', alert);

        res.json({
            success: result.success,
            message: result.success ? 'Emergency alert sent to Telegram' : 'Failed to send emergency alert',
            alert: alert,
            telegram: result
        });

    } catch (error) {
        console.error('Error sending emergency telegram:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// EMERGENCY RESPONDER API
// ========================================

/**
 * Emergency Login (Supabase Authentication)
 */
app.post('/api/emergency-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Authenticate dengan Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            console.error('❌ Supabase auth error:', error.message);
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        
        // Success - semua user yang berhasil login di Supabase dianggap emergency responder
        // Jika ingin restrict, tambahkan logic cek email atau tabel emergency_responders
        
        console.log('✅ Emergency login successful:', email);
        
        // Return token dan user data
        return res.json({
            success: true,
            token: data.session.access_token, // JWT token dari Supabase
            user: {
                id: data.user.id,
                email: data.user.email,
                role: 'emergency',
                name: email.split('@')[0] // polisi, pemadam, medis, etc
            }
        });
        
    } catch (error) {
        console.error('❌ Error in emergency login:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Middleware: Validate Emergency Token
 */
const validateEmergencyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized - No token provided'
        });
    }
    
    const token = authHeader.substring(7);
    
    try {
        // Verify JWT token dengan Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            console.error('❌ Token validation failed:', error?.message);
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }
        
        // Semua user Supabase yang valid dianggap emergency responder
        // Jika ingin restrict, tambahkan logic cek email atau tabel
        
        req.user = {
            id: user.id,
            email: user.email,
            role: 'emergency',
            name: user.email.split('@')[0]
        };
        
        next();
        
    } catch (error) {
        console.error('❌ Token validation error:', error);
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
};

/**
 * Get Emergency Cases (Protected)
 */
app.get('/api/emergency-cases', validateEmergencyToken, async (req, res) => {
    try {
        const { status, type, date } = req.query;
        
        console.log('🔍 Loading emergency cases with filters:', { status, type, date });
        
        // Load from database - emergency_alerts
        let query = supabase
            .from('emergency_alerts')
            .select('*')
            .eq('emergency_button_pressed', true)
            .order('timestamp', { ascending: false });
        
        // Apply filters
        if (status && status !== 'all') {
            query = query.eq('status', status);
        }
        
        if (type && type !== 'all') {
            query = query.eq('accident_type', type);
        }
        
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query = query.gte('timestamp', startOfDay.toISOString())
                        .lte('timestamp', endOfDay.toISOString());
        }
        
        const { data: dbCases, error: dbError } = await query;
        
        console.log(`📊 Found ${dbCases?.length || 0} emergency cases from database`);
        
        if (dbError) {
            console.error('❌ Database error:', dbError);
            // Fallback to memory if database fails
            let cases = emergencyAlerts.filter(alert => 
                alert.emergencyButtonPressed === true
            );
            
            if (status && status !== 'all') {
                cases = cases.filter(c => c.status === status);
            }
            if (type && type !== 'all') {
                cases = cases.filter(c => c.accidentType === type);
            }
            if (date) {
                const filterDate = new Date(date).toDateString();
                cases = cases.filter(c => 
                    new Date(c.timestamp).toDateString() === filterDate
                );
            }
            
            dbCases = cases.map(c => ({
                id: c.id,
                alert_id: c.id.toString(),
                type: c.type,
                message: c.message,
                user_name: c.userName,
                user_photo: c.userPhoto,
                location: c.location,
                timestamp: c.timestamp,
                telegram_sent: c.telegramSent,
                emergency_button_pressed: c.emergencyButtonPressed,
                accident_type: c.accidentType,
                scan_id: c.scanId,
                scan_photo: c.scanPhoto,
                body_temperature: c.bodyTemperature,
                status: c.status,
                response_time: c.responseTime,
                responded_by: c.respondedBy,
                handled_at: c.handledAt,
                notes: c.notes
            }));
        }
        
        // Convert database format to expected format
        const cases = (dbCases || []).map(dbCase => ({
            id: parseInt(dbCase.alert_id) || dbCase.id,
            type: dbCase.type,
            message: dbCase.message,
            userName: dbCase.user_name,
            userPhoto: dbCase.user_photo,
            location: dbCase.location,
            timestamp: dbCase.timestamp,
            telegramSent: dbCase.telegram_sent,
            emergencyButtonPressed: dbCase.emergency_button_pressed,
            accidentType: dbCase.accident_type,
            scanId: dbCase.scan_id,
            scanPhoto: dbCase.scan_photo,
            bodyTemperature: dbCase.body_temperature,
            status: dbCase.status,
            responseTime: dbCase.response_time,
            respondedBy: dbCase.responded_by,
            handledAt: dbCase.handled_at,
            notes: dbCase.notes
        }));
        
        // Calculate stats
        const allCases = cases;
        const today = new Date().toDateString();
        const stats = {
            active: allCases.filter(c => c.status === 'active').length,
            today: allCases.filter(c => 
                new Date(c.timestamp).toDateString() === today
            ).length,
            handled: allCases.filter(c => c.status === 'handled').length,
            avgResponse: calculateAvgResponse(allCases.filter(c => c.status === 'handled'))
        };
        
        res.json({
            success: true,
            cases: cases,
            stats: stats,
            total: cases.length
        });
        
    } catch (error) {
        console.error('❌ Error getting cases:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Helper function to calculate average response time
function calculateAvgResponse(handledCases) {
    if (handledCases.length === 0) return 0;
    
    const totalMinutes = handledCases.reduce((sum, c) => {
        if (c.responseTime) {
            return sum + (c.responseTime / 60000); // Convert ms to minutes
        }
        return sum;
    }, 0);
    
    return Math.round(totalMinutes / handledCases.length);
}

/**
 * Mark Case as Handled (Protected)
 */
app.post('/api/emergency-cases/:id/handle', validateEmergencyToken, async (req, res) => {
    try {
        const caseId = parseInt(req.params.id);
        const { respondedBy, notes } = req.body;
        
        // Update in memory array
        const caseIndex = emergencyAlerts.findIndex(alert => alert.id === caseId);
        
        if (caseIndex !== -1) {
            emergencyAlerts[caseIndex].status = 'handled';
            emergencyAlerts[caseIndex].respondedBy = respondedBy || req.user.email;
            emergencyAlerts[caseIndex].responseTime = Date.now() - new Date(emergencyAlerts[caseIndex].timestamp).getTime();
            emergencyAlerts[caseIndex].handledAt = new Date().toISOString();
            emergencyAlerts[caseIndex].notes = notes || '';
        }
        
        // Update in database
        const responseTime = Date.now() - caseId; // Estimate from ID
        const { data: dbData, error: dbError } = await supabase
            .from('emergency_alerts')
            .update({
                status: 'handled',
                responded_by: respondedBy || req.user.email,
                response_time: responseTime,
                handled_at: new Date().toISOString(),
                notes: notes || ''
            })
            .eq('alert_id', caseId.toString())
            .select();
        
        if (dbError) {
            console.error('⚠️ Error updating database:', dbError);
        } else {
            console.log('✅ Case updated in database:', dbData);
        }
        
        const updatedCase = caseIndex !== -1 ? emergencyAlerts[caseIndex] : {
            id: caseId,
            status: 'handled',
            respondedBy: respondedBy || req.user.email,
            handledAt: new Date().toISOString()
        };
        
        // Broadcast update to all connected clients
        io.emit('case-handled', updatedCase);
        
        res.json({
            success: true,
            case: updatedCase,
            message: 'Case marked as handled'
        });
        
    } catch (error) {
        console.error('Error handling case:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

/**
 * Helper: Calculate Average Response Time
 */
function calculateAvgResponseTime(cases) {
    const handledCases = cases.filter(c => c.status === 'handled' && c.responseTime);
    
    if (handledCases.length === 0) {
        return '0m';
    }
    
    const totalTime = handledCases.reduce((sum, c) => sum + c.responseTime, 0);
    const avgMs = totalTime / handledCases.length;
    const avgMinutes = Math.round(avgMs / 60000);
    
    return `${avgMinutes}m`;
}

// ========================================
// WEBSOCKET HANDLING
// ========================================

io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    /**
     * User Join Chat
     */
    socket.on('join-chat', (userData) => {
        const user = {
            id: socket.id,
            name: userData.name || 'Anonymous',
            role: userData.role || 'user',
            timestamp: new Date().toISOString()
        };
        
        connectedUsers.set(socket.id, user);
        
        console.log(`👤 ${user.name} joined chat`);
        
        // Notify all users
        socket.broadcast.emit('user-joined', {
            user: user,
            onlineCount: connectedUsers.size
        });
        
        // Send current online users to new user
        socket.emit('online-users', Array.from(connectedUsers.values()));
        
        // Send recent chat history
        socket.emit('chat-history', chatHistory.slice(-50));
    });

    /**
     * Send Message
     */
    socket.on('send-message', (messageData) => {
        const user = connectedUsers.get(socket.id);
        
        const message = {
            id: Date.now(),
            userId: socket.id,
            userName: user ? user.name : 'Anonymous',
            userRole: user ? user.role : 'user',
            text: messageData.text,
            timestamp: new Date().toISOString()
        };
        
        chatHistory.push(message);
        
        // Keep only last 100 messages
        if (chatHistory.length > 100) {
            chatHistory.shift();
        }
        
        // Broadcast to all users
        io.emit('new-message', message);
        
        console.log(`💬 Message from ${message.userName}: ${message.text}`);
    });

    /**
     * User Typing
     */
    socket.on('typing', (data) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            socket.broadcast.emit('user-typing', {
                userId: socket.id,
                userName: user.name
            });
        }
    });

    /**
     * Stop Typing
     */
    socket.on('stop-typing', () => {
        socket.broadcast.emit('user-stop-typing', {
            userId: socket.id
        });
    });

    /**
     * Emergency Alert via WebSocket
     */
    socket.on('emergency-alert', async (alertData) => {
        const user = connectedUsers.get(socket.id);
        
        const alert = {
            id: Date.now(),
            type: alertData.type,
            message: alertData.message,
            userName: user ? user.name : 'Anonymous',
            userPhoto: alertData.userPhoto,
            location: alertData.location,
            timestamp: new Date().toISOString()
        };
        
        emergencyAlerts.push(alert);
        
        // Send to Telegram
        const telegramMessage = `
🚨 <b>EMERGENCY ALERT</b> 🚨

<b>Tipe:</b> ${alert.type}
<b>Pesan:</b> ${alert.message}
<b>Pengirim:</b> ${alert.userName}
<b>Waktu:</b> ${new Date(alert.timestamp).toLocaleString('id-ID')}
<b>Lokasi:</b> ${process.env.LOCATION_NAME || 'SMK MARHAS Margahayu'}

⚠️ <i>Segera tangani!</i>
        `.trim();
        
        await sendTelegramMessage(telegramMessage);
        
        // Broadcast to all clients
        io.emit('emergency-alert', alert);
        
        console.log(`🚨 Emergency alert from ${alert.userName}`);
    });

    /**
     * User Disconnect
     */
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
            console.log(`❌ ${user.name} disconnected`);
            connectedUsers.delete(socket.id);
            
            // Notify others
            socket.broadcast.emit('user-left', {
                user: user,
                onlineCount: connectedUsers.size
            });
        }
    });
});

// ========================================
// OPENAI REALTIME WEBSOCKET PROXY
// ========================================

const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ noServer: true });

// Handle upgrade untuk WebSocket proxy
server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
    
    if (pathname === '/ws/openai-realtime') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// WebSocket proxy connections
wss.on('connection', async (clientWs) => {
    console.log('🔌 OpenAI Realtime proxy client connected');
    
    let openaiWs = null;
    
    try {
        // Generate ephemeral token
        const tokenResponse = await fetch('https://api.openai.com/v1/realtime/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-realtime-preview-2024-10-01',
                voice: 'alloy'
            })
        });
        
        if (!tokenResponse.ok) {
            throw new Error(`Failed to get session token: ${tokenResponse.statusText}`);
        }
        
        const { client_secret } = await tokenResponse.json();
        console.log('✅ OpenAI ephemeral token generated');
        
        // Connect to OpenAI with authentication header
        openaiWs = new WebSocket(
            'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
            {
                headers: {
                    'Authorization': `Bearer ${client_secret.value}`,
                    'OpenAI-Beta': 'realtime=v1'
                }
            }
        );
        
        // OpenAI -> Client relay
        openaiWs.on('message', (data) => {
            if (clientWs.readyState === 1) {
                // Convert Buffer to string if needed
                const message = data instanceof Buffer ? data.toString('utf-8') : data;
                clientWs.send(message);
            }
        });
        
        openaiWs.on('open', () => {
            console.log('✅ Connected to OpenAI Realtime API');
        });
        
        openaiWs.on('error', (error) => {
            console.error('❌ OpenAI WebSocket error:', error.message);
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({
                    type: 'error',
                    error: { message: 'OpenAI connection error' }
                }));
            }
        });
        
        openaiWs.on('close', () => {
            console.log('🔌 OpenAI WebSocket closed');
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.close();
            }
        });
        
        // Client -> OpenAI relay
        clientWs.on('message', (data) => {
            if (openaiWs && openaiWs.readyState === 1) {
                // Convert to string if Buffer
                const message = data instanceof Buffer ? data.toString('utf-8') : data;
                openaiWs.send(message);
            }
        });
        
        clientWs.on('close', () => {
            console.log('🔌 Client WebSocket closed');
            if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
                openaiWs.close();
            }
        });
        
        clientWs.on('error', (error) => {
            console.error('❌ Client WebSocket error:', error.message);
            if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
                openaiWs.close();
            }
        });
        
    } catch (error) {
        console.error('❌ Failed to setup OpenAI proxy:', error.message);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({
                type: 'error',
                error: { message: 'Failed to connect to OpenAI' }
            }));
            clientWs.close();
        }
    }
});

// ========================================
// START SERVER
// ========================================

// Load initial data from database
async function loadInitialData() {
    console.log('📊 Loading initial data from database...');
    
    try {
        const { data, error } = await supabase
            .from('emergency_alerts')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);
        
        if (error) {
            console.error('❌ Error loading data from database:', error.message);
            return;
        }
        
        if (data && data.length > 0) {
            // Clear memory array
            emergencyAlerts.length = 0;
            
            // Convert database format to memory format
            const convertedData = data.map(dbCase => ({
                id: parseInt(dbCase.alert_id) || dbCase.id,
                type: dbCase.type,
                message: dbCase.message,
                userName: dbCase.user_name,
                userPhoto: dbCase.user_photo,
                location: dbCase.location,
                timestamp: dbCase.timestamp,
                telegramSent: dbCase.telegram_sent,
                emergencyButtonPressed: dbCase.emergency_button_pressed,
                accidentType: dbCase.accident_type,
                scanId: dbCase.scan_id,
                scanPhoto: dbCase.scan_photo,
                bodyTemperature: dbCase.body_temperature,
                status: dbCase.status,
                responseTime: dbCase.response_time,
                respondedBy: dbCase.responded_by,
                handledAt: dbCase.handled_at,
                notes: dbCase.notes
            }));
            
            emergencyAlerts.push(...convertedData);
            console.log(`✅ Loaded ${emergencyAlerts.length} emergency alerts from database`);
        } else {
            console.log('ℹ️ No emergency alerts in database yet');
        }
    } catch (err) {
        console.error('❌ Failed to load initial data:', err);
    }
}

server.listen(PORT, async () => {
    console.log('\n========================================');
    console.log('🚀 EMERGENCY HOTLINE SERVER STARTED');
    console.log('========================================');
    console.log(`📍 Location: ${process.env.LOCATION_NAME || 'SMK MARHAS Margahayu'}`);
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`💬 Chat System: Active`);
    console.log(`📱 Telegram Bot: ${TELEGRAM_BOT_TOKEN ? 'Configured' : 'Not Configured'}`);
    console.log(`📞 Telegram Chat ID: ${TELEGRAM_CHAT_ID || 'Not Set'}`);
    console.log(`🎙️ OpenAI Realtime: ${OPENAI_API_KEY ? 'Configured' : 'Not Configured'}`);
    console.log('========================================');
    console.log('\n📋 Available Endpoints:');
    console.log(`   GET  /health - Server health check`);
    console.log(`   GET  /chat-history - Get chat history`);
    console.log(`   GET  /emergency-alerts - Get emergency alerts`);
    console.log(`   GET  /test-telegram - Test Telegram connection`);
    console.log(`   POST /send-emergency - Send emergency alert`);
    console.log(`   POST /send-telegram - Send Telegram message`);
    console.log(`   POST /api/openai-session - Generate OpenAI session token`);
    console.log(`   GET  /api/emergency-cases - Get emergency cases (protected)`);
    console.log(`   POST /api/emergency-cases/:id/handle - Mark case as handled`);
    console.log('\n🔌 WebSocket Events:');
    console.log(`   join-chat - Join chat room`);
    console.log(`   send-message - Send chat message`);
    console.log(`   emergency-alert - Send emergency alert`);
    console.log(`   typing - User is typing`);
    console.log(`   openai-realtime - OpenAI Realtime proxy`);
    console.log('\n');
    
    // Load initial data from database
    await loadInitialData();
    
    console.log('\n✅ Server is ready to accept connections!\n');
});

// ========================================
// ERROR HANDLING
// ========================================

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});
