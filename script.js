let electricActive = false;
let electricAnimationId = null;

// --- PARTICULAS ANIMADAS DE FONDO ---
let particlesActive = true;
let particles = [];
let particlesAnimationId = null;

function createParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const numParticles = Math.floor(window.innerWidth * window.innerHeight / 3200);
    particles = [];
    for (let i = 0; i < numParticles; i++) {
        const color = ['#00A3FF', '#FF2D95', '#D147FF'][Math.floor(Math.random() * 3)];
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: 2.5,
            dx: (Math.random() - 0.5) * 0.18,
            dy: (Math.random() - 0.5) * 0.18,
            color,
            alpha: 0.55 + Math.random() * 0.25
        });
    }
}

function animateParticles() {
    if (!particlesActive) return;
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x * dpr, p.y * dpr, p.r * dpr, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12 * dpr;
        ctx.fill();
        ctx.restore();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;
        if (p.y < -10) p.y = window.innerHeight + 10;
        if (p.y > window.innerHeight + 10) p.y = -10;
    }
    particlesAnimationId = requestAnimationFrame(animateParticles);
}

function showParticlesCanvas(show) {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    canvas.style.display = show ? 'block' : 'none';
    particlesActive = show;
    if (show) {
        createParticles();
        animateParticles();
    } else {
        if (particlesAnimationId) cancelAnimationFrame(particlesAnimationId);
    }
}

window.addEventListener('resize', () => {
    if (particlesActive) {
        createParticles();
    }
});

// --- FIN PARTICULAS ANIMADAS ---

function showElectricCanvas(show) {
    const canvas = document.getElementById('electric-canvas');
    if (!canvas) return;
    canvas.style.display = show ? 'block' : 'none';
    electricActive = show;
    if (show) animateElectricCanvas(performance.now());
}

function drawLightning(ctx, startX, startY, endX, endY, color, segments = 28, amplitude = 90, forks = 3, thickness = 22, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 110;
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    let prevX = startX, prevY = startY;
    for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const nx = startX + (endX - startX) * t + (Math.random() - 0.5) * amplitude;
        const ny = startY + (endY - startY) * t + (Math.random() - 0.5) * amplitude;
        ctx.lineTo(nx, ny);
        if (forks > 0 && Math.random() < 0.22 && i > 2 && i < segments - 2) {
            const forkLength = (segments - i) * 0.5;
            drawLightning(
                ctx,
                nx, ny,
                nx + (Math.random() - 0.5) * amplitude * 2.5,
                ny + (Math.random() - 0.5) * amplitude * 2.5,
                color,
                Math.floor(forkLength),
                amplitude * 0.8,
                forks - 1,
                Math.max(8, thickness * 0.7),
                opacity * 0.85
            );
        }
        prevX = nx; prevY = ny;
    }
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.restore();
}

function animateElectricCanvas(now) {
    if (!electricActive) return;
    const canvas = document.getElementById('electric-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!animateElectricCanvas.lastTime || now - animateElectricCanvas.lastTime > 500) {
        animateElectricCanvas.lastTime = now;
        drawLightning(ctx, 200, 200, window.innerWidth - 200, 180, '#00A3FF', 32, 110, 3, 28, 1);
        drawLightning(ctx, 300, window.innerHeight - 200, window.innerWidth - 300, window.innerHeight - 180, '#FF2D95', 32, 110, 3, 28, 1);
        drawLightning(ctx, 400, 400, window.innerWidth - 400, window.innerHeight - 400, '#D147FF', 32, 110, 3, 28, 1);
        for (let i = 0; i < 3; i++) {
            drawLightning(
                ctx,
                100 + Math.random() * (window.innerWidth - 200),
                100 + Math.random() * (window.innerHeight - 200),
                100 + Math.random() * (window.innerWidth - 200),
                100 + Math.random() * (window.innerHeight - 200),
                ['#00A3FF', '#FF2D95', '#D147FF'][i],
                22 + Math.floor(Math.random() * 12),
                70 + Math.random() * 60,
                3,
                18,
                0.92
            );
        }
    }
    electricAnimationId = requestAnimationFrame(animateElectricCanvas);
}

// Navigation function
function navigateTo(sectionId) {
    // Oculta todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Muestra la sección objetivo
    document.getElementById(sectionId).classList.add('active');

    // Muestra/oculta rayos eléctricos y partículas según la sección
    showElectricCanvas(sectionId === 'landing');
    showParticlesCanvas(sectionId !== 'landing');

    // Scroll al tope
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Start journey function
function startJourney() {
    navigateTo('introduccion');
}

// Modal logic for info cards
function setupInfoCardModals() {
    const infoCards = document.querySelectorAll('.info-card');
    const modal = document.getElementById('card-modal');
    const modalContent = modal.querySelector('.card-modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.querySelector('.card-modal-close');

    // Colores posibles para borde y sombra
    const modalStyles = [
        {
            border: '3px solid #000',
            boxShadow: '0 0 60px 10px #FF2D95cc, 0 0 120px 30px #FF5E6280', // rosado rojizo
            title: '#FF2D95'
        },
        {
            border: '3px solid #000',
            boxShadow: '0 0 60px 10px #C7AFFFcc, 0 0 120px 30px #B26DFF80', // violeta
            title: '#B26DFF'
        },
        {
            border: '3px solid #000',
            boxShadow: '0 0 60px 10px #007FFFcc, 0 0 120px 30px #00a3ff80', // azul
            title: '#007FFF'
        }
    ];

    infoCards.forEach(card => {
        card.addEventListener('click', function () {
            const title = card.getAttribute('data-title');
            const content = card.getAttribute('data-content');
            modalTitle.textContent = title;
            modalBody.innerHTML = content;
            // Elige un estilo aleatorio
            const style = modalStyles[Math.floor(Math.random() * modalStyles.length)];
            modalContent.style.border = style.border;
            modalContent.style.boxShadow = style.boxShadow;
            modalTitle.style.color = style.title;
            modalBody.style.fontSize = '1.5rem'; // agranda la letra
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
}

// Aurora boreal animada en el fondo
function animateAurora() {
    const canvas = document.getElementById('aurora-canvas');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() * 0.00025;
    for (let i = 0; i < 3; i++) {
        ctx.save();
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (i === 0) {
            grad.addColorStop(0, 'rgba(0,163,255,0.18)');
            grad.addColorStop(1, 'rgba(209,71,255,0.10)');
        } else if (i === 1) {
            grad.addColorStop(0, 'rgba(255,45,149,0.13)');
            grad.addColorStop(1, 'rgba(0,163,255,0.08)');
        } else {
            grad.addColorStop(0, 'rgba(209,71,255,0.12)');
            grad.addColorStop(1, 'rgba(255,45,149,0.08)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 8) {
            const y = (canvas.height * (0.25 + 0.5 * i / 3)) + Math.sin(t * (1.2 + i * 0.3) + x * 0.002 + i * 2) * (120 + i * 60) + Math.cos(t * 2 + x * 0.003 + i) * (50 + i * 30);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.globalAlpha = 0.55;
        ctx.filter = 'blur(32px)';
        ctx.fill();
        ctx.restore();
    }
    requestAnimationFrame(animateAurora);
}

// Rayos dinámicos en la esfera de plasma
function drawPlasmaRay(ctx, cx, cy, radius, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.2 + Math.random() * 1.2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    let angle = Math.random() * Math.PI * 2;
    let len = radius * (0.7 + Math.random() * 0.3);
    for (let i = 0; i < 5; i++) {
        angle += (Math.random() - 0.5) * 0.7;
        const nx = cx + Math.cos(angle) * (len * (i + 1) / 5);
        const ny = cy + Math.sin(angle) * (len * (i + 1) / 5);
        ctx.lineTo(nx, ny);
    }
    ctx.stroke();
    ctx.restore();
}

function animatePlasmaSphere() {
    document.querySelectorAll('.plasma-canvas').forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 28;
        // Fondo de la esfera
        const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, radius);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.3, '#b026ff');
        grad.addColorStop(0.7, '#007FFF');
        grad.addColorStop(1, '#0A0A0A');
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.filter = 'blur(0.5px)';
        ctx.fill();
        // Rayos
        for (let i = 0; i < 4; i++) {
            drawPlasmaRay(ctx, cx, cy, radius, ['#00A3FF', '#FF2D95', '#D147FF'][i % 3]);
        }
    });
    requestAnimationFrame(animatePlasmaSphere);
}

window.addEventListener('resize', animateAurora);
document.addEventListener('DOMContentLoaded', function() {
    setupInfoCardModals();
    animateAurora();
    animatePlasmaSphere();
    showElectricCanvas(document.getElementById('landing').classList.contains('active'));
    showParticlesCanvas(!document.getElementById('landing').classList.contains('active'));
}); 