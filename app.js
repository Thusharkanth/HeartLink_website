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
  // 3. SCROLL FADE-IN ANIMATION & METRICS COUNTER
  // ==========================================================================
  const fadeSections = document.querySelectorAll('.fade-in-section');

  const observerOptions = {
    root: null, // use viewport
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% visible
  };

  // Helper for metrics counter animation
  function animateMetrics() {
    const metricNumbers = document.querySelectorAll('.metric-number');
    metricNumbers.forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return; // Skip if no number (e.g. "Islandwide")
      
      const target = parseInt(match[1], 10);
      const suffix = match[2];
      
      const duration = 1500; // 1.5s
      const startTime = performance.now();
      
      function updateCount(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutCubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        
        el.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target + suffix;
        }
      }
      
      requestAnimationFrame(updateCount);
    });
  }

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        // If the target is the metrics section, trigger counting animation
        if (entry.target.classList.contains('metrics')) {
          animateMetrics();
        }
        
        observer.unobserve(entry.target); // Animate once only
      }
    });
  }, observerOptions);

  fadeSections.forEach(section => {
    sectionObserver.observe(section);
  });



  // ==========================================================================
  // 5. ROTATIONAL STACKED CARD EXPERIENCE - COLLECTIONS
  // ==========================================================================
  
  class StackedCardController {
    constructor(stackId, autoProgressInterval = 6000) {
      this.stack = document.getElementById(stackId);
      if (!this.stack) return;
      
      this.cards = Array.from(this.stack.querySelectorAll('.stack-card'));
      if (this.cards.length === 0) return;
      
      // Initialize card order array (e.g. [0, 1, 2, 3, 4, 5])
      this.cardOrder = this.cards.map((_, index) => index);
      this.isTransitioning = false;
      this.stackInterval = null;
      this.autoProgressInterval = autoProgressInterval;
      
      this.init();
    }
    
    init() {
      // 1. Set initial levels
      this.updateStackClasses();
      
      // 2. Add click listeners to cards
      this.cards.forEach(card => {
        card.addEventListener('click', () => {
          if (card.classList.contains('level-0')) {
            this.progressStack();
            this.resetStackInterval();
          }
        });
      });
      
      // 3. Start auto-progression
      this.startStackInterval();
    }
    
    removeLevelClasses(card) {
      // Helper to dynamically remove all level-X classes
      const classesToRemove = [];
      card.classList.forEach(cls => {
        if (cls.startsWith('level-')) {
          classesToRemove.push(cls);
        }
      });
      classesToRemove.forEach(cls => card.classList.remove(cls));
    }
    
    updateStackClasses() {
      this.cards.forEach((card, index) => {
        const orderIndex = this.cardOrder.indexOf(index);
        
        this.removeLevelClasses(card);
        
        if (orderIndex !== -1) {
          card.classList.add(`level-${orderIndex}`);
        }
      });
    }
    
    progressStack() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      
      const activeIndex = this.cardOrder[0];
      const activeCard = this.cards[activeIndex];
      
      // Slide active card out of view slightly (keep on top)
      activeCard.classList.add('animating-out');
      
      // Shift indices to bring next card to active
      const oldActive = this.cardOrder.shift();
      
      // Update levels of other cards immediately (they scale up simultaneously)
      this.cards.forEach((card, index) => {
        const orderIndex = this.cardOrder.indexOf(index);
        if (orderIndex !== -1) {
          this.removeLevelClasses(card);
          card.classList.add(`level-${orderIndex}`);
        }
      });
      
      // After 250ms (peak of swipe-out), move the old active card to the bottom level (slides back behind)
      setTimeout(() => {
        this.cardOrder.push(oldActive);
        
        this.removeLevelClasses(activeCard);
        activeCard.classList.remove('animating-out');
        
        // Update its class to the bottom level index
        const bottomLevelIndex = this.cards.length - 1;
        activeCard.classList.add(`level-${bottomLevelIndex}`);
      }, 250);
      
      // Unlock transition after the entire animation completes (600ms)
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    }
    
    startStackInterval() {
      this.stackInterval = setInterval(() => this.progressStack(), this.autoProgressInterval);
    }
    
    resetStackInterval() {
      clearInterval(this.stackInterval);
      this.startStackInterval();
    }
  }

  // Initialize controllers for the 4 sections
  new StackedCardController('bouquetsStack');
  new StackedCardController('giftsStack');
  new StackedCardController('jimmikisStack');
  new StackedCardController('cakesStack');

});
