/* =========================================
   DATA: EXTENDED BIBLE VERSES
   ========================================= */
const verseDatabase = [
    { t: "For I know the plans I have for you... plans to give you hope and a future.", r: "Jeremiah 29:11", d: "Trust that 2026 is already planned for your good. Walk in confidence." },
    { t: "He makes me lie down in green pastures, he leads me beside quiet waters.", r: "Psalm 23:2", d: "May this year bring you peace and rest amidst the noise of the world." },
    { t: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", r: "Matthew 6:33", d: "Prioritize your spiritual walk, and watch everything else fall into place." },
    { t: "I can do all this through him who gives me strength.", r: "Philippians 4:13", d: "There is no challenge in 2026 too big for you and God to handle together." },
    { t: "The Lord himself goes before you and will be with you; he will never leave you nor forsake you.", r: "Deuteronomy 31:8", d: "You are never walking alone. Remember this every single day." },
    { t: "Behold, I am doing a new thing! Now it springs up; do you not perceive it?", r: "Isaiah 43:19", d: "Let go of the old failures. God is writing a new chapter for you." },
    { t: "Trust in the Lord with all your heart and lean not on your own understanding.", r: "Proverbs 3:5", d: "You don't need to figure it all out. Just take the next faithful step." },
    { t: "Come to me, all you who are weary and burdened, and I will give you rest.", r: "Matthew 11:28", d: "Don't carry the weight of the year by yourself. Hand it over to Him." },
    { t: "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", r: "Matthew 5:16", d: "You are called to be a leader and a light in your community this year." },
    { t: "Be strong and courageous. Do not be afraid; do not be discouraged.", r: "Joshua 1:9", d: "Fear is a liar. Step boldly into the opportunities 2026 brings." }
];

/* =========================================
   LOGIC: DOM ELEMENTS & STATE
   ========================================= */
const els = {
    card: document.getElementById('mainCard'),
    verseText: document.getElementById('verseText'),
    verseRef: document.getElementById('verseRef'),
    reflection: document.getElementById('reflectionText'),
    status: document.getElementById('statusMsg'),
    lyrics: document.getElementById('lyricsContainer'),
    btnGen: document.getElementById('btnGenerate'),
    btnMusic: document.getElementById('btnMusic'),
    musicLabel: document.getElementById('musicLabel'),
    bgImage: document.getElementById('bgImage')
};

/* =========================================
   LOGIC: YOUTUBE AUDIO PLAYER
   ========================================= */
let player;
let isPlayerReady = false;
let isPlaying = false;

// This function is automatically called by the external YouTube API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '7x8I7s_7vXo', // "He Leadeth Me" Piano Instrumental
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'loop': 1,
            'playlist': '7x8I7s_7vXo' // Required for loop to work
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    els.status.innerText = "Audio loaded ready.";
    player.setVolume(50);
}

function onPlayerStateChange(event) {
    // YT.PlayerState.PLAYING = 1
    if (event.data === 1) {
        isPlaying = true;
        els.btnMusic.classList.add('playing');
        els.musicLabel.innerText = "Pause";
        els.lyrics.style.opacity = '1';
        els.status.innerText = "Now Playing: He Leadeth Me";
    } else if (event.data === 2) { // PAUSED
        isPlaying = false;
        els.btnMusic.classList.remove('playing');
        els.musicLabel.innerText = "Resume";
        els.lyrics.style.opacity = '0';
        els.status.innerText = "Paused";
    }
}

els.btnMusic.addEventListener('click', () => {
    if (!isPlayerReady) {
        els.status.innerText = "Initializing audio engine...";
        return;
    }
    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
        els.status.innerText = "Buffering...";
    }
});

/* =========================================
   LOGIC: VERSE GENERATOR & UI
   ========================================= */
els.btnGen.addEventListener('click', () => {
    // 1. Reset Animation
    els.verseText.classList.remove('animate-in');
    els.verseRef.classList.remove('animate-in');
    els.reflection.classList.remove('animate-in');
    
    // 2. Select Random Data
    const data = verseDatabase[Math.floor(Math.random() * verseDatabase.length)];
    
    // 3. Update Text with slight delay for visual effect
    els.status.innerText = "Receiving word...";
    
    setTimeout(() => {
        // Update Content
        els.verseText.innerHTML = `"${data.t}"`;
        els.verseRef.innerText = data.r;
        els.reflection.style.display = 'block';
        els.reflection.innerText = `💡 Reflection: ${data.d}`;
        
        // Trigger Animations
        void els.verseText.offsetWidth; // force reflow
        els.verseText.classList.add('animate-in');
        
        void els.verseRef.offsetWidth;
        els.verseRef.classList.add('animate-in');

        void els.reflection.offsetWidth;
        els.reflection.classList.add('animate-in');

        els.status.innerText = "";
        
        // 4. Trigger Fireworks Burst
        launchFireworksBatch();
        
    }, 150);
});

/* =========================================
   LOGIC: MOUSE PARALLAX EFFECT
   ========================================= */
document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate distance from center (normalized -1 to 1)
    const x = (e.clientX - centerX) / centerX;
    const y = (e.clientY - centerY) / centerY;

    // Move Card (3D Tilt)
    els.card.style.transform = `perspective(1000px) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;

    // Move Background (Opposite direction for depth)
    els.bgImage.style.transform = `scale(1.1) translate(${x * -15}px, ${y * -15}px)`;
});

/* =========================================
   LOGIC: ADVANCED PARTICLE SYSTEM (CANVAS)
   ========================================= */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Resize Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particles = [];
const colors = ['#FFD700', '#00F3FF', '#BC13FE', '#FFFFFF', '#FFA500'];

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // Explosion physics
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.friction = 0.96; // Air resistance
        this.gravity = 0.05;  // Pulls particles down
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 3 + 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.restore();
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
}

function launchFireworksBatch() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;
    
    // Create 50 particles
    for(let i=0; i<60; i++) {
        particles.push(new Particle(centerX, centerY));
    }
    // Add secondary burst slightly offset
    setTimeout(() => {
        for(let i=0; i<40; i++) {
            particles.push(new Particle(centerX + (Math.random()*100 - 50), centerY + (Math.random()*100 - 50)));
        }
    }, 200);
}

// Animation Loop
function loop() {
    requestAnimationFrame(loop);
    // Clear canvas with trail effect
    ctx.fillStyle = 'rgba(5, 5, 16, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
        if (p.alpha > 0) {
            p.draw();
            p.update();
        } else {
            particles.splice(index, 1);
        }
    });
}
loop();

/* =========================================
   LOGIC: STATIC STARS GENERATOR
   ========================================= */
const starContainer = document.getElementById('starsContainer');
const starCount = 150;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Random positioning
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--duration', `${duration}s`);

    starContainer.appendChild(star);
}
