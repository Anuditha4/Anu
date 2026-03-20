// script.js - Complete Fixed Birthday Website

// Global Variables
let currentPage = 0;
let totalPages = 6;
let photos = [];
let heartAnimationInterval = null;
let backgroundMusic = null;
let isMusicPlaying = false;
let countdownInterval = null;
let waterInterval = null;
let textInterval = null;

// Sample Photos (Replace with your own photos)
const samplePhotos = [
    'https://picsum.photos/id/20/300/400',
    'https://picsum.photos/id/25/300/400',
    'https://picsum.photos/id/26/300/400',
    'https://picsum.photos/id/28/300/400',
    'https://picsum.photos/id/29/300/400',
    'https://picsum.photos/id/30/300/400'
];

// Heart Photos for gallery
const heartPhotosList = [
    'https://picsum.photos/id/100/200/200',
    'https://picsum.photos/id/101/200/200',
    'https://picsum.photos/id/102/200/200',
    'https://picsum.photos/id/103/200/200',
    'https://picsum.photos/id/104/200/200',
    'https://picsum.photos/id/106/200/200',
    'https://picsum.photos/id/107/200/200',
    'https://picsum.photos/id/108/200/200'
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded - starting countdown');
    initCountdown();
    initMusicControl();
    initSurpriseButton();
});

// ===== 1. COUNTDOWN WITH PARTICLE EFFECT =====
function initCountdown() {
    let count = 1;
    const countdownElement = document.getElementById('countdownNumber');
    const canvas = document.getElementById('particleCanvas');
    
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    let particles = [];
    
    function createParticles(x, y) {
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 5,
                life: 1,
                size: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 60 + 320}, 100%, 65%)`
            });
        }
    }
    
    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= 0.02;
            
            if (p.life <= 0 || p.y > canvas.height) {
                particles.splice(i, 1);
                continue;
            }
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (particles.length > 0) {
            requestAnimationFrame(animateParticles);
        }
    }
    
    // Countdown animation
    countdownInterval = setInterval(() => {
        if (count <= 3) {
            console.log('Countdown:', count);
            // Update number
            countdownElement.textContent = count;
            
            // Create particles at center
            const rect = countdownElement.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            createParticles(centerX, centerY);
            animateParticles();
            
            count++;
        } else {
            clearInterval(countdownInterval);
            // End countdown with fade out
            const overlay = document.getElementById('countdownOverlay');
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                overlay.classList.add('hidden');
                const mainContent = document.getElementById('mainContent');
                mainContent.classList.remove('hidden');
                
                // Initialize all features
                initWaterFlow();
                initTextReveal();
            }, 1000);
        }
    }, 1000);
}

// ===== 2. WATER FLOW ANIMATION =====
function initWaterFlow() {
    console.log('Initializing water flow');
    const waterCanvas = document.getElementById('waterCanvas');
    
    if (!waterCanvas) {
        console.error('Water canvas not found');
        return;
    }
    
    const ctx = waterCanvas.getContext('2d');
    const textOverlay = document.getElementById('waterTextOverlay');
    
    function resizeWaterCanvas() {
        waterCanvas.width = window.innerWidth;
        waterCanvas.height = window.innerHeight;
    }
    resizeWaterCanvas();
    window.addEventListener('resize', resizeWaterCanvas);
    
    // Create falling water drops
    let drops = [];
    
    function createWaterDrop() {
        return {
            x: Math.random() * waterCanvas.width,
            y: -20,
            radius: Math.random() * 4 + 2,
            speed: Math.random() * 3 + 2,
            opacity: Math.random() * 0.5 + 0.3
        };
    }
    
    for (let i = 0; i < 100; i++) {
        drops.push(createWaterDrop());
    }
    
    // Create floating text
    function createFloatingText() {
        const text = document.createElement('div');
        text.className = 'water-text';
        text.textContent = 'happy birthday';
        text.style.left = Math.random() * 100 + '%';
        text.style.fontSize = (Math.random() * 20 + 10) + 'px';
        text.style.animationDuration = (Math.random() * 4 + 3) + 's';
        text.style.animationDelay = Math.random() * 5 + 's';
        textOverlay.appendChild(text);
        
        setTimeout(() => {
            if (text && text.remove) text.remove();
        }, 8000);
    }
    
    // Create text every 500ms
    if (waterInterval) clearInterval(waterInterval);
    waterInterval = setInterval(createFloatingText, 500);
    
    // Animate water drops
    function animateWater() {
        if (!ctx) return;
        ctx.clearRect(0, 0, waterCanvas.width, waterCanvas.height);
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, waterCanvas.height);
        gradient.addColorStop(0, 'rgba(255,105,180,0.1)');
        gradient.addColorStop(1, 'rgba(255,20,147,0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, waterCanvas.width, waterCanvas.height);
        
        // Draw water drops
        drops.forEach(drop => {
            ctx.beginPath();
            ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 105, 180, ${drop.opacity})`;
            ctx.fill();
            
            drop.y += drop.speed;
            
            if (drop.y > waterCanvas.height) {
                drop.y = -20;
                drop.x = Math.random() * waterCanvas.width;
            }
        });
        
        requestAnimationFrame(animateWater);
    }
    
    animateWater();
}

// ===== 3. SEQUENTIAL TEXT REVEAL =====
function initTextReveal() {
    console.log('Initializing text reveal');
    const texts = ['text1', 'text2', 'text3', 'text4'];
    let delay = 0;
    
    texts.forEach((textId, index) => {
        setTimeout(() => {
            const element = document.getElementById(textId);
            if (element) {
                element.classList.add('show');
            }
        }, delay);
        delay += 800;
    });
    
    // Show heart rotation after all text
    setTimeout(() => {
        const heartRotation = document.getElementById('heartRotation');
        if (heartRotation) {
            heartRotation.classList.add('show');
        }
    }, delay + 500);
    
    // Show memory book after heart animation
    setTimeout(() => {
        const textSection = document.getElementById('textRevealSection');
        if (textSection) {
            textSection.style.opacity = '0';
            textSection.style.transition = 'opacity 1s ease';
            setTimeout(() => {
                textSection.classList.add('hidden');
                const memoryBook = document.getElementById('memoryBookSection');
                if (memoryBook) {
                    memoryBook.classList.remove('hidden');
                    initMemoryBook();
                }
            }, 1000);
        }
    }, delay + 4000);
}

// ===== 4. MEMORY BOOK =====
function initMemoryBook() {
    console.log('Initializing memory book');
    const bookCover = document.getElementById('bookCover');
    const bookPages = document.getElementById('bookPages');
    let isOpen = false;
    
    if (!bookPages) return;
    
    // Clear existing pages
    bookPages.innerHTML = '';
    
    // Create pages
    for (let i = 0; i < totalPages; i++) {
        const page = document.createElement('div');
        page.className = 'page';
        if (i === 0) page.classList.add('active');
        
        const img = document.createElement('img');
        img.src = samplePhotos[i % samplePhotos.length];
        img.alt = `Memory ${i + 1}`;
        page.appendChild(img);
        
        bookPages.appendChild(page);
    }
    
    // Create page controls
    let controls = document.querySelector('.page-controls');
    if (!controls) {
        controls = document.createElement('div');
        controls.className = 'page-controls';
        controls.innerHTML = `
            <button class="page-btn" id="prevPage">◀ Previous</button>
            <button class="page-btn" id="nextPage">Next ▶</button>
        `;
        document.querySelector('.book-container').appendChild(controls);
    }
    
    function updatePages() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            if (index === currentPage) {
                page.classList.add('active');
                page.style.display = 'flex';
            } else {
                page.classList.remove('active');
                page.style.display = 'none';
            }
        });
    }
    
    // Book open/close
    if (bookCover) {
        bookCover.addEventListener('click', () => {
            if (!isOpen) {
                bookPages.classList.add('open');
                bookCover.style.transform = 'rotateY(-180deg)';
                isOpen = true;
                updatePages();
            }
        });
    }
    
    // Page navigation
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updatePages();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                updatePages();
            } else {
                // After last page, show photo hearts
                const memorySection = document.getElementById('memoryBookSection');
                if (memorySection) {
                    memorySection.style.opacity = '0';
                    memorySection.style.transition = 'opacity 1s ease';
                    setTimeout(() => {
                        memorySection.classList.add('hidden');
                        const photoSection = document.getElementById('photoHeartSection');
                        if (photoSection) {
                            photoSection.classList.remove('hidden');
                            initPhotoHearts();
                        }
                    }, 1000);
                }
            }
        });
    }
    
    updatePages();
}

// ===== 5. PHOTO HEART ANIMATION =====
function initPhotoHearts() {
    console.log('Initializing photo hearts');
    const container = document.getElementById('heartsContainer');
    
    if (!container) return;
    
    container.innerHTML = '';
    let index = 0;
    
    function addHeartPhoto() {
        if (index >= heartPhotosList.length) {
            if (heartAnimationInterval) {
                clearInterval(heartAnimationInterval);
            }
            // Show surprise button section
            setTimeout(() => {
                const surpriseSection = document.getElementById('surpriseSection');
                if (surpriseSection) {
                    surpriseSection.classList.remove('hidden');
                    surpriseSection.style.opacity = '0';
                    setTimeout(() => {
                        surpriseSection.style.opacity = '1';
                        surpriseSection.style.transition = 'opacity 0.5s ease';
                    }, 100);
                }
            }, 1000);
            return;
        }
        
        const heartDiv = document.createElement('div');
        heartDiv.className = 'heart-photo';
        
        const img = document.createElement('img');
        img.src = heartPhotosList[index];
        img.alt = `Memory ${index + 1}`;
        
        heartDiv.appendChild(img);
        container.appendChild(heartDiv);
        
        // Add click effect with confetti
        heartDiv.addEventListener('click', (e) => {
            heartDiv.style.transform = 'scale(1.2)';
            setTimeout(() => {
                heartDiv.style.transform = '';
            }, 300);
            
            // Small confetti burst
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 30,
                    spread: 45,
                    origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
                    colors: ['#ff69b4', '#ff1493', '#ffd700']
                });
            }
        });
        
        index++;
    }
    
    // Add hearts every 600ms
    if (heartAnimationInterval) clearInterval(heartAnimationInterval);
    heartAnimationInterval = setInterval(addHeartPhoto, 600);
}

// ===== 6. SURPRISE BUTTON =====
function initSurpriseButton() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseModal = document.getElementById('surpriseModal');
    const modalClose = document.querySelector('.modal-close');
    const balloonsContainer = document.getElementById('balloonsContainer');
    
    if (!surpriseBtn) return;
    
    surpriseBtn.addEventListener('click', function() {
        // Show modal
        if (surpriseModal) {
            surpriseModal.classList.remove('hidden');
            
            // Create balloons
            if (balloonsContainer) {
                balloonsContainer.innerHTML = '';
                for (let i = 0; i < 15; i++) {
                    setTimeout(() => {
                        const balloon = document.createElement('div');
                        balloon.className = 'balloon';
                        balloon.innerHTML = ['🎈', '🎈', '🎈', '🎉', '🎊'][Math.floor(Math.random() * 5)];
                        balloon.style.left = Math.random() * 100 + '%';
                        balloon.style.bottom = '-50px';
                        balloon.style.fontSize = (Math.random() * 30 + 20) + 'px';
                        balloon.style.position = 'absolute';
                        balloon.style.animation = `floatBalloon ${Math.random() * 3 + 2}s ease-in forwards`;
                        balloonsContainer.appendChild(balloon);
                        
                        setTimeout(() => {
                            balloon.remove();
                        }, 3000);
                    }, i * 100);
                }
            }
            
            // Confetti explosion
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#ff69b4', '#ff1493', '#ffd700', '#ff0066']
                });
                
                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.5, x: 0.2 }
                    });
                }, 200);
                
                setTimeout(() => {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.5, x: 0.8 }
                    });
                }, 400);
            }
        }
        
        // Button animation
        surpriseBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            surpriseBtn.style.transform = '';
        }, 150);
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (surpriseModal) {
                surpriseModal.classList.add('hidden');
            }
        });
    }
    
    // Close on outside click
    if (surpriseModal) {
        surpriseModal.addEventListener('click', (e) => {
            if (e.target === surpriseModal) {
                surpriseModal.classList.add('hidden');
            }
        });
    }
}

// ===== 7. MUSIC CONTROL =====
function initMusicControl() {
    const musicToggle = document.getElementById('musicToggle');
    
    // Create audio element
    backgroundMusic = new Audio();
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    // Try to load a free romantic music from online
    // You can replace this URL with your own music file
    backgroundMusic.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (!isMusicPlaying) {
                backgroundMusic.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.innerHTML = '🔊 Music On';
                    musicToggle.style.background = '#ff69b4';
                    musicToggle.style.color = 'white';
                }).catch(e => {
                    console.log('Music play failed:', e);
                    musicToggle.innerHTML = '🔇 Music (Click page first)';
                });
            } else {
                backgroundMusic.pause();
                isMusicPlaying = false;
                musicToggle.innerHTML = '🔇 Music Off';
                musicToggle.style.background = 'rgba(0,0,0,0.7)';
                musicToggle.style.color = '#ff69b4';
            }
        });
    }
}

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    if (countdownInterval) clearInterval(countdownInterval);
    if (waterInterval) clearInterval(waterInterval);
    if (heartAnimationInterval) clearInterval(heartAnimationInterval);
    if (backgroundMusic) backgroundMusic.pause();
});