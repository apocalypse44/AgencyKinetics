import React, { useEffect, useState } from 'react';

const useImagePreload = (imageUrls) => {
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      try {
        const promises = imageUrls.map((imageUrl) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imageUrl;
            img.onload = resolve;
            img.onerror = reject;
          });
        });

        await Promise.all(promises);
        setAreImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, [imageUrls]);

  return areImagesLoaded;
};

const ImageComponent = ({ imageUrl }) => {
  const areImagesLoaded = useImagePreload([imageUrl]);

  return (
    <div>
      {areImagesLoaded ? (
        <img src={imageUrl} alt="Cached Image" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ImageComponent;
