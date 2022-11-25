import { useEffect, useState } from 'react';

const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<{
    height?: number;
    width?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
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

  return { windowSize, minWidth };
};
