/**
 * Hero block decoration for Academy Sports + Outdoors.
 * When the hero has a composite banner image (image already contains text),
 * hide the text overlay to avoid duplication.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const firstDiv = block.querySelector(':scope > div:first-child');
  const lastDiv = block.querySelector(':scope > div:last-child');
  const img = firstDiv?.querySelector('img');
  const heading = lastDiv?.querySelector('h1, h2');

  // If the heading text appears in the image alt, the image is a composite
  // banner with text baked in — hide the text overlay to avoid duplication
  if (img && heading && lastDiv && firstDiv !== lastDiv) {
    const alt = (img.alt || '').toLowerCase();
    const headingWords = heading.textContent.trim().toLowerCase().split(/\s+/);
    const matchCount = headingWords.filter((w) => w.length > 3 && alt.includes(w)).length;
    const isCompositeBanner = matchCount >= 2;

    if (isCompositeBanner) {
      lastDiv.setAttribute('aria-hidden', 'true');
      lastDiv.style.display = 'none';
    }
  }
}
