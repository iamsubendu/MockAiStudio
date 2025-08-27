export const imageProcessor = {
  async downscaleImage(file: File, maxSize: number = 1920): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const { width, height } = img;

        if (width <= maxSize && height <= maxSize) {
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
        } else {
          const ratio = Math.min(maxSize / width, maxSize / height);
          const newWidth = Math.round(width * ratio);
          const newHeight = Math.round(height * ratio);

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
        }

        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  },

  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "Please upload a PNG or JPG file" };
    }

    if (file.size > maxSize) {
      return { isValid: false, error: "File size must be less than 10MB" };
    }

    return { isValid: true };
  },
};
