import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRCodeStyle {
  foreground?: string;
  background?: string;
}

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  style?: QRCodeStyle | null;
  className?: string;
  includeMargin?: boolean;
}

export function QRCodeDisplay({
  data,
  size = 128,
  style,
  className,
  includeMargin = true,
}: QRCodeDisplayProps) {
  const qrStyle = style || { foreground: "#7c3aed", background: "#ffffff" };
  const qrUrl = `${window.location.origin}/ar/${data}`;

  return (
    <div 
      className={cn(
        "rounded-lg overflow-hidden inline-flex items-center justify-center",
        className
      )}
      style={{ backgroundColor: qrStyle.background }}
    >
      <QRCodeSVG
        value={qrUrl}
        size={size}
        fgColor={qrStyle.foreground}
        bgColor={qrStyle.background}
        includeMargin={includeMargin}
        level="M"
      />
    </div>
  );
}
