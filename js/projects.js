/* ==========================================================================
   HYNA STUDIO - PROJECTS MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderProjectsList();
});

function renderProjectsList() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    const projects = getStoreData("projects");

    const searchVal = document.getElementById("project-search-input")
        ? document.getElementById("project-search-input").value.toLowerCase()
        : "";

    const filterType = document.getElementById("project-filter-type")
        ? document.getElementById("project-filter-type").value
        : "ALL";

    const filterStatus = document.getElementById("project-filter-status")
        ? document.getElementById("project-filter-status").value
        : "ALL";

    let filtered = projects.filter(p => {
        const matchesSearch =
            p.title.toLowerCase().includes(searchVal) ||
            p.technologies.some(t => t.toLowerCase().includes(searchVal)) ||
            p.description.toLowerCase().includes(searchVal);

        const matchesType =
            filterType === "ALL" || p.type === filterType;

        const matchesStatus =
            filterStatus === "ALL" || p.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1 / -1;">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fa-solid fa-diagram-project"></i>
                    </div>

                    <div class="empty-state-title">
                        No Projects Found
                    </div>

                    <div class="empty-state-desc">
                        Start building your student portfolio by adding your first project submission.
                    </div>

                    <button class="btn btn-primary btn-sm"
                            onclick="openModal('add-project-modal')">
                        <i class="fa-solid fa-plus me-1"></i>
                        Add Project
                    </button>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(p => {

        let statusClass = "status-submitted";

        if (p.status === "Verified")
            statusClass = "status-verified";

        if (p.status === "Under Review")
            statusClass = "status-under-review";

        if (p.status === "Rejected")
            statusClass = "status-rejected";


        /* ============================================================
           ATTACHMENT DISPLAY
           ============================================================ */

        let attachmentHTML = "";

        if (p.attachmentData) {

            if (p.attachmentType && p.attachmentType.startsWith("image/")) {

                // IMAGE PREVIEW
                attachmentHTML = `
                    <div style="margin-bottom: 1rem;">
                        <img
                            src="${p.attachmentData}"
                            alt="${p.attachmentName || "Project Image"}"
                            style="
                                width: 100%;
                                height: 160px;
                                object-fit: cover;
                                border-radius: 10px;
                                border: 1px solid var(--border-color);
                                display: block;
                            "
                        >
                    </div>
                `;

            } else {

                // PDF / DOCX / ZIP / OTHER FILE
                let fileIcon = "fa-file";

                if (p.attachmentType === "application/pdf") {
                    fileIcon = "fa-file-pdf";
                }
                else if (
                    p.attachmentType.includes("word") ||
                    p.attachmentName.toLowerCase().endsWith(".doc") ||
                    p.attachmentName.toLowerCase().endsWith(".docx")
                ) {
                    fileIcon = "fa-file-word";
                }
                else if (
                    p.attachmentType.includes("zip") ||
                    p.attachmentName.toLowerCase().endsWith(".zip")
                ) {
                    fileIcon = "fa-file-zipper";
                }

                attachmentHTML = `
                    <div
                        style="
                            height: 90px;
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            padding: 0.75rem;
                            margin-bottom: 1rem;
                            border: 1px solid var(--border-color);
                            border-radius: 10px;
                            background: var(--bg-secondary);
                        "
                    >

                        <i
                            class="fa-solid ${fileIcon}"
                            style="font-size: 2rem;"
                        ></i>

                        <div style="min-width: 0;">
                            <div class="font-semibold text-main">
                                ${getAttachmentLabel(p.attachmentType, p.attachmentName)}
                            </div>

                            <div
                                class="text-muted text-xs"
                                style="
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                "
                            >
                                ${p.attachmentName || "Attached File"}
                            </div>
                        </div>

                    </div>
                `;
            }
        }


        return `
            <div
                class="card"
                style="
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                "
            >

                <div>

                    ${attachmentHTML}


                    <div class="d-flex align-items-center justify-content-between mb-2">

                        <span class="status-badge status-draft">
                            ${p.type}
                        </span>

                        <span class="status-badge ${statusClass}">
                            ${p.status}
                        </span>

                    </div>


                    <h3
                        class="font-bold text-main text-lg mb-1"
                        style="
                            font-size: 1.1rem;
                            line-height: 1.3;
                        "
                    >
                        ${p.title}
                    </h3>


                    <div class="text-muted text-xs mb-3">
                        <i class="fa-solid fa-calendar me-1"></i>
                        ${p.startDate} — ${p.endDate || "Present"}
                    </div>


                    <p
                        class="text-muted text-sm mb-3"
                        style="
                            display: -webkit-box;
                            -webkit-line-clamp: 3;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        "
                    >
                        ${p.description}
                    </p>


                    <div
                        class="mb-3"
                        style="
                            display: flex;
                            flex-wrap: wrap;
                            gap: 0.35rem;
                        "
                    >
                        ${p.technologies.map(t => `
                            <span
                                class="status-badge status-submitted"
                                style="font-size: 0.68rem;"
                            >
                                ${t}
                            </span>
                        `).join("")}
                    </div>

                </div>


                <div>

                    <hr
                        style="
                            margin: 0.75rem 0;
                            border: 0;
                            border-top: 1px solid var(--border-color);
                        "
                    >


                    <div class="d-flex align-items-center justify-content-between">

                        <div class="text-xs text-muted">

                            <i class="fa-solid fa-user-group me-1"></i>

                            ${(p.teamMembers || []).join(", ")}

                        </div>


                        <div class="d-flex gap-2">

                            ${
                                p.githubUrl
                                    ? `
                                        <a
                                            href="${p.githubUrl}"
                                            target="_blank"
                                            class="btn btn-sm btn-secondary"
                                            title="GitHub Code"
                                        >
                                            <i class="fa-brands fa-github"></i>
                                        </a>
                                      `
                                    : ""
                            }


                            ${
                                p.liveDemoUrl
                                    ? `
                                        <a
                                            href="${p.liveDemoUrl}"
                                            target="_blank"
                                            class="btn btn-sm btn-secondary"
                                            title="Live Demo"
                                        >
                                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                        </a>
                                      `
                                    : ""
                            }


                            <button
                                onclick="viewProjectDetails('${p.id}')"
                                class="btn btn-sm btn-primary"
                            >
                                Details
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


/* ==========================================================================
   ATTACHMENT LABEL
   ========================================================================== */

function getAttachmentLabel(type, fileName) {

    if (!type && !fileName)
        return "FILE";

    if (type && type.startsWith("image/"))
        return "IMAGE";

    if (type === "application/pdf")
        return "PDF";

    if (
        type &&
        type.includes("word")
    )
        return "DOCX";

    if (
        type &&
        type.includes("zip")
    )
        return "ZIP";

    if (fileName) {

        const name = fileName.toLowerCase();

        if (name.endsWith(".pdf"))
            return "PDF";

        if (
            name.endsWith(".doc") ||
            name.endsWith(".docx")
        )
            return "DOCX";

        if (name.endsWith(".zip"))
            return "ZIP";

        if (
            name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png") ||
            name.endsWith(".webp")
        )
            return "IMAGE";
    }

    return "FILE";
}


/* ==========================================================================
   HANDLE FILE SELECTION
   ========================================================================== */

let simulatedFile = null;

function handleFileSelectSimulated(input) {

    if (input.files && input.files[0]) {

        const file = input.files[0];

        const reader = new FileReader();

        reader.onload = function (e) {

            simulatedFile = {
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: e.target.result
            };


            let icon = "fa-file";

            if (file.type.startsWith("image/")) {
                icon = "fa-image";
            }
            else if (file.type === "application/pdf") {
                icon = "fa-file-pdf";
            }
            else if (file.type.includes("word")) {
                icon = "fa-file-word";
            }
            else if (file.type.includes("zip")) {
                icon = "fa-file-zipper";
            }


            document.getElementById("file-sim-info").innerHTML = `

                <div class="status-badge status-verified">

                    <i class="fa-solid ${icon} me-1"></i>

                    ${file.name}

                    (${Math.round(file.size / 1024)} KB)

                </div>

            `;
        };


        reader.readAsDataURL(file);
    }
}


/* ==========================================================================
   SUBMIT NEW PROJECT
   ========================================================================== */

function submitNewProject(e) {

    e.preventDefault();


    const title =
        document.getElementById("proj-title").value.trim();

    const type =
        document.getElementById("proj-type").value;

    const desc =
        document.getElementById("proj-desc").value.trim();

    const tech =
        document.getElementById("proj-tech")
            .value
            .split(",")
            .map(t => t.trim())
            .filter(Boolean);

    const githubUrl =
        document.getElementById("proj-github")
            .value
            .trim();

    const liveDemoUrl =
        document.getElementById("proj-demo")
            .value
            .trim();

    const startDate =
        document.getElementById("proj-start").value;

    const endDate =
        document.getElementById("proj-end").value;

    const team =
        document.getElementById("proj-team")
            .value
            .split(",")
            .map(m => m.trim())
            .filter(Boolean);


    const currentUser = getCurrentUser();


    const newProject = {

        id: `PROJ-${Date.now().toString().slice(-4)}`,

        title: title,

        type: type,

        studentId:
            currentUser.id || "STU001",

        studentName:
            currentUser.name || "Demo Student",

        technologies:
            tech.length > 0
                ? tech
                : ["JavaScript"],

        startDate:
            startDate ||
            new Date().toISOString().split("T")[0],

        endDate:
            endDate || "Present",

        githubUrl:
            githubUrl,

        liveDemoUrl:
            liveDemoUrl,

        description:
            desc,

        teamMembers:
            team.length > 0
                ? team
                : [currentUser.name],

        status:
            "Submitted",

        evidenceFile:
            simulatedFile
                ? simulatedFile.name
                : "project_evidence.pdf",


        /* ============================================================
           ATTACHMENT DATA
           ============================================================ */

        attachmentName:
            simulatedFile
                ? simulatedFile.name
                : "",

        attachmentType:
            simulatedFile
                ? simulatedFile.type
                : "",

        attachmentData:
            simulatedFile
                ? simulatedFile.dataUrl
                : ""
    };


    const projects =
        getStoreData("projects");

    projects.unshift(newProject);

    setStoreData(
        "projects",
        projects
    );


    /* ================================================================
       CREATE VERIFICATION QUEUE ENTRY
       ================================================================ */

    const verifications =
        getStoreData("verification");

    verifications.unshift({

        id:
            `VER-${Date.now().toString().slice(-4)}`,

        submissionId:
            newProject.id,

        submissionTitle:
            newProject.title,

        studentId:
            newProject.studentId,

        studentName:
            newProject.studentName,

        category:
            "Project",

        submittedDate:
            newProject.startDate,

        status:
            "Submitted",

        evidenceFile:
            newProject.evidenceFile,

        notes:
            "Awaiting faculty review."
    });


    setStoreData(
        "verification",
        verifications
    );


    /* ================================================================
       AUDIT & NOTIFICATION
       ================================================================ */

    addAuditLog(
        "Project Created",
        `Submitted project '${title}' for verification`,
        "Success"
    );

    pushNotification(
        "Project Submitted",
        `Your project '${title}' was successfully submitted for faculty verification.`,
        "info"
    );


    showToast(
        "Project submitted successfully for verification!",
        "success"
    );


    closeModal(
        "add-project-modal"
    );


    document
        .getElementById("add-project-form")
        .reset();


    simulatedFile = null;


    document
        .getElementById("file-sim-info")
        .innerHTML = "";


    renderProjectsList();
}


/* ==========================================================================
   VIEW PROJECT DETAILS
   ========================================================================== */

function viewProjectDetails(projId) {

    const projects =
        getStoreData("projects");

    const proj =
        projects.find(p => p.id === projId);

    if (!proj)
        return;


    alert(
        `Project Details:\n\n` +
        `Title: ${proj.title}\n` +
        `Type: ${proj.type}\n` +
        `Status: ${proj.status}\n` +
        `Technologies: ${proj.technologies.join(", ")}\n` +
        `Description: ${proj.description}`
    );
}