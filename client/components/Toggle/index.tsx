import React from 'react';

const Toggle: React.FC<Props> = ({ checked, setChecked }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        checked={checked}
        className="peer sr-only"
        onChange={() => setChecked((prev) => !prev)}
        type="checkbox"
        value=""
      />
      <div className="peer h-3 w-6 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-2 after:w-2 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:left-[14px] peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );
};

type Props = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default Toggle;
