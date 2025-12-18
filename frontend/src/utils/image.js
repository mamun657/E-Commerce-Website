export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80&sat=-100';

export const getPrimaryImage = (images, fallback = FALLBACK_PRODUCT_IMAGE) => {
  if (Array.isArray(images) && images.length > 0) {
    const first = images.find((img) => typeof img === 'string' && img.trim().length > 0);
    if (first) return first;
  }

  if (typeof images === 'string' && images.trim().length > 0) {
    return images;
  }

  return fallback;
};
