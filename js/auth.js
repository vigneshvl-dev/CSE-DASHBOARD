/* ==========================================================================
   HYNA STUDIO - AUTHENTICATION & DEMO ROLE MANAGER
   ========================================================================== */

function getCurrentRole() {
    return localStorage.getItem("hyna_selected_role") || "Student";
}

function getCurrentUser() {
    const role = getCurrentRole();
    const users = getStoreData("users");
    
    // Find matching user by role
    const matched = users.find(u => u.role === role || (role === "HOD/Admin" && u.role.includes("HOD")));
    if (matched) return matched;

    // Fallback to first student if not found
    return users[0];
}

function switchRole(newRole) {
    const validRoles = ["Student", "Faculty", "HOD/Admin", "System Admin"];
    if (!validRoles.includes(newRole)) return;

    localStorage.setItem("hyna_selected_role", newRole);
    
    // Log role switch audit
    if (window.addAuditLog) {
        window.addAuditLog("Role Switched", `Switched active role to ${newRole}`, "Success");
    }

    // Refresh current view or redirect to appropriate dashboard
    window.location.reload();
}

function logoutUser() {
    localStorage.removeItem("hyna_selected_role");
    window.location.href = "login.html";
}
