import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.5, // Target size is 0.5MB
    maxWidthOrHeight: 1920, // Max dimension 1920px
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    return file; // Return original file if compression fails
  }
};
