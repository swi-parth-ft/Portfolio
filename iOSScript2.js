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


document.addEventListener("DOMContentLoaded", () => {
    const iconContainers = document.querySelectorAll(".icon-container");

    iconContainers.forEach(container => {
        container.addEventListener("click", () => {
            const title = container.getAttribute("data-title");
            const image = container.getAttribute("data-image");
            const screenshots = JSON.parse(container.getAttribute("data-screenshots"));
            const desc = container.getAttribute("data-desc");
            const link = container.getAttribute("data-link");

            document.getElementById("app-icon").src = image;
            document.getElementById("app-name").textContent = title;
            document.getElementById("app-description").textContent = desc;
            document.getElementById("app-link").href = link;

            const screenshotsContainer = document.getElementById("screenshots");
            screenshotsContainer.innerHTML = ""; // Clear existing screenshots

            screenshots.forEach(screenshot => {
                const img = document.createElement("img");
                img.src = screenshot;
                img.classList.add("screenshot");
                screenshotsContainer.appendChild(img);
            });

            // Show the modal
            document.getElementById("app-modal").style.display = "flex";
        });
    });
});

function closeModal() {
    document.getElementById("app-modal").style.display = "none";
}