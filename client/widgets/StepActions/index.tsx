import React, { useEffect, useState } from 'react';

import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import Toggle from '👨‍💻components/Toggle';

const StepActions: React.FC<Props> = ({
  currentStep,
  disabled,
  isAutoPlayEnabled,
  isCompletionEnabled,
  nextLoader,
  setCurrentStep,
  setIsAutoPlayEnabled,
  setIsCompletionEnabled,
  steps,
}) => {
  const nextDisabled = currentStep === steps - 1 || disabled;
  const isLastStep = currentStep === steps - 1;
  const [loaderWidth, setLoaderWidth] = useState(0);

  useEffect(() => {
    setLoaderWidth(0);
  }, [currentStep]);

  useEffect(() => {
    let interval: any;
    if (nextLoader) {
      // increase the width of the loader to 100% over 4 seconds
      // this is the same amount of time it takes for the next button to be clicked
      // if button is hovered over, pause the loader
      interval = setInterval(() => {
        if (loaderWidth < 100) {
          setLoaderWidth((prevWidth) => prevWidth + 1);
        }
      }, 40);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [nextLoader]);

  useEffect(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.style.width = `${loaderWidth}%`;
    const nextButton = document.getElementById('next-button');

    if (loaderWidth === 100) {
      nextButton?.click();
    }
  }, [loaderWidth]);

  return (
    <div>
      {isLastStep ? (
        <div className="flex items-center justify-center gap-2 border-b border-neutral-800 bg-black py-2">
          <Button
            onClick={() =>
              window.open('https://forms.gle/weRYdVmr2LszmQiK6', '_blank')
            }
          >
            <Icon className="mr-1.5" name="plus-circled" />
            <span>Join Waitlist</span>
          </Button>
          <Button
            onClick={() =>
              window.open('https://forms.gle/weRYdVmr2LszmQiK6', '_blank')
            }
          >
            <Icon className="mr-1.5" name="twitter" />
            <span>Follow us on Twitter</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-neutral-800 bg-black p-2">
          <div aria-label="Autoplay" className="hint hint--right">
            <Toggle
              checked={isAutoPlayEnabled}
              setChecked={setIsAutoPlayEnabled}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Prev
            </Button>
            <Button
              className="relative overflow-hidden"
              disabled={nextDisabled}
              id="next-button"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              <span className="relative z-10">Next</span>
              {nextLoader && (
                // element that expands in the style of the netflix loader
                <span
                  className="absolute left-0 z-0 h-full w-0 bg-neutral-500"
                  id="loader"
                ></span>
              )}
            </Button>
          </div>
          <div aria-label="Toggle Code Completion" className="hint hint--left">
            <Toggle
              checked={isCompletionEnabled}
              setChecked={setIsCompletionEnabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

type Props = {
  currentStep: number;
  disabled: boolean;
  isAutoPlayEnabled: boolean;
  isCompletionEnabled: boolean;
  nextLoader: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setIsAutoPlayEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCompletionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  steps: number;
};

export default StepActions;
