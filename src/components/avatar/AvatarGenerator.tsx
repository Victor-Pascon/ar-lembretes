import { AvatarConfig } from "./AvatarModel";

// Extract dominant colors from image
const extractColors = (imageSrc: string): Promise<{ skinTone: string; hairColor: string }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        resolve({ skinTone: "#deb887", hairColor: "#3d2314" });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample colors from different regions
      const faceRegion = ctx.getImageData(
        img.width * 0.35,
        img.height * 0.35,
        img.width * 0.3,
        img.height * 0.2
      );

      const hairRegion = ctx.getImageData(
        img.width * 0.3,
        img.height * 0.05,
        img.width * 0.4,
        img.height * 0.15
      );

      const skinTone = getAverageColor(faceRegion.data);
      const hairColor = getAverageColor(hairRegion.data);

      resolve({ skinTone, hairColor });
    };
    
    img.onerror = () => {
      resolve({ skinTone: "#deb887", hairColor: "#3d2314" });
    };
    
    img.src = imageSrc;
  });
};

const getAverageColor = (data: Uint8ClampedArray): string => {
  let r = 0, g = 0, b = 0, count = 0;

  for (let i = 0; i < data.length; i += 4) {
    // Skip very dark or very bright pixels
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness > 30 && brightness < 240) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }

  if (count === 0) return "#deb887";

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// Map extracted color to predefined palette
const mapToSkinPalette = (hex: string): string => {
  const skinPalette = [
    "#ffe4c4", // Light
    "#deb887", // Medium light
    "#c68642", // Medium
    "#8d5524", // Medium dark
    "#5c3317", // Dark
  ];

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Map to palette based on luminance
  const index = Math.min(Math.floor((1 - luminance) * skinPalette.length), skinPalette.length - 1);
  return skinPalette[index];
};

const mapToHairPalette = (hex: string): string => {
  const hairPalette = [
    "#d4a574", // Blonde
    "#8b7355", // Dark blonde
    "#6b4423", // Brown
    "#3d2314", // Dark brown
    "#1a1a1a", // Black
  ];

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const index = Math.min(Math.floor((1 - luminance) * hairPalette.length), hairPalette.length - 1);
  return hairPalette[index];
};

export const generateAvatarConfig = async (imageSrc: string): Promise<AvatarConfig> => {
  const { skinTone, hairColor } = await extractColors(imageSrc);

  return {
    skinColor: mapToSkinPalette(skinTone),
    hairColor: mapToHairPalette(hairColor),
    eyeColor: "#634e34", // Default brown eyes
    hairStyle: "medium",
    hasGlasses: false,
  };
};

export const getDefaultAvatarConfig = (): AvatarConfig => ({
  skinColor: "#deb887",
  hairColor: "#3d2314",
  eyeColor: "#634e34",
  hairStyle: "medium",
  hasGlasses: false,
});
