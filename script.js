
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

document.addEventListener('DOMContentLoaded', function () {
    const ladybug = document.querySelector('.ladybug');
    const bugMessage = document.getElementById('bugMessage');
    const projectSection = document.querySelector('.divider');
    const heroSection = document.querySelector('.heroSection');
    const heroText = document.querySelector('.textHero');
    const beyondText = document.querySelector('.textBeyond');
    const xcode = document.getElementById('xcode');
    const vscode = document.getElementById('vscode');
    const progreebar = document.querySelector('.progress');
    const width = window.innerWidth;
    const maxSpeed = 4;
    const alert = true;
    let isStopped = false;
    const ladybugImages = [
        'imgs/ladyBug.png', // Original image
        'imgs/splash.png' // New image after clicking
    ];
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const additionalContent = document.querySelector('.heroText');

    // Function to handle changes after progress is complete
    function handleProgressCompletion() {
        progressBar.classList.add('completed');
        additionalContent.style.display = 'block';
        progressBar.style.display = "none" // Show the additional content
    }

    // Check if the progress animation is complete
    progress.addEventListener('animationend', function (event) {
        if (event.animationName === 'fillProgress') {
            handleProgressCompletion();
        }
    });

    function getRandomSpeed() {
        if (width < 600) {
            return (Math.random() - 0.5) * 1;
        } else if (width >= 600 && width < 1200) {
            return (Math.random() - 0.5) * 2;
        } else {
            return (Math.random() - 0.5) * maxSpeed;
        }

    }

    function calculateRotation(dx, dy) {
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }
    // Stop Bug
    function stopLadybug() {
        if (!isStopped) {
            isStopped = true;
            bugMessage.innerHTML = 'Hey, Check it out'
            bugMessage.style.opacity = '1';
            ladybug.style.height = '25px';
            ladybug.style.width = '25px';
            setTimeout(() => {
                isStopped = false;
                bugMessage.style.opacity = '0';
                ladybug.style.height = '15px';
                ladybug.style.width = '15px';
            }, 2000);
        }
    }

    // Stop Bug
    function stopLadybug2() {
        if (!isStopped && alert) {

            isStopped = true;
            bugMessage.innerHTML = "Hey, I'm Poo, a friendly Bug! <br> I might mess things up, <br>you can kill me to fix that. <br>but please don't 🙂‍↔️"
            bugMessage.style.opacity = '1';

            setTimeout(() => {
                isStopped = false;

                bugMessage.style.opacity = '0';
                alert = false;
            }, 3000);

        }
    }
    // Kill Bug
    function killbug() {
        if (!isStopped) {
            isStopped = true;
            ladybug.src = ladybugImages[1];
            heroText.innerHTML = 'with expertise in Swift, SwiftUI, React, and Node.js, building high-performance iOS and web applications tailored to client needs.I focus on delivering seamless user experiences with scalable, maintainable solutions.';
            beyondText.innerHTML = "When I'm not coding, I immerse myself in various creative pursuits. I love sketching, translating ideas into visual art, and enhancing my design thinking. Music fuels my creativity, whether playing an instrument or discovering new genres. Reading broadens my perspective and deepens my knowledge. Tackling DIY projects, from crafting unique decor to building gadgets, relaxes and inspires me, allowing for a fresh and innovative approach to development.";
            bugMessage.style.opacity = '0';
            ladybug.style.height = '15px';
            ladybug.style.width = '15px';
            setTimeout(() => {
                isStopped = false;
                ladybug.src = ladybugImages[0];
            }, 10000);
        }
    }
    //Animate and Move
    function animate() {
        if (isStopped) {
            return;
        }
        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2 - 60;
        let dx = getRandomSpeed();
        let dy = getRandomSpeed();

        //Move
        function move() {
            if (!isStopped) {
                x += dx;
                y += dy;

                if (x <= 0) {
                    x = window.innerWidth - ladybug.offsetWidth;
                } else if (x >= window.innerWidth - ladybug.offsetWidth) {
                    x = 0;
                }

                if (y <= 0) {
                    y = window.innerHeight - ladybug.offsetHeight;
                } else if (y >= window.innerHeight - ladybug.offsetHeight) {
                    y = 0;
                }

                if (Math.random() < 0.02) {
                    dx = getRandomSpeed();
                    dy = getRandomSpeed();
                }

                const rotation = calculateRotation(dx, dy);
                ladybug.style.transform = `translate(${x}px, ${y}px) rotate(${rotation + 90}deg)`;
                bugMessage.style.transform = `translate(${x + 10}px, ${y + -50}px)`;
                checkCollision();
            }

            requestAnimationFrame(move);
        }
        move();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stopLadybug();
            }
        });
    }, { threshold: 0.1 });

    const observer2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stopLadybug2();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(projectSection);
    observer2.observe(progreebar);
    animate();

    ladybug.addEventListener('click', function () {
        killbug();
    });
    //check Collision
    function checkCollision() {
        const rect = ladybug.getBoundingClientRect();
        const bugCenterX = rect.left + rect.width / 2;
        const bugCenterY = rect.top + rect.height / 2;

        const heroRect = heroText.getBoundingClientRect();
        const beyondRect = beyondText.getBoundingClientRect();


        if (
            bugCenterX > heroRect.left && bugCenterX < heroRect.right &&
            bugCenterY > heroRect.top && bugCenterY < heroRect.bottom
        ) {
            destroyText(heroText);


        }

        if (
            bugCenterX > beyondRect.left && bugCenterX < beyondRect.right &&
            bugCenterY > beyondRect.top && bugCenterY < beyondRect.bottom
        ) {
            console.log('collided with beyond')
            destroyText(beyondText);
            bugMessage.innerHTML = 'Kill me to fix it!'
            bugMessage.style.opacity = '1';
            setTimeout(() => {
                bugMessage.style.opacity = '0';
            }, 2000);
        }


    }

    //Destroy text
    const fakeTags = ['<b>', '<i>', '<strong>', '<em>', '<mark>', '<small>', '<del>', '<ins>', '<sub>', '<sup>'];
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    let counter = 0;

    function destroyText(element) {
        const text = element.innerText;
        const words = text.split(' ');
        const numWords = words.length;

        // Generate 3 unique random indices
        const indices = new Set();
        while (indices.size < 3) {
            indices.add(Math.floor(Math.random() * numWords));
        }

        for (let i = 0; i < numWords; i++) {
            if (indices.has(i)) {
                if (Math.random() < 0.3) { // 30% chance to wrap with a fake tag
                    const randomTag = fakeTags[Math.floor(Math.random() * fakeTags.length)];
                    words[i] = `<span class="animated-text">${randomTag}${words[i]}${randomTag.replace('<', '</')}</span>`;
                } else if (Math.random() < 0.3) { // 30% chance to change color
                    const randomColor = colors[Math.floor(Math.random() * colors.length)];
                    words[i] = `<span class="animated-text" style="color: ${randomColor};">${words[i]}</span>`;
                }
            }
        }
        element.innerHTML = words.join(' ');
    }

});

// Tilt Buttons
const buttons = document.querySelectorAll('.tilt-button');
const radius = 200;
document.addEventListener('mousemove', (e) => {
    buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        const buttonX = rect.left + rect.width / 2;
        const buttonY = rect.top + rect.height / 2;

        const distance = Math.sqrt(Math.pow(buttonX - e.clientX, 2) + Math.pow(buttonY - e.clientY, 2));

        if (distance < radius) {
            const angle = Math.atan2(e.clientY - buttonY, e.clientX - buttonX) * (180 / Math.PI) / 10;
            button.style.transform = `scale(1.1)`;
        } else {
            button.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

function openFlashcard(pdfUrl) {
    document.getElementById('flashcard').style.display = 'flex';
    document.getElementById('flashcard-frame').src = pdfUrl;
}

function closeFlashcard() {
    document.getElementById('flashcard').style.display = 'none';
    document.getElementById('flashcard-frame').src = '';
}


