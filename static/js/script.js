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
    const landscapeImages = [1, 5, 10, 15, 20, 25, 30, 35, 40, 41, 42, 43, 44, 45]; // Example landscape indices

    let galleryItems = [];

    // Add images
    for (let i = 1; i <= totalImages; i++) {
        const isLandscape = landscapeImages.includes(i);
        galleryItems.push({
            type: 'image',
            src: `static/images/Image${i}.jpeg`,
            alt: `Our Memory ${i}`,
            isLandscape: isLandscape
        });
    }

    // Add videos
    for (let i = 1; i <= totalVideos; i++) {
        galleryItems.push({
            type: 'video',
            src: `static/videos/video${i}.mp4`,
            alt: `Our Video Memory ${i}`,
            isLandscape: false // Assuming videos are vertical/screenshot size
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
            video.muted = true; // Mute by default
            video.loop = true; // Loop in preview
            video.preload = 'metadata'; // Load metadata only
            video.setAttribute('playsinline', ''); // For iOS autoplay
            galleryItemDiv.appendChild(video);

            // Play video on hover for preview
            galleryItemDiv.addEventListener('mouseenter', () => video.play());
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
            video.autoplay = true; // Autoplay in lightbox
            video.loop = true;
            video.muted = false; // Unmute in lightbox
            video.setAttribute('playsinline', '');
            lightboxContent.appendChild(video);
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
        "You're the best!",
        "Thinking of you! 💖",
        "Sending virtual hugs!",
        "You make my heart happy! 😊",
        "Just a reminder you're awesome!",
        "Smile! It suits you! 😄",
        "So glad you're my friend!",
        "Have a sparkling day! ✨",
        "You're sunshine incarnate! ☀️",
        "Pure joy, that's what you are!"
    ];

    const popupContainer = document.getElementById('cute-popup-container');

    function showRandomPopup() {
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
    showRandomPopup(); // Show one immediately on load
});
