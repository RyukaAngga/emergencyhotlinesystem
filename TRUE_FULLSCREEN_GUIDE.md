#  TRUE FULLSCREEN / KIOSK MODE GUIDE
**SMK MARHAS Margahayu - Emergency Hotline System**

---

##  Masalah: Taskbar & Browser Tab Masih Terlihat

Saat menggunakan JavaScript Fullscreen API, browser masih menampilkan:
-  Taskbar Windows (bawah layar)
-  Browser tabs & address bar (atas)
-  Browser navigation controls

Ini karena **Fullscreen API** browser berbeda dengan **True Kiosk Mode**.

---

##  Solusi: 3 Metode True Fullscreen

###  **Metode 1: Chrome Kiosk Mode (RECOMMENDED)**

#### Cara Manual:
1. **Tutup semua Chrome** yang sedang buka
2. **Buka Run** (Windows + R)
3. Ketik command ini:
   ```cmd
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk http://localhost:3003/dashboard.html
   ```
4. Tekan **Enter**
5.  Chrome akan buka dalam **TRUE fullscreen** (tanpa taskbar, tanpa tabs)

#### Cara Otomatis (Batch File):
1. **Double-click** file: `start-kiosk-mode.bat`
2. Script otomatis:
   - Close Chrome yang lama
   - Launch Chrome kiosk mode
   - Buka dashboard.html
3.  Done!

#### Chrome Kiosk Parameters:
```cmd
chrome.exe --kiosk --kiosk-printing --app=http://localhost:3003/dashboard.html
```

**Penjelasan Flags:**
- `--kiosk` = True fullscreen mode
- `--kiosk-printing` = Allow printing in kiosk
- `--app=URL` = Open specific URL
- `--disable-pinch` = Disable zoom gestures
- `--noerrdialogs` = Hide error dialogs
- `--disable-infobars` = Hide info bars

---

###  **Metode 2: F11 + Aplikasi Kiosk Mode**

#### Langkah:
1. **Buka dashboard** di Chrome: http://localhost:3003/dashboard.html
2. **Tekan F11** di keyboard → Browser masuk fullscreen (hide tabs)
3. **Klik Settings** () → **"Masuk Kiosk Mode"**
4. **Masukkan password** → Aplikasi lock di fullscreen
5.  Kombinasi F11 + App Kiosk = Better fullscreen

#### Catatan:
- Taskbar Windows mungkin masih terlihat
- Untuk hide taskbar, lihat Metode 3

---

###  **Metode 3: Hide Taskbar Windows**

#### Otomatis (Recommended):
Buat file `hide-taskbar.vbs`:
```vbscript
Set WshShell = CreateObject("WScript.Shell")
WshShell.SendKeys "^{ESC}"
WScript.Sleep 100
WshShell.SendKeys "{ESC}"
```

Atau PowerShell:
```powershell
# Hide Taskbar
$key = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StuckRects3"
$value = Get-ItemProperty -Path $key -Name "Settings"
$value.Settings[8] = 3
Set-ItemProperty -Path $key -Name "Settings" -Value $value.Settings
Stop-Process -Name "explorer" -Force
```

#### Manual:
1. **Klik kanan** Taskbar
2. **Taskbar settings**
3. **Automatically hide the taskbar** = ON
4.  Taskbar auto-hide saat tidak digunakan

---

##  **Setup Production Kiosk (Windows)**

### A. Shortcut Kiosk Mode

1. **Buat Desktop Shortcut**:
   - Klik kanan Desktop → New → Shortcut
   - Target:
     ```
     "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:3003/dashboard.html
     ```
   - Name: `Emergency Kiosk`

2. **Auto-start saat Windows Boot**:
   - Copy shortcut ke:
     ```
     C:\Users\[USERNAME]\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
     ```
   - Atau tekan: `Win + R` → ketik `shell:startup` → paste shortcut

### B. Disable Keyboard Shortcuts (Optional)

Untuk kiosk yang benar-benar terkunci:

1. **Group Policy Editor** (Windows Pro):
   - `Win + R` → `gpedit.msc`
   - Navigate: `User Configuration` → `Administrative Templates` → `Windows Components` → `File Explorer`
   - Enable: `Remove Windows Explorer's default context menu`

2. **Registry Edit** (Advanced):
   ```reg
   Windows Registry Editor Version 5.00

   [HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Policies\System]
   "DisableTaskMgr"=dword:00000001
   "DisableLockWorkstation"=dword:00000001
   ```

 **WARNING:** Ini akan disable Task Manager! Simpan file undo sebelum apply.

### C. Windows Kiosk Mode (Windows 10/11 Pro)

1. **Settings** → **Accounts** → **Family & other users**
2. **Set up a kiosk** → **Assigned Access**
3. Pilih Chrome sebagai kiosk app
4. Configure auto-login

---

##  **Android Kiosk Mode**

### A. Chrome Kiosk Mode (Android)

1. **Install** Kiosk Browser app dari Play Store
2. **Configure** URL: `http://[SERVER-IP]:3003/dashboard.html`
3. **Enable** Kiosk mode
4. **Pin** app dengan Android Screen Pinning:
   - Settings → Security → Screen pinning
   - Enable
   - Buka app → Recent apps → Pin icon

### B. Dedicated Kiosk Apps

**Recommended Apps:**
- **Fully Kiosk Browser** (Paid, terbaik)
- **Kiosk Browser Lockdown** (Free)
- **SureLock Kiosk Lockdown** (Enterprise)

**Features:**
- True fullscreen (hide status bar, nav bar)
- Remote management
- Auto-reload on crash
- Scheduled restart
- Motion detection
- Web-based admin

---

##  **CSS Enhancements untuk Better Fullscreen**

File `dashboard.html` sudah include CSS kiosk mode:

```css
html.kiosk-fullscreen,
body.kiosk-fullscreen {
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    position: fixed !important;
}
```

Ini memastikan konten mengisi **100% viewport** bahkan jika browser UI visible.

---

##  **Troubleshooting**

### Problem 1: Taskbar Masih Terlihat

**Solution:**
- Gunakan Chrome `--kiosk` flag (Metode 1)
- Atau hide taskbar Windows (Metode 3)
- Di Android: Enable immersive mode via kiosk app

### Problem 2: Browser Tabs Terlihat

**Solution:**
- Chrome kiosk mode (`--kiosk` flag)
- Atau F11 untuk hide tabs
- App mode: `--app=URL` (hide address bar, keep tabs hidden)

### Problem 3: User Bisa Keluar dengan Alt+Tab

**Solution:**
```cmd
REM Disable Alt+Tab di registry (Advanced)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" /v DisableTaskSwitching /t REG_DWORD /d 1 /f
```

 **Restore:**
```cmd
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" /v DisableTaskSwitching /f
```

### Problem 4: Chrome Update Notification

**Solution:**
```cmd
REM Disable Chrome update notification
chrome.exe --kiosk --disable-features=UpdateNotification --check-for-update-interval=31536000
```

---

##  **Comparison: Metode Fullscreen**

| Feature | JavaScript API | F11 Browser | Chrome --kiosk | Windows Kiosk |
|---------|---------------|-------------|----------------|---------------|
| **Hide Browser Tabs** |  |  |  |  |
| **Hide Taskbar** |  |  |  |  |
| **Hide Status Bar (Android)** |  |  |  |  |
| **Block Keyboard Shortcuts** |  |  |  |  |
| **Remote Management** |  |  |  |  |
| **Easy Setup** |  |  |  |  |
| **Cost** | Free | Free | Free | Free-Paid |

**Legend:**
-  Supported
-  Partial/Limited
-  Not Supported

---

##  **Recommended Setup untuk Production**

### Desktop/Laptop (Windows):
```batch
# 1. Create startup shortcut
Target: "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:3003/dashboard.html

# 2. Auto-hide taskbar
Settings → Personalization → Taskbar → Automatically hide

# 3. Disable screensaver
Settings → Personalization → Lock screen → Screen timeout → Never

# 4. Auto-login Windows
netplwiz → Uncheck "Users must enter password"
```

### Android Tablet (7.1.2):
```
# 1. Install Fully Kiosk Browser
Play Store → Fully Kiosk Browser

# 2. Configure
URL: http://[SERVER-IP]:3003/dashboard.html
Kiosk Mode: Enabled
Motion Detection: Enabled (wake on motion)
Screensaver: Dashboard after 5 min idle

# 3. Enable Screen Pinning
Settings → Security → Screen pinning → ON
Pin Fully Kiosk app

# 4. Disable navigation bar
Fully Kiosk → Advanced Settings → Hide navigation bar
```

---

##  **Quick Command Reference**

```cmd
REM Start Chrome Kiosk Mode
chrome.exe --kiosk http://localhost:3003/dashboard.html

REM Start Chrome App Mode (less restrictive)
chrome.exe --app=http://localhost:3003/dashboard.html

REM Start with additional flags
chrome.exe --kiosk --kiosk-printing --disable-pinch --noerrdialogs http://localhost:3003/dashboard.html

REM Kill Chrome
taskkill /F /IM chrome.exe

REM Auto-start on boot (PowerShell as Admin)
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\EmergencyKiosk.lnk")
$Shortcut.TargetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$Shortcut.Arguments = "--kiosk http://localhost:3003/dashboard.html"
$Shortcut.Save()
```

---

##  **Security Considerations**

### Level 1: Basic Kiosk
-  Chrome kiosk mode
-  App password protection
-  User bisa exit dengan Alt+F4

### Level 2: Medium Security
-  Chrome kiosk mode
-  App password protection
-  Hide taskbar
-  Disable Task Manager
-  User bisa reboot

### Level 3: High Security (Production)
-  Windows Assigned Access Kiosk
-  BIOS password
-  Disable USB ports
-  Network restrictions
-  Physical lock/case

---

##  **Support**

Jika masih ada masalah:

1. **Check browser console**: F12 (jika bisa akses)
2. **Test command**:
   ```cmd
   chrome.exe --kiosk http://google.com
   ```
   Jika Google muncul fullscreen, berarti Chrome kiosk works.

3. **Verify server running**: http://localhost:3003/dashboard.html

4. **Check logs**: Browser console & server logs

---

**Last Updated:** November 13, 2025  
**Tested On:** 
- Windows 10/11 (Chrome 119+)
- Android 7.1.2 (Chrome/Fully Kiosk)
- Ubuntu 22.04 (Chromium)

**Files:**
- `start-kiosk-mode.bat` - Auto-launch kiosk mode
- `dashboard.html` - Main app with kiosk CSS
- `TRUE_FULLSCREEN_GUIDE.md` - This documentation
