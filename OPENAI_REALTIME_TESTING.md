# OpenAI Realtime API - Quick Testing Guide

##  Prerequisites
-  Server running on http://localhost:3003
-  Microphone connected and working
-  Speakers/headphones connected
-  Chrome/Edge/Firefox browser (any modern browser)
-  HTTPS enabled (required for microphone access)

##  Testing Steps

### Step 1: Access Dashboard
1. Open browser: `http://localhost:3003/dashboard.html`
2. Look for **Voice Assistant** button (microphone icon) at bottom right
3. Status indicator should appear below the button

### Step 2: First Connection
1. **Click the microphone button** (first time)
2. Expected behavior:
   - Status shows: "Memulai" → "Menghubungkan ke AI..."
   - Console logs WebSocket connection
   - After 1-2 seconds: "Terhubung" → "Siap mendengarkan"
   - Button changes to indicate ready state

### Step 3: Grant Microphone Permission
1. **Click the button again**
2. Browser will ask: "Allow microphone access?"
3. **Click "Allow"**
4. Status changes to: "Mendengarkan" → "Silakan bicara..."
5. Button shows "listening" animation (pulsing)

### Step 4: Test Voice Interaction
1. **Speak in Indonesian**: 
   ```
   "Bagaimana cara melakukan CPR?"
   (How to perform CPR?)
   ```
2. Expected behavior:
   - Status shows: "Anda berbicara..."
   - After you stop: "Memproses..."
   - AI responds with voice (you hear audio)
   - Text transcription appears in conversation popover
   - Status shows: "AI berbicara..."

### Step 5: Multiple Questions
Test these questions in Indonesian:
```
1. "Apa yang harus dilakukan jika ada luka berdarah?"
   (What to do for a bleeding wound?)

2. "Bagaimana menangani luka bakar?"
   (How to handle burns?)

3. "Nomor darurat apa yang harus saya hubungi?"
   (What emergency numbers should I call?)
```

### Step 6: Stop/Resume Session
1. **While AI is speaking**, click button again
   - Should stop AI immediately
   - Status: "Sesi dihentikan"
2. **Click again** to resume listening
3. Conversation history should be preserved

##  What to Check

###  Browser Console (F12 → Console)
Look for these logs:
```
 WebSocket connecting to: wss://api.openai.com/v1/realtime
 WebSocket connected
 Session created
 Session updated
 Conversation item created
 Audio chunk received (multiple)
 Speech started
 Speech stopped
```

###  Status Indicator
Should display:
- "Memulai" (Starting)
- "Terhubung" (Connected)
- "Mendengarkan" (Listening)
- "Anda berbicara" (You are speaking)
- "Memproses" (Processing)
- "AI berbicara" (AI speaking)
- "Selesai" (Done)

###  Conversation Popover
- Click the "chat bubble" icon to open
- Should show:
  - **ANDA**: Your spoken questions (transcribed)
  - **ASISTEN**: AI responses (transcribed)
- Scrolls automatically to latest message

###  Audio Quality
- AI voice should be clear and natural
- No distortion or crackling
- Volume should be audible
- Indonesian pronunciation should be accurate

##  Troubleshooting

### Problem: "WebSocket connection failed"
**Symptoms**: Status stuck at "Memulai"
**Solutions**:
1. Check internet connection
2. Verify OpenAI API key is valid
3. Check browser console for error details
4. Try refreshing the page

### Problem: "No microphone access"
**Symptoms**: Browser doesn't ask for permission
**Solutions**:
1. Check browser settings → Privacy → Microphone
2. Ensure HTTPS is enabled (or localhost exception)
3. Try different browser
4. Check if microphone is connected

### Problem: "AI doesn't respond"
**Symptoms**: You speak but no response
**Solutions**:
1. Check WebSocket status (should be "OPEN")
2. Verify audio is being sent (console logs)
3. Speak louder/closer to microphone
4. Wait 2-3 seconds after speaking (VAD threshold)
5. Click button to stop and restart

### Problem: "No audio playback"
**Symptoms**: Text appears but no voice
**Solutions**:
1. Check speaker volume
2. Click anywhere on page (enable audio autoplay)
3. Check browser's audio permissions
4. Try refreshing and allowing audio

### Problem: "Conversation not displayed"
**Symptoms**: Audio works but no text in popover
**Solutions**:
1. Click the chat bubble icon to open popover
2. Scroll down if messages are below viewport
3. Check console for `conversation.item.created` events

##  Performance Metrics

### Expected Response Times:
- **WebSocket Connection**: < 2 seconds
- **Speech Detection**: 500ms after you stop speaking
- **AI Response Start**: 1-2 seconds
- **Total Interaction**: 3-5 seconds from question to answer

### Audio Specs:
- **Sample Rate**: 24kHz
- **Bit Depth**: 16-bit PCM
- **Channels**: Mono
- **Format**: Base64-encoded PCM16

##  Example Conversation Flow

```
[User clicks button]
Status: "Memulai" → "Terhubung" → "Siap"

[User clicks again]
Browser: "Allow microphone?" → User clicks "Allow"
Status: "Mendengarkan"

[User speaks]: "Bagaimana cara CPR?"
Status: "Anda berbicara..."

[User stops speaking after 500ms]
Status: "Memproses..."

[AI responds with voice]
Status: "AI berbicara..."
Audio: "Untuk melakukan CPR pada orang dewasa..."
Text in popover:
  ANDA: "Bagaimana cara CPR?"
  ASISTEN: "Untuk melakukan CPR pada orang dewasa..."

[AI finishes speaking]
Status: "Selesai - Tekan tombol untuk bertanya lagi"
```

##  Advanced Testing

### Test 1: Rapid Fire Questions
- Ask 5 questions quickly without waiting for full responses
- Verify WebSocket handles queue properly
- Check if conversation history maintains order

### Test 2: Long Conversation
- Have 10+ exchanges with the AI
- Verify conversation history limits work (last 10 messages)
- Check memory usage doesn't increase indefinitely

### Test 3: Network Interruption
- Start a conversation
- Disconnect internet briefly
- Reconnect and see if WebSocket recovers
- (Note: Current version doesn't auto-reconnect, needs enhancement)

### Test 4: Page Navigation
- Start a session
- Navigate to another page
- Verify cleanup (WebSocket closes, audio stops)
- No errors in console

##  Test Results Template

```
Date: __________
Browser: __________
OS: __________

 First connection successful
 Microphone permission granted
 Voice input detected
 AI voice response heard
 Transcription displayed
 Multiple questions work
 Stop/resume works
 Cleanup on page leave

Issues found:
- _________________________
- _________________________

Performance:
- Connection time: _____ seconds
- Response time: _____ seconds
- Audio quality: _____ / 10

Notes:
_________________________
```

---

**Ready to Test?** Start with Step 1 above!

**Need Help?** Check the main documentation in `OPENAI_REALTIME_MIGRATION.md`
