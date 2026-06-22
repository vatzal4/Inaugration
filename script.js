document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles JS for the background effect
    if (window.particlesJS) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": { "enable": true, "value_area": 800 }
                },
                "color": { "value": "#64ffda" },
                "shape": { "type": "circle" },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#0066ff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    const startBtn = document.getElementById('start-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const treeScreen = document.getElementById('tree-screen');
    const video = document.getElementById('banyan-video');
    const projectNodes = document.getElementById('project-nodes');

    startBtn.addEventListener('click', () => {
        // Unmute the video in case we want sound
        video.muted = false;
        
        // Hide welcome screen
        welcomeScreen.classList.remove('active');
        
        // Show tree screen
        treeScreen.classList.add('active');
        
        // Play video with a slight delay for smooth transition
        setTimeout(() => {
            video.play().catch(error => {
                console.error("Video autoplay failed:", error);
                // Fallback to muted if unmuted autoplay is blocked by browser policy
                video.muted = true;
                video.play();
            });
        }, 800);
    });

    // We can also trigger the nodes slightly before the video ends for a better effect
    // Let's check timeupdate
    let nodesShown = false;
    video.addEventListener('timeupdate', () => {
        // Show nodes 1 second before the video ends, or when it ends
        if (!nodesShown && video.duration > 0 && (video.currentTime >= video.duration - 1.5)) {
            showNodes();
            nodesShown = true;
        }
    });

    // Fallback if timeupdate misses it
    video.addEventListener('ended', () => {
        if (!nodesShown) {
            showNodes();
            nodesShown = true;
        }
    });

    function showNodes() {
        projectNodes.classList.remove('hidden');
        // Small delay before adding visible to allow display:block to apply (if we used it, but we use opacity)
        setTimeout(() => {
            projectNodes.classList.add('visible');
        }, 50);
    }
});
