chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['ARIA2_RPC_URL', 'ARIA2_SECRET'], (data) => {
        if (!data.ARIA2_RPC_URL) {
            chrome.storage.local.set({ARIA2_RPC_URL: "http://localhost:6800/jsonrpc"});
        }
        if (!data.ARIA2_SECRET) {
            chrome.storage.local.set({ARIA2_SECRET: ""});
        }
    });
});

chrome.downloads.onCreated.addListener((downloadItem) => {
    chrome.downloads.cancel(downloadItem.id, () => {
        chrome.storage.local.get(['ARIA2_RPC_URL', 'ARIA2_SECRET'], (data) => {
            sendToAria2(downloadItem.id, downloadItem.finalUrl, data.ARIA2_RPC_URL, data.ARIA2_SECRET);
        });
    });
});

function sendToAria2(downloadId, downloadUrl, rpcUrl, rpcSecret) {
    const requestData = {
        jsonrpc: "2.0",
        id: "qwer",
        method: "aria2.addUri",
        params: [
            rpcSecret ? `token:${rpcSecret}` : null,
            [downloadUrl],
            {}
        ].filter(Boolean)
    };

    fetch(rpcUrl, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                showNotification("Download enviado!", "O Aria2 está baixando o arquivo.");
                chrome.downloads.erase({id: downloadId})
            } else {
                showNotification("Erro no Aria2", "O download não pôde ser enviado.");
            }
        })
        .catch(error => {
            showNotification("Erro de conexão", "Não foi possível se conectar ao Aria2.");
        });
}

function showNotification(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: title,
        message: message,
        priority: 2
    });
}
