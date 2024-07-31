document.addEventListener('DOMContentLoaded', () => {
    const iconContainers = document.querySelectorAll('.icon-container');
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const githubLink = document.getElementById('githubLink');
    const description = document.getElementById('modalDescription');
    const toggleButton = document.querySelector('.toggle-button');
    const toggleIcon = document.querySelector('.toggle-icon');
    const heroSection = document.querySelector('.heroBlurable');

    const portfolio = document.getElementById('portfolio');
    let isPortfolioOnTop = true;
    const bodies = [];
    const width = window.innerWidth;


    // Toggle button logic
    toggleButton.addEventListener('click', () => {


        if (isPortfolioOnTop) {
            portfolio.style.zIndex = '20';
            heroSection.style.zIndex = '3';
            heroSection.classList.add("grayScale");
            toggleIcon.innerHTML = '<img src="imgs/toggleLite.svg" width="22" height="22">';
        } else {
            portfolio.style.zIndex = '1';
            heroSection.style.zIndex = '2';
            heroSection.classList.remove("grayScale");
            toggleIcon.innerHTML = '<img src="imgs/toggle.svg" width="22" height="22">';
        }

        isPortfolioOnTop = !isPortfolioOnTop;
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        heroSection.classList.remove("grayScale");
        resetGravityAndGrayscale();
        portfolio.style.zIndex = '1';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            heroSection.classList.remove("grayScale");
            resetGravityAndGrayscale();
            portfolio.style.zIndex = '1';

        }
    });

    document.getElementById('downloadProject').addEventListener('click', function () {
        const zipUrl = `${githubLink.href}/archive/refs/heads/main.zip`;
        window.location.href = zipUrl;
    });

    // Matter.js setup
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const engine = Engine.create();
    engine.world.gravity.y = 0; // Set gravity to 0 for floating effect

    const world = engine.world;

    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
            pixelRatio: 1
        }
    });

    Render.run(render);
    Engine.run(engine);

    const runner = Runner.create();
    Runner.run(runner, engine);



    // Create boundaries
    const boundaries = [
        Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true }),
        Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true }),
        Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
        Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true })
    ];

    World.add(world, boundaries);

    // Create icon bodies

    iconContainers.forEach(container => {
        const rect = container.getBoundingClientRect();
        const body = Bodies.rectangle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            rect.width,
            rect.height,
            {
                restitution: 0.4,
                friction: 0.5,
                render: { fillStyle: 'transparent' }
            }
        );
        World.add(world, body);
        bodies.push({ container, body });

        Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05
        });

        (function applyRandomForces() {
            if (width > 600) {
                Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005
                });
                setTimeout(applyRandomForces, 500);
            } else {
                Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.001,
                    y: (Math.random() - 0.5) * 0.001
                });
                setTimeout(applyRandomForces, 500);
            }
        })();

    });



    (function update() {
        bodies.forEach(({ container, body }) => {
            container.style.left = `${body.position.x - container.clientWidth / 2}px`;
            container.style.top = `${body.position.y - container.clientHeight / 2}px`;
            container.style.transform = `rotate(${body.angle}rad)`;
        });
        requestAnimationFrame(update);
    })();

    // Display modal with project info
    iconContainers.forEach(container => {
        container.addEventListener('click', () => {
            const title = container.getAttribute('data-title');
            const image = container.getAttribute('data-image');
            const gitHub = container.getAttribute('data-github');
            const des = container.getAttribute('data-dec');

            modalTitle.textContent = title;
            modalImage.src = image;
            githubLink.href = gitHub;
            description.textContent = des;
            modal.style.display = 'block';
            heroSection.classList.add("grayScale");
            engine.world.gravity.y = 1;
            applyGrayscale(container);
        });
    });

    function applyGrayscale(activeContainer) {
        iconContainers.forEach(container => {
            if (container !== activeContainer) {
                container.style.filter = 'grayscale(100%)';
            }
        });
    }

    function resetGravityAndGrayscale() {
        const step = 0.05;

        function decreaseGravity() {
            if (engine.world.gravity.y > -0.5) {
                engine.world.gravity.y -= step;
                requestAnimationFrame(decreaseGravity);
            } else {
                setTimeout(increaseGravityToZero, 100); // Wait for a second before increasing gravity back to 0
            }
        }

        function increaseGravityToZero() {
            if (engine.world.gravity.y < 0) {
                engine.world.gravity.y += step;
                requestAnimationFrame(increaseGravityToZero);
            } else {
                engine.world.gravity.y = 0;
            }
        }

        decreaseGravity();

        iconContainers.forEach(container => {
            container.style.filter = 'none';
        });
    }
});