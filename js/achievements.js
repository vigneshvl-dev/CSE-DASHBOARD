/* ==========================================================================
   HYNA STUDIO - ACHIEVEMENTS MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderAchievementsGrid();
});

function renderAchievementsGrid() {
    const container = document.getElementById("achievements-container");
    if (!container) return;

    const achievements = getStoreData("achievements");
    const searchVal = document.getElementById("ach-search-input") ? document.getElementById("ach-search-input").value.toLowerCase() : "";
    const selectedCategory = document.getElementById("ach-filter-category") ? document.getElementById("ach-filter-category").value : "ALL";

    let filtered = achievements.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchVal) ||
                              a.organization.toLowerCase().includes(searchVal);
        const matchesCategory = selectedCategory === "ALL" || a.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1 / -1;">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-trophy"></i></div>
                    <div class="empty-state-title">No Achievements Found</div>
                    <div class="empty-state-desc">Showcase your hackathon wins, research papers, awards, and honors.</div>
                    <button class="btn btn-primary btn-sm" onclick="openModal('add-achievement-modal')">
                        <i class="fa-solid fa-plus me-1"></i> Add Achievement
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(a => {
        let statusClass = "status-submitted";
        if (a.status === "Verified") statusClass = "status-verified";

        return `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="status-badge status-draft"><i class="fa-solid fa-tag me-1"></i> ${a.category}</span>
                        <span class="status-badge ${statusClass}">${a.status}</span>
                    </div>
                    <h3 class="font-bold text-main text-lg mb-1" style="font-size: 1.15rem;">${a.title}</h3>
                    <div class="text-muted text-xs mb-3">
                        <i class="fa-solid fa-building-columns me-1"></i> ${a.organization} • ${a.date}
                    </div>
                    <p class="text-muted text-sm mb-3">${a.description}</p>
                </div>

                <div>
                    <hr style="margin: 0.75rem 0; border: 0; border-top: 1px solid var(--border-color);">
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-xs text-muted"><i class="fa-solid fa-award me-1"></i> Evidence Verified</span>
                        <button onclick="alert('Viewing Evidence Certificate: ${a.evidenceFile || 'evidence.pdf'}')" class="btn btn-sm btn-secondary"><i class="fa-solid fa-file-pdf"></i> Proof</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function submitNewAchievement(e) {
    e.preventDefault();

    const title = document.getElementById("ach-title").value.trim();
    const category = document.getElementById("ach-category").value;
    const organization = document.getElementById("ach-org").value.trim();
    const date = document.getElementById("ach-date").value;
    const desc = document.getElementById("ach-desc").value.trim();

    const currentUser = getCurrentUser();

    const newAch = {
        id: `ACH-${Date.now().toString().slice(-4)}`,
        title: title,
        category: category,
        studentId: currentUser.id || "STU001",
        studentName: currentUser.name || "Demo Student",
        organization: organization,
        date: date || new Date().toISOString().split('T')[0],
        description: desc,
        status: "Submitted",
        evidenceFile: "achievement_proof.pdf"
    };

    const achievements = getStoreData("achievements");
    achievements.unshift(newAch);
    setStoreData("achievements", achievements);

    // Create Verification Record
    const verifications = getStoreData("verification");
    verifications.unshift({
        id: `VER-${Date.now().toString().slice(-4)}`,
        submissionId: newAch.id,
        submissionTitle: newAch.title,
        studentId: newAch.studentId,
        studentName: newAch.studentName,
        category: "Achievement",
        submittedDate: newAch.date,
        status: "Submitted",
        evidenceFile: newAch.evidenceFile,
        notes: "Achievement claim submitted."
    });
    setStoreData("verification", verifications);

    addAuditLog("Achievement Added", `Submitted achievement '${title}'`, "Success");
    pushNotification("Achievement Submitted", `Achievement '${title}' was submitted for faculty review.`, "info");

    showToast("Achievement recorded successfully!", "success");
    closeModal("add-achievement-modal");
    document.getElementById("add-achievement-form").reset();

    renderAchievementsGrid();
}
