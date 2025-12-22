document.addEventListener('DOMContentLoaded', () => {
    // Page Transition: Fade In
    setTimeout(() => {
        document.body.classList.add('fade-in');
    }, 50); // Small delay to ensure CSS transition catches

    // Page Transition: Fade Out on Link Click
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Should be an internal link and not just a hash
            if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                e.preventDefault();
                document.body.classList.remove('fade-in'); // This triggers fade out due to default opacity 0

                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Matches CSS transition time
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });
    }

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    let particlesArray;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Mouse Position
    const mouse = {
        x: null,
        y: null,
        radius: 100 // Interaction radius
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        init();
    });

    // Particle Class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.density = (Math.random() * 30) + 1;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0; // Reset for performance
        }

        // Update particle position
        update() {
            // 1. Normal Movement (Floating)
            this.x += this.directionX;
            this.y += this.directionY;

            // 2. Boundary Check (Bounce off edges)
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.directionY = -this.directionY;
            }

            // 3. Mouse Interaction (Repulsion)
            // Only interact if mouse is on screen
            if (mouse.x != undefined && mouse.y != undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    // Calculate vector away from mouse
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;

                    // The closer, the stronger the push
                    const force = (mouse.radius - distance) / mouse.radius;
                    const repulsionX = forceDirectionX * force * this.density;
                    const repulsionY = forceDirectionY * force * this.density;

                    // Push away
                    this.x -= repulsionX;
                    this.y -= repulsionY;
                }
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        // Number of particles based on screen area
        let numberOfParticles = (canvas.height * canvas.width) / 9000;

        const colors = ['#ff00ff', '#00ffff', '#7000ff', '#ffffff'];

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1;
            let x = (Math.random() * (innerWidth - size * 2) - (size * 2)) + size * 2;
            let y = (Math.random() * (innerHeight - size * 2) - (size * 2)) + size * 2;

            // Random velocity for floating (slower than before)
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;

            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }

    init();
    animate();
});
