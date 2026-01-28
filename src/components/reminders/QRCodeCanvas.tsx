import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { QRVisualConfig } from "@/types/qr-visual-config";

interface QRCodeCanvasProps {
  qrData: string;
  config: QRVisualConfig;
  baseImage: string | null;
  centerLogo: string | null;
  onPositionChange: (position: { x: number; y: number }) => void;
  canvasSize?: { width: number; height: number };
}

export interface QRCodeCanvasRef {
  exportAsImage: () => Promise<Blob | null>;
}

export const QRCodeCanvas = forwardRef<QRCodeCanvasRef, QRCodeCanvasProps>(
  ({ qrData, config, baseImage, centerLogo, onPositionChange, canvasSize = { width: 600, height: 400 } }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const qrUrl = `${window.location.origin}/ar/${qrData}`;

    useImperativeHandle(ref, () => ({
      exportAsImage: async () => {
        if (!containerRef.current) return null;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        // Draw background
        if (baseImage) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = baseImage;
          });
          ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
        } else {
          ctx.fillStyle = "#f5f5f5";
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        }

        // Draw QR Code
        const qrSvg = qrRef.current?.querySelector("svg");
        if (qrSvg) {
          const svgData = new XMLSerializer().serializeToString(qrSvg);
          const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          const qrImg = new Image();
          await new Promise<void>((resolve) => {
            qrImg.onload = () => resolve();
            qrImg.onerror = () => resolve();
            qrImg.src = svgUrl;
          });

          ctx.save();
          ctx.globalAlpha = config.opacity;
          
          const centerX = config.position.x + config.size / 2;
          const centerY = config.position.y + config.size / 2;
          
          ctx.translate(centerX, centerY);
          ctx.rotate((config.rotation * Math.PI) / 180);
          ctx.translate(-centerX, -centerY);
          
          ctx.drawImage(qrImg, config.position.x, config.position.y, config.size, config.size);
          ctx.restore();

          URL.revokeObjectURL(svgUrl);
        }

        return new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), "image/png");
        });
      },
    }));

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is on QR code
      const qrX = config.position.x;
      const qrY = config.position.y;
      const qrSize = config.size;

      if (x >= qrX && x <= qrX + qrSize && y >= qrY && y <= qrY + qrSize) {
        setIsDragging(true);
        setDragStart({ x: x - qrX, y: y - qrY });
      }
    }, [config.position, config.size]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragStart.x;
      const y = e.clientY - rect.top - dragStart.y;

      // Constrain to canvas bounds
      const constrainedX = Math.max(0, Math.min(canvasSize.width - config.size, x));
      const constrainedY = Math.max(0, Math.min(canvasSize.height - config.size, y));

      onPositionChange({ x: constrainedX, y: constrainedY });
    }, [isDragging, dragStart, config.size, canvasSize, onPositionChange]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      if (!containerRef.current || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const qrX = config.position.x;
      const qrY = config.position.y;
      const qrSize = config.size;

      if (x >= qrX && x <= qrX + qrSize && y >= qrY && y <= qrY + qrSize) {
        setIsDragging(true);
        setDragStart({ x: x - qrX, y: y - qrY });
        e.preventDefault();
      }
    }, [config.position, config.size]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (!isDragging || !containerRef.current || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left - dragStart.x;
      const y = touch.clientY - rect.top - dragStart.y;

      const constrainedX = Math.max(0, Math.min(canvasSize.width - config.size, x));
      const constrainedY = Math.max(0, Math.min(canvasSize.height - config.size, y));

      onPositionChange({ x: constrainedX, y: constrainedY });
      e.preventDefault();
    }, [isDragging, dragStart, config.size, canvasSize, onPositionChange]);

    const handleTouchEnd = useCallback(() => {
      setIsDragging(false);
    }, []);

    useEffect(() => {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("touchend", handleGlobalMouseUp);
      return () => {
        window.removeEventListener("mouseup", handleGlobalMouseUp);
        window.removeEventListener("touchend", handleGlobalMouseUp);
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-border bg-muted/30 select-none"
        style={{ width: canvasSize.width, height: canvasSize.height, maxWidth: "100%" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image */}
        {baseImage ? (
          <img
            src={baseImage}
            alt="Imagem base"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">Arraste uma imagem ou clique em upload</p>
              <p className="text-xs mt-1">O QR Code será posicionado sobre ela</p>
            </div>
          </div>
        )}

        {/* QR Code */}
        <div
          ref={qrRef}
          className={`absolute transition-shadow ${
            isDragging ? "cursor-grabbing shadow-lg" : "cursor-grab"
          }`}
          style={{
            left: config.position.x,
            top: config.position.y,
            width: config.size,
            height: config.size,
            opacity: config.opacity,
            transform: `rotate(${config.rotation}deg)`,
            transformOrigin: "center center",
          }}
        >
          <div
            className={`absolute inset-0 border-2 rounded ${
              isDragging ? "border-primary border-dashed" : "border-transparent hover:border-primary/50 hover:border-dashed"
            }`}
          />
          <QRCodeSVG
            value={qrUrl}
            size={config.size}
            fgColor={config.foreground}
            bgColor={config.background}
            level={centerLogo ? "H" : "M"}
            includeMargin={false}
            imageSettings={centerLogo ? {
              src: centerLogo,
              height: Math.round((config.size * (config.centerLogoSize || 25)) / 100),
              width: Math.round((config.size * (config.centerLogoSize || 25)) / 100),
              excavate: true,
            } : undefined}
          />
        </div>

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        )}
      </div>
    );
  }
);

QRCodeCanvas.displayName = "QRCodeCanvas";
