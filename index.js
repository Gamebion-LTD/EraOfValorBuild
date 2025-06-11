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

    const initData = Telegram.WebApp.initData;
    const mockData = "query_id=AAHqU7dAAAAAAM8G0efO3LNg&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Daniil%22%2C%22username%22%3A%22pandrodo%22%2C%22language_code%22%3A%22en%22%7D&auth_date=1718025300&hash=5fcd2c1a0e0fbb8e3ecf1a9a90e0e8ed394d58e1ed1474ac5a9e3e3d65bbd9d0";

    if (window.unityInstance) {
        console.log("send data from js init");
        window.unityInstance.SendMessage("TelegramBridge", "OnTelegramReady", mockData);
    }
}

window.onload = init;

async function createTransaction(price) {
    try {
        const connectedWallet = tonConnectUI.wallet;
        if (!connectedWallet) {
            return;
        }

        const toAddress = "UQBlvlMVBZ5sqM_fKc1qGCR5KrYHEbqjJCHBMYLAZ5vVTwKo";

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [
                {
                    address: toAddress,
                    amount: price,
                    payload: null
                }
            ]
        };

        await tonConnectUI.sendTransaction(transaction);
    } catch (error) {
        console.log("transaction error:", error);
    }
}

async function connectWallet() {
    const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
        manifestUrl: 'https://gamebion-ltd.github.io/EraOfValorBuild/manifest.json',
    });

    window.tonConnectUI = tonConnectUI;

    window.unityInstance.SendMessage("TelegramBridge", "OnWalletConnected", "xxxxx");

    const connectedWallet = await tonConnectUI.connectWallet();
    console.log("connected wallet", connectedWallet);

    if (connectedWallet && connectedWallet.account) {
        const walletAddress = connectedWallet.account.address;
        window.unityInstance.SendMessage("TelegramBridge", "OnWalletConnected", walletAddress);
    }
}

function toggleFullscreen(data) {
    if (Telegram.WebApp.isFullscreen) {
        Telegram.WebApp.exitFullscreen();
    } else {
        Telegram.WebApp.requestFullscreen();
    }
}
