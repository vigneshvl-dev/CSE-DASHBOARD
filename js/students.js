/* ==========================================================================
   HYNA STUDIO - STUDENTS DIRECTORY MODULE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderStudentsDirectory();
});

function renderStudentsDirectory() {
    const tbody = document.getElementById("students-table-body");
    if (!tbody) return;

    const students = getStoreData("students");
    const searchVal = document.getElementById("student-search-input") ? document.getElementById("student-search-input").value.toLowerCase() : "";
    const filterYear = document.getElementById("student-filter-year") ? document.getElementById("student-filter-year").value : "ALL";
    const filterSection = document.getElementById("student-filter-section") ? document.getElementById("student-filter-section").value : "ALL";

    let filtered = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchVal) ||
                              s.registerNo.toLowerCase().includes(searchVal);
        const matchesYear = filterYear === "ALL" || s.year === filterYear;
        const matchesSection = filterSection === "ALL" || s.section === filterSection;

        return matchesSearch && matchesYear && matchesSection;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fa-solid fa-user-slash"></i></div>
                        <div class="empty-state-title">No Students Found</div>
                        <div class="empty-state-desc">Try adjusting your year, section, or search filters.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(s => `
        <tr>
            <td class="font-semibold">
                <div class="d-flex align-items-center gap-2">
                    <img src="${s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}" class="user-avatar-img" style="width: 36px; height: 36px;" alt="Student Avatar">
                    <div>
                        <div class="text-main">${s.name}</div>
                        <div class="text-muted text-xs">${s.email}</div>
                    </div>
                </div>
            </td>
            <td><code>${s.registerNo}</code></td>
            <td>${s.department}</td>
            <td>Year ${s.year} (${s.section})</td>
            <td><span class="status-badge status-submitted">${s.projects} Projects</span></td>
            <td><span class="status-badge status-verified">${s.certificates} Certs</span></td>
            <td><span class="status-badge status-draft">${s.internships} Internships</span></td>
            <td>
                <button onclick="viewStudentPortfolioModal('${s.id}')" class="btn btn-sm btn-primary">
                    <i class="fa-solid fa-folder-open me-1"></i> Portfolio
                </button>
            </td>
        </tr>
    `).join('');
}

function viewStudentPortfolioModal(studentId) {
    const students = getStoreData("students");
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById("modal-student-name").innerText = student.name;
    document.getElementById("modal-student-reg").innerText = `${student.registerNo} • ${student.department} Year ${student.year}-${student.section}`;
    
    document.getElementById("modal-count-projects").innerText = student.projects;
    document.getElementById("modal-count-certs").innerText = student.certificates;
    document.getElementById("modal-count-interns").innerText = student.internships;
    document.getElementById("modal-count-achieve").innerText = student.achievements;

    openModal("view-student-modal");
}
