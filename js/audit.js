/* ==========================================================================
   HYNA STUDIO - AUDIT LOG MANAGER
   ========================================================================== */

function addAuditLog(action, target, status = "Success") {
    const logs = getStoreData("audit_logs");
    const currentUser = getCurrentUser();
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLog = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        user: currentUser ? currentUser.name : "System User",
        action: action,
        target: target,
        date: dateStr,
        time: timeStr,
        status: status
    };

    logs.unshift(newLog); // Put newest log at top
    setStoreData("audit_logs", logs);
}

function renderAuditLogsTable(containerId = "audit-table-body", searchInputId = "audit-search") {
    const tbody = document.getElementById(containerId);
    if (!tbody) return;

    const searchVal = document.getElementById(searchInputId) ? document.getElementById(searchInputId).value.toLowerCase() : "";
    let logs = getStoreData("audit_logs");

    if (searchVal) {
        logs = logs.filter(l => 
            l.user.toLowerCase().includes(searchVal) ||
            l.action.toLowerCase().includes(searchVal) ||
            l.target.toLowerCase().includes(searchVal)
        );
    }

    if (logs.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                        <div class="empty-state-title">No Audit Logs Recorded</div>
                        <div class="empty-state-desc">System actions will automatically appear here.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = logs.map(l => `
        <tr>
            <td class="font-semibold">${l.user}</td>
            <td><span class="font-semibold text-primary">${l.action}</span></td>
            <td>${l.target}</td>
            <td>${l.date}</td>
            <td class="text-muted">${l.time}</td>
            <td>
                <span class="status-badge status-verified">${l.status}</span>
            </td>
        </tr>
    `).join('');
}
