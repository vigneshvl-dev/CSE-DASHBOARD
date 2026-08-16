/* ==========================================================================
   HYNA STUDIO - ACHIEVEMENTS MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderAchievementsGrid();
});


/* ==========================================================================
   RENDER ACHIEVEMENTS
   ========================================================================== */

function renderAchievementsGrid() {

    const container = document.getElementById("achievements-container");

    if (!container) return;

    const achievements = getStoreData("achievements") || [];

    const searchInput = document.getElementById("ach-search-input");

    const searchVal = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const categoryInput =
        document.getElementById("ach-filter-category");

    const selectedCategory = categoryInput
        ? categoryInput.value
        : "ALL";


    /* ----------------------------------------------------------------------
       FILTER
    ---------------------------------------------------------------------- */

    const filtered = achievements.filter(a => {

        const title =
            (a.title || "").toLowerCase();

        const organization =
            (a.organization || "").toLowerCase();

        const description =
            (a.description || "").toLowerCase();

        const matchesSearch =
            title.includes(searchVal) ||
            organization.includes(searchVal) ||
            description.includes(searchVal);

        const matchesCategory =
            selectedCategory === "ALL" ||
            a.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });


    /* ----------------------------------------------------------------------
       EMPTY STATE
    ---------------------------------------------------------------------- */

    if (filtered.length === 0) {

        container.innerHTML = `
            <div class="card" style="grid-column: 1 / -1;">
                <div class="empty-state">

                    <div class="empty-state-icon">
                        <i class="fa-solid fa-trophy"></i>
                    </div>

                    <div class="empty-state-title">
                        No Achievements Found
                    </div>

                    <div class="empty-state-desc">
                        Showcase your hackathon wins,
                        research papers, awards, and honors.
                    </div>

                    <button
                        class="btn btn-primary btn-sm"
                        onclick="openModal('add-achievement-modal')"
                    >
                        <i class="fa-solid fa-plus me-1"></i>
                        Add Achievement
                    </button>

                </div>
            </div>
        `;

        return;
    }


    /* ----------------------------------------------------------------------
       CARDS
    ---------------------------------------------------------------------- */

    container.innerHTML = filtered.map(a => {

        let statusClass = "status-submitted";

        if (a.status === "Verified") {
            statusClass = "status-verified";
        }


        /* IMAGE */

        const imageHTML = a.image
            ? `
                <div
                    style="
                        width: 100%;
                        height: 190px;
                        overflow: hidden;
                        border-radius: var(--radius-md);
                        margin-bottom: 1rem;
                        background: var(--bg-main);
                    "
                >
                    <img
                        src="${a.image}"
                        alt="${escapeHTML(a.title || "Achievement")}"
                        style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            display: block;
                        "
                    >
                </div>
            `
            : `
                <div
                    style="
                        width: 100%;
                        height: 190px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background: var(--bg-main);
                        border-radius: var(--radius-md);
                        margin-bottom: 1rem;
                    "
                >
                    <i
                        class="fa-solid fa-trophy"
                        style="
                            font-size: 2.5rem;
                            color: var(--text-muted);
                            margin-bottom: 0.5rem;
                        "
                    ></i>

                    <span class="text-muted text-xs">
                        No Achievement Image
                    </span>
                </div>
            `;


        /* PDF BUTTON */

        const proofButton = a.proofPdf
            ? `
                <button
                    onclick="viewAchievementProof('${a.id}')"
                    class="btn btn-sm btn-secondary"
                >
                    <i class="fa-solid fa-file-pdf"></i>
                    View Proof
                </button>
            `
            : `
                <span class="text-xs text-muted">
                    <i class="fa-solid fa-file-circle-xmark me-1"></i>
                    No Proof
                </span>
            `;


        return `
            <div
                class="card"
                style="
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    overflow: hidden;
                "
            >

                <div>

                    <!-- ACHIEVEMENT IMAGE -->

                    ${imageHTML}


                    <!-- CATEGORY / STATUS -->

                    <div
                        class="d-flex align-items-center justify-content-between mb-2"
                    >

                        <span class="status-badge status-draft">
                            <i class="fa-solid fa-tag me-1"></i>
                            ${escapeHTML(a.category || "Achievement")}
                        </span>

                        <span class="status-badge ${statusClass}">
                            ${escapeHTML(a.status || "Submitted")}
                        </span>

                    </div>


                    <!-- TITLE -->

                    <h3
                        class="font-bold text-main text-lg mb-1"
                        style="font-size: 1.15rem;"
                    >
                        ${escapeHTML(a.title || "Untitled Achievement")}
                    </h3>


                    <!-- ORGANIZATION -->

                    <div class="text-muted text-xs mb-3">

                        <i class="fa-solid fa-building-columns me-1"></i>

                        ${escapeHTML(a.organization || "Unknown Organization")}

                        •

                        ${escapeHTML(a.date || "-")}

                    </div>


                    <!-- DESCRIPTION -->

                    <p class="text-muted text-sm mb-3">

                        ${escapeHTML(
                            a.description ||
                            "No description provided."
                        )}

                    </p>

                </div>


                <!-- FOOTER -->

                <div>

                    <hr
                        style="
                            margin: 0.75rem 0;
                            border: 0;
                            border-top: 1px solid var(--border-color);
                        "
                    >

                    <div
                        class="d-flex align-items-center justify-content-between"
                    >

                        <span class="text-xs text-muted">

                            <i class="fa-solid fa-award me-1"></i>

                            ${
                                a.status === "Verified"
                                    ? "Evidence Verified"
                                    : "Awaiting Verification"
                            }

                        </span>

                        ${proofButton}

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


/* ==========================================================================
   SUBMIT NEW ACHIEVEMENT
   ========================================================================== */

async function submitNewAchievement(e) {

    e.preventDefault();


    const title =
        document.getElementById("ach-title").value.trim();

    const category =
        document.getElementById("ach-category").value;

    const organization =
        document.getElementById("ach-org").value.trim();

    const date =
        document.getElementById("ach-date").value;

    const desc =
        document.getElementById("ach-desc").value.trim();


    /* FILE INPUTS */

    const imageInput =
        document.getElementById("ach-image");

    const pdfInput =
        document.getElementById("ach-pdf");


    /* ----------------------------------------------------------------------
       READ IMAGE
    ---------------------------------------------------------------------- */

    let imageData = "";

    if (imageInput && imageInput.files.length > 0) {

        const imageFile = imageInput.files[0];

        if (!imageFile.type.startsWith("image/")) {

            showToast(
                "Please select a valid image file.",
                "error"
            );

            return;
        }

        imageData = await readFileAsDataURL(imageFile);
    }


    /* ----------------------------------------------------------------------
       READ PDF
    ---------------------------------------------------------------------- */

    let pdfData = "";
    let pdfName = "";

    if (pdfInput && pdfInput.files.length > 0) {

        const pdfFile = pdfInput.files[0];

        if (pdfFile.type !== "application/pdf") {

            showToast(
                "Please select a valid PDF file.",
                "error"
            );

            return;
        }

        pdfData = await readFileAsDataURL(pdfFile);

        pdfName = pdfFile.name;
    }


    /* ----------------------------------------------------------------------
       CURRENT USER
    ---------------------------------------------------------------------- */

    const currentUser = getCurrentUser() || {};


    /* ----------------------------------------------------------------------
       NEW ACHIEVEMENT OBJECT
    ---------------------------------------------------------------------- */

    const newAch = {

        id: `ACH-${Date.now()}`,

        title: title,

        category: category,

        studentId:
            currentUser.id ||
            "STU001",

        studentName:
            currentUser.name ||
            "Demo Student",

        organization: organization,

        date:
            date ||
            new Date().toISOString().split("T")[0],

        description:
            desc ||
            "No description provided.",

        status: "Submitted",

        /* IMAGE */

        image: imageData,

        /* PDF */

        proofPdf: pdfData,

        evidenceFile:
            pdfName ||
            "No proof uploaded"

    };


    /* ----------------------------------------------------------------------
       SAVE ACHIEVEMENT
    ---------------------------------------------------------------------- */

    const achievements =
        getStoreData("achievements") || [];

    achievements.unshift(newAch);

    setStoreData(
        "achievements",
        achievements
    );


    /* ----------------------------------------------------------------------
       VERIFICATION RECORD
    ---------------------------------------------------------------------- */

    const verifications =
        getStoreData("verification") || [];


    verifications.unshift({

        id: `VER-${Date.now()}`,

        submissionId:
            newAch.id,

        submissionTitle:
            newAch.title,

        studentId:
            newAch.studentId,

        studentName:
            newAch.studentName,

        category:
            "Achievement",

        submittedDate:
            newAch.date,

        status:
            "Submitted",

        evidenceFile:
            newAch.evidenceFile,

        notes:
            "Achievement claim submitted.",

        proofPdf:
            newAch.proofPdf

    });


    setStoreData(
        "verification",
        verifications
    );


    /* ----------------------------------------------------------------------
       AUDIT
    ---------------------------------------------------------------------- */

    if (typeof addAuditLog === "function") {

        addAuditLog(
            "Achievement Added",
            `Submitted achievement '${title}'`,
            "Success"
        );

    }


    /* ----------------------------------------------------------------------
       NOTIFICATION
    ---------------------------------------------------------------------- */

    if (typeof pushNotification === "function") {

        pushNotification(
            "Achievement Submitted",
            `Achievement '${title}' was submitted for faculty review.`,
            "info"
        );

    }


    /* ----------------------------------------------------------------------
       SUCCESS
    ---------------------------------------------------------------------- */

    showToast(
        "Achievement recorded successfully!",
        "success"
    );


    closeModal(
        "add-achievement-modal"
    );


    const form =
        document.getElementById(
            "add-achievement-form"
        );

    if (form) {
        form.reset();
    }


    renderAchievementsGrid();
}


/* ==========================================================================
   VIEW PDF PROOF
   ========================================================================== */

function viewAchievementProof(id) {

    const achievements =
        getStoreData("achievements") || [];

    const achievement =
        achievements.find(a => a.id === id);


    if (!achievement) {

        showToast(
            "Achievement not found.",
            "error"
        );

        return;
    }


    if (!achievement.proofPdf) {

        showToast(
            "No PDF proof uploaded.",
            "error"
        );

        return;
    }


    /* Open PDF in new tab */

    const newWindow =
        window.open();

    if (!newWindow) {

        showToast(
            "Please allow popups to view the PDF.",
            "error"
        );

        return;
    }


    newWindow.document.write(`
        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHTML(achievement.title)}
            </title>

            <style>

                html,
                body {
                    margin: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    background: #111;
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
                src="${achievement.proofPdf}"
            ></iframe>

        </body>

        </html>
    `);

    newWindow.document.close();
}


/* ==========================================================================
   FILE READER
   ========================================================================== */

function readFileAsDataURL(file) {

    return new Promise((resolve, reject) => {

        const reader =
            new FileReader();

        reader.onload = function () {

            resolve(reader.result);

        };

        reader.onerror = function () {

            reject(reader.error);

        };

        reader.readAsDataURL(file);

    });

}


/* ==========================================================================
   HTML ESCAPE
   ========================================================================== */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}