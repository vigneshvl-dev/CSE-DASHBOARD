/* ==========================================================================
   HYNA STUDIO - NOTIFICATION MANAGER
   ========================================================================== */

function pushNotification(title, message, type = "info") {
    const notifications = getStoreData("notifications");
    
    const now = new Date();
    const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotif = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: title,
        message: message,
        date: dateStr,
        read: false,
        type: type
    };

    notifications.unshift(newNotif);
    setStoreData("notifications", notifications);
}

function markNotificationRead(id) {
    let notifications = getStoreData("notifications");
    notifications = notifications.map(n => {
        if (n.id === id) n.read = true;
        return n;
    });
    setStoreData("notifications", notifications);
    if (window.renderNotificationsList) renderNotificationsList();
    if (window.updateNavbarNotificationBadge) updateNavbarNotificationBadge();
}

function markAllNotificationsRead() {
    let notifications = getStoreData("notifications");
    notifications = notifications.map(n => {
        n.read = true;
        return n;
    });
    setStoreData("notifications", notifications);
    if (window.renderNotificationsList) renderNotificationsList();
    if (window.updateNavbarNotificationBadge) updateNavbarNotificationBadge();
}

function renderNotificationsList(containerId = "notifications-list-container") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const notifications = getStoreData("notifications");

    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon"><i class="fa-regular fa-bell"></i></div>
                <div class="empty-state-title">No Notifications Yet</div>
                <div class="empty-state-desc">You're all caught up! Updates about your submissions will appear here.</div>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications.map(n => `
        <div class="card mb-3 ${n.read ? 'opacity-75' : 'border-primary'}" style="margin-bottom: 0.75rem;">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-start gap-3">
                    <div class="stat-icon-wrapper ${n.type === 'success' ? 'stat-icon-teal' : 'stat-icon-primary'}">
                        <i class="fa-solid ${n.type === 'success' ? 'fa-circle-check' : 'fa-bell'}"></i>
                    </div>
                    <div>
                        <div class="font-bold text-main d-flex align-items-center gap-2">
                            ${n.title}
                            ${!n.read ? '<span class="status-badge status-submitted" style="font-size: 0.65rem;">NEW</span>' : ''}
                        </div>
                        <div class="text-muted text-sm my-1">${n.message}</div>
                        <div class="text-light text-xs">${n.date}</div>
                    </div>
                </div>
                ${!n.read ? `
                    <button onclick="markNotificationRead('${n.id}')" class="btn btn-sm btn-secondary" title="Mark as read">
                        <i class="fa-solid fa-check"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}
