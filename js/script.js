/**
 * ═════════════════════════════════════════════════════════════════════
 * NADA IBRAHIM FATHY — DEVELOPER PORTFOLIO
 * Full-Stack .NET Developer
 * JavaScript Interactions & Dynamic Behaviors
 * ═════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* -------------------------------------------------------------------
     1. THEME MANAGER (DARK / LIGHT MODE)
     Default: Dark Mode
     ------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Initialize theme: Check localStorage, fallback to 'dark'
  const savedTheme = localStorage.getItem('nada_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('nada_portfolio_theme', newTheme);
    });
  }

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      );
    }
  }

  /* -------------------------------------------------------------------
     2. STICKY HEADER & SCROLL BEHAVIOR
     ------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow toggle
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  /* -------------------------------------------------------------------
     3. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isCurrentlyOpen = mobileDrawer.classList.contains('open');
      if (isCurrentlyOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking any nav link
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside of the drawer
    document.addEventListener('click', (event) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        closeMobileNav();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });
  }

  function openMobileNav() {
    mobileDrawer.classList.add('open');
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMobileNav() {
    mobileDrawer.classList.remove('open');
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  /* -------------------------------------------------------------------
     4. SCROLL SPY & ACTIVE NAV LINK HIGHLIGHTING
     ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavOnScroll() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Desktop Links
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mobile Links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll, { passive: true });
  updateActiveNavOnScroll(); // Initial invocation

  /* -------------------------------------------------------------------
     5. SCROLL-BASED REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ------------------------------------------------------------------- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Unobserve once animated
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback for browsers lacking IntersectionObserver support
    animatedElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }

  /* -------------------------------------------------------------------
     6. SMOOTH SCROLLING FOR INTERNAL LINKS
     ------------------------------------------------------------------- */
  const internalAnchorLinks = document.querySelectorAll('a[href^="#"]');

  internalAnchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return; // Allow default/prevent for dummy hash

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight + 10 : 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without abrupt jump
        history.pushState(null, '', targetId);
      }
    });
  });

  /* -------------------------------------------------------------------
     7. CONTACT FORM VALIDATION & CLIENT FEEDBACK
     ------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formAlert = document.getElementById('form-alert');

  if (contactForm) {
    const inputs = {
      fullName: document.getElementById('fullName'),
      email: document.getElementById('email'),
      subject: document.getElementById('subject'),
      message: document.getElementById('message')
    };

    // Remove errors on input
    Object.keys(inputs).forEach(key => {
      const input = inputs[key];
      if (input) {
        input.addEventListener('input', () => {
          clearFieldError(input);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Full Name
      if (!inputs.fullName.value.trim()) {
        showFieldError(inputs.fullName);
        isValid = false;
      } else {
        clearFieldError(inputs.fullName);
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!inputs.email.value.trim() || !emailPattern.test(inputs.email.value.trim())) {
        showFieldError(inputs.email);
        isValid = false;
      } else {
        clearFieldError(inputs.email);
      }

      // Validate Subject
      if (!inputs.subject.value.trim()) {
        showFieldError(inputs.subject);
        isValid = false;
      } else {
        clearFieldError(inputs.subject);
      }

      // Validate Message
      if (!inputs.message.value.trim()) {
        showFieldError(inputs.message);
        isValid = false;
      } else {
        clearFieldError(inputs.message);
      }

      if (isValid) {
        const submitBtn = contactForm.querySelector('#submit-btn');
        const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Sending...</span>';
        }

        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            const senderName = inputs.fullName.value.trim();
            formAlert.className = 'form-alert success';
            formAlert.textContent = `Thank you, ${senderName}! Your message has been sent successfully. I will get back to you soon.`;
            formAlert.style.display = 'block';
            contactForm.reset();
            setTimeout(() => {
              formAlert.style.display = 'none';
            }, 6000);
          } else {
            return response.json().then(data => {
              if (data && data.errors) {
                formAlert.textContent = data.errors.map(err => err.message).join(', ');
              } else {
                formAlert.textContent = 'Oops! There was a problem submitting your message. Please try again.';
              }
              formAlert.className = 'form-alert error';
              formAlert.style.display = 'block';
            });
          }
        })
        .catch(() => {
          formAlert.className = 'form-alert error';
          formAlert.textContent = 'Network error. Please try again or connect via LinkedIn / Email.';
          formAlert.style.display = 'block';
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
          }
        });
      }
    });
  }

  function showFieldError(fieldElement) {
    const formGroup = fieldElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.add('has-error');
    }
  }

  function clearFieldError(fieldElement) {
    const formGroup = fieldElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
    }
  }
});
