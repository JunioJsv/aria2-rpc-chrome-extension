import {showNotification} from "./notifications.js";

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

chrome.downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
    if (downloadItem.fileSize > 0) suggest()
})

chrome.downloads.onCreated.addListener((downloadItem) => {
    let {id: downloadId, finalUrl: downloadUrl, fileSize} = downloadItem
    if (fileSize < 1) return
    chrome.downloads.cancel(downloadId, () => {
        chrome.storage.local.get(['ARIA2_RPC_URL', 'ARIA2_SECRET'], (data) => {
            sendToAria2(
                downloadId,
                downloadUrl,
                data.ARIA2_RPC_URL,
                data.ARIA2_SECRET,
            );
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
                showNotification(
                    chrome.i18n.getMessage("downloadSent"),
                    chrome.i18n.getMessage("downloadSentMessage"),
                );
                chrome.downloads.erase({id: downloadId})
            } else {
                showNotification(
                    chrome.i18n.getMessage("aria2Error"),
                    chrome.i18n.getMessage("aria2ErrorMessage"),
                );
            }
        })
        .catch(error => {
            showNotification(
                chrome.i18n.getMessage("connectionError"),
                chrome.i18n.getMessage("connectionErrorMessage"),
            );
        });
}
