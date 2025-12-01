import React, { useEffect, useState } from 'react';

export default function Snowfall() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show after Jan 6
  if (new Date() > new Date('2026-01-06T23:59:59Z')) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      <style>{`
        @keyframes snowfall {
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .snow {
          position: fixed;
          top: -10px;
          background: radial-gradient(circle at 30% 30%, #ffffff, #f0f8ff);
          border-radius: 50%;
          width: 10px;
          height: 10px;
          opacity: 0.9;
          box-shadow: 
            0 0 8px rgba(255,255,255,0.9),
            0 0 16px rgba(255,255,255,0.6),
            inset -2px -2px 4px rgba(0,0,0,0.05);
          animation: snowfall 10s linear infinite;
        }

        .snow:nth-child(1) { left: 5%; animation-delay: 0s; animation-duration: 12s; }
        .snow:nth-child(2) { left: 8%; animation-delay: 2s; animation-duration: 14s; }
        .snow:nth-child(3) { left: 12%; animation-delay: 4s; animation-duration: 11s; }
        .snow:nth-child(4) { left: 15%; animation-delay: 1s; animation-duration: 13s; }
        .snow:nth-child(5) { left: 18%; animation-delay: 3s; animation-duration: 15s; }
        .snow:nth-child(6) { left: 22%; animation-delay: 5s; animation-duration: 10s; }
        .snow:nth-child(7) { left: 25%; animation-delay: 0.5s; animation-duration: 12s; }
        .snow:nth-child(8) { left: 28%; animation-delay: 2.5s; animation-duration: 14s; }
        .snow:nth-child(9) { left: 32%; animation-delay: 4.5s; animation-duration: 11s; }
        .snow:nth-child(10) { left: 35%; animation-delay: 1.5s; animation-duration: 13s; }
        .snow:nth-child(11) { left: 38%; animation-delay: 3.5s; animation-duration: 15s; }
        .snow:nth-child(12) { left: 42%; animation-delay: 5.5s; animation-duration: 10s; }
        .snow:nth-child(13) { left: 45%; animation-delay: 0.2s; animation-duration: 12s; }
        .snow:nth-child(14) { left: 48%; animation-delay: 2.2s; animation-duration: 14s; }
        .snow:nth-child(15) { left: 52%; animation-delay: 4.2s; animation-duration: 11s; }
        .snow:nth-child(16) { left: 55%; animation-delay: 1.2s; animation-duration: 13s; }
        .snow:nth-child(17) { left: 58%; animation-delay: 3.2s; animation-duration: 15s; }
        .snow:nth-child(18) { left: 62%; animation-delay: 5.2s; animation-duration: 10s; }
        .snow:nth-child(19) { left: 65%; animation-delay: 0.7s; animation-duration: 12.5s; }
        .snow:nth-child(20) { left: 68%; animation-delay: 2.7s; animation-duration: 13.5s; }
        .snow:nth-child(21) { left: 72%; animation-delay: 4.7s; animation-duration: 11.5s; }
        .snow:nth-child(22) { left: 75%; animation-delay: 1.7s; animation-duration: 14.5s; }
        .snow:nth-child(23) { left: 78%; animation-delay: 3.7s; animation-duration: 10.5s; }
        .snow:nth-child(24) { left: 82%; animation-delay: 5.7s; animation-duration: 12s; }
        .snow:nth-child(25) { left: 85%; animation-delay: 0.3s; animation-duration: 13s; }
        .snow:nth-child(26) { left: 88%; animation-delay: 2.3s; animation-duration: 15s; }
        .snow:nth-child(27) { left: 92%; animation-delay: 4.3s; animation-duration: 11s; }
        .snow:nth-child(28) { left: 95%; animation-delay: 1.3s; animation-duration: 13s; }
        .snow:nth-child(29) { left: 98%; animation-delay: 3.3s; animation-duration: 14s; }
        .snow:nth-child(30) { left: 2%; animation-delay: 5.3s; animation-duration: 12s; }

        @media (max-width: 640px) {
          .snow {
            width: 6px;
            height: 6px;
            box-shadow: 
              0 0 6px rgba(255,255,255,0.8),
              0 0 12px rgba(255,255,255,0.5),
              inset -1px -1px 3px rgba(0,0,0,0.05);
          }
        }
      `}</style>

      {[...Array(30)].map((_, i) => (
        <div key={i} className="snow" />
      ))}
    </div>
  );
}
