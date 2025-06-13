document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Overlay
    const loadingOverlay = document.getElementById('loading-overlay');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => loadingOverlay.style.display = 'none', 1000); // Hide after transition
        }, 1000); // Show loading for at least 1 second
    });

    // 2. Smooth Scrolling for Navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    window.scrollToSection = (id) => {
        const targetElement = document.getElementById(id);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - (document.querySelector('header').offsetHeight - 20), // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    };

    // 3. Dynamic Gallery Loading
    const galleryGrid = document.querySelector('.gallery-grid');
    const totalImages = 45;
    const totalVideos = 3;
    // UPDATED landscape image indices based on your specification
    const landscapeImages = [3, 5, 11, 15, 16, 17, 21, 22, 23, 24, 33, 35, 36, 37, 40, 41];

    let galleryItems = [];

    // Add images
    for (let i = 1; i <= totalImages; i++) {
        const isLandscape = landscapeImages.includes(i);
        galleryItems.push({
            type: 'image',
            // Path adjusted for 'Images/' directory
            src: `static/Images/Image${i}.jpeg`,
            alt: `Our Memory ${i}`,
            isLandscape: isLandscape
        });
    }

    // Add videos (TikTok/Instagram Story format means they are vertical, so isLandscape: false is correct)
    for (let i = 1; i <= totalVideos; i++) {
        galleryItems.push({
            type: 'video',
            // Path adjusted for 'videos/' directory (assuming lowercase 'v' based on previous conversation outcome)
            src: `static/videos/video${i}.mp4`,
            alt: `Our Video Memory ${i}`,
            isLandscape: false
        });
    }

    // Shuffle gallery items for a more dynamic look
    galleryItems.sort(() => Math.random() - 0.5);

    galleryItems.forEach((item, index) => {
        const galleryItemDiv = document.createElement('div');
        galleryItemDiv.classList.add('gallery-item');
        if (item.isLandscape) {
            galleryItemDiv.classList.add('landscape');
        }

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            img.loading = 'lazy'; // Lazy load images
            galleryItemDiv.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = false; // Controls only in lightbox
            video.muted = true; // Mute by default for autoplay preview
            video.loop = true; // Loop in preview
            video.preload = 'metadata'; // Load metadata only
            video.setAttribute('playsinline', ''); // For iOS autoplay
            galleryItemDiv.appendChild(video);

            // Play video on hover for preview
            galleryItemDiv.addEventListener('mouseenter', () => video.play().catch(e => console.log("Video preview play blocked:", e)));
            galleryItemDiv.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
        }

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        const icon = document.createElement('span');
        icon.textContent = item.type === 'image' ? '📸' : '▶️';
        overlay.appendChild(icon);
        galleryItemDiv.appendChild(overlay);

        galleryItemDiv.dataset.index = index; // Store original index for lightbox navigation
        galleryGrid.appendChild(galleryItemDiv);
    });

    // 4. Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    galleryGrid.addEventListener('click', (e) => {
        let targetItem = e.target.closest('.gallery-item');
        if (targetItem) {
            currentIndex = parseInt(targetItem.dataset.index);
            openLightbox(currentIndex);
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox(-1));
    nextBtn.addEventListener('click', () => navigateLightbox(1));

    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[currentIndex];
        lightboxContent.innerHTML = ''; // Clear previous content

        if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            lightboxContent.appendChild(img);
        } else if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            // Changed autoplay to be muted by default in lightbox due to browser policies
            video.autoplay = true;
            video.muted = true; // Start muted, user can unmute
            video.loop = true;
            video.setAttribute('playsinline', '');
            lightboxContent.appendChild(video);

            // Add a subtle message to unmute if video is muted on play
            video.addEventListener('play', () => {
                if (video.muted) {
                    const unmuteHint = document.createElement('div');
                    unmuteHint.classList.add('unmute-hint');
                    unmuteHint.textContent = '🔇 Click video for sound';
                    lightboxContent.appendChild(unmuteHint);
                    setTimeout(() => unmuteHint.remove(), 3000); // Remove hint after 3 seconds
                }
            });
        }

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxContent.innerHTML = ''; // Stop video playback by removing element
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    function navigateLightbox(direction) {
        let newIndex = currentIndex + direction;
        if (newIndex < 0) {
            newIndex = galleryItems.length - 1;
        } else if (newIndex >= galleryItems.length) {
            newIndex = 0;
        }
        openLightbox(newIndex);
    }

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    // 5. Scroll Reveal Animations
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => observer.observe(el));


    // 6. Fade-in for Header and Hero Section on load
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100); // Small delay to ensure CSS transition applies
    });

    // 7. Random Cute Popups
    const cuteMessages = [
        "You're the best! 🌟",
        "Thinking of you! 💖",
        "Sending virtual hugs! 🤗",
        "You make my heart happy! 😊",
        "Just a reminder you're awesome! ✨",
        "Smile! It suits you! 😄",
        "So glad you're my friend! 🎉",
        "Have a sparkling day! 💫",
        "You're sunshine incarnate! ☀️",
        "Pure joy, that's what you are! 🥰",
        "Our memories are treasures! 💎",
        "Always here for you! 🤝",
        "You're simply wonderful! 🌸",
        "Making every moment brighter! 🌈"
    ];

    const popupContainer = document.getElementById('cute-popup-container');

    function showRandomPopup() {
        // Only show if the page is scrolled beyond the hero section (optional, makes it less intrusive on load)
        if (window.scrollY < document.getElementById('hero').offsetHeight / 2) {
            return;
        }

        const randomIndex = Math.floor(Math.random() * cuteMessages.length);
        const message = cuteMessages[randomIndex];

        const popup = document.createElement('div');
        popup.classList.add('cute-popup');
        popup.textContent = message;
        popupContainer.appendChild(popup);

        // Remove popup after animation
        setTimeout(() => {
            popup.remove();
        }, 5000); // Matches popup-fade-out animation duration + initial display time
    }

    // Show a random popup every 10-20 seconds
    setInterval(showRandomPopup, Math.random() * (20000 - 10000) + 10000); // Random interval between 10 to 20 seconds
    // No immediate popup on load to avoid overlapping with loading screen/initial intro

    // 8. Floating Background Elements Generation
    const floatingElementsContainer = document.querySelector('.floating-elements-container');
    const numElements = 15; // Number of floating elements (adjust as desired)
    const elementTypes = ['bubble', 'heart'];

    for (let i = 0; i < numElements; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');

        const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];
        if (type === 'heart') {
            element.classList.add('heart');
            element.textContent = '💖'; // Set emoji directly
            element.style.fontSize = `${Math.random() * 1.5 + 1}em`; // Randomize font size
            element.style.animationName = 'float-heart'; // Use specific heart animation
        } else {
            // It's a bubble, CSS handles its background and size
            element.style.width = `${Math.random() * 50 + 20}px`; // Randomize size 20-70px
            element.style.height = element.style.width;
            const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;
            const pastelColors = ['var(--primary-pink)', 'var(--secondary-mint)', 'var(--tertiary-lavender)', 'var(--quaternary-cream)', 'var(--quinary-blue)'];
            element.style.background = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        }


        element.style.left = `${Math.random() * 100}%`; // Random horizontal position
        element.style.animationDuration = `${Math.random() * 10 + 8}s`; // Random duration 8-18s
        element.style.animationDelay = `${Math.random() * 5}s`; // Random delay 0-5s
        element.style.transform = `translateY(${100 + Math.random() * 20}vh)`; // Start off-screen
        element.style.opacity = 0;

        floatingElementsContainer.appendChild(element);
    }
});
