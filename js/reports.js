/* ==========================================================================
   HYNA STUDIO - REPORTS & CSV EXPORTER MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    generateDepartmentReport();
});

function generateDepartmentReport() {
    const container = document.getElementById("report-preview-container");
    if (!container) return;

    const reportType = document.getElementById("report-type-select") ? document.getElementById("report-type-select").value : "Student Activity Report";
    
    const projects = getStoreData("projects");
    const certs = getStoreData("certificates");
    const internships = getStoreData("internships");
    const achievements = getStoreData("achievements");

    let tableRowsHtml = "";
    let headersHtml = "";

    if (reportType.includes("Project")) {
        headersHtml = `<th>Project Title</th><th>Type</th><th>Student Name</th><th>Start Date</th><th>Status</th>`;
        tableRowsHtml = projects.map(p => `
            <tr>
                <td class="font-semibold">${p.title}</td>
                <td>${p.type}</td>
                <td>${p.studentName}</td>
                <td>${p.startDate}</td>
                <td><span class="status-badge status-verified">${p.status}</span></td>
            </tr>
        `).join('');
    } else if (reportType.includes("Certificate")) {
        headersHtml = `<th>Certificate Title</th><th>Issuer</th><th>Student Name</th><th>Issue Date</th><th>Status</th>`;
        tableRowsHtml = certs.map(c => `
            <tr>
                <td class="font-semibold">${c.title}</td>
                <td>${c.issuer}</td>
                <td>${c.studentName}</td>
                <td>${c.issueDate}</td>
                <td><span class="status-badge status-verified">${c.status}</span></td>
            </tr>
        `).join('');
    } else {
        // Default Activity Summary
        const all = [
            ...projects.map(p => ({ title: p.title, category: 'Project', user: p.studentName, date: p.startDate, status: p.status })),
            ...certs.map(c => ({ title: c.title, category: 'Certificate', user: c.studentName, date: c.issueDate, status: c.status })),
            ...internships.map(i => ({ title: `${i.role} at ${i.company}`, category: 'Internship', user: i.studentName, date: i.startDate, status: i.status })),
            ...achievements.map(a => ({ title: a.title, category: 'Achievement', user: a.studentName, date: a.date, status: a.status }))
        ];

        headersHtml = `<th>Activity Name</th><th>Category</th><th>Student Name</th><th>Recorded Date</th><th>Status</th>`;
        tableRowsHtml = all.map(a => `
            <tr>
                <td class="font-semibold">${a.title}</td>
                <td><span class="status-badge status-draft">${a.category}</span></td>
                <td>${a.user}</td>
                <td>${a.date}</td>
                <td><span class="status-badge status-verified">${a.status}</span></td>
            </tr>
        `).join('');
    }

    container.innerHTML = `
        <div class="table-responsive">
            <table class="custom-table">
                <thead>
                    <tr>${headersHtml}</tr>
                </thead>
                <tbody>
                    ${tableRowsHtml}
                </tbody>
            </table>
        </div>
    `;

    addAuditLog("Report Generated", `Generated '${reportType}'`, "Success");
}

function exportReportToCSV() {
    const reportType = document.getElementById("report-type-select") ? document.getElementById("report-type-select").value : "Department_Report";
    const projects = getStoreData("projects");

    let csvRows = [];
    csvRows.push(["Title", "Type", "Student Name", "Start Date", "Status"].join(","));

    projects.forEach(p => {
        csvRows.push([
            `"${p.title.replace(/"/g, '""')}"`,
            `"${p.type}"`,
            `"${p.studentName}"`,
            `"${p.startDate}"`,
            `"${p.status}"`
        ].join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `${reportType.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast("CSV report generated and downloaded!", "success");
    addAuditLog("Report Exported CSV", `Exported '${reportType}' to CSV file`, "Success");
}
