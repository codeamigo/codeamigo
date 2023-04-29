import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { modalVar } from '👨‍💻apollo/cache/modal';
import Button from '👨‍💻components/Button';
import Icon from '👨‍💻components/Icon';
import Toggle from '👨‍💻components/Toggle';
import {
  Step,
  useUpdateUserLessonCurrentPositionMutation,
} from '👨‍💻generated/graphql';

const StepActions: React.FC<Props> = ({
  disabled,
  isAutoPlayEnabled,
  isCompletionEnabled,
  isLoggedIn,
  lessonId,
  lessonSlug,
  nextLoader,
  setIsAutoPlayEnabled,
  setIsCompletionEnabled,
  step,
}) => {
  const isLastStep = !step.nextSlug;
  const nextDisabled = isLastStep || disabled;
  const [loaderWidth, setLoaderWidth] = useState(0);
  const router = useRouter();
  const [updateUserLessonCurrentPosition] =
    useUpdateUserLessonCurrentPositionMutation();

  useEffect(() => {
    setLoaderWidth(0);
  }, [step.id]);

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

  const handleNext = () => {
    if (isLoggedIn) {
      updateUserLessonCurrentPosition({
        refetchQueries: ['UserLessonPosition'],
        variables: {
          currentPosition: (step.position || 0) + 1,
          lessonId,
        },
      });
    }

    router.push(`/v2/lesson/${lessonSlug}/step/${step.nextSlug}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-neutral-800 bg-black p-2">
        <div aria-label="Autoplay" className="hint hint--right">
          <Toggle
            checked={isAutoPlayEnabled}
            setChecked={setIsAutoPlayEnabled}
          />
        </div>
        {isLastStep ? (
          <div className="flex items-center gap-2">
            <Button
              disabled={step.position === 0}
              onClick={() => {
                router.push(`/v2/lesson/${lessonSlug}/step/${step.prevSlug}`);
              }}
            >
              Prev
            </Button>
            <Button
              onClick={() => window.open('https://forms.gle/weRYdVmr2LszmQiK6')}
            >
              <Icon className="mr-1.5" name="plus-circled" />
              <span>Join Waitlist</span>
            </Button>
            <Button
              onClick={() => window.open('https://forms.gle/weRYdVmr2LszmQiK6')}
            >
              <Icon className="mr-1.5" name="twitter" />
              <span>Follow us on Twitter</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              disabled={step.position === 0}
              onClick={() => {
                router.push(`/v2/lesson/${lessonSlug}/step/${step.prevSlug}`);
              }}
            >
              Prev
            </Button>
            <Button
              className="relative overflow-hidden"
              disabled={nextDisabled}
              id="next-button"
              onClick={() => {
                handleNext();
              }}
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
            <Button
              onClick={() =>
                modalVar({
                  callback: () => {},
                  name: 'lessonHelp',
                  persistent: false,
                })
              }
            >
              <Icon className="mr-1.5" name="help-circled" />
              Get Help
            </Button>
          </div>
        )}
        <div aria-label="Toggle Code Completion" className="hint hint--left">
          <Toggle
            checked={isCompletionEnabled}
            setChecked={setIsCompletionEnabled}
          />
        </div>
      </div>
    </div>
  );
};

type Props = {
  disabled: boolean;
  isAutoPlayEnabled: boolean;
  isCompletionEnabled: boolean;
  isLoggedIn: boolean;
  lessonId: string;
  lessonSlug: string;
  nextLoader: boolean;
  setIsAutoPlayEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCompletionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  step: Step;
};

export default StepActions;
