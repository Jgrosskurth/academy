import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath, '/blocks/footer/footer-content.html');

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Label sections for styling
  const sections = footer.querySelectorAll(':scope > .section');
  const sectionNames = ['app', 'orders', 'services', 'about', 'links', 'legal'];
  sections.forEach((section, i) => {
    if (sectionNames[i]) section.classList.add(`footer-${sectionNames[i]}`);
  });

  // add social media icons to @ links
  const socialMap = {
    'youtube.com': 'youtube',
    'facebook.com': 'facebook',
    'instagram.com': 'instagram',
    'tiktok.com': 'tiktok',
    'twitter.com': 'twitter',
    'pinterest.com': 'pinterest',
  };
  footer.querySelectorAll('a[href]').forEach((a) => {
    const match = Object.entries(socialMap).find(([domain]) => a.href.includes(domain));
    if (match && a.textContent.startsWith('@')) {
      a.textContent = '';
      a.setAttribute('aria-label', `Follow us on ${match[1]}`);
      const icon = document.createElement('img');
      icon.src = `/icons/${match[1]}.svg`;
      icon.alt = '';
      icon.loading = 'lazy';
      icon.width = 16;
      icon.height = 16;
      icon.className = 'footer-social-icon';
      a.append(icon);
    }
  });

  // Mobile accordion behavior for link sections (orders, services, about)
  footer.querySelectorAll('h3').forEach((h3) => {
    const section = h3.closest('.section');
    if (!section) return;
    const ul = section.querySelector('ul');
    if (!ul) return;

    // Skip "Download Our App" — always visible
    if (h3.textContent.trim() === 'Download Our App') return;

    h3.classList.add('footer-accordion-toggle');
    h3.setAttribute('role', 'button');
    h3.setAttribute('aria-expanded', isDesktop.matches ? 'true' : 'false');
    h3.setAttribute('tabindex', '0');

    const toggle = () => {
      if (isDesktop.matches) return;
      const expanded = h3.getAttribute('aria-expanded') === 'true';
      h3.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    };

    h3.addEventListener('click', toggle);
    h3.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Respond to viewport changes
  isDesktop.addEventListener('change', () => {
    footer.querySelectorAll('.footer-accordion-toggle').forEach((h3) => {
      h3.setAttribute('aria-expanded', isDesktop.matches ? 'true' : 'false');
    });
  });

  block.append(footer);
}
