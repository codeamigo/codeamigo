import { useEffect, useState } from 'react';

// https://usehooks.com/useKeyPress/
// with slight modifications to accept array of keys
function useKeyPress(targetKeys: string[]): boolean {
  // State for keeping track of whether key is pressed
  const [keysPressed, setKeyPressed] = useState<string[]>([]);
  // If pressed key is our target key then set to true
  function downHandler({ key }: { key: string }): void {
    if (targetKeys.includes(key)) {
      setKeyPressed((keysPressed) => keysPressed.concat(key));
    }
  }
  // If released key is our target key then set to false
  const upHandler = ({ key }: { key: string }): void => {
    setKeyPressed([]);
  };
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keysPressed.length === targetKeys.length;
}

export default useKeyPress;
