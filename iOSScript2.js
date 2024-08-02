document.addEventListener('DOMContentLoaded', function () {
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');

    // Function to handle changes after progress is complete
    function handleProgressCompletion() {
        progressBar.classList.add('completed');
        progressBar.style.display = "none" // Show the additional content
    }

    // Check if the progress animation is complete
    progress.addEventListener('animationend', function (event) {
        if (event.animationName === 'fillProgress') {
            handleProgressCompletion();
        }
    });
});

// Fade Elements
document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add 'visible' class to the element when it comes into view
                entry.target.classList.add('visible');
                // Optionally, stop observing the element after it has appeared
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Set the threshold to determine when the element should be considered in view
        threshold: 0.1
    });

    // Observe each element with the 'fade-in' class
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const iconContainers = document.querySelectorAll(".icon-container");

    iconContainers.forEach(container => {
        container.addEventListener("click", () => {
            const title = container.getAttribute("data-title");
            const image = container.getAttribute("data-image");
            const screenshots = JSON.parse(container.getAttribute("data-screenshots"));
            const iPadscreenshots = JSON.parse(container.getAttribute("data-iPadscreenshots"));
            const desc = container.getAttribute("data-desc");
            const link = container.getAttribute("data-link");
            const type = container.getAttribute("data-type");

            document.getElementById("app-icon").src = image;
            document.getElementById("app-name").textContent = title;
            document.getElementById("app-description").textContent = desc;
            document.getElementById("app-link").href = link;

            const screenshotsContainer = document.getElementById("screenshots");
            screenshotsContainer.innerHTML = ""; // Clear existing screenshots

            const iPadscreenshotsContainer = document.getElementById("iPadscreenshots");
            iPadscreenshotsContainer.innerHTML = ""; // Clear existing screenshots

            screenshots.forEach(screenshot => {
                const img = document.createElement("img");
                img.src = screenshot;
                img.classList.add("screenshot", type);
                screenshotsContainer.appendChild(img);
            });

            iPadscreenshots.forEach(iPadscreenshot => {
                const img = document.createElement("img");
                img.src = iPadscreenshot;
                img.classList.add("iPadscreenshot");
                iPadscreenshotsContainer.appendChild(img);
            });

            // Show the modal
            document.getElementById("app-modal").style.display = "flex";
        });
    });
});

function closeModal() {
    document.getElementById("app-modal").style.display = "none";
}