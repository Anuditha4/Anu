// script.js - Complete Birthday Website

// Global Variables
let currentPage = 0;
let totalPages = 6;
let photos = [];
let heartAnimationInterval = null;
let backgroundMusic = null;
let isMusicPlaying = false;

// Sample Photos (Replace with your own)
const samplePhotos = [
    'https://picsum.photos/id/20/300/400',  // Replace with your photo
    'https://picsum.photos/id/25/300/400',  // Replace with your photo
    'https://picsum.photos/id/26/300/400',  // Replace with your photo
    'https://picsum.photos/id/28/300/400',  // Replace with your photo
    'https://picsum.photos/id/29/300/400',  // Replace with your photo
    'https://picsum.photos/id/30/300/400'   // Replace with your photo
];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initMusicControl();
});

// ===== 1. COUNTDOWN WITH PARTICLE EFFECT =====
function initCountdown() {
    let count = 1;
    const countdownElement = document.getElementById('countdownNumber');
    const canvas = document.getElementById('particleCanvas');
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
    const interval = setInterval(() => {
        if (count <= 3) {
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
            clearInterval(interval);
            // End countdown
            document.getElementById('countdownOverlay').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('countdownOverlay').classList.add('hidden');
                document.getElementById('mainContent').classList.remove('hidden');
                initWaterFlow();
                initTextReveal();
            }, 1000);
        }
    }, 1000);
}

// ===== 2. WATER FLOW ANIMATION =====
function initWaterFlow() {
    const waterCanvas = document.getElementById('waterCanvas');
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
            text.remove();
        }, 8000);
    }
    
    // Create text every 500ms
    setInterval(createFloatingText, 500);
    
    // Animate water drops
    function animateWater() {
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
    const texts = ['text1', 'text2', 'text3', 'text4'];
    let delay = 0;
    
    texts.forEach((textId, index) => {
        setTimeout(() => {
            const element = document.getElementById(textId);
            element.classList.add('show');
        }, delay);
        delay += 800;
    });
    
    // Show heart rotation after all text
    setTimeout(() => {
        const heartRotation = document.getElementById('heartRotation');
        heartRotation.classList.add('show');
    }, delay + 500);
    
    // Show memory book after heart animation
    setTimeout(() => {
        document.getElementById('textRevealSection').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('textRevealSection').classList.add('hidden');
            document.getElementById('memoryBookSection').classList.remove('hidden');
            initMemoryBook();
        }, 1000);
    }, delay + 4000);
}

// ===== 4. MEMORY BOOK =====
function initMemoryBook() {
    const bookCover = document.getElementById('bookCover');
    const bookPages = document.getElementById('bookPages');
    let isOpen = false;
    
    // Create pages
    for (let i = 0; i < totalPages; i++) {
        const page = document.createElement('div');
        page.className = 'page';
        if (i === 0) page.classList.add('page-front');
        if (i === totalPages - 1) page.classList.add('page-back');
        
        const img = document.createElement('img');
        img.src = samplePhotos[i % samplePhotos.length];
        img.alt = `Memory ${i + 1}`;
        page.appendChild(img);
        
        bookPages.appendChild(page);
    }
    
    // Create page controls
    const controls = document.createElement('div');
    controls.className = 'page-controls';
    controls.innerHTML = `
        <button class="page-btn" id="prevPage">◀ Previous</button>
        <button class="page-btn" id="nextPage">Next ▶</button>
    `;
    document.querySelector('.book-container').appendChild(controls);
    
    function updatePages() {
        const pages = document.querySelectorAll('.page');
        pages.forEach((page, index) => {
            if (index === currentPage) {
                page.style.display = 'flex';
            } else {
                page.style.display = 'none';
            }
        });
    }
    
    // Book open/close
    bookCover.addEventListener('click', () => {
        if (!isOpen) {
            bookPages.classList.add('open');
            bookCover.style.transform = 'rotateY(-180deg)';
            isOpen = true;
            updatePages();
        }
    });
    
    // Page navigation
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updatePages();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updatePages();
        } else {
            // After last page, show photo hearts
            document.getElementById('memoryBookSection').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('memoryBookSection').classList.add('hidden');
                document.getElementById('photoHeartSection').classList.remove('hidden');
                initPhotoHearts();
            }, 1000);
        }
    });
    
    updatePages();
}

// ===== 5. PHOTO HEART ANIMATION =====
function initPhotoHearts() {
    const container = document.getElementById('heartsContainer');
    const heartPhotos = [
        'https://picsum.photos/id/100/200/200',
        'https://picsum.photos/id/101/200/200',
        'https://picsum.photos/id/102/200/200',
        'https://picsum.photos/id/103/200/200',
        'https://picsum.photos/id/104/200/200',
        'https://picsum.photos/id/106/200/200',
        'https://picsum.photos/id/107/200/200',
        'https://picsum.photos/id/108/200/200'
    ];
    
    let index = 0;
    
    function addHeartPhoto() {
        if (index >= heartPhotos.length) {
            clearInterval(heartAnimationInterval);
            // Show surprise button section
            setTimeout(() => {
                document.getElementById('surpriseSection').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('surpriseSection').classList.remove('hidden');
                    setTimeout(() => {
                        document.getElementById('surpriseSection').style.opacity = '1';
                    }, 100);
                }, 500);
            }, 1000);
            return;
        }
        
        const heartDiv = document.createElement('div');
        heartDiv.className = 'heart-photo';
        
        const img = document.createElement('img');
        img.src = heartPhotos[index];
        img.alt = `Memory ${index + 1}`;
        
        heartDiv.appendChild(img);
        container.appendChild(heartDiv);
        
        // Add click effect
        heartDiv.addEventListener('click', () => {
            heartDiv.style.transform = 'scale(1.2)';
            setTimeout(() => {
                heartDiv.style.transform = '';
            }, 300);
            createConfetti(heartDiv);
        });
        
        index++;
    }
    
    // Add hearts every 500ms
    heartAnimationInterval = setInterval(addHeartPhoto, 600);
}

// ===== 6. SURPRISE BUTTON =====
function initSurpriseButton() {
    const surprise