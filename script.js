/* ============================================
   GEDDAM FARMS ESTATE - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // PRELOADER
    // ============================================
    const preloader = document.getElementById('preloader');

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // Prevent scrolling while preloader is visible
    document.body.style.overflow = 'hidden';

    // Hide preloader after animation completes
    setTimeout(hidePreloader, 2200);

    // Fallback: hide preloader on window load
    window.addEventListener('load', function () {
        setTimeout(hidePreloader, 500);
    });

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function () {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinkElements.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(function (stat) {
            const target = parseFloat(stat.getAttribute('data-count'));
            const isDecimal = stat.getAttribute('data-decimal') === 'true';
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = target * easeOut;

                if (isDecimal) {
                    stat.textContent = current.toFixed(current < 10 ? 2 : 1);
                } else {
                    stat.textContent = Math.round(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isDecimal) {
                        stat.textContent = target.toFixed(target < 10 ? 2 : 1);
                    } else {
                        stat.textContent = target;
                    }
                }
            }

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    }

    // Trigger counter animation when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

    // ============================================
    // SCROLL ANIMATIONS (IntersectionObserver)
    // ============================================
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(function (el) {
        scrollObserver.observe(el);
    });

    // ============================================
    // AMENITIES TABS
    // ============================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const targetTab = btn.getAttribute('data-tab');

            // Update active button
            tabButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            // Update active panel
            tabPanels.forEach(function (panel) { panel.classList.remove('active'); });
            var targetPanel = document.getElementById('tab-' + targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function () {
                var isActive = item.classList.contains('active');

                // Close all items
                faqItems.forEach(function (i) { i.classList.remove('active'); });

                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ============================================
    // TESTIMONIAL CAROUSEL
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentTestimonial = 0;
    let autoRotateInterval;

    function showTestimonial(index) {
        // Wrap around
        if (index < 0) index = testimonialCards.length - 1;
        if (index >= testimonialCards.length) index = 0;

        testimonialCards.forEach(function (card) {
            card.classList.remove('active');
        });

        dots.forEach(function (dot) {
            dot.classList.remove('active');
        });

        testimonialCards[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentTestimonial = index;
    }

    function nextTestimonialFn() {
        showTestimonial(currentTestimonial + 1);
    }

    function prevTestimonialFn() {
        showTestimonial(currentTestimonial - 1);
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(nextTestimonialFn, 5000);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            stopAutoRotate();
            nextTestimonialFn();
            startAutoRotate();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            stopAutoRotate();
            prevTestimonialFn();
            startAutoRotate();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            stopAutoRotate();
            showTestimonial(index);
            startAutoRotate();
        });
    });

    // Start auto-rotate
    if (testimonialCards.length > 0) {
        startAutoRotate();
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.getElementById('backToTop');

    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        window.addEventListener('scroll', handleBackToTop);

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // CONTACT FORM HANDLER
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var firstName = document.getElementById('firstName').value;
            var lastName = document.getElementById('lastName').value;
            var checkIn = document.getElementById('checkIn').value;
            var checkOut = document.getElementById('checkOut').value;
            var guests = document.getElementById('guests').value;

            if (!firstName || !lastName || !checkIn || !checkOut || !guests) {
                alert('Please fill in all required fields.');
                return;
            }

            // Check that check-out is after check-in
            if (new Date(checkOut) <= new Date(checkIn)) {
                alert('Check-out date must be after check-in date.');
                return;
            }

            // Simulate form submission
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;

            setTimeout(function () {
                alert('Thank you, ' + firstName + '! Your inquiry has been submitted. We\'ll get back to you within 24 hours with availability and pricing.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = navbar.offsetHeight + 20;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // GALLERY SHOW MORE
    // ============================================
    var showMoreBtn = document.getElementById('showMoreGallery');
    var galleryGrid = document.getElementById('galleryGrid');

    if (showMoreBtn && galleryGrid) {
        showMoreBtn.addEventListener('click', function () {
            var isExpanded = galleryGrid.classList.contains('show-all');
            galleryGrid.classList.toggle('show-all');
            showMoreBtn.classList.toggle('expanded');

            if (isExpanded) {
                showMoreBtn.querySelector('span').textContent = 'Show More Photos';
                galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                showMoreBtn.querySelector('span').textContent = 'Show Less';
            }
        });
    }

});