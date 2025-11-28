#  DIAGRAM ALUR SISTEM - EMERGENCY HOTLINE SYSTEM

##  DAFTAR DIAGRAM

1. [Alur Emergency Button](#1-alur-emergency-button)
2. [Alur Face Recognition](#2-alur-face-recognition)
3. [Alur Emergency Responder](#3-alur-emergency-responder)
4. [Alur Real-time Chat](#4-alur-real-time-chat)
5. [Arsitektur Sistem](#5-arsitektur-sistem)

---

## 1. ALUR EMERGENCY BUTTON

```

                    USER INTERFACE                           
                  (dashboard.html)                            

                        
                         1. User klik tombol EMERGENCY
                        
                
                 Dialog Popup 
                 Pilih Tipe:  
                 • Medical    
                 • Fire       
                 • Crime      
                 • Accident   
                 • Other      
                
                        
                         2. User konfirmasi
                        
        
         POST /send-emergency          
         {                             
           type: 'Emergency Alert',    
           accidentType: 'medical',    
           userName: '...',            
           scanId: '...',              
           location: {...}             
         }                             
        
                        
                        

                    SERVER (server.js)                        

                                                               
  1. Format pesan Telegram                                    
                      
       EMERGENCY ALERT                                   
      Tipe: MEDIS                                           
      Pengirim: John Doe                                    
      Waktu: 22 Nov 2025 15:30                              
      Lokasi: SMK MARHAS Margahayu                          
                      
                                                               
  2. Kirim ke Telegram Bot API                               
                                             
      POST /sendMessage                                     
      chat_id: -1003189919970                               
      text: {formatted message}                             
                                             
                                                             
                                                             
                                             
      POST /sendLocation                                    
      latitude: -6.9559                                     
      longitude: 107.6411                                    
                                             
                                                             
  3. Simpan ke Database                                      
                                             
      INSERT INTO emergency_alerts                          
      {                                                      
        alert_id: '1234567890',                             
        accident_type: 'medical',                            
        status: 'active',                                    
        emergency_button_pressed: true                       
      }                                                      
                                             
                                                             
  4. Update face_scans (jika ada scanId)                     
                                             
      UPDATE face_scans                                      
      SET isemergency = true                                 
      WHERE scanid = '...'                                   
                                             
                                                             
  5. Broadcast via Socket.IO                                 
                                             
      io.emit('emergency-alert', alert)                     
                                             
                                                             

             
             
                                                             
          
      Telegram        Emergency        Dashboard       Admin      
      Group           Dashboard        (User)          Panel      
                                                                  
       Notif         Update        Success       Log      
       Location      Alarm        Message         New Alert   
                      (3x)                                        
          
```

---

## 2. ALUR FACE RECOGNITION

```

                    USER INTERFACE                           
                    (scan.html)                              

                        
                 • Face        
                   Landmark    
                 • Face        
                   Recognition 
                
                        
                         2. Akses kamera
                        
        
                         1. Load face-api.js models
                        
                
                 Load Models:  
                 • TinyFace    
                   Detector    
         Video Stream (Real-time)       
                                       
               
            [Camera Feed]            
             Face Detected         
            • 68 Landmarks          
               
        
                        
                         3. User klik "Capture"
                        
        
         Extract Face Descriptor        
                                        
          • Detect face                 
          • Extract 128-dim vector     
          • [0.123, -0.456, ...]        
        
                        
                         4. Match dengan registered_faces
                        
        
         Query Database                 
         SELECT * FROM registered_faces  
         WHERE is_active = true         
        
                        
                         5. Calculate similarity
                        
        
         For each registered face:      
          • cosineSimilarity(           
              query, registered)         
          • Find best match             
          • Threshold: 0.6             
        
                        
            
                                     
                                     
             
     MATCH FOUND            NO MATCH     
     (>= 0.6)               (< 0.6)      
             
                                     
                                      6. Auto-register Guest
                                     
                             
                              INSERT INTO    
                              registered_faces
                              {              
                                name: 'Guest
                                 Emergency', 
                                is_guest: true
                              }              
                             
                                     
            
                      
                       7. Upload foto
                      
        
         Supabase Storage               
                                        
         Path: 2025/November/22/        
               scan_1234567890.jpg      
        
                        
                         8. Simpan metadata
                        
        
         INSERT INTO face_scans          
         {                               
           scanid: '1234567890',         
           imagepath: '2025/.../...',    
           scantime: NOW(),              
           isemergency: false,            
           body_temperature: 36.5        
         }                               
        
                        
                         9. Save scanId ke localStorage
                        
        
         localStorage.setItem(          
           'lastScanId', '1234567890'    
         )                              
        
                        
                         10. Redirect atau tampilkan hasil
                        
        
         Display Result:                
                                        
          "Selamat datang, John!"    
            (jika match)                
                                        
          "Mode Emergency - Akses     
            Diberikan"                  
            (jika guest)                
        
```

---

## 3. ALUR EMERGENCY RESPONDER

```

                    LOGIN PAGE                               
              (login-emergency.html)                         

                        
                         1. User input credentials
                        
        
         Email: polisi@emergency.com    
         Password: ********             
        
                        
                         2. POST /api/emergency-login
                        

                    SERVER (server.js)                        

                                                               
  1. Authenticate via Supabase                                
                                             
      supabase.auth.signInWithPassword()                    
                                             
                                                             
                                                             
                                             
      Return JWT Token                                      
      {                                                     
        token: 'eyJhbGci...',                               
        user: {                                             
          email: 'polisi@emergency.com',                    
          role: 'emergency'                                  
        }                                                    
      }                                                     
                                             
                                                             

             
              3. Redirect dengan token
             

              EMERGENCY DASHBOARD                             
          (emergency-dashboard.html)                          

                                                               
  1. Load Cases                                                
                                             
      GET /api/emergency-cases                              
      Headers:                                              
        Authorization: Bearer {token}                       
      Query:                                                
        ?status=all&type=all&date=...                        
                                             
                                                             
                                                             
                                             
      Return:                                                
      {                                                     
        cases: [...],                                       
        stats: {                                            
          active: 5,                                        
          today: 12,                                         
          handled: 45,                                       
          avgResponse: 8                                    
        }                                                    
      }                                                     
                                             
                                                             
  2. Connect Socket.IO                                        
                                             
      socket.on('emergency-alert', ...)                     
      socket.on('case-handled', ...)                         
                                             
                                                             
  3. Display Dashboard                                        
                      
                             
      Active Today Handl Avg                      
        5     12    45    8m                      
                             
                                                            
      Filters:                                              
      [Status ] [Type ] [Date ]                       
                                                            
                            
        MEDIS - John Doe                               
       Time: 15:30                                       
       [Mark as Handled]                                  
                            
                      
                                                               
  4. Real-time Updates                                         
                                             
      New Emergency Alert                                    
      → Update cases list                                    
      → Desktop notification                                 
      → Play alarm (3x)                                      
                                             
                                                             
  5. Handle Case                                               
                                             
      POST /api/emergency-cases/:id/handle                  
      {                                                     
        notes: 'Tim sudah di lokasi'                        
      }                                                     
                                             
                                                             
                                                             
                                             
      Update Database:                                       
      • status = 'handled'                                  
      • response_time = ...                                 
      • responded_by = 'polisi@emergency.com'               
      • handled_at = NOW()                                  
                                             
                                                             
                                                             
                                             
      Broadcast: 'case-handled'                             
      → All dashboards update                               
                                             
                                                               

```

---

## 4. ALUR REAL-TIME CHAT

```

                    USER INTERFACE                           
                  (service.html)                              

                        
                         1. User buka halaman
                        
                
                 Welcome Popup 
                 Name: [____]  
                 Role: []     
                 [Join Chat]   
                
                        
                         2. User join
                        
        
         Connect Socket.IO              
         socket = io('http://localhost:3003')
        
                        
                         3. Emit 'join-chat'
                        

                    SERVER (server.js)                        

                                                               
  1. Add user to connectedUsers Map                           
                                             
      connectedUsers.set(socket.id, {                        
        name: 'John',                                        
        role: 'student'                                      
      })                                                     
                                             
                                                             
  2. Broadcast 'user-joined'                                 
                                             
      socket.broadcast.emit('user-joined', {                
        user: {...},                                         
        onlineCount: 5                                      
      })                                                     
                                             
                                                             
  3. Send chat history                                        
                                             
      socket.emit('chat-history', [...])                    
                                             
                                                             

             
              4. User kirim pesan
             
        
         socket.emit('send-message', {  
           text: 'Hello everyone!'      
         })                             
        
                        
                        
        
         Server:                        
         • Add to chatHistory           
         • io.emit('new-message', {...})
        
                        
                         5. Broadcast ke semua
                        
        
         All Clients Receive:            
         • Update chat UI                
         • Show new message              
         • Update online count           
        
```

---

## 5. ARSITEKTUR SISTEM

```

                         CLIENT LAYER                            

                                                                 
              
    Dashboard       Face Scan       Emergency            
    (User)                          Dashboard            
                                    (Responder)          
    • Emergency     • Camera        • Cases              
      Button        • Detection     • Stats              
    • Voice AI      • Match         • Handle             
              
                                                              
                           
                                                                 
                             HTTP/REST + WebSocket               
                                                                 

                             
                             

                         SERVER LAYER                            
                      (server.js - Port 3003)                    

                                                                 
   
                Express.js REST API                           
       
     POST /send-emergency                                   
     GET  /api/emergency-cases                              
     POST /api/emergency-cases/:id/handle                   
     POST /api/ai-assistant                                 
     POST /api/openai-session                               
       
   
                                                                 
   
                Socket.IO WebSocket                           
       
     Events:                                               
     • join-chat                                           
     • send-message                                        
     • emergency-alert                                     
     • case-handled                                        
       
   
                                                                 
   
                OpenAI Realtime Proxy                         
       
     WebSocket Proxy:                                      
     Client WS ↔ Server ↔ OpenAI WS                       
       
   
                                                                 

                              
        
                                                  
                                                  
        
  Telegram           Supabase          OpenAI     
  Bot API                              Realtime   
                    • Database          API        
  • sendMessage      • Storage                      
  • sendLocation     • Auth             • Voice AI  
                                      • Sessions   
        
```

---

##  DATA FLOW SUMMARY

```

   User      
  (Browser)  

       
        1. Scan Face
       
      
  Face API     Supabase   
  (Detection)        (Storage)  
      
       
        2. Emergency Button
       
            
   Server      Telegram           Supabase   
  (Express)          Bot API            (Database) 
            
       
        3. Broadcast
       
      
  Socket.IO    Emergency  
  (WebSocket)        Dashboard  
      
```

---

**Dibuat:** November 2025  
**Versi:** 2.0.0

