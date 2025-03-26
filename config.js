import {showNotification} from "./notifications.js";
import {localizeHtmlPage} from "./localize_html.js";

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

    chrome.storage.local.set({ARIA2_RPC_URL: rpcUrl, ARIA2_SECRET: rpcSecret}, () => {
        showNotification(
            chrome.i18n.getMessage("configSaveSuccess"),
            chrome.i18n.getMessage("configSaveSuccessMessage"),
        )
        window.close();
    });
});
