import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    // Upgrade Scene7 thumbnail URLs to larger images for better quality
    let { src } = img;
    if (src.includes('scene7.com') && /[?&]wid=\d+/.test(src)) {
      src = src.replace(/([?&])wid=\d+/, '$1wid=600').replace(/([?&])hei=\d+/, '$1hei=600');
    }
    img.closest('picture').replaceWith(createOptimizedPicture(src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);

  /* classify card lists by content type */
  const items = [...ul.children];
  const hasImages = items.some((li) => li.querySelector('.cards-card-image'));
  const allImages = items.every((li) => li.querySelector('.cards-card-image'));
  if (!hasImages) block.classList.add('text-only');
  else if (!allImages) block.classList.add('mixed');
}
