
// Magnetic Buttons
const magneticEls = document.querySelectorAll('.magnetic');

magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(el, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Tilt Effect for Bento Cards
const tiltCards = document.querySelectorAll('.tilt-effect');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            duration: 0.5,
            ease: "power2.out"
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// Theme Toggle logic is handled by the Dynamic Theme Switcher below.

// Music Player Widget
const playBtn = document.getElementById('play-btn');
const vinyl = document.getElementById('vinyl');
const bgAudio = document.getElementById('bg-audio');
let isPlaying = false;

function updatePlayerUI(playing) {
    isPlaying = playing;
    if(isPlaying) {
        vinyl.classList.add('playing');
        playBtn.textContent = '⏸️';
    } else {
        vinyl.classList.remove('playing');
        playBtn.textContent = '▶️';
    }
}

if (bgAudio) {
    bgAudio.volume = 0.5; // Set chill volume level
    
    // Skip to 20 seconds
    if (bgAudio.readyState >= 1) {
        bgAudio.currentTime = 20;
    } else {
        bgAudio.addEventListener('loadedmetadata', () => {
            bgAudio.currentTime = 20;
        });
    }

    // Sync UI with actual audio state
    bgAudio.addEventListener('play', () => updatePlayerUI(true));
    bgAudio.addEventListener('pause', () => updatePlayerUI(false));

    // AGGRESSIVE AUTOPLAY
    const forcePlay = () => {
        if (!isPlaying) {
            bgAudio.currentTime = 20;
            bgAudio.play().catch(e => console.warn("Chrome blocked autoplay."));
        }
    };

    forcePlay(); // Try immediately
    window.addEventListener('DOMContentLoaded', forcePlay);
    window.addEventListener('load', forcePlay);

    // Keep trying every second in background just in case the browser relents
    setInterval(forcePlay, 1000);
}

playBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent triggering the document interaction listener
    if(isPlaying) {
        bgAudio.pause();
    } else {
        bgAudio.play();
    }
});

// Interactive Bento Logic (Draggable removed to keep layout static)
// The emoji reaction system handles the interactivity.

// Emoji Reaction System
const reactBtns = document.querySelectorAll('.react-btn');

reactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const emoji = btn.getAttribute('data-emoji');
        createFloatingEmoji(emoji, e.clientX, e.clientY);
    });
});

function createFloatingEmoji(emojiText, x, y) {
    const emoji = document.createElement('div');
    emoji.textContent = emojiText;
    emoji.style.position = 'fixed';
    emoji.style.left = x + 'px';
    emoji.style.top = y + 'px';
    emoji.style.fontSize = '2rem';
    emoji.style.pointerEvents = 'none';
    emoji.style.zIndex = '10000';
    document.body.appendChild(emoji);
    
    // Randomize trajectory
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = -100 - Math.random() * 200;
    const randomRot = (Math.random() - 0.5) * 180;
    
    gsap.to(emoji, {
        x: randomX,
        y: randomY,
        rotation: randomRot,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
            emoji.remove();
        }
    });
}

// Initial Animation removed to prevent visibility bugs

// Lanyard 3D Effect
const lanyardArea = document.getElementById('lanyard-area');
const idCard = document.getElementById('id-card');

if (lanyardArea && idCard) {
    // Drop Entrance Animation
    gsap.from(".lanyard-string", {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.2,
        ease: "bounce.out",
        delay: 0.2
    });
    
    gsap.from(idCard, {
        y: -400,
        rotationZ: 15,
        opacity: 0,
        duration: 1.5,
        ease: "elastic.out(1, 0.4)",
        delay: 0.2
    });

    lanyardArea.addEventListener('mousemove', (e) => {
        const rect = lanyardArea.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate rotation for pendulum swing and 3D tilt
        const rotateY = (x / rect.width) * 30; 
        const rotateX = -(y / rect.height) * 30;
        const rotateZ = (x / rect.width) * 15; // Swing effect

        gsap.to(idCard, {
            rotateX: rotateX,
            rotateY: rotateY,
            rotateZ: rotateZ,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    lanyardArea.addEventListener('mouseleave', () => {
        gsap.to(idCard, {
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
}

// Three.js 3D Background Animation
const canvas = document.getElementById('webgl-canvas');
if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a group to hold 3D objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Torus Knot Wireframe
    const geometry1 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00f0ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.15 
    });
    
    // Make material globally accessible for theme switcher
    window.torusMaterial = material;
    const torusKnot = new THREE.Mesh(geometry1, material);
    group.add(torusKnot);

    // 2. Floating Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        color: 0xff00ff, // Neon Pink
        transparent: true,
        opacity: 0.8
    });

// --- DYNAMIC THEME SWITCHER ---
const themes = [
    { name: 'Cyberpunk', a1: '#00f0ff', a2: '#ff00ff', a3: '#ffff00', hex: 0x00f0ff },
    { name: 'Toxic Matrix', a1: '#39ff14', a2: '#000000', a3: '#ccff00', hex: 0x39ff14 },
    { name: 'Vaporwave', a1: '#ff71ce', a2: '#01cdfe', a3: '#05ffa1', hex: 0xff71ce },
    { name: 'Dracula Dark', a1: '#bd93f9', a2: '#ff79c6', a3: '#8be9fd', hex: 0xbd93f9 },
    { name: 'Blood Moon', a1: '#ff0000', a2: '#8a0303', a3: '#ff4d4d', hex: 0xff0000 }
];
let currentThemeIndex = 0;

const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const t = themes[currentThemeIndex];
        
        // Morph CSS Variables smoothly
        document.documentElement.style.setProperty('--accent-1', t.a1);
        document.documentElement.style.setProperty('--accent-2', t.a2);
        document.documentElement.style.setProperty('--accent-3', t.a3);
        
        // Update Three.js 3D Background color
        if (window.torusMaterial) {
            gsap.to(window.torusMaterial.color, {
                r: new THREE.Color(t.hex).r,
                g: new THREE.Color(t.hex).g,
                b: new THREE.Color(t.hex).b,
                duration: 1
            });
        }

        // Add a cool glitch effect to the button
        themeBtn.innerText = `✨ ${t.name}`;
        themeBtn.style.transform = 'scale(1.1)';
        setTimeout(() => themeBtn.style.transform = 'scale(1)', 200);
    });
}
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate objects
        torusKnot.rotation.y += 0.005;
        torusKnot.rotation.x += 0.002;
        
        particlesMesh.rotation.y = -elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Easing for smooth mouse tracking
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        group.rotation.y += 0.05 * (targetX - group.rotation.y);
        group.rotation.x += 0.05 * (targetY - group.rotation.x);

        renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- SCROLL ANIMATIONS ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.bento-item').forEach((box, i) => {
            gsap.from(box, {
                scrollTrigger: {
                    trigger: box,
                    start: "top 90%", // Trigger slightly before it comes fully into view
                    toggleActions: "play none none reverse"
                },
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                ease: "power3.out",
                delay: i % 3 * 0.1 // Slight stagger effect for rows
            });
        });
    }
});

// --- LIGHTBOX FEATURE ---
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');
const projectImages = document.querySelectorAll('.p-card img');

if (lightboxModal && lightboxImg && closeLightbox) {
    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            lightboxModal.classList.add('active');
            lightboxImg.src = e.target.src;
            document.body.style.overflow = 'hidden'; // Mencegah scrolling background
        });
    });

    const closeModal = () => {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Mengembalikan scrolling background
    };

    closeLightbox.addEventListener('click', closeModal);

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// --- CONTACT FORM TO EMAIL (SILENT/BACKGROUND) ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Sending... ⏳';
        
        const name = document.getElementById('sender-name').value;
        const email = document.getElementById('sender-email').value;
        const message = document.getElementById('sender-message').value;
        
        const targetEmail = 'alinggamahesa8@gmail.com'; // Email penerima
        
        // Kirim request ke FormSubmit secara diam-diam (background AJAX)
        fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Nama: name,
                Email: email,
                Pesan: message,
                _subject: "🚀 Pesan Baru dari Portofolio LINGSDEV!"
            })
        })
        .then(response => {
            if (!response.ok) throw new Error("CORS or Activation required");
            return response.json();
        })
        .then(data => {
            alert('Sukses! Pesan berhasil terkirim ke Email.');
            contactForm.reset();
            btn.innerHTML = originalText;
        })
        .catch(err => {
            // Jika AJAX gagal karena diblokir (belum aktivasi email)
            // Lakukan fallback: Submit form secara normal (akan pindah halaman)
            alert('Perhatian: Karena ini pengiriman PERTAMA, halaman akan beralih sebentar ke sistem FormSubmit agar kamu bisa memverifikasi emailmu.\n\nKlik OK, lalu periksa kotak masuk Gmail-mu dan klik tombol Activate.');
            
            contactForm.action = `https://formsubmit.co/${targetEmail}`;
            contactForm.method = 'POST';
            
            // Matikan captcha agar lebih cepat
            const captcha = document.createElement('input');
            captcha.type = 'hidden';
            captcha.name = '_captcha';
            captcha.value = 'false';
            contactForm.appendChild(captcha);
            
            contactForm.submit();
        });
    });
}
