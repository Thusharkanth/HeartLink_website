/**
 * HEARTLINK CREATIONS - WEBSITE INTERACTIVE ENGINE
 * Author: Antigravity AI
 * Stitch Design System Revision
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 1. HEADER SCROLL & ACTIVE LINK NAVIGATION STATE
  // ==========================================================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  function handleScroll() {
    // Header scroll background toggle
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting on scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately to set initial state


  // ==========================================================================
  // 2. MOBILE HAMBURGER MENU DRAWER
  // ==========================================================================
  const navHamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileNav() {
    mobileNav.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = ''; // Unlock scrolling
  }

  navHamburger.addEventListener('click', openMobileNav);
  mobileNavClose.addEventListener('click', closeMobileNav);
  mobileOverlay.addEventListener('click', closeMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });


  // ==========================================================================
  // 3. SCROLL FADE-IN ANIMATION (INTERSECTION OBSERVER)
  // ==========================================================================
  const fadeSections = document.querySelectorAll('.fade-in-section');

  const observerOptions = {
    root: null, // use viewport
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% visible
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Animate once only
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    sectionObserver.observe(section);
  });



  // ==========================================================================
  // 5. AUTO-SLIDING CAROUSEL ENGINE WITH SWIPE SUPPORT
  // ==========================================================================
  const track = document.getElementById('carouselTrack');
  const viewport = document.getElementById('carouselViewport');
  const slides = Array.from(track.children);
  const nextBtn = document.getElementById('carouselNext');
  const prevBtn = document.getElementById('carouselPrev');
  const dotsContainer = document.getElementById('carouselDots');
  const dots = Array.from(dotsContainer.children);

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;
  let autoPlayInterval;

  function updateCarousel() {
    // Move track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active slide class (triggers scale/opacity transitions)
    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active pagination dot
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Click Listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  // Dots Pagination Click Listeners
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
      resetAutoPlay();
    });
  });

  // Touch & Swipe Event Handlers for Mobile Devices
  if (viewport) {
    viewport.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoPlayInterval);
    });

    viewport.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      // Prevent default bounce scroll on heavy horizontal swipes
      if (Math.abs(diff) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      // Minimum swipe threshold of 50px
      if (diff > 50) {
        nextSlide();
      } else if (diff < -50) {
        prevSlide();
      }
      
      startAutoPlay();
    });

    // Mouse Drag Event Handlers for Desktop (adds a premium touch-feel)
    viewport.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      clearInterval(autoPlayInterval);
      viewport.style.cursor = 'grabbing';
    });

    viewport.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      viewport.style.cursor = 'grab';
      const endX = e.clientX;
      const diff = startX - endX;

      if (diff > 50) {
        nextSlide();
      } else if (diff < -50) {
        prevSlide();
      }
      
      startAutoPlay();
    });

    viewport.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        viewport.style.cursor = 'grab';
        startAutoPlay();
      }
    });
  }

  // Initialize Carousel
  updateCarousel();
  startAutoPlay();

});
