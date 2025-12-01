/**
 * ========================================
 * SUPER KIOSK MODE - Versi Terpusat
 * SMK MARHAS Margahayu
 * ========================================
 * 
 * Fitur:
 * ✔ Fullscreen agresif
 * ✔ Tidak bisa scroll keluar area
 * ✔ Tidak bisa pinch zoom
 * ✔ Tidak bisa select text
 * ✔ Tidak bisa long-press
 * ✔ Tidak bisa buka menu konteks
 * ✔ Tidak bisa keluar fullscreen
 * ✔ Tidak bisa gesture back
 * ✔ Kontrol On/Off dengan password
 * ✔ Sync across all tabs/pages
 */

// ========================================
// HARDCODED CREDENTIALS
// ========================================
const KIOSK_CREDENTIALS = {
    email: 'kioskmode@rayfain.com',
    password: '123456emergencymarhas'
};

// ========================================
// STATE MANAGEMENT
// ========================================
let isKioskModeActive = false;
let fullscreenWatchdog = null;

// ========================================
// FULLSCREEN FUNCTIONS
// ========================================
function goFullscreen() {
    const el = document.documentElement;
    const options = { navigationUI: "hide" };
    
    try {
        if (el.requestFullscreen) {
            el.requestFullscreen(options).catch(() => {});
        } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    } catch (e) {
        console.log('Fullscreen request failed:', e);
    }
}

function exitFullscreen() {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } catch (e) {
        console.log('Exit fullscreen failed:', e);
    }
}

function isFullscreenActive() {
    return !!(document.fullscreenElement || 
              document.webkitFullscreenElement || 
              document.mozFullScreenElement || 
              document.msFullscreenElement);
}

// ========================================
// FULLSCREEN WATCHDOG
// ========================================
function startFullscreenWatchdog() {
    if (fullscreenWatchdog) {
        clearInterval(fullscreenWatchdog);
    }
    
    fullscreenWatchdog = setInterval(() => {
        if (isKioskModeActive && !isFullscreenActive()) {
            console.log('🔄 Fullscreen lost, restoring...');
            goFullscreen();
        }
    }, 1000);
}

function stopFullscreenWatchdog() {
    if (fullscreenWatchdog) {
        clearInterval(fullscreenWatchdog);
        fullscreenWatchdog = null;
    }
}

// ========================================
// KIOSK STYLES
// ========================================
function applySuperKioskStyles() {
    document.documentElement.classList.add('super-kiosk-mode');
    document.body.classList.add('super-kiosk-mode');
    
    if (!document.getElementById('super-kiosk-styles')) {
        const style = document.createElement('style');
        style.id = 'super-kiosk-styles';
        style.textContent = `
            html.super-kiosk-mode, 
            body.super-kiosk-mode {
                touch-action: manipulation !important;
                user-select: none !important;
                -webkit-user-select: none !important;
                -webkit-touch-callout: none !important;
                overscroll-behavior: none !important;
                overflow: hidden !important;
                position: fixed !important;
                width: 100vw !important;
                height: 100vh !important;
                top: 0 !important;
                left: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            
            .super-kiosk-mode * {
                user-select: none !important;
                -webkit-user-select: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            
            .super-kiosk-mode .scrollable,
            .super-kiosk-mode .content,
            .super-kiosk-mode .main-content,
            .super-kiosk-mode .container,
            .super-kiosk-mode .dashboard-main,
            .super-kiosk-mode .content-area {
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
                touch-action: pan-y !important;
            }
            
            /* Kiosk indicator */
            .kiosk-indicator {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(220, 38, 38, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                z-index: 99999;
                display: flex;
                align-items: center;
                gap: 6px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .kiosk-indicator:hover {
                background: rgba(185, 28, 28, 0.95);
                transform: scale(1.05);
            }
            
            .kiosk-indicator i {
                font-size: 10px;
            }
            
            .kiosk-indicator .pulse {
                width: 8px;
                height: 8px;
                background: #4ade80;
                border-radius: 50%;
                animation: kioskPulse 1.5s infinite;
            }
            
            @keyframes kioskPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add kiosk indicator
    if (!document.getElementById('kiosk-indicator')) {
        const indicator = document.createElement('div');
        indicator.id = 'kiosk-indicator';
        indicator.className = 'kiosk-indicator';
        indicator.innerHTML = '<span class="pulse"></span> KIOSK MODE <i class="fas fa-lock"></i>';
        indicator.title = 'Klik untuk keluar dari Kiosk Mode (butuh password)';
        indicator.onclick = () => showKioskLoginModal('exit');
        document.body.appendChild(indicator);
    }
}

function removeSuperKioskStyles() {
    document.documentElement.classList.remove('super-kiosk-mode');
    document.body.classList.remove('super-kiosk-mode');
    
    const style = document.getElementById('super-kiosk-styles');
    if (style) style.remove();
    
    const indicator = document.getElementById('kiosk-indicator');
    if (indicator) indicator.remove();
}

// ========================================
// BLOCK GESTURES & INTERACTIONS
// ========================================
function blockGestures(e) {
    if (isKioskModeActive) e.preventDefault();
}

function blockZoom(e) {
    if (isKioskModeActive && e.ctrlKey) e.preventDefault();
}

function blockContextMenu(e) {
    if (isKioskModeActive) {
        e.preventDefault();
        return false;
    }
}

function blockSelection(e) {
    if (isKioskModeActive) {
        e.preventDefault();
        return false;
    }
}

function blockCopyPaste(e) {
    if (isKioskModeActive) {
        e.preventDefault();
        return false;
    }
}

function blockKeyboardShortcuts(e) {
    if (!isKioskModeActive) return;
    
    // Block F11
    if (e.key === 'F11') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    // Block Escape
    if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    // Block Back button (Android)
    if (e.keyCode === 4 || e.key === 'Back') {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    // Block Ctrl+R, Ctrl+W, Ctrl+T, Ctrl+N
    if (e.ctrlKey && ['r', 'w', 't', 'n'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
    }
    
    // Block Alt+F4
    if (e.altKey && e.key === 'F4') {
        e.preventDefault();
        return false;
    }
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================
function setupKioskEventListeners() {
    // Gesture events
    document.addEventListener('gesturestart', blockGestures, { passive: false });
    document.addEventListener('gesturechange', blockGestures, { passive: false });
    document.addEventListener('gestureend', blockGestures, { passive: false });
    
    // Zoom via wheel
    document.addEventListener('wheel', blockZoom, { passive: false });
    
    // Context menu
    document.addEventListener('contextmenu', blockContextMenu);
    
    // Text selection & drag
    document.addEventListener('selectstart', blockSelection);
    document.addEventListener('dragstart', blockSelection);
    
    // Copy/Cut/Paste
    document.addEventListener('copy', blockCopyPaste);
    document.addEventListener('cut', blockCopyPaste);
    document.addEventListener('paste', blockCopyPaste);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', blockKeyboardShortcuts);
    
    // Fullscreen change
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(event => {
        document.addEventListener(event, handleFullscreenChange);
    });
}

function handleFullscreenChange() {
    if (isKioskModeActive && !isFullscreenActive()) {
        console.log('⚠️ Fullscreen exited, watchdog will restore');
    }
}

// ========================================
// AUTO FULLSCREEN ON INTERACTION
// ========================================
function setupAutoFullscreen() {
    const triggerFullscreen = () => {
        if (isKioskModeActive && !isFullscreenActive()) {
            goFullscreen();
        }
    };
    
    document.addEventListener('touchstart', triggerFullscreen, { passive: true });
    document.addEventListener('click', triggerFullscreen);
}

// ========================================
// ENTER KIOSK MODE
// ========================================
function enterKioskMode() {
    isKioskModeActive = true;
    localStorage.setItem('kiosk_mode_active', 'true');
    localStorage.setItem('kiosk_mode_timestamp', Date.now().toString());
    
    applySuperKioskStyles();
    goFullscreen();
    startFullscreenWatchdog();
    updateKioskControlButton();
    
    console.log('🔒 Super Kiosk Mode ACTIVATED');
    
    // Show toast if available
    if (typeof showToast === 'function') {
        showToast('🔒 Kiosk Mode', 'Super Kiosk Mode diaktifkan', 'success', 3000);
    }
    
    // Broadcast to other tabs
    localStorage.setItem('kiosk_mode_sync', Date.now().toString());
}

// ========================================
// EXIT KIOSK MODE
// ========================================
function exitKioskMode() {
    isKioskModeActive = false;
    localStorage.removeItem('kiosk_mode_active');
    localStorage.removeItem('kiosk_mode_timestamp');
    
    stopFullscreenWatchdog();
    removeSuperKioskStyles();
    exitFullscreen();
    updateKioskControlButton();
    
    console.log('🔓 Super Kiosk Mode DEACTIVATED');
    
    if (typeof showToast === 'function') {
        showToast('🔓 Kiosk Mode', 'Kiosk Mode dinonaktifkan', 'info', 3000);
    }
    
    // Broadcast to other tabs
    localStorage.setItem('kiosk_mode_sync', Date.now().toString());
}

// ========================================
// VERIFY CREDENTIALS
// ========================================
function verifyKioskCredentials(email, password) {
    return email === KIOSK_CREDENTIALS.email && password === KIOSK_CREDENTIALS.password;
}

// ========================================
// LOGIN MODAL
// ========================================
function createKioskLoginModal() {
    if (document.getElementById('kiosk-login-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'kiosk-login-modal';
    modal.innerHTML = `
        <style>
            #kiosk-login-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                backdrop-filter: blur(5px);
            }
            
            #kiosk-login-modal.active {
                display: flex;
            }
            
            .kiosk-login-box {
                background: white;
                border-radius: 20px;
                padding: 32px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
                animation: kioskSlideIn 0.3s ease;
            }
            
            @keyframes kioskSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .kiosk-login-header {
                text-align: center;
                margin-bottom: 24px;
            }
            
            .kiosk-login-icon {
                width: 70px;
                height: 70px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
                font-size: 32px;
                color: white;
            }
            
            .kiosk-login-icon.exit-mode {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            
            .kiosk-login-header h2 {
                margin: 0 0 8px;
                font-size: 22px;
                color: #1f2937;
            }
            
            .kiosk-login-header p {
                margin: 0;
                color: #6b7280;
                font-size: 14px;
            }
            
            .kiosk-login-form {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            
            .kiosk-input-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            
            .kiosk-input-group label {
                font-size: 14px;
                font-weight: 600;
                color: #374151;
            }
            
            .kiosk-input-group input {
                padding: 14px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 10px;
                font-size: 15px;
                transition: all 0.2s;
                outline: none;
            }
            
            .kiosk-input-group input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .kiosk-login-error {
                background: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 12px;
                border-radius: 8px;
                font-size: 13px;
                display: none;
                align-items: center;
                gap: 8px;
            }
            
            .kiosk-login-error.show {
                display: flex;
            }
            
            .kiosk-login-buttons {
                display: flex;
                gap: 12px;
                margin-top: 8px;
            }
            
            .kiosk-btn {
                flex: 1;
                padding: 14px 20px;
                border: none;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .kiosk-btn-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
            }
            
            .kiosk-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
            
            .kiosk-btn-primary.exit-mode {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            }
            
            .kiosk-btn-primary.exit-mode:hover {
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
            }
            
            .kiosk-btn-secondary {
                background: #f3f4f6;
                color: #374151;
            }
            
            .kiosk-btn-secondary:hover {
                background: #e5e7eb;
            }
        </style>
        
        <div class="kiosk-login-box">
            <div class="kiosk-login-header">
                <div class="kiosk-login-icon" id="kiosk-login-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2 id="kiosk-login-title">Kiosk Mode</h2>
                <p id="kiosk-login-subtitle">Masukkan kredensial untuk melanjutkan</p>
            </div>
            
            <form class="kiosk-login-form" id="kiosk-login-form" onsubmit="return handleKioskLogin(event)">
                <div class="kiosk-login-error" id="kiosk-login-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <span id="kiosk-error-text">Email atau password salah</span>
                </div>
                
                <div class="kiosk-input-group">
                    <label for="kiosk-email">Email</label>
                    <input type="email" id="kiosk-email" placeholder="Masukkan email" required autocomplete="off">
                </div>
                
                <div class="kiosk-input-group">
                    <label for="kiosk-password">Password</label>
                    <input type="password" id="kiosk-password" placeholder="Masukkan password" required autocomplete="off">
                </div>
                
                <div class="kiosk-login-buttons">
                    <button type="button" class="kiosk-btn kiosk-btn-secondary" onclick="hideKioskLoginModal()">Batal</button>
                    <button type="submit" class="kiosk-btn kiosk-btn-primary" id="kiosk-submit-btn">Masuk</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showKioskLoginModal(mode = 'enter') {
    createKioskLoginModal();
    
    const modal = document.getElementById('kiosk-login-modal');
    const icon = document.getElementById('kiosk-login-icon');
    const title = document.getElementById('kiosk-login-title');
    const subtitle = document.getElementById('kiosk-login-subtitle');
    const submitBtn = document.getElementById('kiosk-submit-btn');
    const error = document.getElementById('kiosk-login-error');
    
    // Reset form
    document.getElementById('kiosk-email').value = '';
    document.getElementById('kiosk-password').value = '';
    error.classList.remove('show');
    
    // Set mode
    modal.dataset.mode = mode;
    
    if (mode === 'exit') {
        icon.classList.add('exit-mode');
        icon.innerHTML = '<i class="fas fa-unlock"></i>';
        title.textContent = 'Keluar Kiosk Mode';
        subtitle.textContent = 'Masukkan kredensial untuk menonaktifkan kiosk mode';
        submitBtn.textContent = 'Nonaktifkan';
        submitBtn.classList.add('exit-mode');
    } else {
        icon.classList.remove('exit-mode');
        icon.innerHTML = '<i class="fas fa-lock"></i>';
        title.textContent = 'Aktifkan Kiosk Mode';
        subtitle.textContent = 'Masukkan kredensial untuk mengaktifkan kiosk mode';
        submitBtn.textContent = 'Aktifkan';
        submitBtn.classList.remove('exit-mode');
    }
    
    modal.classList.add('active');
    
    // Focus email input
    setTimeout(() => {
        document.getElementById('kiosk-email').focus();
    }, 300);
}

function hideKioskLoginModal() {
    const modal = document.getElementById('kiosk-login-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleKioskLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('kiosk-email').value.trim();
    const password = document.getElementById('kiosk-password').value;
    const error = document.getElementById('kiosk-login-error');
    const modal = document.getElementById('kiosk-login-modal');
    const mode = modal.dataset.mode;
    
    if (verifyKioskCredentials(email, password)) {
        hideKioskLoginModal();
        
        if (mode === 'exit') {
            exitKioskMode();
        } else {
            enterKioskMode();
        }
    } else {
        error.classList.add('show');
        document.getElementById('kiosk-password').value = '';
        document.getElementById('kiosk-password').focus();
        
        // Shake animation
        const box = document.querySelector('.kiosk-login-box');
        box.style.animation = 'none';
        setTimeout(() => {
            box.style.animation = 'kioskShake 0.5s ease';
        }, 10);
    }
    
    return false;
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes kioskShake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// ========================================
// STORAGE SYNC ACROSS TABS
// ========================================
function setupStorageSync() {
    window.addEventListener('storage', (e) => {
        if (e.key === 'kiosk_mode_active' || e.key === 'kiosk_mode_sync') {
            const shouldBeActive = localStorage.getItem('kiosk_mode_active') === 'true';
            
            if (shouldBeActive && !isKioskModeActive) {
                isKioskModeActive = true;
                applySuperKioskStyles();
                startFullscreenWatchdog();
                goFullscreen();
                updateKioskControlButton();
                console.log('🔄 Kiosk Mode synced ON from other tab');
            } else if (!shouldBeActive && isKioskModeActive) {
                isKioskModeActive = false;
                stopFullscreenWatchdog();
                removeSuperKioskStyles();
                exitFullscreen();
                updateKioskControlButton();
                console.log('🔄 Kiosk Mode synced OFF from other tab');
            }
        }
    });
}

// ========================================
// KIOSK CONTROL BUTTON FOR DASHBOARD
// ========================================
function createKioskControlButton() {
    // Only create on dashboard
    const path = window.location.pathname.toLowerCase();
    if (!path.includes('dashboard.html') && path !== '/' && !path.endsWith('/')) {
        return;
    }
    
    if (document.getElementById('kiosk-control-btn')) return;
    
    const style = document.createElement('style');
    style.id = 'kiosk-control-style';
    style.textContent = `
        .kiosk-control-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
            z-index: 9999;
            transition: all 0.3s ease;
        }
        
        .kiosk-control-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }
        
        .kiosk-control-button.active {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
        
        .kiosk-control-button.active:hover {
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
        }
        
        .kiosk-control-button i {
            font-size: 16px;
        }
        
        @media (max-width: 480px) {
            .kiosk-control-button {
                padding: 10px 16px;
                font-size: 12px;
                bottom: 15px;
                left: 15px;
            }
            
            .kiosk-control-button i {
                font-size: 14px;
            }
        }
    `;
    
    if (!document.getElementById('kiosk-control-style')) {
        document.head.appendChild(style);
    }
    
    const btn = document.createElement('button');
    btn.id = 'kiosk-control-btn';
    btn.className = 'kiosk-control-button' + (isKioskModeActive ? ' active' : '');
    btn.innerHTML = isKioskModeActive 
        ? '<i class="fas fa-unlock"></i> Keluar Kiosk Mode'
        : '<i class="fas fa-lock"></i> Aktifkan Kiosk Mode';
    btn.onclick = () => showKioskLoginModal(isKioskModeActive ? 'exit' : 'enter');
    
    document.body.appendChild(btn);
}

function updateKioskControlButton() {
    const btn = document.getElementById('kiosk-control-btn');
    
    if (btn) {
        btn.innerHTML = isKioskModeActive 
            ? '<i class="fas fa-unlock"></i> Keluar Kiosk Mode'
            : '<i class="fas fa-lock"></i> Aktifkan Kiosk Mode';
        
        if (isKioskModeActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
}

// ========================================
// INSTANT FULLSCREEN RESTORE (NO PROMPT)
// ========================================
let fullscreenRestoreAttempts = 0;
const MAX_FULLSCREEN_ATTEMPTS = 20;

function aggressiveFullscreenRestore() {
    if (!isKioskModeActive) return;
    if (isFullscreenActive()) return;
    if (fullscreenRestoreAttempts >= MAX_FULLSCREEN_ATTEMPTS) return;
    
    fullscreenRestoreAttempts++;
    console.log(`🔄 Fullscreen attempt ${fullscreenRestoreAttempts}/${MAX_FULLSCREEN_ATTEMPTS}...`);
    
    goFullscreen();
    
    // Keep trying rapidly
    setTimeout(() => {
        if (isKioskModeActive && !isFullscreenActive()) {
            aggressiveFullscreenRestore();
        }
    }, 200);
}

// Auto-fullscreen on ANY user interaction when kiosk mode is active
function setupAggressiveAutoFullscreen() {
    const triggerFullscreen = (e) => {
        if (isKioskModeActive && !isFullscreenActive()) {
            console.log('👆 User interaction detected, restoring fullscreen...');
            fullscreenRestoreAttempts = 0;
            goFullscreen();
        }
    };
    
    // Listen to ALL possible user interactions
    ['click', 'touchstart', 'touchend', 'mousedown', 'keydown', 'keypress', 'mousemove', 'scroll'].forEach(event => {
        document.addEventListener(event, triggerFullscreen, { passive: true, capture: true });
    });
}

// Create invisible trigger that auto-clicks to force fullscreen
function createInstantFullscreenTrigger() {
    if (!isKioskModeActive) return;
    if (isFullscreenActive()) return;
    
    // Create invisible fullscreen trigger overlay
    const trigger = document.createElement('div');
    trigger.id = 'instant-fullscreen-trigger';
    trigger.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: transparent;
        z-index: 999999;
        cursor: default;
    `;
    
    // When user touches/clicks anywhere, enter fullscreen immediately
    const enterFullscreenAndRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        goFullscreen();
        
        // Remove trigger after fullscreen
        setTimeout(() => {
            trigger.remove();
        }, 100);
    };
    
    trigger.addEventListener('click', enterFullscreenAndRemove, { once: true });
    trigger.addEventListener('touchstart', enterFullscreenAndRemove, { once: true, passive: false });
    trigger.addEventListener('mousedown', enterFullscreenAndRemove, { once: true });
    
    document.body.appendChild(trigger);
    
    // Simulate click/touch to trigger fullscreen immediately
    // This works because the page just loaded and user "interaction" from previous page carries over
    setTimeout(() => {
        if (!isFullscreenActive()) {
            // Try to programmatically trigger
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            trigger.dispatchEvent(clickEvent);
        }
    }, 50);
    
    // If still not fullscreen, the overlay will catch the first real interaction
    // Auto-remove after 5 seconds if fullscreen is achieved
    const checkAndRemove = setInterval(() => {
        if (isFullscreenActive() || !isKioskModeActive) {
            trigger.remove();
            clearInterval(checkAndRemove);
        }
    }, 100);
    
    // Force remove after 10 seconds anyway
    setTimeout(() => {
        if (trigger.parentNode) {
            trigger.remove();
        }
        clearInterval(checkAndRemove);
    }, 10000);
}

// ========================================
// INITIALIZATION
// ========================================
function initSuperKioskMode() {
    console.log('🚀 Initializing Super Kiosk Mode...');
    
    // Setup event listeners
    setupKioskEventListeners();
    setupAutoFullscreen();
    setupAggressiveAutoFullscreen();
    setupStorageSync();
    
    // Check if kiosk mode was active (from previous page/session)
    const kioskModeStatus = localStorage.getItem('kiosk_mode_active');
    
    if (kioskModeStatus === 'true') {
        isKioskModeActive = true;
        applySuperKioskStyles();
        startFullscreenWatchdog();
        
        console.log('🔒 Super Kiosk Mode restored from previous session');
        console.log('📍 Current page:', window.location.pathname);
        
        // INSTANT fullscreen attempts - no delay, no prompt
        goFullscreen();
        
        setTimeout(() => goFullscreen(), 50);
        setTimeout(() => goFullscreen(), 100);
        setTimeout(() => goFullscreen(), 200);
        setTimeout(() => goFullscreen(), 300);
        setTimeout(() => goFullscreen(), 500);
        
        // Create invisible trigger that catches first interaction
        setTimeout(() => {
            if (!isFullscreenActive()) {
                createInstantFullscreenTrigger();
            }
        }, 100);
        
        // Keep trying aggressively
        setTimeout(() => {
            if (!isFullscreenActive()) {
                aggressiveFullscreenRestore();
            }
        }, 600);
    }
    
    // Create control button on dashboard
    createKioskControlButton();
    
    console.log('✅ Super Kiosk Mode initialized');
}

// ========================================
// GLOBAL FUNCTIONS (for external access)
// ========================================
window.enterKioskMode = enterKioskMode;
window.exitKioskMode = exitKioskMode;
window.showKioskLoginModal = showKioskLoginModal;
window.hideKioskLoginModal = hideKioskLoginModal;
window.handleKioskLogin = handleKioskLogin;
window.isKioskModeActive = () => isKioskModeActive;

// ========================================
// START
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSuperKioskMode);
} else {
    initSuperKioskMode();
}