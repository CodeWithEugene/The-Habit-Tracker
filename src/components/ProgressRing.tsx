import { useEffect, useRef } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8,
  className = ""
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    if (circleRef.current) {
      const offset = 100 - progress;
      circleRef.current.style.setProperty('--target-offset', `${offset}`);
    }
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <svg
      className={`progress-ring ${className}`}
      width={size}
      height={size}
    >
      {/* Background circle */}
      <circle
        className="text-gray-200"
        stroke="currentColor"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress circle */}
      <circle
        ref={circleRef}
        className="progress-ring__circle"
        stroke="url(#gradient)"
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{
          strokeDasharray: circumference,
          animation: 'progress 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        }}
      />
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E90FF" />
          <stop offset="100%" stopColor="#A259FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
