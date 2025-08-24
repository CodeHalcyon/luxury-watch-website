// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Global variables for preloader
const preloaderWords = [
    "Precision.",
    "Heritage.",
    "Legacy.",
    "Artistry.",
    "Timeless."
];

// Preloader Animation
function preloaderAnimation() {
    const preloader = document.getElementById("preloader");
    const preloaderBrand = preloader.querySelector(".preloader-brand");
    const preloaderDynamicText = preloader.querySelector(".preloader-dynamic-text");
    const header = document.querySelector("header");
    const main = document.querySelector("main");

    // Initially hide main content and header to prevent FOUC
    gsap.set([header, main], { opacity: 0 });
    gsap.set(preloaderDynamicText, { opacity: 0 }); // Ensure dynamic text is hidden initially

    const tlPreloader = gsap.timeline({
        onComplete: () => {
            gsap.set(preloader, { display: "none", pointerEvents: "none" });
            // Call main content load animation after preloader is done
            mainContentLoadAnimation();
        }
    });

    // 1. Brand name animation
    tlPreloader.from(preloaderBrand, { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" });

    // 2. Dynamic words animation (fade in/out)
    preloaderWords.forEach((word, index) => {
        tlPreloader.to(preloaderDynamicText, { 
            opacity: 0, 
            duration: 0.3, 
            ease: "power2.in", 
            onComplete: () => {
                preloaderDynamicText.textContent = word;
            }
        }, index === 0 ? "+=0.5" : "<0.1"); // Start first word after brand, subsequent words slightly before previous fades out
        tlPreloader.to(preloaderDynamicText, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        });
        tlPreloader.to(preloaderDynamicText, {
            opacity: 0,
            duration: 0.5,
            delay: 0.8, // Hold time for each word
            ease: "power2.in"
        });
    });

    // 3. Fade out brand and preloader
    // Ensure brand fades out after the last word has faded out
    tlPreloader.to(preloaderBrand, { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, "-=0.5"); // Fade out brand while last word is fading out
    tlPreloader.to(preloader, { opacity: 0, duration: 1.5, ease: "power3.inOut" }, "-=0.8"); // Fade out preloader after words are done
}

// Main Content Load Animation
function mainContentLoadAnimation() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    const header = document.querySelector("header");
    const main = document.querySelector("main");

    // Animate header and main content to visible state
    tl.fromTo(header, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 0) // Header slides down and fades in
      .to(main, { opacity: 1, duration: 1.2, ease: "power3.out" }, 0); // Main content fades in

    // Split hero subtitle into words for individual animation
    const heroSubtitle = document.querySelector(".hero-subtitle");
    const subtitleWords = heroSubtitle.textContent.split(" ").map(word => `<span style="display: inline-block;">${word}</span>`).join(" ");
    heroSubtitle.innerHTML = subtitleWords;
    const subtitleSpans = heroSubtitle.querySelectorAll("span");

    tl.set(".hero-parallax-bg", { scale: 1.2, filter: "blur(10px)", opacity: 0.5 }, 0) // Initial state for background
      .to(".hero-parallax-bg", { scale: 1, filter: "blur(0px)", opacity: 1, duration: 2.5, ease: "power4.out" }, 0) // Background zooms out and unblurs

      .from(".hero-title-word:first-child", { opacity: 0, y: 100, rotationX: -90, transformOrigin: "center bottom", duration: 1.8, ease: "power4.out" }, 1) // "Time," slides up and rotates
      .from(".hero-title-word:last-child", { opacity: 0, y: 100, rotationX: -90, transformOrigin: "center bottom", duration: 1.8, ease: "power4.out" }, 1.4) // "Reimagined." slides up and rotates slightly later

      .from(subtitleSpans, { opacity: 0, y: 30, stagger: 0.08, duration: 0.8, ease: "power3.out" }, 2.2) // Subtitle words fade and slide up with stagger
      .from(".hero-cta", { opacity: 0, y: 50, scale: 0.8, duration: 1.2, ease: "back.out(1.7)" }, 2.8); // CTA scales and slides up
}

// Parallax for Hero Image
function setupHeroParallax() {
    gsap.to(".hero-parallax-bg", {
        yPercent: 20, // Move background 20% up relative to its height
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

// Scroll-triggered reveals for sections
function setupSectionReveals() {
    document.querySelectorAll(".reveal-section").forEach((section) => {
        const elementsToReveal = section.querySelectorAll(".reveal-text, .reveal-image, .reveal-cta");

        if (section.id === "collections") {
            // For elements within #collections, ensure they are visible by default
            // as they won't be animated by ScrollTrigger.
            gsap.set(elementsToReveal, { opacity: 1, y: 0 }); // Set to final state
            return; // Skip ScrollTrigger for this section
        }

        // For other sections, set initial state for animation
        gsap.set(elementsToReveal, { opacity: 0, y: 50 }); // Set initial state for elements that WILL be animated

        if (elementsToReveal.length > 0) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom top",
                    toggleActions: "play none none none"
                }
            })
            .to(elementsToReveal, { // Changed from .from to .to because initial state is set above
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power3.out"
            });
        }
    });
}

// Collection Item Hover Micro-interactions
function setupCollectionItemHovers() {
    document.querySelectorAll(".collection-item").forEach(item => {
        const imageWrapper = item.querySelector(".collection-image-wrapper");
        const image = item.querySelector(".collection-image-wrapper img");
        const button = item.querySelector("button");

        // Get current theme's accent and background colors dynamically
        const getAccentColor = () => getComputedStyle(document.documentElement).getPropertyValue(document.body.getAttribute("data-theme") === "dark" ? "--color-accent-dark" : "--color-accent-light").trim();
        const getBgColor = () => getComputedStyle(document.documentElement).getPropertyValue(document.body.getAttribute("data-theme") === "dark" ? "--color-bg-dark" : "--color-bg-light").trim();
        const getHoverShadow = () => document.body.getAttribute("data-theme") === "dark" ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.1)"; // Slightly stronger hover shadow

        // Hover for the image container
        if (imageWrapper) {
            item.addEventListener("mouseenter", () => {
                gsap.to(imageWrapper, {
                    boxShadow: getHoverShadow(),
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true
                });
                gsap.to(image, {
                    scale: 1.05,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            item.addEventListener("mouseleave", () => {
                gsap.to(imageWrapper, {
                    clearProps: "boxShadow", // Revert to CSS defined shadow
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true
                });
                gsap.to(image, {
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        }

        // Hover for the button (existing logic)
        if (button) {
            button.addEventListener("mouseenter", () => {
                gsap.to(button, {
                    backgroundColor: getAccentColor(),
                    color: getBgColor(),
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            button.addEventListener("mouseleave", () => {
                gsap.to(button, {
                    backgroundColor: "transparent",
                    color: getAccentColor(),
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        }
    });
}

// Category Tabs Interaction
function setupCategoryTabs() {
    const categoryTabs = document.querySelectorAll(".category-tab");
    const categoryGrids = document.querySelectorAll(".category-grid");

    function showCategory(targetCategory, animate = true) { // Added 'animate' parameter
        // Hide all grids
        categoryGrids.forEach(grid => {
            if (grid.classList.contains("active-category")) {
                if (animate) {
                    gsap.to(grid, { opacity: 0, duration: 0.3, onComplete: () => {
                        grid.classList.add("hidden");
                        grid.classList.remove("active-category");
                        gsap.set(grid, { clearProps: "display,opacity" }); // Clear GSAP inline styles
                    }});
                } else {
                    gsap.set(grid, { opacity: 0, display: "none" });
                    grid.classList.add("hidden");
                    grid.classList.remove("active-category");
                }
            } else if (!grid.classList.contains("hidden")) { // If it's visible but not active, just hide it
                gsap.set(grid, { opacity: 0, display: "none" });
                grid.classList.add("hidden");
                grid.classList.remove("active-category");
            }
        });

        // Show the target grid
        const newActiveGrid = document.getElementById(targetCategory);
        if (newActiveGrid) {
            newActiveGrid.classList.remove("hidden"); // Remove Tailwind's hidden class first
            newActiveGrid.classList.add("active-category");
            if (animate) {
                gsap.fromTo(newActiveGrid, { opacity: 0, display: "block" }, { opacity: 1, duration: 0.5, ease: "power3.out", onComplete: () => {
                    ScrollTrigger.refresh();
                    setupCollectionItemHovers();
                }});
            } else {
                gsap.set(newActiveGrid, { opacity: 1, display: "block" }); // Set immediately for no animation
                ScrollTrigger.refresh();
                setupCollectionItemHovers();
            }
        }

        // Update active tab styling
        categoryTabs.forEach(t => t.classList.remove("active-tab"));
        const activeTabButton = document.querySelector(`.category-tab[data-category="${targetCategory}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add("active-tab");
        }
    }

    // Initial display: find the active tab from HTML, or default to the first one
    const initialActiveTabButton = document.querySelector(".category-tab.active-tab");
    if (initialActiveTabButton) {
        showCategory(initialActiveTabButton.dataset.category, false); // Initial load, no animation
    } else if (categoryTabs.length > 0) {
        // If no active-tab in HTML, default to the first one
        categoryTabs[0].classList.add("active-tab");
        showCategory(categoryTabs[0].dataset.category, false); // Initial load, no animation
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const targetCategory = tab.dataset.category;
            showCategory(targetCategory, true); // Subsequent clicks, animate
        });
    });
}

// Testimonial Slider
function setupTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentIndex = 0;
    let autoSlideInterval;

    function showSlide(index) {
        gsap.to(slides, { opacity: 0, duration: 0.5, onComplete: () => {
            slides.forEach((slide, i) => {
                slide.classList.add('hidden');
                if (i === index) {
                    slide.classList.remove('hidden');
                }
            });
            gsap.fromTo(slides[index], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
        }});

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
        currentIndex = index;
    }

    function nextSlide() {
        let newIndex = (currentIndex + 1) % slides.length;
        showSlide(newIndex);
    }

    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(nextSlide, 7000); // Change slide every 7 seconds
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Initial setup
    showSlide(0);
    startAutoSlide();

    // Pause auto-slide on hover over the slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            showSlide(index);
            stopAutoSlide(); // Stop auto-slide on manual interaction
            startAutoSlide(); // Restart after a short delay
        });
    });
}

// Dark/Light Mode Toggle
function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Set initial icon based on current theme
    function updateToggleIcon() {
        if (body.getAttribute("data-theme") === "dark") {
            themeToggle.innerHTML = `
                <svg class="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
            `; // Moon icon for dark mode
        } else {
            themeToggle.innerHTML = `
                <svg class="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1M3 12H2m15.325-4.275l.707-.707M6.707 17.293l-.707.707M18.707 6.707l.707-.707M5.293 18.707l-.707.707M12 18a6 6 0 100-12 6 6 0 000 12z"></path>
                </svg>
            `; // Sun icon for light mode
        }
    }

    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateToggleIcon();
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        body.setAttribute("data-theme", savedTheme);
    }
    updateToggleIcon(); // Set initial icon
}

// Mobile Navigation
function setupMobileNav() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const closeMobileNavButton = document.getElementById("close-mobile-nav");
    const mobileNav = document.getElementById("mobile-nav");
    const mobileNavLinks = mobileNav.querySelectorAll(".mobile-nav-link");

    // Initial state for GSAP
    gsap.set(mobileNav, { xPercent: 100, display: "none" }); // Ensure it's hidden by default

    function openMobileNav() {
        mobileNav.classList.remove("hidden"); // Remove Tailwind's hidden class
        document.body.style.overflow = "hidden"; // Prevent scrolling body
        gsap.fromTo(mobileNav,
            { xPercent: 100, display: "none" }, // Start off-screen and hidden
            {
                xPercent: 0,
                display: "flex", // Make it flex when animating in
                duration: 0.6,
                ease: "power3.inOut",
                onComplete: () => {
                    // Animate links in
                    gsap.from(mobileNavLinks, {
                        opacity: 0,
                        y: 20,
                        stagger: 0.1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            }
        );
    }

    function closeMobileNav() {
        document.body.style.overflow = ""; // Restore body scrolling
        gsap.to(mobileNavLinks, { opacity: 0, y: -20, stagger: 0.05, duration: 0.3, ease: "power2.in" });
        gsap.to(mobileNav, {
            xPercent: 100,
            delay: 0.2, // Delay closing the menu slightly after links fade out
            duration: 0.6,
            ease: "power3.inOut",
            onComplete: () => {
                mobileNav.classList.add("hidden"); // Add Tailwind's hidden back
                gsap.set(mobileNav, { display: "none" }); // Explicitly set display to none
                gsap.set(mobileNavLinks, { clearProps: "opacity,y" }); // Clear GSAP inline styles
            }
        });
    }

    mobileMenuButton.addEventListener("click", openMobileNav);
    closeMobileNavButton.addEventListener("click", closeMobileNav);
    mobileNavLinks.forEach(link => {
        link.addEventListener("click", closeMobileNav); // Close menu when a link is clicked
    });
}

// Initialize all animations and interactions on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.globalTimeline.clear();
        gsap.globalTimeline.pause();
        document.body.classList.add("no-transition");
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());

        // Skip preloader, show content immediately
        document.getElementById("preloader").style.display = "none";
        gsap.set(document.querySelector("header"), { opacity: 1, yPercent: 0 }); // Ensure header is fully visible and in place
        gsap.set(document.querySelector("main"), { opacity: 1 }); // Ensure main content is fully visible

        // Set all animatable elements to their final visible state
        gsap.set(".hero-parallax-bg", { scale: 1, filter: "blur(0px)", opacity: 1 });
        gsap.set(".hero-title-word", { opacity: 1, y: 0, rotationX: 0 });

        // Manually split subtitle and set to final state for reduced motion
        const heroSubtitle = document.querySelector(".hero-subtitle");
        const subtitleWords = heroSubtitle.textContent.split(" ").map(word => `<span style="display: inline-block;">${word}</span>`).join(" ");
        heroSubtitle.innerHTML = subtitleWords;
        const subtitleSpans = heroSubtitle.querySelectorAll("span");
        gsap.set(subtitleSpans, { opacity: 1, y: 0 });

        gsap.set(".hero-cta", { opacity: 1, scale: 1 });

        // Set all reveal elements to their final state
        gsap.set(".reveal-text, .reveal-image, .reveal-cta", { opacity: 1, y: 0, scale: 1, rotation: 0 });

        // Ensure initial category is visible for reduced motion (handled by setupCategoryTabs, but explicit set here for safety)
        const initialActiveTabButton = document.querySelector(".category-tab.active-tab");
        if (initialActiveTabButton) {
            const initialCategory = initialActiveTabButton.dataset.category;
            const initialGrid = document.getElementById(initialCategory);
            if (initialGrid) {
                document.querySelectorAll(".category-grid").forEach(grid => {
                    grid.classList.add("hidden");
                    gsap.set(grid, { display: "none", opacity: 0 });
                });
                initialGrid.classList.remove("hidden");
                initialGrid.classList.add("active-category");
                gsap.set(initialGrid, { opacity: 1, display: "block" });
            }
        } else { // If no active-tab in HTML, default to the first one for reduced motion
            const categoryTabs = document.querySelectorAll(".category-tab");
            if (categoryTabs.length > 0) {
                const firstTabCategory = categoryTabs[0].dataset.category;
                const firstGrid = document.getElementById(firstTabCategory);
                if (firstGrid) {
                    document.querySelectorAll(".category-grid").forEach(grid => {
                        grid.classList.add("hidden");
                        gsap.set(grid, { display: "none", opacity: 0 });
                    });
                    categoryTabs[0].classList.add("active-tab");
                    firstGrid.classList.remove("hidden");
                    firstGrid.classList.add("active-category");
                    gsap.set(firstGrid, { opacity: 1, display: "block" });
                }
            }
        }

        // For mobile nav: ensure it's in its final state if it were to be open
        const mobileNav = document.getElementById("mobile-nav");
        if (mobileNav) {
            // In reduced motion, we don't animate, so we just toggle the hidden class
            // and manage overflow directly.
            gsap.set(mobileNav, { xPercent: 0, opacity: 1, display: "flex" }); // Set to fully open state for reduced motion
            mobileNav.classList.add("hidden"); // Start hidden, will be toggled
            const mobileNavLinks = mobileNav.querySelectorAll(".mobile-nav-link");
            gsap.set(mobileNavLinks, { opacity: 1, y: 0 }); // Set links to visible

            // Override mobile nav functions for reduced motion
            const mobileMenuButton = document.getElementById("mobile-menu-button");
            const closeMobileNavButton = document.getElementById("close-mobile-nav");
            if (mobileMenuButton && mobileNav) {
                mobileMenuButton.addEventListener("click", () => {
                    mobileNav.classList.toggle("hidden");
                    mobileNav.style.display = mobileNav.classList.contains("hidden") ? "none" : "flex"; // Explicitly set display
                    document.body.style.overflow = mobileNav.classList.contains("hidden") ? "" : "hidden";
                });
                closeMobileNavButton.addEventListener("click", () => {
                    mobileNav.classList.add("hidden");
                    mobileNav.style.display = "none"; // Explicitly set display
                    document.body.style.overflow = "";
                });
                mobileNav.querySelectorAll(".mobile-nav-link").forEach(link => {
                    link.addEventListener("click", () => {
                        mobileNav.classList.add("hidden");
                        mobileNav.style.display = "none"; // Explicitly set display
                        document.body.style.overflow = "";
                    });
                });
            }
        }

    } else {
        preloaderAnimation(); // Start preloader animation
    }

    // These should always be set up, even if animations are reduced
    setupHeroParallax();
    setupSectionReveals();
    setupCollectionItemHovers();
    setupCategoryTabs();
    setupTestimonialSlider();
    setupThemeToggle();
    setupMobileNav(); // Initialize mobile navigation
});
