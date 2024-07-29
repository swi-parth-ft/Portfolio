document.addEventListener('DOMContentLoaded', (event) => {
    // Create the custom cursor element
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    // Update the cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Optional: Add some interactivity (e.g., scale effect on click)
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
    });
});
// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body;

// Create a Matter.js engine with minimal gravity
const engine = Engine.create();
engine.world.gravity.y = 0.01; // Minimal gravity for buoyancy effect

const world = engine.world;

// Create a Matter.js renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
    }
});

// Create boundaries
const boundaries = [
    Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, { isStatic: true }),
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true }),
    Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
    Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true })
];

World.add(world, boundaries);

// Add images to the world
const icons = document.querySelectorAll('.icon');
icons.forEach(icon => {
    const rect = icon.getBoundingClientRect();
    const body = Bodies.rectangle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        rect.width,
        rect.height,
         { restitution: 0.9, render: { fillStyle: 'transparent' } },
        { restitution: 0.9 }
    );
    World.add(world, body);

    // Apply random initial force
    Body.applyForce(body, body.position, {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02
    });

    // Apply continuous random forces to keep them floating
    (function applyRandomForces() {
        Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.002,
            y: (Math.random() - 0.5) * 0.002
        });
        setTimeout(applyRandomForces, 100);
    })();

    // Synchronize the DOM element with the physics body
    (function update() {
        icon.style.left = `${body.position.x - rect.width / 2}px`;
        icon.style.top = `${body.position.y - rect.height / 2}px`;
        icon.style.transform = `rotate(${body.angle}rad)`;
        requestAnimationFrame(update);
    })();
});
render.canvas.style.background = 'transparent';
// Run the engine and renderer
Engine.run(engine);
Render.run(render);
document.addEventListener('DOMContentLoaded', () => {
            const ladybug = document.querySelector('.ladybug');
            let x = Math.random() * window.innerWidth;
            let y = Math.random() * window.innerHeight;
            let dx = (Math.random() - 0.5) * 4; // Random initial speed in x direction
            let dy = (Math.random() - 0.5) * 4; // Random initial speed in y direction
            const maxSpeed = 4; // Maximum speed for the ladybug

            function getRandomSpeed() {
                return (Math.random() - 0.5) * maxSpeed;
            }

            function animate() {
                x += dx;
                y += dy;

                // Reverse direction if hitting the edge of the viewport
                if (x <= 0 || x >= window.innerWidth - ladybug.offsetWidth) {
                    dx = getRandomSpeed();
                }
                if (y <= 0 || y >= window.innerHeight - ladybug.offsetHeight) {
                    dy = getRandomSpeed();
                }

                // Randomly change direction after some time
                if (Math.random() < 0.02) { // 2% chance to change direction in each frame
                    dx = getRandomSpeed();
                    dy = getRandomSpeed();
                }

                ladybug.style.transform = `translate(${x}px, ${y}px)`;

                requestAnimationFrame(animate);
            }

            animate();
        });