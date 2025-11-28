const KIOSK_PASSWORD = 'smkmarhas2025';
let isKioskModeActive = false;
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
function initKioskMode() {
    if (isExcludedPage()) {
        console.log(' Page excluded from kiosk mode');
        return;
    }
    const kioskModeStatus = localStorage.getItem('kiosk_mode_active');
    if (kioskModeStatus === 'true') {
        isKioskModeActive = true;
        applyKioskStyles();
        console.log(' Kiosk Mode CSS applied - Auto fullscreen active');
        setTimeout(() => {
            tryFullscreenAPI();
        }, 100);
    }
    document.addEventListener('keydown', preventF11);
    document.addEventListener('contextmenu', (e) => {
        if (isKioskModeActive) {
            e.preventDefault();
            return false;
        }
    });
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('storage', (e) => {
        if (e.key === 'kiosk_mode_active') {
            if (e.newValue === 'true' && !isKioskModeActive) {
                enterFullscreen();
                isKioskModeActive = true;
                console.log(' Kiosk Mode synced from other page');
            } else if (e.newValue === null && isKioskModeActive) {
                exitFullscreen();
                isKioskModeActive = false;
                console.log(' Kiosk Mode deactivated from other page');
            }
        }
    });
}
function enterFullscreen() {
    const elem = document.documentElement;
    const options = {
        navigationUI: "hide"
    };
    applyKioskStyles();
    if (elem.requestFullscreen) {
        elem.requestFullscreen(options).then(() => {
            console.log(' Fullscreen API activated');
        }).catch(err => {
            console.log(' Fullscreen API failed, using CSS fallback');
        });
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else {
        console.log(' Fullscreen API not supported, using CSS only');
    }
}
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
function preventF11(e) {
    if (e.key === 'F11' && isKioskModeActive) {
        e.preventDefault();
        e.stopPropagation();
        console.log(' F11 blocked - Kiosk Mode active');
        return false;
    }
    if (e.key === 'Escape' && isKioskModeActive) {
        e.preventDefault();
        e.stopPropagation();
        console.log(' ESC blocked - Kiosk Mode active');
        return false;
    }
}
function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || 
                        document.webkitFullscreenElement || 
                        document.mozFullScreenElement || 
                        document.msFullscreenElement;
    if (isFullscreen && isKioskModeActive) {
        applyKioskStyles();
    } else if (!isFullscreen && isKioskModeActive) {
        console.log(' Fullscreen exited, deactivating kiosk mode');
        isKioskModeActive = false;
        localStorage.removeItem('kiosk_mode_active');
        removeKioskStyles();
    }
}
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
function exitKioskMode() {
    isKioskModeActive = false;
    localStorage.removeItem('kiosk_mode_active');
    exitFullscreen();
    console.log(' Kiosk Mode deactivated');
    if (typeof showToast === 'function') {
        showToast(' Kiosk Mode', 'Kiosk Mode dinonaktifkan.', 'info', 3000);
    }
}
function verifyKioskPassword(password) {
    return password === KIOSK_PASSWORD;
}
function tryFullscreenAPI() {
    const elem = document.documentElement;
    const options = { navigationUI: "hide" };
    if (elem.requestFullscreen) {
        elem.requestFullscreen(options).catch(() => {
        });
    } else if (elem.webkitRequestFullscreen) {
        try { elem.webkitRequestFullscreen(); } catch(e) {}
    } else if (elem.mozRequestFullScreen) {
        try { elem.mozRequestFullScreen(); } catch(e) {}
    } else if (elem.msRequestFullscreen) {
        try { elem.msRequestFullscreen(); } catch(e) {}
    }
}
function applyKioskStyles() {
    document.documentElement.classList.add('kiosk-fullscreen');
    document.body.classList.add('kiosk-fullscreen');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
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
function removeKioskStyles() {
    document.documentElement.classList.remove('kiosk-fullscreen');
    document.body.classList.remove('kiosk-fullscreen');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKioskMode);
} else {
    initKioskMode();
}