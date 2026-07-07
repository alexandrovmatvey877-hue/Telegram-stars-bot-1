//все, я пошел работать 
let tonConnectUI = null;

function initTon() {
    if (typeof TON_CONNECT_UI === "undefined") {
        throw new Error("TonConnect UI не загружен");
    }

    if (!tonConnectUI) {
        tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: window.location.origin + "/tonconnect-manifest.json"
        });
    }

    return tonConnectUI;
}

async function connectWallet() {
    const ui = initTon();

    await ui.openModal();

    return ui.wallet;
}

window.Ton = {
    connectWallet
};