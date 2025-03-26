export function showNotification(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: title,
        message: message,
        priority: 2
    });
}
