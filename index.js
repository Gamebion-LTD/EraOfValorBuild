function init() {
	// ServiceWorker clean
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister().then(success => {
                    if (success) {
                        console.log('Service Worker unregistered:', registration);
                    } else {
                        console.warn('Service Worker unregister error:', registration);
                    }
                });
            });
        }).catch(error => {
            console.error('Service Workers error:', error);
        });
    } else {
        console.warn('Service Workers is not available');
    }

    // Cache storage clean
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName).then(success => {
                    if (success) {
                        console.log(`Cache "${cacheName}" deleted.`);
                    } else {
                        console.warn(`Failed to delete cache "${cacheName}".`);
                    }
                });
            });
        }).catch(error => {
            console.error('Error retrieving caches:', error);
        });
    } else {
        console.warn('Cache Storage is not supported in this browser.');
    }

	// Telegram SDK init
	Telegram.WebApp.expand();
	Telegram.WebApp.ready();
}

window.onload = init;
