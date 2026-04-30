import { useState } from 'react';

// Simulated Framer Motion-like animations using CSS
export function AnimatedCard({ children, delay = 0 }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
}

export function AnimatedButton({ children, onClick, className = '', ...props }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      {...props}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`transform transition-all duration-200 ${
        isPressed ? 'scale-95' : 'scale-100 hover:scale-105'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function AnimatedText({ children, className = '', staggerDelay = 50 }) {
  const chars = Array.from(String(children));

  return (
    <span className={className}>
      {chars.map((char, idx) => (
        <span
          key={idx}
          className="inline-block animate-fade-in"
          style={{
            animationDelay: `${idx * staggerDelay}ms`,
            animationFillMode: 'both',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

export function AnimatedProgress({ value, max = 100, className = '' }) {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full h-2 bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
        style={{
          width: `${percentage}%`,
          animation: 'pulse-glow 2s ease-in-out infinite',
        }}
      />
    </div>
  );
}

export function AnimatedBadge({ label, icon: Icon, color = 'bg-red-600' }) {
  return (
    <div
      className={`${color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce-in`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </div>
  );
}

export function AnimatedList({ items, renderItem }) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="animate-slide-in-left"
          style={{
            animationDelay: `${idx * 100}ms`,
            animationFillMode: 'both',
          }}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

export function PulseAnimation({ children, className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
}

export function ShakeAnimation({ children, trigger = false }) {
  return (
    <div className={trigger ? 'animate-shake' : ''}>
      {children}
    </div>
  );
}

// CSS Animations to be added to global styles
export const animationStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-5px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(5px);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
    }
  }

  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out;
  }

  .animate-slide-in-left {
    animation: slide-in-left 0.4s ease-out;
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.4s ease-out;
  }

  .animate-bounce-in {
    animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .animate-shake {
    animation: shake 0.5s;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .animate-fade-out {
    animation: fade-out 0.3s ease-out;
  }
`;
