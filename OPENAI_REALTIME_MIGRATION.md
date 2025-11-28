# OpenAI Realtime API Migration

## Overview
Successfully migrated the voice assistant from browser-based Speech Recognition + OpenRouter to **OpenAI Realtime API** for direct speech-to-speech communication.

## Changes Made

### 1. **API Configuration**
- **Old System**: 
  - Browser `SpeechRecognition` API (Chrome/Edge only)
  - Text-to-Speech using `speechSynthesis`
  - OpenRouter Claude 3.5 Sonnet for text responses
  
- **New System**:
  - OpenAI Realtime API WebSocket (`wss://api.openai.com/v1/realtime`)
  - Model: `gpt-4o-realtime-preview-2024-10-01`
  - Voice: `alloy`
  - Direct speech-to-speech (no intermediate text conversion)

### 2. **Code Changes in dashboard.html**

#### New Variables Added:
```javascript
const OPENAI_API_KEY = 'sk-proj-DqiMOthAFaHeRPvpUWGvjvORaRL9nvoRqdY9ZIdfQpkAg3jP3iVKt84TLNndrUdNPq1kI-3fLdT3BlbFJY-DscNa2i_boEln9ZF2x8lonzGUwTJg9zHMEqeOXIW4xlPerUCwyDdZ1a3FU8b7NRaz_t5VlkA';
let realtimeWs = null;
let mediaRecorder = null;
let audioContext = null;
let isConnected = false;
```

#### New Functions Added:
1. **`initializeRealtimeAPI()`**
   - Creates WebSocket connection to OpenAI
   - Sends session configuration (Indonesian first aid assistant)
   - Handles connection events

2. **`handleRealtimeEvent(event)`**
   - Processes all WebSocket events:
     - `session.created` / `session.updated`
     - `conversation.item.created`
     - `response.audio.delta` (AI speaking)
     - `response.audio.done`
     - `input_audio_buffer.speech_started` (user speaking)
     - `input_audio_buffer.speech_stopped`
     - Transcriptions and errors
   - Updates conversation UI with text display

3. **`playAudioChunk(base64Audio)`**
   - Decodes base64 PCM16 audio from OpenAI
   - Creates Web Audio API buffer
   - Plays audio through speakers

4. **`startRealtimeSession()`**
   - Captures microphone using `getUserMedia`
   - Converts audio to PCM16 mono 24kHz format
   - Sends audio chunks via WebSocket as base64

5. **`stopRealtimeSession()`**
   - Stops microphone recording
   - Commits audio buffer to trigger AI response

#### Commented Out Old Code:
- `SpeechRecognitionAPI` initialization
- `speechSynthesisAPI` usage
- `initialiseRecognition()` function
- `speakText()` function
- `cancelSpeechIfSpeaking()` function
- `handleUserQuery()` function
- `generateAIResponse()` function (OpenRouter)
- `generateAssistantResponseFallback()` function
- Old button click handler

#### New Button Behavior:
```javascript
voiceAssistantButton.addEventListener('click', async () => {
    if (!hasGreetedUser) {
        // First click: Initialize WebSocket
        await initializeRealtimeAPI();
    } else {
        // Subsequent clicks: Toggle listening
        if (isListening) {
            stopRealtimeSession();
        } else {
            await startRealtimeSession();
        }
    }
});
```

#### Cleanup on Page Unload:
```javascript
window.addEventListener('beforeunload', () => {
    if (realtimeWs && realtimeWs.readyState === WebSocket.OPEN) {
        realtimeWs.close();
    }
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
    }
});
```

### 3. **Audio Configuration**
- **Input Audio**: PCM16, 24kHz mono (captured from microphone)
- **Output Audio**: PCM16, 24kHz mono (received from OpenAI)
- **Turn Detection**: Server VAD with 500ms silence threshold
- **Modalities**: Both text and audio enabled

### 4. **Session Instructions**
```javascript
instructions: 'Anda adalah asisten pertolongan pertama darurat yang membantu pengguna dalam bahasa Indonesia. Berikan panduan pertolongan pertama yang jelas, singkat, dan mudah dipahami. Fokus pada keselamatan dan tindakan darurat.'
```

## Benefits of Migration

###  **Advantages**:
1. **Lower Latency**: Direct speech-to-speech without text conversion
2. **Natural Conversation**: AI can interrupt, understand tone, and respond naturally
3. **Better Audio Quality**: Real-time PCM16 audio streaming
4. **Browser Independence**: Works in all modern browsers (not just Chrome/Edge)
5. **Multilingual**: Better Indonesian language support
6. **Concurrent Processing**: AI can listen and respond simultaneously

###  **Considerations**:
1. **API Costs**: OpenAI Realtime API charges per audio minute
2. **Network Dependency**: Requires stable internet connection
3. **WebSocket Connection**: May disconnect, needs reconnection logic (future enhancement)
4. **Microphone Permission**: Still requires user permission

## Testing Checklist

- [ ] Click voice assistant button (first time) - should connect to WebSocket
- [ ] Verify status shows "Memulai" → "Terhubung" → "Siap"
- [ ] Click button again - should request microphone permission
- [ ] Speak a question in Indonesian (e.g., "Bagaimana cara CPR?")
- [ ] Verify AI responds with voice (check speakers)
- [ ] Check conversation popover displays transcriptions
- [ ] Click button while AI is speaking - should stop session
- [ ] Test multiple questions to verify conversation history works
- [ ] Verify cleanup on page navigation/refresh

## Troubleshooting

### Issue: WebSocket Connection Fails
- **Check**: OpenAI API key is valid
- **Check**: Network allows WebSocket connections (port 443)
- **Check**: Console errors for authentication issues

### Issue: No Microphone Access
- **Solution**: Grant microphone permission in browser settings
- **Check**: HTTPS is enabled (required for `getUserMedia`)

### Issue: No Audio Playback
- **Check**: Speaker volume is not muted
- **Check**: Browser's audio context is allowed to play
- **Solution**: Click anywhere on page to enable audio (autoplay policy)

### Issue: AI Not Responding
- **Check**: WebSocket status is "OPEN"
- **Check**: Audio buffer is being sent (console logs)
- **Solution**: Click button to stop and restart session

## Future Enhancements

1. **Visual Feedback**:
   - Add waveform visualization during AI speech
   - Show "listening" animation with audio levels
   
2. **Reconnection Logic**:
   - Auto-reconnect if WebSocket disconnects
   - Queue messages during reconnection

3. **Advanced Features**:
   - Push-to-talk mode option
   - Conversation export/download
   - Voice selection (choose different AI voices)
   - Noise cancellation for better recognition

4. **Error Handling**:
   - Fallback to old system if WebSocket unavailable
   - Better error messages for network issues

## References
- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Migration Date**: 2025
**Status**:  Complete
**Old Code**: Commented out, available for reference
