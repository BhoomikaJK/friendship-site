// Smooth scroll effect for anchor links (if any)
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn.interactive-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Ripple effect handled by CSS :active:after
            // Additional animations or logic can be added here if desired
        });
    });

    // Optional: Add scroll animation for gallery photos/videos
    const mediaItems = document.querySelectorAll('.photo-container, .media-video');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    mediaItems.forEach(item => {
        observer.observe(item);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn.interactive-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Ripple effect handled by CSS :active:after
        });
    });

    // Scroll animations for gallery items
    const mediaItems = document.querySelectorAll('.photo-container, .media-video');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    mediaItems.forEach(item => {
        observer.observe(item);
    });

    // --- Random pop-up messages ---

    const popupContainer = document.getElementById('popup-container');

    const messages = [
        "You're EPIC, Amorè! 💖",
        "6 km walk for Texs? Legendary! 🚶‍♀️✨",
        "Forever friends, forever EPIC! 🌸",
        "Amorè, you light up my phone and heart! 📱💫",
        "Walking, laughing, loving — besties always! 🥰",
        "Here's to 8 years of EPIC friendship! 🎉",
        "You + Me = EPIC Duo! 💕",
        "Never found Texs, but found a treasure in you! 💎"
    ];

    function showPopup() {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const popup = document.createElement('div');
        popup.className = 'popup-message';
        popup.textContent = msg;
        popupContainer.appendChild(popup);

        // Remove popup after animation completes (5s)
        setTimeout(() => {
            popup.remove();
        }, 5000);
    }

    // Show a popup every 15-25 seconds randomly
    setInterval(() => {
        showPopup();
    }, 15000 + Math.random() * 10000);

    // --- Floating kawaii icons ---

    const icons = [
        '🌸', '✨', '💖', '🎀', '🐰', '🍥' // cherry blossom, sparkle, heart, ribbon, bunny, fish cake (kawaii)
    ];

    function createFloatingIcon() {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];

        // Random horizontal position
        icon.style.left = Math.random() * (window.innerWidth - 40) + 'px';

        // Random animation delay for natural effect
        icon.style.animationDelay = (Math.random() * 6) + 's';

        document.body.appendChild(icon);

        // Remove icon after 20 seconds to avoid clutter
        setTimeout(() => {
            icon.remove();
        }, 20000);
    }

    // Create a floating icon every 5 seconds
    setInterval(() => {
        createFloatingIcon();
    }, 5000);
});
