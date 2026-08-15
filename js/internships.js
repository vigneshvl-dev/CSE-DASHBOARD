/* ==========================================================================
   HYNA STUDIO - INTERNSHIPS MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderInternshipsList();
});

function renderInternshipsList() {
    const container = document.getElementById("internships-container");
    if (!container) return;

    const internships = getStoreData("internships");
    const searchVal = document.getElementById("internship-search-input") ? document.getElementById("internship-search-input").value.toLowerCase() : "";

    let filtered = internships.filter(i => 
        i.company.toLowerCase().includes(searchVal) ||
        i.role.toLowerCase().includes(searchVal)
    );

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1 / -1;">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-briefcase"></i></div>
                    <div class="empty-state-title">No Internships Logged</div>
                    <div class="empty-state-desc">Record your industrial training and work experiences for department verification.</div>
                    <button class="btn btn-primary btn-sm" onclick="openModal('add-internship-modal')">
                        <i class="fa-solid fa-plus me-1"></i> Add Internship
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(i => {
        let statusClass = "status-submitted";
        if (i.status === "Verified") statusClass = "status-verified";

        return `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="status-badge status-draft"><i class="fa-solid fa-building me-1"></i> ${i.company}</span>
                        <span class="status-badge ${statusClass}">${i.status}</span>
                    </div>
                    <h3 class="font-bold text-main text-lg mb-1" style="font-size: 1.15rem;">${i.role}</h3>
                    <div class="text-muted text-xs mb-3">
                        <i class="fa-solid fa-clock me-1"></i> ${i.duration} (${i.startDate} — ${i.endDate})
                    </div>
                    <p class="text-muted text-sm mb-3" style="line-height: 1.6;">${i.description || 'No description provided.'}</p>
                    
                    <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;" class="mb-3">
                        ${(i.skills || []).map(s => `<span class="status-badge status-submitted" style="font-size: 0.68rem;">${s}</span>`).join('')}
                    </div>
                </div>

                <div>
                    <hr style="margin: 0.75rem 0; border: 0; border-top: 1px solid var(--border-color);">
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-xs text-muted"><i class="fa-solid fa-paperclip me-1"></i> 2 Documents</span>
                        <div class="d-flex gap-2">
                            <button onclick="alert('Simulated Viewing: Offer Letter')" class="btn btn-sm btn-secondary"><i class="fa-solid fa-file-contract me-1"></i> Offer</button>
                            <button onclick="alert('Simulated Viewing: Internship Certificate')" class="btn btn-sm btn-secondary"><i class="fa-solid fa-award me-1"></i> Certificate</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function submitNewInternship(e) {
    e.preventDefault();

    const company = document.getElementById("int-company").value.trim();
    const role = document.getElementById("int-role").value.trim();
    const duration = document.getElementById("int-duration").value.trim();
    const startDate = document.getElementById("int-start").value;
    const endDate = document.getElementById("int-end").value;
    const skills = document.getElementById("int-skills").value.split(",").map(s => s.trim()).filter(Boolean);
    const desc = document.getElementById("int-desc").value.trim();

    const currentUser = getCurrentUser();

    const newInt = {
        id: `INT-${Date.now().toString().slice(-4)}`,
        company: company,
        role: role,
        studentId: currentUser.id || "STU001",
        studentName: currentUser.name || "Demo Student",
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || "Present",
        duration: duration || "3 Months",
        skills: skills.length > 0 ? skills : ["Software Development"],
        description: desc,
        status: "Submitted",
        offerLetter: "offer_letter.pdf",
        completionCert: "completion_cert.pdf"
    };

    const internships = getStoreData("internships");
    internships.unshift(newInt);
    setStoreData("internships", internships);

    // Create Verification Record
    const verifications = getStoreData("verification");
    verifications.unshift({
        id: `VER-${Date.now().toString().slice(-4)}`,
        submissionId: newInt.id,
        submissionTitle: `${newInt.role} at ${newInt.company}`,
        studentId: newInt.studentId,
        studentName: newInt.studentName,
        category: "Internship",
        submittedDate: newInt.startDate,
        status: "Submitted",
        evidenceFile: newInt.offerLetter,
        notes: "Offer letter and report attached."
    });
    setStoreData("verification", verifications);

    addAuditLog("Internship Added", `Logged internship '${role} at ${company}'`, "Success");
    pushNotification("Internship Submitted", `Internship '${role}' at ${company} was submitted for verification.`, "info");

    showToast("Internship details logged successfully!", "success");
    closeModal("add-internship-modal");
    document.getElementById("add-internship-form").reset();

    renderInternshipsList();
}
