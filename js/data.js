/* ==========================================================================
   STELLA MARY'S COLLEGE OF ENGINEERING - CSE PORTFOLIO DATA STORE
   ========================================================================== */

const DEFAULT_USERS = [
    {
        id: "STU001",
        name: "Pravin Kumar",
        email: "student@stellamary.edu",
        role: "Student",
        registerNo: "962221104001",
        department: "Computer Science",
        year: "III",
        section: "A",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        bio: "Passionate Full-Stack Developer & AI Enthusiast. Building next-gen web applications.",
        skills: ["JavaScript", "HTML5/CSS3", "Python", "Git", "Node.js", "UI/UX Design"],
        cgpa: "8.5",
        password: "Dharshan@25"
    },
    {
        id: "FAC001",
        name: "Dr. S. Ramesh",
        email: "faculty@stellamary.edu",
        role: "Faculty",
        department: "Computer Science",
        designation: "Assistant Professor",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: "HOD001",
        name: "Dr. M. Aruldhas",
        email: "hod.cse@stellamary.edu",
        role: "HOD/Admin",
        department: "Computer Science",
        designation: "Head of Department",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: "ADM001",
        name: "System Administrator",
        email: "admin@stellamary.edu",
        role: "System Admin",
        department: "Central Administration",
        designation: "Lead System Administrator",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    }
];

const DEFAULT_STUDENTS = [
    {
        id: "STU001",
        name: "Pravin Kumar",
        email: "student@stellamary.edu",
        registerNo: "962221104001",
        rollNo: "25RUCSA001",
        erpId: "ERP2025001",
        phone: "7305104191",
        dob: "2003-05-15",
        department: "Computer Science",
        year: "III",
        section: "A",
        projects: 4,
        certificates: 8,
        internships: 2,
        achievements: 5,
        activityStatus: "Active",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: "STU002",
        name: "Alex Rivera",
        email: "alex.rivera@stellamary.edu",
        registerNo: "962221104002",
        rollNo: "25RUCSA002",
        erpId: "ERP2025002",
        phone: "9876543211",
        dob: "2003-08-22",
        department: "Computer Science",
        year: "III",
        section: "A",
        projects: 6,
        certificates: 10,
        internships: 1,
        achievements: 4,
        activityStatus: "Active",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: "STU003",
        name: "Sophia Chen",
        email: "sophia.chen@stellamary.edu",
        registerNo: "962221104003",
        rollNo: "25RUCSA003",
        erpId: "ERP2025003",
        phone: "9876543212",
        dob: "2002-12-10",
        department: "Computer Science",
        year: "IV",
        section: "B",
        projects: 8,
        certificates: 12,
        internships: 3,
        achievements: 7,
        activityStatus: "Active",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
    },
    {
        id: "STU004",
        name: "Marcus Vance",
        email: "marcus.vance@stellamary.edu",
        registerNo: "962221104004",
        rollNo: "25RUCSA004",
        erpId: "ERP2025004",
        phone: "9876543213",
        dob: "2004-02-28",
        department: "Computer Science",
        year: "II",
        section: "A",
        projects: 2,
        certificates: 4,
        internships: 0,
        achievements: 2,
        activityStatus: "Inactive",
        avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200"
    }
];

const DEFAULT_PROJECTS = [
    {
        id: "PROJ-101",
        title: "Autonomous Quadcopter Navigation System",
        type: "Capstone Project",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        technologies: ["Python", "OpenCV", "ROS", "C++"],
        startDate: "2026-01-15",
        endDate: "2026-05-30",
        githubUrl: "https://github.com/stellamary/quadcopter-nav",
        liveDemoUrl: "https://quadcopter-demo.stellamary.edu",
        description: "AI-assisted obstacle avoidance algorithm for drone fleet navigation in dense urban environments.",
        teamMembers: ["Pravin Kumar", "Alex Rivera"],
        status: "Verified",
        evidenceFile: "quadcopter_final_report.pdf"
    },
    {
        id: "PROJ-102",
        title: "Smart Department Asset Tracking Portal",
        type: "Research Project",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        technologies: ["JavaScript", "HTML5", "CSS3", "Chart.js"],
        startDate: "2026-06-01",
        endDate: "2026-08-10",
        githubUrl: "https://github.com/stellamary/dept-asset-tracker",
        liveDemoUrl: "https://asset-tracker.stellamary.edu",
        description: "Full stack dashboard system tracking departmental hardware, lab gear, and software license allocation.",
        teamMembers: ["Pravin Kumar"],
        status: "Submitted",
        evidenceFile: "asset_tracker_documentation.pdf"
    },
    {
        id: "PROJ-103",
        title: "NLP Sentiment Analyzer for Academic Feedback",
        type: "Coursework Project",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        technologies: ["Python", "NLTK", "Scikit-Learn"],
        startDate: "2026-03-10",
        endDate: "2026-04-20",
        githubUrl: "https://github.com/stellamary/nlp-feedback",
        liveDemoUrl: "",
        description: "Automated analysis tool assessing student feedback logs using sentiment classification algorithms.",
        teamMembers: ["Pravin Kumar", "Sophia Chen"],
        status: "Verified",
        evidenceFile: "nlp_sentiment_paper.pdf"
    }
];

const DEFAULT_CERTIFICATES = [
    {
        id: "CERT-201",
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        issueDate: "2026-02-14",
        credentialId: "AWS-ASA-994821",
        credentialUrl: "https://aws.amazon.com/verification/AWS-ASA-994821",
        description: "Validation of cloud architecture expertise across EC2, S3, IAM, and VPC infrastructure design.",
        status: "Verified",
        certificateFile: "aws_solutions_architect.pdf"
    },
    {
        id: "CERT-202",
        title: "Google Data Analytics Professional Certificate",
        issuer: "Coursera / Google",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        issueDate: "2026-05-10",
        credentialId: "GDA-882190",
        credentialUrl: "https://coursera.org/verify/GDA-882190",
        description: "Rigorous coursework in R programming, SQL data cleaning, and Tableau visualization.",
        status: "Submitted",
        certificateFile: "google_data_analytics.pdf"
    }
];

const DEFAULT_INTERNSHIPS = [
    {
        id: "INT-301",
        company: "Starlight Cybernetics Inc.",
        role: "Software Engineering Intern",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        startDate: "2026-05-01",
        endDate: "2026-07-31",
        duration: "3 Months",
        skills: ["JavaScript", "REST APIs", "Git", "Agile"],
        description: "Developed frontend UI components and unit test automation suites for the enterprise dashboard.",
        status: "Verified",
        offerLetter: "starlight_offer_letter.pdf",
        completionCert: "starlight_internship_cert.pdf"
    }
];

const DEFAULT_ACHIEVEMENTS = [
    {
        id: "ACH-401",
        title: "1st Place Winner – National Hackathon 2026",
        category: "Hackathon",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        organization: "TechInnovate Summit",
        date: "2026-04-12",
        description: "Secured first position among 150+ teams by building an AI-powered emergency dispatch coordinator.",
        status: "Verified",
        evidenceFile: "hackathon_trophy_cert.pdf"
    },
    {
        id: "ACH-402",
        title: "Best Paper Award – IEEE Student Symposium",
        category: "Publication",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        organization: "IEEE Computer Society",
        date: "2026-06-25",
        description: "Awarded Best Student Paper for research on efficient real-time object detection models.",
        status: "Submitted",
        evidenceFile: "ieee_best_paper.pdf"
    }
];

const DEFAULT_HYNA_HUB_POSTS = [
    {
        id: "POST-501",
        authorName: "Pravin Kumar",
        authorRole: "Student (III Year)",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        title: "Completed Autonomous Quadcopter Drone Prototype! 🚁",
        category: "Project Update",
        description: "Excited to share that our team has successfully flight-tested the obstacle avoidance algorithm! Check out the GitHub repo and live project link below.",
        date: "2026-08-10",
        skills: ["Python", "ROS", "OpenCV"],
        team: ["Pravin Kumar", "Alex Rivera"],
        likes: 24,
        comments: [
            { author: "Dr. S. Ramesh", text: "Outstanding work team! Excited to see this presented at the department expo.", date: "2026-08-11" }
        ]
    },
    {
        id: "POST-502",
        authorName: "Sophia Chen",
        authorRole: "Student (IV Year)",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
        title: "Upcoming Workshop: Introduction to Quantum Computing ⚛️",
        category: "Workshops",
        description: "Joining us this Friday at Lab 302 for a beginner-friendly hands-on session exploring Qiskit and quantum logic gates.",
        date: "2026-08-14",
        skills: ["Quantum Computing", "Qiskit", "Python"],
        team: ["Sophia Chen"],
        likes: 38,
        comments: []
    }
];

const DEFAULT_VERIFICATION_RECORDS = [
    {
        id: "VER-601",
        submissionId: "PROJ-102",
        submissionTitle: "Smart Department Asset Tracking Portal",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        category: "Project",
        submittedDate: "2026-08-11",
        status: "Submitted",
        evidenceFile: "asset_tracker_documentation.pdf",
        notes: "Awaiting faculty review."
    },
    {
        id: "VER-602",
        submissionId: "CERT-202",
        submissionTitle: "Google Data Analytics Professional Certificate",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        category: "Certificate",
        submittedDate: "2026-05-11",
        status: "Submitted",
        evidenceFile: "google_data_analytics.pdf",
        notes: "Credential URL provided."
    },
    {
        id: "VER-603",
        submissionId: "ACH-402",
        submissionTitle: "Best Paper Award – IEEE Student Symposium",
        studentId: "STU001",
        studentName: "Pravin Kumar",
        category: "Achievement",
        submittedDate: "2026-06-26",
        status: "Under Review",
        evidenceFile: "ieee_best_paper.pdf",
        notes: "Faculty reviewing conference details."
    }
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "NOTIF-701",
        title: "Submission Verified",
        message: "Your project 'Autonomous Quadcopter Navigation System' has been approved by Dr. S. Ramesh.",
        date: "2026-08-12 10:30 AM",
        read: false,
        type: "success"
    },
    {
        id: "NOTIF-702",
        title: "New Verification Task",
        message: "Pravin Kumar submitted 'Smart Department Asset Tracking Portal' for review.",
        date: "2026-08-11 02:15 PM",
        read: false,
        type: "info"
    }
];

const DEFAULT_AUDIT_LOGS = [
    {
        id: "AUD-801",
        user: "Pravin Kumar",
        action: "Project Created",
        target: "Smart Department Asset Tracking Portal",
        date: "2026-08-11",
        time: "02:14 PM",
        status: "Success"
    },
    {
        id: "AUD-802",
        user: "Pravin Kumar",
        action: "Role Switch",
        target: "Switched to Student Role",
        date: "2026-08-10",
        time: "09:00 AM",
        status: "Info"
    }
];

const DEFAULT_SETTINGS = {
    theme: "light",
    language: "English",
    emailNotifications: true,
    compactMode: false
};

// INITIALIZATION FUNCTION FOR LOCALSTORAGE
function initDataStore() {
    const usersRaw = localStorage.getItem("hyna_users");
    if (!usersRaw || usersRaw.includes("Demo")) {
        localStorage.setItem("hyna_users", JSON.stringify(DEFAULT_USERS));
        localStorage.setItem("hyna_students", JSON.stringify(DEFAULT_STUDENTS));
        localStorage.setItem("hyna_projects", JSON.stringify(DEFAULT_PROJECTS));
        localStorage.setItem("hyna_certificates", JSON.stringify(DEFAULT_CERTIFICATES));
        localStorage.setItem("hyna_internships", JSON.stringify(DEFAULT_INTERNSHIPS));
        localStorage.setItem("hyna_achievements", JSON.stringify(DEFAULT_ACHIEVEMENTS));
        localStorage.setItem("hyna_hub_posts", JSON.stringify(DEFAULT_HYNA_HUB_POSTS));
        localStorage.setItem("hyna_verification", JSON.stringify(DEFAULT_VERIFICATION_RECORDS));
        localStorage.setItem("hyna_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
        localStorage.setItem("hyna_audit_logs", JSON.stringify(DEFAULT_AUDIT_LOGS));
        localStorage.setItem("hyna_settings", JSON.stringify(DEFAULT_SETTINGS));
    } else {
        let students = JSON.parse(localStorage.getItem("hyna_students") || "[]");
        if (students.length > 0) {
            let changed = false;
            if (students[0].id === "STU001" && students[0].phone !== "7305104191") {
                students[0].phone = "7305104191";
                changed = true;
            }
            if (!students[0].hasOwnProperty("dob")) {
                students = students.map((s, i) => {
                    const def = DEFAULT_STUDENTS[i] || {};
                    return { ...def, ...s };
                });
                changed = true;
            }
            if (changed) {
                localStorage.setItem("hyna_students", JSON.stringify(students));
            }
        }
    }

    if (!localStorage.getItem("hyna_selected_role")) {
        localStorage.setItem("hyna_selected_role", "Student");
    }
}

// STORAGE HELPERS
function getStoreData(key) {
    const data = localStorage.getItem(`hyna_${key}`);
    return data ? JSON.parse(data) : [];
}

function setStoreData(key, data) {
    localStorage.setItem(`hyna_${key}`, JSON.stringify(data));
}

function resetAllDemoData() {
    localStorage.clear();
    initDataStore();
}

// Run initialization immediately on load
initDataStore();
