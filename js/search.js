/* ==========================================================================
   HYNA STUDIO - STUDENT SEARCH ENGINE
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

let currentActiveSearchTab = "STUDENTS";

function setGlobalSearchTab(tab, btnElem) {
    currentActiveSearchTab = tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    if (btnElem) btnElem.classList.add("active");
    performGlobalSearch();
}

function performGlobalSearch() {
    const container = document.getElementById("search-results-container");
    if (!container) return;

    const query = document.getElementById("global-search-input") ? document.getElementById("global-search-input").value.toLowerCase().trim() : "";

    const students = getStoreData("students") || [];
    let results = [];

    // Search Students
    students.forEach(s => {
        const matchName = s.name && s.name.toLowerCase().includes(query);
        const matchReg = s.registerNo && s.registerNo.toLowerCase().includes(query);
        const matchRoll = s.rollNo && s.rollNo.toLowerCase().includes(query);
        const matchErp = s.erpId && s.erpId.toLowerCase().includes(query);
        const matchDept = s.department && s.department.toLowerCase().includes(query);
        const matchPhone = s.phone && s.phone.toLowerCase().includes(query);
        const matchEmail = s.email && s.email.toLowerCase().includes(query);

        if (!query || matchName || matchReg || matchRoll || matchErp || matchDept || matchPhone || matchEmail) {
            results.push({
                id: s.id,
                title: s.name,
                category: "Student",
                registerNo: s.registerNo,
                rollNo: s.rollNo || "N/A",
                erpId: s.erpId || "N/A",
                desc: `${s.department || 'Computer Science'} • Year ${s.year || 'II'} - ${s.section || 'A'}`,
                stats: `${s.projects || 0} Projects • ${s.certificates || 0} Certs • ${s.internships || 0} Internships`,
                status: s.activityStatus || "Active",
                avatar: s.avatar || "",
                link: "students.html"
            });
        }
    });

    // Update count display
    const countDisplay = document.getElementById("search-results-count");
    if (countDisplay) countDisplay.innerText = `${results.length} student${results.length === 1 ? '' : 's'} found`;

    if (results.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="empty-state" style="text-align: center; padding: 3rem 1rem;">
                    <div class="empty-state-icon" style="font-size: 2.5rem; color: var(--text-muted); margin-bottom: 1rem;">
                        <i class="fa-solid fa-user-slash"></i>
                    </div>
                    <div class="empty-state-title font-bold text-main" style="font-size: 1.15rem; margin-bottom: 0.5rem;">No Matching Students Found</div>
                    <div class="empty-state-desc text-muted text-sm">Try searching with a different name, register number, or roll number.</div>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = results.map(r => `
        <div class="card mb-3" style="margin-bottom: 1rem;">
            <div class="d-flex align-items-center justify-content-between flex-wrap" style="gap: 1rem;">
                <div class="d-flex align-items-center gap-3">
                    ${r.avatar 
                        ? `<img src="${r.avatar}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" alt="${r.title}">` 
                        : `<div class="stat-icon-wrapper stat-icon-primary" style="width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;"><i class="fa-solid fa-user-graduate"></i></div>`
                    }
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
                            <span class="status-badge status-submitted" style="font-family: monospace; font-size: 0.75rem;">${r.registerNo}</span>
                            <span class="status-badge status-verified">${r.status}</span>
                        </div>
                        <h4 class="font-bold text-main text-md" style="margin: 0;"><a href="${r.link}">${r.title}</a></h4>
                        <div class="text-muted text-xs my-1">${r.desc}</div>
                        <div class="text-light text-xs"><i class="fa-solid fa-chart-simple me-1"></i> ${r.stats}</div>
                    </div>
                </div>
                <a href="${r.link}" class="btn btn-sm btn-secondary">
                    View in Directory <i class="fa-solid fa-arrow-right ms-1"></i>
                </a>
            </div>
        </div>
    `).join('');
}
