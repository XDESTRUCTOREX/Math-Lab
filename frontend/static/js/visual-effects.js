/* ============================================
   MATHLAB - VISUAL EFFECTS ENGINE
   Canvas Constellation Particles + Aurora
   Mouse Follower + Loading Screen
   Theme Switcher + Sidebar + Teoria/Terminos
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // =====================================
    // EPIC LOADING SCREEN
    // =====================================
    (function initLoader() {
        var loader = document.getElementById('loading-screen');
        if (!loader) return;

        var symbolsContainer = document.getElementById('loader-bg-symbols');
        var progressFill = document.getElementById('loader-progress-fill');
        var formulaEl = document.getElementById('loader-formula');

        // Math formulas to cycle through
        var formulas = [
            'dy/dx = f(x, y)',
            'dT/dt = -k(T - Ta)',
            'dQ/dt = re*ce - rs*Q/V',
            'dP/dt = kP',
            'dN/dt = -kN',
            'y\' + P(x)y = Q(x)',
            'M dx + N dy = 0',
            'T(t) = Ta + Ce^(-kt)',
            'P(t) = P0 * e^(kt)',
            'mu(x) = e^(∫P(x)dx)'
        ];

        var formulaIndex = 0;

        // Spawn floating math symbols in loader background
        if (symbolsContainer) {
            var loaderSymbols = ['∫','dx','dy','∑','π','∂','∞','Δ','∇','λ','θ','√','Ω','α','β','γ','δ','ε','≈','≠'];
            for (var i = 0; i < 35; i++) {
                var s = document.createElement('span');
                s.className = 'loader-bg-symbol';
                s.textContent = loaderSymbols[Math.floor(Math.random() * loaderSymbols.length)];
                s.style.left = Math.random() * 100 + '%';
                s.style.fontSize = (0.8 + Math.random() * 2.2) + 'rem';
                s.style.animationDuration = (8 + Math.random() * 18) + 's';
                s.style.animationDelay = (Math.random() * 8) + 's';
                symbolsContainer.appendChild(s);
            }
        }

        // Cycle through formulas
        var formulaInterval = setInterval(function() {
            if (!formulaEl) return;
            formulaEl.style.opacity = '0';
            setTimeout(function() {
                formulaIndex = (formulaIndex + 1) % formulas.length;
                formulaEl.textContent = formulas[formulaIndex];
                formulaEl.style.opacity = '1';
            }, 300);
        }, 1200);

        // Animate progress bar
        var progress = 0;
        var progressInterval = setInterval(function() {
            if (!progressFill) return;
            progress += (100 - progress) * 0.12 + Math.random() * 3;
            if (progress > 98) progress = 98;
            progressFill.style.width = progress + '%';
        }, 200);

        // Dismiss loader after minimum time
        setTimeout(function() {
            clearInterval(progressInterval);
            clearInterval(formulaInterval);
            if (progressFill) progressFill.style.width = '100%';

            setTimeout(function() {
                loader.classList.add('fade-out');
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 800);
            }, 400);
        }, 3200);
    })();

    // =====================================
    // CANVAS CONSTELLATION PARTICLE SYSTEM
    // WOW EFFECT - Particles + Connections + Mouse Interaction
    // =====================================
    try {
        var canvas = document.getElementById('particle-canvas');
        if (canvas) {
            var ctx = canvas.getContext('2d');
            var particles = [];
            var mouse = { x: -1000, y: -1000 };
            var animationId;
            var PARTICLE_COUNT = 70;
            var CONNECTION_DISTANCE = 140;
            var MOUSE_RADIUS = 180;

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            // Track mouse position
            document.addEventListener('mousemove', function(e) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            document.addEventListener('mouseleave', function() {
                mouse.x = -1000;
                mouse.y = -1000;
            });

            // Math symbols for particles to display
            var mathSymbols = [
                '∫', 'dx', 'dy', '∑', 'π', '∂', '∞', 'Δ', '∇', 'λ',
                'θ', 'φ', 'ε', '√', 'Ω', 'μ', 'σ', 'α', 'β', 'γ',
                'δ', 'ω', 'ζ', 'η', 'ξ', 'ψ', '≈', '≠', '≤', '≥'
            ];

            // Helper: get R,G,B numbers from CSS variable
            function getThemeColors() {
                var style = getComputedStyle(document.documentElement);
                var pc = style.getPropertyValue('--particle-color').trim();
                var pg = style.getPropertyValue('--particle-glow').trim();
                var pl = style.getPropertyValue('--particle-line').trim();
                return {
                    colorRGB: pc,
                    glowRGB: pg,
                    lineRGB: pl,
                    accentPrimary: style.getPropertyValue('--accent-primary').trim()
                };
            }

            // Helper: build rgba string from "r, g, b" + opacity
            function rgba(rgbStr, opacity) {
                return 'rgba(' + rgbStr + ',' + opacity + ')';
            }

            // Particle class
            function Particle() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2.5 + 0.5;
                this.baseRadius = this.radius;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.baseOpacity = this.opacity;
                this.symbol = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
                this.showSymbol = Math.random() < 0.3;
                this.symbolSize = Math.random() * 10 + 8;
                this.pulsePhase = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.01 + Math.random() * 0.02;
            }

            Particle.prototype.update = function() {
                // Pulse animation
                this.pulsePhase += this.pulseSpeed;
                this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 0.5;
                this.opacity = this.baseOpacity + Math.sin(this.pulsePhase) * 0.1;

                // Mouse repulsion
                var dx = this.x - mouse.x;
                var dy = this.y - mouse.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    var angle = Math.atan2(dy, dx);
                    this.vx += Math.cos(angle) * force * 0.8;
                    this.vy += Math.sin(angle) * force * 0.8;
                    this.opacity = Math.min(1, this.baseOpacity + force * 0.5);
                    this.radius = this.baseRadius + force * 2;
                }

                // Apply velocity with friction
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Keep in bounds
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));

                // Slowly drift
                this.vx += (Math.random() - 0.5) * 0.02;
                this.vy += (Math.random() - 0.5) * 0.02;

                // Max speed
                var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 2) {
                    this.vx = (this.vx / speed) * 2;
                    this.vy = (this.vy / speed) * 2;
                }
            };

            Particle.prototype.draw = function(colors) {
                // Draw glow
                var gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, Math.max(0.1, this.radius * 4)
                );
                gradient.addColorStop(0, rgba(colors.glowRGB, this.opacity * 0.6));
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0.1, this.radius * 4), 0, Math.PI * 2);
                ctx.fill();

                // Draw core
                ctx.fillStyle = rgba(colors.glowRGB, this.opacity);
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0.1, this.radius), 0, Math.PI * 2);
                ctx.fill();

                // Draw symbol if applicable
                if (this.showSymbol) {
                    ctx.font = this.symbolSize + 'px JetBrains Mono, monospace';
                    ctx.fillStyle = rgba(colors.colorRGB, this.opacity * 0.7);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(this.symbol, this.x, this.y - this.radius - 8);
                }
            };

            // Initialize particles
            for (var i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }

            // Shooting stars
            var shootingStars = [];
            function ShootingStar() {
                this.x = Math.random() * canvas.width;
                this.y = -10;
                this.length = 60 + Math.random() * 80;
                this.speed = 4 + Math.random() * 6;
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
                this.opacity = 0.8;
                this.life = 1;
                this.decay = 0.01 + Math.random() * 0.015;
            }

            // Spawn shooting star occasionally
            setInterval(function() {
                if (shootingStars.length < 2 && Math.random() < 0.3) {
                    shootingStars.push(new ShootingStar());
                }
            }, 2000);

            function drawShootingStars(colors) {
                for (var i = shootingStars.length - 1; i >= 0; i--) {
                    var star = shootingStars[i];
                    star.x += Math.cos(star.angle) * star.speed;
                    star.y += Math.sin(star.angle) * star.speed;
                    star.life -= star.decay;

                    if (star.life <= 0) {
                        shootingStars.splice(i, 1);
                        continue;
                    }

                    var tailX = star.x - Math.cos(star.angle) * star.length;
                    var tailY = star.y - Math.sin(star.angle) * star.length;

                    var grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
                    grad.addColorStop(0, 'rgba(0,0,0,0)');
                    grad.addColorStop(1, rgba(colors.glowRGB, star.life * star.opacity));

                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(tailX, tailY);
                    ctx.lineTo(star.x, star.y);
                    ctx.stroke();

                    // Bright head
                    ctx.fillStyle = rgba(colors.glowRGB, star.life * star.opacity);
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Animation loop
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var colors = getThemeColors();

                // Update particles
                for (var i = 0; i < particles.length; i++) {
                    particles[i].update();
                }

                // Draw connections between nearby particles
                for (var i = 0; i < particles.length; i++) {
                    for (var j = i + 1; j < particles.length; j++) {
                        var dx = particles[i].x - particles[j].x;
                        var dy = particles[i].y - particles[j].y;
                        var dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < CONNECTION_DISTANCE) {
                            var lineOpacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                            ctx.strokeStyle = rgba(colors.lineRGB, lineOpacity);
                            ctx.lineWidth = (1 - dist / CONNECTION_DISTANCE) * 1.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }

                // Draw particles
                for (var i = 0; i < particles.length; i++) {
                    particles[i].draw(colors);
                }

                // Draw mouse glow effect
                if (mouse.x > 0 && mouse.y > 0) {
                    var mouseGrad = ctx.createRadialGradient(
                        mouse.x, mouse.y, 0,
                        mouse.x, mouse.y, MOUSE_RADIUS
                    );
                    mouseGrad.addColorStop(0, rgba(colors.glowRGB, 0.06));
                    mouseGrad.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = mouseGrad;
                    ctx.beginPath();
                    ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Shooting stars
                drawShootingStars(colors);

                animationId = requestAnimationFrame(animate);
            }
            animate();
        }
    } catch(e) { console.error('Canvas particles error:', e); }

    // =====================================
    // MOUSE FOLLOWER GLOW
    // =====================================
    try {
        var follower = document.getElementById('mouse-follower');
        if (follower) {
            document.addEventListener('mousemove', function(e) {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            });
        }
    } catch(e) { console.error('Mouse follower error:', e); }

    // =====================================
    // FLOATING MATH SYMBOLS (CSS layer)
    // =====================================
    try {
        var container = document.getElementById("math-particles");
        if (container) {
            var symbols = [
                '∫', 'dx', 'dy', '∑', 'π', '∂', '∞', 'Δ', '∇', 'λ',
                'θ', 'φ', 'ε', '√', 'Ω', 'μ', 'σ', 'α', 'β', 'γ',
                'δ', 'ω', 'ζ', 'η', 'ξ', 'ψ', '≈', '≠', '≤', '≥',
                'lim', 'log', 'sin', 'cos', 'tan', 'det', '∀', '∃',
                'dF', 'dT', 'e^x', 'dy/dx'
            ];
            for (var i = 0; i < 30; i++) {
                var p = document.createElement('span');
                p.className = 'math-particle';
                p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDuration = (20 + Math.random() * 40) + 's';
                p.style.animationDelay = (Math.random() * 35) + 's';
                p.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
                container.appendChild(p);
            }
        }
    } catch(e) { console.error('CSS particles error:', e); }

    // =====================================
    // THEME SWITCHER - Bottom of sidebar with toggle
    // =====================================
    try {
        var savedTheme = localStorage.getItem('mathlab-theme') || 'red';
        document.documentElement.setAttribute('data-theme', savedTheme);

        function updateThemeDots(active) {
            document.querySelectorAll('.theme-dot').forEach(function(d) {
                if (d.dataset.theme === active) {
                    d.classList.add('active');
                } else {
                    d.classList.remove('active');
                }
            });
        }
        updateThemeDots(savedTheme);

        // Theme toggle button
        var themeToggleBtn = document.getElementById('theme-toggle-btn');
        var themePanel = document.getElementById('theme-panel');
        if (themeToggleBtn && themePanel) {
            // Restore open state
            var themePanelOpen = localStorage.getItem('mathlab-theme-panel') === 'true';
            if (themePanelOpen) themePanel.classList.add('open');

            themeToggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                themePanel.classList.toggle('open');
                localStorage.setItem('mathlab-theme-panel', themePanel.classList.contains('open'));
            });
        }

        // Theme dot clicks
        document.querySelectorAll('.theme-dot').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('mathlab-theme', theme);
                updateThemeDots(theme);
            });
        });
    } catch(e) { console.error('Theme error:', e); }

    // =====================================
    // SIDEBAR COLLAPSE TOGGLE
    // =====================================
    try {
        var sidebar = document.getElementById('main-sidebar');
        var toggleBtn = document.getElementById('sidebar-toggle');
        if (sidebar && toggleBtn) {
            var isCollapsed = localStorage.getItem('mathlab-sidebar-collapsed') === 'true';
            if (isCollapsed) sidebar.classList.add('collapsed');

            toggleBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('collapsed');
                localStorage.setItem('mathlab-sidebar-collapsed', sidebar.classList.contains('collapsed'));
            });
        }
    } catch(e) { console.error('Sidebar toggle error:', e); }

    // =====================================
    // LOGO TEORIA LINK (clickable text)
    // =====================================
    try {
        var teoriaLink = document.getElementById('logo-teoria-link');
        var resolverSection = document.getElementById('seccion-resolver');
        var teoriaSection = document.getElementById('seccion-teoria');
        var modeloBtns = document.querySelectorAll('.modelo-btn');

        if (teoriaLink) {
            teoriaLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var isActive = teoriaLink.classList.contains('active-link');

                if (isActive) {
                    // Volver a resolver
                    teoriaLink.classList.remove('active-link');
                    if (resolverSection) resolverSection.style.display = 'block';
                    if (teoriaSection) teoriaSection.style.display = 'none';
                } else {
                    // Ir a teoria
                    teoriaLink.classList.add('active-link');
                    modeloBtns.forEach(function(b) { b.classList.remove('active'); });
                    if (resolverSection) resolverSection.style.display = 'none';
                    if (teoriaSection) teoriaSection.style.display = 'block';
                    if (typeof inicializarTeoria === 'function') {
                        inicializarTeoria();
                    }
                }
            });
        }

        // Cuando click en modelo, salir de teoria
        modeloBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (teoriaLink) teoriaLink.classList.remove('active-link');
                if (resolverSection) resolverSection.style.display = 'block';
                if (teoriaSection) teoriaSection.style.display = 'none';
            });
        });
    } catch(e) { console.error('Teoria link error:', e); }

    // =====================================
    // LOGO TERMINOS LINK (clickable text)
    // =====================================
    try {
        var termsLink = document.getElementById('logo-terms-link');
        var termsModal = document.getElementById('terms-modal');
        var termsClose = document.getElementById('terms-close-btn');

        if (termsLink && termsModal) {
            termsLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                termsModal.classList.add('active');
            });
        }

        if (termsClose && termsModal) {
            termsClose.addEventListener('click', function(e) {
                e.preventDefault();
                termsModal.classList.remove('active');
            });
        }

        if (termsModal) {
            termsModal.addEventListener('click', function(e) {
                if (e.target === termsModal) {
                    termsModal.classList.remove('active');
                }
            });
        }
    } catch(e) { console.error('Terms link error:', e); }

    // =====================================
    // KEYBOARD SHORTCUTS
    // =====================================
    try {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                var modal = document.getElementById('terms-modal');
                if (modal) modal.classList.remove('active');
            }
        });
    } catch(e) { console.error('Keyboard error:', e); }

}); // end DOMContentLoaded