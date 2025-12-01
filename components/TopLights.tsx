import React from 'react';

export default function TopLights() {
  return (
    <div className="pointer-events-none relative w-screen flex justify-center bg-white py-6 sm:py-8" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      <svg width="100vw" height="60" viewBox="0 0 1200 60" preserveAspectRatio="xMidYMid slice" className="w-full">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#7bd389" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(0,10)" opacity="0.95">
          {/* string */}
          <path d="M0 30 C150 0 300 60 450 30 C600 0 750 60 900 30 C1050 0 1200 60 1350 30" stroke="#8b5e34" strokeWidth="4" fill="none" />
          {/* bulbs with glow and pulse animation */}
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 50 + i * 65;
            const colors = ['#ffd700', '#ff6b6b', '#7bd389', '#6bc0ff'];
            const color = colors[i % colors.length];
            return (
              <g key={i} className="bulb-pulse" style={{ animation: `pulse 2s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}>
                <circle cx={x} cy={30 + (i % 2 === 0 ? 6 : -6)} r={8} fill={color} stroke="#a47b4b" strokeWidth={1} opacity={0.95} filter="url(#glow)" />
              </g>
            );
          })}
        </g>
      </svg>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }
        svg { pointer-events: none; }
        @media (max-width: 640px) { svg { height: 40px; } }
      `}</style>
    </div>
  );
}