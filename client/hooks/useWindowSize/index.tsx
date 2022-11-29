import { useEffect, useState } from 'react';

const tailwindBreakpoints = {
  '2xl': 1536,
  lg: 1024,
  md: 768,
  sm: 640,
  xl: 1280,
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    height?: number;
    width?: number;
  }>({
    height: undefined,
    width: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  const minWidth = (breakpoint: keyof typeof tailwindBreakpoints) => {
    return (
      windowSize.width && windowSize.width >= tailwindBreakpoints[breakpoint]
    );
  };

  return { minWidth, windowSize };
};
