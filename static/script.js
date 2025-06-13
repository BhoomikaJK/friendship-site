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
