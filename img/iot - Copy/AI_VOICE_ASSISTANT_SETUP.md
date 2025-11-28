# 🤖 AI Voice Assistant with OpenRouter

## Overview
Voice assistant di dashboard sekarang menggunakan **OpenRouter AI (Claude Sonnet 4.5)** untuk memberikan jawaban yang lebih cerdas dan kontekstual tentang pertolongan pertama.

---

## ✨ Features

### 🎙️ Speech-to-Text (STT)
- **Browser Web Speech API** - Menangkap suara user melalui mikrofon
- **Bahasa Indonesia** - Optimized untuk pengenalan suara bahasa Indonesia
- **Real-time Recognition** - Instant transcription

### 🧠 AI Processing
- **OpenRouter API** - Integration dengan Claude Sonnet 4.5
- **Context-Aware** - AI memahami konteks percakapan sebelumnya
- **Specialized Knowledge** - Trained untuk pertolongan pertama
- **Fallback System** - Knowledge base lokal jika AI gagal

### 🔊 Text-to-Speech (TTS)
- **Browser Speech Synthesis** - Natural voice output
- **Indonesian Voice** - Suara dalam bahasa Indonesia
- **Auto-Cancel** - Stop speech saat user ingin bertanya lagi

---

## 🔧 Configuration

### API Key Setup
API key sudah dikonfigurasi di `dashboard.html`:

```javascript
const OPENROUTER_API_KEY = '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';
const OPENROUTER_MODEL = 'anthropic/claude-sonnet-4.5';
```

### System Prompt
AI dikonfigurasi sebagai asisten pertolongan pertama dengan:
- Jawaban dalam bahasa Indonesia
- Format step-by-step yang jelas
- Max 200 kata per response
- Fokus pada topik medis darurat

---

## 🚀 How It Works

### Alur Kerja:

```
1. User tekan tombol mikrofon 🎤
   ↓
2. Browser Speech Recognition mendengarkan
   ↓
3. Suara → Text (STT)
   ↓
4. Text dikirim ke OpenRouter AI
   ↓
5. AI (Claude Sonnet 4.5) memproses pertanyaan
   ↓
6. AI menghasilkan jawaban
   ↓
7. Text → Suara (TTS)
   ↓
8. User mendengar jawaban 🔊
```

### Error Handling:

```
Jika AI gagal (network error, API down, dll):
   ↓
Fallback ke Knowledge Base Lokal
   ↓
Tetap memberikan jawaban berkualitas
```

---

## 💡 Usage Examples

### Contoh Pertanyaan:

**User:** *"Bagaimana cara menghentikan perdarahan?"*

**AI Response:**
```
Untuk menghentikan perdarahan:
1. Cuci tangan atau gunakan sarung tangan
2. Tekan luka dengan kain bersih selama 10 menit
3. Angkat bagian yang luka di atas jantung
4. Jangan lepas tekanan, tambah perban jika merembes
5. Jika tidak berhenti, segera ke fasilitas medis
Hubungi 112/119 untuk bantuan darurat.
```

**User:** *"Apa yang harus dilakukan jika ada yang pingsan?"*

**AI Response:**
```
Pertolongan pertama untuk pingsan:
1. Baringkan korban telentang di lantai
2. Angkat kaki sekitar 30cm untuk aliran darah ke otak
3. Longgarkan pakaian ketat
4. Pastikan udara segar, kipas pelan
5. Jika tidak sadar >1 menit, hubungi 112/119
Jangan beri minum saat masih tidak sadar.
```

---

## 🎯 Features Detail

### 1. Conversation History
- AI mengingat 10 percakapan terakhir
- Context-aware responses
- Natural conversation flow

### 2. Auto Status Update
```
"AI Sedang Berpikir..." → Saat memanggil API
"Asisten AI Menjawab..." → Saat AI selesai
"Asisten Pertolongan Pertama" → Idle state
```

### 3. Visual Feedback
- Status bubble biru saat AI berpikir (highlight mode)
- Toggle minimize/maximize
- Smooth animations

### 4. Mobile Responsive
- Optimized untuk Android devices
- Compact UI di layar kecil
- Tidak menghalangi tombol emergency

---

## 🔒 Security & Privacy

### API Key
- ✅ API key embedded di frontend
- ⚠️ **RECOMMENDATION**: Pindahkan ke backend untuk production
- 🔐 Rate limiting via OpenRouter

### Data Privacy
- Conversation history stored di browser memory
- Reset saat page reload
- Tidak ada penyimpanan permanen

---

## ⚙️ Advanced Configuration

### Customize AI Behavior

Edit di `dashboard.html`:

```javascript
const systemPrompt = {
    role: 'system',
    content: `Kamu adalah asisten AI pertolongan pertama...`
};
```

### Adjust AI Parameters

```javascript
body: JSON.stringify({
    model: OPENROUTER_MODEL,
    messages: [...],
    temperature: 0.7,      // Kreativitas: 0.0-1.0 (default: 0.7)
    max_tokens: 500        // Max panjang jawaban (default: 500)
})
```

**Temperature Settings:**
- `0.0-0.3` = Sangat konsisten, faktual
- `0.4-0.7` = Balanced (recommended)
- `0.8-1.0` = Lebih kreatif, variasi tinggi

---

## 🐛 Troubleshooting

### Problem: AI tidak merespon

**Solution:**
```javascript
// Cek console browser (F12)
// Look for errors:

✅ "AI Response: ..." = Success
❌ "Error calling OpenRouter AI" = Check:
   1. API key valid?
   2. Internet connection?
   3. OpenRouter API status?
```

### Problem: Response terlalu lambat

**Possible Causes:**
- Network latency
- Model sedang busy
- Token limit tercapai

**Solution:**
- Gunakan model yang lebih cepat
- Reduce max_tokens
- Implement loading timeout

### Problem: Fallback terus digunakan

**Check:**
1. API key masih valid?
2. Credit OpenRouter masih ada?
3. CORS settings correct?

---

## 📊 Monitoring

### Check AI Usage

Console logs:
```javascript
✅ AI Response: <answer>        // Success
❌ Error calling OpenRouter AI  // Failed, using fallback
⏳ AI masih memproses...        // Prevent double request
```

### Request/Response Flow

Browser DevTools → Network Tab:
```
POST https://openrouter.ai/api/v1/chat/completions
Status: 200 OK
Response: {"choices": [...]}
```

---

## 💰 Cost Estimation

### Claude Sonnet 4.5 Pricing
*(Check OpenRouter for latest pricing)*

**Estimated Cost per Request:**
- Input: ~100 tokens (system prompt + question)
- Output: ~200-500 tokens (answer)
- Total: ~300-600 tokens per conversation

**With 500 requests/day:**
- ~300,000 tokens/day
- Check OpenRouter dashboard for exact costs

---

## 🔄 Migration to Backend (Recommended)

### Why?
- 🔒 Hide API key from client
- 📊 Better monitoring & logging
- 💰 Rate limiting control
- 🛡️ Add authentication

### Quick Implementation

**1. Create API endpoint in `server.js`:**

```javascript
app.post('/api/ai-assistant', async (req, res) => {
    const { question } = req.body;
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-sonnet-4.5',
                messages: [
                    { role: 'system', content: '...' },
                    { role: 'user', content: question }
                ]
            })
        });
        
        const data = await response.json();
        res.json({ success: true, answer: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

**2. Update `dashboard.html`:**

```javascript
async function generateAIResponse(userQuestion) {
    const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userQuestion })
    });
    
    const data = await response.json();
    // Handle response...
}
```

**3. Add to `.env`:**

```env
OPENROUTER_API_KEY=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
```

---

## 📚 Resources

### OpenRouter
- Dashboard: https://openrouter.ai/
- API Docs: https://openrouter.ai/docs
- Models: https://openrouter.ai/models

### Web Speech API
- MDN Docs: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Browser Support: Chrome, Edge, Safari

### Claude Sonnet 4.5
- Model Card: https://openrouter.ai/models/anthropic/claude-sonnet-4.5
- Capabilities: Long context, multilingual, reasoning

---

## ✅ Checklist

Setup Complete:
- [x] OpenRouter API key configured
- [x] STT (Speech Recognition) working
- [x] TTS (Speech Synthesis) working
- [x] AI integration active
- [x] Fallback knowledge base ready
- [x] Mobile responsive
- [x] Error handling implemented

**Next Steps:**
- [ ] Test dengan berbagai pertanyaan
- [ ] Monitor API usage di OpenRouter dashboard
- [ ] Consider migration to backend
- [ ] Add conversation export feature (optional)
- [ ] Implement voice activity detection (optional)

---

## 🎉 Success!

Voice assistant Anda sekarang **AI-powered**! 

**Try it:**
1. Buka `dashboard.html`
2. Klik tombol mikrofon 🎤
3. Tanya: *"Bagaimana cara melakukan CPR?"*
4. Dengarkan jawaban dari AI! 🔊

---

**Made with ❤️ for SMK MARHAS Margahayu**

🤖 Powered by OpenRouter + Claude Sonnet 4.5
