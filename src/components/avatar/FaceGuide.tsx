import { cn } from "@/lib/utils";

interface FaceGuideProps {
  isAligned?: boolean;
  className?: string;
}

const FaceGuide = ({ isAligned = false, className }: FaceGuideProps) => {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center pointer-events-none", className)}>
      {/* Oval face guide */}
      <div className="relative">
        <svg
          width="280"
          height="360"
          viewBox="0 0 280 360"
          fill="none"
          className="drop-shadow-lg"
        >
          {/* Outer glow */}
          <ellipse
            cx="140"
            cy="180"
            rx="120"
            ry="160"
            stroke={isAligned ? "hsl(var(--primary))" : "hsl(var(--auth-muted))"}
            strokeWidth="4"
            strokeDasharray={isAligned ? "none" : "12 8"}
            fill="none"
            className={cn(
              "transition-all duration-500",
              isAligned && "animate-pulse"
            )}
            style={{
              filter: isAligned ? "drop-shadow(0 0 20px hsl(var(--primary)))" : "none"
            }}
          />
          
          {/* Inner guide */}
          <ellipse
            cx="140"
            cy="180"
            rx="115"
            ry="155"
            stroke={isAligned ? "hsl(var(--accent))" : "transparent"}
            strokeWidth="2"
            fill="none"
            className="transition-all duration-300"
          />

          {/* Corner markers */}
          {/* Top */}
          <path
            d="M140 20 L140 40"
            stroke={isAligned ? "hsl(var(--primary))" : "hsl(var(--auth-muted))"}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Bottom */}
          <path
            d="M140 320 L140 340"
            stroke={isAligned ? "hsl(var(--primary))" : "hsl(var(--auth-muted))"}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Left */}
          <path
            d="M20 180 L40 180"
            stroke={isAligned ? "hsl(var(--primary))" : "hsl(var(--auth-muted))"}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Right */}
          <path
            d="M240 180 L260 180"
            stroke={isAligned ? "hsl(var(--primary))" : "hsl(var(--auth-muted))"}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Status indicator */}
        <div className={cn(
          "absolute -bottom-8 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          isAligned 
            ? "bg-primary/20 text-primary border border-primary/30" 
            : "bg-muted/50 text-muted-foreground border border-border"
        )}>
          {isAligned ? "✓ Rosto alinhado" : "Alinhe seu rosto"}
        </div>
      </div>

      {/* Darkened overlay outside the oval */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="faceMask">
            <rect width="100%" height="100%" fill="white" />
            <ellipse
              cx="50%"
              cy="50%"
              rx="140"
              ry="180"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.5)"
          mask="url(#faceMask)"
        />
      </svg>
    </div>
  );
};

export default FaceGuide;
