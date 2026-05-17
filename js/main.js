/*
 * EtherealAwareness.com - Main JavaScript
 * Handles navigation, filters, sliders, scroll progress and interaction behavior.
 */

(function () {
  'use strict';

  const selectors = {
    navbar: '.navbar',
    hamburger: '.hamburger',
    menu: '.navbar-menu',
    backToTop: '.back-to-top',
    progressBar: '.scroll-progress',
    whatsappFloat: '.whatsapp-float',
    navLinks: '.navbar-menu a',
    smoothLinks: 'a.scroll-link, .btn[href^="#"], a[href^="#"]',
    testimonialItems: '.testimonial-item',
    testimonialDots: '.testimonial-dot',
    courseCards: '.course-card',
    courseFilterButtons: '.course-filter button',
    courseSearch: '#course-search',
    workshopCountdown: '[data-countdown]',
    revealBlocks: '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale',
  };

  const state = {
    currentTestimonial: 0,
    testimonialTimer: null,
  };

  function select(selector) {
    return document.querySelector(selector);
  }

  function selectAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function setActiveNavOnScroll() {
    const navbar = select(selectors.navbar);
    if (!navbar) return;
    const threshold = window.scrollY > 50;
    navbar.classList.toggle('scrolled', threshold);
  }

  function updateScrollProgress() {
    const progressElement = select(selectors.progressBar);
    if (!progressElement) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressElement.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
  }

  function handleBackToTop() {
    const backToTop = select(selectors.backToTop);
    if (!backToTop) return;
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }

  function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    selectAll(selectors.navLinks).forEach(link => {
      const href = link.getAttribute('href');
      const normalizedHref = href === '' ? 'index.html' : href;
      const active = normalizedHref === currentPath || (normalizedHref === 'index.html' && currentPath === '');
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function initMobileMenu() {
    const hamburger = select(selectors.hamburger);
    const menu = select(selectors.menu);
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', function () {
      const open = !menu.classList.contains('active');
      menu.classList.toggle('active', open);
      hamburger.classList.toggle('active', open);
    });

    selectAll(selectors.navLinks).forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  function initSmoothScroll() {
    selectAll(selectors.smoothLinks).forEach(anchor => {
      anchor.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function showWhatsAppMessage() {
    const button = select(selectors.whatsappFloat);
    if (!button) return;
    button.addEventListener('click', function () {
      window.open(this.dataset.href, '_blank');
    });
  }

  function initTestimonials() {
    const slides = selectAll(selectors.testimonialItems);
    const dots = selectAll(selectors.testimonialDots);
    if (!slides.length || !dots.length) return;

    function showSlide(index) {
      state.currentTestimonial = (index + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('active', idx === state.currentTestimonial));
      dots.forEach((dot, idx) => dot.classList.toggle('active', idx === state.currentTestimonial));
    }

    function nextSlide() {
      showSlide(state.currentTestimonial + 1);
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        resetTestimonialTimer();
      });
    });

    function resetTestimonialTimer() {
      if (state.testimonialTimer) {
        window.clearInterval(state.testimonialTimer);
      }
      state.testimonialTimer = window.setInterval(nextSlide, 7000);
    }

    showSlide(0);
    resetTestimonialTimer();
  }

  function initCourseFilter() {
    const cards = selectAll(selectors.courseCards);
    const buttons = selectAll(selectors.courseFilterButtons);
    const searchInput = select(selectors.courseSearch);

    if (!cards.length || !buttons.length || !searchInput) return;

    function filterCourses() {
      const activeCategory = buttons.find(button => button.classList.contains('active'))?.dataset.category || 'all';
      const query = searchInput.value.trim().toLowerCase();

      cards.forEach(card => {
        const category = card.dataset.category || '';
        const text = card.textContent.toLowerCase();
        const matchesCategory = activeCategory === 'all' || category.includes(activeCategory);
        const matchesText = query.length === 0 || text.includes(query);
        const visible = matchesCategory && matchesText;
        card.style.display = visible ? 'grid' : 'none';
      });
    }

    buttons.forEach(button => {
      button.addEventListener('click', function () {
        buttons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterCourses();
      });
    });

    searchInput.addEventListener('input', filterCourses);
    filterCourses();
  }

  function initRevealOnScroll() {
    const revealElements = selectAll(selectors.revealBlocks);
    if (!revealElements.length || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
    });

    revealElements.forEach(el => observer.observe(el));
  }

  function initWorkshopCountdown() {
    selectAll(selectors.workshopCountdown).forEach(timer => {
      const targetDate = new Date(timer.dataset.countdown);
      if (Number.isNaN(targetDate.getTime())) return;

      function updateCountdown() {
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();
        if (diff <= 0) {
          timer.textContent = 'Registration closing soon';
          return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s left`;
      }

      updateCountdown();
      window.setInterval(updateCountdown, 1000);
    });
  }

  function initBackToTop() {
    const backToTop = select(selectors.backToTop);
    if (!backToTop) return;
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initFaqAccordion() {
    const faqItems = selectAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');
      if (!question || !answer) return;
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherAnswer = other.querySelector('.faq-answer');
          const otherIcon = other.querySelector('.faq-icon');
          const otherQuestion = other.querySelector('.faq-question');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
          if (otherQuestion) {
            otherQuestion.setAttribute('aria-expanded', 'false');
          }
          if (otherIcon) {
            otherIcon.textContent = '+';
          }
        });

        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
          question.setAttribute('aria-expanded', 'true');
          if (icon) {
            icon.textContent = '-';
          }
        }
      });
    });
  }

  function init() {
    initMobileMenu();
    initSmoothScroll();
    initTestimonials();
    initCourseFilter();
    initRevealOnScroll();
    initWorkshopCountdown();
    initBackToTop();
    initFaqAccordion();
    showWhatsAppMessage();
    setActiveNavLink();
    setActiveNavOnScroll();
    updateScrollProgress();
    handleBackToTop();

    window.addEventListener('scroll', () => {
      setActiveNavOnScroll();
      updateScrollProgress();
      handleBackToTop();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();