/**
 * ========================================
 * KIOSK MODE / FULL SCREEN LOCK SYSTEM
 * SMK MARHAS Margahayu - Emergency Hotline System
 * ========================================
 * 
 * Fitur:
 * - Auto fullscreen saat page load (jika kiosk mode aktif)
 * - Block F11 dan Escape key
 * - Password protection untuk keluar
 * - Sync dengan localStorage untuk multi-page support
 * - Prevent right click
 * - Exclude: admin.html, login-admin.html, emergency-dashboard.html
 */

// Password untuk keluar dari kiosk mode
const KIOSK_PASSWORD = 'smkmarhas2025';
let isKioskModeActive = false;

// Check if current page should be excluded from kiosk mode
function isExcludedPage() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const excludedPages = [
        'admin.html',
        'login-admin.html', 
        'emergency-dashboard.html',
        'login-emergency.html'
    ];
    return excludedPages.includes(currentPage);
}

// Initialize Kiosk Mode
function initKioskMode() {
    // Check if page is excluded
    if (isExcludedPage()) {
        console.log('📄 Page excluded from kiosk mode');
        return;
    }

    // Check localStorage for kiosk mode status
    const kioskModeStatus = localStorage.getItem('kiosk_mode_active');
    
    if (kioskModeStatus === 'true') {
        // Set flag immediately
        isKioskModeActive = true;
        
        // Apply CSS fullscreen IMMEDIATELY - BENAR-BENAR OTOMATIS
        applyKioskStyles();
        console.log('🔒 Kiosk Mode CSS applied - Auto fullscreen active');
        
        // Try fullscreen API (background, no user interaction needed)
        setTimeout(() => {
            tryFullscreenAPI();
        }, 100);
    }

    // ALWAYS prevent F11 key when kiosk active
    document.addEventListener('keydown', preventF11);

    // Prevent right click
    document.addEventListener('contextmenu', (e) => {
        if (isKioskModeActive) {
            e.preventDefault();
            return false;
        }
    });

    // Monitor fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Monitor localStorage changes (untuk sync antar tab/page)
    window.addEventListener('storage', (e) => {
        if (e.key === 'kiosk_mode_active') {
            if (e.newValue === 'true' && !isKioskModeActive) {
                // Kiosk mode activated dari page lain
                enterFullscreen();
                isKioskModeActive = true;
                console.log('🔒 Kiosk Mode synced from other page');
            } else if (e.newValue === null && isKioskModeActive) {
                // Kiosk mode deactivated dari page lain
                exitFullscreen();
                isKioskModeActive = false;
                console.log('🔓 Kiosk Mode deactivated from other page');
            }
        }
    });
}

// Enter fullscreen
function enterFullscreen() {
    const elem = document.documentElement;
    
    const options = {
        navigationUI: "hide"
    };
    
    // Apply styles first (CSS fallback)
    applyKioskStyles();
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen(options).then(() => {
            console.log('✅ Fullscreen API activated');
        }).catch(err => {
            console.log('⚠️ Fullscreen API failed, using CSS fallback');
            // CSS already applied above
        });
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else {
        console.log('⚠️ Fullscreen API not supported, using CSS only');
    }
}

// Exit fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Prevent F11 and Escape keys
function preventF11(e) {
    // ALWAYS block F11 key when kiosk mode is active
    if (e.key === 'F11' && isKioskModeActive) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 F11 blocked - Kiosk Mode active');
        return false;
    }
    // Block Escape key (prevents exiting fullscreen)
    if (e.key === 'Escape' && isKioskModeActive) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 ESC blocked - Kiosk Mode active');
        return false;
    }
}

// Handle fullscreen change
function handleFullscreenChange() {
    // If user somehow exits fullscreen while kiosk mode is active
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement;
    
    if (isFullscreen && isKioskModeActive) {
        // Apply styles when fullscreen is active
        applyKioskStyles();
    } else if (!isFullscreen && isKioskModeActive) {
        // Auto-exit kiosk mode karena fullscreen sudah tidak aktif
        console.log('⚠️ Fullscreen exited, deactivating kiosk mode');
        isKioskModeActive = false;
        localStorage.removeItem('kiosk_mode_active');
        removeKioskStyles();
    }
}

// Show password modal for exit (hanya untuk dashboard yang punya modal)
function showKioskPasswordModal() {
    const modal = document.getElementById('kioskPasswordModal');
    if (modal) {
        const input = document.getElementById('kioskPasswordInput');
        const error = document.getElementById('kioskPasswordError');
        
        modal.classList.add('active');
        if (error) error.classList.remove('show');
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 300);
        }
    }
}

// Hide password modal
function hideKioskPasswordModal() {
    const modal = document.getElementById('kioskPasswordModal');
    if (modal) {
        const input = document.getElementById('kioskPasswordInput');
        const error = document.getElementById('kioskPasswordError');
        
        modal.classList.remove('active');
        if (error) error.classList.remove('show');
        if (input) input.value = '';
    }
}

// Exit Kiosk Mode (dengan password)
function exitKioskMode() {
    isKioskModeActive = false;
    localStorage.removeItem('kiosk_mode_active');
    exitFullscreen();
    
    console.log('🔓 Kiosk Mode deactivated');
    
    // Show success message (jika ada toast notification)
    if (typeof showToast === 'function') {
        showToast('🔓 Kiosk Mode', 'Kiosk Mode dinonaktifkan.', 'info', 3000);
    }
}

// Verify password
function verifyKioskPassword(password) {
    return password === KIOSK_PASSWORD;
}

// Try fullscreen API (silent, no user prompt)
function tryFullscreenAPI() {
    const elem = document.documentElement;
    const options = { navigationUI: "hide" };
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen(options).catch(() => {
            // Silent fail - CSS fullscreen already active
        });
    } else if (elem.webkitRequestFullscreen) {
        try { elem.webkitRequestFullscreen(); } catch(e) {}
    } else if (elem.mozRequestFullScreen) {
        try { elem.mozRequestFullScreen(); } catch(e) {}
    } else if (elem.msRequestFullscreen) {
        try { elem.msRequestFullscreen(); } catch(e) {}
    }
}

// Apply kiosk styles
function applyKioskStyles() {
    document.documentElement.classList.add('kiosk-fullscreen');
    document.body.classList.add('kiosk-fullscreen');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    // Extra CSS enforcement
    document.documentElement.style.width = '100vw';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.top = '0';
    document.documentElement.style.left = '0';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.top = '0';
    document.body.style.left = '0';
}

// Remove kiosk styles
function removeKioskStyles() {
    document.documentElement.classList.remove('kiosk-fullscreen');
    document.body.classList.remove('kiosk-fullscreen');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}

// DISABLED: Prevent page unload - menyebabkan alert saat auto-redirect
// window.addEventListener('beforeunload', (e) => {
//     if (isKioskModeActive) {
//         e.preventDefault();
//         e.returnValue = 'Anda yakin ingin meninggalkan halaman ini?';
//         return e.returnValue;
//     }
// });

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKioskMode);
} else {
    initKioskMode();
}
