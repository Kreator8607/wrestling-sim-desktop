import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * Fixed Tooltip Component with Adaptive Positioning
 * Handles edge cases for 1024x768 resolution
 */
export function Tooltip({ text, children, position = 'top', icon = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  const handleMouseEnter = (e) => {
    setIsVisible(true);
    adjustPosition(e.currentTarget);
  };

  const adjustPosition = (element) => {
    const rect = element.getBoundingClientRect();
    const tooltipWidth = 200;
    const tooltipHeight = 60;

    let newPosition = position;

    // Check if tooltip would go off-screen
    if (position === 'right' && rect.right + tooltipWidth > window.innerWidth) {
      newPosition = 'left';
    } else if (position === 'left' && rect.left - tooltipWidth < 0) {
      newPosition = 'right';
    } else if (position === 'bottom' && rect.bottom + tooltipHeight > window.innerHeight) {
      newPosition = 'top';
    } else if (position === 'top' && rect.top - tooltipHeight < 0) {
      newPosition = 'bottom';
    }

    setAdjustedPosition(newPosition);
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  const arrowClasses = {
    top: 'top-full border-t-secondary border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full border-b-secondary border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full border-l-secondary border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full border-r-secondary border-t-transparent border-b-transparent border-l-transparent',
  };

  if (icon) {
    return (
      <div className="relative inline-block">
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVisible(false)}
          className="p-1 hover:bg-secondary rounded-lg transition-colors"
          title={text}
        >
          <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>

        {isVisible && (
          <div className={`absolute ${positionClasses[adjustedPosition]} z-50 pointer-events-none`}>
            <div className="bg-secondary text-foreground text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg max-w-xs">
              {text}
              <div className={`absolute w-2 h-2 border-2 ${arrowClasses[adjustedPosition]}`} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div className={`absolute ${positionClasses[adjustedPosition]} z-50 pointer-events-none`}>
          <div className="bg-secondary text-foreground text-xs px-3 py-2 rounded-lg max-w-xs shadow-lg">
            {text}
            <div className={`absolute w-2 h-2 border-2 ${arrowClasses[adjustedPosition]}`} />
          </div>
        </div>
      )}
    </div>
  );
}
