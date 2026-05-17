/*
 * EtherealAwareness.com - SEO utilities
 * Adds schema markup and ensures structured metadata is available.
 */

(function () {
  'use strict';

  function applyCanonicalLink() {
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) return;

    const link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', window.location.href);
    document.head.appendChild(link);
  }

  function addSchemaMarkup() {
    const pageType = document.body.dataset.schema || 'WebPage';
    const title = document.title || 'Ethereal Awareness';
    const description = document.querySelector('meta[name="description"]')?.content || 'Ethereal Awareness provides premium paranormal education, investigation training, psychic development, tarot certification and guided sessions.';

    const schema = {
      '@context': 'https://schema.org',
      '@type': pageType,
      'name': title,
      'description': description,
      'url': window.location.origin + window.location.pathname,
      'publisher': {
        '@type': 'Organization',
        'name': 'Ethereal Awareness'
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  function init() {
    applyCanonicalLink();
    addSchemaMarkup();
  }

  document.addEventListener('DOMContentLoaded', init);
})();