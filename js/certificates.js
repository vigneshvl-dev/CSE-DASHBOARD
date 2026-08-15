/* ==========================================================================
   HYNA STUDIO - CERTIFICATES MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderCertificatesTable();
});

function renderCertificatesTable() {
    const tbody = document.getElementById("certificates-table-body");
    if (!tbody) return;

    const certs = getStoreData("certificates");
    const searchVal = document.getElementById("cert-search-input") ? document.getElementById("cert-search-input").value.toLowerCase() : "";

    let filtered = certs.filter(c => 
        c.title.toLowerCase().includes(searchVal) ||
        c.issuer.toLowerCase().includes(searchVal) ||
        (c.credentialId && c.credentialId.toLowerCase().includes(searchVal))
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fa-solid fa-certificate"></i></div>
                        <div class="empty-state-title">No Certificates Added</div>
                        <div class="empty-state-desc">Upload your industry certifications & course badges to verify your portfolio.</div>
                        <button class="btn btn-primary btn-sm" onclick="openModal('add-cert-modal')">
                            <i class="fa-solid fa-plus me-1"></i> Add Certificate
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(c => {
        let statusClass = "status-submitted";
        if (c.status === "Verified") statusClass = "status-verified";
        if (c.status === "Under Review") statusClass = "status-under-review";

        return `
            <tr>
                <td class="font-semibold">
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-award text-teal" style="font-size: 1.2rem;"></i>
                        <div>
                            <div>${c.title}</div>
                            <div class="text-muted text-xs">${c.description || ''}</div>
                        </div>
                    </div>
                </td>
                <td><span class="font-semibold text-primary">${c.issuer}</span></td>
                <td class="text-muted">${c.issueDate}</td>
                <td><code>${c.credentialId || 'N/A'}</code></td>
                <td><span class="status-badge ${statusClass}">${c.status}</span></td>
                <td>
                    <div class="d-flex gap-2">
                        ${c.credentialUrl ? `<a href="${c.credentialUrl}" target="_blank" class="btn btn-sm btn-secondary" title="Verify Credential"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                        <button onclick="alert('Viewing Evidence File: ${c.certificateFile || 'certificate.pdf'}')" class="btn btn-sm btn-secondary" title="View Evidence"><i class="fa-solid fa-file-pdf"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function submitNewCertificate(e) {
    e.preventDefault();

    const title = document.getElementById("cert-title").value.trim();
    const issuer = document.getElementById("cert-issuer").value.trim();
    const issueDate = document.getElementById("cert-date").value;
    const credentialId = document.getElementById("cert-cred-id").value.trim();
    const credentialUrl = document.getElementById("cert-cred-url").value.trim();
    const desc = document.getElementById("cert-desc").value.trim();

    const currentUser = getCurrentUser();

    const newCert = {
        id: `CERT-${Date.now().toString().slice(-4)}`,
        title: title,
        issuer: issuer,
        studentId: currentUser.id || "STU001",
        studentName: currentUser.name || "Demo Student",
        issueDate: issueDate || new Date().toISOString().split('T')[0],
        credentialId: credentialId,
        credentialUrl: credentialUrl,
        description: desc,
        status: "Submitted",
        certificateFile: "certificate_evidence.pdf"
    };

    const certs = getStoreData("certificates");
    certs.unshift(newCert);
    setStoreData("certificates", certs);

    // Create Verification Record
    const verifications = getStoreData("verification");
    verifications.unshift({
        id: `VER-${Date.now().toString().slice(-4)}`,
        submissionId: newCert.id,
        submissionTitle: newCert.title,
        studentId: newCert.studentId,
        studentName: newCert.studentName,
        category: "Certificate",
        submittedDate: newCert.issueDate,
        status: "Submitted",
        evidenceFile: newCert.certificateFile,
        notes: "Credential details submitted."
    });
    setStoreData("verification", verifications);

    addAuditLog("Certificate Added", `Added certificate '${title}'`, "Success");
    pushNotification("Certificate Submitted", `Your certificate '${title}' was submitted for verification.`, "info");

    showToast("Certificate added successfully!", "success");
    closeModal("add-cert-modal");
    document.getElementById("add-cert-form").reset();

    renderCertificatesTable();
}
