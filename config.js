localizeHtmlPage();
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['ARIA2_RPC_URL', 'ARIA2_SECRET'], (data) => {
        document.getElementById('rpcUrl').value = data.ARIA2_RPC_URL || "http://localhost:6800/jsonrpc";
        document.getElementById('rpcSecret').value = data.ARIA2_SECRET || "";
    });
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const rpcUrl = document.getElementById('rpcUrl').value;
    const rpcSecret = document.getElementById('rpcSecret').value;

    chrome.storage.local.set({ ARIA2_RPC_URL: rpcUrl, ARIA2_SECRET: rpcSecret }, () => {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: chrome.i18n.getMessage("configSaveSuccess"),
            message: chrome.i18n.getMessage("configSaveSuccessMessage"),
            priority: 2
        });
        window.close();
    });
});
