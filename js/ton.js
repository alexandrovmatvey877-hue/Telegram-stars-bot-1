let tonConnectUI = null;

function getTon() {

    if (!tonConnectUI) {

        tonConnectUI = new TON_CONNECT_UI.TonConnectUI({

            manifestUrl: window.location.origin + "/tonconnect-manifest.json"

        });

    }

    return tonConnectUI;
}

async function connectWallet() {

    const ui = getTon();

    await ui.openModal();

    return new Promise(resolve => {

        const unsubscribe = ui.onStatusChange(wallet => {

            if (!wallet) return;
//сиськи жопа сиьки жопа
            unsubscribe();
//сиськи жопа сиськи жопа е е
            resolve(wallet);

        });

    });

}

window.Ton = {

    connectWallet

};