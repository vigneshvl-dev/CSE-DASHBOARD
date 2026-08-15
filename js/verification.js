/* ==========================================================================
   HYNA STUDIO - FACULTY VERIFICATION QUEUE MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderVerificationQueue();
});

let currentActiveReviewId = null;

function renderVerificationQueue() {
    const tbody = document.getElementById("verification-table-body");
    if (!tbody) return;

    const verifications = getStoreData("verification");
    const searchVal = document.getElementById("verif-search-input") ? document.getElementById("verif-search-input").value.toLowerCase() : "";
    const filterStatus = document.getElementById("verif-filter-status") ? document.getElementById("verif-filter-status").value : "ALL";

    let filtered = verifications.filter(v => {
        const matchesSearch = v.studentName.toLowerCase().includes(searchVal) ||
                              v.submissionTitle.toLowerCase().includes(searchVal) ||
                              v.category.toLowerCase().includes(searchVal);
        const matchesStatus = filterStatus === "ALL" || v.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fa-solid fa-circle-check"></i></div>
                        <div class="empty-state-title">Verification Queue Empty</div>
                        <div class="empty-state-desc">All pending student portfolio submissions have been reviewed and verified.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(v => {
        let statusClass = "status-submitted";
        if (v.status === "Verified") statusClass = "status-verified";
        if (v.status === "Under Review") statusClass = "status-under-review";
        if (v.status === "Rejected") statusClass = "status-rejected";
        if (v.status === "Needs Changes") statusClass = "status-needs-changes";

        return `
            <tr>
                <td class="font-semibold">${v.studentName}</td>
                <td>
                    <div class="font-semibold text-main">${v.submissionTitle}</div>
                    <div class="text-muted text-xs">${v.notes || ''}</div>
                </td>
                <td><span class="status-badge status-draft">${v.category}</span></td>
                <td class="text-muted">${v.submittedDate}</td>
                <td><span class="status-badge ${statusClass}">${v.status}</span></td>
                <td>
                    <button onclick="openReviewModal('${v.id}')" class="btn btn-sm btn-primary">
                        <i class="fa-solid fa-magnifying-glass-chart me-1"></i> Review
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openReviewModal(verifId) {
    const verifications = getStoreData("verification");
    const v = verifications.find(item => item.id === verifId);
    if (!v) return;

    currentActiveReviewId = verifId;

    document.getElementById("review-student-name").innerText = v.studentName;
    document.getElementById("review-title").innerText = v.submissionTitle;
    document.getElementById("review-category").innerText = v.category;
    document.getElementById("review-date").innerText = v.submittedDate;
    document.getElementById("review-status-pill").innerText = v.status;
    document.getElementById("review-evidence-file").innerText = v.evidenceFile || "evidence_document.pdf";
    document.getElementById("review-notes-input").value = v.notes || "";

    openModal("review-submission-modal");
}

function processVerificationDecision(newStatus) {
    if (!currentActiveReviewId) return;

    let verifications = getStoreData("verification");
    const verifItem = verifications.find(v => v.id === currentActiveReviewId);
    if (!verifItem) return;

    const facultyUser = getCurrentUser();
    const notesInput = document.getElementById("review-notes-input").value.trim();

    verifItem.status = newStatus;
    verifItem.notes = notesInput || `Reviewed by ${facultyUser.name}`;

    setStoreData("verification", verifications);

    // Sync corresponding store item
    if (verifItem.category === "Project") {
        let projects = getStoreData("projects");
        projects = projects.map(p => p.id === verifItem.submissionId ? { ...p, status: newStatus } : p);
        setStoreData("projects", projects);
    } else if (verifItem.category === "Certificate") {
        let certs = getStoreData("certificates");
        certs = certs.map(c => c.id === verifItem.submissionId ? { ...c, status: newStatus } : c);
        setStoreData("certificates", certs);
    } else if (verifItem.category === "Internship") {
        let internships = getStoreData("internships");
        internships = internships.map(i => i.id === verifItem.submissionId ? { ...i, status: newStatus } : i);
        setStoreData("internships", internships);
    } else if (verifItem.category === "Achievement") {
        let achievements = getStoreData("achievements");
        achievements = achievements.map(a => a.id === verifItem.submissionId ? { ...a, status: newStatus } : a);
        setStoreData("achievements", achievements);
    }

    // Push notification to student
    pushNotification(
        `Submission ${newStatus}`,
        `Your ${verifItem.category} submission '${verifItem.submissionTitle}' was marked as ${newStatus} by ${facultyUser.name}.`,
        newStatus === 'Verified' ? 'success' : 'warning'
    );

    // Add Audit Log
    addAuditLog("Verification Completed", `Faculty marked '${verifItem.submissionTitle}' as ${newStatus}`, "Success");

    showToast(`Submission successfully updated to ${newStatus}!`, "success");
    closeModal("review-submission-modal");
    currentActiveReviewId = null;

    renderVerificationQueue();
}
