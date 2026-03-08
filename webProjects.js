const projects = [
    {
        title: "Pixera",
        kind: "Screenshot Styling Site",
        domain: "pixeratools.com",
        href: "https://pixeratools.com",
        logo: "imgs/web-showcase/pixera-logo.png",
        preview: "imgs/web-showcase/pixera-preview.png",
        accent: "pixera",
        description:
            "A crisp product site for a screenshot tool that leans into instant capture, styled gradients, soft shadows, blur effects, and privacy-safe sharing.",
        tags: ["Instant capture", "Styled screenshots", "Privacy redaction"]
    },
    {
        title: "Bezel Studio",
        kind: "App Marketing Site",
        domain: "bezelstudio.parthant.com",
        href: "https://bezelstudio.parthant.com",
        logo: "imgs/web-showcase/bezel-logo.png",
        preview: "imgs/web-showcase/bezel-preview-site.png",
        accent: "bezel",
        description:
            "A focused launch page for building App Store screenshots and device mockups, designed to make templates, polished framing, and fast export feel obvious at a glance.",
        tags: ["App Store visuals", "iPhone mockups", "Template-first flow"]
    },
    {
        title: "iDrift",
        kind: "Product Landing Page",
        domain: "parthant.com/iDrift.html",
        href: "https://www.parthant.com/iDrift.html",
        logo: "imgs/web-showcase/idrift-logo.png",
        preview: "imgs/web-showcase/idrift-preview.png",
        accent: "idrift",
        description:
            "A direct product page for turning iPhone into a wireless Mac controller, highlighting low-latency play, quick pairing, and a setup flow that feels lightweight instead of technical.",
        tags: ["Wireless controller", "Low-latency feel", "Mac gaming utility"]
    },
    {
        title: "It's Here",
        kind: "Spatial App Site",
        domain: "itshere.space",
        href: "https://itshere.space",
        logo: "imgs/web-showcase/itshere-logo.png",
        preview: "imgs/web-showcase/itshere-preview.png",
        accent: "itshere",
        description:
            "A compact web presence for a spatial navigation product, centered on mapped places, shared wayfinding, and a calmer presentation of AR utility without overexplaining the tech.",
        tags: ["AR navigation", "Mapped spaces", "Calm product story"]
    }
];

function createProjectCard(project) {
    const tags = project.tags.map(tag => `<li>${tag}</li>`).join("");

    return `
        <article class="project-card" data-accent="${project.accent}">
            <div class="project-copy">
                <div class="project-header">
                    <div class="project-logo">
                        <img src="${project.logo}" alt="${project.title} logo" loading="lazy">
                    </div>
                    <div>
                        <p class="project-kind">${project.kind}</p>
                        <h2 class="project-title">${project.title}</h2>
                        <a class="project-domain" href="${project.href}" target="_blank" rel="noreferrer">${project.domain}</a>
                    </div>
                </div>

                <p class="project-description">${project.description}</p>

                <ul class="project-tags" aria-label="${project.title} highlights">
                    ${tags}
                </ul>

                <div class="project-actions">
                    <a class="visit-button" href="${project.href}" target="_blank" rel="noreferrer">
                        Visit Site
                    </a>
                </div>
            </div>

            <div class="project-preview">
                <div class="browser-frame">
                    <div class="browser-bar">
                        <span class="browser-dot"></span>
                        <span class="browser-dot"></span>
                        <span class="browser-dot"></span>
                        <span class="browser-address">${project.domain}</span>
                    </div>
                    <div class="preview-image-wrap">
                        <img class="preview-image" src="${project.preview}" alt="${project.title} website preview" loading="lazy">
                    </div>
                </div>
            </div>
        </article>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("showcaseGrid");
    if (!grid) return;

    grid.innerHTML = projects.map(createProjectCard).join("");

    const cards = grid.querySelectorAll(".project-card");
    requestAnimationFrame(() => {
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 110}ms`;
            card.classList.add("is-visible");
        });
    });
});
