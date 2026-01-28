export interface QRVisualConfig {
  // Basic color configuration (existing)
  foreground: string;
  background: string;
  
  // Visual configuration
  position: { x: number; y: number };
  size: number;
  rotation: number;
  opacity: number;
  baseImageUrl?: string;
  
  // Center logo configuration
  centerLogoUrl?: string;
  centerLogoSize?: number; // Percentage of QR size (10-40%)
}

export const defaultQRVisualConfig: QRVisualConfig = {
  foreground: "#7c3aed",
  background: "#ffffff",
  position: { x: 50, y: 50 },
  size: 150,
  rotation: 0,
  opacity: 1,
  centerLogoSize: 25,
};
