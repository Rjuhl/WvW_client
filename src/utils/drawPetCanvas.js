const createPetCanvas = (path, height) => {
    return new Promise((resolve, reject) => {
        const relativeRoot = "/";
        const pet = relativeRoot + path;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = pet;

        img.onload = () => {
            const originalWidth = img.naturalWidth; 
            const originalHeight = img.naturalHeight; 

            if (!originalWidth || !originalHeight) {
                reject("Image failed to load dimensions.");
                return;
            }

            const scale = height / originalHeight;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = originalWidth * scale;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas); 
        };

        img.onerror = () => reject("Failed to load image: " + img.src);
    });
};

export default createPetCanvas;
