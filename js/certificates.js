/* ==========================================================================
   HYNA STUDIO - CERTIFICATES MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderCertificatesTable();
});


/* ==========================================================================
   RENDER CERTIFICATES TABLE
   ========================================================================== */

function renderCertificatesTable() {

    const tbody = document.getElementById("certificates-table-body");

    if (!tbody) return;

    const certs = getStoreData("certificates") || [];

    const searchInput = document.getElementById("cert-search-input");

    const searchVal = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filtered = certs.filter(c =>
        (c.title || "").toLowerCase().includes(searchVal) ||
        (c.issuer || "").toLowerCase().includes(searchVal) ||
        (c.credentialId || "").toLowerCase().includes(searchVal)
    );


    /* ----------------------------------------------------------------------
       EMPTY STATE
    ---------------------------------------------------------------------- */

    if (filtered.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">

                    <div class="empty-state">

                        <div class="empty-state-icon">
                            <i class="fa-solid fa-certificate"></i>
                        </div>

                        <div class="empty-state-title">
                            No Certificates Added
                        </div>

                        <div class="empty-state-desc">
                            Upload your industry certifications & course badges to verify your portfolio.
                        </div>

                        <button
                            class="btn btn-primary btn-sm"
                            onclick="openModal('add-cert-modal')"
                        >
                            <i class="fa-solid fa-plus me-1"></i>
                            Add Certificate
                        </button>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    /* ----------------------------------------------------------------------
       TABLE ROWS
    ---------------------------------------------------------------------- */

    tbody.innerHTML = filtered.map(c => {

        let statusClass = "status-submitted";

        if (c.status === "Verified") {
            statusClass = "status-verified";
        }

        if (c.status === "Under Review") {
            statusClass = "status-under-review";
        }


        /* PDF BUTTON */

        const pdfButton = c.certificatePdf
            ? `
                <button
                    onclick="viewCertificatePDF('${c.id}')"
                    class="btn btn-sm btn-secondary"
                    title="View Certificate PDF"
                >
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
              `
            : `
                <button
                    onclick="showToast('No certificate PDF uploaded.', 'info')"
                    class="btn btn-sm btn-secondary"
                    title="No PDF Available"
                >
                    <i class="fa-solid fa-file-pdf"></i>
                </button>
              `;


        return `
            <tr>

                <!-- CERTIFICATE TITLE -->
                <td class="font-semibold">

                    <div class="d-flex align-items-center gap-2">

                        <i
                            class="fa-solid fa-award text-teal"
                            style="font-size: 1.2rem;"
                        ></i>

                        <div>

                            <div>
                                ${escapeCertificateHTML(c.title)}
                            </div>

                            <div class="text-muted text-xs">
                                ${escapeCertificateHTML(c.description || '')}
                            </div>

                        </div>

                    </div>

                </td>


                <!-- ISSUER -->
                <td>
                    <span class="font-semibold text-primary">
                        ${escapeCertificateHTML(c.issuer)}
                    </span>
                </td>


                <!-- ISSUE DATE -->
                <td class="text-muted">
                    ${escapeCertificateHTML(c.issueDate || 'N/A')}
                </td>


                <!-- CREDENTIAL ID -->
                <td>
                    <code>
                        ${escapeCertificateHTML(c.credentialId || 'N/A')}
                    </code>
                </td>


                <!-- STATUS -->
                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeCertificateHTML(c.status || 'Submitted')}
                    </span>
                </td>


                <!-- ACTION -->
                <td>

                    <div class="d-flex gap-2">

                        ${
                            c.credentialUrl
                            ?
                            `
                                <a
                                    href="${escapeCertificateAttribute(c.credentialUrl)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-sm btn-secondary"
                                    title="Verify Credential"
                                >
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            `
                            :
                            ''
                        }

                        ${pdfButton}

                    </div>

                </td>

            </tr>
        `;

    }).join('');
}


/* ==========================================================================
   SUBMIT NEW CERTIFICATE
   ========================================================================== */

function submitNewCertificate(e) {

    e.preventDefault();


    /* ----------------------------------------------------------------------
       GET FORM VALUES
    ---------------------------------------------------------------------- */

    const title =
        document.getElementById("cert-title").value.trim();

    const issuer =
        document.getElementById("cert-issuer").value.trim();

    const issueDate =
        document.getElementById("cert-date").value;

    const credentialId =
        document.getElementById("cert-cred-id").value.trim();

    const credentialUrl =
        document.getElementById("cert-cred-url").value.trim();

    const desc =
        document.getElementById("cert-desc").value.trim();


    /* ----------------------------------------------------------------------
       GET PDF
    ---------------------------------------------------------------------- */

    const pdfInput =
        document.getElementById("cert-pdf");

    const pdfFile =
        pdfInput && pdfInput.files
            ? pdfInput.files[0]
            : null;


    /* ----------------------------------------------------------------------
       VALIDATE PDF
    ---------------------------------------------------------------------- */

    if (pdfFile) {

        if (pdfFile.type !== "application/pdf") {

            showToast(
                "Please select a valid PDF file.",
                "error"
            );

            return;
        }


        /*
         * Prevent extremely large files from being stored in localStorage.
         * 5 MB is a safe limit for this demo/local-storage based system.
         */

        const maxSize = 5 * 1024 * 1024;

        if (pdfFile.size > maxSize) {

            showToast(
                "PDF size must be less than 5 MB.",
                "error"
            );

            return;
        }
    }


    /* ----------------------------------------------------------------------
       CURRENT USER
    ---------------------------------------------------------------------- */

    const currentUser =
        getCurrentUser() || {};


    /* ----------------------------------------------------------------------
       CREATE CERTIFICATE
    ---------------------------------------------------------------------- */

    const newCert = {

        id: `CERT-${Date.now().toString().slice(-6)}`,

        title: title,

        issuer: issuer,

        studentId:
            currentUser.id || "STU001",

        studentName:
            currentUser.name || "Demo Student",

        issueDate:
            issueDate ||
            new Date().toISOString().split("T")[0],

        credentialId:
            credentialId,

        credentialUrl:
            credentialUrl,

        description:
            desc,

        status:
            "Submitted",

        certificateFile:
            pdfFile
                ? pdfFile.name
                : "No certificate PDF",

        certificatePdf:
            null,

        certificatePdfName:
            pdfFile
                ? pdfFile.name
                : null

    };


    /* ----------------------------------------------------------------------
       SAVE CERTIFICATE
    ---------------------------------------------------------------------- */

    if (pdfFile) {

        const reader = new FileReader();


        reader.onload = function (event) {

            newCert.certificatePdf =
                event.target.result;

            saveCertificateData(newCert);

        };


        reader.onerror = function () {

            showToast(
                "Unable to read the PDF file.",
                "error"
            );

        };


        reader.readAsDataURL(pdfFile);

    } else {

        saveCertificateData(newCert);

    }
}


/* ==========================================================================
   SAVE CERTIFICATE DATA
   ========================================================================== */

function saveCertificateData(newCert) {

    try {

        /* ------------------------------------------------------------------
           SAVE CERTIFICATE
        ------------------------------------------------------------------ */

        const certs =
            getStoreData("certificates") || [];

        certs.unshift(newCert);

        setStoreData(
            "certificates",
            certs
        );


        /* ------------------------------------------------------------------
           CREATE VERIFICATION RECORD
        ------------------------------------------------------------------ */

        const verifications =
            getStoreData("verification") || [];

        verifications.unshift({

            id:
                `VER-${Date.now().toString().slice(-6)}`,

            submissionId:
                newCert.id,

            submissionTitle:
                newCert.title,

            studentId:
                newCert.studentId,

            studentName:
                newCert.studentName,

            category:
                "Certificate",

            submittedDate:
                newCert.issueDate,

            status:
                "Submitted",

            evidenceFile:
                newCert.certificateFile,

            notes:
                "Credential details submitted."

        });


        setStoreData(
            "verification",
            verifications
        );


        /* ------------------------------------------------------------------
           AUDIT LOG
        ------------------------------------------------------------------ */

        addAuditLog(
            "Certificate Added",
            `Added certificate '${newCert.title}'`,
            "Success"
        );


        /* ------------------------------------------------------------------
           NOTIFICATION
        ------------------------------------------------------------------ */

        pushNotification(
            "Certificate Submitted",
            `Your certificate '${newCert.title}' was submitted for verification.`,
            "info"
        );


        /* ------------------------------------------------------------------
           SUCCESS
        ------------------------------------------------------------------ */

        showToast(
            "Certificate added successfully!",
            "success"
        );


        /* ------------------------------------------------------------------
           CLOSE MODAL
        ------------------------------------------------------------------ */

        closeModal(
            "add-cert-modal"
        );


        /* ------------------------------------------------------------------
           RESET FORM
        ------------------------------------------------------------------ */

        const form =
            document.getElementById("add-cert-form");

        if (form) {
            form.reset();
        }


        /* ------------------------------------------------------------------
           REFRESH TABLE
        ------------------------------------------------------------------ */

        renderCertificatesTable();


    } catch (error) {

        console.error(
            "Certificate save error:",
            error
        );

        showToast(
            "Unable to save certificate. Storage may be full.",
            "error"
        );

    }
}


/* ==========================================================================
   VIEW CERTIFICATE PDF
   ========================================================================== */

function viewCertificatePDF(certId) {

    const certs =
        getStoreData("certificates") || [];

    const certificate =
        certs.find(c => c.id === certId);


    if (!certificate) {

        showToast(
            "Certificate not found.",
            "error"
        );

        return;
    }


    if (!certificate.certificatePdf) {

        showToast(
            "No PDF uploaded for this certificate.",
            "info"
        );

        return;
    }


    /*
     * Open the stored PDF Data URL in a new browser tab.
     */

    const pdfWindow =
        window.open(
            "",
            "_blank"
        );


    if (!pdfWindow) {

        showToast(
            "Please allow pop-ups to view the certificate.",
            "info"
        );

        return;
    }


    pdfWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeCertificateHTML(
                    certificate.certificatePdfName ||
                    "Certificate PDF"
                )}
            </title>

            <style>

                html,
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background: #f3f4f6;
                }

                iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }

            </style>

        </head>

        <body>

            <iframe
                src="${certificate.certificatePdf}"
                title="Certificate PDF"
            ></iframe>

        </body>

        </html>
    `);

    pdfWindow.document.close();
}


/* ==========================================================================
   ESCAPE HTML
   ========================================================================== */

function escapeCertificateHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* ==========================================================================
   ESCAPE HTML ATTRIBUTE
   ========================================================================== */

function escapeCertificateAttribute(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}