/*
 * EtherealAwareness.com - Animations module
 * Provides smooth reveal effects and gentle motion for an elevated experience.
 */

(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function addEntryAnimation(element, animationClass, delay) {
    if (!element) return;
    element.style.animationDelay = `${delay}ms`;
    element.classList.add(animationClass);
  }

  function initSectionAnimations() {
    if (prefersReducedMotion()) return;

    const animatedSections = document.querySelectorAll('.section-header, .hero-content, .card, .testimonial-item, .course-card, .workshop-card, .session-card, .faq-item');
    animatedSections.forEach((element, index) => {
      const delay = (index % 6) * 80;
      addEntryAnimation(element, 'fade-in-up', delay);
    });
  }

  function initDecorativeMotion() {
    const floatingElements = document.querySelectorAll('.float, .pulse, .hover-bounce');
    floatingElements.forEach(element => {
      element.style.willChange = 'transform, opacity';
    });
  }

  function init() {
    initSectionAnimations();
    initDecorativeMotion();
  }

  document.addEventListener('DOMContentLoaded', init);
})();