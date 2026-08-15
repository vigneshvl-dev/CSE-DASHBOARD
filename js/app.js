/* ==========================================================================
   HYNA STUDIO - MASTER APPLICATION CONTROLLER & REUSABLE COMPONENTS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // Enforce light theme
    document.documentElement.removeAttribute("data-theme");

    renderSidebar();
    renderNavbar();
    updateNavbarNotificationBadge();
    setupGlobalModalKeyListeners();
});

// SIDEBAR RENDERER
function renderSidebar() {
    const sidebarContainer = document.getElementById("sidebar-container");
    if (!sidebarContainer) return;

    const currentRole = getCurrentRole();
    const currentPage = window.location.pathname.split("/").pop() || "student-dashboard.html";

    // Nav items list definition
    const navItems = [
        { label: "Dashboard", icon: "fa-chart-pie", href: "student-dashboard.html", roles: ["Student", "Faculty", "HOD/Admin", "System Admin"] },
        { label: "My Profile", icon: "fa-user-graduate", href: "student-profile.html", roles: ["Student", "Faculty", "HOD/Admin"] },
        { label: "Students", icon: "fa-users", href: "students.html", roles: ["Faculty", "HOD/Admin", "System Admin"] },
        { label: "Projects", icon: "fa-diagram-project", href: "projects.html", roles: ["Student", "Faculty", "HOD/Admin", "System Admin"] },
        { label: "Certificates", icon: "fa-certificate", href: "certificates.html", roles: ["Student", "Faculty", "HOD/Admin"] },
        { label: "Internships", icon: "fa-briefcase", href: "internships.html", roles: ["Student", "Faculty", "HOD/Admin"] },
        { label: "Achievements", icon: "fa-trophy", href: "achievements.html", roles: ["Student", "Faculty", "HOD/Admin"] },
        { label: "Hyna Hub", icon: "fa-comments", href: "hyna-hub.html", roles: ["Student", "Faculty", "HOD/Admin", "System Admin"] },
        { label: "Verification", icon: "fa-circle-check", href: "verification.html", roles: ["Faculty", "HOD/Admin", "System Admin"] },
        { label: "Search", icon: "fa-magnifying-glass", href: "search.html", roles: ["Student", "Faculty", "HOD/Admin", "System Admin"] },
        { label: "Reports", icon: "fa-file-lines", href: "reports.html", roles: ["Faculty", "HOD/Admin", "System Admin"] },
        { label: "Notifications", icon: "fa-bell", href: "notifications.html", roles: ["Student", "Faculty", "HOD/Admin", "System Admin"] },
        { label: "Audit Logs", icon: "fa-clipboard-list", href: "audit-logs.html", roles: ["HOD/Admin", "System Admin"] },
        { label: "Settings", icon: "fa-gear", href: "settings.html", roles: ["Student", "Faculty", "HOD/Admin", "System Admin"] }
    ];

    const currentUser = getCurrentUser();

    let brandTitle = "Stella Mary's CE";
    if (currentRole === "Student") brandTitle = "Stella Mary's Student";
    else if (currentRole === "Faculty") brandTitle = "Stella Mary's Staff";
    else if (currentRole === "HOD/Admin") brandTitle = "Stella Mary's HOD";
    else if (currentRole === "System Admin") brandTitle = "Stella Mary's Admin";

    sidebarContainer.innerHTML = `
        <aside class="sidebar" id="app-sidebar">
            <div class="sidebar-header">
                <a href="student-dashboard.html" class="sidebar-logo">
                    <img src="stella_marys_emblem.png" class="sidebar-logo-img" alt="Stella Mary's Logo">
                    <div class="sidebar-brand-text">
                        <span>${brandTitle}</span>
                        <span class="sidebar-brand-sub">Dept of CSE</span>
                    </div>
                </a>
            </div>
            
            <div class="sidebar-nav">
                <div class="nav-section-title">Main Menu</div>
                ${navItems.filter(item => item.roles.includes(currentRole)).map(item => {
                    const isActive = currentPage === item.href || (currentPage === "" && item.href === "student-dashboard.html");
                    return `
                        <a href="${item.href}" class="nav-item ${isActive ? 'active' : ''}">
                            <i class="fa-solid ${item.icon}"></i>
                            <span>${item.label}</span>
                        </a>
                    `;
                }).join('')}
            </div>

            <div class="sidebar-footer">
                <div class="role-switcher-box">
                    <div class="role-avatar">${currentUser ? currentUser.name.charAt(0) : 'U'}</div>
                    <div class="role-info">
                        <div class="role-name">${currentUser ? currentUser.name : 'Demo User'}</div>
                        <div class="role-badge-sm"><i class="fa-solid fa-user-shield"></i> ${currentRole}</div>
                    </div>
                </div>
            </div>
        </aside>
    `;
}

// NAVBAR RENDERER
function renderNavbar() {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    const currentUser = getCurrentUser();
    const currentRole = getCurrentRole();
    
    // Page Title mapping
    const path = window.location.pathname.split("/").pop();
    const titleMap = {
        "student-dashboard.html": "Dashboard Overview",
        "student-profile.html": "Student Profile & Portfolio",
        "projects.html": "Project Portfolio Management",
        "certificates.html": "Certificates Ledger",
        "internships.html": "Internship Tracker",
        "achievements.html": "Achievements & Awards",
        "hyna-hub.html": "Hyna Hub Community",
        "verification.html": "Faculty Verification Queue",
        "students.html": "Department Student Directory",
        "search.html": "Global Knowledge Search",
        "reports.html": "Analytics & Performance Reports",
        "notifications.html": "Notification Center",
        "audit-logs.html": "System Audit Trail",
        "settings.html": "Account Settings & Preferences"
    };

    const currentTitle = titleMap[path] || "Hyna Studio Portal";

    let breadcrumbTitle = "Stella Mary's CE";
    if (currentRole === "Student") breadcrumbTitle = "Stella Mary's Student";
    else if (currentRole === "Faculty") breadcrumbTitle = "Stella Mary's Staff";
    else if (currentRole === "HOD/Admin") breadcrumbTitle = "Stella Mary's HOD";

    navbarContainer.innerHTML = `
        <header class="top-navbar">
            <div class="navbar-left">
                <button class="sidebar-toggle-btn" onclick="toggleSidebar()" title="Toggle Sidebar">
                    <i class="fa-solid fa-bars"></i>
                </button>
                <div class="page-header-title">
                    <h1 class="page-title">${currentTitle}</h1>
                    <div class="breadcrumb">
                        <span>${breadcrumbTitle}</span>
                        <i class="fa-solid fa-chevron-right" style="font-size: 0.6rem;"></i>
                        <span class="text-primary font-semibold">${currentTitle}</span>
                    </div>
                </div>
            </div>

            <div class="navbar-right">
                <div class="global-search-bar">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="navbar-search-input" placeholder="Search portfolio..." onkeydown="handleNavbarSearch(event)">
                </div>

                <a href="notifications.html" class="nav-icon-btn" title="Notifications">
                    <i class="fa-regular fa-bell"></i>
                    <span class="notification-badge" id="nav-notif-badge" style="display: none;"></span>
                </a>

                <div class="user-profile-menu" onclick="toggleRoleDropdownMenu(event)">
                    <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}" class="user-avatar-img" alt="User Avatar">
                    <div class="user-menu-details">
                        <span class="user-menu-name">${currentUser.name}</span>
                        <span class="user-menu-role">${currentRole}</span>
                    </div>
                    <i class="fa-solid fa-chevron-down text-muted text-xs ms-1"></i>

                    <!-- Role Quick Switcher Popup -->
                    <div class="dropdown-menu-box" id="role-dropdown-menu">
                        <div class="dropdown-header">Switch Portal Role</div>
                        <button class="dropdown-item ${currentRole === 'Student' ? 'active' : ''}" onclick="switchRole('Student')">
                            <i class="fa-solid fa-user-graduate me-2"></i> Student Role
                        </button>
                        <button class="dropdown-item ${currentRole === 'Faculty' ? 'active' : ''}" onclick="switchRole('Faculty')">
                            <i class="fa-solid fa-chalkboard-user me-2"></i> Faculty Role
                        </button>
                        <button class="dropdown-item ${currentRole === 'HOD/Admin' ? 'active' : ''}" onclick="switchRole('HOD/Admin')">
                            <i class="fa-solid fa-user-tie me-2"></i> HOD / Admin Role
                        </button>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item text-danger" onclick="logoutUser()">
                            <i class="fa-solid fa-right-from-bracket me-2"></i> Go to Login Page
                        </button>
                    </div>
                </div>
            </div>
        </header>
    `;
}

// DROPDOWN MENU HANDLER
function toggleRoleDropdownMenu(event) {
    event.stopPropagation();
    const dropdown = document.getElementById("role-dropdown-menu");
    if (dropdown) {
        dropdown.classList.toggle("active");
    }
}

document.addEventListener("click", function () {
    const dropdown = document.getElementById("role-dropdown-menu");
    if (dropdown) dropdown.classList.remove("active");
});

// NAVBAR SEARCH REDIRECT
function handleNavbarSearch(event) {
    if (event.key === "Enter") {
        const query = event.target.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
}

// NOTIFICATION BADGE UPDATE
function updateNavbarNotificationBadge() {
    const notifBadge = document.getElementById("nav-notif-badge");
    if (!notifBadge) return;

    const notifications = getStoreData("notifications");
    const unreadCount = notifications.filter(n => !n.read).length;

    if (unreadCount > 0) {
        notifBadge.style.display = "block";
    } else {
        notifBadge.style.display = "none";
    }
}

// SIDEBAR MOBILE TOGGLE
function toggleSidebar() {
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) {
        sidebar.classList.toggle("mobile-open");
    }
}

// TOAST SYSTEM
function showToast(message, type = "success", title = "Notification") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconClass = "fa-circle-check";
    if (type === "warning") iconClass = "fa-triangle-exclamation";
    if (type === "error") iconClass = "fa-circle-xmark";

    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" class="text-muted border-0 bg-none ms-2">
            <i class="fa-solid fa-xmark"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// MODAL SYSTEM
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add("active");
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("active");
    }
}

function setupGlobalModalKeyListeners() {
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            const activeModals = document.querySelectorAll(".modal-backdrop.active");
            activeModals.forEach(m => m.classList.remove("active"));
        }
    });

    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("modal-backdrop")) {
            e.target.classList.remove("active");
        }
    });
}

/* DROPDOWN MENU CSS INJECTED DYNAMICALLY */
const style = document.createElement('style');
style.innerHTML = `
.dropdown-menu-box {
    position: absolute;
    top: 110%;
    right: 0;
    width: 230px;
    background-color: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    display: none;
    flex-direction: column;
    padding: 0.5rem 0;
    z-index: 200;
}
.dropdown-menu-box.active {
    display: flex;
}
.dropdown-header {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 0.4rem 1rem;
}
.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 1rem;
    font-size: 0.85rem;
    color: var(--text-main);
    transition: background-color var(--transition-fast);
}
.dropdown-item:hover {
    background-color: var(--bg-card-hover);
}
.dropdown-item.active {
    color: var(--primary);
    font-weight: 700;
}
.dropdown-divider {
    height: 1px;
    background-color: var(--border-color);
    margin: 0.4rem 0;
}
`;
document.head.appendChild(style);
