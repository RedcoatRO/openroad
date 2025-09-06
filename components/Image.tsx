import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

/**
 * Image component that serves WebP images with a fallback to the original format.
 * It intelligently modifies the src URL for image services like Unsplash
 * to request the WebP format, improving performance.
 * @param {string} src - The source URL of the image.
 * @param {string} alt - The alt text for the image.
 * @param {object} props - Other standard img attributes.
 */
const Image: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  /**
   * Generates a URL for the WebP version of the image.
   * Currently optimized for Unsplash URLs by adding the 'fm=webp' parameter.
   * For other URLs, it returns the original source.
   * @param {string} originalSrc The original image URL.
   * @returns {string} The URL for the WebP version.
   */
  const getWebpSrc = (originalSrc: string): string => {
    if (!originalSrc) return '';
    
    // Handle Unsplash URLs by adding/updating the format parameter.
    if (originalSrc.includes('images.unsplash.com')) {
      try {
        const url = new URL(originalSrc);
        url.searchParams.set('fm', 'webp');
        return url.toString();
      } catch (e) {
        // If URL parsing fails, return original src
        console.error("Could not parse image URL for WebP conversion:", originalSrc);
        return originalSrc;
      }
    }
    
    // For other image sources, we don't have a reliable conversion method,
    // so we return the original source. The browser might still be served
    // a next-gen format if the server supports content negotiation.
    return originalSrc;
  };
  
  const webpSrc = getWebpSrc(src);

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...props} loading="lazy" />
    </picture>
  );
};

export default Image;
