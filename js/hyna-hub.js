function renderHynaHubFeed() {
    const feedContainer = document.getElementById("hyna-hub-feed");
    if (!feedContainer) return;

    const posts = getStoreData("hub_posts");

    const searchVal = document.getElementById("hub-search-input")
        ? document.getElementById("hub-search-input").value.toLowerCase()
        : "";

    const filterCategory = document.getElementById("hub-filter-category")
        ? document.getElementById("hub-filter-category").value
        : "ALL";

    // Remove/hide the old demo/sample post
    const filtered = posts.filter(p => {

        // Hide old sample post shown in screenshot
        const isDemoPost =
            p.title === "Completed Autonomous Quadcopter Drone Prototype!" ||
            p.authorName === "Pravin Kumar";

        if (isDemoPost) return false;

        const matchesSearch =
            (p.title || "").toLowerCase().includes(searchVal) ||
            (p.description || "").toLowerCase().includes(searchVal) ||
            (p.authorName || "").toLowerCase().includes(searchVal);

        const matchesCat =
            filterCategory === "ALL" ||
            p.category === filterCategory;

        return matchesSearch && matchesCat;
    });

    // No posts
    if (filtered.length === 0) {
        feedContainer.innerHTML = `
            <div class="card">
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fa-solid fa-comments"></i>
                    </div>

                    <div class="empty-state-title">
                        No Feed Posts Found
                    </div>

                    <div class="empty-state-desc">
                        Share project milestones, workshops, or hackathon updates with the department community.
                    </div>

                    <button class="btn btn-primary btn-sm"
                        onclick="openModal('create-post-modal')">
                        <i class="fa-solid fa-plus me-1"></i>
                        Create Community Post
                    </button>
                </div>
            </div>
        `;
        return;
    }

    feedContainer.innerHTML = filtered.map(p => `
        <div class="card mb-4" style="margin-bottom: 1.5rem;">

            <!-- POST HEADER -->
            <div class="d-flex align-items-center justify-content-between mb-3">

                <div class="d-flex align-items-center gap-3">

                    <img
                        src="${p.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}"
                        class="user-avatar-img"
                        style="width: 44px; height: 44px;"
                        alt="Author Avatar"
                    >

                    <div>
                        <div class="font-bold text-main text-sm"
                            style="font-size: 0.95rem;">
                            ${p.authorName}
                        </div>

                        <div class="text-muted text-xs">
                            ${p.authorRole || "Student"} • ${p.date}
                        </div>
                    </div>

                </div>

                <span class="status-badge status-submitted">
                    <i class="fa-solid fa-tag me-1"></i>
                    ${p.category}
                </span>

            </div>

            <!-- POST CONTENT -->
            <h3 class="font-bold text-main text-lg mb-2"
                style="font-size: 1.2rem;">
                ${p.title}
            </h3>

            <p class="text-muted text-sm mb-3"
                style="line-height: 1.6; font-size: 0.9rem;">
                ${p.description}
            </p>

            <!-- SKILLS -->
            ${(p.skills && p.skills.length > 0) ? `
                <div class="mb-3"
                    style="display:flex; flex-wrap:wrap; gap:0.35rem;">

                    ${p.skills.map(s => `
                        <span class="status-badge status-draft"
                            style="font-size:0.7rem;">
                            ${s}
                        </span>
                    `).join("")}

                </div>
            ` : ""}

            <!-- POST FOOTER -->
            <hr style="
                margin: 0.75rem 0;
                border: 0;
                border-top: 1px solid var(--border-color);
            ">

            <div class="d-flex align-items-center justify-content-between">

                <div class="d-flex align-items-center gap-3">

                    <button
                        onclick="togglePostLike('${p.id}')"
                        class="btn btn-sm btn-secondary">

                        <i class="fa-solid fa-heart text-danger me-1"></i>

                        <span id="like-count-${p.id}">
                            ${p.likes || 0}
                        </span>

                        Likes
                    </button>

                    <button
                        onclick="toggleCommentSection('${p.id}')"
                        class="btn btn-sm btn-secondary">

                        <i class="fa-solid fa-comment text-primary me-1"></i>

                        ${(p.comments || []).length}
                        Comments
                    </button>

                </div>

                <span class="text-xs text-muted">

                    <i class="fa-solid fa-users me-1"></i>

                    ${(p.team || []).join(", ")}

                </span>

            </div>

            <!-- COMMENTS -->
            <div
                id="comment-box-${p.id}"
                class="mt-3"
                style="
                    display:none;
                    background:var(--bg-main);
                    padding:1rem;
                    border-radius:var(--radius-md);
                    margin-top:1rem;
                "
            >

                <div class="mb-2 font-bold text-xs text-muted text-transform-uppercase">
                    Comments
                </div>

                <div
                    id="comments-list-${p.id}"
                    style="
                        display:flex;
                        flex-direction:column;
                        gap:0.5rem;
                    "
                    class="mb-3"
                >

                    ${(p.comments || []).map(c => `
                        <div style="
                            font-size:0.8rem;
                            background:var(--bg-card);
                            padding:0.5rem 0.75rem;
                            border-radius:var(--radius-sm);
                            border:1px solid var(--border-color);
                        ">

                            <strong class="text-primary">
                                ${c.author}:
                            </strong>

                            ${c.text}

                            <span class="text-light text-xs ms-2">
                                • ${c.date}
                            </span>

                        </div>
                    `).join("")}

                </div>

                <div style="display:flex; gap:0.5rem;">

                    <input
                        type="text"
                        id="comment-input-${p.id}"
                        class="form-control form-control-sm"
                        placeholder="Write a comment..."
                        style="font-size:0.8rem;"
                    >

                    <button
                        onclick="addPostComment('${p.id}')"
                        class="btn btn-primary btn-sm">

                        <i class="fa-solid fa-paper-plane"></i>

                    </button>

                </div>

            </div>

        </div>
    `).join("");
}