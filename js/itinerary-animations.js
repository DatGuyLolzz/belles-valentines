document.addEventListener('DOMContentLoaded', function () {
    createConfetti();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);

        // Face cursor effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect(); // Target the ITEM not the EMOJI
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            // Limit rotation to avoid extreme spinning
            const angleX = -deltaY / 10; // Tilt up/down
            const angleY = deltaX / 10;  // Tilt left/right

            // Apply 3D tilt effect or 2D rotation? "Face my cursor" usually means 2D rotation if it's a flat emoji.
            // But CSS rotate(deg) rotates the whole element.
            // Let's do a subtle 3D tilt which looks cooler and "faces" the cursor.
            // CSS `transform: perspective(500px) rotateX(...) rotateY(...)`

            // Apply to the WHOLE item (card)
            item.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            item.style.zIndex = 10;
            item.style.transition = 'transform 0.1s ease-out';
        });

        item.addEventListener('mouseleave', () => {
            // Reset
            item.style.transform = '';
            item.style.zIndex = 1;
            item.style.transition = 'transform 0.5s ease';
        });
    });
});
