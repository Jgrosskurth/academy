import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

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

  // add social media icons to @ links
  const socialMap = {
    'youtube.com': 'youtube',
    'facebook.com': 'facebook',
    'instagram.com': 'instagram',
    'tiktok.com': 'tiktok',
  };
  footer.querySelectorAll('a[href]').forEach((a) => {
    const match = Object.entries(socialMap).find(([domain]) => a.href.includes(domain));
    if (match && a.textContent.startsWith('@')) {
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

  block.append(footer);
}
