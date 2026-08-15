/* ==========================================================================
   HYNA STUDIO - DASHBOARD RENDERER & ANALYTICS ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    renderRoleAdaptiveDashboard();
});

function renderRoleAdaptiveDashboard() {
    const role = getCurrentRole();
    const dashboardContainer = document.getElementById("dashboard-content-area");
    if (!dashboardContainer) return;

    if (role === "Student") {
        renderStudentDashboard(dashboardContainer);
    } else if (role === "Faculty") {
        renderFacultyDashboard(dashboardContainer);
    } else if (role === "HOD/Admin" || role === "System Admin") {
        renderHODDashboard(dashboardContainer);
    }
}

// 1. STUDENT DASHBOARD VIEW
function renderStudentDashboard(container) {
    const projects = getStoreData("projects");
    const certs = getStoreData("certificates");
    const internships = getStoreData("internships");
    const achievements = getStoreData("achievements");
    const hubPosts = getStoreData("hub_posts");

    const totalSubmissions = projects.length + certs.length + internships.length + achievements.length;
    const verifiedCount = [...projects, ...certs, ...internships, ...achievements].filter(i => i.status === "Verified").length;
    
    // Profile Completion Percentage Calculation
    const studentUser = getCurrentUser();
    let score = 40; // Base details
    if (studentUser.avatar) score += 15;
    if (studentUser.bio) score += 15;
    if (studentUser.skills && studentUser.skills.length > 0) score += 15;
    if (projects.length > 0) score += 15;
    const completionPercent = Math.min(score, 100);

    container.innerHTML = `
        <!-- STAT CARDS GRID -->
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Profile Completion</span>
                    <div class="stat-value">${completionPercent}%</div>
                    <span class="stat-desc text-primary font-semibold"><i class="fa-solid fa-circle-info"></i> Portfolio Readiness</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-primary">
                    <i class="fa-solid fa-chart-pie"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Projects</span>
                    <div class="stat-value">${projects.length}</div>
                    <span class="stat-desc"><i class="fa-solid fa-code"></i> Total Submitted</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-purple">
                    <i class="fa-solid fa-diagram-project"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Certificates</span>
                    <div class="stat-value">${certs.length}</div>
                    <span class="stat-desc"><i class="fa-solid fa-award"></i> Earned & Verified</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-teal">
                    <i class="fa-solid fa-certificate"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Verified Portfolio</span>
                    <div class="stat-value">${verifiedCount} / ${totalSubmissions}</div>
                    <span class="stat-desc stat-trend-up"><i class="fa-solid fa-circle-check"></i> ${Math.round((verifiedCount/Math.max(totalSubmissions,1))*100)}% Verified</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-amber">
                    <i class="fa-solid fa-square-check"></i>
                </div>
            </div>
        </div>

        <!-- MAIN DASHBOARD CONTENT (2 COLUMNS) -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;" class="mobile-stack">
            <!-- LEFT COLUMN: PROFILE COMPLETION & RECENT SUBMISSIONS -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- PROFILE COMPLETION CARD -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-card) 0%, rgba(79, 70, 229, 0.05) 100%);">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <h3 class="card-title"><i class="fa-solid fa-bullseye text-primary"></i> Complete Portfolio Profile</h3>
                            <p class="card-subtitle">Keep your portfolio up-to-date to unlock verification badges and placement opportunities.</p>
                            
                            <div style="margin-top: 1.25rem;">
                                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.4rem;">
                                    <span>Overall Completion</span>
                                    <span>${completionPercent}%</span>
                                </div>
                                <div style="width: 100%; height: 8px; background-color: var(--border-color); border-radius: 4px; overflow: hidden;">
                                    <div style="width: ${completionPercent}%; height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent-purple)); border-radius: 4px; transition: width 0.8s ease;"></div>
                                </div>
                            </div>
                        </div>
                        <a href="student-profile.html" class="btn btn-primary btn-sm ms-3" style="white-space: nowrap;">
                            <i class="fa-solid fa-pen-to-square"></i> Complete Profile
                        </a>
                    </div>
                </div>

                <!-- RECENT SUBMISSIONS TABLE CARD -->
                <div class="card">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title"><i class="fa-solid fa-list-check text-primary"></i> Recent Submissions</h3>
                            <p class="card-subtitle">Track verification progress of your latest activity entries</p>
                        </div>
                        <a href="projects.html" class="btn btn-secondary btn-sm">View All</a>
                    </div>

                    <div class="table-responsive">
                        <table class="custom-table">
                            <thead>
                                <tr>
                                    <th>Activity Title</th>
                                    <th>Category</th>
                                    <th>Submitted Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${renderRecentSubmissionsRows(projects, certs, internships, achievements)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: QUICK NOTIFICATIONS & HYNA HUB HIGHLIGHT -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title"><i class="fa-solid fa-bell text-primary"></i> Notifications</h3>
                        <a href="notifications.html" class="text-xs text-primary font-semibold">View All</a>
                    </div>
                    <div id="dashboard-notif-preview">
                        ${renderNotificationPreviewRows()}
                    </div>
                </div>

                <div class="card" style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); color: white;">
                    <div class="card-header border-0 pb-0">
                        <h3 class="card-title text-white"><i class="fa-solid fa-comments text-accent-purple"></i> Hyna Hub Community</h3>
                    </div>
                    <div class="card-body pt-2" style="font-size: 0.85rem; color: #cbd5e1;">
                        <p class="mb-3">Connect with peers, share project updates, and showcase hackathon achievements!</p>
                        <a href="hyna-hub.html" class="btn btn-primary btn-sm" style="width: 100%;">
                            <i class="fa-solid fa-paper-plane"></i> Explore Community Feed
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 2. FACULTY DASHBOARD VIEW
function renderFacultyDashboard(container) {
    const students = getStoreData("students");
    const verifications = getStoreData("verification");
    const pendingCount = verifications.filter(v => v.status === "Submitted" || v.status === "Under Review").length;

    container.innerHTML = `
        <!-- FACULTY STAT CARDS -->
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Total Dept Students</span>
                    <div class="stat-value">${students.length}</div>
                    <span class="stat-desc"><i class="fa-solid fa-users"></i> CSE Department</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-primary">
                    <i class="fa-solid fa-user-graduate"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Pending Verifications</span>
                    <div class="stat-value text-amber">${pendingCount}</div>
                    <span class="stat-desc font-semibold text-amber"><i class="fa-solid fa-clock"></i> Action Required</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-amber">
                    <i class="fa-solid fa-hourglass-half"></i>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Verified Submissions</span>
                    <div class="stat-value">${verifications.filter(v => v.status === "Verified").length}</div>
                    <span class="stat-desc stat-trend-up"><i class="fa-solid fa-check-double"></i> Approved</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-teal">
                    <i class="fa-solid fa-circle-check"></i>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;" class="mobile-stack">
            <!-- VERIFICATION QUEUE CARD -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa-solid fa-clipboard-check text-primary"></i> Verification Queue</h3>
                    <a href="verification.html" class="btn btn-primary btn-sm">Open Full Queue</a>
                </div>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Submission</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${verifications.slice(0, 4).map(v => `
                                <tr>
                                    <td class="font-semibold">${v.studentName}</td>
                                    <td>${v.submissionTitle}</td>
                                    <td><span class="status-badge status-submitted">${v.category}</span></td>
                                    <td>
                                        <a href="verification.html" class="btn btn-sm btn-secondary">Review</a>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ANALYTICS CHART CANVAS -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa-solid fa-chart-column text-primary"></i> Category Distribution</h3>
                </div>
                <div style="position: relative; height: 260px;">
                    <canvas id="facultyChartCanvas"></canvas>
                </div>
            </div>
        </div>
    `;

    setTimeout(initFacultyChart, 100);
}

// 3. HOD / ADMIN DASHBOARD VIEW
function renderHODDashboard(container) {
    const students = getStoreData("students");
    const projects = getStoreData("projects");
    const certs = getStoreData("certificates");
    const verifications = getStoreData("verification");

    container.innerHTML = `
        <div class="stat-grid">
            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Department Students</span>
                    <div class="stat-value">${students.length}</div>
                    <span class="stat-desc"><i class="fa-solid fa-graduation-cap"></i> Total Enrolled</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-primary"><i class="fa-solid fa-users"></i></div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Active Projects</span>
                    <div class="stat-value">${projects.length}</div>
                    <span class="stat-desc"><i class="fa-solid fa-diagram-project"></i> Portfolio Projects</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-purple"><i class="fa-solid fa-code"></i></div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Earned Credentials</span>
                    <div class="stat-value">${certs.length}</div>
                    <span class="stat-desc"><i class="fa-solid fa-award"></i> Global Certificates</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-teal"><i class="fa-solid fa-certificate"></i></div>
            </div>

            <div class="stat-card">
                <div class="stat-info">
                    <span class="stat-label">Verification Rate</span>
                    <div class="stat-value">92%</div>
                    <span class="stat-desc stat-trend-up"><i class="fa-solid fa-chart-line"></i> High Quality</span>
                </div>
                <div class="stat-icon-wrapper stat-icon-amber"><i class="fa-solid fa-circle-check"></i></div>
            </div>
        </div>

        <!-- HOD CHARTS GRID -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-top: 1.5rem;" class="mobile-stack">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa-solid fa-chart-line text-primary"></i> Monthly Student Activity Trends</h3>
                </div>
                <div style="position: relative; height: 300px;">
                    <canvas id="hodTrendChartCanvas"></canvas>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title"><i class="fa-solid fa-chart-pie text-primary"></i> Submission Statuses</h3>
                </div>
                <div style="position: relative; height: 300px;">
                    <canvas id="hodPieChartCanvas"></canvas>
                </div>
            </div>
        </div>
    `;

    setTimeout(initHODCharts, 100);
}

// SUBMISSION ROW RENDERER HELPERS
function renderRecentSubmissionsRows(projects, certs, internships, achievements) {
    const all = [
        ...projects.map(p => ({ title: p.title, category: 'Project', date: p.startDate, status: p.status })),
        ...certs.map(c => ({ title: c.title, category: 'Certificate', date: c.issueDate, status: c.status })),
        ...internships.map(i => ({ title: `${i.role} at ${i.company}`, category: 'Internship', date: i.startDate, status: i.status })),
        ...achievements.map(a => ({ title: a.title, category: 'Achievement', date: a.date, status: a.status }))
    ];

    if (all.length === 0) {
        return `<tr><td colspan="4" class="text-center text-muted">No submissions recorded yet.</td></tr>`;
    }

    return all.slice(0, 5).map(item => {
        let statusClass = "status-submitted";
        if (item.status === "Verified") statusClass = "status-verified";
        if (item.status === "Under Review") statusClass = "status-under-review";
        if (item.status === "Rejected") statusClass = "status-rejected";

        return `
            <tr>
                <td class="font-semibold">${item.title}</td>
                <td><span class="status-badge status-draft">${item.category}</span></td>
                <td class="text-muted">${item.date}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;
    }).join('');
}

function renderNotificationPreviewRows() {
    const notifications = getStoreData("notifications");
    if (notifications.length === 0) {
        return `<p class="text-muted text-sm p-3 text-center">No new notifications</p>`;
    }

    return notifications.slice(0, 3).map(n => `
        <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
            <div class="font-semibold text-sm text-main">${n.title}</div>
            <div class="text-muted text-xs my-1">${n.message}</div>
            <div class="text-light text-xs">${n.date}</div>
        </div>
    `).join('');
}

// CHART INITIALIZERS (USING CHART.JS VIA CDN)
function initFacultyChart() {
    const ctx = document.getElementById('facultyChartCanvas');
    if (!ctx || typeof Chart === 'undefined') return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Projects', 'Certificates', 'Internships', 'Achievements'],
            datasets: [{
                label: 'Total Submissions',
                data: [12, 19, 7, 14],
                backgroundColor: ['#4f46e5', '#8b5cf6', '#0d9488', '#f59e0b'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

function initHODCharts() {
    const trendCtx = document.getElementById('hodTrendChartCanvas');
    const pieCtx = document.getElementById('hodPieChartCanvas');

    if (trendCtx && typeof Chart !== 'undefined') {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                datasets: [{
                    label: 'Monthly Portfolio Submissions',
                    data: [15, 22, 35, 45, 60, 52, 78, 90],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    if (pieCtx && typeof Chart !== 'undefined') {
        new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['Verified', 'Submitted', 'Under Review', 'Needs Changes'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}
