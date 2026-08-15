/* ==========================================================================
   HYNA STUDIO - GLOBAL SEARCH ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // Check URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        const input = document.getElementById("global-search-input");
        if (input) input.value = query;
    }

    performGlobalSearch();
});

let currentActiveSearchTab = "ALL";

function setGlobalSearchTab(tab, btnElem) {
    currentActiveSearchTab = tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btnElem.classList.add("active");
    performGlobalSearch();
}

function performGlobalSearch() {
    const container = document.getElementById("search-results-container");
    if (!container) return;

    const query = document.getElementById("global-search-input") ? document.getElementById("global-search-input").value.toLowerCase().trim() : "";

    const students = getStoreData("students");
    const projects = getStoreData("projects");
    const certs = getStoreData("certificates");
    const internships = getStoreData("internships");
    const achievements = getStoreData("achievements");
    const hubPosts = getStoreData("hub_posts");

    let results = [];

    // Search Students
    if (currentActiveSearchTab === "ALL" || currentActiveSearchTab === "STUDENTS") {
        students.forEach(s => {
            if (!query || s.name.toLowerCase().includes(query) || s.registerNo.toLowerCase().includes(query)) {
                results.push({
                    title: s.name,
                    category: "Students",
                    desc: `${s.registerNo} • ${s.department} Year ${s.year}-${s.section}`,
                    date: "Active Student",
                    status: s.activityStatus || "Active",
                    icon: "fa-user-graduate",
                    link: "students.html"
                });
            }
        });
    }

    // Search Projects
    if (currentActiveSearchTab === "ALL" || currentActiveSearchTab === "PROJECTS") {
        projects.forEach(p => {
            if (!query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.technologies.some(t => t.toLowerCase().includes(query))) {
                results.push({
                    title: p.title,
                    category: "Projects",
                    desc: `${p.type} • Tech: ${p.technologies.join(', ')}`,
                    date: p.startDate,
                    status: p.status,
                    icon: "fa-diagram-project",
                    link: "projects.html"
                });
            }
        });
    }

    // Search Certificates
    if (currentActiveSearchTab === "ALL" || currentActiveSearchTab === "CERTIFICATES") {
        certs.forEach(c => {
            if (!query || c.title.toLowerCase().includes(query) || c.issuer.toLowerCase().includes(query)) {
                results.push({
                    title: c.title,
                    category: "Certificates",
                    desc: `Issued by ${c.issuer} • ID: ${c.credentialId || 'N/A'}`,
                    date: c.issueDate,
                    status: c.status,
                    icon: "fa-certificate",
                    link: "certificates.html"
                });
            }
        });
    }

    // Search Internships
    if (currentActiveSearchTab === "ALL" || currentActiveSearchTab === "INTERNSHIPS") {
        internships.forEach(i => {
            if (!query || i.company.toLowerCase().includes(query) || i.role.toLowerCase().includes(query)) {
                results.push({
                    title: `${i.role} at ${i.company}`,
                    category: "Internships",
                    desc: `Duration: ${i.duration} • Skills: ${(i.skills || []).join(', ')}`,
                    date: i.startDate,
                    status: i.status,
                    icon: "fa-briefcase",
                    link: "internships.html"
                });
            }
        });
    }

    // Search Achievements
    if (currentActiveSearchTab === "ALL" || currentActiveSearchTab === "ACHIEVEMENTS") {
        achievements.forEach(a => {
            if (!query || a.title.toLowerCase().includes(query) || a.organization.toLowerCase().includes(query)) {
                results.push({
                    title: a.title,
                    category: "Achievements",
                    desc: `${a.category} • Host: ${a.organization}`,
                    date: a.date,
                    status: a.status,
                    icon: "fa-trophy",
                    link: "achievements.html"
                });
            }
        });
    }

    // Search Hyna Hub
    if (currentActiveSearchTab === "ALL" || currentActiveSearchTab === "HYNA_HUB") {
        hubPosts.forEach(post => {
            if (!query || post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query) || post.authorName.toLowerCase().includes(query)) {
                results.push({
                    title: post.title,
                    category: "Hyna Hub",
                    desc: `Posted by ${post.authorName} • ${post.category}`,
                    date: post.date,
                    status: "Community Post",
                    icon: "fa-comments",
                    link: "hyna-hub.html"
                });
            }
        });
    }

    // Update count display
    const countDisplay = document.getElementById("search-results-count");
    if (countDisplay) countDisplay.innerText = `${results.length} search result${results.length === 1 ? '' : 's'} found`;

    if (results.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                    <div class="empty-state-title">No Matching Results Found</div>
                    <div class="empty-state-desc">Try checking your spelling or searching for a different keyword.</div>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(r => `
        <div class="card mb-3" style="margin-bottom: 1rem;">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                    <div class="stat-icon-wrapper stat-icon-primary">
                        <i class="fa-solid ${r.icon}"></i>
                    </div>
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="status-badge status-draft">${r.category}</span>
                            <span class="status-badge status-verified">${r.status}</span>
                        </div>
                        <h4 class="font-bold text-main text-md"><a href="${r.link}">${r.title}</a></h4>
                        <div class="text-muted text-xs my-1">${r.desc}</div>
                        <div class="text-light text-xs"><i class="fa-regular fa-clock me-1"></i> ${r.date}</div>
                    </div>
                </div>
                <a href="${r.link}" class="btn btn-sm btn-secondary">
                    View <i class="fa-solid fa-arrow-right ms-1"></i>
                </a>
            </div>
        </div>
    `).join('');
}
