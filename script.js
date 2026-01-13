
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

    let logoCollisionTimer = null;
    let logoCollisionCooldown = false;

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
    function killbug() {
        if (!isStopped) {
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
            }, 10000);
        }
    }
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
                // Check if we should target logos
if (isTargetingLogos && !hasLogoCollision) {
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
                } else {
                    // Random movement
                    const now = performance.now();
                    const minInterval = hasLogoCollision ? 1400 : 900;
                    const maxInterval = hasLogoCollision ? 3800 : 2000;

                    if (now >= nextDirectionChangeAt) {
                        dx = getRandomVelocity(0.5, hasLogoCollision ? 2.8 : 2.1);
                        dy = getRandomVelocity(0.5, hasLogoCollision ? 2.8 : 2.1);
                        nextDirectionChangeAt = now + (minInterval + Math.random() * (maxInterval - minInterval));
                    }
                }


                x += dx;
                y += dy;

                // LOGO AVOIDANCE - Only when NOT targeting (random mode)
                // When targeting, we want to approach the logo
                if (!isTargetingLogos) {
                    const appLogos = document.querySelectorAll('.app-logo');
                    const bugRect = ladybug.getBoundingClientRect();
                    const bugCenterX = bugRect.left + bugRect.width / 2;
                    const bugCenterY = bugRect.top + bugRect.height / 2;

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
        body.vx = (Math.random() - 0.5) * 0.05;
        body.vy = (Math.random() - 0.5) * 0.05;
        body.rotSpeedX = (Math.random() - 0.5) * 0.2;
        body.rotSpeedY = (Math.random() - 0.5) * 0.2;
        body.rotSpeedZ = (Math.random() - 0.5) * 0.1;
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
        wrapper.appendChild(title);
        frame.appendChild(img);
        wrapper.appendChild(frame);
        wrapper.appendChild(action);
        document.body.appendChild(wrapper);

        return { wrapper, frame, img, title, action };
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
            setupDragHandlers();
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
                body.x += body.vx;
                body.y += body.vy;

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

            if (!body.isFocused && !body.isDragging && !body.isReturning) {
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

            if (!isResetting && !body.isDragging && !body.isFocused && !body.isReturning) {
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
                        body.rotSpeedX += (Math.random() - 0.5) * 0.2;
                        body.rotSpeedY += (Math.random() - 0.5) * 0.2;

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
