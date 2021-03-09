import { Menu, Transition } from '@headlessui/react';
import React, { useState } from 'react';

import Icon from '👨‍💻components/Icon';

const Label: React.FC<Props> = () => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div>
      <div
        className="flex items-center text-text-primary text-sm cursor-pointer"
        onClick={() => setShowOptions(!showOptions)}
        role="button"
      >
        Label <Icon className="text-text-primary ml-1" name="down-dir" />
      </div>
      <div className="relative z-10">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button
                aria-haspopup="true"
                className={`flex text-sm outline-none focus:outline-none`}
              >
                <span className="sr-only">Open lesson menu</span>
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={showOptions}
              >
                <div
                  aria-labelledby="session-menu"
                  aria-orientation="vertical"
                  className="origin-top-left bg-bg-primary absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5"
                  role="menu"
                >
                  <button
                    className="w-full inline-block text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-bg-primary"
                    role="menuitem"
                  >
                    <span>Beginner</span>
                  </button>
                  <button
                    className="w-full inline-block text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-bg-primary"
                    role="menuitem"
                  >
                    <span>Intermediate</span>
                  </button>
                  <button
                    className="w-full inline-block text-left px-4 py-2 text-sm text-text-primary hover:bg-accent hover:text-bg-primary"
                    role="menuitem"
                  >
                    <span>Advanced</span>
                  </button>
                </div>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

type Props = {};

export default Label;
