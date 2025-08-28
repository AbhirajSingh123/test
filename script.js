document.addEventListener('DOMContentLoaded', function() {
    // --- Smooth scroll for navigation (optional, Bootstrap 5 handles this natively if using data-bs-scrollspy) ---
    document.querySelectorAll('.navbar-nav .nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if it's an internal link
            if (this.hostname === window.location.hostname && this.pathname === window.location.pathname && this.hash.length > 0) {
                // Optional: Close navbar on mobile click
                const navbarCollapse = document.getElementById('navbarNav');
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });

    // --- Fade-in on scroll for sections ---
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    // --- Dynamic Homepage Content Loading ---

    // 1. Dynamic Image Slider
    const carouselInner = document.querySelector('#carouselExampleCaptions .carousel-inner');
    const carouselIndicators = document.querySelector('#carouselExampleCaptions .carousel-indicators');
    const storedSliderImages = JSON.parse(localStorage.getItem('sliderImages')) || [];

    if (storedSliderImages.length > 0) {
        carouselInner.innerHTML = ''; // Clear existing hardcoded items
        carouselIndicators.innerHTML = ''; // Clear existing hardcoded indicators

        storedSliderImages.forEach((imageUrl, index) => {
            const isActive = index === 0 ? ' active' : '';

            // Add carousel item
            carouselInner.innerHTML += `
                <div class="carousel-item${isActive}">
                    <img src="${imageUrl}" class="d-block w-100" alt="Coaching Center Activity ${index + 1}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>Empowering Minds</h5>
                        <p>Join our programs and unlock your full potential.</p>
                    </div>
                </div>
            `;
            // Add indicator button
            carouselIndicators.innerHTML += `
                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}" class="${isActive}" aria-current="${isActive ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>
            `;
        });
    }
    // Initialize Bootstrap Carousel after content is loaded
    const heroCarousel = document.getElementById('carouselExampleCaptions');
    if (heroCarousel) {
        new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            wrap: true
        });
    }


    // 2. Dynamic Testimonial Carousel
    const testimonialCarouselInner = document.querySelector('#testimonialCarousel .carousel-inner');
    const storedTestimonials = JSON.parse(localStorage.getItem('testimonials')) || [];

    if (storedTestimonials.length > 0) {
        testimonialCarouselInner.innerHTML = ''; // Clear existing hardcoded items

        storedTestimonials.forEach((testimonial, index) => {
            const isActive = index === 0 ? ' active' : '';
            testimonialCarouselInner.innerHTML += `
                <div class="carousel-item${isActive}">
                    <div class="testimonial-card text-center">
                        <p class="lead fst-italic">"${testimonial.text}"</p>
                        <footer class="blockquote-footer mt-2">${testimonial.author}, <cite title="Source Title">${testimonial.source}</cite></footer>
                    </div>
                </div>
            `;
        });
    }
    // Initialize Bootstrap Carousel after content is loaded
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        new bootstrap.Carousel(testimonialCarousel, {
            interval: 7000,
            wrap: true
        });
    }
});