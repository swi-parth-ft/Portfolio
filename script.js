
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
    const width = window.innerWidth;
    const maxSpeed = 4;
    let isStopped = false;
    const ladybugImages = [
        'imgs/ladyBug.png', // Original image
        'imgs/splash.png' // New image after clicking
    ];


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
    // Kill Bug
    function killbug() {
        if (!isStopped) {
            isStopped = true;
            ladybug.src = ladybugImages[1];
            heroText.innerHTML = 'with expertise in Swift, SwiftUI, React, and Node.js, building high-performance iOS and web applications tailored to client needs.I focus on delivering seamless user experiences with scalable, maintainable solutions.';
            beyondText.innerHTML = "When I'm not coding, I immerse myself in a variety of creative pursuits.I love sketching, where I can translate my ideas into visual art, adding a unique dimension to my design thinking.Music is another passion; whether I'm playing an instrument or discovering new genres, it fuels my creativity and often inspires my projects.I'm an avid reader, constantly exploring new books that broaden my perspective and deepen my knowledge.Additionally, I enjoy tackling DIY projects, from crafting unique home decor to building small gadgets.These hobbies not only relax me but also inspire my work, allowing me to approach development with a fresh and innovative mindset.";
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
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;
        let dx = getRandomSpeed();
        let dy = getRandomSpeed();

        //Move
        function move() {
            if (!isStopped) {
                x += dx;
                y += dy;

                if (x <= 0 || x >= window.innerWidth - ladybug.offsetWidth) {
                    dx = getRandomSpeed();
                }
                if (y <= 0 || y >= window.innerHeight - ladybug.offsetHeight) {
                    dy = getRandomSpeed();
                }

                if (Math.random() < 0.02) {
                    dx = getRandomSpeed();
                    dy = getRandomSpeed();
                }

                const rotation = calculateRotation(dx, dy);
                ladybug.style.transform = `translate(${x}px, ${y}px) rotate(${rotation + 90}deg)`;
                bugMessage.style.transform = `translate(${x}px, ${y}px)`;
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

    observer.observe(projectSection);
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

        const counter = 0;

        if (
            bugCenterX > heroRect.left && bugCenterX < heroRect.right &&
            bugCenterY > heroRect.top && bugCenterY < heroRect.bottom
        ) {
            destroyText(heroText);
            bugMessage.innerHTML = 'Kill me to fix it!'
            bugMessage.style.opacity = '1';
            ladybug.style.height = '25px';
            ladybug.style.width = '25px';

        }

        if (
            bugCenterX > beyondRect.left && bugCenterX < beyondRect.right &&
            bugCenterY > beyondRect.top && bugCenterY < beyondRect.bottom
        ) {
            console.log('collided with beyond')
            destroyText(beyondText);
            bugMessage.innerHTML = 'Kill me to fix it!'
            bugMessage.style.opacity = '1';
            ladybug.style.height = '25px';
            ladybug.style.width = '25px';
        }
    }

    //Destroy text
    const fakeTags = ['<b>', '<i>', '<strong>', '<em>', '<mark>', '<small>', '<del>', '<ins>', '<sub>', '<sup>'];
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    let counter = 0;

    function destroyText(element) {
        const text = element.innerText;
        const words = text.split(' ');

        for (let i = 0; i < words.length; i++) {
            if (Math.random() < 0.3) { // 30% chance to wrap with a fake tag
                const randomTag = fakeTags[Math.floor(Math.random() * fakeTags.length)];
                words[i] = `${randomTag}${words[i]}${randomTag.replace('<', '</')}`;
            } else if (Math.random() < 0.3) { // 30% chance to change color
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                words[i] = `<span style="color: ${randomColor};">${words[i]}</span>`;
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
