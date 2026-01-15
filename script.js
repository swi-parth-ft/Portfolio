
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
    let alert = true;
    let isStopped = false;
    let foodTarget = null;
    let foodEl = null;
    let bugAlive = true;
    let trapLevel = 0;

    // Centralized stop-state so multiple features can pause the bug without fighting each other.
    const stopReasons = new Set();
    function setStopped(reason, stopped) {
        if (stopped) stopReasons.add(reason);
        else stopReasons.delete(reason);
        isStopped = stopReasons.size > 0;
    }

    // Random messages when the bug bumps into app logos.
    const logoCollisionMessages = [
        "Ouch!",
        "Oh — these apps are bug free.",
        "This app is tight.",
        "No bugs here.",
        "Rock solid.",
        "Clean code.",
        "Okay… that one’s polished.",
        "I can’t break this one."
    ];
    const foodMessages = [
        "Yummm!",
        "Nom nom!",
        "Snack time!",
        "Tasty!",
        "Mmm... delicious."
    ];

    let logoCollisionTimer = null;
    let logoCollisionCooldown = false;
    let foodMessageTimer = null;

    // Called by the physics engine when the ladybug hits any logo.
    window.__ladybugLogoCollision = function () {
        if (logoCollisionCooldown) return;
        logoCollisionCooldown = true;
// After first logo hit, switch bug movement to fully random
hasLogoCollision = true;
isTargetingLogos = false;
        const msg = logoCollisionMessages[Math.floor(Math.random() * logoCollisionMessages.length)];

        // Pause briefly on impact
        setStopped("logo", true);
        bugMessage.innerHTML = msg;
        bugMessage.style.opacity = "1";

        // Small impact emphasis
        ladybug.style.height = "25px";
        ladybug.style.width = "25px";

        if (logoCollisionTimer) clearTimeout(logoCollisionTimer);
        logoCollisionTimer = setTimeout(() => {
            bugMessage.style.opacity = "0";
            ladybug.style.height = "15px";
            ladybug.style.width = "15px";
            setStopped("logo", false);
            logoCollisionCooldown = false;
        }, 1400);
    };

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

    function getRandomVelocity(scaleMin, scaleMax) {
        const scale = scaleMin + Math.random() * (scaleMax - scaleMin);
        return getRandomSpeed() * scale;
    }

    function calculateRotation(dx, dy) {
        return Math.atan2(dy, dx) * (180 / Math.PI);
    }

    function dropFood(x, y) {
        if (foodEl) foodEl.remove();
        foodEl = document.createElement('div');
        foodEl.className = 'ladybug-food';
        foodEl.style.left = `${x}px`;
        foodEl.style.top = `${y}px`;
        const foodTypes = ["crumb", "seed", "candy", "grain"];
        const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
        foodEl.dataset.type = foodType;

        if (foodType === "crumb") {
            const size = 6 + Math.random() * 8;
            const hue = 20 + Math.random() * 20;
            const sat = 45 + Math.random() * 25;
            const light = 35 + Math.random() * 20;
            const highlight = `hsl(${hue + 8} ${sat}% ${Math.min(light + 30, 80)}%)`;
            const base = `hsl(${hue} ${sat}% ${light}%)`;
            const dark = `hsl(${Math.max(hue - 8, 0)} ${sat}% ${Math.max(light - 18, 12)}%)`;
            foodEl.style.width = `${size}px`;
            foodEl.style.height = `${size}px`;
            foodEl.style.borderRadius = `${30 + Math.random() * 50}%`;
            foodEl.style.background = `radial-gradient(circle at 30% 30%, ${highlight} 0%, ${base} 55%, ${dark} 100%)`;
        } else if (foodType === "seed") {
            const w = 10 + Math.random() * 8;
            const h = 5 + Math.random() * 4;
            const hue = 30 + Math.random() * 10;
            const sat = 30 + Math.random() * 20;
            const light = 45 + Math.random() * 15;
            foodEl.style.width = `${w}px`;
            foodEl.style.height = `${h}px`;
            foodEl.style.borderRadius = `999px`;
            foodEl.style.background = `linear-gradient(120deg, hsl(${hue} ${sat}% ${Math.min(light + 18, 80)}%) 0%, hsl(${hue} ${sat}% ${light}%) 55%, hsl(${hue} ${sat}% ${Math.max(light - 16, 20)}%) 100%)`;
        } else if (foodType === "candy") {
            const size = 10 + Math.random() * 8;
            const hue = Math.floor(Math.random() * 360);
            foodEl.style.width = `${size}px`;
            foodEl.style.height = `${size}px`;
            foodEl.style.borderRadius = `50%`;
            foodEl.style.background = `
                linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.6) 70%, rgba(255,255,255,0.2) 100%),
                radial-gradient(circle at 35% 30%, hsla(${hue}, 85%, 75%, 0.95) 0%, hsla(${hue}, 80%, 55%, 0.95) 60%, hsla(${hue}, 70%, 40%, 0.95) 100%)
            `;
        } else {
            const w = 7 + Math.random() * 6;
            const h = 7 + Math.random() * 6;
            const hue = 42 + Math.random() * 12;
            const sat = 35 + Math.random() * 20;
            const light = 35 + Math.random() * 15;
            foodEl.style.width = `${w}px`;
            foodEl.style.height = `${h}px`;
            foodEl.style.borderRadius = `${20 + Math.random() * 60}%`;
            foodEl.style.background = `radial-gradient(circle at 35% 35%, hsl(${hue} ${sat}% ${Math.min(light + 25, 75)}%) 0%, hsl(${hue} ${sat}% ${light}%) 50%, hsl(${hue} ${sat}% ${Math.max(light - 18, 15)}%) 100%)`;
        }
        document.body.appendChild(foodEl);
        foodTarget = { x, y };
        isTargetingLogos = false;
    }

    function showFoodMessage() {
        const msg = foodMessages[Math.floor(Math.random() * foodMessages.length)];
        bugMessage.innerHTML = msg;
        bugMessage.style.opacity = "1";
        setStopped("food", true);
        if (foodMessageTimer) clearTimeout(foodMessageTimer);
        foodMessageTimer = setTimeout(() => {
            bugMessage.style.opacity = "0";
            setStopped("food", false);
        }, 1200);
    }
    // Stop Bug
    function stopLadybug() {
        if (!isStopped) {
setStopped("section", true);
            bugMessage.innerHTML = 'Hey, Check it out'
            bugMessage.style.opacity = '1';
            ladybug.style.height = '25px';
            ladybug.style.width = '25px';
            setTimeout(() => {
setStopped("section", false);
                bugMessage.style.opacity = '0';
                ladybug.style.height = '15px';
                ladybug.style.width = '15px';
            }, 2000);
        }
    }

    // Stop Bug
    function stopLadybug2() {
        if (!isStopped && alert) {

setStopped("intro", true);
            bugMessage.innerHTML = "Hey, I'm Poo, a friendly Bug! <br> I might mess things up, <br>you can kill me to fix that. <br>but please don't 🙂‍↔️"
            bugMessage.style.opacity = '1';

            setTimeout(() => {
                setStopped("intro", false);
                

                bugMessage.style.opacity = '0';
                alert = false;
            }, 3000);

        }
    }
    // Kill Bug
    function killbug(force) {
        if (!isStopped || force) {
            if (!bugAlive && !force) return;
            bugAlive = false;
            trapLevel = 0;
setStopped("kill", true);
            ladybug.src = ladybugImages[1];
            heroText.innerHTML = 'with expertise in Swift, SwiftUI, React, and Node.js, building high-performance iOS and web applications tailored to client needs.I focus on delivering seamless user experiences with scalable, maintainable solutions.';
            beyondText.innerHTML = "When I'm not coding, I immerse myself in various creative pursuits. I love sketching, translating ideas into visual art, and enhancing my design thinking. Music fuels my creativity, whether playing an instrument or discovering new genres. Reading broadens my perspective and deepens my knowledge. Tackling DIY projects, from crafting unique decor to building gadgets, relaxes and inspires me, allowing for a fresh and innovative approach to development.";
            bugMessage.style.opacity = '0';
            ladybug.style.height = '15px';
            ladybug.style.width = '15px';
            if (typeof window.__resetAppLogos === "function") {
                window.__resetAppLogos();
            }
            setTimeout(() => {
setStopped("kill", false);
                ladybug.src = ladybugImages[0];
                bugAlive = true;
            }, 10000);
        }
    }

    window.__killLadybug = function () {
        killbug(true);
    };
    window.__isLadybugAlive = function () {
        return bugAlive;
    };
    window.__setLadybugTrap = function (level) {
        trapLevel = Math.max(0, Math.min(1, Number(level) || 0));
    };
    //Animate and Move
    let isTargetingLogos = true; // Start by targeting logos
let hasLogoCollision = false; // After first logo hit, always use random movement/speed
    let nextDirectionChangeAt = performance.now();

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
                const bugRect = ladybug.getBoundingClientRect();
                const bugCenterX = bugRect.left + bugRect.width / 2;
                const bugCenterY = bugRect.top + bugRect.height / 2;

                // Check if we should target logos
if (!foodTarget && isTargetingLogos && !hasLogoCollision) {
                        const appLogos = document.querySelectorAll('.app-logo');
                    // Only target logos that are visible (have non-zero dimensions)
                    const visibleLogos = Array.from(appLogos).filter(logo => {
                        const r = logo.getBoundingClientRect();
                        return r.width > 0 && r.height > 0;
                    });

                    if (visibleLogos.length > 0) {
                        // Just move diagonally down - no tracking specific logos
                        const speed = 1.5;
                        dx = speed;  // Move right
                        dy = speed;  // Move down

                        // Check if we hit ANY logo
                        const bugRect = ladybug.getBoundingClientRect();
                        const bugX = bugRect.left + bugRect.width / 2;
                        const bugY = bugRect.top + bugRect.height / 2;

                        for (const logo of visibleLogos) {
                            const logoRect = logo.getBoundingClientRect();
                            const logoX = logoRect.left + logoRect.width / 2;
                            const logoY = logoRect.top + logoRect.height / 2;
                            const dist = Math.sqrt((logoX - bugX) ** 2 + (logoY - bugY) ** 2);

                            if (dist < 80) {
                                isTargetingLogos = false;
                                dx = getRandomSpeed();
                                dy = getRandomSpeed();
                                break;
                            }
                        }
                    }
                } else if (!foodTarget) {
                    // Random movement
                    const now = performance.now();
                    const minInterval = hasLogoCollision ? 1400 : 900;
                    const maxInterval = hasLogoCollision ? 3800 : 2000;

                    if (now >= nextDirectionChangeAt) {
                        dx = getRandomVelocity(0.5, hasLogoCollision ? 2.8 : 2.1);
                        dy = getRandomVelocity(0.5, hasLogoCollision ? 2.8 : 2.1);
                        nextDirectionChangeAt = now + (minInterval + Math.random() * (maxInterval - minInterval));
                    }
                } else {
                    const toX = foodTarget.x - bugCenterX;
                    const toY = foodTarget.y - bugCenterY;
                    const dist = Math.hypot(toX, toY);
                    if (dist < 14) {
                        foodTarget = null;
                        if (foodEl) {
                            foodEl.remove();
                            foodEl = null;
                        }
                        showFoodMessage();
                        nextDirectionChangeAt = performance.now();
                    } else {
                        const foodSpeed = 2.2;
                        dx = (toX / dist) * foodSpeed;
                        dy = (toY / dist) * foodSpeed;
                    }
                }


                const trapSlowdown = 1 - trapLevel * 0.75;
                if (trapLevel > 0.35) {
                    const time = performance.now();
                    const struggle = trapLevel * 0.35;
                    dx += Math.sin(time / 65) * struggle;
                    dy += Math.cos(time / 58) * struggle;
                    dx += (Math.random() - 0.5) * trapLevel * 0.25;
                    dy += (Math.random() - 0.5) * trapLevel * 0.25;
                }
                if (trapLevel > 0.7) {
                    dx += (Math.random() - 0.5) * trapLevel * 0.45;
                    dy += (Math.random() - 0.5) * trapLevel * 0.45;
                }
                x += dx * trapSlowdown;
                y += dy * trapSlowdown;

                // LOGO AVOIDANCE - Only when NOT targeting (random mode)
                // When targeting, we want to approach the logo
                if (!isTargetingLogos) {
                    const appLogos = document.querySelectorAll('.app-logo');

                    appLogos.forEach(logo => {
                        const logoRect = logo.getBoundingClientRect();
                        if (logoRect.width === 0) return; // Skip invisible logos

                        const logoCenterX = logoRect.left + logoRect.width / 2;
                        const logoCenterY = logoRect.top + logoRect.height / 2;

                        const distX = bugCenterX - logoCenterX;
                        const distY = bugCenterY - logoCenterY;
                        const distance = Math.sqrt(distX * distX + distY * distY);

                        const minDistance = 60; // Bug should stay 60px away from logo center

                        if (distance < minDistance && distance > 0) {
                            // Push bug away from logo
                            const pushX = (distX / distance) * (minDistance - distance + 5);
                            const pushY = (distY / distance) * (minDistance - distance + 5);
                            x += pushX;
                            y += pushY;

                            // Reverse direction away from logo
                            dx = (distX / distance) * Math.abs(dx) * 1.5;
                            dy = (distY / distance) * Math.abs(dy) * 1.5;
                        }
                    });
                }

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

                const now = performance.now();
                const rotation = calculateRotation(dx, dy);
                const shakeStrength = trapLevel > 0.6 ? (trapLevel - 0.6) * 16 : 0;
                const jitterX = shakeStrength ? (Math.random() - 0.5) * shakeStrength : 0;
                const jitterY = shakeStrength ? (Math.random() - 0.5) * shakeStrength : 0;
                const wobble = trapLevel > 0.4 ? Math.sin(now / 55) * trapLevel * 14 : 0;
                ladybug.style.transform = `translate(${x + jitterX}px, ${y + jitterY}px) rotate(${rotation + 90 + wobble}deg)`;
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

    let hammerActive = false;
    const hammerCursor = document.createElement('div');
    hammerCursor.className = 'ladybug-hammer-cursor';
    document.body.appendChild(hammerCursor);

    function updateHammerCursor(x, y) {
        hammerCursor.style.left = `${x}px`;
        hammerCursor.style.top = `${y}px`;
    }

    function triggerHammerSwing() {
        hammerCursor.classList.remove('is-swinging');
        void hammerCursor.offsetWidth;
        hammerCursor.classList.add('is-swinging');
    }

    ladybug.addEventListener('click', function () {
        killbug();
    });
    document.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        const target = event.target;
        if (target.closest('a, button, input, textarea, select, .app-logo, .logo-focus-image, .logo-focus-action, .logo-focus-title, .logo-focus-frame, .ladybug, .ladybug-hammer-cursor, .hero-social-bar, .ai-chat-overlay, .ai-chat-panel')) {
            return;
        }
        if (document.querySelector('.logo-focus-image.is-visible')) return;
        dropFood(event.clientX, event.clientY);
    });
    document.addEventListener('mousemove', event => {
        const rect = ladybug.getBoundingClientRect();
        const bugX = rect.left + rect.width / 2;
        const bugY = rect.top + rect.height / 2;
        const dist = Math.hypot(event.clientX - bugX, event.clientY - bugY);
        hammerActive = dist < 80;
        document.body.classList.toggle('ladybug-hover', hammerActive);
        hammerCursor.classList.toggle('is-visible', hammerActive);
        if (hammerActive) {
            updateHammerCursor(event.clientX, event.clientY);
        }
    });
    document.addEventListener('mousedown', event => {
        if (!hammerActive) return;
        triggerHammerSwing();
        updateHammerCursor(event.clientX, event.clientY);
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



// ---------------------------------------------------------
// Robust Physics Engine with Collision Detection
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.app-logos-container');
    if (!container) return;

    let logos = [];
    let bodies = [];
    let bounds = { width: 0, height: 0 };
    let isInitialized = false;
    let initialPositions = [];
    let driftTimer = null;
    let resetAnimationFrame = null;
    let isResetting = false;
    let activeDrag = null;
    let interactionsAttached = false;
    let focusedBody = null;
    const scrollLogos = true;
    const scrollSpeed = 0.35;
    const tiltSpeedFactor = 0.5;

    // Global Physics Configuration
    let physicsConfig = {
        scale: 1.5,
        size: 97.5,
        offset: 16.25
    };

    // Physics Configuration
    const PHYSICS = {
        damping: 1.0,           // No friction for perpetual motion
        speedLimit: 0.1,        // SUPER SLOW (was 0.25)
        separationForce: 0.5,
        hoverScale: 1.15
    };
    const COLLISION_SPEED_MULTIPLIER = 0.5;
    const FOCUS = {
        scaleBoost: 1.4,
        flipDeg: 360,
        centerPull: 0.14,
        progressLerp: 0.12
    };

    function dampenSpeed(body) {
        body.vx *= COLLISION_SPEED_MULTIPLIER;
        body.vy *= COLLISION_SPEED_MULTIPLIER;
    }

    function getContainerBounds() {
        let w = container.clientWidth;
        let h = container.clientHeight;

        if (w === 0) {
            w = Math.min(window.innerWidth * 0.8, 900);
        }
        if (h === 0) h = 300;

        bounds.width = w;
        bounds.height = h;

        return { width: w, height: h };
    }

    function computeInitialPositions() {
        const { width: w, height: h } = getContainerBounds();
        const totalLogos = logos.length;
        const gap = 60 * physicsConfig.scale;
        const totalWidth = totalLogos * physicsConfig.size + (totalLogos - 1) * gap;

        const startX = (w - totalWidth) / 2;
        const startY = (h - physicsConfig.size) / 2;

        return logos.map((_, index) => ({
            x: startX + index * (physicsConfig.size + gap),
            y: startY
        }));
    }

    function applyDrift() {
        bodies.forEach(body => {
            applyDriftToBody(body);
        });
    }

    function applyDriftToBody(body) {
        body.vx = 0;
        body.vy = 0;
        body.rotSpeedX = (Math.random() - 0.5) * 0.2 * tiltSpeedFactor;
        body.rotSpeedY = (Math.random() - 0.5) * 0.2 * tiltSpeedFactor;
        body.rotSpeedZ = (Math.random() - 0.5) * 0.1 * tiltSpeedFactor;
    }

    function createFocusImage() {
        const wrapper = document.createElement('div');
        wrapper.className = 'logo-focus-image';
        const title = document.createElement('div');
        title.className = 'logo-focus-title';
        const frame = document.createElement('div');
        frame.className = 'logo-focus-frame';
        const img = document.createElement('img');
        img.alt = '';
        const action = document.createElement('a');
        action.className = 'logo-focus-action';
        action.setAttribute('role', 'button');
        action.setAttribute('href', '#');
        action.innerHTML = '<i class="fa-brands fa-apple" aria-hidden="true"></i><span>View on App Store</span>';
        action.addEventListener('click', event => {
            if (action.getAttribute('href') === '#') {
                event.preventDefault();
            }
        });
        const askButton = document.createElement('button');
        askButton.className = 'logo-focus-ask hero-ai-trigger';
        askButton.type = 'button';
        askButton.textContent = 'Ask AIParth';
        wrapper.appendChild(title);
        frame.appendChild(img);
        wrapper.appendChild(frame);
        wrapper.appendChild(action);
        wrapper.appendChild(askButton);
        document.body.appendChild(wrapper);

        return { wrapper, frame, img, title, action, askButton };
    }

    function createFocusBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'logo-focus-backdrop';
        document.body.appendChild(backdrop);
        return backdrop;
    }

    function createFocusSpotlight() {
        const spotlight = document.createElement('div');
        spotlight.className = 'logo-focus-spotlight';
        document.body.appendChild(spotlight);
        return spotlight;
    }

    function createFocusDust() {
        const canvas = document.createElement('canvas');
        canvas.className = 'logo-focus-dust';
        const ctx = canvas.getContext('2d');
        document.body.appendChild(canvas);

        const state = {
            canvas,
            ctx,
            particles: [],
            width: 0,
            height: 0,
            centerX: 0,
            centerY: 0,
            radius: 0,
            visible: false
        };

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            state.width = window.innerWidth;
            state.height = window.innerHeight;
            canvas.width = state.width * dpr;
            canvas.height = state.height * dpr;
            canvas.style.width = `${state.width}px`;
            canvas.style.height = `${state.height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            state.centerX = state.width / 2;
            state.centerY = state.height / 2;
            state.radius = Math.min(state.width, state.height) * 0.28 + 90;
        }

        function spawnParticle(initial) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * state.radius;
            const ellipseY = 0.7;
            const spread = initial ? 1 : 0.9 + Math.random() * 0.2;
            const speed = 0.08 + Math.random() * 0.28;
            const driftAngle = Math.random() * Math.PI * 2;

            return {
                x: state.centerX + Math.cos(angle) * radius,
                y: state.centerY + Math.sin(angle) * radius * ellipseY * spread,
                size: 0.8 + Math.random() * 2.0,
                alpha: 0.18 + Math.random() * 0.4,
                vx: Math.cos(driftAngle) * speed,
                vy: Math.sin(driftAngle) * speed,
                twinkle: Math.random() * Math.PI * 2
            };
        }

        resize();
        window.addEventListener('resize', resize);

        const count = 180;
        for (let i = 0; i < count; i++) {
            state.particles.push(spawnParticle(true));
        }

        function updateDust() {
            ctx.clearRect(0, 0, state.width, state.height);
            if (state.visible) {
                state.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.twinkle += 0.02;
                    const pulse = 0.7 + Math.sin(p.twinkle) * 0.4;

                    const ellipseY = 0.7;
                    const dx = p.x - state.centerX;
                    const dy = (p.y - state.centerY) / ellipseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist > state.radius * 1.05) {
                        Object.assign(p, spawnParticle(false));
                    }

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * pulse})`;
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            requestAnimationFrame(updateDust);
        }

        updateDust();

        return state;
    }

    const focusBackdrop = createFocusBackdrop();
    const focusSpotlight = createFocusSpotlight();
    const focusDust = createFocusDust();
    const focusImage = createFocusImage();

    function showFocusImage(body) {
        const imgEl = body.element.querySelector('.face.front img');
        if (!imgEl) return;
        focusImage.img.src = imgEl.getAttribute('src');
        focusImage.img.alt = body.element.dataset.title || 'App logo';
        focusImage.title.textContent = body.element.dataset.title || 'App Title';
        const label = body.element.dataset.button || 'View on App Store';
        const labelEl = focusImage.action.querySelector('span');
        if (labelEl) labelEl.textContent = label;
        focusImage.action.setAttribute('href', body.element.dataset.link || '#');
        focusImage.askButton.dataset.askTitle = body.element.dataset.title || 'this app';
        focusImage.wrapper.style.opacity = '';
        focusImage.frame.style.transform = '';
        focusImage.wrapper.classList.add('is-visible');
        focusBackdrop.classList.add('is-visible');
    }

    function hideFocusImage() {
        focusImage.wrapper.classList.remove('is-visible');
        focusImage.wrapper.style.opacity = '';
        focusImage.frame.style.transform = '';
        focusBackdrop.classList.remove('is-visible');
        focusSpotlight.classList.remove('is-visible');
        focusDust.canvas.classList.remove('is-visible');
        focusDust.visible = false;
    }

    function focusLogo(body) {
        if (!body) return;
        if (focusedBody === body) {
            clearFocus();
            return;
        }
        if (focusedBody) {
            focusedBody.isFocused = false;
            focusedBody.element.classList.remove('is-focused');
            applyDriftToBody(focusedBody);
        }

        focusedBody = body;
        body.isFocused = true;
        body.isReturning = false;
        body.returnX = body.x;
        body.returnY = body.y;
        body.isDragging = false;
        body.vx = 0;
        body.vy = 0;
        body.rotationX = 0;
        body.rotationY = 0;
        body.rotationZ = 0;
        body.rotSpeedX = 0;
        body.rotSpeedY = 0;
        body.rotSpeedZ = 0;
        body.element.classList.add('is-focused');
        showFocusImage(body);
    }

    function clearFocus() {
        if (!focusedBody) return;
        const body = focusedBody;
        body.isFocused = false;
        body.isReturning = true;
        body.element.classList.remove('is-focused');
        focusedBody = null;
        hideFocusImage();
    }

    window.__clearLogoFocus = clearFocus;

    function resetLogosToInitialPositions() {
        if (!isInitialized) return;
        if (focusedBody) {
            clearFocus();
        }
        initialPositions = computeInitialPositions();
        if (initialPositions.length === 0) return;

        if (driftTimer) clearTimeout(driftTimer);
        if (resetAnimationFrame) cancelAnimationFrame(resetAnimationFrame);
        if (activeDrag) {
            activeDrag.body.isDragging = false;
            activeDrag = null;
        }

        const starts = bodies.map(body => ({
            x: body.x,
            y: body.y,
            rotationX: body.rotationX,
            rotationY: body.rotationY,
            rotationZ: body.rotationZ
        }));
        const startTime = performance.now();
        const duration = 650;
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        isResetting = true;
        const step = now => {
            const t = Math.min(1, (now - startTime) / duration);
            const eased = easeOutCubic(t);

            bodies.forEach((body, index) => {
                const pos = initialPositions[index];
                const start = starts[index];
                if (!pos || !start) return;
                body.x = start.x + (pos.x - start.x) * eased;
                body.y = start.y + (pos.y - start.y) * eased;
                body.vx = 0;
                body.vy = 0;
                body.rotationX = start.rotationX * (1 - eased);
                body.rotationY = start.rotationY * (1 - eased);
                body.rotationZ = start.rotationZ * (1 - eased);
                body.rotSpeedX = 0;
                body.rotSpeedY = 0;
                body.rotSpeedZ = 0;
                body.isHovered = false;
                body.bugCooldown = false;
                body.isFocused = false;
                body.isReturning = false;
                body.focusProgress = 0;
            });

            if (t < 1) {
                resetAnimationFrame = requestAnimationFrame(step);
            } else {
                resetAnimationFrame = null;
                isResetting = false;
                applyDrift();
            }
        };

        resetAnimationFrame = requestAnimationFrame(step);
    }

    window.__resetAppLogos = resetLogosToInitialPositions;

    function initPhysics() {
        // Fallback if dimensions are 0 (hidden)
        const { width: w, height: h } = getContainerBounds();
        console.log(`[Physics] Init. Width: ${w}, Height: ${h}`);

        logos = Array.from(document.querySelectorAll('.app-logo'));

        if (scrollLogos) {
            const gap = 60 * physicsConfig.scale;
            const step = physicsConfig.size + gap;
            const needed = Math.max(1, Math.ceil((bounds.width + step) / step));
            if (logos.length < needed) {
                const originals = logos.slice();
                let cloneIndex = 0;
                while (logos.length < needed) {
                    const source = originals[cloneIndex % originals.length];
                    const clone = source.cloneNode(true);
                    clone.dataset.clone = 'true';
                    clone.classList.add('app-logo-clone');
                    container.appendChild(clone);
                    logos.push(clone);
                    cloneIndex += 1;
                }
            }
        }

        // -----------------------------------------------------
        // RESPONSIVE CONFIGURATION
        // -----------------------------------------------------
        const isMobile = window.innerWidth < 768;
        const BASE_SIZE = 195;
        // Keep the same visual size after increasing the render base size.
        const targetScale = isMobile ? 0.25 : 0.5;

        physicsConfig.scale = targetScale;
        physicsConfig.size = BASE_SIZE * targetScale;
        // Offset = (PhysicsSize - VisualBaseSize) / 2
        physicsConfig.offset = (physicsConfig.size - BASE_SIZE) / 2;

        // -----------------------------------------------------
        // 3D STACK BUILDER
        // Inject layers to create solid rounded body
        // -----------------------------------------------------
        logos.forEach(logo => {
            const cube = logo.querySelector('.cube');
            if (!cube) return;

            // Remove any existing layers (if re-running) to be safe
            const oldLayers = cube.querySelectorAll('.layer');
            oldLayers.forEach(l => l.remove());

            // We need high density to simulate a solid block.
            // Spacing 0.5px from -9.5 to 9.5 (just inside the 10/-10 caps)
            for (let z = -10; z <= 10; z += 1) {
                const layer = document.createElement('div');
                layer.className = 'face layer';
                layer.style.transform = `translateZ(${z}px)`;
                // Insert before the Front face (last child usually) so Front stays on top
                cube.insertBefore(layer, cube.querySelector('.face.front'));
            }
        });

        // Linear Start Configuration
        const positions = computeInitialPositions();
        initialPositions = positions;

        bodies = logos.map((el, index) => {
            const position = positions[index] || { x: 0, y: 0 };
            const x = position.x;
            const y = position.y;

            el.classList.add('active');

            return {
                element: el,
                x: x,
                y: y,
                vx: 0,
                vy: 0,
                radius: physicsConfig.size / 2,
                mass: 1,
                isHovered: false,
                isDragging: false,
                isFocused: false,
                isReturning: false,
                focusProgress: 0,
                returnX: 0,
                returnY: 0,
                // 3D Rotations
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,

                rotSpeedX: 0,
                rotSpeedY: 0,
                rotSpeedZ: 0
            };
        });

        isInitialized = true;
        if (!interactionsAttached) {
            if (!scrollLogos) {
                setupDragHandlers();
            }
            interactionsAttached = true;
        }
        update();

        // 2s Delay sequence
        driftTimer = setTimeout(() => {
            applyDrift();
        }, 2000);
    }

    // Elastic Collision
    function resolveCollision(b1, b2) {
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const d2 = dx * dx + dy * dy;
        const d = Math.sqrt(d2);
        const minDist = b1.radius + b2.radius;

        if (d < minDist && d > 0) {
            const overlap = (minDist - d) / 2;
            const offsetX = (dx / d) * overlap;
            const offsetY = (dy / d) * overlap;

            b1.x -= offsetX; b1.y -= offsetY;
            b2.x += offsetX; b2.y += offsetY;

            const nx = dx / d;
            const ny = dy / d;

            const v1n = b1.vx * nx + b1.vy * ny;
            const v2n = b2.vx * nx + b2.vy * ny;

            const m1 = 1, m2 = 1;
            const v1nFinal = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
            const v2nFinal = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

            b1.vx += nx * (v1nFinal - v1n);
            b1.vy += ny * (v1nFinal - v1n);
            b2.vx += nx * (v2nFinal - v2n);
            b2.vy += ny * (v2nFinal - v2n);

            dampenSpeed(b1);
            dampenSpeed(b2);
        }
    }

    function update() {
        if (!isInitialized) return;

        const { width: w, height: h } = getContainerBounds();
        const gap = 60 * physicsConfig.scale;
        const step = physicsConfig.size + gap;
        const baseWidth = Math.max(step * bodies.length, 1);
        const startX = (w - baseWidth) / 2;
        const minX = startX;
        const maxX = startX + baseWidth;
        const rowY = (h - physicsConfig.size) / 2;

        bodies.forEach((body, i) => {
            const focusTarget = body.isFocused ? 1 : 0;
            body.focusProgress += (focusTarget - body.focusProgress) * FOCUS.progressLerp;

            // 1. Update Position
            if (body.isFocused) {
                const { width: w, height: h } = getContainerBounds();
                const targetX = (w - physicsConfig.size) / 2;
                const targetY = (h - physicsConfig.size) / 2;
                body.x += (targetX - body.x) * FOCUS.centerPull;
                body.y += (targetY - body.y) * FOCUS.centerPull;
                body.vx = 0;
                body.vy = 0;
                body.rotSpeedX = 0;
                body.rotSpeedY = 0;
                body.rotSpeedZ = 0;
            } else if (body.isReturning) {
                body.x += (body.returnX - body.x) * 0.2;
                body.y += (body.returnY - body.y) * 0.2;
                body.vx = 0;
                body.vy = 0;
                body.rotSpeedX = 0;
                body.rotSpeedY = 0;
                body.rotSpeedZ = 0;
                body.rotationX += (0 - body.rotationX) * 0.2;
                body.rotationY += (0 - body.rotationY) * 0.2;
                body.rotationZ += (0 - body.rotationZ) * 0.2;

                const dist = Math.hypot(body.returnX - body.x, body.returnY - body.y);
                if (dist < 0.6) {
                    body.x = body.returnX;
                    body.y = body.returnY;
                    body.rotationX = 0;
                    body.rotationY = 0;
                    body.rotationZ = 0;
                    body.isReturning = false;
                    applyDriftToBody(body);
                }
            } else if (!body.isDragging) {
                if (scrollLogos) {
                    if (typeof body.scrollX !== 'number') {
                        body.scrollX = startX + i * step;
                    }
                    body.scrollX += scrollSpeed;
                    if (body.scrollX > maxX) {
                        body.scrollX = minX;
                    }
                    body.x = body.scrollX;
                    body.y = rowY;
                } else {
                    body.x += body.vx;
                    body.y += body.vy;
                }

                // 3D Rotation Updates
                body.rotationX += body.rotSpeedX;
                body.rotationY += body.rotSpeedY;
                body.rotationZ += body.rotSpeedZ;
            } else {
                body.vx = 0;
                body.vy = 0;
                body.rotSpeedX = 0;
                body.rotSpeedY = 0;
                body.rotSpeedZ = 0;
            }

            // Constrain All Axes Rotation to [-40, 40] (User Preference)
            const limit = 40;

            // X-Axis
            if (body.rotationX > limit) { body.rotationX = limit; body.rotSpeedX = -Math.abs(body.rotSpeedX); }
            if (body.rotationX < -limit) { body.rotationX = -limit; body.rotSpeedX = Math.abs(body.rotSpeedX); }

            // Y-Axis
            if (body.rotationY > limit) { body.rotationY = limit; body.rotSpeedY = -Math.abs(body.rotSpeedY); }
            if (body.rotationY < -limit) { body.rotationY = -limit; body.rotSpeedY = Math.abs(body.rotSpeedY); }

            // Z-Axis
            if (body.rotationZ > limit) { body.rotationZ = limit; body.rotSpeedZ = -Math.abs(body.rotSpeedZ); }
            if (body.rotationZ < -limit) { body.rotationZ = -limit; body.rotSpeedZ = Math.abs(body.rotSpeedZ); }

            if (!scrollLogos && !body.isFocused && !body.isDragging && !body.isReturning) {
                // 2. Wall Collisions
                // Constrain to HERO SECTION explicitly
                const hero = document.querySelector('.hero');
                const heroRect = hero.getBoundingClientRect();
                const rect = container.getBoundingClientRect();

                // Use Dynamic Configuration
                const physicsSize = physicsConfig.size;

                // Calculate bounds relative to the container's local coordinate system
                // minX is how far left the container is from the hero's left edge (negative value)
                const minX = -(rect.left - heroRect.left);
                const maxX = heroRect.width - (rect.left - heroRect.left) - physicsSize;

                const minY = -(rect.top - heroRect.top);
                const maxY = heroRect.height - (rect.top - heroRect.top) - physicsSize;

                // Fail-safe (relaxed for full screen)
                if (isNaN(body.x)) {
                    body.x = 0;
                    body.vx = 0;
                }

                let hitWall = false;
                if (body.x < minX) { body.x = minX; body.vx = Math.abs(body.vx); hitWall = true; }
                if (body.x > maxX) { body.x = maxX; body.vx = -Math.abs(body.vx); hitWall = true; }
                if (body.y < minY) { body.y = minY; body.vy = Math.abs(body.vy); hitWall = true; }
                if (body.y > maxY) { body.y = maxY; body.vy = -Math.abs(body.vy); hitWall = true; }
                if (hitWall) {
                    dampenSpeed(body);
                }
            }

            if (!scrollLogos && !isResetting && !body.isDragging && !body.isFocused && !body.isReturning) {
                // 3. Object Collisions
                for (let j = i + 1; j < bodies.length; j++) {
                    if (bodies[j].isDragging || bodies[j].isFocused || bodies[j].isReturning) continue;
                    resolveCollision(body, bodies[j]);
                }

                // 4. Ladybug Collision - Check if the ladybug is touching this logo
                const ladybug = document.querySelector('.ladybug');
                if (ladybug) {
                    const bugRect = ladybug.getBoundingClientRect();
                    const logoRect = body.element.getBoundingClientRect();

                    // Calculate centers
                    const bugCenterX = bugRect.left + bugRect.width / 2;
                    const bugCenterY = bugRect.top + bugRect.height / 2;
                    const logoCenterX = logoRect.left + logoRect.width / 2;
                    const logoCenterY = logoRect.top + logoRect.height / 2;

                    // Distance between centers
                    const dx = logoCenterX - bugCenterX;
                    const dy = logoCenterY - bugCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Collision threshold - increased to 80px for better detection
                    const collisionDist = 80;

                    if (distance < collisionDist && !body.bugCooldown) {
                        // Apply push force
                        const pushStrength = 0.3;
                        body.vx += (dx / distance) * pushStrength;
                        body.vy += (dy / distance) * pushStrength;

                        // Add rotation wobble
                        body.rotSpeedX += (Math.random() - 0.5) * 0.2 * tiltSpeedFactor;
                        body.rotSpeedY += (Math.random() - 0.5) * 0.2 * tiltSpeedFactor;

                        // Pause bug + show message on impact
if (typeof window.__ladybugLogoCollision === "function") {
    window.__ladybugLogoCollision();
}
                        dampenSpeed(body);

                        // Cooldown to prevent rapid collisions
                        body.bugCooldown = true;
                        setTimeout(() => { body.bugCooldown = false; }, 500);
                    }
                }
            } else if (scrollLogos && !isResetting && !body.isDragging && !body.isFocused && !body.isReturning) {
                const ladybug = document.querySelector('.ladybug');
                if (ladybug) {
                    const bugRect = ladybug.getBoundingClientRect();
                    const logoRect = body.element.getBoundingClientRect();
                    const bugCenterX = bugRect.left + bugRect.width / 2;
                    const bugCenterY = bugRect.top + bugRect.height / 2;
                    const logoCenterX = logoRect.left + logoRect.width / 2;
                    const logoCenterY = logoRect.top + logoRect.height / 2;
                    const dx = logoCenterX - bugCenterX;
                    const dy = logoCenterY - bugCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const collisionDist = 80;
                    if (distance < collisionDist && !body.bugCooldown) {
if (typeof window.__ladybugLogoCollision === "function") {
    window.__ladybugLogoCollision();
}
                        body.bugCooldown = true;
                        setTimeout(() => { body.bugCooldown = false; }, 500);
                    }
                }
            }

            // 4. Update DOM with 3D Transforms
            // Scale logic: Base from config
            const baseScale = physicsConfig.scale;
            const hoverScale = body.isHovered && !body.isFocused ? 1.15 : 1;
            const focusScale = 1 + body.focusProgress * FOCUS.scaleBoost;
            const currentScale = baseScale * hoverScale * focusScale;
            const displayRotationY = body.rotationY + body.focusProgress * FOCUS.flipDeg;

            // Offset logic: Align visual center (65px element) with physics center
            const displayX = body.x + physicsConfig.offset;
            const displayY = body.y + physicsConfig.offset;

            body.element.style.transform = `
                translate3d(${displayX}px, ${displayY}px, 0) 
                rotateX(${body.rotationX}deg) 
                rotateY(${displayRotationY}deg) 
                rotateZ(${body.rotationZ}deg) 
                scale(${currentScale})
            `;

            if (focusedBody) {
                const focusScaleValue = 1 + focusedBody.focusProgress * 0.35;
                focusImage.frame.style.transform = `scale(${focusScaleValue}) rotateY(${focusedBody.focusProgress * FOCUS.flipDeg}deg)`;
                focusImage.wrapper.style.opacity = focusedBody.focusProgress;
                const spotlightOn = focusedBody.focusProgress > 0.97;
                focusSpotlight.classList.toggle('is-visible', spotlightOn);
                focusDust.visible = spotlightOn;
                focusDust.canvas.classList.toggle('is-visible', spotlightOn);
            }
        });

        requestAnimationFrame(update);
    }

    // Initial dimensions check
    if (container.clientWidth > 0) {
        initPhysics();
    }

    // ResizeObserver catches when hidden -> visible
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const w = entry.contentRect.width;
            const h = entry.contentRect.height;
            if (w > 0 && h > 0) {
                bounds.width = w;
                bounds.height = h;

                // If not initialized yet, we can now because we exist!
                if (!isInitialized) {
                    initPhysics();
                }
            }
        }
    });

    if (container) observer.observe(container);

    // Hover
    logos.forEach((el, i) => {
        el.addEventListener('mouseenter', () => { if (bodies[i]) bodies[i].isHovered = true; });
        el.addEventListener('mouseleave', () => { if (bodies[i]) bodies[i].isHovered = false; });
    });

    container.addEventListener('pointerdown', event => {
        const logoEl = event.target.closest('.app-logo');
        if (!logoEl) return;
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        const index = logos.indexOf(logoEl);
        if (index !== -1 && bodies[index]) {
            focusLogo(bodies[index]);
        }
    });

    function setupDragHandlers() {
        const dragThreshold = 6;
        logos.forEach((el, index) => {
            const body = bodies[index];
            if (!body) return;

            el.style.touchAction = 'none';

            el.addEventListener('pointerdown', event => {
                if (isResetting) return;
                activeDrag = {
                    body,
                    startX: event.clientX,
                    startY: event.clientY,
                    lastX: event.clientX,
                    lastY: event.clientY
                };
                el.setPointerCapture(event.pointerId);
                event.preventDefault();
            });

            el.addEventListener('pointermove', event => {
                if (!activeDrag || activeDrag.body !== body) return;
                const totalDx = event.clientX - activeDrag.startX;
                const totalDy = event.clientY - activeDrag.startY;
                if (!body.isDragging && Math.hypot(totalDx, totalDy) > dragThreshold) {
                    body.isDragging = true;
                    if (body.isFocused) {
                        clearFocus();
                    }
                    body.vx = 0;
                    body.vy = 0;
                    body.rotSpeedX = 0;
                    body.rotSpeedY = 0;
                    body.rotSpeedZ = 0;
                }
                if (!body.isDragging) return;
                const dx = event.clientX - activeDrag.lastX;
                const dy = event.clientY - activeDrag.lastY;
                body.x += dx;
                body.y += dy;
                activeDrag.lastX = event.clientX;
                activeDrag.lastY = event.clientY;
            });

            const endDrag = event => {
                if (!activeDrag || activeDrag.body !== body) return;
                const wasDragging = body.isDragging;
                body.isDragging = false;
                if (wasDragging) {
                    applyDriftToBody(body);
                } else if (event && event.type === 'pointerup') {
                    focusLogo(body);
                }
                activeDrag = null;
            };

            el.addEventListener('pointerup', endDrag);
            el.addEventListener('pointercancel', endDrag);
            el.addEventListener('lostpointercapture', endDrag);
        });
    }

    document.addEventListener('pointerdown', event => {
        if (!focusedBody) return;
        if (event.target.closest('.app-logo')) return;
        if (event.target.closest('.logo-focus-image')) return;
        if (event.target.closest('.logo-focus-action')) return;
        clearFocus();
    });

});

// ---------------------------------------------------------
// AI Neural Network Canvas
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('aiNetwork');
    if (!canvas) return;

    const section = canvas.closest('.ai-skill-section');
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let nodes = [];
    const baseNodeDensity = 20;
    let baseNodeCount = 0;
    let maxNodes = 0;
    let spawnCooldown = 0;
    const targetConvergeCount = 8;
    let trapStartAt = null;
    let roamUntil = 0;
    let wasBugInSection = false;
    let lastBugAlive = true;

    const pointer = {
        x: 0,
        y: 0,
        active: false
    };
    let squeeze = 0;
    let trapProgress = 0;
    let lastKillAt = 0;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const target = section || canvas.parentElement || canvas;
        width = target.clientWidth || 520;
        height = target.clientHeight || 420;
        baseNodeCount = Math.max(18, Math.round(width / baseNodeDensity));
        maxNodes = Math.min(120, baseNodeCount + 30);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!nodes.length) {
            createNodes();
        } else {
            nodes.forEach(node => {
                node.x = Math.min(Math.max(node.x, 10), width - 10);
                node.y = Math.min(Math.max(node.y, 10), height - 10);
            });
        }
    }

    function createNodes() {
        const count = baseNodeCount || Math.max(18, Math.round(width / baseNodeDensity));
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            pulse: 0
        }));
    }

    function update() {
        ctx.clearRect(0, 0, width, height);
        const now = performance.now();
        let bugInSection = false;
        let bugX = 0;
        let bugY = 0;
        let closeCount = 0;
        let convergeCount = 0;
        let minDist = Infinity;
        const ladybug = document.querySelector('.ladybug');
        const bugAlive = typeof window.__isLadybugAlive === "function" ? window.__isLadybugAlive() : true;
        if (ladybug && section && bugAlive) {
            const bugRect = ladybug.getBoundingClientRect();
            const sectionRect = section.getBoundingClientRect();
            const bugCenterX = bugRect.left + bugRect.width / 2;
            const bugCenterY = bugRect.top + bugRect.height / 2;
            bugInSection = bugCenterX >= sectionRect.left && bugCenterX <= sectionRect.right &&
                bugCenterY >= sectionRect.top && bugCenterY <= sectionRect.bottom;
            if (bugInSection) {
                const canvasRect = canvas.getBoundingClientRect();
                bugX = bugCenterX - canvasRect.left;
                bugY = bugCenterY - canvasRect.top;
            }
        }
        if (bugInSection && (!wasBugInSection || (!lastBugAlive && bugAlive))) {
            roamUntil = now + 2000;
        }
        if (!bugInSection || !bugAlive) {
            roamUntil = 0;
        }
        const trapActive = bugInSection && bugAlive && now >= roamUntil;

        if (spawnCooldown > 0) spawnCooldown -= 1;

        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < 8 || node.x > width - 8) node.vx *= -1;
            if (node.y < 8 || node.y > height - 8) node.vy *= -1;

            if (pointer.active) {
                const dx = pointer.x - node.x;
                const dy = pointer.y - node.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 120 && dist > 0) {
                    node.vx += (dx / dist) * 0.015;
                    node.vy += (dy / dist) * 0.015;
                }
            }

            if (trapActive) {
                const dx = bugX - node.x;
                const dy = bugY - node.y;
                const dist = Math.hypot(dx, dy);
                minDist = Math.min(minDist, dist);
                if (dist < 220 && dist > 0) {
                    const pull = 0.02 + squeeze * 0.06;
                    node.vx += (dx / dist) * pull;
                    node.vy += (dy / dist) * pull;
                    closeCount += 1;
                }
                if (dist < 130) {
                    convergeCount += 1;
                }
            }

            node.pulse = Math.max(0, node.pulse - 0.02);
        });

        const proximityScore = trapActive && minDist < Infinity ? Math.max(0, 1 - minDist / 240) : 0;
        const densityScore = trapActive ? Math.min(1, closeCount / 6) : 0;

        if (trapActive) {
            const build = 0.003 + proximityScore * 0.02 + densityScore * 0.03;
            trapProgress = Math.min(1, trapProgress + build);
        } else {
            trapProgress = Math.max(0, trapProgress - 0.035);
            trapStartAt = null;
        }

        const squeezeTarget = trapActive
            ? Math.max(trapProgress, proximityScore * 0.6 + densityScore * 0.4)
            : 0;
        squeeze += (squeezeTarget - squeeze) * 0.1;

        if (typeof window.__setLadybugTrap === "function") {
            window.__setLadybugTrap(trapActive ? squeeze : 0);
        }

        if (trapActive && squeeze > 0.2 && trapStartAt === null) {
            trapStartAt = now;
        }
        if (!trapActive || squeeze <= 0.2) {
            trapStartAt = null;
        }

        const needsReinforce = trapStartAt !== null && now - trapStartAt > 2000 &&
            convergeCount < targetConvergeCount;

        if (needsReinforce && spawnCooldown <= 0 && nodes.length < maxNodes) {
            const spawnCount = Math.min(1, maxNodes - nodes.length);
            for (let i = 0; i < spawnCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 70 + Math.random() * 90;
                const nx = Math.min(width - 10, Math.max(10, bugX + Math.cos(angle) * radius));
                const ny = Math.min(height - 10, Math.max(10, bugY + Math.sin(angle) * radius));
                nodes.push({
                    x: nx,
                    y: ny,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    pulse: 0
                });
            }
            spawnCooldown = 10;
        }

        if (needsReinforce && nodes.length >= maxNodes) {
            const ranked = nodes
                .map(node => ({
                    node,
                    dist: Math.hypot(bugX - node.x, bugY - node.y)
                }))
                .sort((a, b) => b.dist - a.dist);
            let moved = 0;
            for (const entry of ranked) {
                if (entry.dist < 220) break;
                const angle = Math.random() * Math.PI * 2;
                const radius = 60 + Math.random() * 80;
                entry.node.x = Math.min(width - 10, Math.max(10, bugX + Math.cos(angle) * radius));
                entry.node.y = Math.min(height - 10, Math.max(10, bugY + Math.sin(angle) * radius));
                entry.node.vx = (Math.random() - 0.5) * 0.35;
                entry.node.vy = (Math.random() - 0.5) * 0.35;
                entry.node.pulse = 0;
                moved += 1;
                if (moved >= 1) break;
            }
        }

        const baseCount = baseNodeCount || Math.max(18, Math.round(width / baseNodeDensity));
        if (!bugInSection && nodes.length > baseCount) {
            nodes.splice(baseCount, nodes.length - baseCount);
        }

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 140) {
                    const alpha = 0.12 + (1 - dist / 140) * 0.35;
                    ctx.strokeStyle = `rgba(120, 200, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        if (trapActive) {
            nodes.forEach(node => {
                const dx = bugX - node.x;
                const dy = bugY - node.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 180) {
                    const alpha = 0.12 + (1 - dist / 180) * 0.6 * squeeze;
                    ctx.strokeStyle = `rgba(180, 230, 255, ${alpha})`;
                    ctx.lineWidth = 1.3 + squeeze * 0.9;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(bugX, bugY);
                    ctx.stroke();
                }
            });

            const ringRadius = 50 - squeeze * 20;
            ctx.fillStyle = `rgba(120, 200, 255, ${0.1 * squeeze})`;
            ctx.beginPath();
            ctx.arc(bugX, bugY, ringRadius * 1.25, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(200, 240, 255, ${0.4 + squeeze * 0.55})`;
            ctx.lineWidth = 1.8 + squeeze * 1.1;
            ctx.beginPath();
            ctx.arc(bugX, bugY, ringRadius, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = `rgba(170, 220, 255, ${0.25 + squeeze * 0.4})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(bugX, bugY, ringRadius + 10, 0, Math.PI * 2);
            ctx.stroke();
        }

        nodes.forEach(node => {
            const dist = pointer.active ? Math.hypot(pointer.x - node.x, pointer.y - node.y) : 999;
            const glow = Math.max(0, 1 - dist / 100);
            const radius = 2.2 + glow * 2.2;

            if (node.pulse > 0) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${node.pulse})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10 * node.pulse + 4, 0, Math.PI * 2);
                ctx.stroke();
            }

            ctx.fillStyle = `rgba(200, 230, 255, ${0.45 + glow * 0.4})`;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        const shouldKill = trapActive &&
            convergeCount >= targetConvergeCount - 1 &&
            (squeeze > 0.9 || (minDist < 22 && squeeze > 0.75));
        if (shouldKill && now - lastKillAt > 2500) {
            if (typeof window.__killLadybug === "function") {
                window.__killLadybug();
            }
            lastKillAt = now;
        }

        wasBugInSection = bugInSection;
        lastBugAlive = bugAlive;
        requestAnimationFrame(update);
    }

    (section || canvas).addEventListener('pointermove', event => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = true;
    });

    (section || canvas).addEventListener('pointerleave', () => {
        pointer.active = false;
    });

    (section || canvas).addEventListener('pointerdown', event => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let nearest = null;
        let nearestDist = Infinity;
        nodes.forEach(node => {
            const dist = Math.hypot(node.x - x, node.y - y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = node;
            }
        });
        if (nearest && nearestDist < 120) {
            nearest.pulse = 1;
        }
    });

    resize();
    window.addEventListener('resize', resize);
    update();
});

// ---------------------------------------------------------
// AI Chat Overlay
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.hero-ai-trigger');
    const overlay = document.getElementById('aiChatOverlay');
    if (!triggers.length || !overlay) return;

    const panel = overlay.querySelector('.ai-chat-panel');
    const closeBtn = overlay.querySelector('.ai-chat-close');
    const form = overlay.querySelector('.ai-chat-form');
    const input = overlay.querySelector('.ai-chat-input');
    const sendBtn = overlay.querySelector('.ai-chat-send');
    const messagesEl = overlay.querySelector('.ai-chat-messages');
    const thoughtText = document.querySelector('.hero-thought-text');
    if (thoughtText) {
        const phrases = [
            "Chat with AI me",
            "Ask about my work",
            "See my AI stack",
            "Let's talk projects"
        ];
        let phraseIndex = 0;
        setInterval(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            thoughtText.textContent = phrases[phraseIndex];
            thoughtText.classList.remove('is-animating');
            void thoughtText.offsetWidth;
            thoughtText.classList.add('is-animating');
        }, 1500);
    }

    const state = {
        messages: []
    };

    function normalizeText(text) {
        return (text || "").replace(/\s+/g, " ").trim();
    }

    let contextCache = null;
    let contextCacheFetchedAt = 0;
    let contextCacheFailedAt = 0;

    async function loadContextFile() {
        const debug = window.AI_CHAT_DEBUG === true;
        const now = Date.now();
        if (contextCache && now - contextCacheFetchedAt < 5 * 60 * 1000) {
            if (debug) {
                appendMessage('assistant', 'AI context loaded from cache.', 'is-system');
            }
            return contextCache;
        }
        if (!contextCache && contextCacheFailedAt && now - contextCacheFailedAt < 3000) {
            if (debug) {
                appendMessage('assistant', 'AI context fetch recently failed; retrying shortly.', 'is-system');
            }
            return { global: '', chunks: [], byId: {}, appChunks: [] };
        }
        try {
            const response = await fetch('ai-context.txt', { cache: 'no-store' });
            if (!response.ok) {
                contextCacheFailedAt = now;
                if (debug) {
                    appendMessage('assistant', `AI context fetch failed (${response.status}).`, 'is-system');
                }
                return { global: '', chunks: [], byId: {}, appChunks: [] };
            }
            const raw = await response.text();
            const firstChunkIndex = raw.indexOf('### CHUNK:');
            const globalRaw = firstChunkIndex === -1 ? raw : raw.slice(0, firstChunkIndex);
            const global = normalizeText(globalRaw).slice(0, 1200);

            const chunkRegex = /### CHUNK: ([A-Z0-9_]+)\n([\s\S]*?)(?=\n### CHUNK:|$)/g;
            const chunks = [];
            const byId = {};
            const appChunks = [];
            let match;
            while ((match = chunkRegex.exec(raw)) !== null) {
                const id = match[1].trim();
                const rawChunk = match[2].trim();
                const content = normalizeText(rawChunk);
                const appMatch = rawChunk.match(/^App:\s*(.+)$/m);
                const aliasMatch = rawChunk.match(/^Aliases:\s*(.+)$/m);
                const keywords = [];
                if (appMatch) {
                    keywords.push(appMatch[1]);
                }
                if (aliasMatch) {
                    aliasMatch[1].split(',').forEach(item => keywords.push(item));
                }
                const keywordSet = Array.from(new Set(
                    keywords
                        .map(word => word.trim())
                        .filter(Boolean)
                        .map(word => word.toLowerCase())
                ));
                const chunk = { id, content, keywords: keywordSet };
                chunks.push(chunk);
                byId[id] = chunk;
                if (keywordSet.length) {
                    appChunks.push(chunk);
                }
            }

            contextCache = { global, chunks, byId, appChunks };
            contextCacheFetchedAt = now;
            if (debug) {
                appendMessage('assistant', `AI context loaded (${chunks.length} chunks).`, 'is-system');
            }
            return contextCache;
        } catch (error) {
            contextCacheFailedAt = now;
            if (debug) {
                appendMessage('assistant', 'AI context fetch error.', 'is-system');
            }
            return { global: '', chunks: [], byId: {}, appChunks: [] };
        }
    }

    function buildDomContext() {
        const sections = [
            document.querySelector('.heroText'),
            document.querySelector('.ai-skill-section'),
            document.querySelector('.skills'),
            document.querySelector('.projectSection'),
            document.querySelector('.getInTouchSection')
        ].filter(Boolean);
        const sectionText = sections.map(section => normalizeText(section.textContent)).join(" ");
        const appTitles = Array.from(document.querySelectorAll('.app-logo:not([data-clone="true"])'))
            .map(item => item.dataset.title)
            .filter(Boolean);
        const appsLine = appTitles.length ? `Featured apps: ${appTitles.join(", ")}.` : "";
        const base = `${sectionText} ${appsLine} Email: me@parthant.com.`;
        return base.replace(/\s+/g, " ").trim().slice(0, 800);
    }

    async function buildContextForQuery(userText) {
        const data = await loadContextFile();
        if (!data.chunks.length) return '';
        const query = normalizeText(userText).toLowerCase();
        const matched = data.appChunks.filter(chunk =>
            chunk.keywords.some(keyword => query.includes(keyword))
        );
        const selectedChunks = [];
        if (data.byId.ABOUT_PARTH) selectedChunks.push(data.byId.ABOUT_PARTH);
        matched.forEach(chunk => {
            if (!selectedChunks.includes(chunk)) selectedChunks.push(chunk);
        });
        if (data.byId.CONTACT_AND_ESCALATION) {
            selectedChunks.push(data.byId.CONTACT_AND_ESCALATION);
        }
        const combined = selectedChunks.map(chunk => chunk.content).join(' ');
        return normalizeText(`${data.global} ${combined}`.trim()).slice(0, 3200);
    }

    async function buildSystemMessage(userText) {
        const domContext = buildDomContext();
        const fileContext = await buildContextForQuery(userText);
        const siteContext = normalizeText(`${domContext} ${fileContext}`.trim());
        return {
            role: "system",
            content:
                "You are AI Parth, the digital twin of Parth on his portfolio site. " +
                "Speak in first person as Parth, avoid referring to yourself as an assistant, and answer as if you are Parth. " +
                "Keep replies concise and confident, grounded in the site context only. " +
                "If something is missing, say you don't have those details and ask to email me@parthant.com. " +
                `Context: ${siteContext}`
        };
    }

    function appendMessage(role, text, className) {
        const bubble = document.createElement('div');
        bubble.className = `ai-chat-message ${className || ''}`.trim();
        bubble.textContent = text;
        messagesEl.appendChild(bubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return bubble;
    }

    function openChat() {
        overlay.classList.add('is-visible');
        overlay.setAttribute('aria-hidden', 'false');
        input.focus();
        if (!messagesEl.children.length) {
            appendMessage('assistant', "Hey, I'm AI Parth. Ask me anything about my work, projects, or AI stack.", 'is-system');
        }
    }

    function closeChat() {
        overlay.classList.remove('is-visible');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function getApiEndpoint() {
        const meta = document.querySelector('meta[name="ai-chat-endpoint"]');
        return (window.AI_CHAT_ENDPOINT || meta?.content || '').trim();
    }

    function isPlaceholderEndpoint(endpoint) {
        return !endpoint || endpoint.includes('YOUR_SUBDOMAIN');
    }

    async function sendMessage(userText) {
        const endpoint = getApiEndpoint();
        if (isPlaceholderEndpoint(endpoint)) {
            appendMessage('assistant', "AI chat is offline. Connect the Cloudflare Worker endpoint in the page meta tag.", 'is-system');
            return;
        }

        state.messages.push({ role: 'user', content: userText });
        const typingBubble = appendMessage('assistant', 'Thinking', 'is-typing');
        sendBtn.disabled = true;

        try {
            const recentMessages = state.messages.slice(-10);
            const systemMessage = await buildSystemMessage(userText);
            const payload = {
                messages: [systemMessage, ...recentMessages],
                temperature: 0.6,
                max_tokens: 220
            };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content?.trim();
            typingBubble.remove();

            if (!reply) {
                appendMessage('assistant', "I couldn't generate a reply. Try again?", '');
                return;
            }

            state.messages.push({ role: 'assistant', content: reply });
            appendMessage('assistant', reply, '');
        } catch (error) {
            typingBubble.remove();
            appendMessage('assistant', "Something went wrong connecting to the AI API.", 'is-system');
        } finally {
            sendBtn.disabled = false;
        }
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => openChat());
    });

    document.addEventListener('click', event => {
        const askBtn = event.target.closest('.logo-focus-ask');
        if (!askBtn) return;
        const title = askBtn.dataset.askTitle || 'this app';
        openChat();
        if (typeof window.__clearLogoFocus === 'function') {
            window.__clearLogoFocus();
        }
        const text = `Tell me more about ${title}`;
        appendMessage('user', text, 'is-user');
        sendMessage(text);
    });
    closeBtn.addEventListener('click', closeChat);
    overlay.addEventListener('click', event => {
        if (event.target === overlay) {
            closeChat();
        }
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const text = normalizeText(input.value);
        if (!text) return;
        appendMessage('user', text, 'is-user');
        input.value = '';
        sendMessage(text);
    });

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && overlay.classList.contains('is-visible')) {
            closeChat();
        }
    });

    if (window.visualViewport) {
        const updateKeyboardOffset = () => {
            const viewport = window.visualViewport;
            const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
            document.documentElement.style.setProperty('--ai-chat-keyboard', `${offset}px`);
        };
        window.visualViewport.addEventListener('resize', updateKeyboardOffset);
        window.visualViewport.addEventListener('scroll', updateKeyboardOffset);
        updateKeyboardOffset();
    }
});

// ---------------------------------------------------------
// Auto-scroll to AI section on slight hero scroll
// ---------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.heroSection');
    const aiSection = document.querySelector('.ai-skill-section');
    if (!heroSection || !aiSection) return;

    let scrollLock = false;
    let touchStartY = null;

    function isHeroActive() {
        const rect = heroSection.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > window.innerHeight * 0.6;
    }

    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const startTime = performance.now();
        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const eased = easeOutCubic(progress);
            window.scrollTo(0, startY + diff * eased);
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function triggerScroll() {
        if (scrollLock) return;
        scrollLock = true;
        const targetY = window.scrollY + aiSection.getBoundingClientRect().top;
        smoothScrollTo(targetY, 1200);
        setTimeout(() => {
            scrollLock = false;
        }, 1400);
    }

    window.addEventListener('wheel', event => {
        if (event.deltaY > 8 && isHeroActive() && !scrollLock) {
            event.preventDefault();
            triggerScroll();
        }
    }, { passive: false });

    window.addEventListener('touchstart', event => {
        if (!event.touches.length) return;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', event => {
        if (touchStartY === null) return;
        const delta = touchStartY - event.touches[0].clientY;
        if (delta > 24 && isHeroActive() && !scrollLock) {
            triggerScroll();
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        touchStartY = null;
    }, { passive: true });
});
